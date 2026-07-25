// AppShell — полноэкранный мобильный контейнер (без прототип-фрейма)

function AppShell({t, children, dark = false, bg}) {
  return (
    <div className="app-shell" style={{
      '--app-bg': bg || t.bg,
      '--app-text': dark ? '#fff' : t.text,
      background: bg || t.bg,
      color: dark ? '#fff' : t.text,
      fontFamily: t.fontBody,
    }}>
      <div className="app-shell__inner">
        {children}
      </div>
    </div>
  );
}

window.AppShell = AppShell;
