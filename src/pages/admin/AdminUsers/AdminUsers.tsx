import { EmptyState, PageHeading } from '../AdminHome/AdminHome.tsx'

export default function AdminUsers() {
  return (
    <section className="admin-page">
      <PageHeading
        eyebrow="CUENTAS"
        title="Usuarios"
        description="Consulta y administra las cuentas registradas en Corral Abierto."
      />

      <div className="admin-panel">
        <div className="admin-table-head admin-users-grid">
          <span>Usuario</span>
          <span>Tipo de perfil</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        <EmptyState
          title="No hay usuarios para mostrar"
          text="Cuando existan cuentas disponibles desde el endpoint de administración, aparecerán aquí."
        />
      </div>
    </section>
  )
}
