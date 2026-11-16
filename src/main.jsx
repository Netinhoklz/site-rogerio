import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const container = document.getElementById('root');
const app = (
    <StrictMode>
        <App />
    </StrictMode>
);

// No build de produção o HTML já vem pronto (scripts/prerender.js); no `npm run dev` a div vem vazia.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
