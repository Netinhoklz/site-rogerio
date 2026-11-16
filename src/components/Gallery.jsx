import { useRef, useState } from 'react';
import Reveal from './Reveal.jsx';
import { OFFICE_PHOTOS } from '../data/content.js';

export default function Gallery() {
    // Foto ampliada: guarda qual foto está aberta (null = janela fechada)
    const janela = useRef(null);
    const [aberta, setAberta] = useState(null);

    const abrir = (i) => { setAberta(i); janela.current.showModal(); };
    const fechar = () => janela.current.close();
    const mudar = (passo) => setAberta(i => (i + passo + OFFICE_PHOTOS.length) % OFFICE_PHOTOS.length);
    const aoTeclar = (e) => {
        if (e.key === 'ArrowRight') mudar(1);
        if (e.key === 'ArrowLeft') mudar(-1);
    };
    const foto = aberta === null ? null : OFFICE_PHOTOS[aberta];

    return (
        <section className="section gallery" id="escritorio">
            <div className="container">
                <Reveal as="header" className="section__header section__header--center">
                    <span className="eyebrow">Nosso escritório</span>
                    <h2 className="section__title">Conheça as nossas instalações</h2>
                </Reveal>

                <Reveal className="gallery__grid">
                    {OFFICE_PHOTOS.map((p, i) => (
                        <button
                            type="button"
                            key={p.src}
                            className={`gallery__item ${p.tall ? 'gallery__item--tall' : ''}`.trim()}
                            onClick={() => abrir(i)}
                            aria-label={`Ampliar foto: ${p.alt}`}
                        >
                            <img src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy" />
                            <span className="gallery__zoom" aria-hidden="true">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                    <circle cx="11" cy="11" r="7" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    <line x1="11" y1="8" x2="11" y2="14" />
                                    <line x1="8" y1="11" x2="14" y2="11" />
                                </svg>
                            </span>
                        </button>
                    ))}
                </Reveal>
            </div>

            {/* Fecha com o botão, com a tecla Esc ou clicando fora da foto; as setas do teclado trocam a foto.
                A imagem só entra na página quando a janela abre, para não pesar o carregamento. */}
            <dialog
                ref={janela}
                className="lightbox"
                aria-label="Fotos do escritório"
                onClose={() => setAberta(null)}
                onClick={(e) => { if (e.target === e.currentTarget) fechar(); }}
                onKeyDown={aoTeclar}
            >
                <button type="button" className="lightbox__fechar" onClick={fechar} aria-label="Fechar foto">×</button>
                {foto && (
                    <>
                        <img key={foto.src} className="lightbox__img" src={foto.src} alt={foto.alt} width={foto.width} height={foto.height} />
                        <p className="lightbox__legenda">{foto.alt} · {aberta + 1} de {OFFICE_PHOTOS.length}</p>
                    </>
                )}
                <button type="button" className="lightbox__seta lightbox__seta--anterior" onClick={() => mudar(-1)} aria-label="Foto anterior">‹</button>
                <button type="button" className="lightbox__seta lightbox__seta--proxima" onClick={() => mudar(1)} aria-label="Próxima foto">›</button>
            </dialog>
        </section>
    );
}
