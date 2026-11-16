import { useEffect, useState } from 'react';

export default function useActiveSection(sectionIds, offset = 120) {
    const [active, setActive] = useState(sectionIds[0] || '');

    useEffect(() => {
        const onScroll = () => {
            const pos = window.scrollY + offset;
            let current = sectionIds[0] || '';
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (el && pos >= el.offsetTop) current = id;
            }
            setActive(current);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [sectionIds, offset]);

    return active;
}
