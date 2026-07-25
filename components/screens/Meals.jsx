// Экран «Питание»

function MealActionButton({t, onClick, ariaLabel, active, accent, children}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      style={{
        width: 32, height: 32, borderRadius: 16, flexShrink: 0,
        background: active ? t.success : (accent ? t.accentSoft : 'transparent'),
        border: active ? 'none' : (accent ? 'none' : `1.5px solid ${t.borderStrong}`),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function MacroLine({label, done, plan, t}) {
  return (
    <span style={{fontSize: 11.5, color: t.textMuted}}>
      {label}{' '}
      <b style={{color: t.text}}>{Math.round(done)}</b>
      <span style={{opacity: 0.55}}> / {Math.round(plan)} г</span>
    </span>
  );
}

function MealsScreen({
  t,
  dayMeals = [],
  mealsDone = {},
  onOpenRecipe,
  onReplaceMeal,
  onBrowseMeals,
  onToggleMealDone,
  breakfastLoading = false,
  breakfastCount = 0,
  breakfastExpected = 15,
}) {
  const plan = RecipeData.sumDayNutrients(dayMeals, mealsDone, false);
  const eaten = RecipeData.sumDayNutrients(dayMeals, mealsDone, true);

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: '4px 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Display t={t} size={26}>Питание</Display>
        <button style={{width: 40, height: 40, borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <Icon name="calendar" size={18} stroke={t.text}/>
        </button>
      </div>

      <div style={{display: 'flex', gap: 8, padding: '0 24px 16px'}}>
        {[
          {d: 'ПН', n: 21}, {d: 'ВТ', n: 22}, {d: 'СР', n: 23}, {d: 'ЧТ', n: 24},
          {d: 'ПТ', n: 25, active: true}, {d: 'СБ', n: 26}, {d: 'ВС', n: 27},
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

      <div style={{padding: '0 24px 16px'}}>
        <div style={{
          padding: 16, borderRadius: t.radius.lg,
          background: t.surface, border: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <Ring size={64} stroke={6} value={plan.kcal ? eaten.kcal / plan.kcal : 0} color={t.accent} track={t.bgSubtle}>
            <div style={{fontSize: 13, fontWeight: 700, color: t.text}}>{plan.kcal ? Math.round((eaten.kcal / plan.kcal) * 100) : 0}%</div>
          </Ring>
          <div style={{flex: 1}}>
            <div style={{fontSize: 11, letterSpacing: '0.08em', color: t.textMuted, textTransform: 'uppercase'}}>Съедено сегодня</div>
            <div style={{marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6}}>
              <span style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 26, letterSpacing: '-0.02em'}}>{Math.round(eaten.kcal)}</span>
              <span style={{color: t.textMuted, fontSize: 13}}>/ {Math.round(plan.kcal)} ккал</span>
            </div>
            <div style={{marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: '6px 12px'}}>
              <MacroLine label="Б" done={eaten.protein_g} plan={plan.protein_g} t={t}/>
              <MacroLine label="Ж" done={eaten.fat_g} plan={plan.fat_g} t={t}/>
              <MacroLine label="У" done={eaten.carbs_g} plan={plan.carbs_g} t={t}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{flex: 1, overflow: 'auto', padding: '0 20px 20px'}}>
        {dayMeals.map((m) => {
          const isDone = !!mealsDone[m.mealKey];
          const loading = m.mealKey === 'breakfast' && breakfastLoading;

          return (
            <div key={m.mealKey} style={{
              padding: 14, borderRadius: t.radius.lg,
              background: t.surface, border: `1px solid ${t.border}`,
              marginBottom: 10,
              opacity: isDone ? 0.7 : 1,
            }}>
              <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                <button
                  type="button"
                  disabled={!m.canOpen || loading}
                  onClick={() => m.canOpen && onOpenRecipe && onOpenRecipe(m.mealKey)}
                  style={{
                    flex: 1, minWidth: 0, display: 'flex', gap: 12, alignItems: 'center',
                    background: 'none', border: 'none', padding: 0, textAlign: 'left',
                    cursor: m.canOpen ? 'pointer' : 'default', fontFamily: t.fontBody,
                  }}
                >
                  <PhotoSlot t={t} w={72} h={72} radius={t.radius.md} label={m.tag} tone={m.tone} src={m.image} alt={m.title} style={{flexShrink: 0}}/>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                      <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: t.textMuted, letterSpacing: '0.06em'}}>{m.time}</div>
                      <div style={{width: 3, height: 3, borderRadius: 3, background: t.textFaint}}/>
                      <div style={{fontSize: 11, color: t.accent, fontWeight: 600, letterSpacing: '0.02em'}}>{m.tag}</div>
                    </div>
                    <div style={{fontSize: 14.5, fontWeight: 600, color: t.text, marginTop: 4, letterSpacing: '-0.01em', lineHeight: 1.25, textDecoration: isDone ? 'line-through' : 'none', textDecorationColor: t.textFaint}}>
                      {loading ? 'Загрузка рецепта…' : m.title}
                    </div>
                    <div style={{fontSize: 12.5, color: t.textMuted, marginTop: 4}}>
                      {m.kcal ? `${m.kcal} ккал` : '—'} · {m.prepTime || m.time}
                    </div>
                  </div>
                </button>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0}}>
                  {onReplaceMeal && (
                    <MealActionButton
                      t={t}
                      ariaLabel={`Заменить ${m.tag.toLowerCase()}`}
                      accent
                      onClick={() => onReplaceMeal(m.mealKey)}
                    >
                      <Icon name="swap" size={14} stroke={t.accent} sw={2}/>
                    </MealActionButton>
                  )}
                  <MealActionButton
                    t={t}
                    ariaLabel={isDone ? 'Отменить отметку' : 'Отметить съеденным'}
                    active={isDone}
                    onClick={() => onToggleMealDone && onToggleMealDone(m.mealKey)}
                  >
                    {isDone && <Icon name="check" size={16} stroke="#fff" sw={2.5}/>}
                  </MealActionButton>
                </div>
              </div>
            </div>
          );
        })}

        {!breakfastLoading && onBrowseMeals && breakfastCount > 0 && (
          <button
            type="button"
            onClick={() => onBrowseMeals('breakfast')}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: t.radius.lg,
              background: breakfastCount < breakfastExpected ? t.bgSubtle : t.accentSoft,
              border: `1px solid ${breakfastCount < breakfastExpected ? t.borderStrong : t.accent + '33'}`,
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', marginBottom: 10, fontFamily: t.fontBody,
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="meal" size={18} stroke={t.accentText}/>
            </div>
            <div style={{flex: 1, textAlign: 'left'}}>
              <div style={{fontSize: 14, fontWeight: 600, color: t.text}}>Все завтраки</div>
              <div style={{fontSize: 12, color: t.textMuted, marginTop: 2}}>
                {breakfastCount < breakfastExpected
                  ? `Загружено ${breakfastCount} из ${breakfastExpected} — обновите страницу`
                  : `${breakfastCount} рецептов с фото и КБЖУ`}
              </div>
            </div>
            <Icon name="chevronR" size={18} stroke={t.accent}/>
          </button>
        )}

        <div style={{
          marginTop: 16, padding: 16, borderRadius: t.radius.lg,
          background: t.bgSubtle, border: `1px dashed ${t.borderStrong}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{width: 40, height: 40, borderRadius: 12, background: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
