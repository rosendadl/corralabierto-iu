import { EmptyState, PageHeading } from './AdminHome.tsx'

export default function AdminCatalog() {
  return (
    <section className="admin-page">
      <PageHeading
        eyebrow="CATÁLOGO"
        title="Especies, razas y categorías"
        description="Administra las opciones que posteriormente utilizarán los filtros y formularios del marketplace."
      />

      <div className="admin-catalog-grid">
        <article className="admin-panel admin-mini-panel">
          <div className="admin-mini-head">
            <span className="admin-mini-icon" aria-hidden="true">◇</span>
            <div>
              <h2>Especies y razas</h2>
              <p>Catálogo ganadero disponible en la plataforma.</p>
            </div>
          </div>
          <EmptyState
            title="Sin datos todavía"
            text="Las especies y razas configuradas aparecerán aquí."
          />
        </article>

        <article className="admin-panel admin-mini-panel">
          <div className="admin-mini-head">
            <span className="admin-mini-icon" aria-hidden="true">▦</span>
            <div>
              <h2>Categorías</h2>
              <p>Categorías utilizadas para clasificar animales y lotes.</p>
            </div>
          </div>
          <EmptyState
            title="Sin datos todavía"
            text="Las categorías configuradas aparecerán aquí."
          />
        </article>
      </div>
    </section>
  )
}
