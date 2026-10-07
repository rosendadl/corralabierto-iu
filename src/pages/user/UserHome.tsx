import { useMemo, useState } from "react";
import { Link } from "react-router";
import "./UserHome.css";
import logo from "../../assets/corral-abierto-logo.png";

const animals = [
    {
        id: 1,
        title: "Lote de 10 Borregos Dorper F1",
        species: "Ovino",
        age: "8 meses",
        location: "Hermosillo, Sonora",
        price: 3200,
        unit: "MXN / cabeza",
        seller: "Rancho Santa Elena",
        rating: "4.9",
        deals: "28 tratos",
        badge: "Disponible (10 cabezas)",
        extra: "Guía REEMO",
        note: "Fierro: #EL-491",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8VIK6PIcHnMEpJfUd8cEu5YC9lRbhXAIugNI1cP0yfK8adkS-3kaqUqBGvp-5YuD_jYZRLOILqYuFC-O0n7ah5dH_pGuuxWGhWtduUVACjGxAJRQRQYBwQGbQ71eC8WjWi4TP9Ky75BptqKi1EEP1b5BIrjDJk_ROzjzMPYkDRHrsxyQRy9Kc11RjArHl-ZOdDlRgc0Vt4n1s5gfQJnI7vfTr3IEw9reIxEdApmCBUUdXyYevxE5z",
    },
    {
        id: 2,
        title: "Toro Semental Simmental Registro Puro",
        species: "Bovino",
        age: "24 meses",
        location: "Tepatitlán, Jal.",
        price: 48000,
        unit: "MXN",
        seller: "Cabaña Los Pinos",
        rating: "5.0",
        deals: "14 tratos",
        badge: "Disponible (1 cabeza)",
        extra: "Pedigree Oficial",
        note: "820 kg en báscula",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRcaLqSNEfpUX8qcmcYaJWPuhvgJCB_zNUO2ub2euk5A8xJxrq1_BiDfxhcGFkPHU-Ypaqz7WJdubJi1LAv6hwttaFALEnbGHXiIjW_yB8jtmoBqKHdHH5MEV6PTWO_69qpws8WZaxF7kZDu1VhprJJXeYYbIs3DPKWsnj26qPkHyRA2lHnxedsVXUBWe3sR-oA5VMp3hAHH5dShLhaVcVwYDFWNCXLT_kmAIreQhs0FETNRuu10yA",
    },
    {
        id: 3,
        title: "Lote 25 Vaquillas Angus Negro preñadas",
        species: "Bovino",
        age: "18 meses",
        location: "Chihuahua, Chih.",
        price: 28500,
        unit: "MXN / cab.",
        seller: "Ganadera Del Norte",
        rating: "",
        deals: "En proceso de anticipo",
        badge: "Reservada",
        extra: "25 cabezas",
        note: "",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp1l66iX6IIa2_7Lq2x0VHPEZC28kdcItXfUpRLElpW7l65yZFjMy6mvM7EygKouic0867weHEQmyA0qnDeBFKh_ZRSyQUfXk9GIx61Uyv6P2dnSCbsSqV17yyPDSw9etwa32qdOkPdu59yBN2BZ44y3CkLipXuNJw9F2h-npLg2IhHCIWVYrAsgjYDsJ1q55F68OAZU8_1O6eN4dyiS3nyN7h2kiLoONuGdoFMJlb3eZVwKN6lCPJ",
    },
    {
        id: 4,
        title: "Lechones Pietrain x Landrace destete (Lote de 15)",
        species: "Porcino",
        age: "45 días",
        location: "La Piedad, Michoac.",
        price: 1450,
        unit: "MXN / cabeza",
        seller: "Granja San Miguel",
        rating: "4.8",
        deals: "42 tratos",
        badge: "Disponible (15 cabezas)",
        extra: "Desparasitados",
        note: "Promedio 14 kg",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCccBumUL-sIajq4iFL9e5rgEsQMOy0MLk7sXxp2-M1PcIWx6J-AF0luzSBa6DYUB7OKgDkGgwtzbEa6BIEV-BrSek0gpihc_lsRPAdkVBRHokvpTOc8g_dhxpiEhE_SJCTt57L2wVVra117qkjMdHGO_QdwVgdPMZVjW266fjPT7SQwzO54OhjTXgBxy2Wv0BLrrVVmb9wxQ6oDftznP6LLFgZOtQlC6ect9Xo_BrFGzqCD5ib6uxH",
    },
    {
        id: 5,
        title: "Novillos de Engorda Brangus Rojo (Lote 12)",
        species: "Bovino",
        age: "14 meses",
        location: "Navojoa, Sonora",
        price: 22000,
        unit: "MXN / cab.",
        seller: "Corrales El Yaqui",
        rating: "4.9",
        deals: "19 tratos",
        badge: "Disponible (12 cabezas)",
        extra: "340 kg prom.",
        note: "Hato Libre TB",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS8G3jLfEY1ooBoACMN5ncWBZ8xH_tP1IjKiXExDy8RQaCV9QwCBFZXhAskacIgv20yJESe43iHR4AS8bLBLylwNWxdOX6WuT5hPy8cpdXjbNEOrrP-2VmdxicaI93r7VA0k_qnTV36rDDbTVe4E1nU2Id3weQ3K1EKNGuscmLW4GXjJfZMyopz36Ns0BE3x1f8Kpq9jYDJJvSV9TWqxiizygypowmalVj0V52MGW4YLkMFN5eNjTX",
    },
    {
        id: 6,
        title: "Borregas Pelibuey primer parto",
        species: "Ovino",
        age: "12 meses",
        location: "Mérida, Yucatán",
        price: 2800,
        unit: "MXN / cab.",
        seller: "Ovinos del Mayab",
        rating: "4.7",
        deals: "11 tratos",
        badge: "Disponible (8 cabezas)",
        extra: "Aptas Cría",
        note: "Rústicas de trópico",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1RZv39lDtTKLz2A_5QNHL3-2seF9mpy5-58HemidpS75VfBI8nF4ZNCoMV9-FFVWeoeaYF47oMQQeQa5LhfvhxnTuwISl812nQ5fhLEehqiQv5GZIB7rqLWrfTkbrZjIwblSBC_4ZQF_cuqHuOvbOkn3ZnqNSVXuos2ZzZsBcVR4qn_NMu--J7ehaaiygQKpK9mBjHp_tFO_Mc676ntBILxGiZQgYvteXS4Ajxyq-Uvt9VOf3LABC",
    },
];

export default function UserHome() {
    const [species, setSpecies] = useState("Todos");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("recent");
    const [minPrice, setMinPrice] = useState(1400);
    const [maxPrice, setMaxPrice] = useState(48000);

    const filteredAnimals = useMemo(() => {
        let result = animals.filter((animal) => {
            const matchesSpecies = species === "Todos" || animal.species === species;
            const text = `${animal.title} ${animal.species} ${animal.location} ${animal.seller}`.toLowerCase();
            const matchesSearch = text.includes(search.toLowerCase());
            const matchesPrice = animal.price >= minPrice && animal.price <= maxPrice;
            return matchesSpecies && matchesSearch && matchesPrice;
        });

        if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
        if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
        return result;
    }, [species, search, sort, minPrice, maxPrice]);

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
                        <Link to="/user/publicaciones">Mis Publicaciones</Link>
                        <Link to="/user/solicitudes">Solicitudes</Link>
                        <Link to="/user/vendedores">Vendedores</Link>
                    </nav>

                    <div className="header-actions">
                        <Link className="publish-btn" to="/user/publicar">＋ Publicar Animal</Link>
                        <button className="icon-btn" aria-label="Notificaciones">🔔<span>2</span></button>
                        <div className="profile-chip">
                            <div className="avatar">HR</div>
                            <div>
                                <strong>Don Heriberto Ramos</strong>
                                <small>Rancho El Fresno</small>
                            </div>
                        </div>
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
                            <button onClick={() => { setSpecies("Todos"); setSearch(""); setMinPrice(1400); setMaxPrice(48000); }}>↻ Limpiar filtros</button>
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
                            <input className="range" type="range" min="1000" max="60000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
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
                            <div><h1>Mostrando 124 animales disponibles ✓</h1><p>Precios actualizados en tiempo real y trato directo sin intermediarios</p></div>
                            <div className="market-ticker"><small>NOVILLO EN PIE (PROMEDIO)</small><strong>$54.20 MXN / kg ↗</strong></div>
                        </div>

                        <div className="toolbar">
                            <div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por raza, fierro o lote..." /></div>
                            <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Ordenar: Recientes</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option></select>
                        </div>

                        <div className="animal-grid">
                            {filteredAnimals.map((animal) => (
                                <article className="animal-card" key={animal.id}>
                                    <div className="animal-photo">
                                        <img src={animal.image} alt={animal.title} />
                                        <span className={`availability ${animal.badge === "Reservada" ? "reserved" : ""}`}>{animal.badge}</span>
                                        <span className="extra-badge">{animal.extra}</span>
                                        {animal.note && <span className="photo-note">{animal.note}</span>}
                                    </div>
                                    <div className="animal-body">
                                        <div className="meta"><span>{animal.species}</span><b>•</b><span>{animal.age}</span><b>•</b><span>⌖ {animal.location}</span></div>
                                        <h3>{animal.title}</h3>
                                        <div className="price"><strong>${animal.price.toLocaleString()}</strong><span>{animal.unit}</span></div>
                                        <div className="seller-row">
                                            <div><strong>{animal.seller}</strong><small>{animal.rating ? `★ ${animal.rating} (${animal.deals})` : animal.deals}</small></div>
                                            <button>{animal.badge === "Reservada" ? "Ver lote" : "Ver detalles"}</button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="pagination"><span>Mostrando 1 - {filteredAnimals.length} de 124 lotes en venta</span><div><button>‹</button><button className="active">1</button><button>2</button><button>3</button><span>...</span><button>12</button><button>Siguiente ›</button></div></div>
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