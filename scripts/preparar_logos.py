"""Prepara logos de clientes para o site: corta a margem vazia, deixa o fundo branco e reduz o tamanho.

Uso:  python scripts/preparar_logos.py <imagem_original> <saida.png>
Ex.:  python scripts/preparar_logos.py "logos/WhatsApp Image ....jpeg" public/clientes/nome-do-cliente.png
Depois, cadastre o cliente em CLIENTS (src/data/content.js).
"""
import sys

import numpy as np
from PIL import Image

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


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    preparar(sys.argv[1], sys.argv[2])
