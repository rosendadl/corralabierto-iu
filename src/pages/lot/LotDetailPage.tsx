import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import "../user/UserHome.css";
import "./LotDetailPage.css";
import { useAuth } from "../../auth/AuthContext.tsx";
import { ApiError } from "../../api.ts";
import { animals } from "../../catalogData.ts";
import { fromApi, fromCatalog, statusLabel, type LotDetail, type LotDetailResponse } from "../../lotDetails.ts";
import MarketHeader from "../../components/MarketHeader.tsx";
import MarketFooter from "../../components/MarketFooter.tsx";
import LotGallery from "../../components/LotGallery.tsx";
import LotPurchaseCard from "../../components/LotPurchaseCard.tsx";
import SellerCard from "../../components/SellerCard.tsx";
import LotSpecs from "../../components/LotSpecs.tsx";
import SanitaryGuarantee from "../../components/SanitaryGuarantee.tsx";
import LotDescription from "../../components/LotDescription.tsx";
import ContactSellerModal from "../../components/ContactSellerModal.tsx";

export default function LotDetailPage() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const { authFetch } = useAuth();
    const [apiLot, setApiLot] = useState<{ id: string; lot: LotDetail | null; error: string | null } | null>(null);
    const [contactOpen, setContactOpen] = useState(false);

    const demoLot = useMemo(() => {
        const animal = animals.find((item) => item.id === id);
        return animal ? fromCatalog(animal) : null;
    }, [id]);

    useEffect(() => {
        if (demoLot) return;
        let cancelled = false;
        authFetch<LotDetailResponse>(`/api/user/lots/${encodeURIComponent(id)}`)
            .then((res) => { if (!cancelled) setApiLot({ id, lot: fromApi(res), error: null }); })
            .catch((err: unknown) => {
                if (cancelled) return;
                const message = err instanceof ApiError && err.status === 404
                    ? "Esta publicación no existe o ya fue retirada."
                    : err instanceof Error ? err.message : "No se pudo cargar el lote.";
                setApiLot({ id, lot: null, error: message });
            });
        return () => { cancelled = true; };
    }, [id, demoLot]);

    const current = apiLot?.id === id ? apiLot : null;
    const lot = demoLot ?? current?.lot ?? null;
    const error = demoLot ? null : current?.error ?? null;
    const closeContact = useCallback(() => setContactOpen(false), []);

    return (
        <div className="market-page">
            <MarketHeader />

            <main className="market-main ld-main">
                <nav className="ld-breadcrumb">
                    <button onClick={() => navigate(-1)} aria-label="Regresar">←</button>
                    <Link to="/user">Inicio</Link> › <Link to="/user">Catálogo</Link>
                    {lot && <> › <span>{lot.species}</span> › <b>{lot.title}</b></>}
                </nav>

                {!lot && !error && <div className="ld-card ld-state">Cargando lote…</div>}
                {error && (
                    <div className="ld-card ld-state">
                        <p>{error}</p>
                        <Link className="ld-btn ld-btn-primary" to="/user">Volver al catálogo</Link>
                    </div>
                )}

                {lot && (
                    <>
                        <section className="ld-title-block">
                            <div className="ld-chips">
                                <span className={`ld-chip ${lot.status === "activa" ? "green" : "amber"}`}>{statusLabel(lot)}</span>
                                {lot.vaccinated && <span className="ld-chip outline">✓ Certificado SENASICA Validado</span>}
                                <span className="ld-chip plain">ID Lote: #{lot.id}</span>
                            </div>
                            <h1>{lot.title}</h1>
                            <p>
                                Ubicación de origen: {lot.municipality}, {lot.state}
                                {lot.negativeTests && " • Hato libre certificado"}
                                {lot.status === "activa" && " • Movilización inmediata nacional"}
                            </p>
                        </section>

                        <div className="ld-layout">
                            <div className="ld-col-main">
                                <LotGallery key={lot.id} images={lot.images} title={lot.title} />
                                <LotSpecs lot={lot} />
                                <SanitaryGuarantee lot={lot} />
                                <LotDescription lot={lot} />
                            </div>
                            <aside className="ld-col-side">
                                <LotPurchaseCard lot={lot} onContact={() => setContactOpen(true)} />
                                <SellerCard seller={lot.seller} />
                            </aside>
                        </div>
                    </>
                )}
            </main>

            <MarketFooter />

            {contactOpen && lot && <ContactSellerModal lot={lot} onClose={closeContact} />}
        </div>
    );
}
