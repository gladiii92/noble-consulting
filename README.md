# NobleConsulting – www.noble-consulting.de

React + Vite + Tailwind CSS v4 + Motion.

## Lokal starten

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Für Cloudflare Pages bauen

```bash
npm run build
# Ausgabe: dist/
```

Cloudflare Pages Einstellungen:
- Framework preset: None
- Build command: `npm run build`
- Build output directory: `dist`

## GitHub → Cloudflare Pages

1. Repo auf GitHub anlegen (public oder private).
2. Alle Dateien pushen.
3. Cloudflare → Workers & Pages → Create → Pages → Connect to Git.
4. Repo auswählen, Build-Einstellungen wie oben, Deploy.

## Domain noble-consulting.de

In Cloudflare Pages → Custom domains → Add domain → noble-consulting.de.
DNS wird automatisch konfiguriert wenn die Domain bei Cloudflare registriert ist.

## Anpassen

- `src/App.tsx` – alle Inhalte, Texte, Bilder, Sektionen
- `src/index.css` – Design-Token (Farben, Fonts, Radien)
- `index.html` – Title, Meta-Description, Font-Links

## Kontaktformular aktivieren

Aktuell simuliert das Formular nur den Submit.
Für echten Empfang: https://formspree.io (kostenlos bis 50 Einreichungen/Monat).
Einfach `action="https://formspree.io/f/DEIN_ID"` im Form-Tag setzen.
