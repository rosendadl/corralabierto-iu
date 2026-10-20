import { EmptyState, PageHeading } from '../AdminHome/AdminHome.tsx'

export default function AdminPublications() {
  return (
    <section className="admin-page">
      <PageHeading
        eyebrow="MODERACIÓN"
        title="Publicaciones"
        description="Revisa las publicaciones del marketplace y las que requieran atención."
      />

      <div className="admin-panel">
        <div className="admin-table-head admin-publications-grid">
          <span>Publicación</span>
          <span>Vendedor</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        <EmptyState
          title="No hay publicaciones para mostrar"
          text="Las publicaciones aparecerán aquí cuando estén disponibles para administración."
        />
      </div>
    </section>
  )
}
