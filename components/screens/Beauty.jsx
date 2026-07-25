// Экран «Красота» — библиотека процедур

function BeautyScreen({t}) {
  const cats = ['Лицо', 'Тело', 'Волосы', 'Ногти'];
  const [cat, setCat] = React.useState(0);

  const procedures = [
    {t: 'Маска из мёда и овсянки', s: 'Питание · 10 мин', tone: 'warm', tag: 'СЕГОДНЯ', done: true},
    {t: 'Массаж лица ложками', s: 'Тонус · 8 мин', tone: 'lavender', tag: null},
    {t: 'Сыворотка с витамином C', s: 'Сияние · 3 мин', tone: 'coral', tag: 'PRO', locked: true},
    {t: 'Паровая ванночка с ромашкой', s: 'Очищение · 15 мин', tone: 'green', tag: null},
  ];

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: '4px 24px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <Display t={t} size={26}>Красота</Display>
          <div style={{marginTop: 4, fontSize: 13, color: t.textMuted}}>
            Твои зоны: <span style={{color: t.text, fontWeight: 600}}>кожа · тонус</span>
          </div>
        </div>
        <button style={{width: 40, height: 40, borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <Icon name="settings" size={18}/>
        </button>
      </div>

      {/* Категории */}
      <div style={{padding: '12px 20px 4px', display: 'flex', gap: 8, overflowX: 'auto'}}>
        {cats.map((c, i) => {
          const on = i === cat;
          return (
            <button key={c} onClick={() => setCat(i)} style={{
              padding: '8px 16px',
              borderRadius: 999,
              background: on ? t.text : t.surface,
              color: on ? t.bg : t.text,
              border: on ? 'none' : `1px solid ${t.border}`,
              fontFamily: t.fontBody, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{c}</button>
          );
        })}
      </div>

      <div style={{flex: 1, overflow: 'auto', padding: '12px 20px 20px'}}>
        {/* Featured — сегодняшняя процедура */}
        <div style={{
          borderRadius: t.radius.xl,
          background: t.surface,
          border: `1px solid ${t.border}`,
          overflow: 'hidden',
          marginBottom: 20,
        }}>
          <PhotoSlot t={t} h={180} radius={0} label="фото · маска для лица" tone="warm">
            <div style={{position: 'absolute', top: 12, left: 12, padding: '5px 10px', borderRadius: 999, background: t.text, color: t.bg, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em'}}>
              РИТУАЛ ДНЯ
            </div>
          </PhotoSlot>
          <div style={{padding: '16px 18px 18px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6}}>
              <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.1em', color: t.success}}>
                ВЫПОЛНЕНО В 8:14
              </div>
              <Icon name="check" size={12} stroke={t.success} sw={2.5}/>
            </div>
            <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 22, letterSpacing: '-0.02em', color: t.text, lineHeight: 1.15}}>
              Питательная маска<br/>из мёда и овсянки
            </div>
            <div style={{marginTop: 8, fontSize: 13, color: t.textMuted, lineHeight: 1.5}}>
              Смягчает кожу, снимает раздражение и восстанавливает барьер. Идеально после тренировки.
            </div>
            <div style={{marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap'}}>
              {['#питание', '#мёд', '#без-химии', '#10мин'].map(tag => (
                <div key={tag} style={{padding: '4px 10px', borderRadius: 999, background: t.bgSubtle, fontSize: 11, color: t.textMuted}}>{tag}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.14em', color: t.textMuted, textTransform: 'uppercase', marginBottom: 12, padding: '0 4px'}}>
          БИБЛИОТЕКА · 24 ПРОЦЕДУРЫ
        </div>

        {/* 2-column grid */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          {procedures.map((p, i) => (
            <div key={i} style={{
              borderRadius: t.radius.lg,
              background: t.surface,
              border: `1px solid ${t.border}`,
              overflow: 'hidden',
              position: 'relative',
            }}>
              <PhotoSlot t={t} h={110} radius={0} label={p.s.split(' ·')[0]} tone={p.tone}>
                {p.tag && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    padding: '3px 7px', borderRadius: 6,
                    background: p.tag === 'PRO' ? t.text : t.accent,
                    color: p.tag === 'PRO' ? t.bg : t.accentText,
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                    letterSpacing: '0.1em', fontWeight: 700,
                  }}>{p.tag}</div>
                )}
                {p.locked && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name="lock" size={22} stroke={t.text}/>
                  </div>
                )}
              </PhotoSlot>
              <div style={{padding: '10px 12px 12px'}}>
                <div style={{fontSize: 13, fontWeight: 600, color: t.text, letterSpacing: '-0.01em', lineHeight: 1.2, textDecoration: p.done ? 'line-through' : 'none', textDecorationColor: t.textFaint}}>{p.t}</div>
                <div style={{fontSize: 11, color: t.textMuted, marginTop: 4}}>{p.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.BeautyScreen = BeautyScreen;
