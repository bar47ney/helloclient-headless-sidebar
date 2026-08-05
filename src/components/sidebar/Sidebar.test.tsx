import { useState } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Sidebar } from './Sidebar'

afterEach(cleanup)

function Example({ mobile = false }: { mobile?: boolean }) {
  return (
    <Sidebar.Root mobile={mobile}>
      <Sidebar.Navigation aria-label="Main">
        <Sidebar.List>
          <Sidebar.Item><Sidebar.Action>Overview</Sidebar.Action></Sidebar.Item>
          <Sidebar.Submenu id="clients" active>
            <Sidebar.SubmenuTrigger>Clients</Sidebar.SubmenuTrigger>
            <Sidebar.SubmenuContent label="Clients">
              <Sidebar.SubmenuItem><button data-sidebar-focusable="">List</button></Sidebar.SubmenuItem>
              <Sidebar.SubmenuItem active><button data-sidebar-focusable="">Reviews</button></Sidebar.SubmenuItem>
            </Sidebar.SubmenuContent>
          </Sidebar.Submenu>
        </Sidebar.List>
      </Sidebar.Navigation>
    </Sidebar.Root>
  )
}

describe('Sidebar', () => {
  it('supports a controlled expanded state', async () => {
    const onExpandedChange = vi.fn()
    render(
      <Sidebar.Root expanded onExpandedChange={onExpandedChange} mobile={false}>
        <Sidebar.CollapseTrigger>Toggle</Sidebar.CollapseTrigger>
      </Sidebar.Root>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Свернуть боковое меню' }))
    expect(onExpandedChange).toHaveBeenCalledWith(false)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('can be wired to external useState', async () => {
    function ControlledExample() {
      const [expanded, setExpanded] = useState(true)
      return <Sidebar.Root expanded={expanded} onExpandedChange={setExpanded} mobile={false}><Sidebar.CollapseTrigger>Toggle</Sidebar.CollapseTrigger></Sidebar.Root>
    }
    render(<ControlledExample />)
    const trigger = screen.getByRole('button')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAccessibleName('Развернуть боковое меню')
  })

  it('opens an active desktop submenu and exposes accessible relationships', () => {
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Clients' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Reviews' }).parentElement).toHaveAttribute('data-active', 'true')
    expect(document.getElementById(trigger.getAttribute('aria-controls')!)).toBeInTheDocument()
  })

  it('renders a mobile submenu as a dialog and closes it after navigation', async () => {
    render(<Example mobile />)
    await userEvent.click(screen.getByRole('button', { name: 'Clients' }))
    expect(screen.getByRole('dialog', { name: 'Clients' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Reviews' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('supports arrow-key navigation', async () => {
    render(<Example />)
    const overview = screen.getByRole('button', { name: 'Overview' })
    overview.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Clients' })).toHaveFocus()
  })
})
