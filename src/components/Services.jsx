import { SERVICES, WHATSAPP_URL } from '../data/content.js';
import { ICON_MAP, IconWhatsFilled } from './icons.jsx';
import useReveal from '../hooks/useReveal.js';

export default function Services() {
    return (
        <section className="section section--dark" id="servicos">
            <div className="container">
                <header className="section__header">
                    <span className="eyebrow eyebrow--light">Nossos serviços</span>
                    <h2 className="section__title section__title--light">
                        Serviços de contabilidade em Fortaleza para a sua empresa
                    </h2>
                    <p className="section__lead section__lead--light">
                        Oferecemos soluções contábeis completas para empresas, MEIs e profissionais autônomos, com responsabilidade, transparência e atendimento personalizado. Nosso compromisso é simplificar suas obrigações contábeis e fiscais, para que você tenha mais tempo para se dedicar ao crescimento do seu negócio.
                    </p>
                </header>

                <div className="services">
                    {SERVICES.map(svc => <ServiceCard key={svc.title} service={svc} />)}
                    <ServiceCta />
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ service }) {
    const [ref, visible] = useReveal();
    const Icon = ICON_MAP[service.icon];
    const cls = [
        'service-card',
        'reveal',
        visible ? 'is-visible' : '',
        service.featured ? 'service-card--featured' : '',
    ].filter(Boolean).join(' ');

    return (
        <article ref={ref} className={cls}>
            {service.badge && <div className="service-card__badge">{service.badge}</div>}
            <div className="service-card__icon">
                {Icon && <Icon />}
            </div>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <ul>
                {service.items.map(item => <li key={item}>{item}</li>)}
            </ul>
        </article>
    );
}

// Último quadro da grade: chamada do folder "Serviços Contábeis" (referencia/)
function ServiceCta() {
    const [ref, visible] = useReveal();
    return (
        <article ref={ref} className={`service-card service-card--featured service-card--cta reveal ${visible ? 'is-visible' : ''}`}>
            <h3>Sua empresa em boas mãos!</h3>
            <p>
                Conte com uma contabilidade de confiança para manter suas obrigações em dia, evitar problemas fiscais, tomar decisões mais seguras e construir um futuro sólido para o seu negócio.
            </p>
            <a href={WHATSAPP_URL} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
                <IconWhatsFilled width="18" height="18" />
                Entre em contato
            </a>
        </article>
    );
}
