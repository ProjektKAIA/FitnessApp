# ShapyFit App - Test Dokumentation

## Getestete Features (13.01.2026)

### Navigation & Screens
- [x] RunningResultsScreen - Export fix, Screen lädt korrekt
- [x] RunningActiveScreen - Navigation zu Results funktioniert

### Cloud Sync & Import
- [x] Cloud Sync deaktivieren - Warnung erscheint
- [x] ChatGPT Import (Mehr → Import) - funktioniert

### Health Integration
- [x] Apple Health verbinden - funktioniert
- [ ] YouScreen Pull-to-Refresh - lädt echte Health-Daten

### Profil & Einstellungen (Mehr → Profil bearbeiten)
- [x] Birthday Picker - Dark Mode Support (weiße Zahlen)
- [x] Birthday Picker - Datum auswählen funktioniert
- [x] Birthday Picker - "Fertig" Button schließt Picker
- [x] Gewicht Input - Theme-Farben korrekt
- [x] Größe Input - Theme-Farben korrekt
- [x] BMI Berechnung - wird angezeigt
- [x] Weekly Goal Selector - Auswahl funktioniert
- [x] Profilbild ändern - Kamera/Galerie Auswahl

### Theme Support
- [x] Dark Mode - ProfileEditScreen vollständig angepasst
- [x] Dark Mode - DateTimePicker themeVariant korrekt

### Unit Tests
- [x] streakService - 14 Tests bestanden
- [x] calorieService - 14 Tests bestanden

---

## Bekannte Warnungen (nicht kritisch)

| Warnung | Status | Beschreibung |
|---------|--------|--------------|
| `getSnapshot should be cached` | Ignorieren | Zustand v5 / React 18 Warnung |
| `onAnimatedValueUpdate no listeners` | Ignorieren | React Native Animated Warnung |

---

## Offene Tests

### Running
- [ ] Lauf starten
- [ ] Lauf pausieren/fortsetzen
- [ ] Lauf beenden → Results Screen
- [ ] Schritte werden gezählt
- [ ] Distanz wird berechnet
- [ ] Pace wird berechnet

### Yoga
- [ ] Session starten
- [ ] Posen anzeigen
- [ ] Session beenden

### Gym Workout
- [ ] Workout starten
- [ ] Übungen tracken
- [ ] Workout beenden
- [ ] Historie anzeigen

### Health Integration
- [ ] Apple Health Sync
- [ ] Schritte lesen
- [ ] Kalorien lesen
- [ ] Workouts schreiben

### Onboarding
- [ ] Neuer User Flow
- [ ] Geschlecht auswählen
- [ ] Größe eingeben
- [ ] Gewicht eingeben
- [ ] Sportart wählen
- [ ] Ziel setzen

### Datensicherung
- [ ] Export funktioniert
- [ ] Import funktioniert
- [ ] Backup erstellen

---

## Test-Befehle

```bash
# Unit Tests ausführen
npm test

# App auf iOS Device starten
npx expo run:ios --device

# App auf Android Device starten
npx expo run:android --device
```

---

## Letzte Änderungen

### 13.01.2026
- `src/screens/index.ts` - RunningResultsScreen Export hinzugefügt
- `src/screens/settings/ProfileEditScreen.tsx` - Dark Mode fixes für DatePicker
