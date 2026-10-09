import { Link } from 'react-router'
import logo from '../../assets/corral-abierto-logo.png'
import './UserSectionPage.css'

type UserSectionPageProps = {
  title: string
  description: string
}

export default function UserSectionPage({ title, description }: UserSectionPageProps) {
  return (
    <div className="user-section-page">
      <header className="user-section-header">
        <Link className="user-section-brand" to="/user" aria-label="Ir al inicio">
          <img src={logo} alt="Corral Abierto" />
        </Link>
        <Link className="user-section-back" to="/user">← Volver al catálogo</Link>
      </header>

      <main className="user-section-main">
        <p className="user-section-eyebrow">Corral Abierto</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="user-section-empty">
          <strong>Esta sección todavía no tiene contenido.</strong>
          <span>La ruta ya funciona y queda lista para conectar su funcionalidad después.</span>
        </div>
      </main>
    </div>
  )
}
