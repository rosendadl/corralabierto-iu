import type { LotSeller } from "../lotDetails.ts";

export default function SellerCard({ seller }: { seller: LotSeller }) {
    const initials = seller.name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();

    return (
        <section className="ld-card ld-seller">
            <div className="ld-seller-head">
                {seller.avatarUrl
                    ? <img className="ld-seller-avatar" src={seller.avatarUrl} alt={seller.name} />
                    : <div className="ld-seller-avatar">{initials}</div>}
                <div>
                    <strong>{seller.name} <span className="ld-verified">✓</span></strong>
                    <small>@{seller.username}</small>
                    <small>⌖ {seller.location}</small>
                </div>
            </div>

            {seller.rating && (
                <div className="ld-rating">
                    <b>{seller.rating}</b> <span>★★★★★</span>
                </div>
            )}

            <dl className="ld-stats">
                <div><dt>Historial</dt><dd>{seller.deals}</dd></div>
                <div><dt>Tiempo de respuesta</dt><dd>Menos de 2 horas</dd></div>
            </dl>

            <button className="ld-link" disabled title="Próximamente">Ver perfil completo del criador</button>
            <button className="ld-link ld-report">⚑ Reportar publicación</button>
        </section>
    );
}
