import { type ComponentType, type ReactNode, useEffect, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  MessageSquareText,
  MoreHorizontal,
  Package,
  PackageOpen,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  TicketCheck,
  Users,
} from 'lucide-react'
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar } from './components/sidebar'

const itemClass =
  'group/link flex h-14 min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-center text-[11px] font-medium text-slate-600 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-500 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 md:h-11 md:w-full md:min-w-0 md:flex-row md:justify-start md:gap-3 md:px-3 md:text-left md:text-sm md:group-data-[collapsed]/sidebar:justify-center md:group-data-[collapsed]/sidebar:px-0'
const labelClass = 'truncate md:group-data-[collapsed]/sidebar:hidden'

function MenuLink({ to, icon: Icon, children, desktopOnly = false }: { to: string; icon: ComponentType<{ size?: number }>; children: ReactNode; desktopOnly?: boolean }) {
  const active = useLocation().pathname === to
  return (
    <Sidebar.Item active={active} className={`${desktopOnly ? 'hidden md:block' : 'shrink-0'} md:w-full`}>
      <NavLink
        to={to}
        data-sidebar-focusable=""
        className={itemClass}
        data-active={active || undefined}
      >
        <Icon size={20} />
        <span className={labelClass}>{children}</span>
      </NavLink>
    </Sidebar.Item>
  )
}

function AppSidebar({ expanded, onExpandedChange }: { expanded: boolean; onExpandedChange: (value: boolean) => void }) {
  const location = useLocation()
  const clientsActive = location.pathname.startsWith('/clients')
  const inventoryActive = location.pathname.startsWith('/inventory')

  return (
    <Sidebar.Root
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      className="group/sidebar"
    >
      <Sidebar.Navigation
        aria-label="Основная навигация"
        className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur md:inset-y-0 md:left-0 md:right-auto md:z-40 md:flex md:w-64 md:flex-col md:border-r md:border-t-0 md:px-3 md:py-5 md:shadow-none md:transition-[width] md:duration-300 md:group-data-[collapsed]/sidebar:w-20"
      >
        <div className="mb-6 hidden h-10 items-center gap-3 px-3 md:flex">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white">HC</span>
          <span className="text-lg font-bold tracking-tight text-slate-950 md:group-data-[collapsed]/sidebar:hidden">HelloClient</span>
        </div>

        <Sidebar.List className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] md:flex-1 md:flex-col md:items-stretch md:overflow-visible">
          <MenuLink to="/overview" icon={LayoutDashboard}>Обзор</MenuLink>
          <MenuLink to="/tasks" icon={ClipboardCheck}>Задачи</MenuLink>
          <MenuLink to="/tickets" icon={TicketCheck}>Тикеты</MenuLink>
          <MenuLink to="/payments" icon={CreditCard}>Платежи</MenuLink>

          <Sidebar.Submenu id="clients" active={clientsActive} className="relative shrink-0 md:w-full">
            <Sidebar.SubmenuTrigger className={`${itemClass} data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700`} data-active={clientsActive || undefined}>
              <Users size={20} />
              <span className={labelClass}>Клиенты</span>
              <ChevronRight size={16} className="ml-auto hidden transition group-aria-expanded/link:rotate-90 md:block md:group-data-[collapsed]/sidebar:hidden" />
            </Sidebar.SubmenuTrigger>
            <Sidebar.SubmenuContent
              label="Клиенты"
              className="space-y-1 border-l border-slate-200 py-1 pl-4 md:group-data-[collapsed]/sidebar:absolute md:group-data-[collapsed]/sidebar:bottom-0 md:group-data-[collapsed]/sidebar:left-[calc(100%+.75rem)] md:group-data-[collapsed]/sidebar:w-48 md:group-data-[collapsed]/sidebar:rounded-2xl md:group-data-[collapsed]/sidebar:border md:group-data-[collapsed]/sidebar:bg-white md:group-data-[collapsed]/sidebar:p-2 md:group-data-[collapsed]/sidebar:shadow-xl"
              backdropClassName="fixed inset-x-0 top-0 bottom-[72px] z-50 bg-slate-950/45 backdrop-blur-[2px]"
              panelClassName="fixed inset-x-0 bottom-[72px] z-[60] max-h-[70svh] overflow-y-auto rounded-t-3xl bg-white px-4 pb-6 pt-4 shadow-2xl"
              headingClassName="mb-3 flex items-center justify-between px-1 text-lg font-bold text-slate-950"
              closeClassName="grid size-10 place-items-center rounded-full text-2xl font-light text-slate-500 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <SubmenuLink to="/clients/list">Список</SubmenuLink>
              <SubmenuLink to="/clients/reviews">Отзывы</SubmenuLink>
              <SubmenuLink to="/clients/notifications">Уведомления</SubmenuLink>
            </Sidebar.SubmenuContent>
          </Sidebar.Submenu>

          <Sidebar.Submenu id="inventory" active={inventoryActive} className="relative shrink-0 md:w-full">
            <Sidebar.SubmenuTrigger className={`${itemClass} data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700`} data-active={inventoryActive || undefined}>
              <PackageOpen size={20} />
              <span className={labelClass}>Склад</span>
              <ChevronRight size={16} className="ml-auto hidden transition group-aria-expanded/link:rotate-90 md:block md:group-data-[collapsed]/sidebar:hidden" />
            </Sidebar.SubmenuTrigger>
            <Sidebar.SubmenuContent
              label="Склад"
              className="space-y-1 border-l border-slate-200 py-1 pl-4 md:group-data-[collapsed]/sidebar:absolute md:group-data-[collapsed]/sidebar:bottom-0 md:group-data-[collapsed]/sidebar:left-[calc(100%+.75rem)] md:group-data-[collapsed]/sidebar:w-48 md:group-data-[collapsed]/sidebar:rounded-2xl md:group-data-[collapsed]/sidebar:border md:group-data-[collapsed]/sidebar:bg-white md:group-data-[collapsed]/sidebar:p-2 md:group-data-[collapsed]/sidebar:shadow-xl"
              backdropClassName="fixed inset-x-0 top-0 bottom-[72px] z-50 bg-slate-950/45 backdrop-blur-[2px]"
              panelClassName="fixed inset-x-0 bottom-[72px] z-[60] max-h-[70svh] overflow-y-auto rounded-t-3xl bg-white px-4 pb-6 pt-4 shadow-2xl"
              headingClassName="mb-3 flex items-center justify-between px-1 text-lg font-bold text-slate-950"
              closeClassName="grid size-10 place-items-center rounded-full text-2xl font-light text-slate-500 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <SubmenuLink to="/inventory/products">Товары</SubmenuLink>
              <SubmenuLink to="/inventory/orders">Заказы</SubmenuLink>
              <SubmenuLink to="/inventory/suppliers">Поставщики</SubmenuLink>
            </Sidebar.SubmenuContent>
          </Sidebar.Submenu>
          <MenuLink to="/shop" icon={ShoppingCart}>Магазин</MenuLink>
          <MenuLink to="/reports" icon={BarChart3}>Отчёты</MenuLink>

          <li aria-hidden="true" className="my-2 hidden border-t border-slate-200 md:block" />
          <MenuLink to="/settings" icon={Settings} desktopOnly>Настройки</MenuLink>
          <MenuLink to="/help" icon={CircleHelp} desktopOnly>Помощь</MenuLink>
        </Sidebar.List>

        <Sidebar.CollapseTrigger className="mt-3 hidden h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-500 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-500 md:flex md:group-data-[collapsed]/sidebar:justify-center md:group-data-[collapsed]/sidebar:px-0">
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          <span className="md:group-data-[collapsed]/sidebar:hidden">Свернуть</span>
        </Sidebar.CollapseTrigger>
      </Sidebar.Navigation>

      <main className="min-h-screen pb-28 transition-[margin] duration-300 md:ml-64 md:pb-0 md:group-data-[collapsed]/sidebar:ml-20">
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/tasks" element={<SimplePage title="Задачи" description="Планируйте работу команды и следите за сроками." />} />
          <Route path="/tickets" element={<SimplePage title="Тикеты" description="Обращения клиентов собраны в одном месте." />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/clients/list" element={<ClientsPage />} />
          <Route path="/clients/reviews" element={<SimplePage title="Отзывы" description="Обратная связь от ваших клиентов." />} />
          <Route path="/clients/notifications" element={<SimplePage title="Уведомления" description="Настройте сценарии коммуникаций." />} />
          <Route path="/inventory" element={<Navigate to="/inventory/products" replace />} />
          <Route path="/inventory/products" element={<InventoryProducts />} />
          <Route path="/inventory/orders" element={<SimplePage title="Заказы" description="Заказы на поставку и движение товаров." />} />
          <Route path="/inventory/suppliers" element={<SimplePage title="Поставщики" description="Контакты поставщиков и история закупок." />} />
          <Route path="/shop" element={<SimplePage title="Магазин" description="Каталог и продажи вашей компании." />} />
          <Route path="/reports" element={<SimplePage title="Отчёты" description="Главные показатели бизнеса в реальном времени." />} />
          <Route path="/settings" element={<SimplePage title="Настройки" description="Управляйте рабочим пространством." />} />
          <Route path="/help" element={<SimplePage title="Помощь" description="Документация и ответы на вопросы." />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </main>
    </Sidebar.Root>
  )
}

function SubmenuLink({ to, children }: { to: string; children: ReactNode }) {
  const active = useLocation().pathname === to
  return (
    <Sidebar.SubmenuItem active={active}>
      <NavLink
        to={to}
        data-sidebar-focusable=""
        data-active={active || undefined}
        className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-500 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
      >
        {children}
      </NavLink>
    </Sidebar.SubmenuItem>
  )
}

export function App() {
  const [expanded, setExpanded] = useState(() => localStorage.getItem('sidebar-expanded') !== 'false')

  useEffect(() => localStorage.setItem('sidebar-expanded', String(expanded)), [expanded])

  return <AppSidebar expanded={expanded} onExpandedChange={setExpanded} />
}

function Breadcrumbs() {
  const { pathname } = useLocation()

  let section: { label: string; to: string } | null = null
  let current = 'Обзор'

  if (pathname.startsWith('/inventory')) {
    section = { label: 'Склад', to: '/inventory/products' }
    if (pathname.endsWith('/orders')) current = 'Заказы'
    else if (pathname.endsWith('/suppliers')) current = 'Поставщики'
    else current = 'Товары'
  } else if (pathname.startsWith('/clients')) {
    section = { label: 'Клиенты', to: '/clients/list' }
    if (pathname.endsWith('/reviews')) current = 'Отзывы'
    else if (pathname.endsWith('/notifications')) current = 'Уведомления'
    else current = 'Список'
  } else if (pathname.startsWith('/tasks')) current = 'Задачи'
  else if (pathname.startsWith('/tickets')) current = 'Тикеты'
  else if (pathname.startsWith('/payments')) current = 'Платежи'
  else if (pathname.startsWith('/shop')) current = 'Магазин'
  else if (pathname.startsWith('/reports')) current = 'Отчёты'
  else if (pathname.startsWith('/settings')) current = 'Настройки'
  else if (pathname.startsWith('/help')) current = 'Помощь'

  return (
    <nav aria-label="Хлебные крошки" className="hidden h-14 items-center gap-2 border-b border-slate-200 bg-white px-5 text-sm md:flex sm:px-8 lg:px-12">
      <Link to="/overview" className="font-medium text-slate-400 transition hover:text-blue-600">Главная</Link>
      <ChevronRight size={14} className="text-slate-300" aria-hidden="true" />
      {section && (
        <>
          <Link to={section.to} className="font-medium text-slate-400 transition hover:text-blue-600">{section.label}</Link>
          <ChevronRight size={14} className="text-slate-300" aria-hidden="true" />
        </>
      )}
      <span aria-current="page" className="font-semibold text-slate-700">{current}</span>
    </nav>
  )
}

function PageShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-blue-600">{eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">{description}</p>
        </div>
        <button className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
          <Sparkles size={17} /> Новое действие
        </button>
      </header>
      {children}
    </div>
  )
}

function Overview() {
  return (
    <PageShell eyebrow="Рабочее пространство" title="Добрый день, Алексей" description="Всё важное о работе с клиентами — на одном экране.">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Активные клиенты" value="1 248" change="+12,4%" />
        <Metric label="Новые заявки" value="86" change="+8,1%" />
        <Metric label="Открытые задачи" value="24" change="6 сегодня" />
        <Metric label="Выручка за месяц" value="₽ 2,4M" change="+18,2%" />
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <div><h2 className="font-bold text-slate-950">Динамика обращений</h2><p className="mt-1 text-sm text-slate-500">Последние 7 дней</p></div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">+14%</span>
          </div>
          <div className="flex h-48 items-end gap-3" aria-label="График обращений">
            {[42, 64, 51, 78, 67, 88, 72].map((height, index) => <div key={index} className="flex-1 rounded-t-lg bg-blue-100 transition hover:bg-blue-500" style={{ height: `${height}%` }} />)}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <Boxes className="mb-8 text-blue-400" />
          <p className="text-sm text-slate-400">Качество сервиса</p>
          <p className="mt-2 text-4xl font-bold">94,8%</p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[95%] rounded-full bg-blue-500" /></div>
          <p className="mt-4 text-sm leading-6 text-slate-400">На 3,2% выше результата прошлого месяца.</p>
        </div>
      </section>
    </PageShell>
  )
}

function Metric({ label, value, change }: { label: string; value: string; change: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-4 text-2xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-2 text-xs font-semibold text-emerald-600">{change}</p></div>
}

function PaymentsPage() {
  return (
    <>
      <div className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-slate-50 px-6 pb-24 md:hidden">
        <div className="-translate-y-8 text-center">
          <EmptyIllustration />
          <h1 className="mt-6 text-2xl font-bold text-slate-950">Здесь пока пусто</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">Создайте первую операцию, чтобы начать работу с платежами.</p>
        </div>
        <button className="fixed bottom-24 right-5 z-30 inline-flex h-12 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-xl shadow-blue-600/30 outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
          <Plus size={19} /> Создать
        </button>
      </div>
      <div className="hidden md:block">
        <PaymentsDesktop />
      </div>
    </>
  )
}

function PaymentsDesktop() {
  return (
    <PageShell eyebrow="Финансы" title="Платежи" description="Баланс, счета и история операций.">
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {['Все', 'Наличные', 'Безналичные', 'Карта', 'Банк'].map((tab, index) => (
          <button key={tab} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 ${index === 0 ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>{tab}</button>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm font-medium text-slate-400">Общий баланс</p>
          <p className="mt-3 text-3xl font-bold tracking-tight">₽ 284 920</p>
          <p className="mt-3 text-xs font-semibold text-emerald-400">+12,8% за месяц</p>
        </div>
        <PaymentMetric icon={<ArrowDownLeft size={19} />} label="Поступления" value="₽ 428 400" accent="text-emerald-600 bg-emerald-50" />
        <PaymentMetric icon={<ArrowUpRight size={19} />} label="Расходы" value="₽ 143 480" accent="text-rose-600 bg-rose-50" />
        <PaymentMetric icon={<CreditCard size={19} />} label="Операции" value="86" accent="text-blue-600 bg-blue-50" />
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div><h2 className="font-bold text-slate-950">Последние операции</h2><p className="mt-1 text-sm text-slate-500">Сегодня, 4 августа</p></div>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Все операции</button>
        </div>
        <div className="divide-y divide-slate-100">
          <PaymentRow title="Оплата заказа #1048" category="Продажи" amount="+ ₽ 24 900" positive time="14:32" />
          <PaymentRow title="Подписка на сервисы" category="Расходы" amount="− ₽ 3 490" time="12:10" />
          <PaymentRow title="Оплата от Northstar" category="Продажи" amount="+ ₽ 68 000" positive time="10:45" />
          <PaymentRow title="Доставка заказов" category="Логистика" amount="− ₽ 8 240" time="09:18" />
        </div>
      </section>
    </PageShell>
  )
}

function PaymentMetric({ icon, label, value, accent }: { icon: ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`grid size-10 place-items-center rounded-xl ${accent}`}>{icon}</span>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-950">{value}</p>
    </div>
  )
}

function PaymentRow({ title, category, amount, time, positive = false }: { title: string; category: string; amount: string; time: string; positive?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-4 sm:grid-cols-[1fr_140px_120px]">
      <div><p className="font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs text-slate-500 sm:hidden">{category}</p></div>
      <p className="hidden text-sm text-slate-500 sm:block">{category}</p>
      <div className="text-right"><p className={`font-bold ${positive ? 'text-emerald-600' : 'text-slate-900'}`}>{amount}</p><p className="mt-1 text-xs text-slate-400">{time}</p></div>
    </div>
  )
}

function EmptyIllustration() {
  return (
    <svg viewBox="0 0 360 280" role="img" aria-label="Нет данных" className="mx-auto w-full max-w-[310px] text-slate-950">
      <path d="M34 224c48-60 91-73 130-37 40 36 88 28 162-41" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M61 194c-36-43-32-94 1-106 34-12 62 36 50 89-10 44-35 42-51 17Z" fill="currentColor" />
      <path d="M276 161c-8-56 17-105 51-101 34 4 35 59 4 105-25 38-49 18-55-4Z" fill="currentColor" />
      <path d="M123 205c-23-34-16-75 10-79 27-4 40 39 19 76-12 21-22 17-29 3Z" fill="currentColor" />
      <circle cx="202" cy="61" r="19" fill="white" stroke="currentColor" strokeWidth="3" />
      <path d="M185 56c5-20 31-19 35 1M190 83l-18 72 31 20 21-54 6 86M190 93l-35 31M217 91l29 45 20-17M172 155l-12 64M230 207l29 11" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M186 85c9-11 24-12 36-1l8 36-29 13-28-17 13-31Z" fill="white" stroke="currentColor" strokeWidth="3" />
      <path d="M195 41c4-10 21-8 28 1-4 8-13 12-23 9" fill="currentColor" />
      <path d="M165 219h-24M272 219h-27" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function SimplePage({ title, description }: { title: string; description: string }) {
  return (
    <PageShell eyebrow="HelloClient CRM" title={title} description={description}>
      <section className="grid gap-4 sm:grid-cols-3">
        <SectionMetric label="За сегодня" value="12" note="+3 за последний час" />
        <SectionMetric label="В работе" value="28" note="5 требуют внимания" />
        <SectionMetric label="Завершено" value="94" note="за текущий месяц" />
      </section>
      <section className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5"><h2 className="font-bold text-slate-950">Последняя активность</h2><p className="mt-1 text-sm text-slate-500">События раздела «{title}»</p></div>
          <div className="divide-y divide-slate-100">
            <ActivityRow title="Создана новая запись" author="Анна Крылова" time="10 минут назад" />
            <ActivityRow title="Статус изменён на «В работе»" author="Михаил Смирнов" time="42 минуты назад" />
            <ActivityRow title="Добавлен комментарий" author="Елена Волкова" time="Сегодня, 11:20" />
            <ActivityRow title="Запись успешно завершена" author="Алексей Петров" time="Вчера, 18:05" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600"><MessageSquareText size={22} /></div>
          <h2 className="mt-5 font-bold text-slate-950">Быстрые действия</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Создайте запись или сформируйте отчёт по текущему разделу.</p>
          <div className="mt-6 space-y-2">
            <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={17} /> Добавить запись</button>
            <button className="h-11 w-full rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">Сформировать отчёт</button>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

function SectionMetric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold text-slate-950">{value}</p><p className="mt-2 text-xs font-semibold text-blue-600">{note}</p></div>
}

function ActivityRow({ title, author, time }: { title: string; author: string; time: string }) {
  return <div className="flex items-center gap-4 px-6 py-4"><span className="size-2 shrink-0 rounded-full bg-blue-500" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs text-slate-500">{author}</p></div><time className="shrink-0 text-xs text-slate-400">{time}</time></div>
}

function InventoryProducts() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-white lg:flex-row">
      <aside aria-label="Категории товаров" className="hidden shrink-0 border-b border-slate-200 bg-slate-50/70 lg:block lg:w-72 lg:border-b-0 lg:border-r">
        <div className="border-b border-slate-200 bg-white px-5 py-5">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Склад</p>
          <h1 className="mt-1 text-lg font-bold text-slate-950">Товары и категории</h1>
        </div>
        <div className="p-3">
          <button className="flex w-full items-center justify-between rounded-xl bg-blue-100 px-4 py-3 text-left text-sm font-semibold text-blue-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            Все категории <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs">24</span>
          </button>
          <ul className="mt-2 space-y-1">
            <CategoryRow label="Электроника" count={8} />
            <CategoryRow label="Для дома" count={7} />
            <CategoryRow label="Аксессуары" count={5} />
            <CategoryRow label="Новинки" count={4} />
          </ul>
        </div>
      </aside>

      <section className="min-w-0 flex-1 bg-slate-50 px-4 py-6 pb-28 sm:px-8 lg:px-10 lg:pb-10">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Все категории</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Товары</h2>
            <p className="mt-2 text-sm text-slate-500">Управляйте ассортиментом и остатками на складе.</p>
          </div>
          <label className="relative block w-full xl:max-w-sm">
            <span className="sr-only">Поиск товаров</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="search" placeholder="Поиск по товарам" className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
          </label>
        </div>

        <div className="space-y-3 md:hidden">
          <ProductMobileCard name="Беспроводные наушники AirBeat" sku="AB-2048" category="Электроника" stock={18} />
          <ProductMobileCard name="Настольная лампа Mono" sku="LM-0312" category="Для дома" stock={7} />
          <ProductMobileCard name="Чехол AirCase Pro" sku="AC-1190" category="Аксессуары" stock={42} />
          <ProductMobileCard name="Портативная колонка Wave" sku="WV-8821" category="Электроника" stock={3} />
          <ProductMobileCard name="Органайзер Grid" sku="GR-4402" category="Для дома" stock={26} />
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr><th className="w-12 px-5 py-4"><input type="checkbox" aria-label="Выбрать все товары" className="size-4 rounded border-slate-300" /></th><th className="px-5 py-4">Товар</th><th className="px-5 py-4">SKU</th><th className="px-5 py-4">Категория</th><th className="px-5 py-4">Остаток</th><th className="w-12 px-5 py-4"><span className="sr-only">Действия</span></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <ProductRow name="Беспроводные наушники AirBeat" sku="AB-2048" category="Электроника" stock={18} />
                <ProductRow name="Настольная лампа Mono" sku="LM-0312" category="Для дома" stock={7} />
                <ProductRow name="Чехол AirCase Pro" sku="AC-1190" category="Аксессуары" stock={42} />
                <ProductRow name="Портативная колонка Wave" sku="WV-8821" category="Электроника" stock={3} />
                <ProductRow name="Органайзер Grid" sku="GR-4402" category="Для дома" stock={26} />
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

function CategoryRow({ label, count }: { label: string; count: number }) {
  return (
    <li>
      <button className="group flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 outline-none transition hover:bg-white hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-500">
        <ChevronRight size={15} className="text-slate-400 transition group-hover:translate-x-0.5" />
        <span className="flex-1">{label}</span>
        <span className="text-xs text-slate-400">{count}</span>
      </button>
    </li>
  )
}

function ProductRow({ name, sku, category, stock }: { name: string; sku: string; category: string; stock: number }) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-5 py-4"><input type="checkbox" aria-label={`Выбрать ${name}`} className="size-4 rounded border-slate-300" /></td>
      <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Package size={19} /></span><span className="font-semibold text-slate-900">{name}</span></div></td>
      <td className="px-5 py-4 font-mono text-xs text-slate-500">{sku}</td>
      <td className="px-5 py-4 text-slate-600">{category}</td>
      <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${stock < 5 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{stock} шт.</span></td>
      <td className="px-5 py-4"><button aria-label={`Действия: ${name}`} className="grid size-8 place-items-center rounded-lg text-slate-400 outline-none hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500"><MoreHorizontal size={18} /></button></td>
    </tr>
  )
}

function ProductMobileCard({ name, sku, category, stock }: { name: string; sku: string; category: string; stock: number }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Package size={19} /></span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-5 text-slate-900">{name}</h3>
          <p className="mt-1 font-mono text-xs text-slate-400">{sku}</p>
        </div>
        <button aria-label={`Действия: ${name}`} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500"><MoreHorizontal size={18} /></button>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-slate-500">{category}</span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${stock < 5 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{stock} шт.</span>
      </div>
    </article>
  )
}

function ClientsPage() {
  return (
    <>
      <section className="relative min-h-[calc(100svh-5rem)] bg-slate-50 pb-24 md:hidden">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
          <h1 className="text-xl font-bold text-slate-950">Клиенты</h1>
          <label className="relative mt-3 block">
            <span className="sr-only">Поиск клиентов</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="search" placeholder="Поиск" className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
          </label>
        </header>
        <ClientsTable mobile />
        <button className="fixed bottom-24 right-5 z-30 inline-flex h-12 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-xl shadow-blue-600/30 outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
          <Plus size={19} /> Клиент
        </button>
      </section>

      <div className="hidden md:block">
        <PageShell eyebrow="База клиентов" title="Клиенты" description="Сегменты, контакты и история взаимодействий.">
          <ClientsTable />
        </PageShell>
      </div>
    </>
  )
}

function ClientsTable({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? 'overflow-x-auto bg-white' : 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="px-5 py-4">Имя</th><th className="px-5 py-4">Телефон</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Тип</th><th className="px-5 py-4">Последний контакт</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <ClientRow initials="ТЕ" name="Тестовый клиент" phone="+375 25 913 73 18" email="test@example.com" type="Физ. лицо" date="Сегодня, 10:42" tone="bg-blue-600" />
            <ClientRow initials="АП" name="Агалаков Павел" phone="+7 922 668 45 35" email="pavel@company.ru" type="Компания" date="Вчера, 18:20" tone="bg-red-600" />
            <ClientRow initials="АА" name="Александр AirPods USA" phone="+7 919 506 55 95" email="airpods@example.com" type="Компания" date="4 авг., 12:14" tone="bg-amber-500" />
            <ClientRow initials="АА" name="Акусьба Анастасия" phone="+7 919 526 78 27" email="anastasia@example.com" type="Компания" date="3 авг., 16:08" tone="bg-amber-500" />
            <ClientRow initials="АР" name="Акаев Рашид" phone="+7 912 712 21 31" email="rashid@example.com" type="Компания" date="2 авг., 09:25" tone="bg-rose-600" />
            <ClientRow initials="КЕ" name="KazanExpress" phone="+7 800 700 96 16" email="hello@kazanexpress.ru" type="Компания" date="1 авг., 14:50" tone="bg-violet-700" />
            <ClientRow initials="О" name="Ozon.ru" phone="+7 833 241 00 82" email="support@ozon.ru" type="Компания" date="31 июл., 11:10" tone="bg-amber-500" />
            <ClientRow initials="HI" name="Hisao Itoh" phone="+7 922 946 38 03" email="hisao@example.com" type="Физ. лицо" date="30 июл., 17:45" tone="bg-purple-700" />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ClientRow({ initials, name, phone, email, type, date, tone }: { initials: string; name: string; phone: string; email: string; type: string; date: string; tone: string }) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-5 py-3"><div className="flex items-center gap-3"><span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${tone}`}>{initials}</span><span className="font-semibold text-slate-900">{name}</span></div></td>
      <td className="px-5 py-3 font-medium text-blue-700">{phone}</td>
      <td className="px-5 py-3 text-slate-500">{email}</td>
      <td className="px-5 py-3 text-slate-600">{type}</td>
      <td className="px-5 py-3 text-slate-500">{date}</td>
    </tr>
  )
}
