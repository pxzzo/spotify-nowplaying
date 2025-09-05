# Leitstellen Simulation

Ein browserbasiertes Singleplayer-Webspiel, das den Alltag einer Leitstelle rudimentär simuliert. Enthält Mission-Generator, automatische Fahrzeugdisposition und Fahrzeugbewegung auf Karte.

## Backend
```bash
npm install --prefix server
cp server/.env.example server/.env
npm start
```

Für die Entwicklung mit automatischem Neustart:
```bash
npm run dev
```

## Tests
```bash
npm test
```

## Frontend
Statische Dateien im Projektwurzelverzeichnis.
```
npx http-server .
```
Nach dem Laden generiert das Spiel zufällige Einsätze. Fahrzeuge werden automatisch mit passenden Fähigkeiten disponiert und bewegen sich zur Einsatzstelle und zurück. Der Spielstand wird im Browser lokal gespeichert.

## .env
Siehe `server/.env.example`.

## JSON-Schema
```json
{
  "stations": [
    {"id":"fw-001","type":"fire","name":"FF Musterstadt","lat":50.83,"lng":12.93}
  ],
  "vehicles": [
    {"id":"fw-hlf1","stationId":"fw-001","org":"fire","kind":"HLF 20","capabilities":["brand","thl"],"speedKmh":85,"lat":50.83,"lng":12.93}
  ]
}
```

## Attribution
Karte und Daten © OpenStreetMap-Mitwirkende (ODbL).
