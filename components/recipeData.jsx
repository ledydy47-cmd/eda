// Загрузка и нормализация рецептов из JSON

const BREAKFAST_BATCH_URL = 'data/breakfast_regular_300kcal_batch_01.json';

const DEFAULT_BREAKFAST_ID = 'breakfast_regular_300kcal_001';

const RECIPE_IMAGES = {
  breakfast_regular_300kcal_001: 'assets/recipes/breakfast-omelet-pepper.png',
};

function enrichRecipe(recipe) {
  return {
    ...recipe,
    image: recipe.image || RECIPE_IMAGES[recipe.id] || null,
  };
}

function getRecipeTone(recipe) {
  if (recipe.is_hot) return 'warm';
  if ((recipe.tags || []).some(t => /холод/i.test(t))) return 'green';
  return 'coral';
}

function mealTypeLabel(mealType) {
  if (mealType === 'завтрак') return 'Завтрак';
  if (mealType === 'обед') return 'Обед';
  if (mealType === 'ужин') return 'Ужин';
  if (mealType === 'перекус') return 'Перекус';
  return mealType || 'Блюдо';
}

function recipeToListItem(recipe) {
  return {
    id: recipe.id,
    title: recipe.name,
    kcal: recipe.calories,
    time: `${recipe.prep_time_min} мин`,
    tone: getRecipeTone(recipe),
    tag: mealTypeLabel(recipe.meal_type),
    prep_time_min: recipe.prep_time_min,
    meal_type: recipe.meal_type,
    image: recipe.image || RECIPE_IMAGES[recipe.id] || null,
  };
}

function formatIngredientAmount(ing, portions = 1) {
  if (!ing.amount) return 'по вкусу';
  const amount = ing.amount * portions;
  const value = Number.isInteger(amount) ? amount : Math.round(amount * 10) / 10;
  return `${value} ${ing.unit}`;
}

function getDislikedRecipes() {
  try { return JSON.parse(localStorage.getItem('florae_disliked_recipes') || '[]'); }
  catch { return []; }
}

function addDislikedRecipe(id) {
  const list = getDislikedRecipes();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem('florae_disliked_recipes', JSON.stringify(list));
  }
}

function getAvailableAlternatives(pool, excludeId) {
  const disliked = new Set(getDislikedRecipes());
  if (excludeId) disliked.add(excludeId);
  return pool.filter(r => !disliked.has(r.id));
}

function findRecipeById(recipes, id) {
  return recipes.find(r => r.id === id) || null;
}

function loadBreakfastRecipes() {
  return fetch(BREAKFAST_BATCH_URL)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => (data.recipes || []).map(enrichRecipe));
}

function getStoredMealSelection(key, defaultId) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && saved.id) return saved;
  } catch { /* ignore */ }
  return { id: defaultId };
}

function saveMealSelection(key, recipe) {
  localStorage.setItem(key, JSON.stringify({
    id: recipe.id,
    title: recipe.name || recipe.title,
    kcal: recipe.calories || recipe.kcal,
  }));
}

function getFavoriteRecipes() {
  try { return JSON.parse(localStorage.getItem('florae_favorite_recipes') || '[]'); }
  catch { return []; }
}

function isFavoriteRecipe(id) {
  return getFavoriteRecipes().some(r => r.id === id);
}

function toggleFavoriteRecipe(recipe) {
  const list = getFavoriteRecipes();
  const idx = list.findIndex(r => r.id === recipe.id);
  if (idx >= 0) list.splice(idx, 1);
  else {
    list.push({
      id: recipe.id,
      title: recipe.name || recipe.title,
      kcal: recipe.calories || recipe.kcal,
      meal_type: recipe.meal_type,
      image: recipe.image || RECIPE_IMAGES[recipe.id] || null,
    });
  }
  localStorage.setItem('florae_favorite_recipes', JSON.stringify(list));
  return idx < 0;
}

const DEFAULT_MEALS_DONE = {
  breakfast: true,
  l: true,
  s: false,
  d: false,
};

function getMealsDoneState() {
  try {
    const saved = JSON.parse(localStorage.getItem('florae_meals_done') || 'null');
    if (saved && typeof saved === 'object') return { ...DEFAULT_MEALS_DONE, ...saved };
  } catch { /* ignore */ }
  return { ...DEFAULT_MEALS_DONE };
}

function saveMealsDoneState(state) {
  localStorage.setItem('florae_meals_done', JSON.stringify(state));
}

window.RecipeData = {
  BREAKFAST_BATCH_URL,
  DEFAULT_BREAKFAST_ID,
  getRecipeTone,
  mealTypeLabel,
  recipeToListItem,
  formatIngredientAmount,
  getDislikedRecipes,
  addDislikedRecipe,
  getAvailableAlternatives,
  findRecipeById,
  loadBreakfastRecipes,
  getStoredMealSelection,
  saveMealSelection,
  getFavoriteRecipes,
  isFavoriteRecipe,
  toggleFavoriteRecipe,
  getMealsDoneState,
  saveMealsDoneState,
  DEFAULT_MEALS_DONE,
};
