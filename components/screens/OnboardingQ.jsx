// Дополнительные экраны онбординга: зоны, параметры, активность, ограничения, регистрация

// ─── Q2: Зоны внимания (мультивыбор) ─────────────────
function ZonesScreen({t, onNext, onBack}) {
  const zones = [
    {id: 'belly', l: 'Живот и талия', i: 'sparkle'},
    {id: 'hips', l: 'Бёдра и ягодицы', i: 'heart'},
    {id: 'skin', l: 'Кожа лица', i: 'sun'},
    {id: 'hair', l: 'Волосы', i: 'leaf'},
    {id: 'nails', l: 'Ногти', i: 'sparkle'},
    {id: 'tone', l: 'Общий тонус тела', i: 'zap'},
    {id: 'cellulite', l: 'Целлюлит', i: 'droplet'},
    {id: 'edema', l: 'Отёки', i: 'droplet'},
  ];
  const [sel, setSel] = React.useState(new Set(['belly', 'skin', 'tone']));
  const toggle = id => {
    const n = new Set(sel);
    n.has(id) ? n.delete(id) : n.add(id);
    setSel(n);
  };

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 24px 24px'}}>
      <OnboardHeader t={t} step={2} total={7} onBack={onBack}/>

      <div style={{marginTop: 20}}>
        <Display t={t} size={30}>Что хочешь<br/>улучшить?</Display>
        <p style={{marginTop: 8, fontSize: 14, color: t.textMuted}}>
          Отметь всё, что важно — можно несколько.
        </p>
      </div>

      <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto'}}>
        {zones.map(z => {
          const on = sel.has(z.id);
          return (
            <button key={z.id} onClick={() => toggle(z.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderRadius: t.radius.md,
              background: on ? t.text : t.surface,
              color: on ? t.bg : t.text,
              border: `1.5px solid ${on ? t.text : t.border}`,
              cursor: 'pointer', textAlign: 'left',
              fontFamily: t.fontBody,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: on ? 'rgba(255,255,255,0.14)' : t.accentSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={z.i} size={18} stroke={on ? t.bg : t.accent}/>
              </div>
              <div style={{flex: 1, fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em'}}>{z.l}</div>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: on ? t.accent : 'transparent',
                border: on ? 'none' : `1.5px solid ${t.borderStrong}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {on && <Icon name="check" size={14} stroke={t.accentText} sw={3}/>}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{marginTop: 16}}>
        <Button t={t} onClick={onNext} icon={<Icon name="arrow" size={20}/>} style={{width: '100%'}}>
          Продолжить {sel.size > 0 && `· ${sel.size}`}
        </Button>
      </div>
    </div>
  );
}

// ─── Q3: Параметры тела ─────────────────
function StatsScreen({t, onNext, onBack}) {
  const [gender, setGender] = React.useState('f');
  const [age, setAge] = React.useState(27);
  const [weight, setWeight] = React.useState(72);
  const [height, setHeight] = React.useState(165);
  const [target, setTarget] = React.useState(62);

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 24px 24px'}}>
      <OnboardHeader t={t} step={3} total={7} onBack={onBack}/>

      <div style={{marginTop: 20}}>
        <Display t={t} size={30}>Расскажи<br/>о себе</Display>
        <p style={{marginTop: 8, fontSize: 14, color: t.textMuted}}>
          Это нужно для точного расчёта плана. Данные видишь только ты.
        </p>
      </div>

      {/* Gender */}
      <div style={{marginTop: 22, display: 'flex', gap: 10}}>
        {[{id: 'f', l: 'Женщина'}, {id: 'm', l: 'Мужчина'}].map(g => {
          const on = g.id === gender;
          return (
            <button key={g.id} onClick={() => setGender(g.id)} style={{
              flex: 1, padding: '14px 12px', borderRadius: t.radius.md,
              background: on ? t.text : t.surface,
              color: on ? t.bg : t.text,
              border: `1.5px solid ${on ? t.text : t.border}`,
              cursor: 'pointer',
              fontFamily: t.fontBody, fontSize: 15, fontWeight: 600,
            }}>{g.l}</button>
          );
        })}
      </div>

      {/* Age selector — inline number scroller */}
      <div style={{marginTop: 20}}>
        <Label t={t}>Возраст</Label>
        <NumberScroller t={t} value={age} onChange={setAge} min={16} max={80} unit="лет"/>
      </div>

      {/* Weight/Height row */}
      <div style={{marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
        <Field t={t} label="Текущий вес" value={weight} onChange={setWeight} unit="кг" step={0.5} min={35} max={200}/>
        <Field t={t} label="Рост" value={height} onChange={setHeight} unit="см" step={1} min={130} max={220}/>
      </div>

      <div style={{marginTop: 12}}>
        <Field t={t} label="Желаемый вес" value={target} onChange={setTarget} unit="кг" step={0.5} min={35} max={200}
               hint={`Разница: ${(weight - target).toFixed(1)} кг`}/>
      </div>

      <div style={{flex: 1}}/>

      <Button t={t} onClick={onNext} icon={<Icon name="arrow" size={20}/>}>Продолжить</Button>
    </div>
  );
}

function Label({t, children}) {
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 10, letterSpacing: '0.14em',
      color: t.textMuted, textTransform: 'uppercase', marginBottom: 8,
    }}>{children}</div>
  );
}

function NumberScroller({t, value, onChange, min, max, unit}) {
  return (
    <div style={{
      padding: '10px 14px', borderRadius: t.radius.md,
      background: t.surface, border: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} style={{
        width: 34, height: 34, borderRadius: 17, border: `1px solid ${t.border}`,
        background: t.bg, cursor: 'pointer', color: t.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>−</button>
      <div style={{flex: 1, textAlign: 'center'}}>
        <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1, color: t.text}}>
          {value}
        </div>
        <div style={{fontSize: 11, color: t.textMuted, marginTop: 2}}>{unit}</div>
      </div>
      <button onClick={() => onChange(Math.min(max, value + 1))} style={{
        width: 34, height: 34, borderRadius: 17, border: `1px solid ${t.border}`,
        background: t.bg, cursor: 'pointer', color: t.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>+</button>
    </div>
  );
}

function Field({t, label, value, onChange, unit, step, min, max, hint}) {
  return (
    <div>
      <Label t={t}>{label}</Label>
      <div style={{
        padding: '12px 14px', borderRadius: t.radius.md,
        background: t.surface, border: `1px solid ${t.border}`,
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <button onClick={() => onChange(Math.max(min, +(value - step).toFixed(1)))} style={{
            width: 28, height: 28, borderRadius: 14, border: 'none',
            background: t.bgSubtle, cursor: 'pointer', color: t.text, fontSize: 16,
          }}>−</button>
          <div style={{flex: 1, textAlign: 'center'}}>
            <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 24, letterSpacing: '-0.02em', color: t.text, lineHeight: 1}}>
              {value}<span style={{fontSize: 12, color: t.textMuted, marginLeft: 4}}>{unit}</span>
            </div>
          </div>
          <button onClick={() => onChange(Math.min(max, +(value + step).toFixed(1)))} style={{
            width: 28, height: 28, borderRadius: 14, border: 'none',
            background: t.bgSubtle, cursor: 'pointer', color: t.text, fontSize: 16,
          }}>+</button>
        </div>
      </div>
      {hint && <div style={{marginTop: 6, fontSize: 11, color: t.accent, fontWeight: 600}}>{hint}</div>}
    </div>
  );
}

// ─── Q4: Активность ─────────────────
function ActivityScreen({t, onNext, onBack}) {
  const [sel, setSel] = React.useState(1);
  const levels = [
    {i: 'moon', title: 'Малоподвижный', sub: 'Работа за столом, почти нет активности'},
    {i: 'sun', title: 'Умеренный', sub: 'Хожу пешком, иногда тренируюсь'},
    {i: 'zap', title: 'Активный', sub: 'Тренируюсь 3–4 раза в неделю'},
    {i: 'fire', title: 'Очень активный', sub: 'Спорт почти каждый день'},
  ];

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 24px 24px'}}>
      <OnboardHeader t={t} step={4} total={7} onBack={onBack}/>

      <div style={{marginTop: 20}}>
        <Display t={t} size={30}>Твой уровень<br/>активности?</Display>
        <p style={{marginTop: 8, fontSize: 14, color: t.textMuted}}>
          От этого зависит сложность и длительность тренировок.
        </p>
      </div>

      <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10}}>
        {levels.map((l, i) => {
          const on = i === sel;
          return (
            <button key={i} onClick={() => setSel(i)} style={{
              padding: 16, borderRadius: t.radius.lg,
              background: on ? t.text : t.surface,
              color: on ? t.bg : t.text,
              border: `1.5px solid ${on ? t.text : t.border}`,
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14,
              fontFamily: t.fontBody,
              boxShadow: on ? t.shadow : 'none',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: on ? 'rgba(255,255,255,0.14)' : t.accentSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon name={l.i} size={20} stroke={on ? t.bg : t.accent}/>
              </div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 18, letterSpacing: '-0.02em'}}>{l.title}</div>
                <div style={{fontSize: 12.5, opacity: 0.7, marginTop: 3, lineHeight: 1.4}}>{l.sub}</div>
              </div>
              {on && <Icon name="check" size={20} stroke={t.accent} sw={2.5}/>}
            </button>
          );
        })}
      </div>

      <div style={{flex: 1}}/>

      <Button t={t} onClick={onNext} icon={<Icon name="arrow" size={20}/>}>Продолжить</Button>
    </div>
  );
}

// ─── Q5: Ограничения ─────────────────
function RestrictionsScreen({t, onNext, onBack}) {
  const opts = [
    {id: 'veg', l: 'Вегетарианство'},
    {id: 'vegan', l: 'Веганство'},
    {id: 'gluten', l: 'Без глютена'},
    {id: 'lactose', l: 'Без лактозы'},
    {id: 'diabetes', l: 'Диабет (тип 2)'},
    {id: 'nuts', l: 'Аллергия на орехи'},
    {id: 'seafood', l: 'Не ем морепродукты'},
    {id: 'none', l: 'Ничего из перечисленного', exclusive: true},
  ];
  const [sel, setSel] = React.useState(new Set(['none']));

  const toggle = (id, exclusive) => {
    const n = new Set(sel);
    if (exclusive) {
      // если жмём "ничего" — очищаем всё остальное
      n.clear();
      n.add(id);
    } else {
      // если жмём обычный — убираем "ничего"
      n.delete('none');
      n.has(id) ? n.delete(id) : n.add(id);
      if (n.size === 0) n.add('none');
    }
    setSel(n);
  };

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 24px 24px'}}>
      <OnboardHeader t={t} step={5} total={7} onBack={onBack}/>

      <div style={{marginTop: 20}}>
        <Display t={t} size={30}>Особенности<br/>питания?</Display>
        <p style={{marginTop: 8, fontSize: 14, color: t.textMuted}}>
          Мы адаптируем меню — исключим то, что тебе не подходит.
        </p>
      </div>

      <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto'}}>
        {opts.map(o => {
          const on = sel.has(o.id);
          return (
            <button key={o.id} onClick={() => toggle(o.id, o.exclusive)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderRadius: t.radius.md,
              background: on ? t.text : t.surface,
              color: on ? t.bg : t.text,
              border: `1.5px solid ${on ? t.text : t.border}`,
              cursor: 'pointer', textAlign: 'left',
              fontFamily: t.fontBody, fontSize: 15, fontWeight: 500,
              letterSpacing: '-0.01em',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: on ? t.accent : 'transparent',
                border: on ? 'none' : `1.5px solid ${t.borderStrong}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {on && <Icon name="check" size={14} stroke={t.accentText} sw={3}/>}
              </div>
              <span style={{flex: 1}}>{o.l}</span>
            </button>
          );
        })}
      </div>

      <div style={{marginTop: 16}}>
        <Button t={t} onClick={onNext} icon={<Icon name="arrow" size={20}/>} style={{width: '100%'}}>
          Продолжить
        </Button>
      </div>
    </div>
  );
}

// ─── Q6: Чёрный список продуктов ─────────────────
function BlacklistScreen({t, onNext, onBack}) {
  const items = [
    {id: 'fish', emoji: '🐟', l: 'Рыба и морепродукты'},
    {id: 'dairy', emoji: '🥛', l: 'Молочные продукты'},
    {id: 'cottage', emoji: '🧀', l: 'Творог и сыр'},
    {id: 'eggs', emoji: '🥚', l: 'Яйца'},
    {id: 'redmeat', emoji: '🥩', l: 'Красное мясо'},
    {id: 'mushrooms', emoji: '🍄', l: 'Грибы'},
    {id: 'broccoli', emoji: '🥦', l: 'Капуста и брокколи'},
    {id: 'legumes', emoji: '🫘', l: 'Бобовые (фасоль, чечев.)'},
    {id: 'nuts', emoji: '🥜', l: 'Орехи'},
    {id: 'onion', emoji: '🧅', l: 'Лук и чеснок'},
  ];
  const [sel, setSel] = React.useState(new Set());
  const [custom, setCustom] = React.useState('');
  const [customList, setCustomList] = React.useState([]);

  const toggle = (id) => {
    const n = new Set(sel);
    n.delete('none');
    n.has(id) ? n.delete(id) : n.add(id);
    setSel(n);
  };

  const selectNone = () => {
    setSel(new Set(['none']));
  };

  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    setCustomList(prev => [...prev, v]);
    setCustom('');
    const n = new Set(sel);
    n.delete('none');
    n.add(`custom:${v}`);
    setSel(n);
  };

  const handleNext = () => {
    const blacklist = sel.has('none')
      ? []
      : [...sel].filter(id => !id.startsWith('custom:')).concat(customList);
    localStorage.setItem('florae_food_blacklist', JSON.stringify(blacklist));
    onNext();
  };

  const noneSelected = sel.has('none');

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 24px 24px'}}>
      <OnboardHeader t={t} step={6} total={7} onBack={onBack}/>

      <div style={{marginTop: 20}}>
        <Display t={t} size={28}>Что ты точно<br/>не ешь?</Display>
        <p style={{marginTop: 8, fontSize: 14, color: t.textMuted}}>
          Уберём из меню навсегда
        </p>
      </div>

      <div style={{marginTop: 18, flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8}}>
        {items.map(o => {
          const on = !noneSelected && sel.has(o.id);
          return (
            <button key={o.id} onClick={() => toggle(o.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 16px',
              borderRadius: t.radius.md,
              background: on ? t.text : t.surface,
              color: on ? t.bg : t.text,
              border: `1.5px solid ${on ? t.text : t.border}`,
              cursor: 'pointer', textAlign: 'left',
              fontFamily: t.fontBody, fontSize: 15, fontWeight: 500,
            }}>
              <span style={{fontSize: 20, lineHeight: 1}}>{o.emoji}</span>
              <span style={{flex: 1}}>{o.l}</span>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: on ? t.accent : 'transparent',
                border: on ? 'none' : `1.5px solid ${t.borderStrong}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {on && <Icon name="check" size={14} stroke={t.accentText} sw={3}/>}
              </div>
            </button>
          );
        })}

        {customList.map(c => {
          const id = `custom:${c}`;
          const on = !noneSelected && sel.has(id);
          return (
            <button key={id} onClick={() => toggle(id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 16px', borderRadius: t.radius.md,
              background: on ? t.text : t.surface,
              color: on ? t.bg : t.text,
              border: `1.5px solid ${on ? t.text : t.border}`,
              cursor: 'pointer', textAlign: 'left', fontFamily: t.fontBody, fontSize: 15,
            }}>
              <span style={{fontSize: 20}}>✏️</span>
              <span style={{flex: 1}}>{c}</span>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: on ? t.accent : 'transparent',
                border: on ? 'none' : `1.5px solid ${t.borderStrong}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {on && <Icon name="check" size={14} stroke={t.accentText} sw={3}/>}
              </div>
            </button>
          );
        })}

        <div style={{
          display: 'flex', gap: 8, alignItems: 'center',
          padding: '4px 0 8px',
        }}>
          <span style={{fontSize: 20, flexShrink: 0}}>➕</span>
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            placeholder="Добавить своё"
            style={{
              flex: 1, height: 48, padding: '0 14px',
              borderRadius: t.radius.md,
              background: t.surface, border: `1.5px solid ${t.border}`,
              fontFamily: t.fontBody, fontSize: 15, color: t.text, outline: 'none',
            }}
          />
          {custom.trim() && (
            <button onClick={addCustom} style={{
              height: 48, padding: '0 16px', borderRadius: t.radius.md,
              background: t.accent, color: t.accentText, border: 'none',
              fontWeight: 600, cursor: 'pointer', fontSize: 14,
            }}>OK</button>
          )}
        </div>

        <button onClick={selectNone} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', marginTop: 4,
          borderRadius: t.radius.md,
          background: noneSelected ? t.successSoft : t.surface,
          color: t.text,
          border: `1.5px solid ${noneSelected ? t.success : t.border}`,
          cursor: 'pointer', textAlign: 'left',
          fontFamily: t.fontBody, fontSize: 15, fontWeight: 600,
        }}>
          <span style={{fontSize: 18}}>✅</span>
          <span style={{flex: 1}}>Ничего из этого</span>
          {noneSelected && <Icon name="check" size={18} stroke={t.success} sw={2.5}/>}
        </button>
      </div>

      <div style={{marginTop: 12}}>
        <Button t={t} onClick={handleNext} icon={<Icon name="arrow" size={20}/>} style={{width: '100%'}}>
          {noneSelected ? 'Продолжить' : sel.size > 0 ? `Исключить · ${sel.size}` : 'Продолжить'}
        </Button>
      </div>
    </div>
  );
}

// ─── Регистрация ─────────────────
function SignupScreen({t, onNext, onBack}) {
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px 24px'}}>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <button onClick={onBack} style={{width: 38, height: 38, borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <Icon name="close" size={18}/>
        </button>
      </div>

      <div style={{marginTop: 24}}>
        <Display t={t} size={32}>Сохрани<br/>свой прогресс</Display>
        <p style={{marginTop: 12, fontSize: 15, color: t.textMuted, lineHeight: 1.5}}>
          Создай аккаунт, чтобы синхронизировать план на всех устройствах.
        </p>
      </div>

      {/* Соцвходы */}
      <div style={{marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10}}>
        {[
          {i: 'apple', l: 'Продолжить с Apple', dark: true},
          {i: 'google', l: 'Продолжить с Google'},
          {i: 'vk', l: 'Войти через VK ID'},
        ].map(s => (
          <button key={s.i} style={{
            height: 54, padding: '0 20px', borderRadius: t.radius.md,
            background: s.dark ? t.text : t.surface,
            color: s.dark ? t.bg : t.text,
            border: s.dark ? 'none' : `1.5px solid ${t.border}`,
            fontFamily: t.fontBody, fontSize: 15, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer',
          }}>
            <div style={{width: 22, textAlign: 'center'}}>
              {s.i === 'apple' && <span style={{fontSize: 20}}></span>}
              {s.i === 'google' && <div style={{width: 20, height: 20, borderRadius: 10, background: 'conic-gradient(#EA4335 0 25%, #FBBC05 25% 50%, #34A853 50% 75%, #4285F4 75% 100%)'}}/>}
              {s.i === 'vk' && <div style={{width: 22, height: 22, borderRadius: 6, background: '#0077FF', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>VK</div>}
            </div>
            <span style={{flex: 1, textAlign: 'left'}}>{s.l}</span>
          </button>
        ))}
      </div>

      {/* Разделитель */}
      <div style={{margin: '24px 0 20px', display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{flex: 1, height: 1, background: t.border}}/>
        <div style={{fontSize: 12, color: t.textMuted, letterSpacing: '0.04em'}}>или email</div>
        <div style={{flex: 1, height: 1, background: t.border}}/>
      </div>

      {/* Email */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        <input placeholder="Твой email" style={{
          height: 54, padding: '0 18px', borderRadius: t.radius.md,
          background: t.surface, border: `1.5px solid ${t.border}`,
          fontFamily: t.fontBody, fontSize: 15, color: t.text, outline: 'none',
        }}/>
        <input placeholder="Пароль" type="password" style={{
          height: 54, padding: '0 18px', borderRadius: t.radius.md,
          background: t.surface, border: `1.5px solid ${t.border}`,
          fontFamily: t.fontBody, fontSize: 15, color: t.text, outline: 'none',
        }}/>
      </div>

      <div style={{flex: 1}}/>

      <Button t={t} onClick={onNext} icon={<Icon name="arrow" size={20}/>}>Создать аккаунт</Button>

      <div style={{marginTop: 12, textAlign: 'center', fontSize: 12, color: t.textFaint, lineHeight: 1.5}}>
        Продолжая, ты принимаешь <span style={{textDecoration: 'underline'}}>условия</span> и <span style={{textDecoration: 'underline'}}>политику</span>
      </div>
    </div>
  );
}

window.ZonesScreen = ZonesScreen;
window.StatsScreen = StatsScreen;
window.ActivityScreen = ActivityScreen;
window.RestrictionsScreen = RestrictionsScreen;
window.BlacklistScreen = BlacklistScreen;
window.SignupScreen = SignupScreen;
