import { TESTIMONIALS, CLIENTS, WHATSAPP_URL } from '../data/content.js';
import useReveal from '../hooks/useReveal.js';

export default function Testimonials() {
    return (
        <section className="testimonials" id="depoimentos">
            <div className="container">
                <header className="section__header section__header--center">
                    <span className="eyebrow">Clientes que confiam na GRB</span>
                    <h2 className="section__title">O que dizem os nossos clientes</h2>
                    <p className="section__lead">
                        Depoimentos de empresários atendidos pela GRB Assessoria Contábil.
                    </p>
                </header>

                {/* O depoimento em destaque fica fora da grade: no celular os demais viram uma fileira para deslizar */}
                <div className="testimonials__featured">
                    {TESTIMONIALS.filter(t => t.featured).map(t => <TestimonialCard key={t.name} t={t} />)}
                </div>
                <div className="testimonials__grid">
                    {TESTIMONIALS.filter(t => !t.featured).map(t => <TestimonialCard key={t.name} t={t} />)}
                </div>
                <p className="swipe-hint" aria-hidden="true">Deslize para o lado para ver mais depoimentos</p>

                <div className="clients">
                    <p className="clients__label">Empresas atendidas pela GRB</p>
                    <ul className="clients__list" role="list">
                        {CLIENTS.map(c => (
                            <li key={c.name} className="clients__item">
                                <img src={c.logo} alt={c.name} loading="lazy" />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="testimonials__cta">
                    <p>Mais de <strong>200 empresas</strong> confiam na GRB Assessoria Contábil</p>
                    <a
                        href={WHATSAPP_URL}
                        className="btn btn--primary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Seja nosso cliente
                    </a>
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ t }) {
    const [ref, visible] = useReveal();
    return (
        <figure ref={ref} className={`testimonial reveal ${visible ? 'is-visible' : ''}`}>
            <div className="testimonial__stars" aria-label="5 de 5 estrelas">★★★★★</div>
            <blockquote>"{t.quote}"</blockquote>
            <figcaption>
                <div className="testimonial__avatar" aria-hidden="true">
                    {t.name.charAt(0)}
                </div>
                <div className="testimonial__author">
                    <strong>{t.name}</strong>
                    <span className="testimonial__role">{t.role}</span>
                    {t.company && (
                        <div className="testimonial__company">
                            <span className="testimonial__company-name">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                </svg>
                                {t.company}
                            </span>
                            {t.companyDesc && (
                                <span className="testimonial__company-desc">{t.companyDesc}</span>
                            )}
                        </div>
                    )}
                </div>
            </figcaption>
        </figure>
    );
}
