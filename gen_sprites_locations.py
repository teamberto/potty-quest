"""Generates the location-pack sprites for Potty Champ worlds 2-4
(Park, Grocery Store, School) plus the candy power-up.
Run: python3 gen_sprites_locations.py
Outputs tile-multiple PNGs into assets/ (same style as gen_sprites.py).
"""
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), "assets")
os.makedirs(OUT, exist_ok=True)

T = 24  # base tile size

OUTLINE = (26, 20, 16, 255)


def new_canvas(w=T, h=T):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))


def save(img, name):
    img.save(os.path.join(OUT, f"{name}.png"))
    print("wrote", name, img.size)


def rect(d, x0, y0, x1, y1, fill):
    d.rectangle([x0, y0, x1, y1], fill=fill)


def outlined(d, x0, y0, x1, y1, fill):
    d.rectangle([x0, y0, x1, y1], fill=fill, outline=OUTLINE)


# ---------- candy (16x16 drawn at runtime, generate 24 for crispness) ----------
def gen_candy():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    # stick
    rect(d, 11, 13, 12, 21, (222, 214, 202, 255))
    # swirl lollipop
    d.ellipse([4, 2, 19, 17], fill=(255, 82, 119, 255), outline=OUTLINE)
    d.ellipse([7, 5, 16, 14], fill=(255, 255, 255, 255))
    d.ellipse([9, 7, 14, 12], fill=(255, 82, 119, 255))
    # shine
    rect(d, 6, 4, 7, 5, (255, 255, 255, 255))
    save(img, "candy")


# ---------- park ----------
def gen_tree():
    img = new_canvas(T, T * 2)
    d = ImageDraw.Draw(img)
    # trunk
    outlined(d, 9, 30, 14, 45, (91, 63, 33, 255))
    rect(d, 10, 31, 11, 44, (117, 84, 48, 255))
    # canopy: three stacked blobs
    d.ellipse([1, 10, 22, 32], fill=(45, 128, 58, 255), outline=OUTLINE)
    d.ellipse([3, 2, 20, 22], fill=(58, 152, 70, 255), outline=OUTLINE)
    # highlights
    rect(d, 7, 6, 9, 8, (96, 188, 108, 255))
    rect(d, 13, 12, 15, 14, (96, 188, 108, 255))
    save(img, "tree")


def gen_bench():
    img = new_canvas(T * 2, T)
    d = ImageDraw.Draw(img)
    # legs
    rect(d, 4, 14, 6, 21, OUTLINE)
    rect(d, 41, 14, 43, 21, OUTLINE)
    # seat slats
    outlined(d, 2, 9, 45, 13, (168, 116, 62, 255))
    rect(d, 3, 10, 44, 10, (196, 142, 82, 255))
    # backrest
    outlined(d, 2, 2, 45, 6, (168, 116, 62, 255))
    rect(d, 3, 3, 44, 3, (196, 142, 82, 255))
    save(img, "bench")


def gen_porta_potty():
    img = new_canvas(T, T)
    d = ImageDraw.Draw(img)
    body = (58, 141, 222, 255)
    body_sh = (38, 100, 170, 255)
    outlined(d, 3, 1, 20, 22, body)
    rect(d, 4, 2, 19, 4, (120, 180, 244, 255))     # roof strip
    outlined(d, 8, 7, 15, 22, body_sh)              # door
    rect(d, 13, 14, 14, 15, (240, 240, 240, 255))   # handle
    # moon vent
    d.ellipse([10, 9, 13, 12], fill=(240, 240, 240, 255))
    save(img, "porta_potty")


# ---------- grocery store ----------
def gen_shelf():
    img = new_canvas(T * 2, T)
    d = ImageDraw.Draw(img)
    frame = (150, 150, 158, 255)
    outlined(d, 1, 1, 46, 22, frame)
    rect(d, 2, 2, 45, 21, (178, 178, 186, 255))
    # two shelf rows of colorful goods
    goods = [(238, 92, 66, 255), (255, 208, 70, 255), (86, 178, 90, 255),
             (86, 128, 238, 255), (238, 140, 196, 255), (255, 152, 60, 255)]
    for row_y in (4, 14):
        rect(d, 2, row_y + 6, 45, row_y + 7, frame)  # shelf board
        for i, gx in enumerate(range(4, 44, 7)):
            c = goods[(i + (0 if row_y == 4 else 3)) % len(goods)]
            outlined(d, gx, row_y, gx + 4, row_y + 5, c)
    save(img, "shelf")


def gen_cart():
    img = new_canvas(T, T)
    d = ImageDraw.Draw(img)
    metal = (172, 180, 190, 255)
    # basket
    outlined(d, 3, 6, 18, 15, metal)
    for gx in range(5, 18, 3):
        d.line([(gx, 7), (gx, 14)], fill=(120, 128, 138, 255))
    # handle
    d.line([(18, 7), (21, 3)], fill=OUTLINE)
    rect(d, 20, 2, 22, 3, (238, 92, 66, 255))
    # wheels
    d.ellipse([4, 17, 8, 21], fill=OUTLINE)
    d.ellipse([13, 17, 17, 21], fill=OUTLINE)
    save(img, "cart")


def gen_floor_store():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    a = (226, 226, 218, 255)
    b = (204, 208, 202, 255)
    rect(d, 0, 0, 23, 23, a)
    rect(d, 0, 0, 11, 11, b)
    rect(d, 12, 12, 23, 23, b)
    # subtle speckle
    for px, py in ((4, 16), (18, 5), (9, 20), (15, 9)):
        rect(d, px, py, px, py, (190, 192, 186, 255))
    save(img, "floor_store")


# ---------- school ----------
def gen_desk():
    img = new_canvas(T, T)
    d = ImageDraw.Draw(img)
    wood = (196, 142, 82, 255)
    wood_sh = (168, 116, 62, 255)
    # legs
    rect(d, 4, 14, 5, 21, OUTLINE)
    rect(d, 18, 14, 19, 21, OUTLINE)
    # desktop
    outlined(d, 2, 7, 21, 13, wood)
    rect(d, 3, 8, 20, 9, (222, 170, 106, 255))
    # notebook on desk
    outlined(d, 8, 9, 14, 12, (240, 240, 244, 255))
    d.line([(11, 9), (11, 12)], fill=(140, 140, 150, 255))
    # chair back peeking behind
    outlined(d, 8, 2, 15, 6, wood_sh)
    save(img, "desk")


def gen_chalkboard():
    img = new_canvas(T * 2, T)
    d = ImageDraw.Draw(img)
    outlined(d, 1, 2, 46, 20, (168, 116, 62, 255))     # wood frame
    rect(d, 3, 4, 44, 18, (38, 92, 66, 255))           # green board
    # chalk scribbles: "A B C" style marks
    chalk = (232, 236, 230, 255)
    d.line([(7, 8), (10, 14)], fill=chalk)
    d.line([(10, 14), (13, 8)], fill=chalk)
    d.line([(8, 11), (12, 11)], fill=chalk)
    d.line([(17, 8), (17, 14)], fill=chalk)
    d.arc([17, 8, 22, 11], 270, 90, fill=chalk)
    d.arc([17, 11, 22, 14], 270, 90, fill=chalk)
    d.arc([27, 8, 32, 14], 90, 270, fill=chalk)
    # chalk tray
    rect(d, 16, 18, 32, 19, (150, 108, 58, 255))
    save(img, "chalkboard")


if __name__ == "__main__":
    gen_candy()
    gen_tree()
    gen_bench()
    gen_porta_potty()
    gen_shelf()
    gen_cart()
    gen_floor_store()
    gen_desk()
    gen_chalkboard()
    print("location pack done")
