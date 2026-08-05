/* eslint-disable react-refresh/only-export-components -- compound components share private contexts */
import {
  createContext,
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

type ChangeHandler<T> = (value: T) => void

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: ChangeHandler<T>
}) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const setValue = useCallback(
    (nextValue: T) => {
      if (!isControlled) setInternalValue(nextValue)
      if (!Object.is(currentValue, nextValue)) onChange?.(nextValue)
    },
    [currentValue, isControlled, onChange],
  )

  return [currentValue, setValue] as const
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' || !window.matchMedia ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    if (!window.matchMedia) return
    const mediaQuery = window.matchMedia(query)
    const update = () => setMatches(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [query])

  return matches
}

interface SidebarContextValue {
  expanded: boolean
  setExpanded: ChangeHandler<boolean>
  isMobile: boolean
  openSubmenuId: string | null
  setOpenSubmenuId: ChangeHandler<string | null>
  navigationRef: RefObject<HTMLElement | null>
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

function useSidebarContext(component: string) {
  const context = useContext(SidebarContext)
  if (!context) throw new Error(`${component} must be used inside Sidebar.Root`)
  return context
}

interface RootProps extends HTMLAttributes<HTMLDivElement> {
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: ChangeHandler<boolean>
  mobile?: boolean
  mobileBreakpoint?: number
}

const Root = forwardRef(function Root(
  {
    expanded: expandedProp,
    defaultExpanded = true,
    onExpandedChange,
    mobile: mobileProp,
    mobileBreakpoint = 768,
    children,
    ...props
  }: RootProps,
  ref: Ref<HTMLDivElement>,
) {
  const [expanded, setExpanded] = useControllableState({
    value: expandedProp,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  })
  const detectedMobile = useMediaQuery(`(max-width: ${mobileBreakpoint - 1}px)`)
  const isMobile = mobileProp ?? detectedMobile
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null)
  const navigationRef = useRef<HTMLElement>(null)

  // A submenu opened as a desktop popover must never leak into the mobile layout.
  useEffect(() => setOpenSubmenuId(null), [isMobile, expanded])

  const value = useMemo(
    () => ({
      expanded,
      setExpanded,
      isMobile,
      openSubmenuId,
      setOpenSubmenuId,
      navigationRef,
    }),
    [expanded, isMobile, openSubmenuId, setExpanded],
  )

  return (
    <SidebarContext.Provider value={value}>
      <div
        ref={ref}
        data-expanded={expanded || undefined}
        data-collapsed={!expanded || undefined}
        data-mobile={isMobile || undefined}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
})

const Navigation = forwardRef(function Navigation(
  { onKeyDown, ...props }: HTMLAttributes<HTMLElement>,
  forwardedRef: Ref<HTMLElement>,
) {
  const { navigationRef } = useSidebarContext('Sidebar.Navigation')

  const setRefs = (node: HTMLElement | null) => {
    navigationRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const supportedKeys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!supportedKeys.includes(event.key)) return

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[data-sidebar-focusable]:not([disabled])'),
    )
    if (!focusable.length) return

    const currentIndex = focusable.indexOf(document.activeElement as HTMLElement)
    const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1
    let nextIndex = currentIndex
    if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = focusable.length - 1
    else nextIndex = (Math.max(currentIndex, 0) + direction + focusable.length) % focusable.length

    event.preventDefault()
    focusable[nextIndex]?.focus()
  }

  return <nav ref={setRefs} onKeyDown={handleKeyDown} {...props} />
})

const List = forwardRef(function List(
  props: HTMLAttributes<HTMLUListElement>,
  ref: Ref<HTMLUListElement>,
) {
  return <ul ref={ref} {...props} />
})

interface ItemProps extends HTMLAttributes<HTMLLIElement> {
  active?: boolean
}

const Item = forwardRef(function Item(
  { active = false, ...props }: ItemProps,
  ref: Ref<HTMLLIElement>,
) {
  return <li ref={ref} data-active={active || undefined} {...props} />
})

type ActionProps = ButtonHTMLAttributes<HTMLButtonElement>

const Action = forwardRef(function Action(
  props: ActionProps,
  ref: Ref<HTMLButtonElement>,
) {
  return <button ref={ref} type="button" data-sidebar-focusable="" {...props} />
})

interface CollapseTriggerProps extends ActionProps {
  expandedLabel?: string
  collapsedLabel?: string
}

const CollapseTrigger = forwardRef(function CollapseTrigger(
  {
    expandedLabel = 'Свернуть боковое меню',
    collapsedLabel = 'Развернуть боковое меню',
    onClick,
    ...props
  }: CollapseTriggerProps,
  ref: Ref<HTMLButtonElement>,
) {
  const { expanded, setExpanded } = useSidebarContext('Sidebar.CollapseTrigger')
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event)
    if (!event.defaultPrevented) setExpanded(!expanded)
  }

  return (
    <Action
      ref={ref}
      aria-label={expanded ? expandedLabel : collapsedLabel}
      aria-expanded={expanded}
      onClick={handleClick}
      {...props}
    />
  )
})

interface SubmenuContextValue {
  id: string
  active: boolean
  open: boolean
  setOpen: ChangeHandler<boolean>
  triggerId: string
  contentId: string
}

const SubmenuContext = createContext<SubmenuContextValue | null>(null)

function useSubmenuContext(component: string) {
  const context = useContext(SubmenuContext)
  if (!context) throw new Error(`${component} must be used inside Sidebar.Submenu`)
  return context
}

interface SubmenuProps extends ItemProps {
  id: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: ChangeHandler<boolean>
}

const Submenu = forwardRef(function Submenu(
  {
    id,
    active = false,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    children,
    ...props
  }: SubmenuProps,
  ref: Ref<HTMLLIElement>,
) {
  const sidebar = useSidebarContext('Sidebar.Submenu')
  const [localOpen, setLocalOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const closeTimer = useRef<number | null>(null)
  const generatedId = useId()
  const triggerId = `sidebar-trigger-${generatedId}`
  const contentId = `sidebar-content-${generatedId}`
  const usesSharedPopover = !sidebar.isMobile && !sidebar.expanded
  const open = usesSharedPopover ? sidebar.openSubmenuId === id : localOpen

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (usesSharedPopover) sidebar.setOpenSubmenuId(nextOpen ? id : null)
      else setLocalOpen(nextOpen)
    },
    [id, setLocalOpen, sidebar, usesSharedPopover],
  )

  // The parent remains highlighted and expanded whenever a routed child is active.
  useEffect(() => {
    if (active && sidebar.expanded && !sidebar.isMobile) setLocalOpen(true)
  }, [active, setLocalOpen, sidebar.expanded, sidebar.isMobile])

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
    },
    [],
  )

  const handleMouseEnter: MouseEventHandler<HTMLLIElement> = (event) => {
    onMouseEnter?.(event)
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    if (usesSharedPopover) setOpen(true)
  }

  const handleMouseLeave: MouseEventHandler<HTMLLIElement> = (event) => {
    onMouseLeave?.(event)
    if (usesSharedPopover) closeTimer.current = window.setTimeout(() => setOpen(false), 120)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    onKeyDown?.(event)
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
      document.getElementById(triggerId)?.focus()
    }
  }

  const value = useMemo(
    () => ({ id, active, open, setOpen, triggerId, contentId }),
    [active, contentId, id, open, setOpen, triggerId],
  )

  return (
    <SubmenuContext.Provider value={value}>
      <li
        ref={ref}
        data-active={active || undefined}
        data-open={open || undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </li>
    </SubmenuContext.Provider>
  )
})

const SubmenuTrigger = forwardRef(function SubmenuTrigger(
  { onClick, ...props }: ActionProps,
  ref: Ref<HTMLButtonElement>,
) {
  const { open, setOpen, triggerId, contentId } = useSubmenuContext('Sidebar.SubmenuTrigger')
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event)
    if (!event.defaultPrevented) setOpen(!open)
  }

  return (
    <Action
      ref={ref}
      id={triggerId}
      aria-controls={contentId}
      aria-expanded={open}
      onClick={handleClick}
      {...props}
    />
  )
})

interface SubmenuContentProps extends HTMLAttributes<HTMLUListElement> {
  label: string
  panelClassName?: string
  backdropClassName?: string
  headingClassName?: string
  closeClassName?: string
  closeLabel?: string
}

const SubmenuContent = forwardRef(function SubmenuContent(
  {
    label,
    panelClassName,
    backdropClassName,
    headingClassName,
    closeClassName,
    closeLabel = 'Закрыть подменю',
    children,
    ...props
  }: SubmenuContentProps,
  ref: Ref<HTMLUListElement>,
) {
  const sidebar = useSidebarContext('Sidebar.SubmenuContent')
  const { open, setOpen, triggerId, contentId } = useSubmenuContext('Sidebar.SubmenuContent')
  const titleId = `${contentId}-title`

  if (!open) return null

  const list = (
    <ul ref={ref} id={contentId} aria-labelledby={triggerId} {...props}>
      {children}
    </ul>
  )

  if (!sidebar.isMobile) return list
  if (typeof document === 'undefined') return null

  return (
    <MobileSubmenuLayer
      titleId={titleId}
      triggerId={triggerId}
      label={label}
      closeLabel={closeLabel}
      onClose={() => setOpen(false)}
      backdropClassName={backdropClassName}
      panelClassName={panelClassName}
      headingClassName={headingClassName}
      closeClassName={closeClassName}
    >
      {list}
    </MobileSubmenuLayer>
  )
})

interface MobileSubmenuLayerProps {
  titleId: string
  triggerId: string
  label: string
  closeLabel: string
  onClose: () => void
  backdropClassName?: string
  panelClassName?: string
  headingClassName?: string
  closeClassName?: string
  children: ReactNode
}

function MobileSubmenuLayer({
  titleId,
  triggerId,
  label,
  closeLabel,
  onClose,
  backdropClassName,
  panelClassName,
  headingClassName,
  closeClassName,
  children,
}: MobileSubmenuLayerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const animationFrame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>('[data-sidebar-focusable], button')?.focus()
    })

    return () => {
      cancelAnimationFrame(animationFrame)
      document.body.style.overflow = previousOverflow
      document.getElementById(triggerId)?.focus()
    }
  }, [triggerId])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <div data-sidebar-mobile-layer="">
      <button type="button" className={backdropClassName} aria-label={closeLabel} onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={panelClassName}
        onKeyDown={handleKeyDown}
      >
        <div className={headingClassName}>
          <h2 id={titleId}>{label}</h2>
          <button type="button" className={closeClassName} aria-label={closeLabel} onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

const SubmenuItem = forwardRef(function SubmenuItem(
  { active = false, onClick, ...props }: ItemProps,
  ref: Ref<HTMLLIElement>,
) {
  const sidebar = useSidebarContext('Sidebar.SubmenuItem')
  const { setOpen } = useSubmenuContext('Sidebar.SubmenuItem')

  const handleClickCapture = () => {
    // Capture runs before a nested router link changes location or stops bubbling.
    if (sidebar.isMobile) setOpen(false)
  }

  return <li ref={ref} data-active={active || undefined} onClickCapture={handleClickCapture} onClick={onClick} {...props} />
})

export const Sidebar = {
  Root,
  Navigation,
  List,
  Item,
  Action,
  CollapseTrigger,
  Submenu,
  SubmenuTrigger,
  SubmenuContent,
  SubmenuItem,
}
