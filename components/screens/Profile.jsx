// Профиль с графиком веса и наградами

function ProfileScreen({t, onOpenAwards}) {
  // График веса — 30 точек, плавно вниз
  const points = React.useMemo(() => {
    const arr = [];
    let v = 72;
    for (let i = 0; i < 15; i++) {
      arr.push(v);
      v -= 0.05 + Math.random() * 0.25;
      if (Math.random() < 0.2) v += 0.15;
    }
    return arr;
  }, []);

  const w = 310, h = 120;
  const min = Math.min(...points) - 0.3;
  const max = Math.max(...points) + 0.3;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / (max - min)) * h;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  const areaPath = path + ` L ${w} ${h} L 0 ${h} Z`;

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      {/* Header — компактный */}
      <div style={{padding: '4px 24px 16px', display: 'flex', alignItems: 'center', gap: 14}}>
        <PhotoSlot t={t} w={62} h={62} radius={32} label="" tone="warm" style={{flexShrink: 0}}/>
        <div style={{flex: 1}}>
          <Display t={t} size={22}>Анна М.</Display>
          <div style={{marginTop: 3, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: t.textMuted}}>
            <Icon name="fire" size={13} stroke={t.accent}/>
            <span>7 дней в программе</span>
            <div style={{width: 3, height: 3, borderRadius: 3, background: t.textFaint}}/>
            <span style={{color: t.accent, fontWeight: 600}}>PRO</span>
          </div>
        </div>
        <button style={{width: 40, height: 40, borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <Icon name="settings" size={18}/>
        </button>
      </div>

      <div style={{flex: 1, overflow: 'auto', padding: '0 20px 20px'}}>
        {/* График веса */}
        <div style={{
          padding: 20, borderRadius: t.radius.xl,
          background: t.surface, border: `1px solid ${t.border}`,
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: t.textMuted, textTransform: 'uppercase'}}>ТЕКУЩИЙ ВЕС</div>
              <div style={{marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6}}>
                <span style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 44, letterSpacing: '-0.03em', color: t.text, lineHeight: 1}}>70.5</span>
                <span style={{fontSize: 15, color: t.textMuted}}>кг</span>
              </div>
            </div>
            <div style={{
              padding: '6px 10px', borderRadius: 999,
              background: t.successSoft, color: t.success,
              fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
            }}>
              ↓ 1.5 кг за неделю
            </div>
          </div>

          {/* SVG график */}
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{marginTop: 16, width: '100%', height: 'auto', display: 'block'}}>
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={t.accent} stopOpacity="0.22"/>
                <stop offset="100%" stopColor={t.accent} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#weightGrad)"/>
            <path d={path} fill="none" stroke={t.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Точка на последнем */}
            {(() => {
              const i = points.length - 1;
              const x = (i / (points.length - 1)) * w;
              const y = h - ((points[i] - min) / (max - min)) * h;
              return <>
                <circle cx={x} cy={y} r="6" fill={t.surface} stroke={t.accent} strokeWidth="2.5"/>
                <circle cx={x} cy={y} r="2.5" fill={t.accent}/>
              </>;
            })()}
          </svg>

          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: t.textFaint}}>
            <span>Старт 72.0 кг</span>
            <span>Сейчас 70.5 кг</span>
            <span>Цель 62.0 кг</span>
          </div>

          {/* Прогресс к цели */}
          <div style={{marginTop: 14}}>
            <LinearProgress t={t} value={1.5/10} height={6}/>
            <div style={{marginTop: 6, fontSize: 12, color: t.textMuted}}>
              Пройдено <b style={{color: t.text}}>15%</b> пути · осталось 8.5 кг
            </div>
          </div>
        </div>

        {/* Замеры */}
        <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.14em', color: t.textMuted, textTransform: 'uppercase', marginTop: 24, marginBottom: 12, padding: '0 4px'}}>ПАРАМЕТРЫ ТЕЛА</div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
          {[
            {l: 'Талия', v: '76', d: '−2 см', pos: true},
            {l: 'Бёдра', v: '98', d: '−1 см', pos: true},
            {l: 'Грудь', v: '92', d: '0 см', pos: false},
            {l: 'Плечо', v: '28', d: '−0.5', pos: true},
          ].map((s, i) => (
            <div key={i} style={{padding: 14, borderRadius: t.radius.lg, background: t.surface, border: `1px solid ${t.border}`}}>
              <div style={{fontSize: 12, color: t.textMuted}}>{s.l}</div>
              <div style={{marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 4}}>
                <span style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 22, letterSpacing: '-0.02em'}}>{s.v}</span>
                <span style={{fontSize: 11, color: t.textMuted}}>см</span>
              </div>
              <div style={{marginTop: 4, fontSize: 11, color: s.pos ? t.success : t.textMuted, fontWeight: 600}}>
                {s.pos && '↓ '}{s.d}
              </div>
            </div>
          ))}
        </div>

        {/* Награды */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 24, marginBottom: 12, padding: '0 4px'}}>
          <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.14em', color: t.textMuted, textTransform: 'uppercase'}}>НАГРАДЫ · 17 ИЗ 80</div>
          <button onClick={onOpenAwards} style={{background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: t.fontBody, fontSize: 12, color: t.accent, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2, padding: 0}}>Все →</button>
        </div>

        <div style={{
          padding: 16, borderRadius: t.radius.lg,
          background: t.surface, border: `1px solid ${t.border}`,
          display: 'flex', gap: 8, overflow: 'auto',
        }}>
          {[
            {i: 'fire', l: '7 дней', tone: 'coral', on: true},
            {i: 'trophy', l: 'Марафон', tone: 'warm', on: true},
            {i: 'droplet', l: '2 л', tone: 'green', on: true},
            {i: 'meal', l: 'Шеф', tone: 'lavender', on: false},
            {i: 'zap', l: '30 мин', tone: 'coral', on: false},
          ].map((b, i) => (
            <div key={i} style={{
              flex: '0 0 auto',
              width: 68, textAlign: 'center',
              opacity: b.on ? 1 : 0.35,
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: 30,
                background: b.on ? t.text : t.bgSubtle,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto',
              }}>
                <Icon name={b.i} size={26} stroke={b.on ? t.accent : t.textFaint} sw={1.5}/>
              </div>
              <div style={{marginTop: 6, fontSize: 11, color: t.text, fontWeight: 500}}>{b.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
