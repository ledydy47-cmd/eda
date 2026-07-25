// Загрузка и нормализация рецептов из JSON

const BREAKFAST_BATCH_URL = 'data/breakfast_regular_300kcal_batch_01.json';

const DEFAULT_BREAKFAST_ID = 'breakfast_regular_300kcal_001';

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
    .then(data => data.recipes || []);
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
};
