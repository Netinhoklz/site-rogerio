import { useEffect, useRef, useState } from 'react';

export default function useReveal(options = {}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || visible) return;

        if (!('IntersectionObserver' in window)) {
            setVisible(true);
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    io.unobserve(el);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px', ...options }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [visible, options]);

    return [ref, visible];
}
