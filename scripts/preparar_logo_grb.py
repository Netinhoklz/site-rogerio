"""Gera as imagens da logo da GRB a partir da ficha da marca (empresa/SAIBA MAIS.png).

Saídas em public/:
- logo-grb.png          logo original (em pé), recortada e com fundo transparente, para o cabeçalho e o rodapé.
- logo-grb-quadrado.png logo original sobre fundo branco, para a prévia do link no WhatsApp/redes
                        (og:image) e para os dados da empresa no Google.
- favicon.png           só o símbolo (barras + seta) num quadrado branco, para a aba do navegador.

Uso: python scripts/preparar_logo_grb.py
"""
import numpy as np
from PIL import Image

ORIGEM = 'empresa/SAIBA MAIS.png'
REGIAO_LOGO = (260, 700)  # faixa vertical da ficha onde está a logo (abaixo do @ do Instagram, acima das cores)


def caixa_com_tinta(a, y0, y1):
    """Retângulo (x0, y0, x1, y1) que contém tudo o que não é branco na faixa y0..y1."""
    tinta = (255 - a[y0:y1]).max(axis=2) > 40
    ys, xs = np.nonzero(tinta)
    return xs.min(), ys.min() + y0, xs.max() + 1, ys.max() + 1 + y0


def branco_para_transparente(img):
    """Tira o fundo branco preservando a suavização das bordas."""
    a = np.asarray(img.convert('RGB')).astype(np.float32)
    alfa = (255 - a).max(axis=2) / 255.0
    cor = 255 - (255 - a) / np.maximum(alfa, 1e-6)[..., None]
    rgba = np.dstack([np.clip(cor, 0, 255), alfa * 255]).round().astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')


def main():
    ficha = Image.open(ORIGEM).convert('RGB')
    x0, y0, x1, y1 = caixa_com_tinta(np.asarray(ficha).astype(int), *REGIAO_LOGO)
    logo = ficha.crop((x0 - 3, y0 - 3, x1 + 3, y1 + 3))  # 3 px de folga para não cortar a suavização

    branco_para_transparente(logo).save('public/logo-grb.png', optimize=True)
    print('public/logo-grb.png', logo.size)

    # Sem ampliar: centralizada num quadrado branco
    lado = round(max(logo.size) * 1.45)
    quadrado = Image.new('RGB', (lado, lado), 'white')
    quadrado.paste(logo, ((lado - logo.width) // 2, (lado - logo.height) // 2))
    quadrado.save('public/logo-grb-quadrado.png', optimize=True)
    print('public/logo-grb-quadrado.png', quadrado.size)

    # Ícone da aba do navegador: só o símbolo (barras + seta), que é a primeira faixa com tinta da logo
    tinta = (255 - np.asarray(logo).astype(int)).max(axis=2) > 40
    linhas = tinta.any(axis=1)
    topo = int(np.argmax(linhas))
    base = topo + int(np.argmin(linhas[topo:]))  # primeira linha em branco depois do símbolo
    colunas = np.nonzero(tinta[topo:base].any(axis=0))[0]
    simbolo = logo.crop((int(colunas.min()), topo, int(colunas.max()) + 1, base))
    lado = round(max(simbolo.size) * 1.15)
    icone = Image.new('RGB', (lado, lado), 'white')
    icone.paste(simbolo, ((lado - simbolo.width) // 2, (lado - simbolo.height) // 2))
    icone.resize((96, 96), Image.LANCZOS).save('public/favicon.png', optimize=True)
    print('public/favicon.png (96, 96)')


if __name__ == '__main__':
    main()
