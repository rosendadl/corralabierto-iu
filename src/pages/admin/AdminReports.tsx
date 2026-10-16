import { EmptyState, PageHeading } from './AdminHome.tsx'

export default function AdminReports() {
  return (
    <section className="admin-page">
      <PageHeading
        eyebrow="INCIDENCIAS"
        title="Reportes"
        description="Consulta reportes relacionados con usuarios o publicaciones."
      />

      <div className="admin-panel">
        <div className="admin-table-head admin-reports-grid">
          <span>Reporte</span>
          <span>Tipo</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        <EmptyState
          title="No hay reportes abiertos"
          text="Los reportes enviados a administración aparecerán aquí."
        />
      </div>
    </section>
  )
}
