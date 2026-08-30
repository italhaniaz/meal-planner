import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Compass, X, Clock, ListChecks, Loader2, Globe2 } from "lucide-react";

// Maps common Pakistani/Urdu ingredient names to their English equivalents
// so we can search the recipe database correctly, while still showing
// the user's own word in the UI.
const INGREDIENT_TRANSLATIONS = {
  aloo: "potato",
  alu: "potato",
  gobi: "cauliflower",
  gobhi: "cauliflower",
  chawal: "rice",
  chaawal: "rice",
  daal: "lentils",
  dal: "lentils",
  dhaal: "lentils",
  murgh: "chicken",
  gosht: "beef",
  mutton: "lamb",
  piyaz: "onion",
  pyaz: "onion",
  tamatar: "tomato",
  adrak: "ginger",
  lehsan: "garlic",
  lahsan: "garlic",
  dhania: "coriander",
  "hara dhania": "coriander",
  palak: "spinach",
  karela: "bitter gourd",
  baingan: "eggplant",
  bengan: "eggplant",
  "shimla mirch": "bell pepper",
  mirch: "chili pepper",
  matar: "peas",
  mattar: "peas",
  mooli: "radish",
  kaddu: "pumpkin",
  bhindi: "okra",
  machli: "fish",
  machhli: "fish",
  ande: "egg",
  anda: "egg",
  doodh: "milk",
  dahi: "yogurt",
  paneer: "paneer",
  makai: "corn",
};

function translateTag(tag) {
  const clean = tag.toLowerCase().trim();
  return INGREDIENT_TRANSLATIONS[clean] || clean;
}

function RecipeDiscovery({ dishes }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealLoading, setMealLoading] = useState(false);
  const [error, setError] = useState("");

  const GENERIC_INGREDIENTS = new Set([
    "salt", "pepper", "oil", "water", "sugar", "black pepper",
    "cooking oil", "vegetable oil", "olive oil", "spices", "seasoning",
  ]);

  const uniqueTags = useMemo(() => {
    const tagScores = {};
    dishes.forEach((dish) => {
      if (dish.rating === "Disliked") return;
      const weight = dish.rating === "Loved" ? 3 : 1;
      (dish.tags || []).forEach((rawTag) => {
        const tag = rawTag.toLowerCase().trim();
        if (!tag || GENERIC_INGREDIENTS.has(tag)) return;
        tagScores[tag] = (tagScores[tag] || 0) + weight;
      });
    });
    return Object.entries(tagScores)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [dishes]);

  // Lock page scroll while the recipe modal is open
  useEffect(() => {
    document.body.style.overflow = selectedMeal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMeal]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const runSearch = async () => {
    if (selectedTags.length === 0) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const englishTags = selectedTags.map(translateTag);

      const responses = await Promise.all(
        englishTags.map((tag) =>
          fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(tag)}`
          ).then((res) => res.json())
        )
      );

      const mealLists = responses.map((r) => r.meals || []);

      if (mealLists.some((list) => list.length === 0)) {
        // If any single ingredient has zero matches, intersection is empty —
        // fall back to the union instead, so the user still sees something.
        const seen = new Map();
        mealLists.flat().forEach((meal) => seen.set(meal.idMeal, meal));
        setResults(Array.from(seen.values()));
      } else {
        // Intersect: only meals that appear in every selected ingredient's results
        const idCounts = new Map();
        mealLists.flat().forEach((meal) => {
          idCounts.set(meal.idMeal, (idCounts.get(meal.idMeal) || 0) + 1);
        });
        const intersected = mealLists[0].filter(
          (meal) => idCounts.get(meal.idMeal) === mealLists.length
        );
        setResults(intersected.length > 0 ? intersected : mealLists.flat());
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't load recipes right now. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTags.length > 0) {
      runSearch();
    } else {
      setResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags]);

  const openRecipe = async (mealId) => {
    setMealLoading(true);
    setSelectedMeal({ id: mealId });
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      const data = await res.json();
      setSelectedMeal(data.meals ? data.meals[0] : null);
    } catch (err) {
      console.error(err);
      setSelectedMeal(null);
    } finally {
      setMealLoading(false);
    }
  };

  const getIngredientList = (meal) => {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        list.push(`${measure ? measure.trim() : ""} ${ing.trim()}`.trim());
      }
    }
    return list;
  };

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <Compass className="w-4 h-4 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
        </span>
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Discover New Recipes</h2>
          <p className="text-xs text-neutral-500">Based on ingredients you already cook with</p>
        </div>
      </div>

      {uniqueTags.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
          <p className="text-neutral-500 text-sm">
            Add some dishes with ingredients first — we'll use those to find new recipes.
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap mb-2">
            {uniqueTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const translated = translateTag(tag);
              const showsTranslation = translated !== tag;
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold capitalize border transition-all duration-300 ${
                    isSelected
                      ? "bg-emerald-500 text-white dark:text-neutral-950 border-emerald-500"
                      : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50"
                  }`}
                  title={showsTranslation ? `Searches as "${translated}"` : undefined}
                >
                  {tag}
                  {showsTranslation && (
                    <Globe2 className="w-3 h-3 opacity-60" strokeWidth={2} />
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-neutral-500 mb-6">
            {selectedTags.length > 1
              ? `Combining ${selectedTags.length} ingredients — tap a selected one to remove it`
              : "Ranked by ingredients from dishes you've marked \"Loved\". Tap more than one to combine."}
          </p>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-10 text-neutral-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Finding recipes...</span>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center py-6">{error}</p>}

          {!loading && selectedTags.length > 0 && results.length === 0 && !error && (
            <p className="text-neutral-500 text-sm text-center py-6">
              No recipes found for that combination. Try different ingredients.
            </p>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {results.map((meal, index) => (
                <button
                  key={meal.idMeal}
                  onClick={() => openRecipe(meal.idMeal)}
                  className="group text-left bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 p-2.5 line-clamp-2">
                    {meal.strMeal}
                  </p>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selectedMeal && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedMeal(null)}
        >
          <div
            className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {mealLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              </div>
            ) : selectedMeal.strMeal ? (
              <>
                <div className="relative">
                  <img
                    src={selectedMeal.strMealThumb}
                    alt={selectedMeal.strMeal}
                    className="w-full h-52 object-cover rounded-t-3xl"
                  />
                  <button
                    onClick={() => setSelectedMeal(null)}
                    className="absolute top-3 right-3 w-8 h-8 inline-flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-1">
                    {selectedMeal.strMeal}
                  </h3>
                  {selectedMeal.strArea && (
                    <p className="text-xs text-neutral-500 mb-5">{selectedMeal.strArea} cuisine</p>
                  )}

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                    <ListChecks className="w-3.5 h-3.5" strokeWidth={2.25} />
                    Ingredients
                  </div>
                  <ul className="grid grid-cols-2 gap-1.5 mb-6">
                    {getIngredientList(selectedMeal).map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 rounded-lg px-2.5 py-1.5"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                    <Clock className="w-3.5 h-3.5" strokeWidth={2.25} />
                    Instructions
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                    {selectedMeal.strInstructions}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-center py-20 text-neutral-500 text-sm">
                Couldn't load this recipe. Try another one.
              </p>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default RecipeDiscovery;