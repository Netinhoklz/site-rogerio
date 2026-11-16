import { renderToString } from 'react-dom/server';
import App from './App.jsx';

// Usado só no build (scripts/prerender.js) para gerar o HTML estático da página.
export function render() {
    return renderToString(<App />);
}
