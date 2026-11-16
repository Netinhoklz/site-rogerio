import { CLIENTS } from '../data/content.js';

// Faixa de clientes logo abaixo do topo: as logos deslizam sem parar.
// A lista vem duas vezes para emendar uma volta na outra; a segunda é só visual.
export default function Partners() {
    return (
        <section className="partners" aria-label="Clientes">
            <div className="container">
                <p className="partners__label">Empresas que confiam na GRB Assessoria Contábil</p>
                <div className="partners__faixa">
                    <ul className="partners__list" role="list">
                        {CLIENTS.map(c => <li key={c.name}><img src={c.logo} alt={c.name} /></li>)}
                    </ul>
                    <ul className="partners__list" aria-hidden="true">
                        {CLIENTS.map(c => <li key={c.name}><img src={c.logo} alt="" /></li>)}
                    </ul>
                </div>
            </div>
        </section>
    );
}
