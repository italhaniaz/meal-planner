import { suggestDish, findSimilarDishes } from "../utils/suggestLogic";
import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { Sparkles, Check, Heart } from "lucide-react";
import { useState } from "react";

function TodaySuggestion({ dishes }) {
  const todayPick = suggestDish(dishes);
  const similarDishes = todayPick ? findSimilarDishes(todayPick, dishes) : [];
  const [saving, setSaving] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const alreadyCookedToday = todayPick?.lastCooked === todayStr;

  const handleMarkCooked = async () => {
    if (!todayPick || alreadyCookedToday) return;
    setSaving(true);
    try {
      const dishRef = doc(db, "dishes", todayPick.id);
      await updateDoc(dishRef, { lastCooked: todayStr });
    } catch (error) {
      console.error("Error updating dish: ", error);
      alert("Something went wrong. Check the console.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 p-[1px] mb-8 shadow-2xl shadow-emerald-500/10 transition-colors duration-300 hover:shadow-emerald-500/20 hover:shadow-2xl">
      <div className="rounded-3xl bg-white dark:bg-neutral-900 p-7 relative overflow-hidden text-center transition-colors duration-300">
        <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="relative flex items-center justify-center gap-2 mb-5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/15 animate-soft-pulse">
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" strokeWidth={2} />
          </span>
          <p className="uppercase text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
            Today's Suggestion
          </p>
        </div>

        {todayPick ? (
          <div key={todayPick.id} className="relative animate-fade-up">
            <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 capitalize">
              {todayPick.name}
            </p>
            <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-6">
              <Heart className="w-3 h-3" strokeWidth={2.5} fill="currentColor" />
              {todayPick.rating}
            </span>

            <div className="flex justify-center">
              <button
                onClick={handleMarkCooked}
                disabled={saving || alreadyCookedToday}
                className={`inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg ${
                  alreadyCookedToday
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-none cursor-default"
                    : "bg-emerald-500 hover:bg-emerald-400 text-white dark:text-neutral-950 shadow-emerald-500/20"
                }`}
              >
                <Check className="w-4 h-4" strokeWidth={3} />
                {alreadyCookedToday
                  ? "Cooked Today ✓"
                  : saving
                  ? "Saving..."
                  : "Mark as Cooked Today"}
              </button>
            </div>

            {alreadyCookedToday && (
              <p className="text-xs text-neutral-500 mt-3">
                This is still your best pick for today — check back tomorrow for a fresh suggestion.
              </p>
            )}

            {similarDishes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Kids might also like
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {similarDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-full px-3.5 py-1.5 text-sm capitalize hover:border-emerald-500/50 transition-colors duration-300"
                    >
                      {dish.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-neutral-500 italic relative">
            No dishes available yet. Add some dishes to get a suggestion!
          </p>
        )}
      </div>
    </div>
  );
}

export default TodaySuggestion;