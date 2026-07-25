// Финальное приложение florae: все экраны, единая тема playful, полный роутинг

const FLOW_MAP = [
  {group: 'Онбординг', color: 'coral', items: [
    {id: 'splash', label: 'Splash'},
    {id: 'slider1', label: 'Value · 1'},
    {id: 'slider2', label: 'Value · 2'},
    {id: 'slider3', label: 'Value · 3'},
  ]},
  {group: 'Анкета', color: 'warm', items: [
    {id: 'goal', label: 'Q1 · Цель'},
    {id: 'zones', label: 'Q2 · Зоны'},
    {id: 'stats', label: 'Q3 · Параметры'},
    {id: 'activity', label: 'Q4 · Активность'},
    {id: 'restrictions', label: 'Q5 · Питание'},
  ]},
  {group: 'Конверсия', color: 'lavender', items: [
    {id: 'plan-gen', label: 'Генерация плана'},
    {id: 'paywall', label: 'Paywall'},
    {id: 'signup', label: 'Регистрация'},
  ]},
  {group: 'Основное', color: 'green', items: [
    {id: 'today', label: 'Сегодня'},
    {id: 'meals', label: 'Питание'},
    {id: 'recipe', label: 'Полный рецепт'},
    {id: 'workout-overview', label: 'Тренировка'},
    {id: 'workout', label: 'Активное упражнение'},
    {id: 'beauty', label: 'Красота'},
    {id: 'profile', label: 'Профиль'},
    {id: 'awards', label: 'Все награды'},
  ]},
];

const ALL_SCREENS = FLOW_MAP.flatMap(g => g.items);
const MAIN_TAB_SCREENS = ['today', 'meals', 'workout-overview', 'beauty', 'profile'];

function FloraeApp() {
  const t = THEMES.playful;
  const [screenId, setScreenId] = React.useState(() => localStorage.getItem('florae_screen') || 'splash');
  const [sheet, setSheet] = React.useState(null);
  const [reward, setReward] = React.useState(false);
  const [sidebar, setSidebar] = React.useState(true);

  React.useEffect(() => { localStorage.setItem('florae_screen', screenId); }, [screenId]);

  const goto = id => setScreenId(id);
  const idx = ALL_SCREENS.findIndex(s => s.id === screenId);
  const isMainTab = MAIN_TAB_SCREENS.includes(screenId);
  const tabValue = screenId === 'workout-overview' ? 'workout' :
                   screenId === 'workout' ? 'workout' :
                   screenId === 'recipe' ? 'meals' : screenId;

  const handleTabChange = (id) => {
    if (id === 'workout') goto('workout-overview');
    else goto(id);
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
      case 'signup': return <SignupScreen t={t} onNext={() => goto('today')} onBack={() => goto('paywall')}/>;
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
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      background: '#faf9f6',
    }}>
      <TopBarFinal onIdxChange={n => goto(ALL_SCREENS[Math.max(0, Math.min(ALL_SCREENS.length - 1, idx + n))].id)}
                   idx={idx} total={ALL_SCREENS.length} label={ALL_SCREENS[idx]?.label}
                   sidebar={sidebar} setSidebar={setSidebar}/>

      <div style={{flex: 1, display: 'flex', overflow: 'hidden'}}>
        {sidebar && <Sidebar screenId={screenId} setScreenId={setScreenId}/>}

        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 24px',
          background: `radial-gradient(60% 40% at 50% 40%, ${t.accentSoft} 0%, transparent 65%), #faf9f6`,
          overflow: 'auto',
        }}>
          <PhoneShell t={t} label={`${ALL_SCREENS[idx]?.label || screenId}   ·   ${String(idx + 1).padStart(2, '0')} / ${ALL_SCREENS.length}`}>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'}}>
              {renderScreen()}
              {sheet === 'meal' && <MealSheet t={t} onClose={() => setSheet(null)} onDone={completeTask}/>}
              {reward && <RewardOverlay t={t} onClose={() => setReward(false)}/>}
            </div>
            {isMainTab && <TabBar t={t} active={tabValue} onChange={handleTabChange}/>}
          </PhoneShell>
        </div>
      </div>
    </div>
  );
}

// ─────────── Top bar ───────────
function TopBarFinal({idx, total, label, onIdxChange, sidebar, setSidebar}) {
  return (
    <div style={{
      padding: '16px 24px',
      display: 'flex', alignItems: 'center', gap: 20,
      borderBottom: '1px solid oklch(92% 0.005 60)',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      <button onClick={() => setSidebar(!sidebar)} style={{
        width: 36, height: 36, borderRadius: 10,
        background: sidebar ? 'oklch(22% 0.02 50)' : 'transparent',
        color: sidebar ? '#fff' : 'oklch(30% 0.02 50)',
        border: sidebar ? 'none' : '1px solid oklch(90% 0.005 60)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'oklch(22% 0.02 50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20c0-10 6-16 16-16 0 10-6 16-16 16z"/>
            <path d="M4 20L12 12"/>
          </svg>
        </div>
        <div>
          <div style={{fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 18, letterSpacing: '-0.02em', color: 'oklch(22% 0.02 50)'}}>florae</div>
          <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5, letterSpacing: '0.14em', color: 'oklch(52% 0.02 50)', textTransform: 'uppercase', marginTop: -2}}>iOS · Bold Playful</div>
        </div>
      </div>

      <div style={{flex: 1}}/>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 14px', borderRadius: 999,
        background: 'oklch(96% 0.005 60)',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        color: 'oklch(30% 0.02 50)', letterSpacing: '0.06em',
      }}>
        <span>{label}</span>
        <span style={{color: 'oklch(60% 0.02 50)'}}>·</span>
        <span>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>

      <div style={{display: 'flex', gap: 6}}>
        <button onClick={() => onIdxChange(-1)} disabled={idx === 0} style={{
          width: 36, height: 36, borderRadius: 18,
          background: '#fff', border: '1px solid oklch(90% 0.005 60)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
        </button>
        <button onClick={() => onIdxChange(1)} disabled={idx === ALL_SCREENS.length - 1} style={{
          width: 36, height: 36, borderRadius: 18,
          background: 'oklch(22% 0.02 50)', border: 'none', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: idx === ALL_SCREENS.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === ALL_SCREENS.length - 1 ? 0.4 : 1,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
    </div>
  );
}

// ─────────── Sidebar ───────────
function Sidebar({screenId, setScreenId}) {
  const colors = {
    coral: 'oklch(68% 0.18 25)',
    warm: 'oklch(64% 0.13 35)',
    lavender: 'oklch(60% 0.14 300)',
    green: 'oklch(58% 0.11 155)',
  };

  return (
    <div style={{
      width: 260, flexShrink: 0,
      background: '#ffffff',
      borderRight: '1px solid oklch(92% 0.005 60)',
      padding: '18px 0 18px',
      overflow: 'auto',
    }}>
      <div style={{padding: '0 20px 12px', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: 'oklch(52% 0.02 50)', textTransform: 'uppercase'}}>
        КАРТА ЭКРАНОВ · {ALL_SCREENS.length}
      </div>

      {FLOW_MAP.map(group => (
        <div key={group.group} style={{marginBottom: 4, padding: '0 12px'}}>
          <div style={{
            padding: '10px 8px 6px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{width: 6, height: 6, borderRadius: 3, background: colors[group.color]}}/>
            <div style={{
              fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 12,
              letterSpacing: '0.02em', color: 'oklch(30% 0.02 50)',
            }}>{group.group}</div>
            <div style={{
              marginLeft: 'auto', fontSize: 10, color: 'oklch(60% 0.02 50)',
              fontFamily: '"JetBrains Mono", monospace',
            }}>{group.items.length}</div>
          </div>
          {group.items.map((item, i) => {
            const on = item.id === screenId;
            const num = ALL_SCREENS.findIndex(s => s.id === item.id) + 1;
            return (
              <button key={item.id} onClick={() => setScreenId(item.id)} style={{
                width: '100%', padding: '9px 12px',
                borderRadius: 8, marginBottom: 2,
                display: 'flex', alignItems: 'center', gap: 10,
                background: on ? 'oklch(96% 0.02 25)' : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'Inter, sans-serif',
                color: on ? 'oklch(22% 0.02 50)' : 'oklch(40% 0.02 50)',
                position: 'relative',
              }}
              onMouseEnter={e => !on && (e.currentTarget.style.background = 'oklch(97% 0.005 60)')}
              onMouseLeave={e => !on && (e.currentTarget.style.background = 'transparent')}>
                {on && <div style={{position: 'absolute', left: 0, top: 4, bottom: 4, width: 3, borderRadius: 2, background: colors[group.color]}}/>}
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  color: on ? colors[group.color] : 'oklch(65% 0.02 50)',
                  minWidth: 22,
                }}>{String(num).padStart(2, '0')}</span>
                <span style={{fontSize: 13, fontWeight: on ? 600 : 500, letterSpacing: '-0.01em'}}>{item.label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FloraeApp/>);
