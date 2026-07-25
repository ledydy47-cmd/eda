// Главный экран «Сегодня»

function TodayScreen({t, onOpenMeal, onOpenWorkout, onOpenBeauty}) {
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
      {/* Верх с датой */}
      <div style={{padding: '4px 24px 8px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.08em', color: t.textMuted, textTransform: 'uppercase'}}>
              Пятница · 25 июля
            </div>
            <Display t={t} size={30} style={{marginTop: 6}}>
              Доброе утро,<br/><span style={{color: t.accent}}>Анна</span>
            </Display>
          </div>
          <button style={{
            width: 42, height: 42, borderRadius: 21, position: 'relative',
            background: t.surface, border: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: t.text,
          }}>
            <Icon name="bell" size={20}/>
            <div style={{position: 'absolute', top: 8, right: 10, width: 8, height: 8, borderRadius: 8, background: t.accent, border: `2px solid ${t.surface}`}}/>
          </button>
        </div>
      </div>

      {/* Прокручиваемый контент */}
      <div style={{flex: 1, overflow: 'auto', padding: '4px 20px 20px'}}>
        {/* Прогресс дня — крупная карточка */}
        <div style={{
          padding: 20,
          borderRadius: t.radius.xl,
          background: `linear-gradient(160deg, ${t.text} 0%, oklch(28% 0.03 40) 100%)`,
          color: t.bg,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 160, height: 160, borderRadius: 200,
            background: t.accent, opacity: 0.4, filter: 'blur(30px)',
          }}/>
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 18}}>
            <Ring size={92} stroke={7} value={0.23}
                  color={t.accent} track="rgba(255,255,255,0.14)">
              <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 26, color: t.bg, letterSpacing: '-0.02em', lineHeight: 1}}>7</div>
              <div style={{fontSize: 10, opacity: 0.65, marginTop: 2}}>из 30</div>
            </Ring>
            <div style={{flex: 1}}>
              <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', opacity: 0.6, textTransform: 'uppercase'}}>ДЕНЬ ПРОГРАММЫ</div>
              <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 22, letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1.15}}>
                Твоя первая неделя — за спиной.
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 13, opacity: 0.75}}>
                <Icon name="fire" size={14}/> 7 дней подряд
              </div>
            </div>
          </div>
        </div>

        {/* Три задания */}
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.14em', color: t.textMuted, textTransform: 'uppercase',
          marginTop: 26, marginBottom: 12, padding: '0 4px',
        }}>ЗАДАНИЯ НА СЕГОДНЯ · 3 ИЗ 5</div>

        {/* Питание */}
        <button onClick={onOpenMeal} style={{
          width: '100%', display: 'flex', gap: 14, padding: 14,
          background: t.surface, borderRadius: t.radius.lg,
          border: `1px solid ${t.border}`, cursor: 'pointer',
          alignItems: 'center', textAlign: 'left', marginBottom: 10,
        }}>
          <PhotoSlot t={t} w={64} h={64} radius={t.radius.md} label="еда" tone="warm" style={{flexShrink: 0}}/>
          <div style={{flex: 1}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <Icon name="meal" size={14} stroke={t.accent}/>
              <div style={{fontSize: 11, color: t.accent, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase'}}>Питание · 3/4</div>
            </div>
            <div style={{fontSize: 15, fontWeight: 600, color: t.text, marginTop: 4, letterSpacing: '-0.01em'}}>Ужин: курица с овощами</div>
            <div style={{marginTop: 8, display: 'flex', gap: 4}}>
              {[1,1,1,0].map((v, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 4,
                  background: v ? t.success : t.bgSubtle,
                }}/>
              ))}
            </div>
          </div>
          <div style={{color: t.textFaint}}>
            <Icon name="chevronR" size={18}/>
          </div>
        </button>

        {/* Спорт */}
        <button onClick={onOpenWorkout} style={{
          width: '100%', display: 'flex', gap: 14, padding: 14,
          background: t.surface, borderRadius: t.radius.lg,
          border: `1px solid ${t.border}`, cursor: 'pointer',
          alignItems: 'center', textAlign: 'left', marginBottom: 10,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: t.radius.md,
            background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon name="dumbbell" size={26} stroke={t.accent}/>
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 11, color: t.accent, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase'}}>Спорт · 20 мин</div>
            <div style={{fontSize: 15, fontWeight: 600, color: t.text, marginTop: 4, letterSpacing: '-0.01em'}}>Мягкая тренировка тела</div>
            <div style={{fontSize: 12.5, color: t.textMuted, marginTop: 3}}>Разминка · приседания · планка · растяжка</div>
          </div>
          <div style={{color: t.textFaint}}>
            <Icon name="chevronR" size={18}/>
          </div>
        </button>

        {/* Красота */}
        <button onClick={onOpenBeauty} style={{
          width: '100%', display: 'flex', gap: 14, padding: 14,
          background: t.surface, borderRadius: t.radius.lg,
          border: `1px solid ${t.border}`, cursor: 'pointer',
          alignItems: 'center', textAlign: 'left', marginBottom: 16,
          opacity: 0.7,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: t.radius.md,
            background: t.successSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, position: 'relative',
          }}>
            <Icon name="sparkle" size={24} stroke={t.success}/>
            <div style={{position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 22, background: t.success, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${t.surface}`}}>
              <Icon name="check" size={12} stroke="#fff" sw={3}/>
            </div>
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 11, color: t.success, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase'}}>Красота · выполнено</div>
            <div style={{fontSize: 15, fontWeight: 600, color: t.text, marginTop: 4, letterSpacing: '-0.01em', textDecoration: 'line-through', textDecorationColor: t.textFaint}}>Маска для лица · мёд и овсянка</div>
            <div style={{fontSize: 12.5, color: t.textMuted, marginTop: 3}}>Отмечено в 8:14</div>
          </div>
        </button>

        {/* Вода — компактная */}
        <div style={{
          padding: 16,
          borderRadius: t.radius.lg,
          background: t.surface,
          border: `1px solid ${t.border}`,
        }}>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <div>
              <div style={{fontSize: 11, color: t.textMuted, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase'}}>Вода</div>
              <div style={{marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6}}>
                <span style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 30, letterSpacing: '-0.02em'}}>1.2</span>
                <span style={{fontSize: 14, color: t.textMuted}}>/ 2.0 л</span>
              </div>
            </div>
            <div style={{color: t.accent, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600}}>
              <Icon name="droplet" size={14} stroke={t.accent} fill={t.accent}/>
              60%
            </div>
          </div>

          {/* 8 стаканов */}
          <div style={{display: 'flex', gap: 6, marginTop: 12}}>
            {[1,1,1,1,1,0,0,0].map((v, i) => (
              <div key={i} style={{
                flex: 1, height: 26,
                borderRadius: 6,
                border: `1.5px solid ${v ? t.accent : t.border}`,
                background: v ? t.accent : 'transparent',
              }}/>
            ))}
          </div>

          <div style={{display: 'flex', gap: 8, marginTop: 12}}>
            {['+200 мл', '+350 мл', '+500 мл'].map(l => (
              <button key={l} style={{
                flex: 1, height: 34, borderRadius: t.radius.sm,
                background: t.bgSubtle, border: 'none', cursor: 'pointer',
                fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 600, color: t.text,
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.TodayScreen = TodayScreen;
