"""Generates the Level Builder menu icon: a toolbox with a claw hammer and an
open-end wrench, plus nails, screws, bolts and a nut scattered underneath.
Run: python3 gen_toolbox.py   ->   assets/toolbox.png (32x32, NES palette)
"""
from PIL import Image
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
S = 32
OX = 4          # shifts the toolbox art to sit centered on the wider canvas

OUTLINE = (26, 20, 16, 255)
METAL = (198, 204, 214, 255)
METAL_SH = (140, 148, 162, 255)
HEAD = (96, 102, 114, 255)
HEAD_SH = (64, 68, 80, 255)
HEAD_HI = (146, 152, 164, 255)
WOOD = (201, 138, 75, 255)
WOOD_DK = (162, 106, 52, 255)
BOX = (206, 64, 58, 255)
BOX_HI = (236, 100, 92, 255)
BOX_SH = (152, 40, 36, 255)
LATCH = (255, 210, 63, 255)
LATCH_SH = (201, 149, 10, 255)
BRASS = (214, 166, 74, 255)
BRASS_SH = (162, 118, 44, 255)

img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
px = img.load()


def rect(x0, y0, x1, y1, c, off=True):
    dx = OX if off else 0
    for y in range(y0, y1 + 1):
        for x in range(x0 + dx, x1 + dx + 1):
            if 0 <= x < S and 0 <= y < S:
                px[x, y] = c


def raw(x0, y0, x1, y1, c):
    rect(x0, y0, x1, y1, c, off=False)


# ================= TOOLS =================

# ---- open-end wrench (left) ----
rect(1, 1, 2, 2, METAL)           # left jaw
rect(6, 1, 7, 2, METAL)           # right jaw
rect(1, 3, 7, 3, METAL)           # throat
rect(1, 4, 7, 4, METAL_SH)
rect(2, 5, 6, 5, METAL)
rect(3, 6, 5, 6, METAL_SH)
rect(3, 6, 4, 14, METAL)          # shaft
rect(4, 6, 4, 14, METAL_SH)

# ---- claw hammer (right) ----
rect(13, 2, 13, 3, HEAD)          # claw sweeps down and back
rect(12, 3, 13, 4, HEAD)
rect(11, 4, 13, 5, HEAD)
rect(10, 5, 12, 6, HEAD)
rect(10, 7, 11, 8, HEAD)          # prong tip curling under
rect(10, 6, 12, 6, HEAD_SH)
rect(14, 2, 18, 6, HEAD)          # head body / eye
rect(14, 6, 18, 6, HEAD_SH)
rect(14, 2, 18, 2, HEAD_HI)
rect(19, 1, 21, 7, HEAD)          # flared striking face
rect(19, 1, 21, 1, HEAD_HI)
rect(19, 6, 21, 7, HEAD_SH)
rect(19, 3, 19, 5, HEAD_SH)       # collar
rect(15, 7, 16, 14, WOOD)         # handle
rect(16, 7, 16, 14, WOOD_DK)
rect(15, 10, 16, 11, WOOD_DK)     # grip band

# ---- toolbox (drawn last so it covers the tool ends) ----
rect(1, 12, 22, 20, BOX)
rect(1, 12, 22, 12, BOX_HI)       # lid rim
rect(1, 19, 22, 20, BOX_SH)       # shadowed base
rect(1, 15, 22, 15, BOX_SH)       # lid seam
rect(10, 13, 13, 17, LATCH)       # latch
rect(10, 17, 13, 17, LATCH_SH)
rect(11, 14, 12, 16, LATCH_SH)
rect(1, 16, 2, 20, BOX_SH)        # corner brackets
rect(21, 16, 22, 20, BOX_SH)

# ================= HARDWARE UNDERNEATH =================
# absolute coords — laid out loose, like they spilled out of the box

# nail, lying flat, point to the right
raw(2, 23, 2, 26, METAL)          # flat head
raw(3, 24, 9, 25, METAL)          # shaft
raw(3, 25, 9, 25, METAL_SH)
raw(10, 24, 10, 24, METAL)        # tip

# screw, lying flat, point to the right
raw(13, 23, 14, 26, METAL)        # round head
raw(13, 24, 14, 25, METAL_SH)     # drive slot
raw(15, 24, 21, 25, METAL)
raw(16, 23, 16, 23, METAL_SH)     # thread ticks
raw(18, 23, 18, 23, METAL_SH)
raw(20, 23, 20, 23, METAL_SH)
raw(15, 26, 15, 26, METAL_SH)
raw(17, 26, 17, 26, METAL_SH)
raw(19, 26, 19, 26, METAL_SH)
raw(22, 24, 22, 24, METAL)        # tip

# hex bolt, brass, lying flat
raw(24, 22, 26, 27, BRASS)        # hex head
raw(23, 23, 23, 26, BRASS)
raw(24, 26, 26, 27, BRASS_SH)
raw(23, 26, 23, 26, BRASS_SH)
raw(27, 24, 30, 25, BRASS)        # threaded shank
raw(27, 25, 30, 25, BRASS_SH)

# hex nut, brass, with a hole through it
raw(4, 28, 8, 30, BRASS)
raw(5, 27, 7, 27, BRASS)
raw(5, 31, 7, 31, BRASS_SH)
raw(4, 30, 8, 30, BRASS_SH)
raw(5, 28, 7, 30, (0, 0, 0, 0))   # punch the hole
raw(5, 28, 7, 28, BRASS_SH)

# second nail, pointing left this time
raw(20, 28, 20, 31, METAL)        # flat head
raw(13, 29, 19, 30, METAL)        # shaft
raw(13, 30, 19, 30, METAL_SH)
raw(12, 29, 12, 29, METAL)        # tip

# ---- 1px black outline around everything (NES look) ----
out = img.copy()
op = out.load()
for y in range(S):
    for x in range(S):
        if px[x, y][3] != 0:
            continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < S and 0 <= ny < S and px[nx, ny][3] != 0:
                op[x, y] = OUTLINE
                break

out.save(os.path.join(OUT, "toolbox.png"))
print("wrote toolbox.png", out.size)
