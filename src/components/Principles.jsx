import Reveal from './Reveal.jsx';
import { PRINCIPLES } from '../data/content.js';
import { IconTarget, IconEye, IconHandshake } from './icons.jsx';

export default function Principles() {
    return (
        <section className="section principles" id="principios">
            <div className="container">
                <header className="section__header section__header--center">
                    <span className="eyebrow">Nossos princípios</span>
                    <h2 className="section__title">Missão, visão e valores</h2>
                </header>

                <div className="principles__grid">
                    <Reveal as="article" className="principle">
                        <div className="principle__icon" aria-hidden="true"><IconTarget /></div>
                        <h3>Missão</h3>
                        <p>{PRINCIPLES.mission}</p>
                    </Reveal>
                    <Reveal as="article" className="principle">
                        <div className="principle__icon" aria-hidden="true"><IconEye /></div>
                        <h3>Visão</h3>
                        <p>{PRINCIPLES.vision}</p>
                    </Reveal>
                    <Reveal as="article" className="principle">
                        <div className="principle__icon" aria-hidden="true"><IconHandshake /></div>
                        <h3>Valores</h3>
                        <ul>
                            {PRINCIPLES.values.map(v => <li key={v}>{v}</li>)}
                        </ul>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
