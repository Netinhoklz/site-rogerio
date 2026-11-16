import useReveal from '../hooks/useReveal.js';

export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
    const [ref, visible] = useReveal();
    const cls = `reveal ${visible ? 'is-visible' : ''} ${className}`.trim();
    return (
        <Tag ref={ref} className={cls} {...rest}>
            {children}
        </Tag>
    );
}
