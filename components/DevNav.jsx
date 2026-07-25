// DevNav — боковое меню для переключения экранов при редактировании

const DEV_FLOW = [
  {group: 'Старт', color: 'coral', items: [
    {id: 'splash', label: 'Splash'},
    {id: 'slider1', label: 'Value · 1'},
    {id: 'slider2', label: 'Value · 2'},
    {id: 'slider3', label: 'Value · 3'},
  ]},
  {group: 'Анкета', color: 'warm', items: [
    {id: 'goal', label: 'Q1 · Цель'},
    {id: 'zones', label: 'Q2 · Зоны'},
    {id: 'stats', label: 'Q3 · Параметры'},
    {id: 'activity', label: 'Q4 · Активность'},
    {id: 'restrictions', label: 'Q5 · Питание'},
    {id: 'blacklist', label: 'Q6 · Чёрный список'},
  ]},
  {group: 'Конверсия', color: 'lavender', items: [
    {id: 'plan-gen', label: 'Генерация плана'},
    {id: 'paywall', label: 'Paywall'},
    {id: 'signup', label: 'Регистрация'},
  ]},
  {group: 'Приложение', color: 'green', items: [
    {id: 'today', label: 'Сегодня'},
    {id: 'meals', label: 'Питание'},
    {id: 'recipe', label: 'Полный рецепт'},
    {id: 'workout-overview', label: 'Тренировка'},
    {id: 'workout', label: 'Активное упражнение'},
    {id: 'beauty', label: 'Красота'},
    {id: 'profile', label: 'Профиль'},
    {id: 'awards', label: 'Все награды'},
  ]},
];

const DEV_COLORS = {
  coral: 'oklch(68% 0.18 25)',
  warm: 'oklch(64% 0.13 35)',
  lavender: 'oklch(60% 0.14 300)',
  green: 'oklch(58% 0.11 155)',
};

function DevNav({screenId, setScreenId, onOpenSheet, onOpenReplace, onOpenReward}) {
  const allScreens = DEV_FLOW.flatMap(g => g.items);
  const idx = allScreens.findIndex(s => s.id === screenId);

  return (
    <aside className="dev-nav" aria-label="Навигация для разработки">
      <div className="dev-nav__header">
        <div>
          <div className="dev-nav__title">Стройно · dev</div>
          <div className="dev-nav__subtitle">Переключение экранов</div>
        </div>
      </div>

      <div className="dev-nav__current">
        <span className="dev-nav__current-label">{allScreens[idx]?.label || screenId}</span>
        <span className="dev-nav__current-num">{String(idx + 1).padStart(2, '0')} / {allScreens.length}</span>
      </div>

      <div className="dev-nav__steps">
        <button type="button" disabled={idx <= 0} onClick={() => setScreenId(allScreens[idx - 1].id)}>←</button>
        <button type="button" disabled={idx >= allScreens.length - 1} onClick={() => setScreenId(allScreens[idx + 1].id)}>→</button>
      </div>

      <div className="dev-nav__overlays">
        <div className="dev-nav__section-label">Оверлеи</div>
        <div className="dev-nav__overlay-btns">
          <button type="button" onClick={onOpenSheet}>Карточка ужина</button>
          <button type="button" onClick={onOpenReplace}>Замена блюда</button>
          <button type="button" onClick={onOpenReward}>Награда</button>
        </div>
      </div>

      <nav className="dev-nav__list">
        {DEV_FLOW.map(group => (
          <div key={group.group} className="dev-nav__group">
            <div className="dev-nav__group-head">
              <span className="dev-nav__dot" style={{background: DEV_COLORS[group.color]}}/>
              <span>{group.group}</span>
              <span className="dev-nav__count">{group.items.length}</span>
            </div>
            {group.items.map(item => {
              const on = item.id === screenId;
              const num = allScreens.findIndex(s => s.id === item.id) + 1;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={'dev-nav__item' + (on ? ' dev-nav__item--active' : '')}
                  onClick={() => setScreenId(item.id)}
                >
                  <span className="dev-nav__item-num">{String(num).padStart(2, '0')}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

window.DevNav = DevNav;
