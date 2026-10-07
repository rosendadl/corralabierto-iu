import { Route, Routes } from 'react-router'
import { PublicOnly, Redirect, RequireRole } from './auth/guards.tsx'
import Layout from './components/Layout.tsx'
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import UserHome from './pages/user/UserHome.tsx'
import UserProfile from './pages/user/UserProfile.tsx'
import UserSettings from './pages/user/UserSettings.tsx'
import AdminHome from './pages/admin/AdminHome.tsx'
import AdminUsers from './pages/admin/AdminUsers.tsx'
import AdminSettings from './pages/admin/AdminSettings.tsx'
import ProfileSetupPage from "./pages/user/ProfileSetupPage";

const userLinks = [
    { to: '/user', label: 'Inicio' },
    { to: '/user/profile', label: 'Perfil' },
    { to: '/user/settings', label: 'Configuración' },
]

const adminLinks = [
    { to: '/admin', label: 'Home' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/settings', label: 'Settings' },
]

export default function App() {
    return (
        <Routes>

            <Route element={<PublicOnly />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route
                path="/user/profile-setup"
                element={<ProfileSetupPage />}
            />

            <Route element={<RequireRole role="USER" />}>
                <Route path="/user" element={<UserHome />} />

                <Route element={<Layout links={userLinks} />}>
                    <Route path="/user/profile" element={<UserProfile />} />
                    <Route path="/user/settings" element={<UserSettings />} />
                </Route>
            </Route>

            <Route element={<RequireRole role="ADMIN" />}>
                <Route path="/admin" element={<Layout links={adminLinks} />}>
                    <Route index element={<AdminHome />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>
            </Route>

            <Route path="*" element={<Redirect />} />
        </Routes>
    )
}

