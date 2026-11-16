import { useEffect, useState } from 'react';
import useScrolled from '../hooks/useScrolled.js';
import { IconWhatsFilled, IconChevronUp } from './icons.jsx';
import { WHATSAPP_OPEN_URL, WHATSAPP_DIAG_URL, WHATSAPP_QUOTE_URL } from '../data/content.js';

// Assuntos do convite: cada um abre o WhatsApp com a mensagem correspondente já escrita
const ASSUNTOS = [
    { rotulo: 'Abrir empresa', url: WHATSAPP_OPEN_URL },
    { rotulo: 'Diagnóstico gratuito', url: WHATSAPP_DIAG_URL },
    { rotulo: 'Solicitar proposta', url: WHATSAPP_QUOTE_URL },
];
const APARECE_EM = 6000;   // milissegundos depois de a página abrir
const SOME_EM = 26000;
const CHAVE = 'convite-whatsapp-visto';

export default function FloatingButtons({ whatsappUrl }) {
    const showBackToTop = useScrolled(600);
    const [convite, setConvite] = useState(false);

    // O convite aparece uma vez por visita (não volta ao recarregar a página) e some sozinho
    useEffect(() => {
        try { if (sessionStorage.getItem(CHAVE)) return; } catch { /* navegador sem armazenamento: mostra mesmo assim */ }
        const abrir = setTimeout(() => {
            setConvite(true);
            try { sessionStorage.setItem(CHAVE, '1'); } catch { /* idem */ }
        }, APARECE_EM);
        const fechar = setTimeout(() => setConvite(false), SOME_EM);
        return () => { clearTimeout(abrir); clearTimeout(fechar); };
    }, []);

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <>
            <aside className={`convite ${convite ? 'is-visible' : ''}`} aria-label="Atendimento pelo WhatsApp" aria-hidden={!convite}>
                <button type="button" className="convite__fechar" onClick={() => setConvite(false)} aria-label="Fechar convite">×</button>
                <span className="convite__marca"><IconWhatsFilled width="16" height="16" /> GRB Assessoria Contábil</span>
                <strong>Como podemos ajudar a sua empresa?</strong>
                <p>Selecione um assunto para falar com a nossa equipe pelo WhatsApp.</p>
                <div className="convite__opcoes">
                    {ASSUNTOS.map(a => (
                        <a key={a.rotulo} href={a.url} target="_blank" rel="noopener noreferrer" onClick={() => setConvite(false)}>
                            {a.rotulo}
                        </a>
                    ))}
                </div>
            </aside>

            <a
                href={whatsappUrl}
                className="whatsapp-float"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Fale conosco pelo WhatsApp"
                id="floating-whatsapp"
            >
                <IconWhatsFilled />
                <span>Fale conosco</span>
            </a>

            <button
                type="button"
                className={`back-to-top ${showBackToTop ? 'is-visible' : ''}`}
                onClick={scrollTop}
                aria-label="Voltar ao topo"
            >
                <IconChevronUp />
            </button>
        </>
    );
}
