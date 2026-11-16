// Verifica o site rodando (npm run preview) num Chrome sem janela, em tamanho de celular e de computador:
// layout, imagens, menu do celular, perguntas frequentes, formulário, links do WhatsApp e as interações
// (painel do topo, barra de progresso, faixa de logos, convite do WhatsApp, brilho dos cartões, fotos que ampliam).
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
const SECOES = ['inicio', 'empresa', 'principios', 'servicos', 'como-funciona', 'escritorio', 'depoimentos', 'faq', 'contato'];

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
        // O convite do WhatsApp só aparece uma vez por visita: cada tamanho de tela começa como uma visita nova
        await naPagina(() => { try { sessionStorage.clear(); } catch { /* página em branco */ } });
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
                estrelasApagadas: [...document.querySelectorAll('.testimonial__stars')].filter((el) => getComputedStyle(el).clipPath !== 'none').length,
                // Elementos de confiança: logos de clientes, etapas, depoimento com logo, telefone
                logosFaixa: [...document.querySelectorAll('.partners__list:not([aria-hidden]) img')].filter((i) => i.complete && i.naturalWidth > 0).length,
                regimes: document.querySelectorAll('#servicos .regimes li').length,
                etapas: {
                    total: document.querySelectorAll('.process__step').length,
                    acesas: [...document.querySelectorAll('.process__num')].filter((n) => getComputedStyle(n).color === 'rgb(244, 185, 66)').length,
                    linha: getComputedStyle(document.querySelector('.process__steps'), '::after').transform,
                },
                logoDepoimento: (() => { const i = document.querySelector('.testimonial--featured .testimonial__logo'); return !!i && i.complete && i.naturalWidth > 0; })(),
                telefone: (() => { const a = document.querySelector('.header__phone'); return { visivel: getComputedStyle(a).display !== 'none', href: a.getAttribute('href') }; })(),
                topoTexto: ret(document.querySelector('.hero__content')), topoPainel: ret(document.querySelector('.hero__visual')),
                // Botão flutuante do WhatsApp: quando mostra só o ícone (celular), o ícone tem de estar no centro do círculo
                botaoWhats: (() => {
                    const b = document.querySelector('.whatsapp-float');
                    const a = b.getBoundingClientRect(), c = b.querySelector('svg').getBoundingClientRect();
                    return { soIcone: getComputedStyle(b.querySelector('span')).display === 'none', dx: (c.left + c.width / 2) - (a.left + a.width / 2), dy: (c.top + c.height / 2) - (a.top + a.height / 2) };
                })(),
                diferenciais: !!document.getElementById('diferenciais') || !!document.querySelector('a[href="#diferenciais"]'),
                // Mapa: o quadro embutido e o link "Abrir no Google Maps" têm de apontar para o mesmo ponto (latitude,longitude)
                mapa: (() => {
                    const ponto = (u) => (decodeURIComponent(u).match(/-?\d+\.\d{4,},-?\d+\.\d{4,}/) || [''])[0];
                    return { quadro: ponto(document.querySelector('.contact-map-embed iframe').src), link: ponto(document.querySelector('.contact-map-link').href) };
                })(),
                h1: document.querySelectorAll('h1').length,
                titulo: document.title,
            };
        }, SECOES, WHATSAPP, tela.width);

        ok(g.cortados.length === 0, 'nada passa da borda direita da tela', `${g.cortados.length} elementos, ex.: ${g.cortados.slice(0, 8).join('; ')}`);
        ok(g.imagensQuebradas.length === 0, 'todas as imagens carregaram', g.imagensQuebradas.join(', '));
        ok(g.invisiveis === 0, 'nenhum bloco ficou invisível depois de rolar a página', `${g.invisiveis} blocos`);
        ok(g.estrelasApagadas === 0, 'estrelas dos depoimentos todas acesas depois da animação', `${g.estrelasApagadas} com estrelas pela metade`);
        ok(g.secoesFaltando.length === 0, 'todas as seções existem', g.secoesFaltando.join(', '));
        ok(g.h1 === 1 && g.titulo.includes('Contabilidade em Fortaleza'), 'um único título principal e "Contabilidade em Fortaleza" no título da aba', `h1=${g.h1}, "${g.titulo}"`);
        ok(g.linksWhats.length >= 10 && g.whatsErrados.length === 0, `${g.linksWhats.length} links de WhatsApp, todos para o número certo`, g.whatsErrados.join(', '));
        ok(g.tortos.length === 0, 'ícones centralizados dentro das caixas', g.tortos.join('; '));
        ok(g.mapa.quadro !== '' && g.mapa.quadro === g.mapa.link, 'mapa e link "Abrir no Google Maps" apontam para o mesmo ponto, por coordenadas', JSON.stringify(g.mapa));
        if (g.botaoWhats.soIcone) ok(Math.abs(g.botaoWhats.dx) < 1.5 && Math.abs(g.botaoWhats.dy) < 1.5, 'botão flutuante do WhatsApp com o ícone no centro do círculo', `fora do centro ${Math.round(g.botaoWhats.dx)}px, ${Math.round(g.botaoWhats.dy)}px`);
        ok(!g.diferenciais, 'seção "Diferenciais" fora do site, sem link sobrando no menu nem no rodapé');
        // As três pessoas estão no lado direito da foto: o quadro tem de ser quase quadrado e encostado na direita
        ok(g.foto.razaoTela > 0.9 && g.foto.razaoTela < 1.05 && g.foto.posicao.startsWith('100%') && g.foto.largura === g.foto.larguraCartao, 'foto dos sócios enquadrada no grupo (quadro quase quadrado), na largura toda do cartão', `proporção ${g.foto.razaoTela.toFixed(2)}, posição ${g.foto.posicao}, ${g.foto.largura}/${g.foto.larguraCartao}px`);
        ok(Math.abs(g.ultimoStat.right - g.gradeDireita) < 2, 'painel de números do topo sem quadro vazio', `sobra ${Math.round(g.gradeDireita - g.ultimoStat.right)}px`);
        ok(g.logosFaixa === 6, 'faixa abaixo do topo com as 6 logos de clientes carregadas', `${g.logosFaixa} logos`);
        ok(g.regimes === 6, 'os 6 regimes tributários aparecem na seção de serviços', `${g.regimes}`);
        ok(g.etapas.total === 4 && g.etapas.acesas === 4 && (tela.width <= 960 || /^matrix\(1, 0, 0, 1, 0, 0\)$/.test(g.etapas.linha)), '"Como funciona": 4 etapas, todas acesas e com a linha desenhada até o fim', JSON.stringify(g.etapas));
        ok(g.logoDepoimento, 'depoimento em destaque mostra a logo da empresa');
        ok(g.telefone.visivel === (tela.width >= 1180) && g.telefone.href.startsWith('tel:+55'), `telefone fixo no cabeçalho ${tela.width >= 1180 ? 'visível' : 'oculto (tela estreita)'}, com link para ligar`, JSON.stringify(g.telefone));
        if (tela.width > 960) {
            ok(Math.abs(g.topoTexto.top - g.topoPainel.top) < 2 && Math.abs(g.topoTexto.h - g.topoPainel.h) < 2 && Math.abs(g.topoTexto.w - g.topoPainel.w) < 2,
                'topo: texto e painel com a mesma largura e a mesma altura, começando na mesma linha', `texto ${Math.round(g.topoTexto.w)}×${Math.round(g.topoTexto.h)}, painel ${Math.round(g.topoPainel.w)}×${Math.round(g.topoPainel.h)}, topos ${Math.round(g.topoTexto.top)} e ${Math.round(g.topoPainel.top)}`);
            ok(Math.abs(g.cartao.top - g.texto.top) < 2, 'foto dos sócios alinhada com o topo do texto ao lado', `diferença de ${Math.round(g.cartao.top - g.texto.top)}px`);
            if (tela.width > 1150) ok(Math.abs(g.cartao.bottom - g.texto.bottom) < 2, 'foto dos sócios alinhada com o fim do texto ao lado', `diferença de ${Math.round(g.cartao.bottom - g.texto.bottom)}px`);
        }

        // Convite do WhatsApp: aparece sozinho alguns segundos depois de a página abrir, cabe na tela e fecha no ×.
        // Vem antes do teste de mouse do painel: em tela de tablet o convite aberto cobre um canto do painel.
        const lerConvite = () => naPagina((whatsapp) => {
            const c = document.querySelector('.convite');
            const r = c.getBoundingClientRect();
            return {
                visivel: c.classList.contains('is-visible') && getComputedStyle(c).visibility === 'visible',
                assuntos: [...c.querySelectorAll('.convite__opcoes a')].filter((a) => a.href.includes(`wa.me/${whatsapp}?text=`)).length,
                cabe: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight,
            };
        }, WHATSAPP);
        let convite = await lerConvite();
        for (let i = 0; i < 80 && !convite.visivel; i++) { await dormir(100); convite = await lerConvite(); }
        await dormir(600); // termina a animação de entrada antes de medir
        convite = await lerConvite();
        ok(convite.visivel && convite.assuntos === 3 && convite.cabe, 'convite do WhatsApp aparece sozinho, com 3 assuntos, dentro da tela', JSON.stringify(convite));
        await naPagina(() => document.querySelector('.convite__fechar').click());
        await dormir(600);
        ok(!(await lerConvite()).visivel, 'convite do WhatsApp fecha no ×');

        // Painel animado do topo: contagem terminou no número certo, quadros são links, e ele inclina com o mouse
        const lerPainel = () => naPagina((whatsapp) => {
            const grade = document.querySelector('.hero__stats-grid');
            const r = document.querySelector('.hero__visual').getBoundingClientRect();
            return {
                numeros: [...document.querySelectorAll('.hero__stat-value:not(.hero__stat-value--text)')].map((el) => el.textContent),
                links: [...document.querySelectorAll('a.hero__stat')].map((a) => (a.href.includes(`wa.me/${whatsapp}`) ? 'whatsapp' : a.getAttribute('href'))),
                inclinacao: getComputedStyle(grade).transform,
                animacoes: [getComputedStyle(grade).animationName, getComputedStyle(document.querySelector('.hero__visual-bg')).animationName],
                ponto: { x: Math.round(r.left + r.width * 0.2), y: Math.round(r.top + Math.min(r.height, innerHeight - r.top) * 0.2) },
            };
        }, WHATSAPP);
        const painel = await lerPainel();
        ok(painel.numeros.join(' ') === '200+ 15+', 'painel do topo: a contagem termina em 200+ e 15+', painel.numeros.join(' '));
        ok(painel.links.join(' ') === 'whatsapp #depoimentos #empresa whatsapp', 'painel do topo: os 4 quadros são links (WhatsApp, depoimentos, empresa, WhatsApp)', painel.links.join(' '));
        ok(painel.animacoes.join(' ') === 'flutuar balancar', 'painel do topo: flutua e o cartão de fundo balança', painel.animacoes.join(' '));
        if (!tela.mobile) {
            // Mouse de verdade sobre o canto do painel: ele tem de inclinar; ao sair, volta ao lugar
            await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: painel.ponto.x, y: painel.ponto.y });
            await dormir(600);
            const comMouse = await lerPainel();
            await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: tela.height - 5 });
            await dormir(700);
            const semMouse = await lerPainel();
            const plano = (m) => m === 'none' || /^matrix\(1, 0, 0, 1, 0, 0\)$/.test(m);
            ok(!plano(comMouse.inclinacao) && plano(semMouse.inclinacao), 'painel do topo: inclina na direção do mouse e volta ao sair', `com mouse: ${comMouse.inclinacao.slice(0, 60)} | sem: ${semMouse.inclinacao.slice(0, 40)}`);
        }

        // Movimentos: barra de progresso do cabeçalho, faixa de logos, contagem do "15+" e links dos serviços
        const vida = await naPagina(async (whatsapp) => {
            const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
            const barra = () => new DOMMatrix(getComputedStyle(document.querySelector('.header__progress')).transform).a;
            const faixa = () => new DOMMatrix(getComputedStyle(document.querySelector('.partners__list')).transform).m41;
            scrollTo({ top: 0, behavior: 'instant' }); await pausa(250);
            const barraTopo = barra();
            scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }); await pausa(250);
            const barraFim = barra();
            scrollTo({ top: 0, behavior: 'instant' });
            const x1 = faixa(); await pausa(400); const x2 = faixa();
            const servicos = [...document.querySelectorAll('.service-card:not(.service-card--cta)')].map((c) => {
                const a = c.querySelector('a.service-card__link');
                return !!a && a.href.includes(`wa.me/${whatsapp}?text=`) && decodeURIComponent(a.href).includes(c.querySelector('h3').textContent);
            });
            return { barraTopo, barraFim, faixaAndou: Math.abs(x2 - x1), listasFaixa: document.querySelectorAll('.partners__list').length, servicos, anos: document.querySelector('.about__number > span').textContent };
        }, WHATSAPP);
        ok(vida.barraTopo < 0.02 && vida.barraFim > 0.98, 'barra dourada do cabeçalho acompanha a rolagem (vazia no topo, cheia no fim)', `topo ${vida.barraTopo}, fim ${vida.barraFim}`);
        ok(vida.listasFaixa === 2 && vida.faixaAndou > 3, 'faixa das logos de clientes desliza sozinha', `andou ${vida.faixaAndou}px em 0,4 s`);
        ok(vida.anos === '15+', 'número da seção Empresa termina a contagem em 15+', vida.anos);
        ok(vida.servicos.length === 7 && vida.servicos.every(Boolean), 'os 7 serviços têm link para o WhatsApp com o nome do serviço na mensagem', JSON.stringify(vida.servicos));

        if (!tela.mobile) {
            // Mouse de verdade sobre um quadro de serviço: o brilho dourado acende no ponto onde o cursor está
            const ponto = await naPagina(async () => {
                const r0 = document.querySelector('.service-card').getBoundingClientRect();
                scrollTo({ top: r0.top + scrollY - (innerHeight - r0.height) / 2, behavior: 'instant' });
                await new Promise((r) => setTimeout(r, 300));
                const r = document.querySelector('.service-card').getBoundingClientRect();
                return { x: Math.round(r.left + r.width * 0.3), y: Math.round(r.top + r.height * 0.4) };
            });
            await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: ponto.x, y: ponto.y });
            await dormir(700);
            const brilho = await naPagina(() => {
                const c = document.querySelector('.service-card');
                return { mx: c.style.getPropertyValue('--mx'), my: c.style.getPropertyValue('--my'), opacidade: parseFloat(getComputedStyle(c, '::after').opacity) };
            });
            await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: tela.height - 5 });
            ok(brilho.mx.endsWith('px') && brilho.my.endsWith('px') && brilho.opacidade > 0.9, 'quadros de serviço: o brilho dourado acompanha o mouse', JSON.stringify(brilho));
        }

        // Fotos do escritório: clicar amplia, a seta troca de foto e o × fecha
        const fotos = await naPagina(async () => {
            const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
            const janela = document.querySelector('.lightbox');
            const itens = [...document.querySelectorAll('button.gallery__item')];
            itens[1].click(); await pausa(700);
            const img = janela.querySelector('img');
            const r = img?.getBoundingClientRect();
            const abriu = janela.open && !!img && img.complete && img.naturalWidth > 0;
            const cabe = !!r && r.left >= 0 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight + 1;
            const primeira = img?.getAttribute('src');
            janela.querySelector('.lightbox__seta--proxima').click(); await pausa(500);
            const segunda = janela.querySelector('img')?.getAttribute('src');
            janela.querySelector('.lightbox__fechar').click(); await pausa(300);
            return { fotos: itens.length, abriu, cabe, trocou: !!segunda && segunda !== primeira, fechou: !janela.open && !janela.querySelector('img') };
        });
        ok(fotos.fotos === 4 && fotos.abriu && fotos.cabe && fotos.trocou && fotos.fechou, 'fotos do escritório: clicar amplia dentro da tela, a seta troca de foto e o × fecha', JSON.stringify(fotos));

        if (tela.width <= 720) {
            // Depoimentos: ao deslizar até o terceiro, o terceiro pontinho fica marcado
            const pontos = await naPagina(async () => {
                const grade = document.querySelector('.testimonials__grid');
                grade.scrollTo({ left: (grade.children[1].offsetLeft - grade.children[0].offsetLeft) * 2, behavior: 'instant' });
                await new Promise((r) => setTimeout(r, 500));
                const marcados = [...document.querySelectorAll('.testimonials__dots span')].map((s) => s.classList.contains('is-active'));
                grade.scrollTo({ left: 0, behavior: 'instant' });
                return marcados;
            });
            ok(pontos.length === 3 && pontos.indexOf(true) === 2 && pontos.filter(Boolean).length === 1, 'depoimentos: o pontinho marcado acompanha o depoimento que está na tela', JSON.stringify(pontos));
        }

        // Qual versão o navegador montou para esta largura de tela (a página é a mesma; o CSS escolhe pelo tamanho)
        const v = await naPagina(() => {
            const visivel = (sel) => { const el = document.querySelector(sel); return !!el && getComputedStyle(el).display !== 'none'; };
            const grade = document.querySelector('.testimonials__grid');
            const pequenos = [...document.querySelectorAll('a.btn, .nav-toggle, .faq__item summary, .whatsapp-float, .footer__social, a.service-card__link, .convite__opcoes a, .convite__fechar')]
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
