import type { LotDetail } from "../lotDetails.ts";

export default function SanitaryGuarantee({ lot }: { lot: LotDetail }) {
    if (!lot.vaccinated && !lot.negativeTests) return null;

    return (
        <section className="ld-guarantee">
            <div className="ld-guarantee-icon">✓</div>
            <div>
                <h3>Garantía Sanitaria y Movilización Oficial <span className="ld-chip green">REEMO Habilitado</span></h3>
                <p>
                    El vendedor acepta y firma la <b>Declaración Sanitaria Oficial</b>.
                    {lot.negativeTests && " Ganado con pruebas negativas de Tuberculosis y Brucelosis."}
                    {" "}Documentación lista para el trámite de la guía electrónica REEMO.
                </p>
            </div>
        </section>
    );
}
