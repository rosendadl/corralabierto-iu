import { Link } from 'react-router'

export default function UserSectionPage({ title, description }: { title: string; description: string }) {
  return (
    <main style={{ minHeight: '100vh', background: '#f7f9fc', padding: '64px 20px', fontFamily: 'Inter, sans-serif' }}>
      <section style={{ maxWidth: 760, margin: '0 auto', background: '#fff', border: '1px solid #e5e9ef', borderRadius: 16, padding: 28 }}>
        <Link to="/user" style={{ color: '#166534', textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>← Volver al catálogo</Link>
        <h1 style={{ margin: '18px 0 7px' }}>{title}</h1>
        <p style={{ margin: 0, color: '#6b7585' }}>{description}</p>
      </section>
    </main>
  )
}
