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
  const [dinner, setDinner] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('florae_dinner') || 'null');
      return saved || DEFAULT_DINNER;
    } catch { return DEFAULT_DINNER; }
  });
  const [devNavOpen, setDevNavOpenRaw] = React.useState(() => {
    const saved = localStorage.getItem('florae_dev_nav');
    if (saved !== null) return saved === '1';
    return typeof window !== 'undefined' && window.innerWidth >= 900;
  });

  const setDevNavOpen = (value) => {
    setDevNavOpenRaw(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      localStorage.setItem('florae_dev_nav', next ? '1' : '0');
      return next;
    });
  };

  const setScreenId = (id) => {
    if (VALID_SCREENS.has(id)) setScreenIdRaw(id);
    else setScreenIdRaw(localStorage.getItem('florae_onboarded') === '1' ? 'today' : 'splash');
  };

  React.useEffect(() => { localStorage.setItem('florae_screen', screenId); }, [screenId]);
  React.useEffect(() => { localStorage.setItem('florae_dinner', JSON.stringify(dinner)); }, [dinner]);

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

  const openReplace = () => setReplaceOpen(true);

  const applyReplacement = (recipe) => {
    setDinner({ id: recipe.id, title: recipe.title, kcal: recipe.kcal });
    setReplaceOpen(false);
    setSheet(null);
  };

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
        onOpenMeal={() => setSheet('meal')}
        onOpenWorkout={() => goto('workout-overview')}
        onOpenBeauty={() => goto('beauty')}/>;
      case 'meals': return <MealsScreen t={t}
        dinnerTitle={dinner.title}
        dinnerKcal={dinner.kcal}
        onOpenRecipe={() => goto('recipe')}
        onReplaceDinner={openReplace}/>;
      case 'recipe': return <RecipeScreen t={t}
        title={dinner.title}
        onBack={() => goto('meals')}
        onDone={completeTask}
        onReplace={openReplace}/>;
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
      {devNavOpen && (
        <>
          <div className="dev-nav-backdrop" onClick={() => setDevNavOpen(false)}/>
          <DevNav
            screenId={screenId}
            setScreenId={goto}
            onClose={() => setDevNavOpen(false)}
            onOpenSheet={() => { setSheet('meal'); setReplaceOpen(false); }}
            onOpenReplace={() => { setReplaceOpen(true); setSheet(null); }}
            onOpenReward={() => { setReward(true); setSheet(null); setReplaceOpen(false); }}
          />
        </>
      )}

      <div className="dev-layout__main">
        <button
          type="button"
          className="dev-nav-toggle"
          onClick={() => setDevNavOpen(v => !v)}
          aria-expanded={devNavOpen}
        >
          ☰ Экраны
        </button>

        <AppShell t={t}>
          <div className="app-screen">
            {renderScreen()}
            {sheet === 'meal' && (
              <MealSheet t={t}
                mealTitle={dinner.title}
                onClose={() => setSheet(null)}
                onDone={completeTask}
                onReplace={openReplace}/>
            )}
            {replaceOpen && (
              <ReplaceMealSheet t={t}
                currentTitle={dinner.title}
                currentId={dinner.id}
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
