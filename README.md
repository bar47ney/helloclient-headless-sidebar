# Headless responsive sidebar

Тестовое задание HelloClient: доступное адаптивное меню на React, TypeScript и Tailwind CSS. Компоненты меню отвечают только за состояние, события, адаптивное поведение и ARIA. Вся визуальная часть находится в компоненте-потребителе `App.tsx`.

**Демо:** https://testhelloclient.vercel.app  
**Репозиторий:** https://github.com/bar47ney/helloclient-headless-sidebar

## Запуск

```bash
npm install
npm run dev
```

Проверки:

```bash
npm run test
npm run lint
npm run build
```

## Архитектура

- `src/components/sidebar/Sidebar.tsx` — headless compound-компоненты без Tailwind-классов и зависимости от роутера.
- `src/App.tsx` — JSX-разметка меню, стили Tailwind и интеграция с React Router.
- `src/components/sidebar/Sidebar.test.tsx` — тесты controlled/uncontrolled API, подменю, мобильного диалога и клавиатуры.
- `.github/workflows/deploy.yml` — готовый деплой статической сборки на GitHub Pages.

Меню задаётся JSX-композиционно, без конфигурационных объектов:

```tsx
<Sidebar.Root expanded={expanded} onExpandedChange={setExpanded}>
  <Sidebar.Navigation aria-label="Основная навигация">
    <Sidebar.List>
      <Sidebar.Item active={isDashboard}>
        <NavLink to="/dashboard" data-sidebar-focusable="">
          Dashboard
        </NavLink>
      </Sidebar.Item>

      <Sidebar.Submenu id="clients" active={isClientsRoute}>
        <Sidebar.SubmenuTrigger>Клиенты</Sidebar.SubmenuTrigger>
        <Sidebar.SubmenuContent label="Клиенты">
          <Sidebar.SubmenuItem active={isListRoute}>
            <NavLink to="/clients/list" data-sidebar-focusable="">
              Список
            </NavLink>
          </Sidebar.SubmenuItem>
        </Sidebar.SubmenuContent>
      </Sidebar.Submenu>
    </Sidebar.List>
  </Sidebar.Navigation>
</Sidebar.Root>
```

`expanded`, `open` и соответствующие callbacks поддерживают controlled API; без этих props компонент хранит состояние сам. Поэтому вместо React Router можно передать состояние из `useState`, Redux, localStorage или любого другого источника. В демо состояние ширины хранится потребителем в localStorage, а активность пунктов полностью определяется React Router.

## Поведение

- Широкий desktop: подписи видны, подменю раскрывается внутри списка.
- Узкий desktop: остаются иконки, подменю открывается рядом по hover или click.
- Mobile: горизонтальная нижняя навигация и подменю в доступном modal bottom sheet.
- Активный дочерний маршрут подсвечивает и раскрывает родителя.
- Поддерживаются стрелки, Home/End, Escape, focus trap и возврат фокуса после закрытия мобильного подменю.

Для GitHub Pages используется `HashRouter`, поэтому прямое открытие и обновление вложенных маршрутов работает без серверной настройки rewrites.
