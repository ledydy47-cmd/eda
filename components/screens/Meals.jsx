// Экран «Питание»

function MealActionButton({t, onClick, ariaLabel, active, accent, children}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      style={{
        width: 32, height: 32, borderRadius: 16, flexShrink: 0,
        background: active ? (accent ? t.accentSoft : t.success) : 'transparent',
        border: active && !accent ? 'none' : `1.5px solid ${accent ? t.accent + '44' : t.borderStrong}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function MealsScreen({
  t,
  onOpenRecipe,
  onReplaceMeal,
  breakfast,
  dinnerTitle = 'Куриная грудка с брокколи',
  dinnerKcal = 320,
  breakfastLoading = false,
}) {
  const [mealsDone, setMealsDone] = React.useState(() => RecipeData.getMealsDoneState());

  const breakfastTitle = breakfast?.title || 'Загрузка…';
  const breakfastKcal = breakfast?.kcal || 0;
  const breakfastTime = breakfast?.time || '—';

  const meals = [
    {id: 'breakfast', time: '08:00', icon: 'sun', tag: 'Завтрак', title: breakfastTitle, kcal: breakfastKcal, prepTime: breakfastTime, tone: breakfast?.tone || 'warm', canOpen: !!breakfast, canReplace: !!breakfast && !!onReplaceMeal},
    {id: 'l', time: '13:30', icon: 'sun', tag: 'Обед', title: 'Куриный суп с киноа и зеленью', kcal: 350, prepTime: '25 мин', tone: 'green', canOpen: false, canReplace: false},
    {id: 's', time: '16:00', icon: 'apple', tag: 'Перекус', title: 'Яблоко и горсть миндаля', kcal: 150, prepTime: '5 мин', tone: 'coral', canOpen: false, canReplace: false},
    {id: 'd', time: '19:00', icon: 'moon', tag: 'Ужин', title: dinnerTitle, kcal: dinnerKcal, prepTime: '25 мин', tone: 'warm', canOpen: true, canReplace: !!onReplaceMeal},
  ];

  const toggleDone = (mealId) => {
    setMealsDone(prev => {
      const next = { ...prev, [mealId]: !prev[mealId] };
      RecipeData.saveMealsDoneState(next);
      return next;
    });
  };

  const doneKcal = meals.filter(m => mealsDone[m.id]).reduce((s, m) => s + m.kcal, 0);
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
        {meals.map((m) => {
          const isDone = !!mealsDone[m.id];
          const showReplace = m.canReplace && onReplaceMeal && (m.id === 'breakfast' || !isDone);

          return (
            <div key={m.id} style={{
              padding: 14, borderRadius: t.radius.lg,
              background: t.surface, border: `1px solid ${t.border}`,
              marginBottom: 10,
              opacity: isDone ? 0.7 : 1,
            }}>
              <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                <button
                  type="button"
                  disabled={!m.canOpen || (m.id === 'breakfast' && breakfastLoading)}
                  onClick={() => m.canOpen && onOpenRecipe && onOpenRecipe(m.id)}
                  style={{
                    flex: 1, minWidth: 0, display: 'flex', gap: 12, alignItems: 'center',
                    background: 'none', border: 'none', padding: 0, textAlign: 'left',
                    cursor: m.canOpen ? 'pointer' : 'default', fontFamily: t.fontBody,
                  }}
                >
                  <PhotoSlot t={t} w={72} h={72} radius={t.radius.md} label={m.tag} tone={m.tone} src={m.id === 'breakfast' ? breakfast?.image : undefined} alt={m.title} style={{flexShrink: 0}}/>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                      <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: t.textMuted, letterSpacing: '0.06em'}}>{m.time}</div>
                      <div style={{width: 3, height: 3, borderRadius: 3, background: t.textFaint}}/>
                      <div style={{fontSize: 11, color: t.accent, fontWeight: 600, letterSpacing: '0.02em'}}>{m.tag}</div>
                    </div>
                    <div style={{fontSize: 14.5, fontWeight: 600, color: t.text, marginTop: 4, letterSpacing: '-0.01em', lineHeight: 1.25, textDecoration: isDone ? 'line-through' : 'none', textDecorationColor: t.textFaint}}>
                      {m.id === 'breakfast' && breakfastLoading ? 'Загрузка рецепта…' : m.title}
                    </div>
                    <div style={{fontSize: 12.5, color: t.textMuted, marginTop: 4}}>
                      {m.kcal ? `${m.kcal} ккал` : '—'} · {m.prepTime}
                    </div>
                  </div>
                </button>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0}}>
                  {showReplace && (
                    <MealActionButton
                      t={t}
                      ariaLabel={`Заменить ${m.tag.toLowerCase()}`}
                      accent
                      onClick={() => onReplaceMeal(m.id)}
                    >
                      <Icon name="swap" size={14} stroke={t.accent} sw={2}/>
                    </MealActionButton>
                  )}
                  <MealActionButton
                    t={t}
                    ariaLabel={isDone ? 'Отменить отметку' : 'Отметить съеденным'}
                    active={isDone}
                    onClick={() => toggleDone(m.id)}
                  >
                    {isDone && <Icon name="check" size={16} stroke="#fff" sw={2.5}/>}
                  </MealActionButton>
                </div>
              </div>
            </div>
          );
        })}

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
