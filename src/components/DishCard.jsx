import { useState } from "react";
import { Heart, Meh, ThumbsDown, Clock, Pencil, Trash2, X, Check } from "lucide-react";
import { db } from "../firebase/config";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

function DishCard({ dish }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(dish.name);
  const [tags, setTags] = useState(dish.tags ? dish.tags.join(", ") : "");
  const [rating, setRating] = useState(dish.rating);
  const [saving, setSaving] = useState(false);

  const ratingConfig = {
    Loved: { style: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", Icon: Heart },
    Okay: { style: "bg-amber-500/15 text-amber-600 dark:text-amber-400", Icon: Meh },
    Disliked: { style: "bg-red-500/15 text-red-600 dark:text-red-400", Icon: ThumbsDown },
  };
  const config = ratingConfig[dish.rating] || ratingConfig.Okay;
  const { Icon } = config;

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${dish.name}"? This can't be undone.`);
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, "dishes", dish.id));
    } catch (error) {
      console.error("Error deleting dish: ", error);
      alert("Something went wrong deleting this dish.");
    }
  };

  const handleSaveEdit = async () => {
    if (!name.trim()) {
      alert("Dish name can't be empty");
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "dishes", dish.id), {
        name: name.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        rating: rating,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating dish: ", error);
      alert("Something went wrong saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(dish.name);
    setTags(dish.tags ? dish.tags.join(", ") : "");
    setRating(dish.rating);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-emerald-500/40 rounded-2xl p-5 mb-3 transition-colors duration-300">
        <div className="mb-3">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
            Dish Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
            Main Ingredients
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="comma separated"
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 text-sm placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
            Rating
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["Loved", "Okay", "Disliked"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRating(option)}
                className={`py-2 rounded-lg text-xs font-semibold border transition-all duration-300 ${
                  rating === option
                    ? "bg-emerald-500 text-white dark:text-neutral-950 border-emerald-500"
                    : "bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white dark:text-neutral-950 font-bold text-sm py-2.5 rounded-lg transition-colors duration-300"
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-sm py-2.5 rounded-lg transition-colors duration-300"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 mb-3 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white capitalize">{dish.name}</h3>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${config.style}`}>
            <Icon className="w-3 h-3" strokeWidth={2.5} />
            {dish.rating}
          </span>
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300"
              aria-label="Edit dish"
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
              aria-label="Delete dish"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {dish.tags && dish.tags.length > 0 ? (
          dish.tags.map((tag) => (
            <span key={tag} className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-neutral-400 dark:text-neutral-600">No tags</span>
        )}
      </div>
      <p className="text-xs text-neutral-500 flex items-center gap-1.5">
        <Clock className="w-3 h-3" strokeWidth={2} />
        {dish.lastCooked ? `Last cooked ${dish.lastCooked}` : "Never cooked"}
      </p>
    </div>
  );
}

export default DishCard;