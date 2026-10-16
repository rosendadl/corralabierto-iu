const statCards = [
  { label: 'Usuarios registrados', hint: 'Sin datos todavía' },
  { label: 'Publicaciones activas', hint: 'Sin datos todavía' },
  { label: 'Reportes pendientes', hint: 'Sin datos todavía' },
  { label: 'Operaciones registradas', hint: 'Sin datos todavía' },
]

export default function AdminHome() {
  return (
    <section className="admin-page">
      <PageHeading
        eyebrow="PANEL DE ADMINISTRACIÓN"
        title="Resumen general"
        description="La actividad de la plataforma aparecerá aquí cuando existan datos registrados."
      />

      <div className="admin-stat-grid">
        {statCards.map((card) => (
          <article className="admin-stat-card" key={card.label}>
            <span className="admin-stat-label">{card.label}</span>
            <strong className="admin-stat-value">—</strong>
            <span className="admin-stat-hint">{card.hint}</span>
          </article>
        ))}
      </div>

      <div className="admin-panel admin-dashboard-empty">
        <EmptyState
          title="Todavía no hay actividad para mostrar"
          text="Cuando se registren usuarios, publicaciones u operaciones, el resumen aparecerá en este panel."
        />
      </div>
    </section>
  )
}

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="admin-page-heading">
      <span className="admin-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

export function EmptyState({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="admin-empty">
      <div className="admin-empty-icon" aria-hidden="true">○</div>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  )
}
