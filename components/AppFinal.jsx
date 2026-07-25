// florae — полноценное мобильное веб-приложение

const MAIN_TAB_SCREENS = ['today', 'meals', 'workout-overview', 'beauty', 'profile'];

function FloraeApp() {
  const t = THEMES.playful;
  const [screenId, setScreenId] = React.useState(() => {
    const saved = localStorage.getItem('florae_screen');
    const onboarded = localStorage.getItem('florae_onboarded') === '1';
    if (onboarded && (!saved || saved === 'splash')) return 'today';
    return saved || 'splash';
  });
  const [sheet, setSheet] = React.useState(null);
  const [reward, setReward] = React.useState(false);

  React.useEffect(() => { localStorage.setItem('florae_screen', screenId); }, [screenId]);

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

  const completeTask = () => {
    setSheet(null);
    setReward(true);
    setTimeout(() => setReward(false), 3800);
  };

  const renderScreen = () => {
    switch (screenId) {
      case 'splash': return <SplashScreen t={t} onNext={() => goto('slider1')}/>;
      case 'slider1': return <ValueSliderScreen t={t} slideIndex={0} onSlideChange={i => goto(`slider${i+1}`)} onNext={() => goto('goal')}/>;
      case 'slider2': return <ValueSliderScreen t={t} slideIndex={1} onSlideChange={i => goto(`slider${i+1}`)} onNext={() => goto('goal')}/>;
      case 'slider3': return <ValueSliderScreen t={t} slideIndex={2} onSlideChange={i => goto(`slider${i+1}`)} onNext={() => goto('goal')}/>;
      case 'goal': return <GoalSelectScreen t={t} onNext={() => goto('zones')} onBack={() => goto('slider3')}/>;
      case 'zones': return <ZonesScreen t={t} onNext={() => goto('stats')} onBack={() => goto('goal')}/>;
      case 'stats': return <StatsScreen t={t} onNext={() => goto('activity')} onBack={() => goto('zones')}/>;
      case 'activity': return <ActivityScreen t={t} onNext={() => goto('restrictions')} onBack={() => goto('stats')}/>;
      case 'restrictions': return <RestrictionsScreen t={t} onNext={() => goto('plan-gen')} onBack={() => goto('activity')}/>;
      case 'plan-gen': return <PlanGenerationScreen t={t} onNext={() => goto('paywall')}/>;
      case 'paywall': return <PaywallScreen t={t} onNext={() => goto('signup')} onBack={() => goto('plan-gen')}/>;
      case 'signup': return <SignupScreen t={t} onNext={finishOnboarding} onBack={() => goto('paywall')}/>;
      case 'today': return <TodayScreen t={t}
        onOpenMeal={() => setSheet('meal')}
        onOpenWorkout={() => goto('workout-overview')}
        onOpenBeauty={() => goto('beauty')}/>;
      case 'meals': return <MealsScreen t={t} onOpenRecipe={() => goto('recipe')}/>;
      case 'recipe': return <RecipeScreen t={t} onBack={() => goto('meals')} onDone={completeTask}/>;
      case 'workout-overview': return <WorkoutOverviewScreen t={t} onStart={() => goto('workout')} onBack={() => goto('today')}/>;
      case 'workout': return <WorkoutScreen t={t} onBack={() => goto('workout-overview')} onDone={completeTask}/>;
      case 'beauty': return <BeautyScreen t={t}/>;
      case 'profile': return <ProfileScreen t={t} onOpenAwards={() => goto('awards')}/>;
      case 'awards': return <AwardsScreen t={t} onBack={() => goto('profile')}/>;
      default: return null;
    }
  };

  return (
    <AppShell t={t}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: 0}}>
        {renderScreen()}
        {sheet === 'meal' && <MealSheet t={t} onClose={() => setSheet(null)} onDone={completeTask}/>}
        {reward && <RewardOverlay t={t} onClose={() => setReward(false)}/>}
      </div>
      {isMainTab && <TabBar t={t} active={tabValue} onChange={handleTabChange}/>}
    </AppShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FloraeApp/>);
