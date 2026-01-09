# Apple Watch Support - Implementierungsplan

## Übersicht

Apple Watch Companion App für ShapyFit - zeigt Workout-Daten live auf der Watch und ermöglicht grundlegende Steuerung.

---

## Features (MVP)

### Must-Have
- [ ] Workout starten/stoppen von der Watch
- [ ] Aktuelle Übung anzeigen (Name, Sets, Reps)
- [ ] Live Timer (Workout-Dauer)
- [ ] Restpausen-Countdown mit Haptic Feedback
- [ ] Herzfrequenz live anzeigen
- [ ] Kalorien anzeigen

### Nice-to-Have (später)
- [ ] Nächste Übung Vorschau
- [ ] Workout-Zusammenfassung am Ende
- [ ] Komplikationen (Watchface Widgets)
- [ ] Standalone-Modus

---

## Technische Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                      iPhone (React Native)                   │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ WorkoutStore │───►│ WatchBridge  │───►│    Native    │  │
│  │   (Zustand)  │    │   (JS Side)  │    │    Module    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                 │            │
└─────────────────────────────────────────────────│────────────┘
                                                  │
                                    Watch Connectivity Framework
                                                  │
┌─────────────────────────────────────────────────│────────────┐
│                      Apple Watch (Swift)        │            │
│                                                 ▼            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   SwiftUI    │◄───│ WatchSession │◄───│  HealthKit   │  │
│  │    Views     │    │   Manager    │    │   Workout    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Dateistruktur

### React Native Seite (iPhone)

```
src/
├── native/
│   └── WatchConnectivity/
│       ├── index.ts                 # JS Bridge
│       └── WatchConnectivity.swift  # Native Module
├── hooks/
│   └── useWatchConnectivity.ts      # React Hook
└── stores/
    └── workoutStore.ts              # Erweitern für Watch-Sync
```

### Native watchOS App

```
ios/
└── ShapyFitWatch/                   # Watch App Target
    ├── ShapyFitWatchApp.swift       # App Entry Point
    ├── ContentView.swift            # Haupt-View
    ├── Views/
    │   ├── WorkoutActiveView.swift  # Aktives Workout
    │   ├── WorkoutIdleView.swift    # Kein Workout aktiv
    │   ├── ExerciseView.swift       # Übungsanzeige
    │   ├── TimerView.swift          # Timer/Countdown
    │   └── HeartRateView.swift      # Herzfrequenz
    ├── Models/
    │   ├── WorkoutData.swift        # Datenmodell
    │   └── ExerciseData.swift       # Übungsdaten
    ├── Services/
    │   ├── WatchSessionManager.swift # Watch Connectivity
    │   └── HealthKitManager.swift    # HealthKit Integration
    └── Assets.xcassets/              # App Icons
```

---

## Kommunikationsprotokoll

### iPhone → Watch (Messages)

```swift
// Workout gestartet
{
  "type": "workoutStarted",
  "workout": {
    "id": "uuid",
    "name": "Push Day",
    "exercises": [
      {
        "id": "uuid",
        "name": "Bankdrücken",
        "targetSets": 4,
        "targetReps": "8-12",
        "completedSets": 0
      }
    ]
  }
}

// Übung gewechselt
{
  "type": "exerciseChanged",
  "exercise": {
    "id": "uuid",
    "name": "Schulterdrücken",
    "targetSets": 3,
    "targetReps": "10-12",
    "completedSets": 1
  },
  "exerciseIndex": 2,
  "totalExercises": 6
}

// Set abgeschlossen
{
  "type": "setCompleted",
  "exerciseId": "uuid",
  "completedSets": 2,
  "totalSets": 4
}

// Pause gestartet
{
  "type": "restStarted",
  "duration": 90
}

// Workout beendet
{
  "type": "workoutEnded",
  "summary": {
    "duration": 3600,
    "calories": 450,
    "exercises": 6,
    "totalSets": 24
  }
}
```

### Watch → iPhone (Messages)

```swift
// Workout starten (von Watch)
{
  "type": "requestStartWorkout"
}

// Workout beenden (von Watch)
{
  "type": "requestEndWorkout"
}

// Pause überspringen
{
  "type": "skipRest"
}
```

---

## Implementierungsschritte

### Phase 1: Xcode Projekt Setup
1. Watch App Target in Xcode erstellen
2. App Groups konfigurieren (für Datenaustausch)
3. HealthKit Capabilities hinzufügen
4. Watch Connectivity Framework einbinden

### Phase 2: Native Module (React Native)
1. `WatchConnectivity.swift` Native Module erstellen
2. Bridge zu JavaScript implementieren
3. `useWatchConnectivity` Hook erstellen
4. WorkoutStore erweitern für Watch-Sync

### Phase 3: Watch App UI (SwiftUI)
1. `WatchSessionManager` für Kommunikation
2. `WorkoutIdleView` - Startbildschirm
3. `WorkoutActiveView` - Während Workout
4. `TimerView` - Countdown mit Haptics
5. `HeartRateView` - Live Herzfrequenz

### Phase 4: HealthKit Integration
1. Workout-Session auf Watch starten
2. Herzfrequenz auslesen
3. Kalorien berechnen
4. Workout in Health App speichern

### Phase 5: Testing & Polish
1. Kommunikation testen
2. Edge Cases behandeln
3. Haptic Feedback feintunen
4. App Icons erstellen

---

## Xcode Konfiguration

### Neue Targets erstellen

1. **ShapyFit Watch App** (watchOS App)
   - Bundle ID: `de.shapyfit.app.watchkitapp`
   - Deployment Target: watchOS 10.0

### Capabilities

**iPhone App:**
- HealthKit
- App Groups: `group.de.shapyfit.app`

**Watch App:**
- HealthKit
- App Groups: `group.de.shapyfit.app`

### Info.plist Ergänzungen

**Watch App:**
```xml
<key>NSHealthShareUsageDescription</key>
<string>ShapyFit zeigt deine Herzfrequenz während des Trainings an.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>ShapyFit speichert deine Workouts in Apple Health.</string>
```

---

## Code-Beispiele

### WatchSessionManager.swift (Watch)

```swift
import WatchConnectivity

class WatchSessionManager: NSObject, ObservableObject {
    static let shared = WatchSessionManager()

    @Published var currentWorkout: WorkoutData?
    @Published var currentExercise: ExerciseData?
    @Published var restTimeRemaining: Int = 0
    @Published var isResting: Bool = false

    private var session: WCSession?

    override init() {
        super.init()
        if WCSession.isSupported() {
            session = WCSession.default
            session?.delegate = self
            session?.activate()
        }
    }

    func sendMessage(_ message: [String: Any]) {
        session?.sendMessage(message, replyHandler: nil)
    }

    func requestEndWorkout() {
        sendMessage(["type": "requestEndWorkout"])
    }
}

extension WatchSessionManager: WCSessionDelegate {
    func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        DispatchQueue.main.async {
            self.handleMessage(message)
        }
    }

    private func handleMessage(_ message: [String: Any]) {
        guard let type = message["type"] as? String else { return }

        switch type {
        case "workoutStarted":
            // Parse workout data
        case "exerciseChanged":
            // Update current exercise
        case "restStarted":
            // Start rest timer with haptic
        case "workoutEnded":
            // Show summary
        default:
            break
        }
    }
}
```

### WorkoutActiveView.swift (Watch)

```swift
import SwiftUI

struct WorkoutActiveView: View {
    @ObservedObject var sessionManager = WatchSessionManager.shared
    @State private var elapsedTime: TimeInterval = 0

    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                // Timer
                Text(formatTime(elapsedTime))
                    .font(.system(size: 40, weight: .bold, design: .rounded))
                    .foregroundColor(.green)

                // Current Exercise
                if let exercise = sessionManager.currentExercise {
                    VStack(spacing: 4) {
                        Text(exercise.name)
                            .font(.headline)
                            .lineLimit(2)

                        Text("\(exercise.completedSets)/\(exercise.targetSets) Sets")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(12)
                }

                // Rest Timer (if resting)
                if sessionManager.isResting {
                    RestTimerView(remaining: sessionManager.restTimeRemaining)
                }

                // Heart Rate
                HeartRateView()

                // End Button
                Button(action: { sessionManager.requestEndWorkout() }) {
                    Text("Beenden")
                        .foregroundColor(.red)
                }
                .padding(.top)
            }
        }
        .onReceive(timer) { _ in
            elapsedTime += 1
        }
    }

    func formatTime(_ time: TimeInterval) -> String {
        let minutes = Int(time) / 60
        let seconds = Int(time) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}
```

### useWatchConnectivity.ts (React Native)

```typescript
import { useEffect, useCallback } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { useWorkoutStore } from '@/stores';

const { WatchConnectivity } = NativeModules;
const watchEmitter = new NativeEventEmitter(WatchConnectivity);

export const useWatchConnectivity = () => {
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const currentExerciseIndex = useWorkoutStore((state) => state.currentExerciseIndex);

  // Sync workout state to watch
  useEffect(() => {
    if (activeWorkout) {
      WatchConnectivity.sendMessage({
        type: 'workoutStarted',
        workout: {
          id: activeWorkout.id,
          name: activeWorkout.name,
          exercises: activeWorkout.exercises,
        },
      });
    }
  }, [activeWorkout]);

  // Listen for watch messages
  useEffect(() => {
    const subscription = watchEmitter.addListener(
      'WatchMessage',
      (message) => {
        switch (message.type) {
          case 'requestEndWorkout':
            // Handle end workout from watch
            break;
          case 'skipRest':
            // Handle skip rest
            break;
        }
      }
    );

    return () => subscription.remove();
  }, []);

  const sendRestStarted = useCallback((duration: number) => {
    WatchConnectivity.sendMessage({
      type: 'restStarted',
      duration,
    });
  }, []);

  return { sendRestStarted };
};
```

---

## Testplan

### Kommunikation
- [ ] iPhone → Watch: Workout starten
- [ ] iPhone → Watch: Übung wechseln
- [ ] iPhone → Watch: Pause starten
- [ ] Watch → iPhone: Workout beenden
- [ ] Reconnect nach Verbindungsabbruch

### UI
- [ ] Timer zählt korrekt
- [ ] Übungsname wird angezeigt
- [ ] Haptic bei Pause-Ende
- [ ] Herzfrequenz wird angezeigt

### Edge Cases
- [ ] Watch App öffnen ohne aktives Workout
- [ ] iPhone App schließen während Workout
- [ ] Watch außer Reichweite
- [ ] Workout auf iPhone beenden

---

## Ressourcen

- [Watch Connectivity Framework](https://developer.apple.com/documentation/watchconnectivity)
- [HealthKit Workouts](https://developer.apple.com/documentation/healthkit/workouts_and_activity_rings)
- [SwiftUI Watch Tutorial](https://developer.apple.com/tutorials/swiftui/creating-a-watchos-app)

---

## Geschätzter Aufwand

| Phase | Aufwand |
|-------|---------|
| Xcode Setup | 1-2h |
| Native Module | 2-3h |
| Watch UI | 3-4h |
| HealthKit | 2-3h |
| Testing | 2-3h |
| **Gesamt** | **10-15h** |
