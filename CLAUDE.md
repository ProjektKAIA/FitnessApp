Health Integration Plan: Apple Health & Google Health Connect

 Übersicht

 Integration von Apple Health (iOS) und Google Health Connect (Android) in die Fitness-App mit:
 - Schritte & Aktivität - Tägliche Schritte, Distanz, Kalorien
 - Herzfrequenz - Ruhe-HR, Durchschnitt, Workout-HR
 - Training-Belastung - HR-Zonen, Intensitätsanalyse
 - Opt-In Settings - Datenschutzfreundlich mit Benutzer-Kontrolle

 ---
 Phase 1: Packages & Konfiguration ✅ ERLEDIGT

 1.1 Packages installieren

 npm install react-native-health                    # iOS Apple HealthKit
 npm install react-native-health-connect            # Android Health Connect
 npm install expo-health-connect                    # Expo Plugin für Android
 npm install expo-build-properties --save-dev       # SDK Konfiguration

 1.2 app.json anpassen

 Datei: /workspaces/claude-workspace/fitnessapp/app.json

 Hinzufügen:
 - expo-health-connect Plugin
 - expo-build-properties mit Android SDK 34, minSdk 26
 - iOS infoPlist mit HealthKit Usage Descriptions
 - iOS entitlements für HealthKit
 - Android Health Connect Permissions

 1.3 Custom Development Build erstellen

 npx expo prebuild --clean
 eas build --profile development --platform all

 Wichtig: Expo Go funktioniert nicht mehr - Custom Dev Client erforderlich!

 ---
 Phase 2: Types & Store ✅ ERLEDIGT

 2.1 Neue Datei: src/types/health.ts

 Neue TypeScript Interfaces:
 - IStepsData, IDistanceData, ICaloriesData
 - IHeartRateData, IRestingHeartRateData
 - IWorkoutHeartRateZone, IHealthWorkout
 - IDailyHealthSummary, IHealthTrend
 - IHealthSettings, ITrainingLoadData

 2.2 Neue Datei: src/stores/healthStore.ts

 Zustand Store mit:
 - settings - Aktivierung, Plattform, Permissions, DataTypes
 - todaySummary - Heutige Zusammenfassung
 - weekSummaries / monthSummaries - Historische Daten
 - trainingLoad - Belastungsanalyse
 - Actions für Sync und Updates
 - AsyncStorage Persistence

 2.3 Update: src/types/index.ts

 - RootStackParamList erweitern mit HealthSettings, HealthDashboard
 - IUserSettings erweitern mit healthIntegration Objekt

 ---
 Phase 3: Health Services ✅ ERLEDIGT

 3.1 Neue Service-Struktur

 src/services/health/
   index.ts              # Exports
   healthService.ts      # Platform-agnostisches Interface
   appleHealth.ts        # iOS Implementation
   healthConnect.ts      # Android Implementation
   dataTransformers.ts   # Daten-Normalisierung
   hrZoneCalculator.ts   # HR-Zonen Berechnung

 3.2 Factory Pattern

 function createHealthService(): IHealthService | null {
   if (Platform.OS === 'ios') return new AppleHealthService();
   if (Platform.OS === 'android') return new HealthConnectService();
   return null;
 }

 3.3 Service Interface

 - isAvailable() - Prüft Verfügbarkeit
 - requestPermissions() - Fordert Berechtigungen an
 - getSteps(), getDistance(), getCalories()
 - getHeartRate(), getRestingHeartRate()
 - getWorkouts(), getDailySummary()

 ---
 Phase 4: Neue Screens ✅ ERLEDIGT

 4.1 HealthSettingsScreen

 Datei: src/screens/health/HealthSettingsScreen.tsx

 Funktionen:
 - Master Toggle für Health-Integration
 - Individuelle Toggles (Schritte, HR, Kalorien, Workouts)
 - Permission Status Anzeige
 - "Jetzt Synchronisieren" Button
 - Letzte Sync-Zeit
 - Datenschutz-Hinweis

 4.2 HealthDashboardScreen

 Datei: src/screens/health/HealthDashboardScreen.tsx

 Sektionen:
 1. Heute - Schritte, Kalorien, Distanz (Ring-Charts)
 2. Herzfrequenz - Ruhe, Durchschnitt, Zonen
 3. Wochenübersicht - Aktivitäts-Chart
 4. Training-Belastung - Intensitäts-Analyse
 5. Letzte Workouts - Aus Health App

 ---
 Phase 5: Neue Components ✅ ERLEDIGT

 5.1 Component-Struktur

 src/components/health/
   index.ts
   HealthSummaryCard.tsx      # Kompakte Übersicht für ProgressScreen
   HeartRateCard.tsx          # HR Visualisierung mit Zonen
   StepsProgressRing.tsx      # Kreisdiagramm für Schritte
   ActivityChart.tsx          # Wochen/Monats-Aktivität
   TrainingLoadIndicator.tsx  # Belastungs-Anzeige
   HealthPermissionCard.tsx   # Permission-Request UI

 ---
 Phase 6: Integration in bestehende Screens ✅ ERLEDIGT

 6.1 ProgressScreen erweitern

 Datei: src/screens/ProgressScreen.tsx

 Neue Sektion "Health" nach Body Stats:
 - HealthSummaryCard mit Tages-Daten
 - HeartRateCard mit HR-Übersicht
 - Tap navigiert zu HealthDashboardScreen

 6.2 MoreScreen erweitern

 Datei: src/screens/MoreScreen.tsx

 Neuer MenuItem im Preferences-Bereich:
 - Icon: ❤️
 - Title: "Gesundheitsdaten"
 - Subtitle: "Verbunden" / "Nicht verbunden"
 - Navigiert zu HealthSettingsScreen

 6.3 App.tsx Navigation

 Datei: App.tsx

 Neue Stack.Screen Einträge:
 - HealthSettings
 - HealthDashboard

 ---
 Phase 7: Custom Hook & Sync ✅ ERLEDIGT

 7.1 Neue Datei: src/hooks/useHealthData.ts

 - Auto-Sync beim App-Start
 - Auto-Sync bei App Foreground
 - Manueller Sync Trigger
 - Error Handling
 - Loading States

 ---
 Phase 8: Internationalisierung ✅ ERLEDIGT

 8.1 Neue Translations

 Dateien: src/lib/i18n/locales/de.ts, en.ts

 Neue Keys:
 - health.title, health.settings, health.enable
 - health.permissions.*
 - health.dataTypes.* (steps, distance, calories, heartRate, workouts)
 - health.summary.*, health.heartRate.*
 - health.trainingLoad.*, health.sync.*
 - health.privacy.*
 - more.healthData, progress.healthData

 ---
 Datei-Änderungen Übersicht

 | Datei                          | Aktion     | Priorität  |
 |--------------------------------|------------|------------|
 | package.json                   | Modify     | 🔴 Hoch    |
 | app.json                       | Modify     | 🔴 Hoch    |
 | App.tsx                        | Modify     | 🔴 Hoch    |
 | src/types/health.ts            | Create     | 🔴 Hoch    |
 | src/types/index.ts             | Modify     | 🔴 Hoch    |
 | src/stores/healthStore.ts      | Create     | 🔴 Hoch    |
 | src/stores/index.ts            | Modify     | 🟡 Mittel  |
 | src/services/health/*.ts       | Create (5) | 🔴 Hoch    |
 | src/services/index.ts          | Modify     | 🟡 Mittel  |
 | src/hooks/useHealthData.ts     | Create     | 🟡 Mittel  |
 | src/hooks/index.ts             | Modify     | 🟢 Niedrig |
 | src/screens/health/*.tsx       | Create (3) | 🔴 Hoch    |
 | src/screens/index.ts           | Modify     | 🟢 Niedrig |
 | src/screens/ProgressScreen.tsx | Modify     | 🔴 Hoch    |
 | src/screens/MoreScreen.tsx     | Modify     | 🟡 Mittel  |
 | src/components/health/*.tsx    | Create (6) | 🟡 Mittel  |
 | src/lib/i18n/locales/*.ts      | Modify     | 🟢 Niedrig |

 Gesamt: ~20 neue Dateien, ~10 modifizierte Dateien

 ---
 Wichtige Hinweise

 Custom Dev Build erforderlich

 Nach Package-Installation muss ein Custom Development Build erstellt werden:
 npx expo prebuild --clean
 eas build --profile development --platform android
 eas build --profile development --platform ios

 Google Play Store

 Für Android Release im Play Store:
 - Declaration Form einreichen (7 Tage Wartezeit)
 - Whitelist Propagation (weitere 5-7 Tage)

 Testing

 - iOS: Physisches iPhone erforderlich (Simulator hat eingeschränkten HealthKit Support)
 - Android: Android 14+ hat Health Connect eingebaut, für Android 13 und älter muss Health Connect App installiert sein

 Datenschutz

 - Alle Health-Daten werden nur lokal gespeichert
 - Keine Server-Übertragung von Gesundheitsdaten
 - Opt-In erforderlich vor erstem Zugriff
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
