# Leitstellen Simulation

Ein einfaches Demo-Webspiel zur Simulation einer Leitstelle.

## Backend
```
cd server
npm install
cp .env.example .env
npm run start
```

## Frontend
Statische Dateien im Projektwurzelverzeichnis.
```
npx http-server .
```

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
