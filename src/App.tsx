import { Navigate, Route, Routes } from 'react-router'
import { PublicOnly, Redirect, RequireCompleteProfile, RequireRole } from './auth/guards.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.tsx'
import UserHome from './pages/user/UserHome/UserHome.tsx'
import UserProfile from './pages/user/UserProfile/UserProfile.tsx'
import UserSettings from './pages/user/UserSettings/UserSettings.tsx'
import UserPublications from './pages/user/UserPublications/UserPublications.tsx'
import PublishLotPage from './pages/user/PublishLotPage/PublishLotPage.tsx'
import UserSectionPage from './pages/user/UserSectionPage/UserSectionPage.tsx'
import ProfileSetupPage from './pages/user/ProfileSetupPage/ProfileSetupPage.tsx'

import AdminLayout from './pages/admin/AdminLayout/AdminLayout.tsx'
import AdminHome from './pages/admin/AdminHome/AdminHome.tsx'
import AdminUsers from './pages/admin/AdminUsers/AdminUsers.tsx'
import AdminPublications from './pages/admin/AdminPublications/AdminPublications.tsx'
import AdminReports from './pages/admin/AdminReports/AdminReports.tsx'
import AdminCatalog from './pages/admin/AdminCatalog/AdminCatalog.tsx'
import AdminSettings from './pages/admin/AdminSettings/AdminSettings.tsx'

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
