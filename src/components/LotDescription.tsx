import type { LotDetail } from "../lotDetails.ts";

export default function LotDescription({ lot }: { lot: LotDetail }) {
    const place = `${lot.municipality}, ${lot.state}`;

    return (
        <section className="ld-card">
            <h2>Descripción del Criador</h2>
            <p className="ld-description">{lot.description}</p>

            <div className="ld-map-head">
                <strong>⌖ Ubicación para inspección presencial y embarque</strong>
                <small>{place}</small>
            </div>
            <div className="ld-map">
                <iframe
                    title={`Mapa de ${place}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(place)}&z=10&output=embed`}
                    loading="lazy"
                />
                <span>Coordenadas de campo se comparten al confirmar interés</span>
            </div>
        </section>
    );
}
