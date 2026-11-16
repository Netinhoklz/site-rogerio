import { useRef, useState } from 'react';
import Reveal from './Reveal.jsx';
import { TESTIMONIALS, WHATSAPP_URL } from '../data/content.js';
import useReveal from '../hooks/useReveal.js';

const DEMAIS = TESTIMONIALS.filter(t => !t.featured);

export default function Testimonials() {
    // Celular: os depoimentos deslizam para o lado, e os pontinhos mostram qual deles está na tela
    const grade = useRef(null);
    const [naTela, setNaTela] = useState(0);
    const aoDeslizar = () => {
        const el = grade.current;
        const passo = el.children[1].offsetLeft - el.children[0].offsetLeft;
        const noFim = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        setNaTela(noFim ? DEMAIS.length - 1 : Math.round(el.scrollLeft / passo));
    };

    return (
        <section className="testimonials" id="depoimentos">
            <div className="container">
                <Reveal as="header" className="section__header section__header--center">
                    <span className="eyebrow">Clientes que confiam na GRB</span>
                    <h2 className="section__title">O que dizem os nossos clientes</h2>
                    <p className="section__lead">
                        Depoimentos de empresários atendidos pela GRB Assessoria Contábil.
                    </p>
                </Reveal>

                {/* O depoimento em destaque fica fora da grade: no celular os demais viram uma fileira para deslizar */}
                <div className="testimonials__featured">
                    {TESTIMONIALS.filter(t => t.featured).map(t => <TestimonialCard key={t.name} t={t} />)}
                </div>
                <div className="testimonials__grid" ref={grade} onScroll={aoDeslizar}>
                    {DEMAIS.map(t => <TestimonialCard key={t.name} t={t} />)}
                </div>
                <div className="testimonials__dots" aria-hidden="true">
                    {DEMAIS.map((t, i) => <span key={t.name} className={i === naTela ? 'is-active' : ''}></span>)}
                </div>
                <p className="swipe-hint" aria-hidden="true">Deslize para o lado para ver mais depoimentos</p>

                <Reveal className="testimonials__cta">
                    <p>Mais de <strong>200 empresas</strong> confiam na GRB Assessoria Contábil</p>
                    <a
                        href={WHATSAPP_URL}
                        className="btn btn--primary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Seja nosso cliente
                    </a>
                </Reveal>
            </div>
        </section>
    );
}

function TestimonialCard({ t }) {
    const [ref, visible] = useReveal();
    return (
        <figure ref={ref} className={`testimonial ${t.featured ? 'testimonial--featured' : ''} reveal ${visible ? 'is-visible' : ''}`}>
            <div className="testimonial__stars" aria-label="5 de 5 estrelas">★★★★★</div>
            <blockquote>"{t.quote}"</blockquote>
            <figcaption>
                {/* Com a logo da empresa cadastrada (content.js), ela entra no lugar da inicial do nome */}
                {t.logo ? (
                    <img className="testimonial__logo" src={t.logo} alt={`Logo da ${t.company || t.name}`} loading="lazy" />
                ) : (
                    <div className="testimonial__avatar" aria-hidden="true">
                        {t.name.charAt(0)}
                    </div>
                )}
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
