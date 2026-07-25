// Общие UI-примитивы: плейсхолдеры изображений, иконки, кнопки

// Полосатый placeholder для фото — с подписью того, что там должно быть
function PhotoSlot({t, w = '100%', h = 200, radius, label, tone = 'neutral', style = {}, children}) {
  const tones = {
    neutral: {a: 'oklch(88% 0.02 60)', b: 'oklch(83% 0.025 60)', fg: 'oklch(35% 0.02 60)'},
    warm:    {a: 'oklch(87% 0.04 45)', b: 'oklch(80% 0.06 40)', fg: 'oklch(30% 0.05 40)'},
    green:   {a: 'oklch(88% 0.05 155)', b: 'oklch(81% 0.07 150)', fg: 'oklch(28% 0.06 150)'},
    coral:   {a: 'oklch(88% 0.06 30)', b: 'oklch(82% 0.09 25)', fg: 'oklch(30% 0.08 25)'},
    lavender:{a: 'oklch(89% 0.04 300)', b: 'oklch(83% 0.06 300)', fg: 'oklch(30% 0.06 300)'},
    dark:    {a: 'oklch(28% 0.02 60)', b: 'oklch(22% 0.02 60)', fg: 'oklch(80% 0.01 60)'},
  };
  const c = tones[tone] || tones.neutral;
  const r = radius ?? t.radius.md;
  return (
    <div style={{
      width: w, height: h,
      borderRadius: r,
      background: `repeating-linear-gradient(135deg, ${c.a} 0 10px, ${c.b} 10px 20px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: c.fg, position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      {label && (
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
          background: c.a, padding: '5px 10px', borderRadius: 4,
          border: `1px solid ${c.fg}22`,
        }}>{label}</div>
      )}
      {children}
    </div>
  );
}

// SVG иконки — линейный минималистичный набор
const Icon = ({name, size = 22, stroke = 'currentColor', fill = 'none', sw = 1.75}) => {
  const p = {width: size, height: size, viewBox: '0 0 24 24', fill, stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round'};
  const paths = {
    home: <><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z"/></>,
    meal: <><path d="M4 3v9c0 1.5 1 3 3 3v6"/><path d="M7 3v6"/><path d="M10 3v6"/><path d="M17 3c-1.5 0-3 1.5-3 5s1.5 5 3 5v8"/></>,
    dumbbell: <><path d="M6 4v16M18 4v16M4 8v8M20 8v8M6 12h12"/></>,
    sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M19 17l.6 1.4L21 19l-1.4.6L19 21l-.6-1.4L17 19l1.4-.6z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-8 8-8s8 3.5 8 8"/></>,
    check: <><path d="M4 12l5 5 11-11"/></>,
    checkCircle: <><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></>,
    circle: <><circle cx="12" cy="12" r="9"/></>,
    arrow: <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    arrowLeft: <><path d="M19 12H5M11 5l-7 7 7 7"/></>,
    chevronR: <><path d="M9 5l7 7-7 7"/></>,
    chevronD: <><path d="M5 9l7 7 7-7"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    play: <><path d="M6 4l14 8-14 8V4z" fill={stroke}/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></>,
    fire: <><path d="M12 3s5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-6 1-9z"/></>,
    droplet: <><path d="M12 3s6 7 6 12a6 6 0 01-12 0c0-5 6-12 6-12z"/></>,
    trophy: <><path d="M8 4h8v5a4 4 0 01-8 0V4z"/><path d="M4 5h4M16 5h4M9 15h6M10 21h4M12 15v6"/><path d="M4 5v2a3 3 0 003 3M20 5v2a3 3 0 01-3 3"/></>,
    heart: <><path d="M12 20s-7-4.5-7-11a4 4 0 017-2.5A4 4 0 0119 9c0 6.5-7 11-7 11z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></>,
    bell: <><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 004 0"/></>,
    scale: <><path d="M4 20l4-12h8l4 12H4z"/><path d="M9 8V4h6v4"/><path d="M8 14h8"/></>,
    close: <><path d="M6 6l12 12M18 6L6 18"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    leaf: <><path d="M4 20c0-10 6-16 16-16 0 10-6 16-16 16z"/><path d="M4 20L12 12"/></>,
    star: <><path d="M12 3l2.6 6.3L21 10l-5 4.5L17.5 21 12 17.5 6.5 21 8 14.5 3 10l6.4-.7z"/></>,
    zap: <><path d="M13 3L4 14h7l-1 7 9-11h-7z"/></>,
    moon: <><path d="M20 14A8 8 0 019.5 4a8 8 0 1010.5 10z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></>,
    apple: <><path d="M12 6c0-2 2-3 3-3s0 3-3 3zM7 8c-2 0-3 2-3 5s2 8 5 8 3-1 3-1 0 1 3 1 5-5 5-8-1-5-3-5-3 1-3 1-1-1-2-1-1 1-2 1-2-1-3-1z"/></>,
  };
  return <svg {...p}>{paths[name]}</svg>;
};

// Основная кнопка
function Button({t, children, onClick, variant = 'primary', size = 'lg', style = {}, icon}) {
  const sizes = {
    lg: {h: 58, px: 24, fs: 16, r: t.radius.lg},
    md: {h: 48, px: 20, fs: 15, r: t.radius.md},
    sm: {h: 36, px: 14, fs: 13, r: t.radius.sm},
  };
  const s = sizes[size];
  const variants = {
    primary: {bg: t.accent, color: t.accentText, border: 'transparent'},
    secondary: {bg: 'transparent', color: t.text, border: t.borderStrong},
    ghost: {bg: 'transparent', color: t.textMuted, border: 'transparent'},
    dark: {bg: t.text, color: t.bg, border: 'transparent'},
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} style={{
      height: s.h,
      padding: `0 ${s.px}px`,
      borderRadius: s.r,
      background: v.bg,
      color: v.color,
      border: `1.5px solid ${v.border}`,
      fontFamily: t.fontBody,
      fontWeight: 600,
      fontSize: s.fs,
      letterSpacing: '-0.01em',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      transition: 'transform 0.15s, opacity 0.15s',
      ...style,
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
      {children}
      {icon}
    </button>
  );
}

// Круговой прогресс
function Ring({size = 88, stroke = 8, value = 0, color, track, children}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value);
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
                strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
                style={{transition: 'stroke-dashoffset 0.6s ease'}}/>
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        {children}
      </div>
    </div>
  );
}

// Прогресс-бар (шаг X из Y)
function LinearProgress({t, value, height = 6, color}) {
  return (
    <div style={{
      width: '100%',
      height,
      borderRadius: height,
      background: t.bgSubtle,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${value * 100}%`,
        height: '100%',
        background: color || t.accent,
        borderRadius: height,
        transition: 'width 0.5s ease',
      }}/>
    </div>
  );
}

// Заголовок в стиле темы (auto italic для warm)
function Display({t, size = 32, children, style = {}, as = 'h1'}) {
  const Tag = as;
  return (
    <Tag style={{
      fontFamily: t.fontDisplay,
      fontWeight: t.displayWeight,
      fontStyle: t.displayItalic ? 'italic' : 'normal',
      fontSize: size,
      lineHeight: 1.05,
      letterSpacing: t.displayItalic ? '-0.02em' : '-0.03em',
      color: t.text,
      margin: 0,
      textWrap: 'balance',
      ...style,
    }}>{children}</Tag>
  );
}

window.PhotoSlot = PhotoSlot;
window.Icon = Icon;
window.Button = Button;
window.Ring = Ring;
window.LinearProgress = LinearProgress;
window.Display = Display;
