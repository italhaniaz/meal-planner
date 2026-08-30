import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Plus, UtensilsCrossed } from "lucide-react";

function DishForm({ userId }) {
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [rating, setRating] = useState("Loved");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a dish name");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "dishes"), {
        name: name.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        rating: rating,
        lastCooked: null,
        createdAt: serverTimestamp(),
        userId: userId,
      });
      setName("");
      setTags("");
      setRating("Loved");
    } catch (error) {
      console.error("Error adding dish: ", error);
      alert("Something went wrong. Check the console.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-7 mb-8 shadow-xl shadow-neutral-200/50 dark:shadow-black/30 transition-all duration-300"
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <UtensilsCrossed className="w-4 h-4 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
        </span>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Add a Dish</h2>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
          Dish Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Daal Chawal"
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
          Main Ingredients
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. potato, cauliflower, chicken"
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
        />
        <p className="text-xs text-neutral-500 mt-1.5">
          Just the 2-3 key ingredients that define the dish. Skip basics like salt, oil, or water — we use these to find similar recipes for you.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
          Kid's Rating
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["Loved", "Okay", "Disliked"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRating(option)}
              className={`py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                rating === option
                  ? "bg-emerald-500 text-white dark:text-neutral-950 border-emerald-500"
                  : "bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white dark:text-neutral-950 font-bold py-3 rounded-xl transition-colors duration-300 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        {saving ? "Saving..." : "Save Dish"}
      </button>
    </form>
  );
}

export default DishForm;