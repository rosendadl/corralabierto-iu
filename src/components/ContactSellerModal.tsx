import { useEffect, useState, type FormEvent } from "react";
import { money, pricing, type LotDetail } from "../lotDetails.ts";

interface Props {
    lot: LotDetail;
    onClose: () => void;
}

export default function ContactSellerModal({ lot, onClose }: Props) {
    const { perHead } = pricing(lot);
    const [quantity, setQuantity] = useState(lot.headCount);
    const [message, setMessage] = useState(
        `Hola ${lot.seller.name}, me interesa este lote. ¿Tienen fecha disponible para visitarlo y cómo podríamos coordinar el embarque?`
    );
    const [accepted, setAccepted] = useState(true);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const changeQuantity = (value: number) => setQuantity(Math.min(lot.headCount, Math.max(1, value || 1)));

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!accepted || !message.trim()) return;
        setSent(true);
    }

    return (
        <div className="ld-overlay" onClick={onClose}>
            <div className="ld-modal" role="dialog" aria-modal="true" aria-labelledby="ld-modal-title" onClick={(e) => e.stopPropagation()}>
                <header className="ld-modal-head">
                    <div>
                        <h2 id="ld-modal-title">Solicitar Contacto Directo</h2>
                        <small>Trato directo con {lot.seller.name}</small>
                    </div>
                    <button aria-label="Cerrar" onClick={onClose}>×</button>
                </header>

                {sent ? (
                    <div className="ld-modal-body ld-sent">
                        <div className="ld-sent-icon">✓</div>
                        <strong>¡Solicitud enviada!</strong>
                        <p>{lot.seller.name} recibirá tu interés por {quantity} {quantity === 1 ? "cabeza" : "cabezas"}. Te avisaremos cuando responda.</p>
                        <button className="ld-btn ld-btn-primary" onClick={onClose}>Volver a la ficha</button>
                    </div>
                ) : (
                    <form className="ld-modal-body" onSubmit={handleSubmit}>
                        <div className="ld-modal-lot">
                            <img src={lot.images[0]} alt="" />
                            <div>
                                <strong>{lot.title}</strong>
                                <small>{perHead !== null && `${money(perHead)} MXN / cab. · `}{lot.municipality}, {lot.state}</small>
                            </div>
                        </div>

                        <div className="ld-qty-head">
                            <label htmlFor="ld-qty">Cantidad de cabezas que deseas adquirir</label>
                            <small>Mín. 1 · Máx. {lot.headCount}</small>
                        </div>
                        <div className="ld-stepper">
                            <button type="button" onClick={() => changeQuantity(quantity - 1)} aria-label="Menos">−</button>
                            <input id="ld-qty" type="number" min={1} max={lot.headCount} value={quantity} onChange={(e) => changeQuantity(Number(e.target.value))} />
                            <button type="button" onClick={() => changeQuantity(quantity + 1)} aria-label="Más">+</button>
                        </div>
                        {perHead !== null && (
                            <div className="ld-estimate">
                                <span>Inversión estimada</span>
                                <b>{money(perHead * quantity)} MXN</b>
                            </div>
                        )}

                        <label className="ld-field-label" htmlFor="ld-message">Mensaje para el ganadero</label>
                        <textarea id="ld-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />

                        <label className="ld-check">
                            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                            Acepto compartir mis datos de contacto con el productor
                        </label>

                        <button className="ld-btn ld-btn-primary" type="submit" disabled={!accepted || !message.trim()}>
                            ➤ Enviar solicitud al productor
                        </button>
                        <button type="button" className="ld-link" onClick={onClose}>Cancelar y volver a la ficha</button>
                    </form>
                )}
            </div>
        </div>
    );
}
