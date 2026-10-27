import { useEffect, useState } from "react";
import { Link } from "react-router";
import logo from "../assets/corral-abierto-logo.png";
import { useAuth } from "../auth/AuthContext.tsx";
import NotificationsPopover from "./NotificationsPopover.tsx";
import { canBuy, canSell, displayName, initials, loadProfile, modeLabel, type LocalProfile } from "../profileStore.ts";


export default function MarketHeader() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<LocalProfile | null>(() => loadProfile(user?.username));

    useEffect(() => {
        const refresh = () => setProfile(loadProfile(user?.username));
        refresh();
        window.addEventListener("corral-profile-updated", refresh);
        return () => window.removeEventListener("corral-profile-updated", refresh);
    }, [user?.username]);

    const sellerMode = canSell(profile?.tradeMode);
    const buyerMode = canBuy(profile?.tradeMode);

    return (
        <header className="market-header">
            <div className="header-inner">
                <Link to="/user" className="brand">
                    <img src={logo} alt="Corral Abierto" />
                    <span>Corral Abierto</span>
                </Link>

                <nav className="main-nav">
                    <Link to="/user" className="active">Catálogo</Link>
                    {sellerMode && <Link to="/user/publicaciones">Mis Publicaciones</Link>}
                    {buyerMode && <Link to="/user/compras">Mis Compras</Link>}
                    <Link to="/user/profile">Mi Perfil</Link>
                </nav>

                <div className="header-actions">
                    {sellerMode && <Link className="publish-btn" to="/user/publicar">＋ Publicar Animal</Link>}
                    <NotificationsPopover />
                    <Link className="profile-chip" to="/user/profile" aria-label="Abrir perfil">
                        <div className="avatar">{initials(profile, user?.username)}</div>
                        <div>
                            <strong>{displayName(profile, user?.username)}</strong>
                            <small>{modeLabel(profile?.tradeMode)}</small>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
