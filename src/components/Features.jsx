import { FEATURES } from '../data/content.js';
import useReveal from '../hooks/useReveal.js';
import Reveal from './Reveal.jsx';

export default function Features() {
    return (
        <section className="section" id="diferenciais">
            <div className="container">
                <Reveal as="header" className="section__header section__header--center">
                    <span className="eyebrow">Diferenciais</span>
                    <h2 className="section__title">Mais do que contabilidade: uma parceria para o crescimento da sua empresa</h2>
                </Reveal>

                <div className="features">
                    {FEATURES.map(f => <FeatureCard key={f.n} feature={f} />)}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ feature }) {
    const [ref, visible] = useReveal();
    return (
        <div ref={ref} className={`feature reveal ${visible ? 'is-visible' : ''}`}>
            <div className="feature__num">{feature.n}</div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
        </div>
    );
}
