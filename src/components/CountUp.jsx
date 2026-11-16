import { useEffect, useRef, useState } from 'react';

// Conta de 0 até o número quando ele aparece na tela. No HTML pronto (Google, ou sem JavaScript)
// já vem o número final. Quem pede "menos movimento" no sistema também vê o número pronto.
export default function CountUp({ to, suffix = '', espera = 0 }) {
    const ref = useRef(null);
    const [n, setN] = useState(to);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
        const DURACAO = 1600;
        let id;
        setN(0);
        const io = new IntersectionObserver(([entrada]) => {
            if (!entrada.isIntersecting) return;
            io.disconnect();
            const inicio = performance.now() + espera;
            const passo = (agora) => {
                const p = Math.min(Math.max((agora - inicio) / DURACAO, 0), 1);
                setN(Math.round(to * (1 - (1 - p) ** 3))); // rápido no começo, desacelera ao chegar
                if (p < 1) id = requestAnimationFrame(passo);
            };
            id = requestAnimationFrame(passo);
        }, { threshold: 0.6 });
        io.observe(ref.current);
        return () => { io.disconnect(); cancelAnimationFrame(id); };
    }, [to, espera]);

    return <span ref={ref}>{n}{suffix}</span>;
}
