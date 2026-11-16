import Logo from './Logo.jsx';
import {
    PHONE, PHONE_TEL, WHATSAPP, WHATSAPP_NUMBER, HOURS,
    INSTAGRAM, INSTAGRAM_URL, WHATSAPP_DIAG_URL, ADDRESS, MAPS_URL,
} from '../data/content.js';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__top">
                <div className="container footer__inner">
                    <div className="footer__brand">
                        <Logo light asLink={false} />
                        <p>Tradição, tecnologia e compromisso com o seu negócio há mais de 15 anos.</p>
                        <div className="footer__socials">
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="footer__social footer__social--whatsapp"
                                title="Fale conosco pelo WhatsApp"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                            <a
                                href={INSTAGRAM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="footer__social footer__social--instagram"
                                title="Instagram"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4>Serviços</h4>
                        <ul>
                            <li><a href="#servicos">Abertura de empresas</a></li>
                            <li><a href="#servicos">Escrituração contábil e fiscal</a></li>
                            <li><a href="#servicos">Apuração de impostos</a></li>
                            <li><a href="#servicos">Departamento pessoal</a></li>
                            <li><a href="#servicos">Declarações e Imposto de Renda</a></li>
                            <li><a href="#servicos">Regularização de empresas</a></li>
                            <li><a href="#servicos">Consultoria contábil</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Empresa</h4>
                        <ul>
                            <li><a href="#empresa">Sobre a GRB</a></li>
                            <li><a href="#diferenciais">Diferenciais</a></li>
                            <li><a href="#faq">Perguntas Frequentes</a></li>
                            <li><a href="#contato">Contato</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Fale conosco</h4>
                        <ul className="footer__contact">
                            <li>
                                <div className="footer__contact-icon footer__contact-icon--green">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">{WHATSAPP}</a>
                            </li>
                            <li>
                                <div className="footer__contact-icon footer__contact-icon--blue">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
                            </li>
                            <li>
                                <div className="footer__contact-icon footer__contact-icon--pink">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
                                    </svg>
                                </div>
                                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{INSTAGRAM}</a>
                            </li>
                            <li>
                                <div className="footer__contact-icon footer__contact-icon--yellow">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <span>{HOURS}</span>
                            </li>
                            <li>
                                <div className="footer__contact-icon footer__contact-icon--red">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem' }}>
                                    {ADDRESS}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Barra CTA verde */}
            <div className="footer__cta-bar">
                <div className="container footer__cta-bar-inner">
                    <span>Conte com a GRB para crescer com segurança fiscal.</span>
                    <a href={WHATSAPP_DIAG_URL} className="btn btn--whatsapp btn--sm" target="_blank" rel="noopener noreferrer">
                        Fale conosco pelo WhatsApp
                    </a>
                </div>
            </div>

            <div className="footer__bottom">
                <div className="container">
                    <p suppressHydrationWarning>© {year} GRB Assessoria Contábil. Todos os direitos reservados.</p>
                    <p>Contabilidade em Fortaleza – CE</p>
                </div>
            </div>
        </footer>
    );
}
