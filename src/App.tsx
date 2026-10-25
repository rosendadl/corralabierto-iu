import { Navigate, Route, Routes } from 'react-router'
import { PublicOnly, Redirect, RequireCompleteProfile, RequireRole } from './auth/guards.tsx'
import LoginPage from './pages/login/LoginPage.tsx'
import RegisterPage from './pages/register/RegisterPage.tsx'
import UserHome from './pages/user/UserHome.tsx'
import UserProfile from './pages/user/UserProfile.tsx'
import UserSettings from './pages/user/UserSettings.tsx'
import UserPublications from './pages/user/UserPublications.tsx'
import PublishLotPage from './pages/user/PublishLotPage.tsx'
import UserSectionPage from './pages/user/UserSectionPage.tsx'
import ProfileSetupPage from './pages/user/ProfileSetupPage.tsx'
import LotDetailPage from './pages/lot/LotDetailPage.tsx'

import AdminLayout from './pages/admin/AdminLayout.tsx'
import AdminHome from './pages/admin/AdminHome.tsx'
import AdminUsers from './pages/admin/AdminUsers.tsx'
import AdminPublications from './pages/admin/AdminPublications.tsx'
import AdminReports from './pages/admin/AdminReports.tsx'
import AdminCatalog from './pages/admin/AdminCatalog.tsx'
import AdminSettings from './pages/admin/AdminSettings.tsx'

export default function App() {
    return (
        <Routes>
            <Route element={<PublicOnly />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<RequireRole role="USER" />}>
                <Route path="/user/profile-setup" element={<ProfileSetupPage />} />

                <Route element={<RequireCompleteProfile />}>
                    <Route path="/user" element={<UserHome />} />
                    <Route path="/user/profile" element={<UserProfile />} />
                    <Route path="/user/settings" element={<UserSettings />} />
                    <Route path="/user/publicaciones" element={<UserPublications />} />
                    <Route path="/user/publicar" element={<PublishLotPage />} />
                    <Route path="/user/lote/:id" element={<LotDetailPage />} />
                    <Route path="/user/ventas" element={<Navigate to="/user/publicaciones#ventas" replace />} />
                    <Route
                        path="/user/compras"
                        element={
                            <UserSectionPage
                                title="Mis compras"
                                description="Tus compras aparecerán aquí cuando implementemos ese flujo."
                            />
                        }
                    />
                </Route>
            </Route>

            <Route element={<RequireRole role="ADMIN" />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminHome />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="publications" element={<AdminPublications />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="catalog" element={<AdminCatalog />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>
            </Route>

            <Route path="*" element={<Redirect />} />
        </Routes>
    )
}