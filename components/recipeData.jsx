// Загрузка и нормализация рецептов из JSON

const BREAKFAST_BATCH_URL = 'data/breakfast_regular_300kcal_batch_01.json';

const MEAL_ORDER = ['breakfast', 'l', 's', 'd'];

const MEAL_META = {
  breakfast: { time: '08:00', tag: 'Завтрак', meal_type: 'завтрак' },
  l: { time: '13:30', tag: 'Обед', meal_type: 'обед' },
  s: { time: '16:00', tag: 'Перекус', meal_type: 'перекус' },
  d: { time: '19:00', tag: 'Ужин', meal_type: 'ужин' },
};

const MEAL_STORAGE_KEYS = {
  breakfast: 'florae_breakfast',
  l: 'florae_meal_l',
  s: 'florae_meal_s',
  d: 'florae_dinner',
};

const DEFAULT_MEALS = {
  breakfast: {
    id: 'breakfast_regular_300kcal_001',
    title: 'Пышный омлет с болгарским перцем и петрушкой',
    kcal: 310, protein_g: 21, fat_g: 22.3, carbs_g: 7.1,
    prep_time_min: 12, tone: 'warm', meal_type: 'завтрак',
  },
  l: {
    id: 'lunch-soup-quinoa',
    title: 'Куриный суп с киноа и зеленью',
    kcal: 350, protein_g: 28, fat_g: 10, carbs_g: 38,
    prep_time_min: 25, tone: 'green', meal_type: 'обед',
  },
  s: {
    id: 'snack-apple-almond',
    title: 'Яблоко и горсть миндаля',
    kcal: 150, protein_g: 4, fat_g: 10, carbs_g: 12,
    prep_time_min: 5, tone: 'coral', meal_type: 'перекус',
  },
  d: {
    id: 'chicken-broccoli',
    title: 'Куриная грудка с брокколи',
    kcal: 320, protein_g: 38, fat_g: 8, carbs_g: 12,
    prep_time_min: 25, tone: 'warm', meal_type: 'ужин',
  },
};

const LUNCH_REPLACE_POOL = [
  { id: 'lunch-soup-quinoa', title: 'Куриный суп с киноа и зеленью', kcal: 350, time: '25 мин', tone: 'green', tag: 'Обед', protein_g: 28, fat_g: 10, carbs_g: 38 },
  { id: 'lunch-turkey-salad', title: 'Салат с индейкой и авокадо', kcal: 340, time: '15 мин', tone: 'green', tag: 'Обед', protein_g: 32, fat_g: 14, carbs_g: 18 },
  { id: 'lunch-buckwheat-fish', title: 'Гречка с запечённой рыбой', kcal: 360, time: '30 мин', tone: 'warm', tag: 'Обед', protein_g: 30, fat_g: 9, carbs_g: 40 },
  { id: 'lunch-lentil-stew', title: 'Чечевичное рагу с овощами', kcal: 330, time: '20 мин', tone: 'coral', tag: 'Обед', protein_g: 18, fat_g: 8, carbs_g: 45 },
];

const SNACK_REPLACE_POOL = [
  { id: 'snack-apple-almond', title: 'Яблоко и горсть миндаля', kcal: 150, time: '5 мин', tone: 'coral', tag: 'Перекус', protein_g: 4, fat_g: 10, carbs_g: 12 },
  { id: 'snack-yogurt-berries', title: 'Йогурт с ягодами', kcal: 140, time: '3 мин', tone: 'green', tag: 'Перекус', protein_g: 12, fat_g: 4, carbs_g: 16 },
  { id: 'snack-cottage-fruit', title: 'Творог с фруктами', kcal: 160, time: '5 мин', tone: 'warm', tag: 'Перекус', protein_g: 16, fat_g: 5, carbs_g: 14 },
  { id: 'snack-hummus-veggies', title: 'Хумус с овощами', kcal: 145, time: '5 мин', tone: 'green', tag: 'Перекус', protein_g: 5, fat_g: 9, carbs_g: 11 },
];

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
    title: recipe.name || recipe.title,
    kcal: recipe.calories || recipe.kcal,
    protein_g: recipe.protein_g,
    fat_g: recipe.fat_g,
    carbs_g: recipe.carbs_g,
    time: recipe.time || (recipe.prep_time_min ? `${recipe.prep_time_min} мин` : '—'),
    prep_time_min: recipe.prep_time_min,
    tone: recipe.tone || getRecipeTone(recipe),
    tag: recipe.tag || mealTypeLabel(recipe.meal_type),
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
  breakfast: false,
  l: false,
  s: false,
  d: false,
};

function getAllMealSelections() {
  const result = {};
  for (const key of MEAL_ORDER) {
    result[key] = getStoredMealSelection(MEAL_STORAGE_KEYS[key], DEFAULT_MEALS[key].id);
  }
  return result;
}

function saveMealSelectionByKey(mealKey, recipe) {
  saveMealSelection(MEAL_STORAGE_KEYS[mealKey], recipe);
}

function listItemFromSelection(mealKey, selection, breakfastRecipeFull) {
  const meta = MEAL_META[mealKey];
  const fallback = DEFAULT_MEALS[mealKey];

  if (mealKey === 'breakfast' && breakfastRecipeFull && breakfastRecipeFull.id === selection.id) {
    const item = recipeToListItem(breakfastRecipeFull);
    return { ...item, mealKey, time: meta.time, canOpen: true };
  }

  const poolItem = findPoolItem(mealKey, selection.id, mealKey === 'breakfast' ? [] : null);
  const base = poolItem || fallback;

  return {
    mealKey,
    id: selection.id || base.id,
    title: selection.title || base.title,
    kcal: selection.kcal || base.kcal,
    protein_g: base.protein_g || 0,
    fat_g: base.fat_g || 0,
    carbs_g: base.carbs_g || 0,
    prepTime: base.time || (base.prep_time_min ? `${base.prep_time_min} мин` : '—'),
    prep_time_min: base.prep_time_min || 15,
    tone: base.tone || 'warm',
    tag: meta.tag,
    meal_type: meta.meal_type,
    time: meta.time,
    image: base.image || null,
    canOpen: mealKey === 'breakfast' || mealKey === 'd',
  };
}

function buildDayMeals(selections, breakfastRecipeFull) {
  return MEAL_ORDER.map(key =>
    listItemFromSelection(key, selections[key], breakfastRecipeFull)
  );
}

function sumDayNutrients(dayMeals, mealsDone, eatenOnly) {
  return dayMeals.reduce((acc, meal) => {
    if (eatenOnly && !mealsDone[meal.mealKey]) return acc;
    acc.kcal += meal.kcal || 0;
    acc.protein_g += meal.protein_g || 0;
    acc.fat_g += meal.fat_g || 0;
    acc.carbs_g += meal.carbs_g || 0;
    return acc;
  }, { kcal: 0, protein_g: 0, fat_g: 0, carbs_g: 0 });
}

function getNextMealKey(mealsDone) {
  return MEAL_ORDER.find(key => !mealsDone[key]) || null;
}

function findPoolItem(mealKey, id, breakfastPool) {
  const pool = getReplacePool(mealKey, breakfastPool || []);
  return pool.find(r => r.id === id) || null;
}

function getReplacePool(mealKey, breakfastPool) {
  if (mealKey === 'breakfast') return breakfastPool;
  if (mealKey === 'l') return LUNCH_REPLACE_POOL;
  if (mealKey === 's') return SNACK_REPLACE_POOL;
  if (mealKey === 'd') return window.DINNER_RECIPE_POOL || [];
  return [];
}

function getMealLabel(mealKey) {
  return (MEAL_META[mealKey]?.tag || 'Блюдо').toUpperCase();
}

function selectionToRecipe(mealKey, selection, breakfastRecipeFull) {
  if (mealKey === 'breakfast' && breakfastRecipeFull && breakfastRecipeFull.id === selection.id) {
    return breakfastRecipeFull;
  }
  if (mealKey === 'd') {
    return {
      ...window.DEFAULT_DINNER_RECIPE,
      id: selection.id,
      name: selection.title,
      calories: selection.kcal,
    };
  }
  const item = listItemFromSelection(mealKey, selection, breakfastRecipeFull);
  return {
    id: item.id,
    name: item.title,
    meal_type: item.meal_type,
    prep_time_min: item.prep_time_min,
    calories: item.kcal,
    protein_g: item.protein_g,
    fat_g: item.fat_g,
    carbs_g: item.carbs_g,
    image: item.image,
    is_hot: item.tone === 'warm',
    ingredients: [],
    steps: [],
  };
}

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
  DEFAULT_BREAKFAST_ID: 'breakfast_regular_300kcal_001',
  MEAL_ORDER,
  MEAL_META,
  MEAL_STORAGE_KEYS,
  DEFAULT_MEALS,
  LUNCH_REPLACE_POOL,
  SNACK_REPLACE_POOL,
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
  saveMealSelectionByKey,
  getAllMealSelections,
  buildDayMeals,
  sumDayNutrients,
  getNextMealKey,
  getReplacePool,
  getMealLabel,
  selectionToRecipe,
  findPoolItem,
  getFavoriteRecipes,
  isFavoriteRecipe,
  toggleFavoriteRecipe,
  getMealsDoneState,
  saveMealsDoneState,
  DEFAULT_MEALS_DONE,
};
