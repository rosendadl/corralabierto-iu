import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import "../user/UserHome.css";
import logo from "../../assets/corral-abierto-logo.png";
import { useAuth } from "../../auth/AuthContext.tsx";
import NotificationsPopover from "../../components/NotificationsPopover.tsx";
import { canBuy, canSell, displayName, initials, loadProfile, modeLabel, type LocalProfile } from "../../profileStore.ts";
import LotCard from "../../components/LotCard.tsx";
import { useCatalog } from "../../useCatalog.ts";
import { pricing, type LotDetail } from "../../lotDetails.ts";

const MIN_PRICE = 0;
const MAX_PRICE = 100000;

// Precio por cabeza para filtrar y ordenar (si no se puede calcular, el precio capturado).
const headPrice = (lot: LotDetail) => pricing(lot).perHead ?? lot.price;

export default function UserHome() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { lots, loading, error, reload } = useCatalog();
    const [profile, setProfile] = useState<LocalProfile | null>(() => loadProfile(user?.username));
    const [species, setSpecies] = useState("Todos");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("recent");
    const [minPrice, setMinPrice] = useState(MIN_PRICE);
    const [maxPrice, setMaxPrice] = useState(MAX_PRICE);


    useEffect(() => {
        const refresh = () => setProfile(loadProfile(user?.username));
        refresh();
        window.addEventListener("corral-profile-updated", refresh);
        return () => window.removeEventListener("corral-profile-updated", refresh);
    }, [user?.username]);

    const userDisplayName = displayName(profile, user?.username);
    const userInitials = initials(profile, user?.username);
    const sellerMode = canSell(profile?.tradeMode);
    const buyerMode = canBuy(profile?.tradeMode);

    const filteredLots = useMemo(() => {
        let result = lots.filter((lot) => {
            const matchesSpecies = species === "Todos" || lot.species === species;
            const text = `${lot.title} ${lot.species} ${lot.breed} ${lot.municipality} ${lot.state} ${lot.seller.name}`.toLowerCase();
            const matchesSearch = text.includes(search.toLowerCase());
            const price = headPrice(lot);
            const matchesPrice = price >= minPrice && price <= maxPrice;
            return matchesSpecies && matchesSearch && matchesPrice;
        });

        if (sort === "price-asc") result = [...result].sort((a, b) => headPrice(a) - headPrice(b));
        if (sort === "price-desc") result = [...result].sort((a, b) => headPrice(b) - headPrice(a));
        return result;
    }, [lots, species, search, sort, minPrice, maxPrice]);

    return (
        <div className="market-page">
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
                            <div className="avatar">{userInitials}</div>
                            <div>
                                <strong>{userDisplayName}</strong>
                                <small>{modeLabel(profile?.tradeMode)}</small>
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="market-main">
                <section className="benefits-row">
                    <div className="benefit-card"><div className="benefit-icon green">✓</div><div><strong>Hatos Certificados</strong><span>Pruebas TB/BR y guías REEMO al día</span></div></div>
                    <div className="benefit-card"><div className="benefit-icon orange">↔</div><div><strong>Trato Directo con Productor</strong><span>Sin comisiones infladas de intermediario</span></div></div>
                    <div className="benefit-card"><div className="benefit-icon blue">▣</div><div><strong>Logística en Pie Coordinada</strong><span>Rutas seguras y control de fletes</span></div></div>
                </section>

                <div className="catalog-layout">
                    <aside className="filters-card">
                        <div className="filters-title-row">
                            <h2>☷ Filtros de búsqueda</h2>
                            <button onClick={() => { setSpecies("Todos"); setSearch(""); setMinPrice(MIN_PRICE); setMaxPrice(MAX_PRICE); }}>↻ Limpiar filtros</button>
                        </div>

                        <div className="filter-block">
                            <label>ESPECIE</label>
                            <div className="species-grid">
                                {["Todos", "Bovino", "Ovino", "Porcino", "Caprino", "Equino"].map((item) => (
                                    <button key={item} className={species === item ? "selected" : ""} onClick={() => setSpecies(item)}>{item}</button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-block">
                            <label>RAZA</label>
                            <select><option>Todas las razas</option></select>
                        </div>

                        <div className="filter-block">
                            <label>SEXO / CATEGORÍA</label>
                            <div className="chips"><span>Todos</span><span>Sementales</span><span>Hembras / Vaquillas</span><span>Mixto</span></div>
                        </div>

                        <div className="filter-block">
                            <div className="price-heading"><label>PRECIO / CABEZA (MXN)</label><span>${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}</span></div>
                            <input className="range" type="range" min={MIN_PRICE} max={MAX_PRICE} step="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                            <div className="price-inputs">
                                <div><small>Min ($)</small><input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))}/></div>
                                <div><small>Máx ($)</small><input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}/></div>
                            </div>
                        </div>

                        <div className="filter-block">
                            <label>UBICACIÓN DE ORIGEN</label>
                            <select defaultValue="Sonora"><option>Sonora</option><option>Jalisco</option><option>Chihuahua</option></select>
                            <input type="text" defaultValue="Hermosillo" />
                        </div>

                        <label className="check-row"><input type="checkbox" defaultChecked/><span><strong>Certificado zoosanitario vigente</strong><small>Solo lotes avalados por médico veterinario oficial</small></span></label>
                        <button className="apply-btn">⌁ Aplicar filtros</button>

                        <div className="support-box"><strong>¿Buscas un lote a medida?</strong><a href="#">Contactar mesa de acopio</a></div>
                    </aside>

                    <section className="results-panel">
                        <div className="results-banner">
                            <div><h1>Mostrando {filteredLots.length} lotes disponibles ✓</h1><p>Precios actualizados en tiempo real y trato directo sin intermediarios</p></div>
                            <div className="market-ticker"><small>NOVILLO EN PIE (PROMEDIO)</small><strong>$54.20 MXN / kg ↗</strong></div>
                        </div>

                        <div className="toolbar">
                            <div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por raza, fierro o lote..." /></div>
                            <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Ordenar: Recientes</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option></select>
                        </div>

                        {error && (
                            <div className="catalog-message">
                                No se pudieron cargar los lotes publicados: {error} <button onClick={() => reload()}>Reintentar</button>
                            </div>
                        )}
                        {loading && <div className="catalog-message">Cargando lotes publicados…</div>}

                        <div className="animal-grid">
                            {filteredLots.map((lot) => (
                                <LotCard key={lot.id} lot={lot} onOpen={(item) => navigate(`/user/lote/${item.id}`)} />
                            ))}
                        </div>
                        {!loading && filteredLots.length === 0 && <div className="catalog-message">No hay lotes con esos filtros.</div>}

                        <div className="pagination"><span>Mostrando 1 - {filteredLots.length} de {lots.length} lotes en venta</span><div><button>‹</button><button className="active">1</button><button>2</button><button>3</button><span>...</span><button>12</button><button>Siguiente ›</button></div></div>
                    </section>
                </div>
            </main>

            <footer className="market-footer">
                <div className="footer-grid">
                    <div><h3>Corral Abierto</h3><p>Mercado ganadero digital de alta precisión y confianza para el productor agropecuario nacional.</p></div>
                    <div><h4>Soporte Ganadero</h4><a>Mesa de Ayuda de Campo</a><a>Verificación de Lotes</a><a>Guías de Tránsito y REEMO</a></div>
                    <div><h4>Sanidad y Regulación</h4><strong>✓ Normativa SENASICA / SADER</strong><p>Cumplimiento estricto con protocolos de trazabilidad, pruebas de hato libre y certificados zoosanitarios.</p></div>
                    <div><h4>Marco Legal</h4><a>Términos y Condiciones</a><a>Aviso de Privacidad</a><a>Garantía de Transacción Pecuaria</a></div>
                </div>
                <div className="footer-bottom"><span>© 2024 Corral Abierto S.A. de C.V. Todos los derechos reservados.</span><span>▣ Transacciones Protegidas &nbsp;&nbsp; ⛓ Registro Ganadero Validado</span></div>
            </footer>
        </div>
    );
}