export default function Logo({ light = false, asLink = true }) {
    // public/logo-grb.png é gerada por scripts/preparar_logo_grb.py a partir de empresa/SAIBA MAIS.png
    const content = <img className="logo__img" src="logo-grb.png" alt="GRB Assessoria Contábil" width="339" height="325" />;
    const className = `logo ${light ? 'logo--light' : ''}`.trim();

    if (asLink) {
        return (
            <a href="#inicio" className={className} aria-label="GRB Assessoria Contábil - Início">
                {content}
            </a>
        );
    }
    return <div className={className}>{content}</div>;
}
