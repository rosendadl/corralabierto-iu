import type { LotDetail } from "../lotDetails.ts";

const SALE_MODE: Record<LotDetail["saleMode"], string> = {
    kg: "Por kilo en pie",
    cabeza: "Por cabeza",
    lote: "Lote completo",
};

export default function LotSpecs({ lot }: { lot: LotDetail }) {
    const specs = [
        { label: "Especie", value: lot.species },
        { label: "Raza", value: lot.breed },
        { label: "Sexo / Categoría", value: lot.category },
        { label: "Edad promedio", value: lot.avgAgeMonths === null ? "—" : `${lot.avgAgeMonths} meses` },
        { label: "Peso promedio", value: lot.avgWeightKg === null ? "—" : `${lot.avgWeightKg} kg / cabeza` },
        { label: "Volumen del lote", value: `${lot.headCount} ${lot.headCount === 1 ? "cabeza" : "cabezas"}` },
        { label: "Modalidad de venta", value: SALE_MODE[lot.saleMode] },
        { label: "Ubicación", value: `${lot.municipality}, ${lot.state}` },
    ];

    return (
        <section className="ld-card">
            <div className="ld-section-head">
                <h2>Ficha Técnica del Lote</h2>
                {lot.vaccinated && <span className="ld-chip outline">Revisión Biométrica Vigente</span>}
            </div>

            <div className="ld-spec-grid">
                {specs.map((spec) => (
                    <div key={spec.label} className="ld-spec">
                        <small>{spec.label}</small>
                        <strong>{spec.value}</strong>
                    </div>
                ))}
            </div>

            {(lot.vaccinesDetail || lot.testsDetail) && (
                <div className="ld-health">
                    <strong>💉 Esquema Sanitario Aplicado</strong>
                    {lot.vaccinesDetail && <p>{lot.vaccinesDetail}</p>}
                    {lot.testsDetail && <p>{lot.testsDetail}</p>}
                </div>
            )}
        </section>
    );
}
