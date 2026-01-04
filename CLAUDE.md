# Fitness Tracker App

## Projekt-Übersicht

Du arbeitest an einer **kostenlosen Fitness-Tracking-App** mit React Native (Expo). Die App bietet KI-Integration (ChatGPT Import oder eigener Coach) und ist komplett kostenlos. Monetarisierung erfolgt über native Werbung und B2B-Partnerschaften.

**Projektpfad:** `/Volumes/PortableSSD/claude-dev/claude-workspace/fitness-tracker`

## Tech Stack

- **Framework:** React Native mit Expo
- **Sprache:** TypeScript (strict mode)
- **State:** Zustand
- **Navigation:** React Navigation (Bottom Tabs + Stack)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **KI:** OpenAI API (optional BYOK - Bring Your Own Key)
- **Styling:** StyleSheet (kein Tailwind, keine styled-components)

## Ordnerstruktur

```
src/
├── components/
│   ├── tiles/           # Tile-Komponenten (BaseTile, WorkoutTile, StatTile, etc.)
│   ├── navigation/      # BottomNav, Header
│   └── common/          # Button, Input, Card, Modal
├── screens/
│   ├── HomeScreen.tsx
│   ├── WorkoutScreen.tsx
│   ├── PlanScreen.tsx
│   ├── ProgressScreen.tsx
│   └── MoreScreen.tsx
├── services/
│   ├── api/             # REST API calls
│   ├── firebase/        # Firebase client, auth & queries
│   └── ai/              # OpenAI integration
├── stores/              # Zustand stores
├── hooks/               # Custom hooks
├── utils/               # Helper functions
├── types/               # TypeScript interfaces
├── constants/           # Theme, config, enums
└── assets/              # Images, fonts
```

## Design-System

### Farben
```typescript
const COLORS = {
  primary: '#2196F3',
  success: '#4CAF50',
  accent: '#FF4B1F',      // Orange - Hauptakzent
  purple: '#9C27B0',      // Für Ads/Premium
  white: '#FFFFFF',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    600: '#757575',
    900: '#212121',
  },
  overlay: {
    light: 'rgba(255,255,255,0.1)',
    medium: 'rgba(0,0,0,0.3)',
    dark: 'rgba(0,0,0,0.6)',
  },
};
```

### Tile-System
- **Grid:** 2 Spalten, 195px Höhe pro Tile
- **Größen:** 1x1 (195×195), 2x1 (full-width×195), 2x2 (full-width×390)
- **Konzept:** Alle Tiles zeigen Ausschnitte eines durchgehenden Hintergrundbildes
- **Overlay:** Jedes Tile hat ein semi-transparentes Overlay für Lesbarkeit

### Typography
```typescript
const FONT_SIZES = {
  xs: 9,      // Labels
  sm: 11,     // Subtitles
  base: 13,   // Body
  lg: 16,     // Small titles
  xl: 20,     // Titles
  '2xl': 28,  // Large titles
  '3xl': 36,  // Stats
};
```

## Code-Konventionen

### Naming
- **Components:** PascalCase (`WorkoutTile.tsx`)
- **Functions:** camelCase (`getUserStats`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces:** PascalCase mit Präfix (`IUser`, `TWorkout`)
- **Hooks:** camelCase mit `use` Präfix (`useWorkout`)
- **Stores:** camelCase mit `Store` Suffix (`workoutStore`)

### Component-Struktur
```typescript
// 1. Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Types
interface Props {
  title: string;
  onPress?: () => void;
}

// 3. Component
export const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  // Hooks first
  const [state, setState] = useState();
  
  // Handlers
  const handlePress = () => {};
  
  // Render
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

// 4. Styles (am Ende der Datei)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### Wichtige Regeln

1. **TypeScript:** Immer strikte Typisierung, keine `any`
2. **Exports:** Named exports bevorzugen, kein default export
3. **Imports:** Absolute Paths mit `@/` Alias nutzen
4. **Styles:** StyleSheet.create() verwenden, keine Inline-Styles
5. **State:** Zustand für globalen State, useState für lokalen
6. **Error Handling:** Try-catch mit spezifischen Error-Types
7. **Async:** Async/await bevorzugen, keine .then() chains
8. **Comments:** Nur wenn nötig, Code sollte selbsterklärend sein

## Hauptfeatures

### 1. Tile-basierter Home Screen
- 10+ Tiles in 2-Spalten Grid
- Durchgehendes Hintergrundbild
- Tiles: Workout, Stats, Directions, Ads, Progress

### 2. Workout Tracking
- Übung, Gewicht, Reps, Sets
- Rest Timer mit Vibration
- Live-Tracking während Workout
- History pro Übung

### 3. Multi-Direction Support
- Gym (PPL, Upper/Lower, Bro Split)
- Calisthenics (Skills, Progressions)
- Cardio (Laufen, HIIT, Schwimmen)
- Weitere: Yoga, Mobility, Sport-spezifisch

### 4. KI-Integration
- ChatGPT Import (Thread ID + API Key)
- Eigener Coach (basierend auf Fragebogen)
- Plan-Generierung
- Exercise Suggestions

### 5. Progress Tracking
- Charts für Gewicht, Volume, PRs
- Streak Counter
- Wochenübersicht
- Body Stats (optional)

## Datenmodelle

```typescript
interface IUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  settings: IUserSettings;
}

interface IWorkout {
  id: string;
  userId: string;
  name: string;
  direction: TDirection;
  exercises: IExercise[];
  startedAt: Date;
  finishedAt?: Date;
  duration: number;
  totalVolume: number;
}

interface IExercise {
  id: string;
  name: string;
  muscleGroup: TMuscleGroup;
  sets: ISet[];
}

interface ISet {
  id: string;
  weight: number;
  reps: number;
  rpe?: number;
  completed: boolean;
}

type TDirection = 'gym' | 'calisthenics' | 'cardio' | 'yoga' | 'mobility' | 'custom';
type TMuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'full_body';
```

## Firebase Collections

```
/users/{userId}
  - email, name, avatarUrl, createdAt, settings

/workouts/{workoutId}
  - userId, name, direction, exercises[], status
  - plannedAt, startedAt, finishedAt, duration, totalVolume

/exercises/{exerciseId}
  - name, muscleGroup, direction[], description
  - videoUrl, isCustom

/stats/{userId}
  - totalWorkouts, totalVolume, currentStreak
  - longestStreak, thisWeekWorkouts, thisMonthWorkouts

/exerciseHistory/{historyId}
  - userId, exerciseId, date, sets[], maxWeight, totalVolume
```

## Prioritäten beim Entwickeln

1. **Mobile-First:** Alles für Touch optimiert
2. **Performance:** Keine unnötigen Re-Renders
3. **Offline-First:** Core Features ohne Internet nutzbar
4. **Accessibility:** Labels, Kontraste, Touch-Targets
5. **Animations:** Smooth, aber sparsam (60fps)

## Aktueller Status

- [x] Design-Mockups (HTML)
- [x] Projektdokumentation
- [x] Expo Setup
- [x] Theme & Constants
- [x] BaseTile Component
- [x] WorkoutTile Component
- [x] HomeScreen
- [x] Navigation Setup
- [x] Firebase Integration
- [x] Auth Flow (Login, Register, Social, Dev Login)

## Nächste Schritte

1. Firebase Projekt erstellen und Konfiguration in .env eintragen
2. Google Sign-In konfigurieren (OAuth Client IDs)
3. Apple Sign-In aktivieren (Apple Developer Account)
4. Facebook Login App erstellen
5. Firestore Security Rules definieren

## Hinweise für Claude Code

- Frage nach, wenn Anforderungen unklar sind
- Erstelle immer vollständige, lauffähige Dateien
- Nutze die definierten Farben und Spacing-Werte
- Teste mental ob der Code kompiliert bevor du ihn ausgibst
- Bei UI-Komponenten: Denke an alle States (loading, error, empty, filled)
- Kommentiere komplexe Logik, aber nicht offensichtlichen Code