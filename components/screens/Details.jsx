// Детальные экраны: полный рецепт, обзор тренировки, все награды, bottom sheet ужина, награда

const RECIPE_POOL = [
  {id: 'salmon-salad', title: 'Салат с лососем и авокадо', kcal: 310, time: '20 мин', tone: 'green', tag: 'Ужин'},
  {id: 'turkey-zucchini', title: 'Индейка с кабачками', kcal: 290, time: '25 мин', tone: 'warm', tag: 'Ужин'},
  {id: 'egg-veg', title: 'Омлет с овощами', kcal: 280, time: '15 мин', tone: 'coral', tag: 'Ужин'},
  {id: 'fish-lemon', title: 'Запечённая рыба с лимоном', kcal: 300, time: '30 мин', tone: 'green', tag: 'Ужин'},
  {id: 'cottage-greens', title: 'Творог с зеленью', kcal: 260, time: '10 мин', tone: 'warm', tag: 'Ужин'},
  {id: 'veg-stew', title: 'Тушёные овощи с индейкой', kcal: 295, time: '25 мин', tone: 'green', tag: 'Ужин'},
];

function getDislikedRecipes() {
  try { return JSON.parse(localStorage.getItem('florae_disliked_recipes') || '[]'); }
  catch { return []; }
}

function addDislikedRecipe(id) {
  const list = getDislikedRecipes();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem('florae_disliked_recipes', JSON.stringify(list));
  }
}

function getAvailableAlternatives(excludeId) {
  const disliked = new Set(getDislikedRecipes());
  if (excludeId) disliked.add(excludeId);
  return RECIPE_POOL.filter(r => !disliked.has(r.id));
}

// ─── Замена блюда — 3 альтернативы ─────────────
function ReplaceMealSheet({t, currentTitle, currentId, onClose, onSelect}) {
  const [options, setOptions] = React.useState(() => getAvailableAlternatives(currentId).slice(0, 3));
  const [applied, setApplied] = React.useState(false);
  const [selectedTitle, setSelectedTitle] = React.useState('');

  const handleDislike = (recipe) => {
    addDislikedRecipe(recipe.id);
    setOptions(prev => {
      const next = prev.filter(r => r.id !== recipe.id);
      const pool = getAvailableAlternatives(currentId).filter(r => !next.some(o => o.id === r.id));
      if (pool.length > 0 && next.length < 3) next.push(pool[0]);
      return next;
    });
  };

  const handleSelect = (recipe) => {
    setSelectedTitle(recipe.title);
    setApplied(true);
    setTimeout(() => onSelect(recipe), 600);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 25,
      display: 'flex', flexDirection: 'column',
      background: 'rgba(0,0,0,0.45)',
      animation: 'fadeIn 0.2s',
    }} onClick={onClose}>
      <div style={{flex: 1}} onClick={onClose}/>
      <div onClick={e => e.stopPropagation()} style={{
        background: t.bg,
        borderTopLeftRadius: t.radius.xl,
        borderTopRightRadius: t.radius.xl,
        padding: '10px 0 0',
        maxHeight: '88%',
        animation: 'slideUp 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)',
      }}>
        <div style={{width: 40, height: 4, borderRadius: 2, background: t.borderStrong, margin: '0 auto 12px'}}/>

        <div style={{padding: '0 24px 16px'}}>
          <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: t.textMuted, letterSpacing: '0.14em'}}>
            ЗАМЕНА · УЖИН
          </div>
          <Display t={t} size={22} style={{marginTop: 6}}>
            {applied ? 'Замена применена!' : 'Выбери альтернативу'}
          </Display>
          {!applied && (
            <p style={{marginTop: 6, fontSize: 13, color: t.textMuted, lineHeight: 1.45}}>
              Варианты уже отфильтрованы по твоим ограничениям и чёрному списку.
            </p>
          )}
        </div>

        <div style={{overflow: 'auto', padding: '0 20px 8px'}}>
          {applied ? (
            <div style={{
              padding: 24, borderRadius: t.radius.lg,
              background: t.successSoft, textAlign: 'center',
              margin: '8px 4px 16px',
            }}>
              <Icon name="checkCircle" size={40} stroke={t.success} sw={2}/>
              <div style={{marginTop: 12, fontSize: 16, fontWeight: 600, color: t.text}}>{selectedTitle}</div>
              <div style={{fontSize: 13, color: t.textMuted, marginTop: 4}}>Теперь это твоё блюдо на сегодня</div>
            </div>
          ) : options.length === 0 ? (
            <div style={{padding: 24, textAlign: 'center', color: t.textMuted, fontSize: 14}}>
              Больше подходящих вариантов нет. Попробуй изменить чёрный список в профиле.
            </div>
          ) : options.map(recipe => (
            <div key={recipe.id} style={{
              padding: 14, borderRadius: t.radius.lg,
              background: t.surface, border: `1px solid ${t.border}`,
              marginBottom: 10,
            }}>
              <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                <PhotoSlot t={t} w={72} h={72} radius={t.radius.md} label={recipe.tag} tone={recipe.tone} style={{flexShrink: 0}}/>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 15, fontWeight: 600, color: t.text, lineHeight: 1.25}}>{recipe.title}</div>
                  <div style={{fontSize: 12.5, color: t.textMuted, marginTop: 4}}>{recipe.kcal} ккал · {recipe.time}</div>
                </div>
              </div>
              <div style={{display: 'flex', gap: 8, marginTop: 12}}>
                <button onClick={() => handleDislike(recipe)} style={{
                  flex: 1, padding: '10px 12px', borderRadius: t.radius.md,
                  background: t.bgSubtle, border: `1px solid ${t.border}`,
                  color: t.textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: t.fontBody,
                }}>
                  Не нравится
                </button>
                <button onClick={() => handleSelect(recipe)} style={{
                  flex: 1.4, padding: '10px 12px', borderRadius: t.radius.md,
                  background: t.accent, border: 'none',
                  color: t.accentText, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: t.fontBody,
                }}>
                  Выбрать
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{padding: '12px 24px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: `1px solid ${t.border}`}}>
          <button onClick={onClose} style={{
            width: '100%', padding: '14px', borderRadius: t.radius.md,
            background: 'transparent', border: `1.5px solid ${t.border}`,
            color: t.text, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: t.fontBody,
          }}>
            {applied ? 'Закрыть' : 'Отмена'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Sheet — карточка ужина/задания ─────────────
function MealSheet({t, onClose, onDone, onReplace, mealTitle = 'Куриная грудка с брокколи'}) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      display: 'flex', flexDirection: 'column',
      background: 'rgba(0,0,0,0.4)',
    }} onClick={onClose}>
      <div style={{flex: 1}}/>
      <div onClick={e => e.stopPropagation()} style={{
        background: t.bg,
        borderTopLeftRadius: t.radius.xl,
        borderTopRightRadius: t.radius.xl,
        padding: '10px 0 0',
        display: 'flex', flexDirection: 'column',
        maxHeight: '85%',
        animation: 'slideUp 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: t.borderStrong, margin: '0 auto 8px',
        }}/>
        <div style={{overflow: 'auto', padding: '8px 24px 20px'}}>
          <PhotoSlot t={t} h={180} radius={t.radius.lg} label="фото · ужин · курица с брокколи" tone="warm"/>

          <div style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 6}}>
            <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: t.textMuted, letterSpacing: '0.14em'}}>19:00 · УЖИН</div>
          </div>
          <Display t={t} size={22} style={{marginTop: 6}}>
            {mealTitle}
          </Display>

          {/* Метрики */}
          <div style={{marginTop: 14, display: 'flex', gap: 10}}>
            {[
              {l: 'ккал', v: '320'},
              {l: 'белки', v: '38г'},
              {l: 'жиры', v: '8г'},
              {l: 'углев.', v: '12г'},
            ].map(m => (
              <div key={m.l} style={{flex: 1, padding: '10px 8px', borderRadius: t.radius.md, background: t.surface, border: `1px solid ${t.border}`, textAlign: 'center'}}>
                <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 18, letterSpacing: '-0.02em'}}>{m.v}</div>
                <div style={{fontSize: 10.5, color: t.textMuted, marginTop: 2}}>{m.l}</div>
              </div>
            ))}
          </div>

          {/* Ингредиенты — короткий список */}
          <div style={{marginTop: 20}}>
            <Label t={t}>ИНГРЕДИЕНТЫ · 1 ПОРЦИЯ</Label>
            {[
              ['Куриная грудка', '150 г'],
              ['Брокколи', '100 г'],
              ['Морковь', '80 г'],
              ['Оливковое масло', '1 ч.л.'],
            ].map(([n, q]) => (
              <div key={n} style={{
                display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                borderBottom: `1px solid ${t.border}`, fontSize: 14,
              }}>
                <span style={{color: t.text}}>{n}</span>
                <span style={{color: t.textMuted, fontWeight: 500}}>{q}</span>
              </div>
            ))}
          </div>

          <button style={{
            marginTop: 14, width: '100%', padding: '12px', borderRadius: t.radius.md,
            background: 'transparent', border: `1.5px solid ${t.border}`,
            color: t.text, cursor: 'pointer',
            fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            Полный рецепт <Icon name="arrow" size={16}/>
          </button>

          {onReplace && (
            <button onClick={onReplace} style={{
              marginTop: 10, width: '100%', padding: '12px', borderRadius: t.radius.md,
              background: t.accentSoft, border: `1.5px solid ${t.accent}44`,
              color: t.accent, cursor: 'pointer',
              fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Icon name="meal" size={16} stroke={t.accent}/> Заменить ужин
            </button>
          )}
        </div>

        <div style={{padding: '12px 24px calc(20px + env(safe-area-inset-bottom, 0px))', borderTop: `1px solid ${t.border}`, background: t.surface, display: 'flex', gap: 10}}>
          <Button t={t} variant="secondary" size="lg" style={{flex: '0 0 auto', width: 54, padding: 0}}>
            <Icon name="close" size={20}/>
          </Button>
          <Button t={t} onClick={onDone} icon={<Icon name="check" size={18} sw={2.5}/>} style={{flex: 1}}>
            Съедено
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Экран полного рецепта ─────────────
function RecipeScreen({t, onBack, onDone, onReplace, title = 'Куриная грудка с брокколи'}) {
  const [portions, setPortions] = React.useState(1);
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      {/* Заголовочное фото */}
      <div style={{position: 'relative'}}>
        <PhotoSlot t={t} h={280} radius={0} label="фото · курица с брокколи · крупным планом" tone="warm"/>
        <button onClick={onBack} style={{
          position: 'absolute', top: 12, left: 20, width: 42, height: 42,
          borderRadius: 22, background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Icon name="arrowLeft" size={20}/>
        </button>
        <button style={{
          position: 'absolute', top: 12, right: 20, width: 42, height: 42,
          borderRadius: 22, background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Icon name="heart" size={20}/>
        </button>
      </div>

      <div style={{flex: 1, overflow: 'auto', padding: '20px 24px 20px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
          <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: t.accent, letterSpacing: '0.14em'}}>УЖИН · 25 МИН</div>
        </div>
        <Display t={t} size={28} style={{marginTop: 6}}>{title}</Display>

        {/* Rating */}
        <div style={{marginTop: 12, display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: t.textMuted}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
            <Icon name="star" size={14} stroke={t.warn} fill={t.warn}/>
            <b style={{color: t.text}}>4.8</b>
            <span>· 234 отзыва</span>
          </div>
          <div style={{width: 3, height: 3, borderRadius: 3, background: t.textFaint}}/>
          <span>94% рекомендуют</span>
        </div>

        {/* KPI карточка */}
        <div style={{
          marginTop: 18, padding: 14, borderRadius: t.radius.lg,
          background: t.bgSubtle, display: 'flex',
        }}>
          {[
            {l: 'ккал', v: 320},
            {l: 'белки', v: '38г'},
            {l: 'жиры', v: '8г'},
            {l: 'углев.', v: '12г'},
          ].map((m, i) => (
            <div key={m.l} style={{
              flex: 1, textAlign: 'center',
              borderLeft: i === 0 ? 'none' : `1px solid ${t.border}`,
            }}>
              <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 20, letterSpacing: '-0.02em', color: t.text}}>{m.v}</div>
              <div style={{fontSize: 10.5, color: t.textMuted, marginTop: 2}}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* Порции */}
        <div style={{marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Label t={t}>ПОРЦИИ</Label>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px', background: t.surface, borderRadius: 999, border: `1px solid ${t.border}`}}>
            <button onClick={() => setPortions(Math.max(1, portions - 1))} style={{width: 30, height: 30, borderRadius: 15, background: t.bgSubtle, border: 'none', cursor: 'pointer', fontSize: 16, color: t.text}}>−</button>
            <span style={{fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: 'center'}}>{portions}</span>
            <button onClick={() => setPortions(portions + 1)} style={{width: 30, height: 30, borderRadius: 15, background: t.bgSubtle, border: 'none', cursor: 'pointer', fontSize: 16, color: t.text}}>+</button>
          </div>
        </div>

        {/* Ингредиенты */}
        <div style={{marginTop: 12}}>
          {[
            ['Куриная грудка', 150, 'г'],
            ['Брокколи', 100, 'г'],
            ['Морковь', 80, 'г'],
            ['Оливковое масло', 1, 'ч.л.'],
            ['Соль, специи', 0, 'по вкусу'],
          ].map(([n, q, u]) => (
            <div key={n} style={{
              display: 'flex', justifyContent: 'space-between', padding: '10px 0',
              borderBottom: `1px solid ${t.border}`, fontSize: 14,
            }}>
              <span style={{color: t.text}}>{n}</span>
              <span style={{color: t.textMuted, fontWeight: 500}}>
                {q ? `${q * portions} ${u}` : u}
              </span>
            </div>
          ))}
        </div>

        {/* Шаги приготовления */}
        <div style={{marginTop: 24}}>
          <Label t={t}>ПРИГОТОВЛЕНИЕ</Label>
          {[
            'Нарежь курицу небольшими кубиками, посоли и поперчи.',
            'Разогрей сковороду с оливковым маслом на среднем огне.',
            'Обжарь курицу 7 минут, помешивая, до золотистой корочки.',
            'Добавь нарезанные брокколи и морковь. Туши под крышкой 10 минут.',
            'Подавай сразу — с зеленью или лимоном по вкусу.',
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '12px 0',
              borderBottom: i < 4 ? `1px solid ${t.border}` : 'none',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 13, flexShrink: 0,
                background: t.accent, color: t.accentText,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 13,
              }}>{i + 1}</div>
              <div style={{fontSize: 14, lineHeight: 1.5, color: t.text, paddingTop: 3}}>{step}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding: '12px 24px calc(12px + env(safe-area-inset-bottom, 0px))', borderTop: `1px solid ${t.border}`, background: t.surface, display: 'flex', flexDirection: 'column', gap: 8}}>
        {onReplace && (
          <button onClick={onReplace} style={{
            width: '100%', padding: '12px', borderRadius: t.radius.md,
            background: t.accentSoft, border: `1.5px solid ${t.accent}44`,
            color: t.accent, cursor: 'pointer',
            fontFamily: t.fontBody, fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name="meal" size={16} stroke={t.accent}/> Заменить блюдо
          </button>
        )}
        <Button t={t} onClick={onDone} icon={<Icon name="check" size={18} sw={2.5}/>} style={{width: '100%'}}>
          Отметить съеденным
        </Button>
      </div>
    </div>
  );
}

// ─── Обзор тренировки (список упражнений) ─────────────
function WorkoutOverviewScreen({t, onStart, onBack}) {
  const exercises = [
    {n: 1, title: 'Разминка', sub: '5 минут · всё тело', icon: 'sun', tone: 'coral'},
    {n: 2, title: 'Приседания', sub: '3 × 15 повторений', icon: 'zap', tone: 'lavender'},
    {n: 3, title: 'Планка', sub: '3 × 30 секунд', icon: 'fire', tone: 'warm'},
    {n: 4, title: 'Растяжка', sub: '5 минут · заминка', icon: 'leaf', tone: 'green'},
  ];

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: '4px 24px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <button onClick={onBack} style={{width: 40, height: 40, borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <Icon name="arrowLeft" size={18}/>
        </button>
        <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: t.textMuted, letterSpacing: '0.14em'}}>ДЕНЬ 7 · ЛЁГКАЯ</div>
        <button style={{width: 40, height: 40, borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <Icon name="settings" size={18}/>
        </button>
      </div>

      <div style={{padding: '16px 24px 4px'}}>
        <Display t={t} size={30}>Мягкая тренировка<br/>для тела</Display>
        <div style={{marginTop: 10, display: 'flex', gap: 14, fontSize: 13.5, color: t.textMuted}}>
          <span style={{display: 'flex', alignItems: 'center', gap: 5}}><Icon name="clock" size={14} stroke={t.textMuted}/> 20 минут</span>
          <span style={{display: 'flex', alignItems: 'center', gap: 5}}><Icon name="fire" size={14} stroke={t.textMuted}/> ~120 ккал</span>
          <span style={{display: 'flex', alignItems: 'center', gap: 5}}><Icon name="heart" size={14} stroke={t.textMuted}/> без инвентаря</span>
        </div>
      </div>

      <div style={{flex: 1, overflow: 'auto', padding: '20px 20px 20px'}}>
        {exercises.map((e, i) => (
          <div key={e.n} style={{
            display: 'flex', gap: 12, alignItems: 'center',
            padding: 14, borderRadius: t.radius.lg,
            background: t.surface, border: `1px solid ${t.border}`,
            marginBottom: 10,
          }}>
            <PhotoSlot t={t} w={64} h={64} radius={t.radius.md} label={`шаг ${e.n}`} tone={e.tone} style={{flexShrink: 0}}/>
            <div style={{flex: 1}}>
              <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: t.textMuted, letterSpacing: '0.14em'}}>УПРАЖНЕНИЕ 0{e.n}</div>
              <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 18, letterSpacing: '-0.02em', color: t.text, marginTop: 3}}>{e.title}</div>
              <div style={{fontSize: 12.5, color: t.textMuted, marginTop: 3}}>{e.sub}</div>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: 17,
              background: t.bgSubtle,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.textMuted,
            }}>
              <Icon name="play" size={14} stroke={t.text}/>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding: '12px 24px 12px', borderTop: `1px solid ${t.border}`, background: t.surface}}>
        <Button t={t} onClick={onStart} icon={<Icon name="play" size={18} stroke={t.accentText}/>} style={{width: '100%'}}>
          Начать тренировку
        </Button>
      </div>
    </div>
  );
}

// ─── Все награды ─────────────
function AwardsScreen({t, onBack}) {
  const groups = [
    {
      title: 'Серии', tone: 'coral',
      items: [
        {i: 'fire', l: '7 дней', on: true},
        {i: 'fire', l: '14 дней', on: true},
        {i: 'fire', l: '30 дней', on: false},
        {i: 'fire', l: '60 дней', on: false},
      ],
    },
    {
      title: 'Питание', tone: 'warm',
      items: [
        {i: 'meal', l: 'Первый день', on: true},
        {i: 'meal', l: 'Неделя без срывов', on: true},
        {i: 'meal', l: '30 дней подряд', on: false},
        {i: 'meal', l: 'Шеф-повар', on: false},
      ],
    },
    {
      title: 'Тренировки', tone: 'lavender',
      items: [
        {i: 'zap', l: 'Первый шаг', on: true},
        {i: 'zap', l: '10 тренировок', on: true},
        {i: 'zap', l: 'Марафон', on: false},
      ],
    },
    {
      title: 'Гидратация', tone: 'green',
      items: [
        {i: 'droplet', l: '1 литр', on: true},
        {i: 'droplet', l: '2 литра', on: false},
      ],
    },
  ];

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: '4px 24px 16px', display: 'flex', alignItems: 'center', gap: 12}}>
        <button onClick={onBack} style={{width: 40, height: 40, borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <Icon name="arrowLeft" size={18}/>
        </button>
        <Display t={t} size={22}>Мои награды</Display>
      </div>

      <div style={{padding: '0 24px 16px'}}>
        <div style={{
          padding: 20, borderRadius: t.radius.xl,
          background: `linear-gradient(160deg, ${t.text} 0%, oklch(28% 0.03 40) 100%)`,
          color: t.bg, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: 200, background: t.accent, opacity: 0.35, filter: 'blur(30px)'}}/>
          <div style={{position: 'relative'}}>
            <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', opacity: 0.6}}>СОБРАНО НАГРАД</div>
            <div style={{marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 8}}>
              <span style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 56, letterSpacing: '-0.03em', lineHeight: 1}}>17</span>
              <span style={{fontSize: 16, opacity: 0.65}}>из 80</span>
            </div>
            <div style={{marginTop: 12}}>
              <div style={{height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.14)', overflow: 'hidden'}}>
                <div style={{width: '21%', height: '100%', background: t.accent, borderRadius: 6}}/>
              </div>
              <div style={{marginTop: 6, fontSize: 12, opacity: 0.7}}>Следующая: <b style={{opacity: 1}}>«14 дней подряд»</b> — через 7 дней</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{flex: 1, overflow: 'auto', padding: '0 20px 20px'}}>
        {groups.map(g => (
          <div key={g.title} style={{marginBottom: 22}}>
            <Label t={t}>{g.title.toUpperCase()}</Label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8}}>
              {g.items.map((it, i) => (
                <div key={i} style={{
                  padding: '14px 8px 12px', borderRadius: t.radius.md,
                  background: t.surface, border: `1px solid ${t.border}`,
                  textAlign: 'center',
                  opacity: it.on ? 1 : 0.5,
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 23, margin: '0 auto',
                    background: it.on ? t.text : t.bgSubtle,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={it.i} size={22} stroke={it.on ? t.accent : t.textFaint} sw={1.5}/>
                  </div>
                  <div style={{fontSize: 11, marginTop: 6, color: t.text, fontWeight: 500, lineHeight: 1.2}}>{it.l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button style={{
          width: '100%', height: 50, borderRadius: t.radius.md,
          background: t.surface, border: `1.5px solid ${t.border}`,
          color: t.text, cursor: 'pointer',
          fontFamily: t.fontBody, fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="sparkle" size={16}/> Поделиться в соцсетях
        </button>
      </div>
    </div>
  );
}

// ─── Оверлей награды (после выполнения) ─────────────
function RewardOverlay({t, onClose}) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.25s',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        margin: '0 32px', padding: '32px 24px 24px',
        background: t.bg, borderRadius: t.radius.xl,
        textAlign: 'center', position: 'relative',
        animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          width: 96, height: 96, borderRadius: 48, margin: '0 auto',
          background: `radial-gradient(circle at 30% 30%, ${t.accent}, oklch(58% 0.18 25))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 32px ${t.accent}66`,
          position: 'relative',
        }}>
          <Icon name="fire" size={44} stroke="#fff" fill="rgba(255,255,255,0.2)" sw={2}/>
          {/* Sparkles вокруг */}
          {[0, 60, 120, 180, 240, 300].map(deg => (
            <div key={deg} style={{
              position: 'absolute',
              width: 8, height: 8, borderRadius: 4,
              background: t.warn,
              transform: `rotate(${deg}deg) translateY(-60px)`,
              transformOrigin: 'center',
            }}/>
          ))}
        </div>

        <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.16em', color: t.accent, marginTop: 20}}>НОВАЯ НАГРАДА</div>
        <Display t={t} size={26} style={{marginTop: 8}}>Неделя<br/>без пропусков</Display>
        <div style={{marginTop: 10, fontSize: 13.5, color: t.textMuted, lineHeight: 1.5, maxWidth: 260, margin: '10px auto 0'}}>
          7 дней подряд ты держишь свой ритм. Так и рождаются привычки.
        </div>

        <div style={{marginTop: 20, display: 'flex', gap: 10}}>
          <Button t={t} variant="secondary" onClick={onClose} style={{flex: 1}}>Позже</Button>
          <Button t={t} onClick={onClose} icon={<Icon name="sparkle" size={16} stroke={t.accentText}/>} style={{flex: 1.4}}>Поделиться</Button>
        </div>
      </div>
    </div>
  );
}

window.MealSheet = MealSheet;
window.ReplaceMealSheet = ReplaceMealSheet;
window.RecipeScreen = RecipeScreen;
window.WorkoutOverviewScreen = WorkoutOverviewScreen;
window.AwardsScreen = AwardsScreen;
window.RewardOverlay = RewardOverlay;
