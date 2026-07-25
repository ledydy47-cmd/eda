// Нижняя навигация — 5 разделов, safe-area для iPhone

function TabBar({t, active, onChange}) {
  const items = [
    {id: 'today', label: 'Сегодня', icon: 'home'},
    {id: 'meals', label: 'Питание', icon: 'meal'},
    {id: 'workout', label: 'Спорт', icon: 'dumbbell'},
    {id: 'beauty', label: 'Красота', icon: 'sparkle'},
    {id: 'profile', label: 'Профиль', icon: 'user'},
  ];
  return (
    <nav className="tab-bar" aria-label="Основная навигация" style={{
      borderTop: `1px solid ${t.border}`,
      background: 'rgba(255,255,255,0.92)',
    }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            type="button"
            aria-current={on ? 'page' : undefined}
            onClick={() => onChange(it.id)}
            className="tab-bar__item"
            style={{color: on ? t.accent : t.textFaint}}
          >
            <Icon name={it.icon} size={24} sw={on ? 2 : 1.6}/>
            <span style={{fontWeight: on ? 600 : 500}}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

window.TabBar = TabBar;
