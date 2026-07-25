// Экраны онбординга: Splash, ValueSlider, GoalSelect, PlanGeneration, Paywall

// ─────────────────────────────────────────────────────────
// 1. SPLASH
function SplashScreen({t, onNext, onLogin}) {
  const isWarm = t.tag === 'Warm Editorial';
  const isPlayful = t.tag === 'Bold Playful';
  const isClean = t.tag === 'Clean Premium';

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      padding: '40px 28px 28px',
      background: isPlayful
        ? `radial-gradient(120% 80% at 50% 0%, ${t.accentSoft} 0%, ${t.bg} 55%)`
        : isWarm
          ? `radial-gradient(100% 60% at 50% 100%, ${t.accentSoft} 0%, ${t.bg} 70%)`
          : t.bg,
    }}>
      {/* Логотип-марка */}
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div style={{
          width: 34, height: 34, borderRadius: isClean ? 8 : 12,
          background: t.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: t.accentText,
        }}>
          <Icon name="leaf" size={20} stroke={t.accentText}/>
        </div>
        <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontSize: 20, fontStyle: t.displayItalic ? 'italic' : 'normal', letterSpacing: '-0.02em'}}>
          florae
        </div>
      </div>

      {/* Центр */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingBottom: 40}}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: t.accent, marginBottom: 20,
        }}>ПРОГРАММА · 30 ДНЕЙ</div>

        <Display t={t} size={54}>
          Твоё{' '}<br/>
          <span style={{color: t.accent}}>идеальное</span>{' '}<br/>
          тело —<br/>
          начинается<br/>
          сегодня.
        </Display>

        <div style={{marginTop: 24, fontSize: 15, lineHeight: 1.55, color: t.textMuted, maxWidth: 300}}>
          Питание, движение и уход за собой — в одном спокойном ритме.
        </div>
      </div>

      {/* Кнопки */}
      <Button t={t} onClick={onNext} icon={<Icon name="arrow" size={20}/>}>
        Начать
      </Button>
      <div style={{textAlign: 'center', marginTop: 14, fontSize: 14, color: t.textMuted}}>
        Уже есть аккаунт?{' '}
        <button type="button" onClick={onLogin} style={{
          background: 'none', border: 'none', padding: 0,
          color: t.text, fontWeight: 600, textDecoration: 'underline',
          textUnderlineOffset: 3, cursor: 'pointer', fontSize: 'inherit',
        }}>Войти</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 2. VALUE SLIDER (3 слайда, показываем один активный)
function ValueSliderScreen({t, onNext, slideIndex = 0, onSlideChange}) {
  const slides = [
    {
      kicker: 'ПИТАНИЕ',
      title: 'Готовое меню\nна каждый день',
      body: 'Никаких расчётов и подсчёта калорий. Только вкусные рецепты, подобранные под твои цели и вкусы.',
      photo: 'фото · тарелка с боулом',
      tone: 'warm',
    },
    {
      kicker: 'ДВИЖЕНИЕ И УХОД',
      title: 'Спорт и красота —\nв одном ритме',
      body: 'Короткие тренировки дома, уходовые ритуалы и практики — всё синхронизировано с твоим циклом.',
      photo: 'фото · спокойная девушка на коврике',
      tone: 'green',
    },
    {
      kicker: 'РЕЗУЛЬТАТ',
      title: '127 000 женщин\nуже нашли свой ритм',
      body: 'Средний результат за 30 дней: −4.8 кг и стабильное самочувствие без стресса и запретов.',
      photo: 'фото · портрет · улыбка',
      tone: 'lavender',
    },
  ];
  const s = slides[slideIndex];

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px 28px'}}>
      {/* skip */}
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 12}}>
        <button onClick={onNext} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: t.fontBody, fontSize: 14, color: t.textMuted, padding: 8,
        }}>Пропустить</button>
      </div>

      {/* Фото */}
      <PhotoSlot t={t} h={360} radius={t.radius.xl} label={s.photo} tone={s.tone}/>

      {/* Текст */}
      <div style={{marginTop: 32}}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.14em', color: t.accent, marginBottom: 12,
        }}>{s.kicker}</div>
        <Display t={t} size={30} style={{whiteSpace: 'pre-line'}}>{s.title}</Display>
        <p style={{marginTop: 14, fontSize: 15, lineHeight: 1.5, color: t.textMuted}}>
          {s.body}
        </p>
      </div>

      <div style={{flex: 1}}/>

      {/* точки */}
      <div style={{display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20}}>
        {slides.map((_, i) => (
          <div key={i}
               onClick={() => onSlideChange && onSlideChange(i)}
               style={{
            width: i === slideIndex ? 22 : 6,
            height: 6, borderRadius: 6,
            background: i === slideIndex ? t.accent : t.borderStrong,
            transition: 'width 0.3s',
            cursor: 'pointer',
          }}/>
        ))}
      </div>

      <Button t={t} onClick={() => {
        if (slideIndex < slides.length - 1) onSlideChange && onSlideChange(slideIndex + 1);
        else onNext();
      }} icon={<Icon name="arrow" size={20}/>}>
        {slideIndex < slides.length - 1 ? 'Дальше' : 'Начать путь'}
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 3. GOAL SELECT (первый вопрос онбординга)
function GoalSelectScreen({t, onNext, onBack}) {
  const [sel, setSel] = React.useState(0);
  const goals = [
    {id: 'lose', title: 'Похудеть', sub: '−3 до −15 кг', icon: 'fire', tone: 'coral'},
    {id: 'maintain', title: 'Держать вес', sub: 'без скачков', icon: 'heart', tone: 'lavender'},
    {id: 'beauty', title: 'Уход за собой', sub: 'кожа, волосы, тонус', icon: 'sparkle', tone: 'warm'},
    {id: 'shape', title: 'Набрать форму', sub: 'мышцы и рельеф', icon: 'zap', tone: 'green'},
  ];

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 24px 24px'}}>
      {/* header */}
      <OnboardHeader t={t} step={1} total={7} onBack={onBack}/>

      <div style={{marginTop: 20}}>
        <Display t={t} size={30}>Какая твоя<br/>главная цель?</Display>
        <p style={{marginTop: 10, fontSize: 14, color: t.textMuted, lineHeight: 1.5}}>
          От этого зависит, как мы составим твой план на 30 дней.
        </p>
      </div>

      <div style={{
        marginTop: 26,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
      }}>
        {goals.map((g, i) => {
          const on = i === sel;
          return (
            <button key={g.id} onClick={() => setSel(i)} style={{
              position: 'relative',
              aspectRatio: '1',
              padding: 16,
              borderRadius: t.radius.lg,
              background: on ? t.text : t.surface,
              color: on ? t.bg : t.text,
              border: `1.5px solid ${on ? t.text : t.border}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              fontFamily: t.fontBody,
              textAlign: 'left',
              boxShadow: on ? t.shadowLg : 'none',
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: t.radius.md,
                background: on ? 'rgba(255,255,255,0.12)' : t.bgSubtle,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={g.icon} size={22} stroke={on ? t.bg : t.accent}/>
              </div>
              <div>
                <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1.1}}>{g.title}</div>
                <div style={{fontSize: 12.5, marginTop: 4, opacity: on ? 0.7 : 0.6}}>{g.sub}</div>
              </div>
              {on && (
                <div style={{position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: 22, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="check" size={14} stroke={t.accentText} sw={2.5}/>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{flex: 1}}/>

      <Button t={t} onClick={onNext} icon={<Icon name="arrow" size={20}/>}>
        Продолжить
      </Button>
    </div>
  );
}

// хедер онбординга — шаг X из Y + назад
function OnboardHeader({t, step, total, onBack}) {
  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        {onBack && (
          <button onClick={onBack} style={{
            width: 38, height: 38, borderRadius: 20,
            border: `1px solid ${t.border}`, background: t.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: t.text,
          }}>
            <Icon name="arrowLeft" size={18}/>
          </button>
        )}
        <div style={{flex: 1}}>
          <LinearProgress t={t} value={step / total} height={5}/>
        </div>
        <div style={{fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: t.textMuted, letterSpacing: '0.06em'}}>
          {String(step).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 4. PLAN GENERATION — момент «Вау»
function PlanGenerationScreen({t, onNext}) {
  const [progress, setProgress] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const steps = [
    'Анализ твоих целей',
    'Расчёт калорий и БЖУ',
    'Подбор рецептов',
    'Адаптация тренировок',
  ];

  React.useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 1) { clearInterval(iv); return 1; }
        const next = Math.min(1, p + 0.012);
        setStep(Math.min(steps.length, Math.floor(next * steps.length + 0.001)));
        return next;
      });
    }, 45);
    return () => clearInterval(iv);
  }, []);

  const done = progress >= 1;

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      padding: '32px 28px 28px',
      background: done
        ? `linear-gradient(180deg, ${t.accentSoft} 0%, ${t.bg} 60%)`
        : t.bg,
      transition: 'background 0.6s',
    }}>
      {!done ? (
        <>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Ring size={200} stroke={6} value={progress}
                  color={t.accent} track={t.border}>
              <div style={{fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontStyle: t.displayItalic ? 'italic' : 'normal', fontSize: 48, letterSpacing: '-0.03em'}}>
                {Math.round(progress * 100)}<span style={{fontSize: 20, opacity: 0.5}}>%</span>
              </div>
            </Ring>
            <div style={{marginTop: 32, textAlign: 'center'}}>
              <Display t={t} size={26}>Составляем<br/>твой план</Display>
              <div style={{marginTop: 8, fontSize: 14, color: t.textMuted}}>Это займёт несколько секунд</div>
            </div>
          </div>

          <div style={{background: t.surface, padding: 20, borderRadius: t.radius.lg, border: `1px solid ${t.border}`}}>
            {steps.map((s, i) => {
              const active = i < step;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  opacity: active ? 1 : 0.35,
                  transition: 'opacity 0.4s',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 22,
                    background: active ? t.accent : t.bgSubtle,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && <Icon name="check" size={14} stroke={t.accentText} sw={2.5}/>}
                  </div>
                  <div style={{fontSize: 14, fontWeight: 500, color: t.text}}>{s}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
              letterSpacing: '0.14em', color: t.accent, marginBottom: 16,
            }}>ТВОЙ ПЕРСОНАЛЬНЫЙ ПЛАН ГОТОВ</div>

            <Display t={t} size={30} style={{marginBottom: 24}}>
              Реалистичный результат<br/>для тебя:
            </Display>

            {/* Большая цифра результата */}
            <div style={{
              padding: '28px 24px',
              borderRadius: t.radius.xl,
              background: t.surface,
              border: `1px solid ${t.border}`,
              boxShadow: t.shadow,
            }}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
                <div style={{
                  fontFamily: t.fontDisplay,
                  fontWeight: t.displayWeight,
                  fontStyle: t.displayItalic ? 'italic' : 'normal',
                  fontSize: 88, letterSpacing: '-0.05em', lineHeight: 1,
                  color: t.accent,
                }}>−8</div>
                <div>
                  <div style={{fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em'}}>кг</div>
                  <div style={{fontSize: 13, color: t.textMuted}}>за 30 дней</div>
                </div>
              </div>
              <div style={{
                marginTop: 16, paddingTop: 16, borderTop: `1px solid ${t.border}`,
                display: 'flex', gap: 20,
              }}>
                <Stat label="Ежедневно" value="≈1350 ккал"/>
                <Stat label="Тренировки" value="4×/нед"/>
                <Stat label="Уход" value="ежедн."/>
              </div>
            </div>

            <div style={{marginTop: 20, padding: 14, borderRadius: t.radius.md, background: t.successSoft, display: 'flex', alignItems: 'flex-start', gap: 10}}>
              <Icon name="leaf" size={18} stroke={t.success}/>
              <div style={{fontSize: 13, color: t.text, lineHeight: 1.4}}>
                Без строгих запретов и подсчёта калорий. Только мягкий ритм.
              </div>
            </div>
          </div>

          <Button t={t} onClick={onNext} icon={<Icon name="arrow" size={20}/>}>
            Посмотреть план
          </Button>
        </>
      )}
    </div>
  );
}

function Stat({label, value}) {
  return (
    <div>
      <div style={{fontSize: 11, opacity: 0.55, letterSpacing: '0.02em', marginBottom: 3}}>{label}</div>
      <div style={{fontSize: 13.5, fontWeight: 600}}>{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 5. PAYWALL
function PaywallScreen({t, onNext, onBack}) {
  const [plan, setPlan] = React.useState('year');
  const plans = [
    {
      id: 'week',
      title: '7 дней',
      price: '149 ₽',
      hook: 'Попробуй без риска',
      perDay: null,
      size: 'sm',
    },
    {
      id: 'month',
      title: '1 месяц',
      price: '399 ₽',
      hook: 'Стандарт',
      perDay: '≈ 13 ₽/день',
      size: 'md',
    },
    {
      id: 'year',
      title: '1 год',
      price: '1 990 ₽',
      hook: 'Экономишь 2 890 ₽',
      perDay: '5 ₽/день — дешевле чашки чая',
      badge: '−58%',
      size: 'lg',
    },
  ];

  const selected = plans.find(p => p.id === plan);

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: t.bg}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 16px'}}>
        <button onClick={onBack} style={{width: 38, height: 38, borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <Icon name="close" size={18}/>
        </button>
        <button onClick={onNext} style={{background: 'transparent', border: 'none', fontFamily: t.fontBody, fontSize: 13, color: t.textMuted, cursor: 'pointer'}}>
          Восстановить
        </button>
      </div>

      <div style={{flex: 1, overflow: 'auto', padding: '0 24px 8px'}}>
        <div style={{
          padding: '20px 20px 24px',
          borderRadius: t.radius.xl,
          background: `linear-gradient(160deg, ${t.text} 0%, oklch(28% 0.03 40) 100%)`,
          color: t.bg,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 180, height: 180, borderRadius: 200,
            background: t.accent, opacity: 0.35, filter: 'blur(40px)',
          }}/>
          <div style={{position: 'relative'}}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 10px', borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              <Icon name="sparkle" size={12}/> Florae PRO
            </div>
            <Display t={t} size={30} style={{color: t.bg, marginTop: 16}}>
              Полный доступ<br/>к твоей программе
            </Display>
          </div>
        </div>

        <div style={{marginTop: 20, padding: '4px 4px'}}>
          {[
            {i: 'meal', l: 'Меню на 30 дней с рецептами'},
            {i: 'dumbbell', l: 'Тренировки, адаптированные под тебя'},
            {i: 'sparkle', l: 'Уходовые ритуалы каждый день'},
            {i: 'trophy', l: 'Награды и статистика прогресса'},
          ].map((f, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0'}}>
              <div style={{width: 34, height: 34, borderRadius: 12, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon name={f.i} size={18} stroke={t.accent}/>
              </div>
              <div style={{fontSize: 14.5, color: t.text, fontWeight: 500}}>{f.l}</div>
              <div style={{marginLeft: 'auto'}}>
                <Icon name="check" size={16} stroke={t.success} sw={2.5}/>
              </div>
            </div>
          ))}
        </div>

        {/* Тарифы: годовой — главный акцент */}
        <div style={{marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10}}>
          {plans.map(p => {
            const on = p.id === plan;
            const isLg = p.size === 'lg';
            const isSm = p.size === 'sm';
            return (
              <button key={p.id} onClick={() => setPlan(p.id)} style={{
                position: 'relative',
                padding: isLg ? '22px 20px' : isSm ? '12px 16px' : '16px 18px',
                borderRadius: isLg ? t.radius.xl : t.radius.lg,
                background: on
                  ? (isLg ? `linear-gradient(135deg, ${t.text} 0%, oklch(28% 0.03 40) 100%)` : t.text)
                  : t.surface,
                color: on ? t.bg : t.text,
                border: isLg
                  ? `2px solid ${on ? t.accent : t.border}`
                  : `1.5px solid ${on ? t.text : t.border}`,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: isLg ? 'flex-start' : 'center',
                gap: isLg ? 16 : 14,
                fontFamily: t.fontBody,
                boxShadow: isLg && on ? `0 12px 40px -12px ${t.accent}55` : 'none',
                transform: isLg ? 'scale(1)' : 'scale(0.98)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}>
                {p.badge && (
                  <div style={{
                    position: 'absolute', top: -10, right: 16,
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                    letterSpacing: '0.08em', padding: '5px 12px', borderRadius: 999,
                    background: t.accent, color: t.accentText, fontWeight: 700,
                  }}>{p.badge}</div>
                )}
                <div style={{
                  width: isLg ? 26 : 22, height: isLg ? 26 : 22, borderRadius: 999,
                  border: `2px solid ${on ? t.accent : t.borderStrong}`,
                  background: on ? t.accent : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: isLg ? 4 : 0,
                }}>
                  {on && <div style={{width: isLg ? 10 : 8, height: isLg ? 10 : 8, borderRadius: 999, background: t.bg}}/>}
                </div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
                    <div style={{
                      fontSize: isLg ? 20 : isSm ? 14 : 16,
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                    }}>{p.title}</div>
                  </div>
                  <div style={{
                    fontSize: isSm ? 11 : 12.5,
                    opacity: on ? 0.75 : 0.65,
                    marginTop: 4,
                    fontWeight: 500,
                  }}>{p.hook}</div>
                  {p.perDay && (
                    <div style={{
                      marginTop: isLg ? 10 : 6,
                      fontSize: isLg ? 15 : 12,
                      fontWeight: isLg ? 600 : 500,
                      color: on && isLg ? t.accent : (on ? 'rgba(255,255,255,0.85)' : t.accent),
                      letterSpacing: '-0.01em',
                    }}>{p.perDay}</div>
                  )}
                </div>
                <div style={{
                  fontFamily: t.fontDisplay,
                  fontWeight: t.displayWeight,
                  fontStyle: t.displayItalic ? 'italic' : 'normal',
                  fontSize: isLg ? 28 : isSm ? 18 : 22,
                  letterSpacing: '-0.02em',
                  flexShrink: 0,
                }}>
                  {p.price}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{
          marginTop: 16, textAlign: 'center',
          fontSize: 13, color: t.textMuted, lineHeight: 1.5,
          padding: '0 8px',
        }}>
          Отмена в любой момент. Без скрытых платежей.
        </div>

        <div style={{marginTop: 20, padding: 16, borderRadius: t.radius.lg, background: t.bgSubtle, display: 'flex', gap: 12}}>
          <PhotoSlot t={t} w={44} h={44} radius={22} label="" tone="warm" style={{flexShrink: 0}}/>
          <div>
            <div style={{display: 'flex', gap: 2, marginBottom: 4}}>
              {[1,2,3,4,5].map(i => (
                <Icon key={i} name="star" size={12} stroke={t.warn} fill={t.warn}/>
              ))}
            </div>
            <div style={{fontSize: 13, lineHeight: 1.45, color: t.text}}>
              «Впервые не сорвалась. Плавно, без давления — просто нашла свой ритм.»
            </div>
            <div style={{fontSize: 12, color: t.textMuted, marginTop: 4}}>Анна М., −7 кг за месяц</div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px 24px calc(12px + env(safe-area-inset-bottom, 0px))',
        borderTop: `1px solid ${t.border}`,
        background: t.surface,
      }}>
        <Button t={t} onClick={onNext} icon={<Icon name="arrow" size={20}/>} style={{width: '100%'}}>
          {plan === 'week' ? 'Попробовать 7 дней' : plan === 'year' ? 'Выбрать годовой тариф' : 'Продолжить'}
        </Button>
        <div style={{textAlign: 'center', marginTop: 8, fontSize: 11.5, color: t.textFaint}}>
          {selected?.price} · {selected?.hook}
        </div>
      </div>
    </div>
  );
}

window.SplashScreen = SplashScreen;
window.ValueSliderScreen = ValueSliderScreen;
window.GoalSelectScreen = GoalSelectScreen;
window.PlanGenerationScreen = PlanGenerationScreen;
window.PaywallScreen = PaywallScreen;
window.OnboardHeader = OnboardHeader;
