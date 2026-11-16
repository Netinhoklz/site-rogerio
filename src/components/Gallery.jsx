import Reveal from './Reveal.jsx';
import { OFFICE_PHOTOS } from '../data/content.js';

export default function Gallery() {
    return (
        <section className="section gallery" id="escritorio">
            <div className="container">
                <header className="section__header section__header--center">
                    <span className="eyebrow">Nosso escritório</span>
                    <h2 className="section__title">Conheça as nossas instalações</h2>
                </header>

                <Reveal className="gallery__grid">
                    {OFFICE_PHOTOS.map(p => (
                        <figure key={p.src} className={`gallery__item ${p.tall ? 'gallery__item--tall' : ''}`.trim()}>
                            <img src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy" />
                        </figure>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
