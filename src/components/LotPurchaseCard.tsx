import { money, pricing, type LotDetail } from "../lotDetails.ts";

interface Props {
    lot: LotDetail;
    onContact: () => void;
}

export default function LotPurchaseCard({ lot, onContact }: Props) {
    const { perHead, total, perKg } = pricing(lot);
    const available = lot.status === "activa";

    return (
        <section className="ld-card ld-buy">
            <small className="ld-eyebrow">VALOR UNITARIO</small>
            <div className="ld-price">
                <strong>{money(perHead ?? lot.price)}</strong>
                <span>MXN</span>
            </div>
            <p className="ld-muted">
                {lot.saleMode === "kg" ? "por kg en pie" : "por cabeza"}
                {total !== null && ` (Total lote ${lot.headCount} cab.: ${money(total)} MXN)`}
            </p>

            {perKg !== null && (
                <div className="ld-kg-row">
                    <span>Precio estimado por kilo</span>
                    <b>~{money(perKg)} MXN / kg</b>
                </div>
            )}

            <button className="ld-btn ld-btn-primary" onClick={onContact} disabled={!available}>
                {available ? "Me interesa comprar" : "Lote no disponible"}
            </button>
            <button className="ld-btn ld-btn-outline" disabled title="Próximamente">
                💬 Hacer una pregunta pública
            </button>

            <p className="ld-trust">
                🛡 <span><b>Trato directo sin comisiones ocultas.</b> Datos protegidos por el sistema de verificación ganadera de Corral Abierto.</span>
            </p>
        </section>
    );
}
