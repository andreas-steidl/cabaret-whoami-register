# -*- coding: utf-8 -*-
"""Banner fuer das README des Repos cabaret-whoami-register, nach dem Muster von kundschaft/doku/readme_banner.py
(und readme_bauen.py, BANNER_SPIELZEIT): links Titel und Unterzeile, rechts das Plakat schraeg und das runde Signet.
Farben aus whoami.css: hell Normpapier mit Millimeterraster, dunkel Blaupause; eine Schrift, IBM Plex Mono.
Je Sprache hell und dunkel, 1280 x 400 bei Faktor 2, mit Edge fotografiert (plakat/foto.ps1).
Agent fuer Falzbein, 18.11.2026.

Ausgabe: .github/readme/banner-<de|en>-<hell|dunkel>.png      Aufruf: python readme_banner.py
"""
import html
import os
import shutil
import subprocess
import tempfile

from PIL import Image

HIER = os.path.dirname(os.path.abspath(__file__))
HAUS = os.path.dirname(HIER)
WEB = os.path.join(HAUS, "web")
ZIEL = os.path.join(HAUS, ".github", "readme")

SEITE = """<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="schriften.css">
<style>
 html,body{margin:0;width:1280px;height:400px;overflow:hidden}
 body{background-color:%(bg)s;color:%(text)s;font-family:'IBM Plex Mono',monospace;position:relative;
  background-image:linear-gradient(%(raster2)s 1px,transparent 1px),linear-gradient(90deg,%(raster2)s 1px,transparent 1px),
   linear-gradient(%(raster)s 1px,transparent 1px),linear-gradient(90deg,%(raster)s 1px,transparent 1px);
  background-size:40px 40px,40px 40px,8px 8px,8px 8px}
 .leiste{position:absolute;left:0;right:0;bottom:0;height:10px;background:repeating-linear-gradient(90deg,%(stempel)s 0 14px,transparent 14px 22px);opacity:.7}
 .links{position:absolute;left:84px;top:62px;width:720px}
 .kicker{font-weight:500;letter-spacing:.2em;text-transform:uppercase;font-size:15px;color:%(stempel)s}
 h1{font-weight:700;font-size:%(gross)spx;line-height:1.05;margin:18px 0 16px;letter-spacing:-.01em}
 .unter{font-size:22px;opacity:.85}
 .host{margin-top:24px;font-size:16px;letter-spacing:.12em;color:%(blau)s}
 .plakat{position:absolute;right:110px;top:30px;width:236px;transform:rotate(3deg);box-shadow:7px 7px 0 %(schatten)s;border:1.5px solid %(text)s}
 .signet{position:absolute;right:300px;top:236px;width:130px;transform:rotate(-9deg);filter:drop-shadow(0 8px 14px rgba(0,0,0,.35))}
</style></head><body>
<div class="links"><div class="kicker">%(kicker)s</div><h1>%(titel)s</h1><div class="unter">%(unter)s</div><div class="host">whoami.special.at</div></div>
<img class="plakat" src="%(plakat)s"><img class="signet" src="signet.svg">
<div class="leiste"></div></body></html>"""

TEXT = {"de": dict(kicker="Kleinkunstbühne Zwischenraum · TÜ-LM 1", titel="Register der Language Models",
                   unter="Wer bin ich? Ein Prüfstand mit Orden für Language Models.", plakat="plakat-web.jpg"),
        "en": dict(kicker="Zwischenraum cabaret stage · TÜ-LM 1", titel="Register of Language Models",
                   unter="Who am I? A test bench with medals for language models.", plakat="plakat-web-en.jpg")}
FARBE = {"dunkel": dict(bg="#0E2440", text="#E6EEF7", stempel="#FF8466", blau="#8DBBF0", schatten="#04101F",
                        raster="rgba(230,238,247,.045)", raster2="rgba(230,238,247,.09)"),
         "hell": dict(bg="#F3EEE2", text="#1E2836", stempel="#C8432E", blau="#2F6DB5", schatten="#1E2836",
                      raster="rgba(47,109,181,.06)", raster2="rgba(47,109,181,.12)")}


def main():
    tmp = tempfile.mkdtemp(prefix="register_banner_")
    for f in os.listdir(os.path.join(WEB, "fonts")):
        shutil.copyfile(os.path.join(WEB, "fonts", f), os.path.join(tmp, f))
    for f in ("plakat-web.jpg", "plakat-web-en.jpg"):
        shutil.copyfile(os.path.join(WEB, f), os.path.join(tmp, f))
    shutil.copyfile(os.path.join(WEB, "signets", "signet-whoami-rund.svg"), os.path.join(tmp, "signet.svg"))
    os.makedirs(ZIEL, exist_ok=True)
    for sp, t in TEXT.items():
        for art, farbe in FARBE.items():
            h = os.path.join(tmp, "b-%s-%s.html" % (sp, art))
            with open(h, "w", encoding="utf-8") as f:
                f.write(SEITE % dict(farbe, kicker=html.escape(t["kicker"]), titel=html.escape(t["titel"]),
                                     unter=html.escape(t["unter"]), plakat=t["plakat"], gross=60))
            png = os.path.join(tmp, "b-%s-%s.png" % (sp, art))
            subprocess.run(["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", os.path.join(HAUS, "plakat", "foto.ps1"),
                            "-Html", h, "-Png", png, "-Breite", "1280", "-Hoehe", "400", "-Hell", "-Faktor", "2"], check=True, capture_output=True)
            im = Image.open(png).convert("RGB")
            assert im.size == (2560, 800), im.size
            im.save(os.path.join(ZIEL, "banner-%s-%s.png" % (sp, art)), optimize=True)
            print("banner", sp, art)
    return tmp


if __name__ == "__main__":
    print(main())
