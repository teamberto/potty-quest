"""Generates NES/Game Boy style pixel-art sprites for Potty Champ.
Run: python3 gen_sprites.py
Outputs 24x24 (or tile-multiple) PNGs into assets/.
"""
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), "assets")
os.makedirs(OUT, exist_ok=True)

T = 24  # base tile size

def new_canvas(w=T, h=T):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))

def save(img, name):
    img.save(os.path.join(OUT, f"{name}.png"))
    print("wrote", name, img.size)

# ---------- palette ----------
OUTLINE = (26, 20, 16, 255)
SKIN = (198, 145, 100, 255)      # light mocha brown
SKIN_SH = (164, 112, 72, 255)

HAIR_BROWN = (91, 63, 33, 255)
HAIR_BLONDE = (232, 193, 90, 255)
HAIR_MOM = (58, 35, 23, 255)

SHIRT_BLUE = (43, 110, 242, 255)
SHIRT_BLUE_SH = (28, 75, 176, 255)
SHIRT_YELLOW = (255, 210, 63, 255)
SHIRT_YELLOW_SH = (201, 149, 10, 255)
PANTS_NAVY = (35, 49, 74, 255)
PANTS_NAVY_SH = (24, 35, 55, 255)
DIAPER = (255, 255, 255, 255)
DIAPER_SH = (216, 216, 216, 255)
SHOE = (60, 45, 40, 255)

MOM_SHIRT = (232, 143, 176, 255)
MOM_SHIRT_SH = (196, 104, 138, 255)
NAIL_POLISH = (216, 40, 90, 255)

WOOD = (201, 138, 75, 255)
WOOD_DK = (179, 118, 58, 255)
WALL = (231, 217, 184, 255)
WALL_DK = (203, 185, 143, 255)

COUCH = (181, 68, 61, 255)
COUCH_DK = (138, 50, 44, 255)
COUCH_CUSHION = (201, 92, 84, 255)

OVEN_BODY = (58, 58, 58, 255)
OVEN_DOOR = (30, 30, 30, 255)
OVEN_WINDOW = (255, 176, 90, 255)
OVEN_SILVER = (170, 170, 170, 255)

CAKE_CHOC = (107, 63, 33, 255)
CAKE_FROST = (255, 255, 255, 255)
CAKE_CHERRY = (209, 57, 74, 255)

POTTY_WHITE = (255, 255, 255, 255)
POTTY_PINK = (255, 143, 179, 255)
POTTY_BLUE = (111, 179, 255, 255)
POTTY_SH = (214, 214, 214, 255)

PEE_YELLOW = (255, 224, 102, 255)
PEE_YELLOW_DK = (224, 186, 40, 255)
POOP_BROWN = (138, 90, 43, 255)
POOP_BROWN_DK = (107, 68, 32, 255)

TABLE = (138, 90, 43, 255)
TABLE_DK = (110, 70, 32, 255)
TV_BODY = (26, 26, 26, 255)
TV_SCREEN = (88, 196, 220, 255)
RUG = (63, 166, 160, 255)
RUG_DK = (46, 130, 125, 255)

HEART = (224, 44, 74, 255)
HEART_SH = (176, 24, 50, 255)
STAR = (255, 210, 63, 255)
STAR_SH = (201, 149, 10, 255)


def rect(draw, x0, y0, x1, y1, color):
    draw.rectangle([x0, y0, x1, y1], fill=color)


def outline_rect(draw, x0, y0, x1, y1, fill, outline=OUTLINE):
    draw.rectangle([x0, y0, x1, y1], fill=fill, outline=outline)


# ---------- characters ----------
def draw_kid(skin, hair, hair_color, shirt, shirt_sh, lower, lower_sh, size,
             direction, frame, has_diaper=False):
    img = new_canvas()
    d = ImageDraw.Draw(img)
    cx = T // 2
    head_r = size["head_r"]
    head_top = size["head_top"]
    body_top = head_top + head_r * 2 - 2
    body_bot = body_top + size["body_h"]
    leg_bot = body_bot + size["leg_h"]

    # legs (walk animation: shift leg pairs)
    leg_w = size["leg_w"]
    gap = size["leg_gap"]
    shift = 1 if frame == 1 else 0
    lx1 = cx - gap - leg_w
    lx2 = cx + gap
    rect(d, lx1, body_bot, lx1 + leg_w - 1, leg_bot + (shift), lower_sh if not has_diaper else DIAPER_SH)
    rect(d, lx2, body_bot, lx2 + leg_w - 1, leg_bot - (shift), lower if not has_diaper else DIAPER)
    # shoes
    if not has_diaper:
        rect(d, lx1, leg_bot - 2 + shift, lx1 + leg_w - 1, leg_bot + shift, SHOE)
        rect(d, lx2, leg_bot - 2 - shift, lx2 + leg_w - 1, leg_bot - shift, SHOE)

    # body / shirt
    body_w = size["body_w"]
    bx1 = cx - body_w // 2
    bx2 = cx + body_w // 2
    rect(d, bx1, body_top, bx2, body_bot, shirt)
    rect(d, bx1, body_bot - 2, bx2, body_bot, shirt_sh)
    # arms as small side nubs
    rect(d, bx1 - 2, body_top + 2, bx1 - 1, body_top + size["body_h"] - 2, skin if direction != "side" else shirt)
    rect(d, bx2 + 1, body_top + 2, bx2 + 2, body_top + size["body_h"] - 2, skin if direction != "side" else shirt)

    # head
    hx1 = cx - head_r
    hx2 = cx + head_r
    hy1 = head_top
    hy2 = head_top + head_r * 2
    d.ellipse([hx1, hy1, hx2, hy2], fill=skin)

    # hair
    if hair == "short":
        d.ellipse([hx1 - 1, hy1 - 2, hx2 + 1, hy1 + head_r], fill=hair_color)
        if direction == "down":
            rect(d, hx1 - 1, hy1 + 1, hx1 + 1, hy1 + 3, hair_color)
            rect(d, hx2 - 1, hy1 + 1, hx2 + 1, hy1 + 3, hair_color)
    elif hair == "tuft":
        d.ellipse([cx - 3, hy1 - 3, cx + 3, hy1 + 2], fill=hair_color)

    # face (eyes) depend on direction
    eye_y = hy1 + head_r
    if direction == "down":
        d.point([(cx - 2, eye_y), (cx + 2, eye_y)], fill=OUTLINE)
    elif direction == "up":
        pass  # back of head, no face
    elif direction == "side":
        fx = cx + head_r - 2 if frame != -1 else cx - head_r + 2
        d.point([(fx, eye_y)], fill=OUTLINE)

    return img


BIG_SIZE = {"head_r": 5, "head_top": 2, "body_h": 6, "body_w": 8,
            "leg_h": 5, "leg_w": 3, "leg_gap": 1}
LITTLE_SIZE = {"head_r": 6, "head_top": 3, "body_h": 4, "body_w": 8,
               "leg_h": 3, "leg_w": 3, "leg_gap": 1}

for direction in ["down", "up", "side"]:
    for frame in [0, 1]:
        img = draw_kid(SKIN, "short", HAIR_BROWN, SHIRT_BLUE, SHIRT_BLUE_SH,
                        PANTS_NAVY, PANTS_NAVY_SH, BIG_SIZE, direction, frame)
        save(img, f"big_{direction}_{frame}")

        img2 = draw_kid(SKIN, "tuft", HAIR_BLONDE, SHIRT_YELLOW, SHIRT_YELLOW_SH,
                         None, None, LITTLE_SIZE, direction, frame, has_diaper=True)
        save(img2, f"little_{direction}_{frame}")

# little brother "urgent" wobble frame (same as frame1 but reused for alert animation)

# ---------- nail salon scene: mom (profile, facing right) does client's nails ----------
CLIENT_SHIRT = (63, 166, 160, 255)
CLIENT_SHIRT_SH = (46, 130, 125, 255)
CLIENT_HAIR = (30, 24, 20, 255)

def draw_mom(arm_up=False):
    """Mom in profile, facing right, arm reaching over the table."""
    img = new_canvas()
    d = ImageDraw.Draw(img)
    cx = 9
    # torso
    rect(d, cx - 5, 12, cx + 4, 21, MOM_SHIRT)
    rect(d, cx - 5, 18, cx + 4, 21, MOM_SHIRT_SH)
    # head (profile)
    d.ellipse([cx - 5, 3, cx + 5, 13], fill=SKIN)
    # hair swept back to the left
    d.ellipse([cx - 7, 1, cx + 4, 9], fill=HAIR_MOM)
    rect(d, cx - 7, 5, cx - 4, 17, HAIR_MOM)
    # profile eye on the right side of the face
    d.point([(cx + 3, 8)], fill=OUTLINE)
    # arm reaching right, holding a nail file
    ay = 13 if arm_up else 14
    rect(d, cx + 3, ay, cx + 12, ay + 2, SKIN)
    rect(d, cx + 11, ay - 1, cx + 13, ay + 1, (150, 150, 160, 255))  # file
    return img

save(draw_mom(False), "mom")
save(draw_mom(True), "mom_alt")


def draw_client():
    """Client in profile, facing left, hand out for her manicure."""
    img = new_canvas()
    d = ImageDraw.Draw(img)
    cx = 15
    # torso
    rect(d, cx - 4, 12, cx + 5, 21, CLIENT_SHIRT)
    rect(d, cx - 4, 18, cx + 5, 21, CLIENT_SHIRT_SH)
    # head (profile)
    d.ellipse([cx - 5, 3, cx + 5, 13], fill=SKIN)
    # curly hair swept back to the right
    d.ellipse([cx - 4, 0, cx + 7, 9], fill=CLIENT_HAIR)
    rect(d, cx + 4, 5, cx + 7, 17, CLIENT_HAIR)
    d.ellipse([cx + 3, 12, cx + 8, 17], fill=CLIENT_HAIR)
    # profile eye on the left side of the face
    d.point([(cx - 3, 8)], fill=OUTLINE)
    # arm reaching left, fingers with polish
    rect(d, cx - 12, 14, cx - 3, 16, SKIN)
    d.point([(cx - 12, 14), (cx - 11, 14), (cx - 10, 14)], fill=NAIL_POLISH)
    return img

save(draw_client(), "client")


def nail_table_tile():
    """Small manicure table seen from the side (rotated 90), polish on top."""
    img = new_canvas()
    d = ImageDraw.Draw(img)
    # table top
    rect(d, 1, 12, T - 2, 15, TABLE)
    rect(d, 1, 15, T - 2, 16, TABLE_DK)
    # legs
    rect(d, 3, 16, 5, T - 2, TABLE_DK)
    rect(d, T - 6, 16, T - 4, T - 2, TABLE_DK)
    # polish bottles on top
    rect(d, 6, 8, 8, 11, NAIL_POLISH)
    rect(d, 6, 7, 8, 8, OUTLINE)
    rect(d, 10, 9, 12, 11, (111, 179, 255, 255))
    rect(d, 10, 8, 12, 9, OUTLINE)
    # towel
    rect(d, 15, 10, 20, 11, (255, 255, 255, 255))
    return img

save(nail_table_tile(), "nail_table")

# ---------- floor / wall tiles ----------
def floor_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 0, 0, T - 1, T - 1, WOOD)
    for i in range(0, T, 6):
        d.line([(0, i), (T, i)], fill=WOOD_DK)
    return img
save(floor_tile(), "floor_wood")

def rug_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 0, 0, T - 1, T - 1, RUG)
    outline_rect(d, 2, 2, T - 3, T - 3, None, outline=RUG_DK)
    return img
save(rug_tile(), "rug")

def wall_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 0, 0, T - 1, T - 1, WALL)
    rect(d, 0, T - 4, T - 1, T - 1, WALL_DK)
    return img
save(wall_tile(), "wall")

def door_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 0, 0, T - 1, T - 1, (0, 0, 0, 0))
    rect(d, 2, 0, T - 3, T - 1, (120, 84, 48, 255))
    rect(d, 2, 0, T - 3, 2, (90, 60, 30, 255))
    return img
save(door_tile(), "door")

# ---------- furniture ----------
def couch_tile(w=2):
    img = new_canvas(T * w, T)
    d = ImageDraw.Draw(img)
    rect(d, 0, 4, T * w - 1, T - 1, COUCH)
    rect(d, 0, 4, T * w - 1, 9, COUCH_DK)
    for i in range(w):
        rect(d, i * T + 4, 10, i * T + T - 5, T - 4, COUCH_CUSHION)
    return img
save(couch_tile(3), "couch")

def oven_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 0, 0, T - 1, T - 1, OVEN_BODY)
    rect(d, 3, 3, T - 4, T - 4, OVEN_DOOR)
    rect(d, 5, 6, T - 6, T - 8, OVEN_WINDOW)
    rect(d, 2, T - 4, T - 3, T - 3, OVEN_SILVER)
    return img
save(oven_tile(), "oven")

def oven_with_cake_tile():
    img = oven_tile()
    d = ImageDraw.Draw(img)
    rect(d, 8, 12, 15, 16, CAKE_CHOC)
    rect(d, 8, 11, 15, 12, CAKE_FROST)
    d.point([(11, 10)], fill=CAKE_CHERRY)
    return img
save(oven_with_cake_tile(), "oven_cake")

def table_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 1, 4, T - 2, 8, TABLE)
    rect(d, 1, 8, T - 2, 9, TABLE_DK)
    rect(d, 2, 9, 4, T - 1, TABLE_DK)
    rect(d, T - 5, 9, T - 3, T - 1, TABLE_DK)
    return img
save(table_tile(), "table")

def tv_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 1, 3, T - 2, T - 8, TV_BODY)
    rect(d, 3, 5, T - 4, T - 10, TV_SCREEN)
    rect(d, 6, T - 7, T - 7, T - 5, TV_BODY)
    return img
save(tv_tile(), "tv")

def potty_tile(color):
    """Toilet with tank, seat ring, and a visible bowl opening."""
    img = new_canvas()
    d = ImageDraw.Draw(img)
    # tank
    rect(d, 6, 1, 17, 7, POTTY_WHITE)
    rect(d, 6, 6, 17, 7, POTTY_SH)
    rect(d, 8, 3, 11, 4, (170, 170, 170, 255))   # flush button
    rect(d, 6, 1, 17, 1, color)                  # colored tank lid trim
    # pedestal base
    rect(d, 9, 17, 14, 21, POTTY_WHITE)
    rect(d, 8, 21, 15, 22, POTTY_SH)
    # seat ring
    d.ellipse([3, 7, 20, 19], fill=POTTY_WHITE, outline=POTTY_SH)
    d.ellipse([5, 9, 18, 17], fill=color)        # colored toddler seat
    # the hole! (water inside)
    d.ellipse([7, 10, 16, 16], fill=(52, 84, 120, 255))
    d.ellipse([9, 11, 13, 14], fill=(111, 179, 255, 255))
    d.point([(10, 12)], fill=(220, 240, 255, 255))
    return img
save(potty_tile(POTTY_BLUE), "potty")

def mop_tile():
    """Mop leaning in its bucket."""
    img = new_canvas()
    d = ImageDraw.Draw(img)
    # handle (diagonal)
    d.line([(17, 1), (10, 14)], fill=WOOD_DK, width=2)
    d.point([(17, 1), (18, 1)], fill=(200, 60, 60, 255))  # handle cap
    # mop head strands
    for i, x in enumerate(range(6, 15, 2)):
        d.line([(10, 13), (x, 19 + (i % 2))], fill=(225, 225, 225, 255), width=1)
    d.ellipse([7, 11, 13, 15], fill=(240, 240, 240, 255))
    # bucket
    rect(d, 4, 16, 16, 22, (200, 60, 60, 255))
    rect(d, 4, 16, 16, 17, (150, 40, 40, 255))
    rect(d, 6, 18, 14, 19, (111, 179, 255, 255))  # water line
    return img
save(mop_tile(), "mop")

# ---------- alerts / icons ----------
def teardrop(d, cx, top_y, half_w, bottom_y, fill):
    # triangle point at top tapering into a rounded bottom
    d.polygon([(cx, top_y), (cx + half_w, bottom_y - half_w),
               (cx - half_w, bottom_y - half_w)], fill=fill)
    d.ellipse([cx - half_w, bottom_y - half_w * 2, cx + half_w, bottom_y], fill=fill)

def pee_icon():
    img = new_canvas(16, 16)
    d = ImageDraw.Draw(img)
    teardrop(d, 8, 1, 6, 15, PEE_YELLOW_DK)   # outline layer (larger)
    teardrop(d, 8, 2, 5, 14, PEE_YELLOW)      # fill layer (inset)
    d.point([(6, 9), (6, 10)], fill=(255, 255, 255, 200))
    return img
save(pee_icon(), "icon_pee")

def poop_icon():
    img = new_canvas(16, 16)
    d = ImageDraw.Draw(img)
    d.ellipse([4, 9, 12, 14], fill=POOP_BROWN, outline=POOP_BROWN_DK)
    d.ellipse([5, 5, 11, 10], fill=POOP_BROWN, outline=POOP_BROWN_DK)
    d.ellipse([6, 2, 10, 6], fill=POOP_BROWN, outline=POOP_BROWN_DK)
    d.point([(7, 8), (9, 8)], fill=OUTLINE)
    return img
save(poop_icon(), "icon_poop")

def heart_icon(full=True):
    img = new_canvas(16, 16)
    d = ImageDraw.Draw(img)
    c = HEART if full else (90, 90, 90, 255)
    csh = HEART_SH if full else (60, 60, 60, 255)
    d.ellipse([1, 2, 8, 9], fill=c)
    d.ellipse([7, 2, 14, 9], fill=c)
    d.polygon([(1, 6), (14, 6), (7, 15)], fill=c)
    rect(d, 1, 9, 14, 11, csh)
    return img
save(heart_icon(True), "heart_full")
save(heart_icon(False), "heart_empty")

def star_icon():
    img = new_canvas(16, 16)
    d = ImageDraw.Draw(img)
    d.polygon([(8, 0), (10, 6), (16, 6), (11, 10), (13, 16), (8, 12),
               (3, 16), (5, 10), (0, 6), (6, 6)], fill=STAR, outline=STAR_SH)
    return img
save(star_icon(), "icon_star")

# ---------- floor stains ----------
def pee_stain():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    d.ellipse([2, 6, T - 3, T - 3], fill=(255, 224, 102, 160))
    d.ellipse([5, 9, T - 6, T - 6], fill=(255, 224, 102, 220))
    return img
save(pee_stain(), "stain_pee")

def poop_stain():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    d.ellipse([6, 13, T - 6, T - 5], fill=POOP_BROWN_DK)
    d.ellipse([7, 9, T - 8, 15], fill=POOP_BROWN)
    d.ellipse([8, 6, T - 9, 11], fill=POOP_BROWN)
    return img
save(poop_stain(), "stain_poop")

# ---------- cake (ending) ----------
def cake_whole():
    img = new_canvas(32, 32)
    d = ImageDraw.Draw(img)
    rect(d, 4, 18, 27, 28, CAKE_CHOC)
    rect(d, 4, 16, 27, 19, CAKE_FROST)
    rect(d, 4, 10, 27, 16, CAKE_CHOC)
    rect(d, 4, 8, 27, 11, CAKE_FROST)
    for x in range(6, 27, 6):
        d.ellipse([x, 4, x + 5, 9], fill=CAKE_CHERRY)
    return img
save(cake_whole(), "cake_whole")

def crib_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 2, 3, T - 3, 10, POTTY_WHITE)
    for x in range(2, T - 2, 3):
        rect(d, x, 3, x + 1, 10, (210, 210, 220, 255))
    rect(d, 1, 10, T - 2, 14, (232, 193, 90, 255))
    rect(d, 2, 14, 4, T - 2, WOOD_DK)
    rect(d, T - 5, 14, T - 3, T - 2, WOOD_DK)
    return img
save(crib_tile(), "crib")

def toybox_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 2, 9, T - 3, T - 3, (111, 179, 255, 255))
    rect(d, 2, 6, T - 3, 9, (255, 143, 179, 255))
    d.ellipse([6, 12, 10, 16], fill=STAR)
    d.ellipse([13, 14, 17, 18], fill=(107, 216, 120, 255))
    return img
save(toybox_tile(), "toybox")

def laundry_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    d.ellipse([2, 7, T - 3, T - 2], fill=(224, 224, 224, 255))
    d.ellipse([4, 3, 10, 9], fill=SHIRT_BLUE)
    d.ellipse([10, 2, 16, 8], fill=MOM_SHIRT)
    d.ellipse([14, 5, 20, 11], fill=PEE_YELLOW)
    return img
save(laundry_tile(), "laundry")

def cookie_icon():
    img = new_canvas(16, 16)
    d = ImageDraw.Draw(img)
    d.ellipse([1, 1, 14, 14], fill=(222, 168, 92, 255), outline=(170, 118, 52, 255))
    for (x, y) in [(4, 5), (9, 4), (6, 9), (10, 10), (4, 11)]:
        rect(d, x, y, x + 1, y + 1, CAKE_CHOC)
    return img
save(cookie_icon(), "cookie")

def turbo_shoe_icon():
    img = new_canvas(16, 16)
    d = ImageDraw.Draw(img)
    # sneaker, toe pointing right
    rect(d, 1, 7, 8, 12, (43, 110, 242, 255))       # upper
    rect(d, 7, 9, 13, 12, (43, 110, 242, 255))      # toe box
    rect(d, 1, 12, 13, 13, (255, 255, 255, 255))    # sole
    rect(d, 1, 14, 13, 14, (190, 190, 190, 255))    # sole shadow
    rect(d, 2, 8, 5, 8, (255, 255, 255, 255))       # lace
    rect(d, 3, 10, 6, 10, (255, 255, 255, 255))     # lace
    # lightning bolt (outlined for contrast)
    bolt = [(11, 0), (7, 5), (9, 5), (5, 10), (12, 4), (10, 4), (13, 0)]
    d.polygon([(x, y + 1) for (x, y) in bolt], fill=(150, 100, 10, 255))
    d.polygon(bolt, fill=(255, 210, 63, 255))
    return img
save(turbo_shoe_icon(), "turbo_shoe")

def plant_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 7, 15, 16, 21, (184, 98, 62, 255))
    rect(d, 6, 14, 17, 16, (150, 76, 46, 255))
    d.ellipse([4, 4, 12, 12], fill=(58, 150, 70, 255))
    d.ellipse([10, 2, 18, 10], fill=(74, 176, 87, 255))
    d.ellipse([7, 7, 15, 15], fill=(46, 128, 60, 255))
    return img
save(plant_tile(), "plant")

def bookshelf_tile():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, 1, 1, T - 2, T - 2, WOOD_DK)
    rect(d, 3, 3, T - 4, 9, (60, 40, 25, 255))
    rect(d, 3, 12, T - 4, 18, (60, 40, 25, 255))
    for x, c in [(4, SHIRT_BLUE), (7, COUCH), (10, STAR), (13, RUG), (16, MOM_SHIRT)]:
        rect(d, x, 4, x + 2, 9, c)
        rect(d, x, 13, x + 2, 18, c)
    return img
save(bookshelf_tile(), "bookshelf")

print("done")
