"""Generates the house dog that pads up and down the hallway (replaces the cat).
Two frames: dog_0 (standing) and dog_1 (mid-trot, legs swapped, tail up).
Run: python3 gen_dog.py   ->   assets/dog_0.png, assets/dog_1.png  (24x24)
"""
from PIL import Image
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
S = 24

# Warm tan so he reads as a dog next to the game's cool grey furniture.
BODY = (186, 132, 74, 255)
BODY_SH = (150, 101, 52, 255)
MUZZLE = (226, 196, 150, 255)
EAR = (128, 84, 42, 255)
NOSE = (38, 30, 26, 255)
EYE = (38, 30, 26, 255)
COLLAR = (216, 60, 70, 255)
TAG = (240, 205, 90, 255)


def dog(frame):
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    px = img.load()

    def rect(x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if 0 <= x < S and 0 <= y < S:
                    px[x, y] = c

    # ---- tail: up and wagging on frame 1 ----
    if frame == 0:
        rect(2, 10, 3, 15, BODY)
        rect(3, 9, 4, 10, BODY)
    else:
        rect(3, 8, 4, 13, BODY)
        rect(4, 7, 5, 8, BODY)

    # ---- body ----
    rect(4, 12, 16, 18, BODY)
    rect(4, 17, 16, 18, BODY_SH)      # underside shading
    rect(5, 11, 15, 11, BODY)         # back

    # ---- head, front-right, a touch higher than the back ----
    rect(15, 8, 21, 14, BODY)
    rect(15, 13, 21, 14, BODY_SH)
    # floppy ear
    rect(15, 7, 17, 12, EAR)
    # muzzle + nose
    rect(19, 11, 22, 14, MUZZLE)
    rect(21, 11, 22, 12, NOSE)
    # eye
    rect(18, 10, 18, 10, EYE)

    # ---- collar with a tag ----
    rect(14, 9, 14, 15, COLLAR)
    rect(14, 15, 14, 16, TAG)

    # ---- legs: swapped between frames so he trots ----
    if frame == 0:
        rect(6, 19, 7, 22, BODY_SH)    # back leg forward
        rect(9, 19, 10, 21, BODY_SH)
        rect(14, 19, 15, 22, BODY_SH)  # front leg forward
        rect(17, 19, 18, 21, BODY_SH)
    else:
        rect(6, 19, 7, 21, BODY_SH)
        rect(9, 19, 10, 22, BODY_SH)
        rect(14, 19, 15, 21, BODY_SH)
        rect(17, 19, 18, 22, BODY_SH)

    return img


for i in (0, 1):
    im = dog(i)
    im.save(os.path.join(OUT, f"dog_{i}.png"))
    print("wrote", f"dog_{i}.png", im.size)
