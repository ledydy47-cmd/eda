// florae — полноценное мобильное веб-приложение

const VALID_SCREENS = new Set([
  'splash', 'slider1', 'slider2', 'slider3',
  'goal', 'zones', 'stats', 'activity', 'restrictions', 'blacklist',
  'plan-gen', 'paywall', 'signup',
  'today', 'meals', 'recipe', 'workout-overview', 'workout',
  'beauty', 'profile', 'awards',
]);

const MAIN_TAB_SCREENS = ['today', 'meals', 'workout-overview', 'beauty', 'profile'];

const DEFAULT_DINNER = { id: 'chicken-broccoli', title: 'Куриная грудка с брокколи', kcal: 320 };

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
  const [replaceMealKey, setReplaceMealKey] = React.useState('d');
  const [activeRecipeKey, setActiveRecipeKey] = React.useState('d');
  const [breakfastRecipes, setBreakfastRecipes] = React.useState([]);
  const [recipesLoading, setRecipesLoading] = React.useState(true);
  const [recipesError, setRecipesError] = React.useState(null);
  const [breakfast, setBreakfast] = React.useState(() =>
    RecipeData.getStoredMealSelection('florae_breakfast', RecipeData.DEFAULT_BREAKFAST_ID)
  );
  const [dinner, setDinner] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('florae_dinner') || 'null');
      return saved || DEFAULT_DINNER;
    } catch { return DEFAULT_DINNER; }
  });

  const setScreenId = (id) => {
    if (VALID_SCREENS.has(id)) setScreenIdRaw(id);
    else setScreenIdRaw(localStorage.getItem('florae_onboarded') === '1' ? 'today' : 'splash');
  };

  React.useEffect(() => { localStorage.setItem('florae_screen', screenId); }, [screenId]);
  React.useEffect(() => { localStorage.setItem('florae_dinner', JSON.stringify(dinner)); }, [dinner]);
  React.useEffect(() => { localStorage.setItem('florae_breakfast', JSON.stringify(breakfast)); }, [breakfast]);

  React.useEffect(() => {
    RecipeData.loadBreakfastRecipes()
      .then(recipes => {
        setBreakfastRecipes(recipes);
        setRecipesError(null);
        setBreakfast(prev => {
          if (recipes.some(r => r.id === prev.id)) return prev;
          const fallback = recipes[0];
          return fallback ? RecipeData.recipeToListItem(fallback) : prev;
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
    () => RecipeData.findRecipeById(breakfastRecipes, breakfast.id) || breakfastRecipes[0] || null,
    [breakfastRecipes, breakfast.id]
  );

  const breakfastCard = React.useMemo(() => {
    if (breakfastRecipeFull) return RecipeData.recipeToListItem(breakfastRecipeFull);
    return breakfast.id ? breakfast : null;
  }, [breakfastRecipeFull, breakfast]);

  const dinnerRecipeFull = React.useMemo(() => ({
    ...DEFAULT_DINNER_RECIPE,
    name: dinner.title,
    calories: dinner.kcal,
  }), [dinner.title, dinner.kcal]);

  const activeRecipe = activeRecipeKey === 'breakfast'
    ? (breakfastRecipeFull || DEFAULT_DINNER_RECIPE)
    : dinnerRecipeFull;

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

  const openReplace = (mealKey = 'd') => {
    setReplaceMealKey(mealKey);
    setReplaceOpen(true);
  };

  const openRecipe = (mealKey = 'd') => {
    setActiveRecipeKey(mealKey);
    goto('recipe');
  };

  const applyReplacement = (recipe) => {
    if (replaceMealKey === 'breakfast') {
      setBreakfast({ id: recipe.id, title: recipe.title, kcal: recipe.kcal });
      const full = RecipeData.findRecipeById(breakfastRecipes, recipe.id);
      if (full) RecipeData.saveMealSelection('florae_breakfast', full);
    } else {
      setDinner({ id: recipe.id, title: recipe.title, kcal: recipe.kcal });
    }
    setReplaceOpen(false);
    setSheet(null);
  };

  React.useEffect(() => {
    if (breakfastRecipeFull) {
      RecipeData.saveMealSelection('florae_breakfast', breakfastRecipeFull);
    }
  }, [breakfastRecipeFull?.id]);

  const replacePool = replaceMealKey === 'breakfast' ? breakfastPool : DINNER_RECIPE_POOL;
  const replaceCurrentId = replaceMealKey === 'breakfast' ? breakfast.id : dinner.id;
  const replaceCurrentTitle = replaceMealKey === 'breakfast'
    ? (breakfastCard?.title || breakfast.title)
    : dinner.title;
  const replaceMealLabel = replaceMealKey === 'breakfast' ? 'ЗАВТРАК' : 'УЖИН';

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
        dinnerTitle={dinner.title}
        onOpenMeal={() => { setActiveRecipeKey('d'); setSheet('meal'); }}
        onOpenWorkout={() => goto('workout-overview')}
        onOpenBeauty={() => goto('beauty')}/>;
      case 'meals': return <MealsScreen t={t}
        breakfast={breakfastCard}
        breakfastLoading={recipesLoading}
        dinnerTitle={dinner.title}
        dinnerKcal={dinner.kcal}
        onOpenRecipe={openRecipe}
        onReplaceMeal={openReplace}/>;
      case 'recipe': return <RecipeScreen t={t}
        recipe={activeRecipe}
        onBack={() => goto('meals')}
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
        onOpenSheet={() => { setActiveRecipeKey('d'); setSheet('meal'); setReplaceOpen(false); }}
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
                recipe={activeRecipeKey === 'breakfast' ? (breakfastRecipeFull || DEFAULT_DINNER_RECIPE) : dinnerRecipeFull}
                onClose={() => setSheet(null)}
                onDone={completeTask}
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
                onSelect={applyReplacement}/>
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
