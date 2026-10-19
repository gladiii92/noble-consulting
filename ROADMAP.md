# Projekt Roadmap

**Ziel:** Ich möchte für meine Webseite maximales SEO betreiben. Kannst du dazu recherchieren was zum heutigen Stand der Technik gehört und was man am effektivsten betreiben sollte? (Blog, GBP oder sonstiges). 
Und dieses sollte komplett automatisiert werden (bitte hierfür ebenfalls den Plan ausgeben wie das auszusehen hat).

## Geplante Phasen

### Phase 1: Architektur-Entscheidung: SEO Framework (SSR/SSG)
- **Zuständige Rolle:** BuilderAgent
- **Betroffene Dateien:** package.json
- **Aufgabenbeschreibung:** Die aktuelle Architektur (Vite SPA) ist für maximales SEO (speziell automatisierte Blog-Artikel und Landingpages) suboptimal, da Suchmaschinen auf Client-Side-Rendering angewiesen sind. Dieser Schritt erfragt die architektonische Richtung für Server-Side Rendering oder Static Site Generation. 
a) Edge-Cases: Keine. 
b) Fehlerklassen: Keine. 
c) requiredSkills: ['architecture', 'seo-strategy'].

### Phase 2: Contract-First: SEO, Blog & GBP Schemas definieren
- **Zuständige Rolle:** DataAgent
- **Betroffene Dateien:** src/types/seo.contracts.ts, src/schemas/seo.schema.ts
- **Aufgabenbeschreibung:** Erstelle strikte Datenverträge und Zod-Schemas für die SEO-Metadaten, automatisierte Blog-Artikel (Markdown Frontmatter) und die Payloads für die Google Business Profile (GBP) API. 
a) Edge-Cases: Fehlende Felder im generierten KI-Content (null/undefined), ungültige ISO-Datumsformate. 
b) Fehlerklassen: ZodError, ValidationError. 
c) requiredSkills: ['typescript', 'zod', 'schema-design'].

### Phase 3: Setup Programmatic SEO & Content Automatisierung
- **Zuständige Rolle:** AutomationAgent
- **Betroffene Dateien:** .github/workflows/seo-autopilot.yml, scripts/seo-content-generator.ts, package.json
- **Aufgabenbeschreibung:** Richte Node-Skripte und einen GitHub Actions Workflow ein. Das System soll wöchentlich via API (z.B. OpenAI) frischen, keyword-optimierten Content und GBP-Updates generieren, ins Repo committen und einen Rebuild auslösen. 
a) Edge-Cases: API-Timeouts bei Textgenerierung, fehlende API-Keys in Secrets, Git-Konflikte bei Auto-Commits. 
b) Fehlerklassen: NetworkError, AuthenticationError, GitCommandError. 
c) requiredSkills: ['github-actions', 'api-integration', 'ci-cd', 'devsecops'].

### Phase 4: Implementierung dynamischer Meta-Tags & JSON-LD
- **Zuständige Rolle:** ContentSeoAgent
- **Betroffene Dateien:** src/App.tsx, index.html, src/components/SEOMetadata.tsx
- **Aufgabenbeschreibung:** Integriere dynamisches Head-Management (z.B. react-helmet-async) zur Steuerung von Meta-Title, Description, OpenGraph-Tags und dynamischem Schema.org JSON-LD (LocalBusiness, Article) für alle Unterseiten. 
a) Edge-Cases: Fehlende Fallback-Bilder für OpenGraph, zu lange Meta-Descriptions, ungültige Zeichenfolgen im JSON-LD. 
b) Fehlerklassen: RenderError, InvalidSchemaError. 
c) requiredSkills: ['seo-technical', 'react-helmet', 'json-ld'].

### Phase 5: UI-Komponenten für SEO-Content (Blog/Artikel)
- **Zuständige Rolle:** UXUIAgent
- **Betroffene Dateien:** src/App.tsx, src/components/ArticleView.tsx, src/components/ContentFeed.tsx, src/index.css
- **Aufgabenbeschreibung:** Entwickle barrierefreie, responsive UI-Komponenten für die Darstellung der automatisiert generierten Artikel. Das Design muss sich nahtlos in src/index.css einfügen. Implementierung von semantischem HTML (article, section). 
a) Edge-Cases: Sehr lange Überschriften im generierten Content, fehlende Bilder (Broken Image Fallbacks), fehlende ARIA-Labels. 
b) Fehlerklassen: ImageLoadError, BoundaryRenderError. 
c) requiredSkills: ['react', 'tailwindcss', 'accessibility', 'ui-ux'].

### Phase 6: Dynamische Sitemap.xml & Robots.txt Generierung
- **Zuständige Rolle:** ContentSeoAgent
- **Betroffene Dateien:** scripts/generate-sitemap.ts, vite.config.ts, package.json
- **Aufgabenbeschreibung:** Erweitere den Build-Prozess um ein Skript, welches automatisch eine sitemap.xml und eine optimierte robots.txt erstellt, basierend auf den vorhandenen Routen und den neuen dynamischen Content-Seiten. 
a) Edge-Cases: Leere Pfade, ungültige Basis-URLs, Schreibzugriffsfehler im dist-Ordner. 
b) Fehlerklassen: FileSystemError (ENOENT/EACCES). 
c) requiredSkills: ['node-scripts', 'seo-technical', 'vite'].

### Phase 7: Projekt-Status aktualisieren
- **Zuständige Rolle:** KnowledgeAgent
- **Betroffene Dateien:** PROJECT_STATUS.md
- **Aufgabenbeschreibung:** Erstelle oder aktualisiere die Datei PROJECT_STATUS.md im Stammverzeichnis. Dokumentiere die getroffenen Architektur-Entscheidungen, die neuen Contract-Schemas und erkläre die Funktionsweise der eingerichteten SEO-Automatisierungs-Pipeline (Blog & GBP). 
a) Edge-Cases: Datei existiert noch nicht im Stammverzeichnis. 
b) Fehlerklassen: WriteFileError. 
c) requiredSkills: ['documentation', 'markdown'].
