import { Link } from 'react-router'
import Profile from '../../components/Profile.tsx'

export default function AdminHome() {
  return (
    <>
      <h1>Admin home</h1>
      <p className="muted">
        Only admins can see pages under /admin. Try opening <Link to="/user">/user</Link> or{' '}
        <Link to="/user/profile">/user/profile</Link>: you'll be sent back here.
      </p>
      <Profile />
    </>
  )
}
