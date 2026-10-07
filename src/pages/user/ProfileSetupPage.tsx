import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import "./ProfileSetupPage.css";

type Role = "comprador" | "vendedor" | "ambos";
type Facility = "rancho" | "oficina" | "particular";

export default function ProfileSetupPage() {
    const { user } = useAuth();
    const [avatar, setAvatar] = useState<string | null>(null);
    const [role, setRole] = useState<Role>("ambos");
    const [facility, setFacility] = useState<Facility>("rancho");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();

    const registeredEmail = useMemo(() => {
        const raw = (user as any)?.email || (user as any)?.username || "";
        return raw.includes("@") ? raw : "";
    }, [user]);

    function handleAvatar(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setAvatar(String(reader.result));
        reader.readAsDataURL(file);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setSaved(false);

        // Simulación mientras el endpoint de perfil no esté listo.
        await new Promise((resolve) => setTimeout(resolve, 900));

        setSaving(false);
        setSaved(true);

        navigate("/user");
    }

    return (
        <main className="profile-setup-page">
            <div className="profile-shell">
                <section className="profile-card profile-header-card">
                    <div className="profile-meta-row">
                        <div className="secure-label">✓ ALTA SEGURA DE OPERADOR</div>
                        <div className="trust-badges">
                            <span>🔒 Cifrado TLS 256-bit</span>
                            <span>✓ Validación SINIIGA / SENASICA</span>
                        </div>
                    </div>

                    <div className="stepper-row">
                        <span className="step-active"><b>1</b> Información Personal y Contacto</span>
                        <span className="step-muted"><b>2</b> Verificación Ganadera & UPP</span>
                    </div>
                    <div className="progress-track"><div className="progress-value" /></div>

                    <div className="title-block">
                        <h1>Completa tu perfil en Corral Abierto</h1>
                        <p>
                            Esta información permitirá validar tus operaciones de compra-venta de ganado,
                            agilizar contratos de consignación y asegurar contacto directo y seguro con otros productores certificados.
                        </p>
                    </div>
                </section>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <section className="profile-card avatar-card">
                        <div className="avatar-wrap">
                            <div className="avatar-circle">
                                {avatar ? <img src={avatar} alt="Vista previa de perfil" /> : <span>👤</span>}
                            </div>
                            <label className="camera-button" htmlFor="avatarInput">📷</label>
                            <input id="avatarInput" type="file" accept="image/png,image/jpeg" onChange={handleAvatar} hidden />
                        </div>

                        <div className="avatar-copy">
                            <div className="avatar-heading-row">
                                <div>
                                    <h3>Fotografía de perfil <small>(Opcional)</small></h3>
                                    <p>Archivos JPG o PNG hasta 5MB. Recomendamos foto clara de rostro o logotipo de tu rancho.</p>
                                </div>
                                <label className="secondary-button" htmlFor="avatarInput">Examinar archivos</label>
                            </div>
                            <div className="trust-note">
                                <strong>✓ +40% mayor tasa de cierre:</strong> Los perfiles con foto o sello comercial oficial generan mayor rapidez en el cierre de tratos y aceptación de lotes.
                            </div>
                        </div>
                    </section>

                    <section className="profile-card">
                        <span className="eyebrow">PASO OPERATIVO</span>
                        <h2>¿Cómo planeas usar Corral Abierto principalmente?</h2>
                        <p className="section-copy">Personalizaremos tu panel de control, subastas y alertas de mercado según tu enfoque de negocio.</p>

                        <div className="role-grid">
                            {[
                                ["comprador", "🛒", "Comprar Ganado", "Engordadores, acopiadores e industrias buscando lotes con trazabilidad garantizada.", "Acceso a subastas activas →"],
                                ["vendedor", "🚜", "Vender Lotes", "Criadores y rancheros buscando comercializar becerros, novillos o vientres al mejor precio.", "Publicación y pesaje en corral →"],
                                ["ambos", "↔", "Ambos (Integral)", "Participación completa en subastas, corretaje, compraventa de sementales y reemplazo.", "Herramientas globales →"],
                            ].map(([value, icon, title, description, link]) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`role-card ${role === value ? "selected" : ""}`}
                                    onClick={() => setRole(value as Role)}
                                >
                                    <div className="role-top"><span className="role-icon">{icon}</span><span className="radio-dot" /></div>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                    <strong>{link}</strong>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="profile-card">
                        <div className="section-heading-row">
                            <div>
                                <h2>Datos Personales y de Contacto</h2>
                                <p className="section-copy">Requeridos para emisión de guías de tránsito y facturación electrónica CFDI.</p>
                            </div>
                            <span className="section-icon">▣</span>
                        </div>

                        <div className="form-grid two-cols">
                            <Field label="Nombre(s) *"><input required placeholder="Ej. Guillermo" /></Field>
                            <Field label="Apellidos *"><input required placeholder="Ej. Villarreal Garza" /></Field>
                            <Field label="Teléfono WhatsApp para Negocios *">
                                <div className="phone-row"><span>🇲🇽 +52</span><input required type="tel" placeholder="(662) 219 4580" /></div>
                            </Field>
                            <Field label="Teléfono de Rancho o Casa"><input type="tel" placeholder="Teléfono de oficina o radiofrecuencia" /></Field>

                            <label className="checkbox-row full-width">
                                <input type="checkbox" defaultChecked />
                                <span><b>Usar este número de WhatsApp para notificaciones de ofertas, pesajes y fletes</b><small>Recibirás avisos instantáneos de compradores interesados y avisos de carga de jaulas.</small></span>
                            </label>

                            <Field label="Correo Electrónico Registrado">
                                <div className="verified-input">
                                    <input readOnly value={registeredEmail} placeholder="Correo registrado" />
                                    <span>✓ Verificado</span>
                                </div>
                            </Field>

                            <Field label="RFC o Clave Fiscal"><input className="uppercase" maxLength={13} placeholder="VIGG8205149X2" /></Field>
                        </div>
                    </section>

                    <section className="profile-card">
                        <h2>Dirección Principal y Domicilio Operativo</h2>
                        <p className="section-copy">Ubicación de referencia para cotizaciones logísticas, cálculo de fletes y emisión de guías sanitarias.</p>

                        <div className="facility-block">
                            <label>Tipo de Instalación / Domicilio</label>
                            <div className="facility-chips">
                                <button type="button" className={facility === "rancho" ? "active" : ""} onClick={() => setFacility("rancho")}>⌂ Rancho / Finca Ganadera</button>
                                <button type="button" className={facility === "oficina" ? "active" : ""} onClick={() => setFacility("oficina")}>▦ Oficina / Negocio</button>
                                <button type="button" className={facility === "particular" ? "active" : ""} onClick={() => setFacility("particular")}>⌂ Domicilio Particular</button>
                            </div>
                        </div>

                        <div className="form-grid three-cols">
                            <Field label="Calle, Carretera o Predio y Número *" className="span-2"><input required placeholder="Ej. Carr. Hermosillo - Bahía de Kino Km. 28.5" /></Field>
                            <Field label="Código Postal *"><input required maxLength={5} placeholder="83000" /></Field>
                            <Field label="Colonia o Localidad *"><input required placeholder="Ej. Ejido La Manga" /></Field>
                            <Field label="Municipio *"><input required placeholder="Ej. Hermosillo" /></Field>
                            <Field label="Estado / Entidad *">
                                <select defaultValue="sonora" required>
                                    <option value="sonora">Sonora</option><option value="baja_california">Baja California</option><option value="chihuahua">Chihuahua</option><option value="nuevo_leon">Nuevo León</option><option value="durango">Durango</option><option value="tamaulipas">Tamaulipas</option><option value="coahuila">Coahuila</option><option value="jalisco">Jalisco</option><option value="veracruz">Veracruz</option><option value="zacatecas">Zacatecas</option><option value="otro">Otro Estado Ganadero...</option>
                                </select>
                            </Field>
                        </div>

                        <div className="map-placeholder">
                            <div className="map-overlay">
                                <span>⌖ Región Sanitaria: <strong>Zona A - Acreditada para Exportación USA</strong></span>
                                <button type="button">Ajustar pin en mapa ↗</button>
                            </div>
                        </div>
                    </section>

                    <section className="profile-card action-card">
                        <button type="button" className="text-button">← Completar más tarde (modo explorador limitado)</button>
                        <button type="submit" className="primary-button" disabled={saving}>
                            {saving ? "Guardando perfil..." : saved ? "✓ ¡Perfil Guardado!" : "Guardar y Continuar →"}
                        </button>
                    </section>

                    <footer className="profile-footer">
                        <p>⚖ Tus datos se encuentran salvaguardados conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares.</p>
                        <span>Corral Abierto S.A.P.I. de C.V. • Plataforma Ganadera Nacional</span>
                    </footer>
                </form>
            </div>
        </main>
    );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
    return <label className={`field ${className}`}><span>{label}</span>{children}</label>;
}
