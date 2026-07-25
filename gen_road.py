"""Generates the Potty Dash tile backdrop: a road in one-point perspective.
Edges start at the bottom corners and converge on a vanishing point at top
center, so the tile reads as "this road goes on forever."
Run: python3 gen_road.py   ->   assets/road.png (60x24, stretched to fill the tile)
"""
from PIL import Image
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
W, H = 60, 24

# Baked-in alpha keeps the road quiet enough to sit behind the tile label.
ASPHALT = (44, 42, 56, 150)
ASPHALT_DK = (32, 30, 42, 150)
EDGE = (238, 238, 244, 205)
DASH = (255, 210, 63, 225)

img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
px = img.load()

VP_L, VP_R = 29, 30          # vanishing point, top center


def put(x, y, c):
    if 0 <= x < W and 0 <= y < H:
        px[x, y] = c


for y in range(H):
    t = y / (H - 1)                      # 0 at the horizon, 1 at the bottom
    left = round(VP_L * (1 - t))
    right = round(VP_R + (W - 1 - VP_R) * t)

    # asphalt, slightly darker toward the horizon so it feels like distance
    fill = ASPHALT_DK if t < 0.35 else ASPHALT
    for x in range(left, right + 1):
        put(x, y, fill)

    # painted edge lines — they get thicker as the road comes toward you
    w = max(1, round(1 + 2.2 * t))
    for i in range(w):
        put(left + i, y, EDGE)
        put(right - i, y, EDGE)

    # center dashes — longer and wider the closer they get
    on = (2 <= y <= 3) or (6 <= y <= 8) or (12 <= y <= 15) or (20 <= y <= 23)
    if on:
        half = round(0.5 + 1.6 * t)
        for x in range(VP_L - half + 1, VP_R + half):
            put(x, y, DASH)

img.save(os.path.join(OUT, "road.png"))
print("wrote road.png", img.size)
