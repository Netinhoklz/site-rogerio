"""Prepara as fotos da empresa para o site: reduz para o tamanho de tela e grava em WebP.

As originais ficam em referencia/ (não são alteradas). As saídas vão para public/fotos/.
Para trocar ou acrescentar uma foto: ajuste a lista FOTOS, rode o script e confira
OFFICE_PHOTOS / a seção "Empresa" em src/data/content.js.

Uso: python scripts/preparar_fotos.py
"""
import os

from PIL import Image

ORIGEM = 'referencia'
DESTINO = 'public/fotos'
QUALIDADE = 80

# (arquivo original, nome no site, largura máxima em px: cerca de 2x a largura em que a foto aparece)
FOTOS = [
    ('equipe-grb.webp', 'equipe-grb.webp', 1400),
    ('IMG_7061 (1).PNG', 'predio.webp', 940),
    ('equipe-no-escritorio.webp', 'equipe-no-escritorio.webp', 1200),
    ('atendimento.webp', 'atendimento.webp', 1200),
    ('escritorio.webp', 'escritorio.webp', 900),
]


def main():
    os.makedirs(DESTINO, exist_ok=True)
    for original, nome, largura_max in FOTOS:
        img = Image.open(os.path.join(ORIGEM, original)).convert('RGB')
        if img.width > largura_max:
            img = img.resize((largura_max, round(img.height * largura_max / img.width)), Image.LANCZOS)
        saida = os.path.join(DESTINO, nome)
        img.save(saida, 'WEBP', quality=QUALIDADE, method=6)
        print(f'{saida}: {img.width}x{img.height}, {os.path.getsize(saida) // 1024} KB')


if __name__ == '__main__':
    main()
