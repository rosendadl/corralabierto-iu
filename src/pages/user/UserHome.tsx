import { Link } from 'react-router'

export default function UserHome() {
  return (
    <>
      <h1>User home</h1>
      <p className="muted">
        Only users can see pages under /user. Try opening <Link to="/admin">/admin</Link> or{' '}
        <Link to="/admin/users">/admin/users</Link>: you'll be sent back here.
      </p>
    </>
  )
}
