// Экран активной тренировки

function WorkoutScreen({t, onBack, onDone}) {
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: t.bg}}>
      {/* Header */}
      <div style={{padding: '4px 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: t.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase'}}>УПРАЖНЕНИЕ 2 ИЗ 4</div>
          <Display t={t} size={26} style={{marginTop: 4}}>Приседания</Display>
        </div>
        <button onClick={onBack} style={{width: 40, height: 40, borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <Icon name="close" size={18}/>
        </button>
      </div>

      {/* Медиа */}
      <div style={{padding: '0 20px'}}>
        <PhotoSlot t={t} h={280} radius={t.radius.xl} label="GIF · техника выполнения" tone="green">
          <div style={{position: 'absolute', top: 12, left: 12, padding: '5px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: 6}}>
            <div style={{width: 6, height: 6, borderRadius: 6, background: t.accent}}/>
            AUTO-PLAY
          </div>
          <div style={{position: 'absolute', bottom: 12, right: 12, padding: '5px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 600, color: '#000'}}>
            0:15 / 0:30
          </div>
        </PhotoSlot>
      </div>

      {/* Подход */}
      <div style={{padding: '20px 24px 12px', display: 'flex', gap: 10}}>
        {[1,2,3].map(n => {
          const status = n === 1 ? 'done' : n === 2 ? 'active' : 'todo';
          return (
            <div key={n} style={{
              flex: 1, padding: '12px 14px', borderRadius: t.radius.md,
              background: status === 'active' ? t.text : status === 'done' ? t.successSoft : t.surface,
              color: status === 'active' ? t.bg : t.text,
              border: status === 'todo' ? `1px solid ${t.border}` : 'none',
            }}>
              <div style={{fontSize: 11, opacity: 0.55, letterSpacing: '0.06em'}}>ПОДХОД {n}</div>
              <div style={{
                marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 4,
              }}>
                <span style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 22, letterSpacing: '-0.02em', color: status === 'done' ? t.success : 'inherit'}}>15</span>
                <span style={{fontSize: 11, opacity: 0.6}}>раз</span>
                {status === 'done' && <Icon name="check" size={14} stroke={t.success} sw={2.5} style={{marginLeft: 'auto'}}/>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Техника */}
      <div style={{padding: '4px 24px 12px'}}>
        <div style={{
          padding: '14px 16px', borderRadius: t.radius.md,
          background: t.surface, border: `1px solid ${t.border}`,
        }}>
          <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: t.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8}}>ТЕХНИКА</div>
          {['Ноги на ширине плеч, носки чуть в стороны', 'Спина прямая, взгляд вперёд', 'Колени не выходят за линию носков'].map((tip, i) => (
            <div key={i} style={{display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: i === 0 ? 0 : 8, fontSize: 13, lineHeight: 1.4, color: t.text}}>
              <div style={{width: 4, height: 4, borderRadius: 4, background: t.accent, marginTop: 7, flexShrink: 0}}/>
              {tip}
            </div>
          ))}
        </div>

        {/* Мягкое уведомление о боли */}
        <div style={{
          marginTop: 10, padding: '12px 14px', borderRadius: t.radius.md,
          background: 'oklch(96% 0.03 80)',
          border: `1px solid oklch(88% 0.06 80)`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="heart" size={16} stroke="oklch(50% 0.12 30)"/>
          <div style={{fontSize: 12.5, lineHeight: 1.4, color: 'oklch(35% 0.05 60)'}}>
            Если больно коленям — <b style={{textDecoration: 'underline'}}>заменить на стульные приседания</b>
          </div>
        </div>
      </div>

      <div style={{flex: 1}}/>

      {/* CTA */}
      <div style={{padding: '12px 20px 12px', display: 'flex', gap: 10}}>
        <Button t={t} variant="secondary" size="lg" style={{flex: '0 0 auto', width: 58, padding: 0}}>
          <Icon name="close" size={20}/>
        </Button>
        <Button t={t} variant="primary" size="lg" style={{flex: 1}} onClick={onDone} icon={<Icon name="check" size={20} sw={2.5}/>}>
          Подход выполнен
        </Button>
      </div>
    </div>
  );
}

window.WorkoutScreen = WorkoutScreen;
