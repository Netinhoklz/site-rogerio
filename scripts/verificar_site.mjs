// Verifica o site rodando (npm run preview) num Chrome sem janela, em tamanho de celular e de computador:
// layout, imagens, menu do celular, perguntas frequentes, formulário e links do WhatsApp.
//
// Uso:  node scripts/verificar_site.mjs [url] [--capturas pasta]
//   url         padrão http://localhost:4173/
//   --capturas  grava imagens das seções em cada tamanho de tela nessa pasta
// Sai com código 1 se alguma verificação falhar.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const iCap = args.indexOf('--capturas');
const pastaCapturas = iCap >= 0 ? args[iCap + 1] : null;
const url = args.find((a, i) => !a.startsWith('--') && i !== iCap + 1) || 'http://localhost:4173/';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORTA = 9333;
const WHATSAPP = '5585986899938';
const TELAS = [
    { nome: 'celular', width: 360, height: 760, mobile: true }, // 360 px: a largura mais estreita ainda comum
    { nome: 'tablet', width: 1024, height: 768, mobile: false },
    { nome: 'computador', width: 1366, height: 768, mobile: false },
];
const SECOES = ['inicio', 'empresa', 'principios', 'servicos', 'diferenciais', 'escritorio', 'depoimentos', 'faq', 'contato'];

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const perfil = mkdtempSync(join(tmpdir(), 'verificar-site-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORTA}`, `--user-data-dir=${perfil}`, 'about:blank'], { stdio: 'ignore' });

let falhas = 0;
const ok = (cond, texto, detalhe = '') => {
    if (!cond) falhas++;
    console.log(`  ${cond ? '✓' : '✗ FALHOU:'} ${texto}${!cond && detalhe ? ` → ${detalhe}` : ''}`);
};

try {
    // Espera o Chrome abrir a porta de depuração e conecta na aba
    let alvo;
    for (let i = 0; i < 50 && !alvo; i++) {
        await dormir(200);
        alvo = await fetch(`http://127.0.0.1:${PORTA}/json`).then((r) => r.json()).then((l) => l.find((t) => t.type === 'page')).catch(() => null);
    }
    if (!alvo) throw new Error('Chrome não abriu a porta de depuração');
    const ws = new WebSocket(alvo.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let seq = 0;
    const pendentes = new Map();
    const erros = [];
    let aoCarregar = null;
    ws.onmessage = (e) => {
        const m = JSON.parse(e.data);
        if (m.id) return pendentes.get(m.id)?.(m);
        if (m.method === 'Page.loadEventFired') aoCarregar?.();
        if (m.method === 'Runtime.exceptionThrown') erros.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
        if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/google|gstatic/.test(m.params.entry.url || '')) erros.push(`${m.params.entry.text} ${m.params.entry.url || ''}`);
    };
    const cdp = (method, params = {}) => new Promise((res) => { const id = ++seq; pendentes.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
    // Roda uma função dentro da página e devolve o resultado
    const naPagina = async (fn, ...a) => {
        const r = await cdp('Runtime.evaluate', { expression: `(${fn})(...${JSON.stringify(a)})`, awaitPromise: true, returnByValue: true });
        if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text);
        return r.result.result.value;
    };
    await cdp('Page.enable'); await cdp('Runtime.enable'); await cdp('Log.enable');
    if (pastaCapturas) mkdirSync(pastaCapturas, { recursive: true });

    for (const tela of TELAS) {
        console.log(`\n${tela.nome} (${tela.width}×${tela.height})`);
        erros.length = 0;
        await cdp('Emulation.setDeviceMetricsOverride', { width: tela.width, height: tela.height, deviceScaleFactor: 1, mobile: tela.mobile });
        const carregou = new Promise((r) => { aoCarregar = r; });
        await cdp('Page.navigate', { url });
        await Promise.race([carregou, dormir(15000)]);
        await dormir(800);

        // Rola a página inteira, como um visitante: dispara as animações e as imagens de carregamento tardio
        await naPagina(async () => {
            const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
            // 'instant' porque o site usa rolagem suave: sem isso cada passo interromperia o anterior no meio
            for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(innerHeight * 0.7)) { scrollTo({ top: y, behavior: 'instant' }); await pausa(150); }
            scrollTo({ top: 0, behavior: 'instant' }); await pausa(300);
        });
        await dormir(1500);

        const g = await naPagina((secoes, whatsapp, largura) => {
            const ret = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right, w: r.width, h: r.height }; };
            // Conteúdo que passa da borda direita da tela (o body esconde a sobra, então ele aparece cortado).
            // Não conta enfeite já cortado de propósito por um bloco pai que cabe na tela.
            const cortados = [];
            for (const el of document.querySelectorAll('header *, main *, footer *')) {
                const r = el.getBoundingClientRect();
                if (r.width === 0 || r.right <= largura + 1) continue;
                let pai = el.parentElement, enfeite = false;
                for (; pai && pai !== document.body; pai = pai.parentElement) {
                    if (getComputedStyle(pai).overflowX !== 'visible' && pai.getBoundingClientRect().right <= largura + 1) { enfeite = true; break; }
                }
                if (!enfeite) cortados.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''} (+${Math.round(r.right - largura)}px)`);
            }
            // Ícones dentro de quadradinhos/círculos: o centro do ícone tem de coincidir com o centro da caixa
            const tortos = [];
            for (const caixa of document.querySelectorAll('[class*="icon"], .footer__social')) {
                const svg = caixa.querySelector(':scope > svg');
                if (!svg) continue;
                const a = caixa.getBoundingClientRect(), b = svg.getBoundingClientRect();
                if (!a.width || !b.width) continue;
                const dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
                if (Math.abs(dx) > 1.5 || Math.abs(dy) > 1.5) tortos.push(`${caixa.className.trim().split(/\s+/)[0]} (${Math.round(dx)}px, ${Math.round(dy)}px)`);
            }
            const foto = document.querySelector('.about__photo');
            const texto = document.querySelector('#empresa .grid-2 > div:last-child');
            const stats = [...document.querySelectorAll('.hero__stat')].map(ret);
            const grade = document.querySelector('.hero__stats-grid');
            const gs = getComputedStyle(grade);
            return {
                alturaPagina: document.documentElement.scrollHeight,
                cortados: [...new Set(cortados)],
                tortos: [...new Set(tortos)],
                imagensQuebradas: [...document.images].filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute('src')),
                invisiveis: [...document.querySelectorAll('.reveal')].filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99).length,
                secoesFaltando: secoes.filter((s) => !document.getElementById(s)),
                linksWhats: [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.href),
                whatsErrados: [...document.querySelectorAll('a[href*="wa.me"]')].filter((a) => !a.href.includes(`wa.me/${whatsapp}`)).map((a) => a.href),
                foto: { razaoTela: foto.clientWidth / foto.clientHeight, posicao: getComputedStyle(foto).objectPosition, largura: foto.clientWidth, larguraCartao: foto.parentElement.clientWidth },
                cartao: ret(document.querySelector('.about__media')),
                texto: ret(texto),
                ultimoStat: stats.at(-1), gradeDireita: grade.getBoundingClientRect().right - parseFloat(gs.paddingRight) - parseFloat(gs.borderRightWidth),
                h1: document.querySelectorAll('h1').length,
                titulo: document.title,
            };
        }, SECOES, WHATSAPP, tela.width);

        ok(g.cortados.length === 0, 'nada passa da borda direita da tela', `${g.cortados.length} elementos, ex.: ${g.cortados.slice(0, 8).join('; ')}`);
        ok(g.imagensQuebradas.length === 0, 'todas as imagens carregaram', g.imagensQuebradas.join(', '));
        ok(g.invisiveis === 0, 'nenhum bloco ficou invisível depois de rolar a página', `${g.invisiveis} blocos`);
        ok(g.secoesFaltando.length === 0, 'todas as seções existem', g.secoesFaltando.join(', '));
        ok(g.h1 === 1 && g.titulo.includes('Contabilidade em Fortaleza'), 'um único título principal e "Contabilidade em Fortaleza" no título da aba', `h1=${g.h1}, "${g.titulo}"`);
        ok(g.linksWhats.length >= 10 && g.whatsErrados.length === 0, `${g.linksWhats.length} links de WhatsApp, todos para o número certo`, g.whatsErrados.join(', '));
        ok(g.tortos.length === 0, 'ícones centralizados dentro das caixas', g.tortos.join('; '));
        // As três pessoas estão no lado direito da foto: o quadro tem de ser quase quadrado e encostado na direita
        ok(g.foto.razaoTela > 0.9 && g.foto.razaoTela < 1.05 && g.foto.posicao.startsWith('100%') && g.foto.largura === g.foto.larguraCartao, 'foto dos sócios enquadrada no grupo (quadro quase quadrado), na largura toda do cartão', `proporção ${g.foto.razaoTela.toFixed(2)}, posição ${g.foto.posicao}, ${g.foto.largura}/${g.foto.larguraCartao}px`);
        ok(Math.abs(g.ultimoStat.right - g.gradeDireita) < 2, 'painel de números do topo sem quadro vazio', `sobra ${Math.round(g.gradeDireita - g.ultimoStat.right)}px`);
        if (tela.width > 960) {
            ok(Math.abs(g.cartao.top - g.texto.top) < 2, 'foto dos sócios alinhada com o topo do texto ao lado', `diferença de ${Math.round(g.cartao.top - g.texto.top)}px`);
            if (tela.width > 1150) ok(Math.abs(g.cartao.bottom - g.texto.bottom) < 2, 'foto dos sócios alinhada com o fim do texto ao lado', `diferença de ${Math.round(g.cartao.bottom - g.texto.bottom)}px`);
        }

        // Qual versão o navegador montou para esta largura de tela (a página é a mesma; o CSS escolhe pelo tamanho)
        const v = await naPagina(() => {
            const visivel = (sel) => { const el = document.querySelector(sel); return !!el && getComputedStyle(el).display !== 'none'; };
            const grade = document.querySelector('.testimonials__grid');
            const pequenos = [...document.querySelectorAll('a.btn, .nav-toggle, .faq__item summary, .whatsapp-float, .footer__social')]
                .map((el) => ({ el, r: el.getBoundingClientRect() }))
                .filter(({ r }) => r.width > 0 && (r.width < 40 || r.height < 40))
                .map(({ el, r }) => `${el.className.trim().split(/\s+/).slice(0, 2).join('.')} ${Math.round(r.width)}×${Math.round(r.height)}`);
            return {
                botaoMenu: visivel('.nav-toggle'),
                menuHorizontal: getComputedStyle(document.querySelector('.nav')).position !== 'fixed',
                botaoCabecalho: visivel('.header__cta'),
                colunasServicos: getComputedStyle(document.querySelector('.services')).gridTemplateColumns.split(' ').length,
                itensServicos: visivel('.service-card ul'),
                depoimentosDeslizam: grade.scrollWidth > grade.clientWidth + 10,
                avisoDeslizar: visivel('.swipe-hint'),
                pequenos: [...new Set(pequenos)],
            };
        });
        if (tela.width <= 720) {
            ok(v.botaoMenu && !v.menuHorizontal && !v.botaoCabecalho && v.colunasServicos === 1 && !v.itensServicos && v.depoimentosDeslizam && v.avisoDeslizar,
                'VERSÃO DE CELULAR ativa: menu no botão ☰, serviços resumidos em 1 coluna, depoimentos em fileira deslizante', JSON.stringify(v));
            ok(v.pequenos.length === 0, 'botões com tamanho confortável para o dedo (40 px ou mais)', v.pequenos.join('; '));
        } else {
            ok(!v.botaoMenu && v.menuHorizontal && v.botaoCabecalho && v.colunasServicos === 3 && v.itensServicos && !v.depoimentosDeslizam && !v.avisoDeslizar,
                'VERSÃO DE COMPUTADOR ativa: menu horizontal, serviços completos em 3 colunas, depoimentos em grade', JSON.stringify(v));
        }

        // Perguntas frequentes: clicar na segunda abre ela e fecha a primeira
        const faq = await naPagina(async () => {
            const itens = [...document.querySelectorAll('.faq__item')];
            itens[1].querySelector('summary').click();
            await new Promise((r) => setTimeout(r, 200));
            return itens.map((i) => i.open);
        });
        ok(faq[1] === true && faq[0] === false, 'perguntas frequentes abrem e fecham ao clicar', JSON.stringify(faq));

        // Menu: no celular abre pelo botão; clicar num item fecha e leva à seção sem o cabeçalho cobrir o título
        const menu = await naPagina(async (mobile) => {
            const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
            const nav = document.querySelector('.nav');
            const cabecalho = document.querySelector('.header').getBoundingClientRect();
            const r = { abriu: true, fechou: true, logoLivre: true };
            if (mobile) {
                const antes = getComputedStyle(nav).visibility;
                const logo = document.querySelector('.header .logo').getBoundingClientRect();
                // com o menu fechado, o que está no centro da logo tem de ser a própria logo (nada por cima)
                r.logoLivre = antes === 'hidden' && !!document.elementFromPoint(logo.left + logo.width / 2, logo.top + logo.height / 2)?.closest('.logo');
                document.querySelector('.nav-toggle').click(); await pausa(500);
                const n = nav.getBoundingClientRect();
                r.abriu = nav.classList.contains('is-open') && getComputedStyle(nav).visibility === 'visible' && n.top >= cabecalho.bottom - 2 && n.height > 150;
            }
            nav.querySelector('a[href="#servicos"]').click(); await pausa(1800);
            if (mobile) r.fechou = !nav.classList.contains('is-open');
            const titulo = document.querySelector('#servicos .eyebrow').getBoundingClientRect();
            r.tituloTop = Math.round(titulo.top); r.cabecalhoBottom = Math.round(cabecalho.bottom);
            return r;
        }, tela.width <= 720);
        if (tela.width <= 720) {
            ok(menu.logoLivre, 'menu fechado não cobre a logo');
            ok(menu.abriu, 'menu do celular abre ao tocar no botão');
            ok(menu.fechou, 'menu do celular fecha ao escolher um item');
        }
        ok(menu.tituloTop >= menu.cabecalhoBottom && menu.tituloTop < tela.height * 0.6, 'clicar em "Serviços" leva à seção, sem o cabeçalho cobrir o título', `título em ${menu.tituloTop}px, cabeçalho até ${menu.cabecalhoBottom}px`);

        // Formulário: preencher e enviar abre o WhatsApp do escritório com os dados
        const form = await naPagina(async () => {
            const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
            const escrever = (el, v) => {
                const proto = { SELECT: HTMLSelectElement, TEXTAREA: HTMLTextAreaElement, INPUT: HTMLInputElement }[el.tagName].prototype;
                Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
                el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
            };
            window.open = (u) => { window.__aberto = u; return null; };
            const f = document.querySelector('form.form');
            f.requestSubmit(); await pausa(200);
            const vazioBloqueado = !window.__aberto && document.querySelectorAll('.is-invalid').length >= 3;
            escrever(document.getElementById('name'), 'Maria Teste');
            escrever(document.getElementById('phone'), '85999990000');
            escrever(document.getElementById('service'), document.querySelector('#service option:nth-child(2)').value);
            f.requestSubmit(); await pausa(1500);
            return { vazioBloqueado, aberto: window.__aberto || '', telefone: document.getElementById('phone').value };
        });
        ok(form.vazioBloqueado, 'formulário vazio não é enviado e marca os campos obrigatórios');
        ok(form.aberto.startsWith(`https://wa.me/${WHATSAPP}?text=`) && decodeURIComponent(form.aberto).includes('Maria Teste') && decodeURIComponent(form.aberto).includes('(85) 99999-0000'), 'formulário preenchido abre o WhatsApp do escritório com nome e telefone', form.aberto.slice(0, 120));

        ok(erros.length === 0, 'nenhum erro no console do navegador', erros.join(' | ').slice(0, 300));
        console.log(`  · altura total da página: ${g.alturaPagina}px (${(g.alturaPagina / tela.height).toFixed(1)} telas)`);

        if (pastaCapturas) {
            await naPagina(() => { scrollTo({ top: 0, behavior: 'instant' }); });
            await dormir(300);
            for (const id of SECOES) {
                const c = await naPagina((i) => { const r = document.getElementById(i).getBoundingClientRect(); return { y: r.top + scrollY, h: Math.min(r.height, 6000) }; }, id);
                const foto = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: Math.max(0, c.y), width: tela.width, height: c.h, scale: 1 } });
                writeFileSync(join(pastaCapturas, `${tela.nome}-${id}.png`), Buffer.from(foto.result.data, 'base64'));
            }
            console.log(`  · capturas em ${pastaCapturas}`);
        }
    }
    ws.close();
} finally {
    chrome.kill();
    await dormir(500);
    try { rmSync(perfil, { recursive: true, force: true }); } catch { /* o Chrome ainda pode estar soltando arquivos */ }
}

console.log(falhas ? `\n${falhas} verificação(ões) falharam.` : '\nTudo certo.');
process.exit(falhas ? 1 : 0);
