import { useEffect, useRef, useState } from 'react'
import './NotificationsPopover.css'

export default function NotificationsPopover() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div className="notifications-root" ref={rootRef}>
      <button
        type="button"
        className={`notifications-trigger ${open ? 'active' : ''}`}
        aria-label="Abrir notificaciones"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      </button>

      {open && (
        <div className="notifications-popover" role="dialog" aria-label="Notificaciones">
          <div className="notifications-head">
            <div>
              <span className="notifications-eyebrow">ACTIVIDAD</span>
              <h3>Notificaciones</h3>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar notificaciones">×</button>
          </div>

          <div className="notifications-empty">
            <div className="notifications-empty-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </svg>
            </div>
            <strong>No hay notificaciones</strong>
            <p>Cuando haya actividad importante en tu cuenta, aparecerá aquí.</p>
          </div>
        </div>
      )}
    </div>
  )
}
