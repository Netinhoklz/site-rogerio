import useScrolled from '../hooks/useScrolled.js';
import { IconWhatsFilled, IconChevronUp } from './icons.jsx';

export default function FloatingButtons({ whatsappUrl }) {
    const showBackToTop = useScrolled(600);

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <>
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
