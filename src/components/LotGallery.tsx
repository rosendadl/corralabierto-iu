import { useState } from "react";

interface Props {
    images: string[];
    title: string;
}

export default function LotGallery({ images, title }: Props) {
    const [active, setActive] = useState(0);

    return (
        <section className="ld-card ld-gallery">
            <div className="ld-gallery-main">
                <img src={images[active]} alt={title} />
                <span className="ld-gallery-tag">Vista principal · Lote completo</span>
                <span className="ld-gallery-count">▣ {active + 1} / {images.length} fotos de campo</span>
            </div>

            {images.length > 1 && (
                <div className="ld-thumbs">
                    {images.map((src, index) => (
                        <button key={src} className={index === active ? "active" : ""} onClick={() => setActive(index)}>
                            <img src={src} alt={`Foto ${index + 1} de ${title}`} />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
