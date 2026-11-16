import { useState } from 'react';
import Reveal from './Reveal.jsx';
import { FAQS } from '../data/content.js';

export default function Faq() {
    const [openIdx, setOpenIdx] = useState(0);

    const toggle = (i) => setOpenIdx(prev => (prev === i ? -1 : i));

    return (
        <section className="section" id="faq">
            <div className="container grid-2 grid-2--faq">
                <Reveal>
                    <span className="eyebrow">Perguntas frequentes</span>
                    <h2 className="section__title">Esclarecimentos sobre os nossos serviços</h2>
                    <p>Reunimos as dúvidas mais comuns de empresários que pretendem trocar de contabilidade ou abrir uma empresa.</p>
                    <a href="#contato" className="btn btn--primary">Esclarecer outras dúvidas</a>
                </Reveal>

                <div className="faq">
                    {FAQS.map((item, i) => (
                        <FaqItem
                            key={item.q}
                            item={item}
                            open={openIdx === i}
                            onToggle={() => toggle(i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FaqItem({ item, open, onToggle }) {
    const handleClick = (e) => {
        e.preventDefault();
        onToggle();
    };
    return (
        <details className="faq__item reveal is-visible" open={open}>
            <summary onClick={handleClick}>{item.q}</summary>
            <p>{item.a}</p>
        </details>
    );
}
