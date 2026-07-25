// PhoneShell — окно 390×844, имитирует экран без физического фрейма
// Только скругление, тень и статус-бар iOS

function StatusBar({t, dark = false}) {
  const color = dark ? '#ffffff' : t.text;
  return (
    <div style={{
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px 0 28px',
      fontFamily: t.fontBody,
      fontWeight: 600,
      fontSize: 15,
      color,
      letterSpacing: '-0.01em',
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="7" width="3" height="4" rx="0.5" fill={color}/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill={color}/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill={color}/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill={color}/>
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 2C10.2 2 12.7 3 14.5 4.8L13 6.3C11.6 4.9 9.6 4 7.5 4S3.4 4.9 2 6.3L0.5 4.8C2.3 3 4.8 2 7.5 2Z" fill={color}/>
          <path d="M7.5 6C8.9 6 10.2 6.5 11.2 7.4L9.7 8.9C9.1 8.3 8.3 8 7.5 8S5.9 8.3 5.3 8.9L3.8 7.4C4.8 6.5 6.1 6 7.5 6Z" fill={color}/>
        </svg>
        {/* battery */}
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke={color} fill="none" opacity="0.4"/>
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill={color}/>
          <rect x="23.5" y="4" width="1.5" height="4" rx="0.5" fill={color} opacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}

function HomeIndicator({dark = false}) {
  return (
    <div style={{
      height: 34,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: 8,
      flexShrink: 0,
    }}>
      <div style={{
        width: 134, height: 5, borderRadius: 3,
        background: dark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
      }}/>
    </div>
  );
}

function PhoneShell({t, children, label, dark = false, bg, showStatusBar = true, showHome = true}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{
        width: 390,
        height: 844,
        borderRadius: 54,
        background: bg || t.bg,
        boxShadow: t.shadowLg + ', 0 0 0 1px ' + t.border,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        fontFamily: t.fontBody,
        color: t.text,
      }}>
        {showStatusBar && <StatusBar t={t} dark={dark}/>}
        <div style={{flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
          {children}
        </div>
        {showHome && <HomeIndicator dark={dark}/>}
      </div>
      {label && (
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.5)',
        }}>{label}</div>
      )}
    </div>
  );
}

window.PhoneShell = PhoneShell;
window.StatusBar = StatusBar;
window.HomeIndicator = HomeIndicator;
