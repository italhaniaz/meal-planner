// This function picks today's suggested dish from a list of dishes
export function suggestDish(dishes) {
  if (!dishes || dishes.length === 0) {
    return null;
  }

  // Step 1: Only consider dishes the kids actually like (skip "Disliked")
  const likedDishes = dishes.filter((dish) => dish.rating !== "Disliked");

  if (likedDishes.length === 0) {
    return null; // no good options available
  }

  // Step 2: Prefer dishes that haven't been cooked recently
  // Dishes never cooked (lastCooked === null) get top priority
  const sorted = [...likedDishes].sort((a, b) => {
    if (!a.lastCooked && !b.lastCooked) return 0;
    if (!a.lastCooked) return -1; // a wins (never cooked)
    if (!b.lastCooked) return 1;  // b wins (never cooked)
    return new Date(a.lastCooked) - new Date(b.lastCooked); // oldest first
  });

  // Step 3: Among the "not recently cooked" group, prefer "Loved" over "Okay"
  const topCandidates = sorted.slice(0, 3); // look at the 3 least-recently-cooked
  const loved = topCandidates.find((d) => d.rating === "Loved");

  return loved || topCandidates[0];
}

// This function finds dishes "similar" to a given dish, based on shared tags
export function findSimilarDishes(targetDish, allDishes) {
  if (!targetDish || !targetDish.tags || targetDish.tags.length === 0) {
    return [];
  }

  return allDishes
    .filter((dish) => dish.id !== targetDish.id) // exclude itself
    .map((dish) => {
      const sharedTags = dish.tags.filter((tag) =>
        targetDish.tags.includes(tag)
      );
      return { ...dish, matchCount: sharedTags.length };
    })
    .filter((dish) => dish.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount) // most shared tags first
    .slice(0, 3); // top 3 matches
}