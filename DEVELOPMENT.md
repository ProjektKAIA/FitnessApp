# ShapyFit - Entwicklungsdokumentation

## Projektübersicht

**ShapyFit** ist eine umfassende React Native Fitness-App für iOS und Android mit Health-Integration, AI-Coaching und Cloud-Synchronisation.

---

## Technologie-Stack

### Core Framework
| Technologie | Version | Beschreibung |
|-------------|---------|--------------|
| React Native | 0.76.9 | Mobile App Framework |
| Expo | ~52.0.0 | Development & Build Platform |
| TypeScript | 5.3.3 | Typsicherheit |

### State Management
| Technologie | Verwendung |
|-------------|------------|
| Zustand 5.0.9 | Globaler State mit Persistence |
| useState | Lokaler UI-State |
| useReducer | Komplexer lokaler State |
| AsyncStorage | State Persistence |

### Navigation
- `@react-navigation/native` - Navigation Core
- `@react-navigation/bottom-tabs` - Bottom Tab Navigation
- `@react-navigation/native-stack` - Stack Navigation

### Health Integration
- `react-native-health` - Apple HealthKit (iOS)
- `react-native-health-connect` - Google Health Connect (Android)

### Backend & Cloud
- **Firebase** - Firestore, Cloud Storage
- **OpenAI API** - AI Coach Integration

### Internationalisierung
- **i18next** - Multi-Language Support (DE/EN)

### Datenbank
- **expo-sqlite** - Lokale SQLite-Datenbank

---

## Projektstruktur

```
src/
├── components/           # Wiederverwendbare UI-Komponenten
│   ├── common/           # Button, Modal, Input, Card
│   ├── navigation/       # BottomNav, Header
│   ├── tiles/            # Home Screen Tiles
│   ├── progress/         # Progress Tracking
│   ├── health/           # Health Data Components
│   ├── programs/         # Program Selection
│   ├── you/              # User Profile Components
│   └── onboarding/       # Onboarding UI
│
├── screens/              # Screen Components (30+)
│   ├── plan/             # Training Plan Screens
│   ├── running/          # Running Screens
│   ├── yoga/             # Yoga Screens
│   ├── calisthenics/     # Calisthenics Screens
│   ├── homeworkout/      # Home Workout Screens
│   ├── health/           # Health Integration
│   ├── ai/               # AI Coach Screens
│   ├── settings/         # Settings (8 Screens)
│   ├── legal/            # Legal Screens
│   ├── guide/            # Guide/Articles
│   └── onboarding/       # Onboarding Flow
│
├── stores/               # Zustand Stores (12+)
├── services/             # Business Logic & APIs
│   ├── health/           # Health Services
│   ├── firebase/         # Firebase Init
│   ├── ai/               # OpenAI Integration
│   ├── backup/           # Cloud Backup
│   └── workout/          # Workout Services
│
├── hooks/                # Custom React Hooks
├── lib/                  # Utilities
│   ├── i18n/             # Internationalisierung
│   ├── database/         # SQLite Management
│   └── logger.ts         # Logging
│
├── contexts/             # React Context (Theme)
├── constants/            # App Constants
├── types/                # TypeScript Definitionen
├── data/                 # Static Data Libraries
├── utils/                # Utility Functions
└── native/               # Plattform-spezifischer Code
```

---

## Features

### Workout-Modi

| Modus | Beschreibung |
|-------|--------------|
| **Gym/Krafttraining** | Gewichtstraining mit Sets, Reps, Gewicht |
| **Running** | Lauftraining mit GPS, Distanz, Pace |
| **Yoga** | Posen-basierte Sessions mit Programmen |
| **Homeworkout** | Equipment-freie Workouts |
| **Calisthenics** | Bodyweight Übungen |

### Core Features

- **Live Workout Tracking** - Exercise-by-Exercise Tracking mit Timer
- **Trainingsplan-Editor** - Eigene Pläne erstellen und verwalten
- **Health Integration** - Sync mit Apple Health / Google Health Connect
- **AI Coach** - ChatGPT-basiertes Coaching
- **Progress Tracking** - Statistiken und Personal Records
- **Cloud Backup** - Automatische Datensicherung
- **Offline Support** - Lokale SQLite-Datenbank

### Health Data

**Gelesen:**
- Schritte, Distanz, Kalorien
- Herzfrequenz, Ruheherzfrequenz
- Vergangene Workouts

**Geschrieben:**
- Workout-Daten zu Health Apps

---

## State Management

### Zustand Stores

| Store | Verantwortlichkeit |
|-------|-------------------|
| `userStore` | User Profile, Settings, Auth |
| `workoutStore` | Active Workout, Exercises, Sets, Timer |
| `trainingPlanStore` | Training Plans, Exercise Templates |
| `healthStore` | Health Data, Permissions, Sync |
| `statsStore` | Statistics, Personal Records |
| `runningStore` | Running Sessions, Distance |
| `yogaStore` | Yoga Sessions, Poses |
| `homeworkoutStore` | Home Workout Completions |
| `aiCoachStore` | AI Conversations, Imported Chats |
| `userGoalsStore` | TDEE, Calorie Targets, Measurements |
| `consentStore` | Privacy, Terms, Onboarding State |
| `backupStore` | Auto-Backup Config |

---

## Navigation

```
RootStack
├── Consent Flow (wenn nicht akzeptiert)
├── Onboarding Flow (wenn nicht abgeschlossen)
│   ├── Welcome → Gender → Height → Weight → Sport → Goal
└── Main App
    ├── MainTabs (Bottom Navigation)
    │   ├── Home
    │   ├── Workout
    │   ├── Guide
    │   ├── You
    │   └── More
    └── Modal Screens (50+)
        ├── WorkoutActive (fullScreenModal)
        ├── RunningWorkoutActive
        ├── YogaSessionActive
        └── Settings, Plans, etc.
```

---

## Styling

### Theme System

- **Light & Dark Mode** mit System-Erkennung
- **Theme Context** für dynamische Farben
- **React Native StyleSheet** (kein Tailwind)

### Design Tokens

```typescript
COLORS = {
  primary: '#2196F3',
  success, error, warning, accent,
  gray: { 50-900 },
  sport: { yoga, running, calisthenics }
}

FONT_SIZES = { xs, sm, base, lg, xl, 2xl, 3xl, 4xl }
SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, ... }
BORDER_RADIUS = { sm: 4, md: 8, lg: 12, ... }
```

---

## Services

### Health Service (Factory Pattern)

```typescript
// Plattform-spezifische Health Services
const healthService = createHealthService();
// → iOS: AppleHealthService
// → Android: HealthConnectService
```

### Firebase Services
- Firestore für Datensynchronisation
- Cloud Storage für Backups

### OpenAI Services
- ChatGPT API für AI Coaching
- Conversation Import/Export

---

## Plattform-Anforderungen

| Plattform | Minimum Version | Health API |
|-----------|-----------------|------------|
| iOS | 15.1+ | HealthKit |
| Android | API 26+ | Health Connect |

---

## Build & Development

### Commands

```bash
# Development
npx expo start

# iOS Build
npx expo run:ios

# Android Build
npx expo run:android

# EAS Build (Production)
eas build --platform ios
eas build --platform android
```

### Environment

- Node.js 18+
- Expo CLI
- Xcode 15+ (iOS)
- Android Studio (Android)

---

## Aktuelle Entwicklung

**Branch:** `feature/apple-watch-integration`

### Letzte Features
- Health Permissions (iOS/Android)
- Live Step/Distance Tracking
- Guide Articles (Sleep, Stress, Recovery)
- Icon Migration (Emoji → Lucide)
- Expo SDK 52 Upgrade

---

## Datei-Konventionen

| Typ | Namenskonvention | Beispiel |
|-----|------------------|----------|
| Components | PascalCase.tsx | `Button.tsx` |
| Screens | PascalCase.tsx | `HomeScreen.tsx` |
| Stores | camelCase.ts | `workoutStore.ts` |
| Utils | kebab-case.ts | `date-utils.ts` |
| Types | PascalCase.ts | `WorkoutTypes.ts` |

---

## Code Quality

- **TypeScript** - Strict Mode, kein `any`
- **ESLint** - Linting Rules
- **Prettier** - Code Formatting
- **Jest** - Unit Testing

---

## Lizenz

Proprietär - Alle Rechte vorbehalten
