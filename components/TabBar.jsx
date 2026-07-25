// Нижний таббар с 5 разделами

function TabBar({t, active, onChange}) {
  const items = [
    {id: 'today', label: 'Сегодня', icon: 'home'},
    {id: 'meals', label: 'Питание', icon: 'meal'},
    {id: 'workout', label: 'Спорт', icon: 'dumbbell'},
    {id: 'beauty', label: 'Красота', icon: 'sparkle'},
    {id: 'profile', label: 'Профиль', icon: 'user'},
  ];
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px 8px 4px',
      background: 'rgba(255,255,255,0.86)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderTop: `1px solid ${t.border}`,
      flexShrink: 0,
    }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'transparent',
            border: 'none',
            padding: '4px 8px',
            cursor: 'pointer',
            color: on ? t.accent : t.textFaint,
            fontFamily: t.fontBody,
          }}>
            <Icon name={it.icon} size={24} sw={on ? 2 : 1.6}/>
            <span style={{fontSize: 10.5, fontWeight: on ? 600 : 500, letterSpacing: '-0.01em'}}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

window.TabBar = TabBar;
