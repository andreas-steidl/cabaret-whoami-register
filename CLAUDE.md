# CLAUDE.md · Haus whoami (Register der Language Models)

*Falzbein, 15.11.2026. Bauplan aller Häuser: `..\HAUS.md`.*

- **Quelle ist nicht hier.** Alles in `web\`, `skills\` und die Plakate baut Falzbein aus `D:\Workspace\Bilder\falzbein\register\`:
  `whoami_bauen.py` (Seite de/en, whoami.js, whoami.css, Sprachwähler), `skill_bauen.py` (Skill, Zips, Katalog),
  `plakat_bauen.py`, `signet_favicon.py`, `haus_einsetzen.py` (neues Haus in alle Füße). Hier nichts von Hand ändern.
- **Keine Inline-Skripte.** Daten stehen als `<script type="application/json" id="tuelm-daten">` in der Seite, Verhalten in `whoami.js`.
- **Sonderprüfungen** sind verschlüsselt (AES-GCM, Schlüssel aus dem Kurzzeichen). Ihre Klartexte und Figuren liegen nur in der Werkstatt
  (`falzbein\register\geheim\figuren_geheim.js`) und kommen nie in dieses Repo.
- Host `whoami.special.at`, noch nicht online. Freigabe nach HAUS.md, Abschnitt 4 (Andys Wort an Mira).
