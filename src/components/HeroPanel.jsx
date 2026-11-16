import { useRef } from 'react';
import CountUp from './CountUp.jsx';
import { WHATSAPP_DIAG_URL, WHATSAPP_URL } from '../data/content.js';

// Quem pede "menos movimento" no sistema não recebe a inclinação
const semMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Painel do topo: flutua de leve, inclina na direção do mouse e cada quadro é um link.
export default function HeroPanel() {
    const ref = useRef(null);
    const quadro = useRef(0);

    // Posição do mouse sobre o painel → variáveis CSS (inclinação e ponto do brilho). Ver .hero__stats-grid.
    const aoMover = (e) => {
        const el = ref.current;
        if (!el || e.pointerType !== 'mouse' || semMovimento()) return;
        const { clientX, clientY } = e;
        cancelAnimationFrame(quadro.current);
        quadro.current = requestAnimationFrame(() => {
            const r = el.getBoundingClientRect();
            const x = (clientX - r.left) / r.width;
            const y = (clientY - r.top) / r.height;
            el.style.setProperty('--ry', `${((x - 0.5) * 8).toFixed(2)}deg`);
            el.style.setProperty('--rx', `${((0.5 - y) * 8).toFixed(2)}deg`);
            el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
            el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
        });
    };
    const aoSair = () => {
        cancelAnimationFrame(quadro.current);
        ['--rx', '--ry', '--mx', '--my'].forEach((v) => ref.current?.style.removeProperty(v));
    };

    return (
        <div className="hero__visual" ref={ref} onPointerMove={aoMover} onPointerLeave={aoSair}>
            <div className="hero__visual-bg" aria-hidden="true"></div>
            <div className="hero__stats-grid">
                <a className="hero__stat hero__stat--main" href={WHATSAPP_DIAG_URL} target="_blank" rel="noopener noreferrer">
                    <span className="hero__stat-value hero__stat-value--text">Análise e otimização tributária para a sua empresa</span>
                </a>
                <a className="hero__stat" href="#depoimentos">
                    {/* espera: a contagem começa depois que o painel terminou de aparecer */}
                    <span className="hero__stat-value"><CountUp to={200} suffix="+" espera={500} /></span>
                    <span className="hero__stat-label">empresas atendidas</span>
                </a>
                <a className="hero__stat" href="#empresa">
                    <span className="hero__stat-value"><CountUp to={15} suffix="+" espera={500} /></span>
                    <span className="hero__stat-label">anos de atuação</span>
                </a>
                <a className="hero__stat" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <span className="hero__stat-value hero__stat-value--text">Atendimento imediato</span>
                </a>
            </div>
        </div>
    );
}
