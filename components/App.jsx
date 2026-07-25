// Главное приложение — управляет темой и переходами между экранами

const FLOW = [
  {id: 'splash', label: 'Splash', group: 'Онбординг'},
  {id: 'slider1', label: 'Value · 1', group: 'Онбординг'},
  {id: 'slider2', label: 'Value · 2', group: 'Онбординг'},
  {id: 'slider3', label: 'Value · 3', group: 'Онбординг'},
  {id: 'goal', label: 'Цель · Q1', group: 'Онбординг'},
  {id: 'plan-gen', label: 'Генерация плана', group: 'Онбординг'},
  {id: 'paywall', label: 'Paywall', group: 'Онбординг'},
  {id: 'today', label: 'Сегодня', group: 'Основное'},
  {id: 'meals', label: 'Питание', group: 'Основное'},
  {id: 'workout', label: 'Тренировка', group: 'Основное'},
  {id: 'beauty', label: 'Красота', group: 'Основное'},
  {id: 'profile', label: 'Профиль', group: 'Основное'},
];

const THEME_ORDER = ['warm', 'clean', 'playful'];

function App() {
  const [themeKey, setThemeKey] = React.useState(() => localStorage.getItem('theme') || 'warm');
  const [screenId, setScreenId] = React.useState(() => localStorage.getItem('screen') || 'splash');
  const [tabIndex, setTabIndex] = React.useState(0);

  React.useEffect(() => { localStorage.setItem('theme', themeKey); }, [themeKey]);
  React.useEffect(() => { localStorage.setItem('screen', screenId); }, [screenId]);

  const t = THEMES[themeKey];
  const isMainZone = ['today', 'meals', 'workout', 'beauty', 'profile'].includes(screenId);

  const goto = (id) => setScreenId(id);
  const nextScreen = () => {
    const i = FLOW.findIndex(f => f.id === screenId);
    if (i < FLOW.length - 1) setScreenId(FLOW[i + 1].id);
  };
  const prevScreen = () => {
    const i = FLOW.findIndex(f => f.id === screenId);
    if (i > 0) setScreenId(FLOW[i - 1].id);
  };

  const renderScreen = () => {
    switch (screenId) {
      case 'splash': return <SplashScreen t={t} onNext={nextScreen}/>;
      case 'slider1': return <ValueSliderScreen t={t} slideIndex={0} onSlideChange={i => setScreenId(`slider${i+1}`)} onNext={() => goto('goal')}/>;
      case 'slider2': return <ValueSliderScreen t={t} slideIndex={1} onSlideChange={i => setScreenId(`slider${i+1}`)} onNext={() => goto('goal')}/>;
      case 'slider3': return <ValueSliderScreen t={t} slideIndex={2} onSlideChange={i => setScreenId(`slider${i+1}`)} onNext={() => goto('goal')}/>;
      case 'goal': return <GoalSelectScreen t={t} onNext={() => goto('plan-gen')} onBack={() => goto('slider3')}/>;
      case 'plan-gen': return <PlanGenerationScreen t={t} onNext={() => goto('paywall')}/>;
      case 'paywall': return <PaywallScreen t={t} onNext={() => goto('today')} onBack={() => goto('plan-gen')}/>;
      case 'today': return <TodayScreen t={t} onOpenMeal={() => goto('meals')} onOpenWorkout={() => goto('workout')} onOpenBeauty={() => goto('beauty')}/>;
      case 'meals': return <MealsScreen t={t}/>;
      case 'workout': return <WorkoutScreen t={t}/>;
      case 'beauty': return <BeautyScreen t={t}/>;
      case 'profile': return <ProfileScreen t={t}/>;
      default: return null;
    }
  };

  const showTabBar = isMainZone;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'oklch(96% 0.005 60)',
      fontFamily: t.fontBody,
      color: '#111',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar с переключателем темы + флоу */}
      <TopBar
        themeKey={themeKey} setThemeKey={setThemeKey}
        screenId={screenId} setScreenId={setScreenId}
        onNext={nextScreen} onPrev={prevScreen}
      />

      {/* Полотно */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px',
        background: `radial-gradient(60% 40% at 50% 40%, ${t.bgSubtle} 0%, transparent 70%)`,
      }}>
        <PhoneShell t={t} label={`${FLOW.find(f => f.id === screenId)?.label || screenId} · ${t.name}`}>
          {renderScreen()}
          {showTabBar && (
            <TabBar t={t}
                    active={screenId}
                    onChange={goto}/>
          )}
        </PhoneShell>
      </div>

      {/* Флоу-стрип */}
      <FlowStrip t={t} screenId={screenId} setScreenId={setScreenId}/>
    </div>
  );
}

// ────────────────────────── Chrome ──────────────────────────

function TopBar({themeKey, setThemeKey, screenId, setScreenId, onNext, onPrev}) {
  const themes = [
    {k: 'warm', name: 'Warm Editorial', color: 'oklch(64% 0.13 35)'},
    {k: 'clean', name: 'Clean Premium', color: 'oklch(70% 0.15 65)'},
    {k: 'playful', name: 'Bold Playful', color: 'oklch(68% 0.18 25)'},
  ];
  const cur = THEMES[themeKey];
  const idx = FLOW.findIndex(f => f.id === screenId);

  return (
    <div style={{
      padding: '18px 24px',
      display: 'flex', alignItems: 'center', gap: 24,
      borderBottom: '1px solid oklch(90% 0.005 60)',
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'oklch(22% 0.02 50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20c0-10 6-16 16-16 0 10-6 16-16 16z"/>
            <path d="M4 20L12 12"/>
          </svg>
        </div>
        <div>
          <div style={{fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 500, fontSize: 18, letterSpacing: '-0.02em', color: 'oklch(22% 0.02 50)'}}>florae</div>
          <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5, letterSpacing: '0.14em', color: 'oklch(50% 0.02 50)', textTransform: 'uppercase', marginTop: -1}}>UX прототип · v1</div>
        </div>
      </div>

      <div style={{flex: 1}}/>

      {/* Переключатель темы */}
      <div style={{
        display: 'flex', gap: 4, padding: 4,
        background: 'oklch(94% 0.005 60)', borderRadius: 999,
      }}>
        {themes.map(th => {
          const on = th.k === themeKey;
          return (
            <button key={th.k} onClick={() => setThemeKey(th.k)} style={{
              padding: '7px 14px', borderRadius: 999,
              background: on ? '#fff' : 'transparent',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: on ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              fontFamily: 'Inter, sans-serif', fontSize: 12.5, fontWeight: 600,
              color: on ? 'oklch(22% 0.02 50)' : 'oklch(50% 0.02 50)',
              letterSpacing: '-0.01em',
            }}>
              <div style={{width: 10, height: 10, borderRadius: 5, background: th.color}}/>
              {th.name}
            </button>
          );
        })}
      </div>

      {/* Nav prev/next */}
      <div style={{display: 'flex', gap: 6}}>
        <button onClick={onPrev} disabled={idx === 0} style={{
          width: 36, height: 36, borderRadius: 18,
          background: '#fff', border: '1px solid oklch(90% 0.005 60)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: idx === 0 ? 'not-allowed' : 'pointer',
          opacity: idx === 0 ? 0.4 : 1,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
        </button>
        <button onClick={onNext} disabled={idx === FLOW.length - 1} style={{
          width: 36, height: 36, borderRadius: 18,
          background: 'oklch(22% 0.02 50)', border: 'none', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: idx === FLOW.length - 1 ? 'not-allowed' : 'pointer',
          opacity: idx === FLOW.length - 1 ? 0.4 : 1,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
    </div>
  );
}

function FlowStrip({t, screenId, setScreenId}) {
  const groups = ['Онбординг', 'Основное'];
  return (
    <div style={{
      padding: '16px 24px 22px',
      borderTop: '1px solid oklch(90% 0.005 60)',
      background: '#fff',
      display: 'flex', gap: 32, alignItems: 'flex-start',
    }}>
      {groups.map(g => (
        <div key={g}>
          <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: 'oklch(55% 0.005 60)', textTransform: 'uppercase', marginBottom: 8}}>
            {g}
          </div>
          <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
            {FLOW.filter(f => f.group === g).map(f => {
              const on = f.id === screenId;
              return (
                <button key={f.id} onClick={() => setScreenId(f.id)} style={{
                  padding: '7px 12px', borderRadius: 8,
                  background: on ? 'oklch(22% 0.02 50)' : 'oklch(96% 0.005 60)',
                  color: on ? '#fff' : 'oklch(30% 0.005 60)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
                }}>
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
