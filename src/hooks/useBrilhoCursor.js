import { useEffect } from 'react';

const CARTOES = '.service-card, .feature, .principle, .testimonial';

// Um único ouvinte para a página toda: informa ao cartão sob o mouse onde o cursor está (--mx, --my).
// O CSS desenha um brilho dourado nesse ponto (ver "Brilho que acompanha o cursor" em index.css).
export default function useBrilhoCursor() {
    useEffect(() => {
        let quadro = 0;
        const aoMover = (e) => {
            if (e.pointerType !== 'mouse') return;
            const cartao = e.target.closest?.(CARTOES);
            if (!cartao) return;
            const { clientX, clientY } = e;
            cancelAnimationFrame(quadro);
            quadro = requestAnimationFrame(() => {
                const r = cartao.getBoundingClientRect();
                cartao.style.setProperty('--mx', `${Math.round(clientX - r.left)}px`);
                cartao.style.setProperty('--my', `${Math.round(clientY - r.top)}px`);
            });
        };
        document.addEventListener('pointermove', aoMover, { passive: true });
        return () => {
            document.removeEventListener('pointermove', aoMover);
            cancelAnimationFrame(quadro);
        };
    }, []);
}
