# Myducom Beta MVP (HeroUI + shadcn/ui style)

Mandantenfähiger MVP-Prototyp für Vertragsverwaltung, IT-Management und Kostenkontrolle.

## UI Stack

- **HeroUI** für produktive Komponenten: Tabs, Tables, Cards, Selects, Inputs, Chips
- **shadcn/ui style** als lokale Primitives (`src/components/ui`) für Buttons, Card-Container und Formfelder
- Kombination aus beiden für eine klare, minimalistische UX

## Features (MVP)

- Rollen: `CUSTOMER`, `STAFF`, `ADMIN`
- Tenant-Isolation im Frontend-Scope (Demo)
- Tabs: Dashboard, Mitarbeiter, Verträge, Tickets, Admin
- Dashboard mit Monats-Kacheln, Jahresverlauf, Vertragsstatus und Geräteübersicht
- Mitarbeiter-Detail mit Vertrags- und Gerätetabellen (feste Spaltenreihenfolge)
- Vertrags-Zuordnungsübersicht auf Mitarbeiter-Ebene
- Tickets: Erfassung + Workflow-Visualisierung + Zuständigkeit
- Globale Suche über Mitarbeiter, Geräte, SIMs, Verträge

## Start

```bash
npm install
npm run dev
```

> Hinweis: Diese Umgebung kann ggf. npm-Registry-Zugriff einschränken (403).
