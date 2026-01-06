# Claude Dokumentation - 05.01.2026

## Zusammenfassung der Änderungen

### Health Integration UI-Positionierung

Die Health-Integration (Apple Health & Google Health Connect) wurde an folgenden Stellen in der App positioniert:

| Ort | Funktion |
|-----|----------|
| **HomeScreen** | HealthTile Widget mit Activity Rings |
| **ProgressScreen** | Zentrale Ansicht für alle Sportler-Daten |
| **MoreScreen** | Einstiegspunkt via "Health Data" Menu |
| **HealthSettingsScreen** | Permissions & Konfiguration |

---

## Neue Komponenten

### 1. HealthTile (`src/components/tiles/HealthTile.tsx`)

Widget für den HomeScreen mit:
- 3 Activity Rings (Apple Fitness Style)
  - Rot: Schritte
  - Grün: Kalorien
  - Blau: Aktive Minuten
- Kompakte Stats-Anzeige
- Navigiert bei Klick zum Progress-Tab

### 2. Progress-Komponenten (`src/components/progress/`)

| Komponente | Beschreibung |
|------------|--------------|
| `ActivityRings.tsx` | Große Activity Rings mit Gradient-Support und Labels |
| `WeeklyChart.tsx` | Wöchentliche Balkendiagramme mit Durchschnitts-Linie |
| `MetricCard.tsx` | Kompakte Statistik-Karten mit optionaler Trend-Anzeige |
| `SectionHeader.tsx` | Einheitliche Überschriften mit optionalem Action-Button |
| `PersonalRecordCard.tsx` | Persönliche Rekorde mit Verbesserungs-Badge |

---

## ProgressScreen Redesign

Der ProgressScreen wurde komplett überarbeitet im Apple Fitness/Health Style:

### Struktur (von oben nach unten)

1. **Header** - Titel "Fortschritt" mit Untertitel
2. **Time Range Selector** - Woche/Monat/Jahr Toggle
3. **Activity Rings** (wenn Health aktiviert)
   - Bewegen (Schritte)
   - Trainieren (Kalorien)
   - Stehen (Aktive Minuten)
4. **Statistik-Grid** (2x2)
   - Gesamt Workouts
   - Aktuelle Streak
   - Gesamtvolumen
   - Bester Streak
5. **Wöchentliche Charts**
   - Workout-Dauer
   - Schritte (wenn Health aktiviert)
6. **Herzfrequenz-Karte** (wenn Health aktiviert)
7. **Persönliche Rekorde**
8. **Körperdaten** (Gewicht, Körperfett, Muskelmasse)
9. **Health Connect Prompt** (wenn nicht verbunden)

### Design-Prinzipien

- Helles Farbschema passend zum Rest der App
- Weiße Karten auf grauem Hintergrund (`COLORS.gray[100]`)
- Apple Fitness-inspirierte Activity Rings mit Farben:
  - `#FF2D55` (Rot/Move)
  - `#30D158` (Grün/Exercise)
  - `#007AFF` (Blau/Stand)

---

## HomeScreen Integration

Neues Health Widget zwischen Row 1 und Row 2:

```
[Workout] [Streak] [Weekly Goal]
[    Health Widget (2x1)    ] [This Month]  <-- NEU
[Volume] [Total Workouts] [This Month]
...
```

Das Widget zeigt sich nur wenn Health aktiviert ist (`isHealthEnabled`).

---

## Geänderte Dateien

### Neue Dateien
- `src/components/tiles/HealthTile.tsx`
- `src/components/progress/ActivityRings.tsx`
- `src/components/progress/WeeklyChart.tsx`
- `src/components/progress/MetricCard.tsx`
- `src/components/progress/SectionHeader.tsx`
- `src/components/progress/PersonalRecordCard.tsx`
- `src/components/progress/index.ts`

### Modifizierte Dateien
- `src/components/tiles/index.ts` - HealthTile Export
- `src/screens/HomeScreen.tsx` - Health Widget Integration
- `src/screens/ProgressScreen.tsx` - Komplett überarbeitet
- `src/types/health.ts` - `activeMinutes` zu `IDailyHealthSummary` hinzugefügt
- `src/lib/i18n/locales/de.ts` - Neue Übersetzungen
- `src/lib/i18n/locales/en.ts` - Neue Übersetzungen

---

## Neue Übersetzungen

### Progress (`progress.*`)
- `today`, `activity`, `overview`, `weeklyActivity`
- `currentStreak`, `allTime`, `days`, `muscle`
- `rings.move`, `rings.exercise`, `rings.stand`

### Health (`health.*`)
- `summary.active`
- `connect.title`, `connect.description`

### Common (`common.*`)
- `settings`, `viewAll`

---

## Git Commit

```
5c4d907 feat(progress): redesign ProgressScreen with Health integration
```

13 Dateien geändert, 1359 Zeilen hinzugefügt, 217 Zeilen entfernt.
