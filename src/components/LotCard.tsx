import { money, pricing, statusLabel, type LotDetail } from "../lotDetails.ts";

interface Props {
    lot: LotDetail;
    onOpen: (lot: LotDetail) => void;
}

export default function LotCard({ lot, onOpen }: Props) {
    const { perHead } = pricing(lot);
    const reserved = lot.status !== "activa";
    const extra = lot.cardExtra ?? (lot.vaccinated ? "Vacunas al día" : lot.breed);
    const note = lot.cardNote ?? (lot.avgWeightKg ? `${lot.avgWeightKg} kg prom.` : "");
    const age = lot.avgAgeMonths === null ? null : `${lot.avgAgeMonths} meses`;

    return (
        <article className="animal-card" onClick={() => onOpen(lot)}>
            <div className="animal-photo">
                <img src={lot.images[0]} alt={lot.title} />
                <span className={`availability ${reserved ? "reserved" : ""}`}>{statusLabel(lot)}</span>
                <span className="extra-badge">{extra}</span>
                {note && <span className="photo-note">{note}</span>}
            </div>
            <div className="animal-body">
                <div className="meta">
                    <span>{lot.species}</span>
                    {age && <><b>•</b><span>{age}</span></>}
                    <b>•</b><span>⌖ {lot.municipality}, {lot.state}</span>
                </div>
                <h3>{lot.title}</h3>
                <div className="price">
                    <strong>{money(perHead ?? lot.price)}</strong>
                    <span>{lot.saleMode === "kg" && perHead === null ? "MXN / kg" : "MXN / cabeza"}</span>
                </div>
                <div className="seller-row">
                    <div>
                        <strong>{lot.seller.name}</strong>
                        <small>{lot.seller.rating ? `★ ${lot.seller.rating} (${lot.seller.deals})` : lot.seller.deals}</small>
                    </div>
                    <button>{reserved ? "Ver lote" : "Ver detalles"}</button>
                </div>
            </div>
        </article>
    );
}
