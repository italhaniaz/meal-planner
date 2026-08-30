import DishCard from "./DishCard";

function DishList({ dishes }) {
  return (
    <div>
      <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-4">
        Saved Dishes ({dishes.length})
      </h2>
      {dishes.length === 0 && (
        <div className="text-center py-10 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
          <p className="text-neutral-500 text-sm">No dishes added yet — add your first one above 👆</p>
        </div>
      )}
      {dishes.map((dish, index) => (
        <div key={dish.id} className="animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
          <DishCard dish={dish} />
        </div>
      ))}
    </div>
  );
}

export default DishList;