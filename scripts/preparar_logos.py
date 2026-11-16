"""Prepara logos de clientes para o site: corta a margem vazia, deixa o fundo branco e reduz o tamanho.

Uso:  python scripts/preparar_logos.py <imagem_original> <saida.png>
Ex.:  python scripts/preparar_logos.py "logos/WhatsApp Image ....jpeg" public/clientes/nome-do-cliente.png
Depois, cadastre o cliente em CLIENTS (src/data/content.js).

Logo que já vem numa placa colorida (ex.: símbolo branco sobre fundo escuro): acrescente --fundo-original.
O fundo é mantido, o símbolo fica maior e os cantos são arredondados; use saída .webp.
Ex.:  python scripts/preparar_logos.py logos/infinity-quant.png public/clientes/infinity-quant.webp --fundo-original
"""
import sys

import numpy as np
from PIL import Image, ImageDraw

MAX_W, MAX_H = 360, 180  # o site mostra a logo em ~180x90; 2x para telas de alta resolução
LIMIAR_FUNDO = 18        # diferença máxima para o pixel contar como fundo


def preparar(origem, destino):
    px = np.asarray(Image.open(origem).convert('RGB')).astype(np.float32)

    # Cor do fundo = mediana dos 4 cantos; "esticar" essa cor até o branco puro (sem bordas duras)
    h, w, _ = px.shape
    k = max(4, min(h, w) // 50)
    cantos = np.concatenate([px[:k, :k], px[:k, -k:], px[-k:, :k], px[-k:, -k:]]).reshape(-1, 3)
    fundo = np.median(cantos, axis=0)
    px = np.clip(px * (255.0 / np.maximum(fundo, 1.0)), 0, 255)

    # Recorta no que não é fundo, com uma folga de 4%
    conteudo = (255 - px).max(axis=2) > LIMIAR_FUNDO
    ys, xs = np.nonzero(conteudo)
    if len(xs) == 0:
        raise SystemExit(f'{origem}: imagem sem conteúdo visível')
    folga = int(0.04 * max(xs.max() - xs.min(), ys.max() - ys.min()))
    y0, y1 = max(0, ys.min() - folga), min(h, ys.max() + 1 + folga)
    x0, x1 = max(0, xs.min() - folga), min(w, xs.max() + 1 + folga)

    img = Image.fromarray(px[y0:y1, x0:x1].astype(np.uint8))
    img.thumbnail((MAX_W, MAX_H), Image.LANCZOS)
    img.save(destino, optimize=True)
    print(f'{destino}: {img.size[0]}x{img.size[1]} (fundo original {fundo.round().astype(int).tolist()})')


def preparar_com_fundo(origem, destino, lado=288, ocupacao=0.78, raio=0.16):
    """Mantém o fundo da logo, recorta um quadrado em volta do símbolo e arredonda os cantos."""
    img = Image.open(origem).convert('RGB')
    px = np.asarray(img).astype(np.float32)
    h, w, _ = px.shape
    k = max(4, min(h, w) // 50)
    cantos = np.concatenate([px[:k, :k], px[:k, -k:], px[-k:, :k], px[-k:, -k:]]).reshape(-1, 3)
    fundo = np.median(cantos, axis=0)

    # Símbolo = o que difere bastante da cor do fundo; o recorte quadrado deixa o símbolo com ~78% da largura
    ys, xs = np.nonzero(np.abs(px - fundo).max(axis=2) > 90)
    if len(xs) == 0:
        raise SystemExit(f'{origem}: não encontrei o símbolo sobre o fundo')
    meio = min(max(xs.max() - xs.min(), ys.max() - ys.min()) / ocupacao, w, h) / 2
    cx = min(max((xs.min() + xs.max()) / 2, meio), w - meio)
    cy = min(max((ys.min() + ys.max()) / 2, meio), h - meio)
    img = img.crop((round(cx - meio), round(cy - meio), round(cx + meio), round(cy + meio))).resize((lado, lado), Image.LANCZOS)

    # Cantos arredondados: máscara desenhada 4x maior e reduzida, para a borda ficar lisa
    mascara = Image.new('L', (lado * 4, lado * 4), 0)
    ImageDraw.Draw(mascara).rounded_rectangle((0, 0, lado * 4 - 1, lado * 4 - 1), radius=round(raio * lado * 4), fill=255)
    img.putalpha(mascara.resize((lado, lado), Image.LANCZOS))
    img.save(destino, quality=90)
    print(f'{destino}: {lado}x{lado} (fundo mantido {fundo.round().astype(int).tolist()})')


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if a != '--fundo-original']
    if len(args) != 2:
        raise SystemExit(__doc__)
    (preparar_com_fundo if '--fundo-original' in sys.argv else preparar)(*args)
