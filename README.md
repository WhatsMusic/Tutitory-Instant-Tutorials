# Projektname: Dynamische Tutorial-Plattform

## Projektbeschreibung
Dieses Projekt ist eine **dynamische Tutorial-Plattform**, die auf **Next.js** basiert und die API-Integration von **Hugging Face** verwendet, um benutzerdefinierte Inhalte zu generieren. Ziel ist es, interaktive und personalisierte Tutorials für verschiedene Themen zu erstellen.

## Hauptfunktionen
- **Benutzerdefinierte Tutorial-Generierung**: Der Benutzer gibt ein Thema ein, und das System generiert automatisch ein strukturiertes Tutorial, einschließlich spezifischer Kapitel und Inhalte.
- **Streaming-Inhalte**: Inhalte werden dynamisch gestreamt und angezeigt, um eine flüssige Benutzererfahrung zu gewährleisten.
- **Kapitelbasierte Navigation**: Jedes Tutorial ist in Kapitel unterteilt, die einzeln geladen und angezeigt werden können.
- **Integration von KI-Modellen**: Verwendet die Hugging Face API, um hochwertige, AI-generierte Texte zu erstellen.

## Technologie-Stack
- **Frontend**: Next.js, React, React Markdown
- **Backend**: API-Routen in Next.js, integriert mit Hugging Face Inference API
- **Styling**: Tailwind CSS
- **Deployment**: Optimiert für Vercel

## So funktioniert es
1. Der Benutzer gibt ein Thema in das Eingabefeld ein.
2. Das System generiert dynamisch ein Tutorial mit spezifischen Kapiteln.
3. Der Benutzer kann Kapitel einzeln laden und Inhalte ansehen.
4. Streaming-Inhalte sorgen für nahtlose Benutzerinteraktionen.

## Einsatzmöglichkeiten
- **Bildung**: Interaktive Lernressourcen für Schüler und Lehrer.
- **Marketing**: Automatisierte Inhalte für Workshops oder Kundenpräsentationen.
- **Unternehmen**: Schulungsmaterialien oder Produktdokumentationen.

## Entwicklung und Betrieb
### Voraussetzungen
- Node.js (>= 16.x)
- Hugging Face API-Schlüssel

### Installation
1. Repository klonen:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
3. `.env` Datei erstellen und die Umgebungsvariablen konfigurieren:
   ```env
   HUGGINGFACE_API_KEY=dein_api_schlüssel
   ```
4. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

### Deployment
Dieses Projekt ist optimiert für die Bereitstellung auf Vercel:
- Pushen Sie den Code auf ein mit Vercel verknüpftes Repository.
- Konfigurieren Sie die Umgebungsvariablen im Vercel-Dashboard.
- Deployment wird automatisch durchgeführt.

## Lizenz
Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).

## Mitwirkende
- **Projektleitung**: [Dein Name]
- **Entwicklungsteam**: [Teammitglieder]

---
Vielen Dank für Ihr Interesse an unserem Projekt! Feedback und Beiträge sind willkommen.
