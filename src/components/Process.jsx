import Reveal from './Reveal.jsx';
import { IconWhatsFilled } from './icons.jsx';
import { PROCESS_STEPS, WHATSAPP_DIAG_URL } from '../data/content.js';

// "Como funciona": as etapas do primeiro contato até o acompanhamento, ligadas por uma linha que se desenha
export default function Process() {
    return (
        <section className="section process" id="como-funciona">
            <div className="container">
                <Reveal as="header" className="section__header section__header--center">
                    <span className="eyebrow">Como funciona</span>
                    <h2 className="section__title">Do primeiro contato ao acompanhamento da sua empresa</h2>
                    <p className="section__lead">
                        Um processo simples e transparente, conduzido pela nossa equipe em todas as etapas.
                    </p>
                </Reveal>

                <Reveal as="ol" className="process__steps">
                    {PROCESS_STEPS.map((etapa, i) => (
                        <li key={etapa.title} className="process__step">
                            <span className="process__num" aria-hidden="true">{i + 1}</span>
                            <h3>{etapa.title}</h3>
                            <p>{etapa.text}</p>
                        </li>
                    ))}
                </Reveal>

                <Reveal className="process__cta">
                    <a href={WHATSAPP_DIAG_URL} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
                        <IconWhatsFilled width="18" height="18" />
                        Iniciar pelo diagnóstico gratuito
                    </a>
                </Reveal>
            </div>
        </section>
    );
}
