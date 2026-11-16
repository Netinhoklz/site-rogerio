# Site GRB Assessoria Contábil

Site de uma página da GRB Assessoria Contábil (Fortaleza – CE), feito em React + Vite. O build gera arquivos estáticos (HTML, CSS, JS e imagens), então o site roda em qualquer hospedagem estática. Não precisa de servidor Node nem de PHP.

O objetivo do site: quem pesquisa "contabilidade Fortaleza" encontra a página e fala com o escritório pelo WhatsApp.

## Rodar no computador

```bash
npm install      # só na primeira vez
npm run dev      # edição, com recarregamento automático
npm run build    # gera a pasta dist/ (o site pronto)
npm run preview  # abre o site gerado em http://localhost:4173
```

Precisa do Node 20 ou mais novo (o projeto usa o 24, indicado em `.node-version`).

## Publicar no Render

O repositório já traz o arquivo [render.yaml](render.yaml), que o Render lê sozinho.

1. Entre em [render.com](https://render.com) e conecte a conta do GitHub.
2. Clique em **New → Blueprint** e, na lista, clique em **Connect** ao lado deste repositório.
3. Dê um nome ao Blueprint, deixe a branch `main` e clique em **Deploy Blueprint**. O Render instala as dependências (`npm ci`), gera o site (`npm run build`) e publica a pasta `dist/`.

O site fica em `https://site-rogerio.onrender.com` (ou no nome que o Render indicar), com HTTPS automático. A cada `git push` na branch `main`, o Render publica a versão nova.

**Domínio próprio:** no painel do serviço, em **Settings → Custom Domains**, adicione o domínio e siga as instruções de DNS. Depois, em **Environment**, crie a variável `SITE_URL` com o endereço final (ex.: `https://www.seudominio.com.br`) e faça um novo deploy. É esse endereço que vai para o Google (canonical e sitemap). Sem a variável, o build usa o endereço `onrender.com`.

## Onde mudar cada coisa

| O quê | Onde |
|---|---|
| Telefone, WhatsApp, endereço, horário, Instagram | [src/data/content.js](src/data/content.js) (topo do arquivo) |
| Serviços, depoimentos, perguntas frequentes, clientes | [src/data/content.js](src/data/content.js) |
| Textos de cada seção | arquivos em [src/components/](src/components/) |
| Cores e aparência | [src/index.css](src/index.css) (as cores ficam no bloco `:root`, no início) |
| Título e descrição que aparecem no Google | [index.html](index.html) |

### Movimentos e interações

| O quê | Onde |
|---|---|
| Convite do WhatsApp (balão que sai do botão verde): tempo para aparecer, tempo para sumir e os três assuntos | `APARECE_EM`, `SOME_EM` e `ASSUNTOS`, em [src/components/FloatingButtons.jsx](src/components/FloatingButtons.jsx) |
| Mensagem do link "Solicitar este serviço" de cada quadro | [src/components/Services.jsx](src/components/Services.jsx) |
| Números que contam (200+ e 15+) | [src/components/HeroPanel.jsx](src/components/HeroPanel.jsx) e [src/components/About.jsx](src/components/About.jsx) |
| Faixa de logos de clientes, abaixo do topo | lista `CLIENTS`, em [src/data/content.js](src/data/content.js); a velocidade fica em `.partners__list` (`animation: esteira 34s`), em [src/index.css](src/index.css) |
| Fotos que ampliam ao clicar | lista `OFFICE_PHOTOS`, em [src/data/content.js](src/data/content.js) |

### Elementos de confiança

| O quê | Onde |
|---|---|
| Telefone fixo no cabeçalho (aparece em telas largas) | `PHONE`, em [src/data/content.js](src/data/content.js) |
| Etapas da seção "Como funciona" | `PROCESS_STEPS`, em [src/data/content.js](src/data/content.js) |
| Logo ao lado do depoimento em destaque | campo `logo` do depoimento, em `TESTIMONIALS` ([src/data/content.js](src/data/content.js)) |
| Regimes tributários, no cabeçalho da seção de serviços | `REGIMES`, em [src/data/content.js](src/data/content.js) |

O convite do WhatsApp aparece uma vez por visita. Quem ativou "reduzir movimento" no aparelho vê o site parado, com todo o conteúdo à vista.

### Seção guardada: "Diferenciais"

A seção "Diferenciais" (seis cartões numerados) saiu do site em 16/11/2026, mas continua guardada no código. Para trazê-la de volta, tire o comentário destas quatro linhas e gere o site de novo:

1. [src/App.jsx](src/App.jsx): a linha `import Features ...` e a linha `<Features />`.
2. [src/data/content.js](src/data/content.js): o item `diferenciais` em `NAV_ITEMS` (menu).
3. [src/components/Footer.jsx](src/components/Footer.jsx): o link "Diferenciais" do rodapé.

Os textos estão em `FEATURES` ([src/data/content.js](src/data/content.js)), o componente em [src/components/Features.jsx](src/components/Features.jsx) e o visual nas regras `.feature` de [src/index.css](src/index.css). Depois de reativar, acrescente `'diferenciais'` à lista `SECOES` de [scripts/verificar_site.mjs](scripts/verificar_site.mjs) e troque o fundo de `.process` para `var(--off-white)` em [src/index.css](src/index.css), para as seções continuarem alternando de cor.

### Fotos e logos

As imagens originais ficam em `referencia/`, `logos/` e `empresa/`. O site usa versões reduzidas, geradas por scripts (precisam de Python com Pillow e NumPy):

```bash
python scripts/preparar_fotos.py                                            # fotos da empresa → public/fotos/
python scripts/preparar_logos.py "original.jpg" public/clientes/nome.png    # logo de um cliente
python scripts/preparar_logo_grb.py                                         # logo da GRB e ícone da aba
```

Depois de acrescentar a logo de um cliente, inclua-a em `CLIENTS`, em [src/data/content.js](src/data/content.js). As fotos da galeria estão em `OFFICE_PHOTOS`, no mesmo arquivo.

## Versão de computador e versão de celular

É uma página só, com um endereço só. O navegador monta a versão certa pela largura da tela:

| | Celular (até 720 px) | Computador (acima de 720 px) |
|---|---|---|
| Menu | botão ☰ que abre a lista | horizontal, no cabeçalho |
| Serviços | uma coluna, só título e descrição | três colunas, com a lista de itens |
| Depoimentos | fileira para deslizar com o dedo | grade |
| WhatsApp | botão redondo fixo no canto | botão com texto no canto e no cabeçalho |

Entre 721 e 999 px (tablet em pé) as grades usam duas colunas. Em telas de toque, os efeitos de "passar o mouse" ficam desligados.

### Conferir antes de publicar

Com `npm run preview` rodando em outro terminal:

```bash
node scripts/verificar_site.mjs                       # testa celular (360 px), tablet e computador
node scripts/verificar_site.mjs --capturas capturas   # idem, e grava imagens de cada seção na pasta capturas/
```

O script abre o site num Chrome sem janela e confere, em cada tamanho de tela: qual versão foi montada (celular ou computador), nada cortado na borda, imagens carregadas, ícones centralizados, menu do celular, perguntas frequentes, formulário (abre o WhatsApp certo), links de WhatsApp e erros no console. Termina com "Tudo certo." ou lista o que falhou.

## Publicar em hospedagem comum (Locaweb e similares)

1. Defina `SITE_URL` em [src/data/content.js](src/data/content.js) com o domínio (sem barra no final) e rode `npm run build`.
2. Ative o **certificado SSL** do domínio no painel da hospedagem. O arquivo `.htaccess` redireciona tudo para `https://`.
3. Envie **o conteúdo** da pasta `dist/` (não a pasta em si) para dentro de `public_html`, por FTP ou pelo gerenciador de arquivos do painel. O `.htaccess` começa com ponto: confira se ele foi enviado.

Para atualizar, rode `npm run build` e envie de novo o conteúdo de `dist/`.

## Aparecer no Google para "contabilidade fortaleza"

O código já está preparado: título, descrição, título principal e textos com "Contabilidade em Fortaleza", HTML pré-renderizado (o Google lê o conteúdo sem executar JavaScript) e dados da empresa no formato schema.org (`AccountingService`, com endereço, telefone e horário). O que decide a posição está fora do código:

1. **Google Search Console** (search.google.com/search-console): adicione o domínio, envie `https://SEU-DOMINIO/sitemap.xml` e peça a indexação da página inicial.
2. **Perfil da Empresa no Google** (business.google.com): categoria "Contador" ou "Escritório de contabilidade", com **o mesmo** nome, endereço e telefone do site e o link do site. É isso que coloca a empresa no mapa que aparece no topo de buscas como "contabilidade fortaleza". Avaliações de clientes reais pesam muito.
3. O resultado orgânico leva de semanas a meses. Para aparecer já, só com anúncio (Google Ads) na palavra "contabilidade fortaleza", apontando para o site.
