import { Route, Routes } from 'react-router'
import { PublicOnly, Redirect, RequireCompleteProfile, RequireRole } from './auth/guards.tsx'
import Layout from './components/Layout.tsx'
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import UserHome from './pages/user/UserHome.tsx'
import UserProfile from './pages/user/UserProfile.tsx'
import UserSettings from './pages/user/UserSettings.tsx'
import UserSectionPage from './pages/user/UserSectionPage.tsx'
import AdminHome from './pages/admin/AdminHome.tsx'
import AdminUsers from './pages/admin/AdminUsers.tsx'
import AdminSettings from './pages/admin/AdminSettings.tsx'
import ProfileSetupPage from './pages/user/ProfileSetupPage.tsx'

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

            <Route element={<RequireRole role="USER" />}>
                {/* El setup queda accesible aunque el perfil todavía esté incompleto. */}
                <Route path="/user/profile-setup" element={<ProfileSetupPage />} />

                {/* exige los datos basicos completos */}
                <Route element={<RequireCompleteProfile />}>
                    <Route path="/user" element={<UserHome />} />
                    <Route path="/user/profile" element={<UserProfile />} />
                    <Route path="/user/settings" element={<UserSettings />} />
                    <Route path="/user/publicaciones" element={<UserSectionPage title="Mis publicaciones" description="Administra tus animales y lotes publicados." />} />
                    <Route path="/user/compras" element={<UserSectionPage title="Mis compras" description="Consulta tus compras, lotes guardados y operaciones." />} />
                    <Route path="/user/ventas" element={<UserSectionPage title="Ventas" description="Consulta el estado de tus ventas y operaciones como vendedor." />} />
                    <Route path="/user/publicar" element={<UserSectionPage title="Publicar animal" description="Formulario de publicación listo para conectar en el siguiente paso." />} />
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
