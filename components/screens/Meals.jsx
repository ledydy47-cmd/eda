// Экран «Питание»

function MealsScreen({t, onOpenRecipe, onReplaceDinner, dinnerTitle = 'Куриная грудка с брокколи', dinnerKcal = 320}) {
  const meals = [
    {id: 'b', time: '08:00', icon: 'sun', tag: 'Завтрак', title: 'Овсяная каша с ягодами и мёдом', kcal: 280, done: true, tone: 'warm'},
    {id: 'l', time: '13:30', icon: 'sun', tag: 'Обед', title: 'Куриный суп с киноа и зеленью', kcal: 350, done: true, tone: 'green'},
    {id: 's', time: '16:00', icon: 'apple', tag: 'Перекус', title: 'Яблоко и горсть миндаля', kcal: 150, done: false, tone: 'coral'},
    {id: 'd', time: '19:00', icon: 'moon', tag: 'Ужин', title: dinnerTitle, kcal: dinnerKcal, done: false, tone: 'warm', canReplace: true},
  ];
  const doneKcal = meals.filter(m => m.done).reduce((s, m) => s + m.kcal, 0);
  const totalTarget = 1200;

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      {/* Header */}
      <div style={{padding: '4px 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Display t={t} size={26}>Питание</Display>
        <button style={{width: 40, height: 40, borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <Icon name="calendar" size={18} stroke={t.text}/>
        </button>
      </div>

      {/* Selector дней */}
      <div style={{display: 'flex', gap: 8, padding: '0 24px 16px'}}>
        {[
          {d: 'ПН', n: 21},
          {d: 'ВТ', n: 22},
          {d: 'СР', n: 23},
          {d: 'ЧТ', n: 24},
          {d: 'ПТ', n: 25, active: true},
          {d: 'СБ', n: 26},
          {d: 'ВС', n: 27},
        ].map((day, i) => (
          <div key={i} style={{
            flex: 1, padding: '8px 0', borderRadius: t.radius.md,
            background: day.active ? t.text : 'transparent',
            color: day.active ? t.bg : t.text,
            textAlign: 'center', cursor: 'pointer',
            border: day.active ? 'none' : `1px solid ${t.border}`,
          }}>
            <div style={{fontSize: 10, opacity: 0.6, letterSpacing: '0.06em'}}>{day.d}</div>
            <div style={{fontSize: 15, fontWeight: 700, marginTop: 2}}>{day.n}</div>
          </div>
        ))}
      </div>

      {/* Итого калорий */}
      <div style={{padding: '0 24px 16px'}}>
        <div style={{
          padding: 16, borderRadius: t.radius.lg,
          background: t.surface, border: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <Ring size={64} stroke={6} value={doneKcal / totalTarget} color={t.accent} track={t.bgSubtle}>
            <div style={{fontSize: 13, fontWeight: 700, color: t.text}}>{Math.round((doneKcal/totalTarget)*100)}%</div>
          </Ring>
          <div style={{flex: 1}}>
            <div style={{fontSize: 11, letterSpacing: '0.08em', color: t.textMuted, textTransform: 'uppercase'}}>Съедено сегодня</div>
            <div style={{marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6}}>
              <span style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 26, letterSpacing: '-0.02em'}}>{doneKcal}</span>
              <span style={{color: t.textMuted, fontSize: 13}}>/ {totalTarget} ккал</span>
            </div>
            <div style={{marginTop: 8, display: 'flex', gap: 12, fontSize: 11.5, color: t.textMuted}}>
              <span>Б <b style={{color: t.text}}>52 г</b></span>
              <span>Ж <b style={{color: t.text}}>18 г</b></span>
              <span>У <b style={{color: t.text}}>72 г</b></span>
            </div>
          </div>
        </div>
      </div>

      {/* Meals list */}
      <div style={{flex: 1, overflow: 'auto', padding: '0 20px 20px'}}>
        {meals.map((m) => (
          <div key={m.id} style={{
            padding: 14, borderRadius: t.radius.lg,
            background: t.surface, border: `1px solid ${t.border}`,
            marginBottom: 10,
            opacity: m.done ? 0.7 : 1,
          }}>
            <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
              <PhotoSlot t={t} w={72} h={72} radius={t.radius.md} label={m.tag} tone={m.tone} style={{flexShrink: 0}}/>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                  <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: t.textMuted, letterSpacing: '0.06em'}}>{m.time}</div>
                  <div style={{width: 3, height: 3, borderRadius: 3, background: t.textFaint}}/>
                  <div style={{fontSize: 11, color: t.accent, fontWeight: 600, letterSpacing: '0.02em'}}>{m.tag}</div>
                </div>
                <div style={{fontSize: 14.5, fontWeight: 600, color: t.text, marginTop: 4, letterSpacing: '-0.01em', lineHeight: 1.25, textDecoration: m.done ? 'line-through' : 'none', textDecorationColor: t.textFaint}}>
                  {m.title}
                </div>
                <div style={{fontSize: 12.5, color: t.textMuted, marginTop: 4}}>{m.kcal} ккал · 25 мин</div>
              </div>
              <button style={{
                width: 32, height: 32, borderRadius: 16, flexShrink: 0,
                background: m.done ? t.success : 'transparent',
                border: m.done ? 'none' : `1.5px solid ${t.borderStrong}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                {m.done && <Icon name="check" size={16} stroke="#fff" sw={2.5}/>}
              </button>
            </div>
            {m.canReplace && onReplaceDinner && !m.done && (
              <button onClick={onReplaceDinner} style={{
                marginTop: 10, width: '100%', padding: '10px 12px',
                borderRadius: t.radius.md,
                background: t.accentSoft, border: `1px solid ${t.accent}33`,
                color: t.accent, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: t.fontBody,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Icon name="meal" size={15} stroke={t.accent}/> Заменить ужин
              </button>
            )}
          </div>
        ))}

        {/* PRO баннер */}
        <div style={{
          marginTop: 16, padding: 16,
          borderRadius: t.radius.lg,
          background: t.bgSubtle,
          border: `1px dashed ${t.borderStrong}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="lock" size={18} stroke={t.bg}/>
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 14, fontWeight: 600, color: t.text, letterSpacing: '-0.01em'}}>Меню на неделю</div>
            <div style={{fontSize: 12, color: t.textMuted, marginTop: 2}}>Открывается в PRO</div>
          </div>
          <Icon name="chevronR" size={18} stroke={t.textMuted}/>
        </div>
      </div>
    </div>
  );
}

window.MealsScreen = MealsScreen;
