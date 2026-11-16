import Reveal from './Reveal.jsx';
import CountUp from './CountUp.jsx';
import { WHATSAPP_DIAG_URL } from '../data/content.js';

const CHECKS = [
    'Equipe composta por contadores e especialistas tributários',
    'Processos digitais, com assinatura eletrônica e portal do cliente',
    'Gestão preventiva, com antecipação de prazos e riscos',
    'Relatórios gerenciais claros para apoiar a tomada de decisão',
    'Contador dedicado ao atendimento da sua empresa',
];

export default function About() {
    return (
        <Reveal as="section" className="section" id="empresa">
            <div className="container grid-2">
                <div className="about__media">
                    {/* public/fotos/ é gerada por scripts/preparar_fotos.py */}
                    <img
                        className="about__photo"
                        src="fotos/equipe-grb.webp"
                        alt="Equipe da GRB em frente à logo da empresa, no escritório"
                        width="1400"
                        height="933"
                        loading="lazy"
                    />
                    <div className="about__number">
                        <span><CountUp to={15} suffix="+" /></span>
                        <small>anos de atuação em contabilidade</small>
                    </div>
                </div>
                <div>
                    <span className="eyebrow">A GRB Assessoria Contábil</span>
                    <h2 className="section__title">Contabilidade baseada em pessoas, dados e confiança</h2>
                    <p className="section__lead">
                        Nosso propósito é simplificar a contabilidade, para que o empresário possa dedicar-se ao crescimento do seu negócio.
                    </p>
                    <p>
                        Há mais de 15 anos, aliamos a experiência de profissionais especializados a uma operação digital, segura e transparente. Com sede em Fortaleza, atendemos empresas, MEIs e profissionais autônomos, com rigor técnico e atendimento próximo.
                    </p>

                    <ul className="checklist">
                        {CHECKS.map(c => <li key={c}>{c}</li>)}
                    </ul>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <a
                            href={WHATSAPP_DIAG_URL}
                            className="btn btn--whatsapp"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            Fale com um especialista
                        </a>
                        <a href="#servicos" className="btn btn--ghost">
                            Nossos serviços
                        </a>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}
