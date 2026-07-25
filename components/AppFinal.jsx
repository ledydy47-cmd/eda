// florae — полноценное мобильное веб-приложение

const VALID_SCREENS = new Set([
  'splash', 'slider1', 'slider2', 'slider3',
  'goal', 'zones', 'stats', 'activity', 'restrictions', 'blacklist',
  'plan-gen', 'paywall', 'signup',
  'today', 'meals', 'recipe', 'workout-overview', 'workout',
  'beauty', 'profile', 'awards',
]);

const MAIN_TAB_SCREENS = ['today', 'meals', 'workout-overview', 'beauty', 'profile'];

function getInitialScreen() {
  const onboarded = localStorage.getItem('florae_onboarded') === '1';
  const saved = localStorage.getItem('florae_screen');

  if (saved && VALID_SCREENS.has(saved)) {
    if (onboarded && saved === 'splash') return 'today';
    return saved;
  }

  if (saved) localStorage.removeItem('florae_screen');
  return onboarded ? 'today' : 'splash';
}

function FloraeApp() {
  const t = THEMES.playful;
  const [screenId, setScreenIdRaw] = React.useState(getInitialScreen);
  const [sheet, setSheet] = React.useState(null);
  const [reward, setReward] = React.useState(false);
  const [replaceOpen, setReplaceOpen] = React.useState(false);
  const [replaceMealKey, setReplaceMealKey] = React.useState('breakfast');
  const [catalogOpen, setCatalogOpen] = React.useState(false);
  const [catalogMealKey, setCatalogMealKey] = React.useState('breakfast');
  const [previewRecipe, setPreviewRecipe] = React.useState(null);
  const [activeRecipeKey, setActiveRecipeKey] = React.useState('breakfast');
  const [breakfastRecipes, setBreakfastRecipes] = React.useState([]);
  const [recipesLoading, setRecipesLoading] = React.useState(true);
  const [recipesError, setRecipesError] = React.useState(null);
  const [mealSelections, setMealSelections] = React.useState(() => RecipeData.getAllMealSelections());
  const [mealsDone, setMealsDone] = React.useState(() => RecipeData.getMealsDoneState());

  const setScreenId = (id) => {
    if (VALID_SCREENS.has(id)) setScreenIdRaw(id);
    else setScreenIdRaw(localStorage.getItem('florae_onboarded') === '1' ? 'today' : 'splash');
  };

  React.useEffect(() => { localStorage.setItem('florae_screen', screenId); }, [screenId]);

  React.useEffect(() => {
    RecipeData.loadBreakfastRecipes()
      .then(recipes => {
        setBreakfastRecipes(recipes);
        setRecipesError(null);
        setMealSelections(prev => {
          if (recipes.some(r => r.id === prev.breakfast.id)) return prev;
          const fallback = recipes[0];
          if (!fallback) return prev;
          return {
            ...prev,
            breakfast: {
              id: fallback.id,
              title: fallback.name,
              kcal: fallback.calories,
            },
          };
        });
      })
      .catch(err => setRecipesError(err.message || 'Не удалось загрузить рецепты'))
      .finally(() => setRecipesLoading(false));
  }, []);

  const breakfastPool = React.useMemo(
    () => breakfastRecipes.map(RecipeData.recipeToListItem),
    [breakfastRecipes]
  );

  const breakfastRecipeFull = React.useMemo(
    () => RecipeData.findRecipeById(breakfastRecipes, mealSelections.breakfast.id) || breakfastRecipes[0] || null,
    [breakfastRecipes, mealSelections.breakfast.id]
  );

  const dayMeals = React.useMemo(
    () => RecipeData.buildDayMeals(mealSelections, breakfastRecipeFull),
    [mealSelections, breakfastRecipeFull]
  );

  const nextMealKey = React.useMemo(
    () => RecipeData.getNextMealKey(mealsDone) || 'breakfast',
    [mealsDone]
  );

  const nextMeal = React.useMemo(
    () => dayMeals.find(m => m.mealKey === nextMealKey) || dayMeals[0],
    [dayMeals, nextMealKey]
  );

  const activeRecipe = React.useMemo(
    () => previewRecipe || RecipeData.selectionToRecipe(activeRecipeKey, mealSelections[activeRecipeKey], breakfastRecipeFull),
    [previewRecipe, activeRecipeKey, mealSelections, breakfastRecipeFull]
  );

  const sheetRecipe = React.useMemo(
    () => RecipeData.selectionToRecipe(activeRecipeKey, mealSelections[activeRecipeKey], breakfastRecipeFull),
    [activeRecipeKey, mealSelections, breakfastRecipeFull]
  );

  const goto = id => setScreenId(id);
  const isMainTab = MAIN_TAB_SCREENS.includes(screenId);
  const tabValue = screenId === 'workout-overview' ? 'workout' :
                   screenId === 'workout' ? 'workout' :
                   screenId === 'recipe' ? 'meals' : screenId;

  const handleTabChange = (id) => {
    if (id === 'workout') goto('workout-overview');
    else goto(id);
  };

  const finishOnboarding = () => {
    localStorage.setItem('florae_onboarded', '1');
    goto('today');
  };

  const skipToApp = () => {
    localStorage.setItem('florae_onboarded', '1');
    goto('today');
  };

  const completeTask = () => {
    setSheet(null);
    setReward(true);
    setTimeout(() => setReward(false), 3800);
  };

  const toggleMealDone = (mealKey) => {
    setMealsDone(prev => {
      const next = { ...prev, [mealKey]: !prev[mealKey] };
      RecipeData.saveMealsDoneState(next);
      return next;
    });
  };

  const openReplace = (mealKey) => {
    setReplaceMealKey(mealKey);
    setReplaceOpen(true);
  };

  const openCatalog = (mealKey) => {
    setCatalogMealKey(mealKey);
    setCatalogOpen(true);
    setReplaceOpen(false);
  };

  const openRecipe = (mealKey) => {
    setPreviewRecipe(null);
    setActiveRecipeKey(mealKey);
    goto('recipe');
  };

  const openRecipePreview = (listItem) => {
    if (catalogMealKey === 'breakfast') {
      const full = RecipeData.findRecipeById(breakfastRecipes, listItem.id);
      if (full) {
        setPreviewRecipe(full);
        setActiveRecipeKey('breakfast');
        setCatalogOpen(false);
        goto('recipe');
      }
      return;
    }
    openRecipe(catalogMealKey);
  };

  const handleRecipeBack = () => {
    setPreviewRecipe(null);
    goto('meals');
  };

  const openMealSheet = (mealKey) => {
    setActiveRecipeKey(mealKey);
    setSheet('meal');
  };

  const applyReplacement = (recipe) => {
    const mealKey = replaceMealKey || catalogMealKey;
    const poolItem = RecipeData.findPoolItem(mealKey, recipe.id, breakfastPool);
    setMealSelections(prev => {
      const next = {
        ...prev,
        [mealKey]: {
          id: recipe.id,
          title: recipe.title,
          kcal: recipe.kcal,
        },
      };
      RecipeData.saveMealSelectionByKey(mealKey, {
        id: recipe.id,
        name: recipe.title,
        title: recipe.title,
        calories: recipe.kcal,
        kcal: recipe.kcal,
        protein_g: poolItem?.protein_g,
        fat_g: poolItem?.fat_g,
        carbs_g: poolItem?.carbs_g,
      });
      return next;
    });
    setPreviewRecipe(null);
    setReplaceOpen(false);
    setCatalogOpen(false);
    setSheet(null);
  };

  const applyCatalogSelection = (recipe) => {
    setReplaceMealKey(catalogMealKey);
    applyReplacement(recipe);
  };

  React.useEffect(() => {
    if (breakfastRecipeFull) {
      RecipeData.saveMealSelectionByKey('breakfast', breakfastRecipeFull);
    }
  }, [breakfastRecipeFull?.id]);

  const replacePool = RecipeData.getReplacePool(replaceMealKey, breakfastPool);
  const catalogPool = RecipeData.getReplacePool(catalogMealKey, breakfastPool);
  const replaceCurrentId = mealSelections[replaceMealKey]?.id;
  const replaceCurrentTitle = dayMeals.find(m => m.mealKey === replaceMealKey)?.title || '';
  const replaceMealLabel = RecipeData.getMealLabel(replaceMealKey);
  const mealsDoneCount = RecipeData.MEAL_ORDER.filter(k => mealsDone[k]).length;

  const renderScreen = () => {
    switch (screenId) {
      case 'splash': return <SplashScreen t={t} onNext={() => goto('slider1')} onLogin={skipToApp}/>;
      case 'slider1': return <ValueSliderScreen t={t} slideIndex={0} onSlideChange={i => goto(`slider${i+1}`)} onNext={() => goto('goal')}/>;
      case 'slider2': return <ValueSliderScreen t={t} slideIndex={1} onSlideChange={i => goto(`slider${i+1}`)} onNext={() => goto('goal')}/>;
      case 'slider3': return <ValueSliderScreen t={t} slideIndex={2} onSlideChange={i => goto(`slider${i+1}`)} onNext={() => goto('goal')}/>;
      case 'goal': return <GoalSelectScreen t={t} onNext={() => goto('zones')} onBack={() => goto('slider3')}/>;
      case 'zones': return <ZonesScreen t={t} onNext={() => goto('stats')} onBack={() => goto('goal')}/>;
      case 'stats': return <StatsScreen t={t} onNext={() => goto('activity')} onBack={() => goto('zones')}/>;
      case 'activity': return <ActivityScreen t={t} onNext={() => goto('restrictions')} onBack={() => goto('stats')}/>;
      case 'restrictions': return <RestrictionsScreen t={t} onNext={() => goto('blacklist')} onBack={() => goto('activity')}/>;
      case 'blacklist': return <BlacklistScreen t={t} onNext={() => goto('plan-gen')} onBack={() => goto('restrictions')}/>;
      case 'plan-gen': return <PlanGenerationScreen t={t} onNext={() => goto('paywall')}/>;
      case 'paywall': return <PaywallScreen t={t} onNext={() => goto('signup')} onBack={() => goto('plan-gen')}/>;
      case 'signup': return <SignupScreen t={t} onNext={finishOnboarding} onBack={() => goto('paywall')}/>;
      case 'today': return <TodayScreen t={t}
        nextMeal={nextMeal}
        mealsDone={mealsDone}
        mealsDoneCount={mealsDoneCount}
        allMealsDone={!RecipeData.getNextMealKey(mealsDone)}
        onOpenMeal={() => openMealSheet(nextMealKey)}
        onOpenWorkout={() => goto('workout-overview')}
        onOpenBeauty={() => goto('beauty')}/>;
      case 'meals': return <MealsScreen t={t}
        dayMeals={dayMeals}
        mealsDone={mealsDone}
        breakfastLoading={recipesLoading}
        breakfastCount={breakfastRecipes.length}
        breakfastExpected={RecipeData.BREAKFAST_BATCH_EXPECTED}
        onToggleMealDone={toggleMealDone}
        onOpenRecipe={openRecipe}
        onReplaceMeal={openReplace}
        onBrowseMeals={openCatalog}/>;
      case 'recipe': return <RecipeScreen t={t}
        recipe={activeRecipe}
        onBack={handleRecipeBack}
        onDone={completeTask}
        onReplace={() => openReplace(activeRecipeKey)}/>;
      case 'workout-overview': return <WorkoutOverviewScreen t={t} onStart={() => goto('workout')} onBack={() => goto('today')}/>;
      case 'workout': return <WorkoutScreen t={t} onBack={() => goto('workout-overview')} onDone={completeTask}/>;
      case 'beauty': return <BeautyScreen t={t}/>;
      case 'profile': return <ProfileScreen t={t} onOpenAwards={() => goto('awards')}/>;
      case 'awards': return <AwardsScreen t={t} onBack={() => goto('profile')}/>;
      default: return <SplashScreen t={t} onNext={() => goto('slider1')} onLogin={skipToApp}/>;
    }
  };

  return (
    <div className="dev-layout">
      <DevNav
        screenId={screenId}
        setScreenId={goto}
        onOpenSheet={() => { openMealSheet('d'); setReplaceOpen(false); }}
        onOpenReplace={() => { setReplaceMealKey('d'); setReplaceOpen(true); setSheet(null); }}
        onOpenReward={() => { setReward(true); setSheet(null); setReplaceOpen(false); }}
      />

      <div className="dev-layout__main">
        <AppShell t={t}>
          <div className="app-screen">
            {recipesError && screenId === 'meals' && (
              <div style={{
                padding: '8px 16px', background: t.accentSoft, color: t.text,
                fontSize: 12, textAlign: 'center', borderBottom: `1px solid ${t.border}`,
              }}>
                {recipesError}
              </div>
            )}
            {renderScreen()}
            {sheet === 'meal' && (
              <MealSheet t={t}
                recipe={sheetRecipe}
                onClose={() => setSheet(null)}
                onDone={() => { toggleMealDone(activeRecipeKey); completeTask(); }}
                onReplace={() => openReplace(activeRecipeKey)}
                onOpenFullRecipe={() => { setSheet(null); goto('recipe'); }}/>
            )}
            {replaceOpen && (
              <ReplaceMealSheet t={t}
                currentTitle={replaceCurrentTitle}
                currentId={replaceCurrentId}
                pool={replacePool}
                mealLabel={replaceMealLabel}
                onClose={() => setReplaceOpen(false)}
                onSelect={applyReplacement}
                onBrowseAll={replaceMealKey === 'breakfast' ? () => openCatalog('breakfast') : undefined}/>
            )}
            {catalogOpen && (
              <MealCatalogSheet t={t}
                pool={catalogPool}
                mealLabel={RecipeData.getMealLabel(catalogMealKey)}
                currentId={mealSelections[catalogMealKey]?.id}
                onClose={() => setCatalogOpen(false)}
                onPreview={openRecipePreview}
                onSelect={applyCatalogSelection}/>
            )}
            {reward && <RewardOverlay t={t} onClose={() => setReward(false)}/>}
          </div>
          {isMainTab && <TabBar t={t} active={tabValue} onChange={handleTabChange}/>}
        </AppShell>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding: 24, textAlign: 'center', fontFamily: 'Inter, sans-serif'}}>
          <p style={{fontWeight: 600, marginBottom: 8}}>Не удалось загрузить приложение</p>
          <p style={{fontSize: 14, color: '#666', marginBottom: 16}}>Обновите страницу или очистите кэш браузера.</p>
          <button onClick={() => { localStorage.clear(); location.reload(); }} style={{
            padding: '12px 24px', borderRadius: 999, border: 'none',
            background: 'oklch(68% 0.18 25)', color: '#fff', fontWeight: 600,
          }}>Сбросить и перезагрузить</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><FloraeApp/></ErrorBoundary>);
