import { REGIMES } from '../data/content.js';

export default function Partners() {
    return (
        <section className="partners">
            <div className="container">
                <p className="partners__label">Atuamos com todos os regimes tributários</p>
                <ul className="partners__list" role="list">
                    {REGIMES.map(r => <li key={r}>{r}</li>)}
                </ul>
            </div>
        </section>
    );
}
