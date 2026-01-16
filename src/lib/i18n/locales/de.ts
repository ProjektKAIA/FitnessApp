const de = {
  // Common
  common: {
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    cancel: 'Abbrechen',
    save: 'Speichern',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    remove: 'Entfernen',
    back: 'Zurück',
    next: 'Weiter',
    done: 'Fertig',
    ok: 'OK',
    yes: 'Ja',
    no: 'Nein',
    or: 'oder',
    and: 'und',
    workouts: 'Workouts',
    exercises: 'Übungen',
    settings: 'Einstellungen',
    viewAll: 'Alle anzeigen',
  },

  // Navigation
  nav: {
    home: 'Home',
    workout: 'Workout',
    plan: 'Plan',
    guide: 'Guide',
    progress: 'Fortschritt',
    programs: 'Programme',
    you: 'You',
    more: 'Mehr',
  },

  // Home Screen
  home: {
    greeting: 'Guten Morgen',
    greetingAfternoon: 'Guten Tag',
    greetingEvening: 'Guten Abend',
    readyToTrain: 'Bereit zu trainieren?',
    startWorkout: 'Workout starten',
    thisWeek: 'Diese Woche',
    totalVolume: 'Gesamtvolumen',
    weeklyGoal: 'Wochenziel',
    weeklyGoalSettings: 'Wochenziel einstellen',
    weeklyGoalDescription: 'Wie viele Workouts möchtest du pro Woche absolvieren?',
    workoutsPerWeek: 'Workouts pro Woche',
    directionPressed: 'Trainingsrichtung',
    comingSoon: 'Demnächst verfügbar',
    trainingDirections: 'Trainingsrichtungen',
    totalWorkouts: 'Gesamt Workouts',
    thisMonth: 'Diesen Monat',
    premium: {
      title: 'Premium Supplements',
      description: '20% Rabatt auf deine erste Bestellung',
      cta: 'Jetzt shoppen',
    },
    ads: {
      import: {
        title: 'Plan Import',
        cta: 'Importieren',
      },
      plans: {
        title: 'Trainingspläne',
        description: 'Personalisierte Pläne erstellen',
        cta: 'Entdecken',
      },
      health: {
        title: 'Health verbinden',
        description: 'Synchronisiere deine Schritte, Kalorien & mehr',
        cta: 'Verbinden',
      },
      affiliate: {
        confirmTitle: 'Externe Website',
        confirmMessage: 'Möchtest du zur Seite von {{advertiser}} weitergeleitet werden?',
      },
    },
  },

  // Workout Screen
  workout: {
    title: 'Workout starten',
    subtitle: 'Wähle eine Vorlage oder erstelle dein eigenes',
    inProgress: 'IN BEARBEITUNG',
    exerciseCount: '{{count}} Übungen',
    continueWorkout: 'Workout fortsetzen',
    quickStart: 'Schnellstart',
    quickStartDesc: 'Starte ein leeres Workout und füge Übungen hinzu',
    empty: 'Leer',
    last: 'Letztes',
    ai: 'KI',
    templates: 'Vorlagen',
    startWorkout: 'Workout starten',
    restDayDesc: 'Dein Körper braucht Erholung für optimale Ergebnisse',
    startAnyway: 'Trotzdem trainieren',
    todaysWorkout: 'Heutiges Workout',
    weekSchedule: 'Wochenplan',
    chooseSport: 'Wähle deine Sportart',
    sportCards: {
      fitnessDesc: 'Krafttraining & Muskelaufbau',
      customDesc: 'Erstelle dein eigenes Workout',
      runningDesc: 'Lauftraining & Ausdauer',
      yogaDesc: 'Flexibilität & Entspannung',
      calisthenicsDesc: 'Bodyweight & Körperkontrolle',
    },
    lastWorkout: 'Letztes Training',
    volume: 'Volumen',
  },

  // Workout Active Screen
  workoutActive: {
    cancel: 'Abbrechen',
    finish: 'Beenden',
    rest: 'Pause: {{time}}',
    skip: 'Überspringen',
    set: 'SATZ',
    kg: 'KG',
    reps: 'WDHL',
    addSet: '+ Satz hinzufügen',
    addExercise: '+ Übung hinzufügen',
    addExerciseTitle: 'Übung hinzufügen',
    endWorkout: 'Workout beenden?',
    endWorkoutMessage: 'Möchtest du dieses Workout wirklich beenden? Dein Fortschritt wird gespeichert.',
    discard: 'Verwerfen',
    newWorkout: 'Neues Workout',
    loadingWorkout: 'Workout wird geladen...',
    lastTime: 'Letztes Mal',
    removeSet: 'Satz entfernen',
    deleteSelected: 'Löschen ({{count}})',
    noExerciseDetails: 'Für diese Übung sind noch keine Details verfügbar.',
  },

  // Plan Screen
  plan: {
    title: 'Trainingsplan',
    subtitle: 'Dein Wochenplan',
    thisWeek: 'Diese Woche',
    edit: 'Bearbeiten',
    swap: 'Tauschen',
    skip: 'Überspringen',
    rest: 'Ruhetag',
    activePlan: 'Aktiver Plan',
    today: 'Heute',
    exerciseCount: '{{count}} Übungen',
    startWorkout: 'Workout starten',
    restDay: 'Ruhetag',
    noPlan: 'Kein Trainingsplan',
    noPlanDescription: 'Erstelle deinen ersten Trainingsplan oder importiere einen bestehenden.',
    createOptions: 'Plan erstellen',
    createPlan: 'Plan erstellen',
    createPlanDesc: 'Erstelle oder importiere deinen Trainingsplan',
    createManually: 'Manuell erstellen',
    createManuallyDesc: 'Erstelle deinen Plan Schritt für Schritt',
    importFromChatGPT: 'Aus ChatGPT importieren',
    importFromChatGPTDesc: 'Importiere deinen Plan aus deinem ChatGPT-Chat',
    managePlans: '{{count}} Trainingsplan(e) verwalten',
    managePlansTitle: 'Trainingspläne',
  },

  // Progress Screen
  progress: {
    title: 'Fortschritt',
    subtitle: 'Verfolge deine Fitness-Reise',
    week: 'Woche',
    month: 'Monat',
    year: 'Jahr',
    today: 'Heute',
    activity: 'Aktivität',
    overview: 'Übersicht',
    weeklyActivity: 'Wöchentliche Aktivität',
    workoutDuration: 'Workout-Dauer',
    minutesPerDay: 'Minuten pro Tag',
    totalWorkouts: 'Workouts',
    currentStreak: 'Streak',
    dayStreak: 'Tage Streak',
    totalVolume: 'Volumen',
    bestStreak: 'Bester Streak',
    personalRecords: 'Persönliche Rekorde',
    noRecordsYet: 'Noch keine persönlichen Rekorde',
    noRecordsText: 'Schließe Workouts ab, um deine persönlichen Rekorde zu tracken',
    bodyStats: 'Körperdaten',
    weight: 'Gewicht',
    bodyFat: 'Körperfett',
    muscle: 'Muskelmasse',
    addMeasurement: 'Messung hinzufügen',
    allTime: 'Gesamt',
    days: 'Tage',
    rings: {
      move: 'Bewegen',
      exercise: 'Trainieren',
      stand: 'Stehen',
    },
  },

  // More Screen (Settings)
  more: {
    title: 'Mehr',
    guestUser: 'Dein Name',
    notLoggedIn: 'Profil bearbeiten',
    edit: 'Bearbeiten',

    // Sections
    account: 'Konto',
    preferences: 'Einstellungen',
    aiCoach: 'KI Coach',
    data: 'Daten',
    support: 'Support',
    legal: 'Rechtliches',

    // Account items
    profile: 'Profil',
    profileSubtitle: 'Bearbeite dein Profil',
    security: 'Sicherheit',
    securitySubtitle: 'Passwort & 2FA',
    subscription: 'Abo',
    subscriptionSubtitle: 'Kostenloser Plan',
    logout: 'Abmelden',
    logoutSubtitle: 'Von deinem Konto abmelden',
    logoutTitle: 'Abmelden',
    logoutMessage: 'Möchtest du dich wirklich abmelden?',

    // Preferences items
    notifications: 'Benachrichtigungen',
    hapticFeedback: 'Haptisches Feedback',
    units: 'Einheiten',
    unitsMetric: 'Metrisch (kg, km)',
    unitsImperial: 'Imperial (lb, mi)',
    appearance: 'Erscheinungsbild',
    appearanceSystem: 'System',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    themeSystem: 'System',
    language: 'Sprache',
    languageSubtitle: 'App-Sprache ändern',

    // Health Data
    healthData: 'Gesundheitsdaten',
    healthDataSubtitle: 'Apple Health & Health Connect',

    // AI Coach items
    aiSettings: 'KI Einstellungen',
    aiSettingsSubtitle: 'Konfiguriere deinen KI Coach',
    openaiKey: 'OpenAI API Key',
    openaiKeySubtitle: 'Eigenen Key verwenden',
    chatgptImport: 'ChatGPT Import',
    chatgptImportSubtitle: 'Aus ChatGPT importieren',

    // Data items
    exportData: 'Daten exportieren',
    exportDataSubtitle: 'Lade deine Workouts herunter',
    importData: 'Daten importieren',
    importDataSubtitle: 'Aus anderen Apps importieren',
    backupData: 'Datensicherung',
    backupDataSubtitle: 'In iCloud oder Google Drive sichern',
    cloudSync: 'Cloud-Sync',
    cloudSyncDisabled: 'Deaktiviert',
    cloudSyncDisableTitle: 'Cloud-Sync deaktivieren?',
    cloudSyncDisableWarning: 'Deine Daten werden nur noch lokal gespeichert. Bei Handyverlust oder App-Deinstallation sind deine gespeicherten Daten unwiderruflich weg.',
    cloudSyncDisableConfirm: 'Lokal speichern',
    deleteAccount: 'Konto löschen',
    deleteAccountSubtitle: 'Permanent löschen',

    // Support items
    helpCenter: 'Hilfe-Center',
    contactUs: 'Kontakt',
    rateApp: 'App bewerten',
    rateAppError: 'Der App Store konnte nicht geöffnet werden.',

    // Legal items
    terms: 'AGB',
    termsSubtitle: 'Allgemeine Geschäftsbedingungen',
    privacy: 'Datenschutz',
    privacySubtitle: 'Datenschutzerklärung',
    impressum: 'Impressum',
    impressumSubtitle: 'Rechtliche Angaben',

    // Footer
    version: 'Version {{version}}',
    madeWith: 'Made by Kaia Shapes Web- und AppAgentur',
  },

  // Language Selection
  language: {
    title: 'Sprache',
    subtitle: 'Wähle deine bevorzugte Sprache',
    german: 'Deutsch',
    english: 'Englisch',
    current: 'Aktuelle Sprache',
  },

  // Profile
  profile: {
    editTitle: 'Profil bearbeiten',
    personalInfo: 'Persönliche Daten',
    bodyStats: 'Körperdaten',
    name: 'Name',
    namePlaceholder: 'Dein Name',
    nameRequired: 'Bitte gib einen Namen ein',
    birthday: 'Geburtstag',
    birthdayPlaceholder: 'Datum auswählen',
    years: 'Jahre',
    weight: 'Gewicht',
    height: 'Größe',
    bmi: 'BMI',
    changePhoto: 'Foto ändern',
    chooseOption: 'Wähle eine Option',
    takePhoto: 'Foto aufnehmen',
    chooseFromLibrary: 'Aus Galerie wählen',
    tapToChange: 'Tippen zum Ändern',
    permissionRequired: 'Berechtigung erforderlich',
    permissionMessage: 'Bitte erlaube den Zugriff auf deine Fotos in den Einstellungen.',
    cameraPermissionMessage: 'Bitte erlaube den Zugriff auf die Kamera in den Einstellungen.',
    saveError: 'Fehler beim Speichern. Bitte versuche es erneut.',
    trainingGoals: 'Trainingsziele',
    weeklyGoal: 'Wochenziel',
    weeklyGoalHint: 'Wie oft möchtest du pro Woche trainieren?',
  },

  // Auth Screen
  auth: {
    logo: 'FitTrack',
    welcomeBack: 'Willkommen zurück',
    createAccount: 'Konto erstellen',
    forgotPassword: 'Passwort vergessen',
    loginSubtitle: 'Melde dich an, um fortzufahren',
    registerSubtitle: 'Erstelle ein kostenloses Konto',
    forgotSubtitle: 'Wir senden dir einen Reset-Link',
    email: 'E-Mail',
    emailPlaceholder: 'deine@email.de',
    password: 'Passwort',
    passwordPlaceholder: 'Dein Passwort',
    confirmPassword: 'Passwort bestätigen',
    confirmPasswordPlaceholder: 'Passwort wiederholen',
    forgotLink: 'Passwort vergessen?',
    login: 'Anmelden',
    register: 'Registrieren',
    sendResetLink: 'Reset-Link senden',
    noAccount: 'Noch kein Konto?',
    hasAccount: 'Bereits ein Konto?',
    backToLogin: 'Zurück zur Anmeldung',
    devLogin: 'DEV LOGIN (Auth überspringen)',

    // Errors
    errorEmailRequired: 'Bitte E-Mail eingeben',
    errorPasswordRequired: 'Bitte Passwort eingeben',
    errorPasswordLength: 'Passwort muss mindestens 8 Zeichen haben',
    errorPasswordUppercase: 'Passwort muss mindestens einen Großbuchstaben enthalten',
    errorPasswordLowercase: 'Passwort muss mindestens einen Kleinbuchstaben enthalten',
    errorPasswordNumber: 'Passwort muss mindestens eine Zahl enthalten',
    errorPasswordMismatch: 'Passwörter stimmen nicht überein',
    successResetEmail: 'Passwort-Reset E-Mail wurde gesendet',

    // Social
    socialLoginMessage: '{{provider}} Login wird nach der Firebase-Konfiguration verfügbar sein.',
  },

  // Consent Screen
  consent: {
    title: 'Willkommen bei FitnessApp',
    subtitle: 'Bevor du loslegst, brauchen wir deine Zustimmung zu einigen wichtigen Punkten.',
    legalSection: 'Rechtliche Hinweise',
    privacyCheckbox: 'Ich habe die Datenschutzerklärung gelesen und akzeptiere sie.',
    termsCheckbox: 'Ich akzeptiere die Allgemeinen Geschäftsbedingungen.',
    trackingSection: 'App-Tracking',
    trackingDescription: 'Wir möchten deine Aktivität über Apps und Websites anderer Unternehmen hinweg verfolgen, um dir personalisierte Werbung anzuzeigen. Dies hilft uns, die App kostenlos anzubieten.',
    trackingNote: 'Du kannst diese Einstellung jederzeit in den Systemeinstellungen ändern.',
    denyTracking: 'App nicht erlauben zu tracken',
    allowTracking: 'Erlauben',
    privacyPolicy: 'Datenschutzerklärung',
    termsOfService: 'Allgemeinen Geschäftsbedingungen',
  },

  // Legal Screens
  legal: {
    termsTitle: 'AGB',
    termsHeader: 'Allgemeine Geschäftsbedingungen',
    privacyTitle: 'Datenschutz',
    privacyHeader: 'Datenschutzerklärung',
    impressumTitle: 'Impressum',
    back: 'Zurück',
    lastUpdated: 'Stand: Januar 2025',
  },

  // Days
  days: {
    mon: 'Montag',
    tue: 'Dienstag',
    wed: 'Mittwoch',
    thu: 'Donnerstag',
    fri: 'Freitag',
    sat: 'Samstag',
    sun: 'Sonntag',
    short: {
      mon: 'Mo',
      tue: 'Di',
      wed: 'Mi',
      thu: 'Do',
      fri: 'Fr',
      sat: 'Sa',
      sun: 'So',
    },
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',
  },

  // Training Directions
  directions: {
    gym: 'Fitness',
    calisthenics: 'Calisthenics',
    cardio: 'Cardio',
    yoga: 'Yoga',
    mobility: 'Mobilität',
    custom: 'Benutzerdefiniert',
  },

  // Workout Templates
  templates: {
    pushDay: 'Push Tag',
    pullDay: 'Pull Tag',
    legDay: 'Bein Tag',
    upperBody: 'Oberkörper',
    fullBodyHiit: 'Ganzkörper HIIT',
    morningYoga: 'Morgen Yoga',
    activeRecovery: 'Aktive Erholung',
    restCardio: 'Ruhe / Cardio',
  },

  // Muscle Groups
  muscles: {
    chest: 'Brust',
    back: 'Rücken',
    shoulders: 'Schultern',
    biceps: 'Bizeps',
    triceps: 'Trizeps',
    arms: 'Arme',
    legs: 'Beine',
    glutes: 'Gesäß',
    core: 'Core',
    fullBody: 'Ganzkörper',
  },

  muscleGroups: {
    all: 'Alle',
    chest: 'Brust',
    back: 'Rücken',
    shoulders: 'Schultern',
    biceps: 'Bizeps',
    triceps: 'Trizeps',
    arms: 'Arme',
    legs: 'Beine',
    glutes: 'Gesäß',
    core: 'Core',
    full_body: 'Ganzkörper',
  },

  // Sport Types
  sportTypes: {
    fitness: 'Fitness',
    running: 'Laufen',
    cycling: 'Radfahren',
    martial_arts: 'Kampfsport',
    swimming: 'Schwimmen',
    yoga: 'Yoga',
    calisthenics: 'Calisthenics',
    custom: 'Eigenes Training',
  },

  // Sport Selection Screen
  sportSelection: {
    title: 'Sportart wählen',
    subtitle: 'Wähle die Sportart für deinen Trainingsplan',
    comingSoon: 'Demnächst',
  },

  // Plan List Screen
  planList: {
    title: 'Trainingspläne',
    emptyTitle: 'Keine Pläne',
    emptySubtitle: 'Erstelle deinen ersten Trainingsplan',
    createFirst: 'Plan erstellen',
    createNew: 'Neuen Plan erstellen',
    active: 'Aktiv',
    sourceManual: 'Manuell',
    sourceAI: 'KI-generiert',
    sourceImported: 'Importiert',
    sourceTemplate: 'Vorlage',
    workoutsPerWeek: '{{count}} Workouts/Woche',
    activate: 'Aktivieren',
    edit: 'Bearbeiten',
    start: 'Starten',
    deleteTitle: 'Plan löschen',
    deleteMessage: 'Möchtest du "{{name}}" wirklich löschen?',
    noWorkoutToday: 'Kein Training heute',
    noWorkoutTodayMessage: 'Für heute ist kein Workout in diesem Plan geplant.',
    viewPlan: 'Plan ansehen',
    startAnyway: 'Trotzdem starten',
    view: 'Ansicht',
  },

  // Plan Detail Screen
  planDetail: {
    startWorkout: 'Training starten',
  },

  // Plan Editor Screen
  planEditor: {
    createTitle: 'Neuer Plan',
    editTitle: 'Plan bearbeiten',
    planName: 'Plan-Name',
    planNamePlaceholder: 'z.B. Push-Pull-Legs',
    description: 'Beschreibung (optional)',
    descriptionPlaceholder: 'Beschreibe deinen Trainingsplan...',
    weeklySchedule: 'Wochenplan',
    restDay: 'Ruhetag',
    exerciseCount: '{{count}} Übungen',
    addWorkout: 'Workout hinzufügen',
    error: 'Fehler',
    nameRequired: 'Bitte gib einen Namen für den Plan ein',
    nameRequiredFirst: 'Bitte gib zuerst einen Namen für den Plan ein',
    removeWorkoutTitle: 'Workout entfernen',
    removeWorkoutMessage: 'Möchtest du dieses Workout wirklich entfernen?',
  },

  // Training Plan Detail Screen
  trainingPlan: {
    notFound: 'Plan nicht gefunden',
    trainingDays: 'Tage',
    exercises: 'Übungen',
    sets: 'Sätze',
    activatePlan: 'Plan aktivieren',
    activePlan: 'Aktiver Plan',
    weeklySchedule: 'Wochenübersicht',
    estimatedDuration: 'Geschätzte Dauer',
  },

  // Workout Day Editor Screen
  workoutEditor: {
    workoutName: 'Workout-Name',
    workoutNamePlaceholder: 'z.B. Push Tag',
    direction: 'Trainingsart',
    exercises: 'Übungen',
    exerciseCount: '{{count}} Übungen',
    noExercises: 'Noch keine Übungen',
    addFirstExercise: 'Erste Übung hinzufügen',
    addExercise: 'Übung hinzufügen',
    sets: 'Sätze',
    reps: 'Wdhl.',
    rest: 'Pause (s)',
    error: 'Fehler',
    nameRequired: 'Bitte gib einen Namen für das Workout ein',
    nameRequiredFirst: 'Bitte gib zuerst einen Namen ein',
    removeExerciseTitle: 'Übung entfernen',
    removeExerciseMessage: 'Möchtest du diese Übung wirklich entfernen?',
  },

  // Exercise Picker Screen
  exercisePicker: {
    title: 'Übung auswählen',
    searchPlaceholder: 'Übung suchen...',
    noResults: 'Keine Übungen gefunden',
  },

  // Exercise Categories
  exerciseCategories: {
    compound: 'Verbundübung',
    isolation: 'Isolationsübung',
  },

  // Exercises
  exercises: {
    benchPress: 'Bankdrücken',
    inclineDumbbellPress: 'Schrägbank Kurzhantel',
    cableFlyes: 'Kabelzug Flys',
    overheadPress: 'Schulterdrücken',
    lateralRaises: 'Seitheben',
    tricepPushdowns: 'Trizeps Pushdowns',
  },

  // Workout History
  workoutHistory: {
    title: 'Dein Sport-Verlauf',
    emptyTitle: 'Noch keine Aktivitäten',
    emptyText: 'Starte dein erstes Training, um deinen Verlauf zu sehen',
    emptyFilteredTitle: 'Keine Aktivitäten gefunden',
    emptyFilteredText: 'Du hast noch keine {{direction}}-Aktivitäten absolviert',
    duration: 'Dauer',
    volume: 'Volumen',
    all: 'Alle',
    filteredResults: '{{count}} Aktivität(en) gefunden',
    clearFilter: 'Filter zurücksetzen',
    poses: 'Posen',
    distance: 'Distanz',
    pace: 'Tempo',
  },

  // Workout Detail
  workoutDetail: {
    title: 'Workout Details',
    notFound: 'Workout nicht gefunden',
    duration: 'Dauer',
    totalKg: 'Gesamt (kg)',
    exercises: 'Übungen',
    set: 'Satz',
    weight: 'Gewicht',
    reps: 'Wdhl.',
    volume: 'Volumen',
    totalVolume: 'Gesamt',
    notes: 'Notizen',
    description: 'Beschreibung',
    noExercises: 'Keine Übungen',
    nextProgram: 'Nächstes Programm',
    startWorkout: 'Workout starten',
  },

  // Streak Detail
  streakDetail: {
    title: 'Deine Streak',
    currentStreak: 'Tage in Folge',
    longestStreak: 'Längste Streak',
    thisWeek: 'Diese Woche',
    thisMonth: 'Dieser Monat',
    last12Weeks: 'Letzte 12 Wochen',
    less: 'Weniger',
    more: 'Mehr',
    daysUntilRecord: 'Noch {{days}} Tage bis zum Rekord!',
    newRecord: 'Neuer Rekord! Weiter so!',
    tips: 'Tipps für deine Streak',
    tip1: 'Trainiere jeden Tag zur gleichen Zeit, um eine Routine aufzubauen.',
    tip2: 'Auch kurze Workouts zählen - 15 Minuten sind besser als nichts.',
    tip3: 'Plane deine Workouts im Voraus in deinem Kalender.',
  },

  // Health Integration
  health: {
    title: 'Gesundheitsdaten',
    settings: 'Einstellungen',
    dashboard: 'Dashboard',
    enable: 'Gesundheitsdaten aktivieren',
    enabled: 'Aktiviert',
    notSupported: 'Gesundheitsdaten werden auf diesem Gerät nicht unterstützt.',
    disabled: 'Deaktiviert',
    connected: 'Verbunden',
    notConnected: 'Nicht verbunden',
    connectNow: 'Jetzt verbinden',

    // Permissions
    permissions: {
      title: 'Berechtigungen',
      subtitle: 'Wähle die Daten, auf die wir zugreifen dürfen',
      granted: 'Erlaubt',
      denied: 'Verweigert',
      notDetermined: 'Nicht festgelegt',
      request: 'Berechtigung anfordern',
      openSettings: 'Einstellungen öffnen',
    },

    // Data Types
    dataTypes: {
      steps: 'Schritte',
      distance: 'Distanz',
      calories: 'Kalorien',
      activeCalories: 'Aktive Kalorien',
      heartRate: 'Herzfrequenz',
      restingHeartRate: 'Ruheherzfrequenz',
      workouts: 'Workouts',
    },

    // Summary
    summary: {
      today: 'Heute',
      steps: 'Schritte',
      stepsGoal: 'Schritteziel',
      distance: 'Distanz',
      calories: 'Kalorien',
      activeCalories: 'Aktive Kal.',
      burned: 'verbrannt',
      km: 'km',
      m: 'm',
      kcal: 'kcal',
      active: 'Aktiv',
    },

    // Connect
    connect: {
      title: 'Health verbinden',
      description: 'Verbinde Apple Health oder Health Connect für detaillierte Aktivitätsdaten',
    },

    // Heart Rate
    heartRate: {
      title: 'Herzfrequenz',
      current: 'Aktuell',
      resting: 'Ruhe',
      average: 'Durchschnitt',
      min: 'Min',
      max: 'Max',
      bpm: 'BPM',
      zones: 'HR-Zonen',
      zone: {
        rest: 'Ruhe',
        fatBurn: 'Fettverbrennung',
        cardio: 'Cardio',
        peak: 'Peak',
        max: 'Maximum',
      },
    },

    // Training Load
    trainingLoad: {
      title: 'Trainingsbelastung',
      acute: 'Akut (7 Tage)',
      chronic: 'Chronisch (28 Tage)',
      ratio: 'Verhältnis',
      level: {
        low: 'Niedrig',
        moderate: 'Moderat',
        high: 'Hoch',
        veryHigh: 'Sehr hoch',
      },
      recommendation: {
        low: 'Du kannst die Intensität steigern',
        moderate: 'Gute Balance, weiter so!',
        high: 'Achte auf ausreichend Erholung',
        veryHigh: 'Erhöhtes Verletzungsrisiko - mehr Pausen einlegen',
      },
    },

    // Sync
    sync: {
      now: 'Jetzt synchronisieren',
      syncing: 'Synchronisiere...',
      lastSync: 'Letzte Synchronisierung',
      never: 'Noch nie',
      success: 'Erfolgreich synchronisiert',
      error: 'Synchronisierung fehlgeschlagen',
    },

    // Privacy
    privacy: {
      title: 'Datenschutz-Hinweis',
      description: 'Deine Gesundheitsdaten werden nur lokal auf deinem Gerät gespeichert und niemals an unsere Server übertragen.',
      learnMore: 'Mehr erfahren',
    },

    // Activity Chart
    activity: {
      title: 'Aktivität',
      week: 'Woche',
      month: 'Monat',
      noData: 'Keine Daten verfügbar',
    },

    // Workouts from Health
    workouts: {
      title: 'Letzte Workouts',
      fromHealth: 'Aus Health App',
      noWorkouts: 'Keine Workouts',
      duration: 'Dauer',
      calories: 'Kalorien',
      heartRate: 'Herzfrequenz',
    },

    // Platforms
    platform: {
      appleHealth: 'Apple Health',
      healthConnect: 'Health Connect',
    },
  },

  // AI Coach
  aiCoach: {
    title: 'KI Coach',
    subtitle: 'Dein persönlicher Fitness-Assistent',
    howItWorks: 'So funktioniert es',
    howItWorksText: 'Importiere deine ChatGPT-Gespräche über Fitness und Trainingspläne. Die App extrahiert automatisch relevante Informationen und kann diese für dein Training nutzen.',
    importFromChatGPT: 'Aus ChatGPT importieren',
    importDescription: 'Exportiere deine Chats und importiere sie hier',
    importedChats: 'Importierte Chats',
    active: 'Aktiv',
    importedOn: 'Importiert am {{date}}',
    messageCount: '{{count}} Nachrichten',
    hasPlan: 'Trainingsplan erkannt',
    viewChat: 'Chat ansehen',
    noChatsYet: 'Noch keine Chats',
    noChatsDescription: 'Importiere deine ChatGPT-Gespräche, um deinen KI Coach zu aktivieren.',
    removeChat: 'Chat entfernen',
    removeChatConfirm: 'Möchtest du "{{title}}" wirklich entfernen?',
    chatNotFound: 'Chat nicht gefunden',
    extractedPlan: 'Extrahierter Trainingsplan',
    usePlan: 'Plan übernehmen',
    conversation: 'Konversation',
    you: 'Du',

    // Import Screen
    importTitle: 'ChatGPT Import',
    importSubtitle: 'Importiere deine ChatGPT-Gespräche',
    howToExport: 'So exportierst du aus ChatGPT:',
    step1: 'Öffne ChatGPT auf chat.openai.com',
    step2: 'Gehe zu Einstellungen → Daten-Kontrolle',
    step3: 'Klicke auf "Daten exportieren"',
    step4: 'Lade die ZIP-Datei herunter und wähle sie hier aus',
    selectFile: 'Datei auswählen',
    importError: 'Import-Fehler',
    unknownError: 'Ein unbekannter Fehler ist aufgetreten',
    importSuccess: 'Import erfolgreich',
    chatImported: '"{{title}}" wurde importiert',
    foundConversations: '{{count}} Gespräche gefunden',
    fitnessOnly: 'Nur Fitness',
    noFitnessChats: 'Keine Fitness-bezogenen Chats gefunden',
    showAllChats: 'Alle Chats anzeigen',
    imported: 'Importiert',
  },

  // Onboarding
  onboarding: {
    welcome: {
      greeting: 'Willkommen',
      title: 'Bring deinen Körper auf das nächste Level',
      subtitle: 'Starte jetzt deine Fitness-Reise mit personalisierten Trainingsplänen',
      letsGo: 'Los geht\'s',
      getStarted: 'Los geht\'s',
      skip: 'Überspringen',
    },
    gender: {
      title: 'Was ist dein Geschlecht?',
      subtitle: 'Hilft uns, dein Training anzupassen',
      female: 'Weiblich',
      male: 'Männlich',
    },
    height: {
      title: 'Wie groß bist du?',
      subtitle: 'Wird für Berechnungen verwendet',
      cm: 'cm',
    },
    weight: {
      title: 'Wie viel wiegst du?',
      subtitle: 'Wird für Berechnungen verwendet',
      kg: 'kg',
    },
    sport: {
      title: 'Was sind deine Lieblingssportarten?',
      subtitle: 'Wähle eine oder mehrere aus',
      sports: {
        bodybuilding: 'Bodybuilding',
        tennis: 'Tennis',
        basketball: 'Basketball',
        football: 'Fußball',
        volleyball: 'Volleyball',
        badminton: 'Badminton',
        shooting: 'Schießen',
        running: 'Laufen',
        swimming: 'Schwimmen',
        yoga: 'Yoga',
        kickboxing: 'Kickboxen',
        karate: 'Karate',
      },
      options: {
        bodybuilding: 'Bodybuilding',
        tennis: 'Tennis',
        basketball: 'Basketball',
        football: 'Fußball',
        volleyball: 'Volleyball',
        badminton: 'Badminton',
        shooting: 'Schießen',
        running: 'Laufen',
        swimming: 'Schwimmen',
        yoga: 'Yoga',
        kickboxing: 'Kickboxen',
        karate: 'Karate',
      },
    },
    goal: {
      title: 'Was ist dein Hauptziel?',
      subtitle: 'Wir passen dein Training entsprechend an',
      goals: {
        fat_burning: 'Fettverbrennung',
        fitness: 'Allgemeine Fitness',
        strengthen_muscles: 'Muskelaufbau',
        increased_metabolism: 'Stoffwechsel steigern',
        weight_gain: 'Gewichtszunahme',
      },
      options: {
        fat_burning: 'Fettverbrennung',
        fitness: 'Allgemeine Fitness',
        strengthen_muscles: 'Muskelaufbau',
        increased_metabolism: 'Stoffwechsel steigern',
        weight_gain: 'Gewichtszunahme',
      },
    },
    back: 'Zurück',
    continue: 'Weiter',
    finish: 'Fertig',
    step: 'Schritt {{current}} von {{total}}',
  },

  // Programs Screen
  programs: {
    title: 'Programme',
    subtitle: 'Wähle dein Trainingsprogramm',
    featuredPrograms: 'Beliebte Programme',
    allPrograms: 'Alle Programme',
    selectLevel: 'Level auswählen',
    level: 'Level {{level}}',
    levelDescription: {
      1: 'Einsteiger - Leichte Intensität',
      2: 'Fortgeschritten - Mittlere Intensität',
      3: 'Profi - Hohe Intensität',
      4: 'Experte - Maximale Intensität',
    },
    categories: {
      yoga: 'Yoga Time',
      meditation: 'Meditation Time',
      bodybuilding: 'Bodybuilding Time',
      cardio: 'Cardio Time',
      stretching: 'Stretching Time',
    },
    categoryDescriptions: {
      yoga: 'Entspannung & Flexibilität',
      meditation: 'Ruhe & Fokus',
      bodybuilding: 'Kraft & Muskelaufbau',
      cardio: 'Ausdauer & Herz-Kreislauf',
      stretching: 'Dehnung & Beweglichkeit',
    },
    startProgram: 'Programm starten',
  },

  // You Screen
  you: {
    title: 'Du',
    guest: 'Gast',
    connectHealth: 'Health verbinden',
    healthStats: 'Gesundheitsdaten',
    steps: 'Schritte',
    stepsUnit: 'Schritte',
    calories: 'Kalorien',
    activeMinutes: 'Aktive Min.',
    heartRate: 'Herzfrequenz',
    weight: 'Gewicht',
    bloodPressure: 'Blutdruck',
    goal: 'Ziel',
    activity: 'Aktivität',
    streak: 'Streak',
    workouts: 'Workouts',
    caloriesSection: 'Kalorien',
    addCalories: 'Kalorien eintragen',
    dailyNeed: 'Tagesbedarf',
    consumed: 'Gegessen',
    workoutBurned: 'Workout verbrannt',
    target: 'Ziel',
    balance: 'Bilanz',
    deficit: 'Defizit',
    surplus: 'Überschuss',
    maintain: 'Halten',
    calculateDailyNeed: 'Tagesbedarf ermitteln',
    myGoal: 'Mein Ziel',
    addGoal: 'Ziel hinzufügen',
    setGoal: 'Setze dein Ziel',
    goalPlaceholder: 'z.B. 75kg erreichen',
    until: 'Bis',
    addHealthData: 'Gesundheitsdaten eintragen',
    todayActivity: 'Heute',
    editRings: 'Ringe bearbeiten',
    activeRings: 'Aktive Ringe',
    addRing: 'Ring hinzufügen',
    currentValue: 'Aktueller Wert',
    ring: {
      steps: 'Schritte',
      calories: 'Kalorien',
      activeMinutes: 'Aktive Minuten',
      heartRate: 'Herzfrequenz',
      distance: 'Distanz',
      water: 'Wasser',
    },
  },

  // Contact Screen
  contact: {
    title: 'Kontakt',
    infoTitle: 'Schreib uns!',
    infoText: 'Hast du Fragen, Feedback oder Anregungen? Wir freuen uns von dir zu hören.',
    clickHere: 'Hier klicken',
    formTitle: 'Kontaktformular',
    name: 'Name',
    namePlaceholder: 'Dein Name',
    email: 'E-Mail',
    emailPlaceholder: 'deine@email.de',
    subject: 'Betreff',
    subjectPlaceholder: 'Worum geht es?',
    message: 'Nachricht',
    messagePlaceholder: 'Deine Nachricht an uns...',
    send: 'Nachricht senden',
    sending: 'Wird gesendet...',
    successTitle: 'Vielen Dank!',
    successMessage: 'Deine E-Mail-App wurde geöffnet. Sende die Nachricht, um uns zu kontaktieren.',
    noMailAppTitle: 'Keine E-Mail-App',
    noMailAppMessage: 'Bitte sende deine Nachricht direkt an: {{email}}',
    errorName: 'Bitte gib deinen Namen ein.',
    errorEmail: 'Bitte gib deine E-Mail-Adresse ein.',
    errorSubject: 'Bitte gib einen Betreff ein.',
    errorMessage: 'Bitte schreibe eine Nachricht.',
    errorSending: 'Fehler beim Öffnen der E-Mail-App.',
    alternativeTitle: 'Direkt per E-Mail',
    alternativeText: 'Du kannst uns auch direkt eine E-Mail schreiben.',
  },

  // Security Screen
  security: {
    title: 'Sicherheit',
    biometricTitle: 'Biometrische Entsperrung',
    biometricSubtitle: 'App mit Gesichtserkennung oder Fingerabdruck entsperren',
    biometricPrompt: 'Identität bestätigen',
    biometricEnabled: 'Biometrische Entsperrung wurde aktiviert.',
    biometricDisabled: 'Biometrische Entsperrung wurde deaktiviert.',
    usePassword: 'PIN verwenden',
    noBiometric: 'Keine biometrische Entsperrung verfügbar',
    noBiometricDesc: 'Dein Gerät unterstützt keine biometrische Authentifizierung oder es ist keine eingerichtet.',
    infoTextLocal: 'Mit der biometrischen Entsperrung kannst du die App zusätzlich schützen. Deine Daten werden lokal auf deinem Gerät gespeichert.',
    biometricNotAvailable: 'Biometrische Authentifizierung ist auf diesem Gerät nicht verfügbar.',
    biometricError: 'Fehler bei der biometrischen Authentifizierung.',
    appLocked: 'App gesperrt',
    authenticateToUnlock: 'Bitte authentifiziere dich, um die App zu entsperren.',
  },

  // Data Export Screen
  dataExport: {
    title: 'Daten exportieren',
    infoTitle: 'Deine Daten',
    infoText: 'Exportiere deine Fitness-Daten als JSON-Datei. Du kannst diese Datei später wieder importieren.',
    selectData: 'Daten auswählen',
    options: {
      profile: 'Profil',
      profileDesc: 'Name, Größe, Gewicht, Ziele',
      workouts: 'Workouts',
      workoutsDesc: 'Alle deine Trainingseinheiten',
      health: 'Gesundheitsdaten',
      healthDesc: 'Schritte, Kalorien, Aktivitäten',
      settings: 'Einstellungen',
      settingsDesc: 'App-Einstellungen & Präferenzen',
    },
    exportButton: 'Daten exportieren',
    exporting: 'Exportiere...',
    noSelection: 'Bitte wähle mindestens eine Datenkategorie aus.',
    success: 'Daten wurden erfolgreich exportiert.',
    error: 'Fehler beim Exportieren der Daten.',
    shareTitle: 'FrameFit Daten-Export',
    disclaimer: 'Die exportierte Datei enthält deine persönlichen Daten. Bewahre sie sicher auf.',
  },

  // Data Import Screen
  dataImport: {
    title: 'Daten importieren',
    infoTitle: 'Daten wiederherstellen',
    infoText: 'Importiere eine zuvor exportierte JSON-Datei, um deine Daten wiederherzustellen.',
    selectFile: 'Datei auswählen',
    exportDate: 'Export-Datum',
    selectData: 'Zu importieren',
    available: 'Verfügbar',
    notAvailable: 'Nicht verfügbar',
    workoutCount: '{{count}} Workouts',
    importButton: 'Daten importieren',
    importing: 'Importiere...',
    noSelection: 'Bitte wähle mindestens eine Datenkategorie aus.',
    confirmTitle: 'Daten importieren?',
    confirmMessage: 'Die ausgewählten Daten werden überschrieben. Dieser Vorgang kann nicht rückgängig gemacht werden.',
    import: 'Importieren',
    success: 'Daten wurden erfolgreich importiert.',
    error: 'Fehler beim Importieren der Daten.',
    invalidFile: 'Die ausgewählte Datei ist ungültig oder beschädigt.',
    disclaimer: 'Importiere nur Dateien, die du selbst exportiert hast.',
  },

  // Data Backup Screen
  backup: {
    title: 'Datensicherung',
    infoTitle: 'Deine Daten sichern',
    infoText: 'Sichere deine Daten in der Cloud oder lokal. Du behältst die volle Kontrolle über deine Daten.',
    currentDataSize: 'Aktuelle Datengröße:',
    storageLocation: 'Speicherort',
    storageDesc: {
      local: 'Auf diesem Gerät speichern',
      icloud: 'In deinem iCloud Drive speichern',
      gdrive: 'In deinem Google Drive speichern',
    },
    autoBackup: 'Automatisches Backup',
    frequency: {
      after_workout: 'Nach jedem Workout',
      daily: 'Täglich',
      weekly: 'Wöchentlich',
      manual: 'Nur manuell',
    },
    createBackup: 'Backup erstellen',
    restoreBackup: 'Backup wiederherstellen',
    lastBackup: 'Letztes Backup',
    never: 'Noch nie',
    size: 'Größe',
    location: 'Speicherort',
    history: 'Backup-Verlauf',
    success: 'Erfolg',
    error: 'Fehler',
    backupCreated: 'Backup "{{fileName}}" wurde erstellt.',
    backupSavedTo: 'Backup wurde in {{location}} gespeichert.',
    backupFailed: 'Backup konnte nicht erstellt werden.',
    restoreTitle: 'Backup wiederherstellen',
    restoreWarning: 'Achtung: Das Wiederherstellen überschreibt möglicherweise deine aktuellen Daten. Möchtest du fortfahren?',
    restore: 'Wiederherstellen',
    restoreOptions: 'Wiederherstellung',
    restoreOptionsDesc: 'Backup vom {{date}} (Version {{version}})',
    replaceAll: 'Alles ersetzen',
    mergeData: 'Mit aktuellen Daten zusammenführen',
    restoreComplete: 'Daten wurden erfolgreich wiederhergestellt.',
    restoreFailed: 'Wiederherstellung fehlgeschlagen.',
    loadFailed: 'Datei konnte nicht geladen werden.',
    invalidBackup: 'Die Datei ist kein gültiges ShapyFit-Backup.',
    icloudOnlyIOS: 'iCloud ist nur auf iOS-Geräten verfügbar.',
    gdriveOnlyAndroid: 'Google Drive ist nur auf Android-Geräten verfügbar.',
    privacyNote: 'Deine Daten werden direkt in deinem persönlichen Cloud-Speicher gespeichert. Wir haben keinen Zugriff auf deine Backups.',
  },

  // Delete Account Screen
  deleteAccount: {
    title: 'Daten löschen',
    warningTitle: 'Achtung!',
    warningText: 'Das Löschen aller Daten ist dauerhaft und kann nicht rückgängig gemacht werden.',
    whatWillBeDeleted: 'Was wird gelöscht?',
    deleteItem1: 'Dein Profil und alle persönlichen Daten',
    deleteItem2: 'Alle deine Workouts und Trainingspläne',
    deleteItem3: 'Deine Einstellungen und Präferenzen',
    deleteItem4: 'Importierte ChatGPT-Gespräche',
    confirmSection: 'Bestätigung',
    typeToConfirm: 'Tippe "{{word}}" zur Bestätigung',
    confirmWord: 'LÖSCHEN',
    deleteButton: 'Alle Daten löschen',
    deleting: 'Wird gelöscht...',
    finalConfirmTitle: 'Bist du sicher?',
    finalConfirmMessage: 'Alle deine Daten werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.',
    deleteForever: 'Endgültig löschen',
    successTitle: 'Daten gelöscht',
    successMessage: 'Alle deine Daten wurden erfolgreich gelöscht.',
    error: 'Fehler beim Löschen der Daten. Bitte versuche es später erneut.',
    disclaimer: 'Erstelle ein Backup, bevor du deine Daten löschst.',
  },

  // Fitness Questionnaire
  questionnaire: {
    next: 'Weiter',
    finish: 'Plan erstellen',
    experience: {
      title: 'Wie erfahren bist du?',
      subtitle: 'Das hilft uns, den richtigen Plan für dich zu finden',
      beginner: 'Anfänger',
      beginnerDesc: 'Neu im Training oder weniger als 6 Monate Erfahrung',
      intermediate: 'Fortgeschritten',
      intermediateDesc: '6 Monate bis 2 Jahre regelmäßiges Training',
      advanced: 'Profi',
      advancedDesc: 'Über 2 Jahre konsequentes Training',
    },
    goal: {
      title: 'Was ist dein Hauptziel?',
      subtitle: 'Wähle das Ziel, das dir am wichtigsten ist',
      muscle: 'Muskelaufbau',
      strength: 'Kraft steigern',
      loseWeight: 'Abnehmen',
      fitness: 'Allgemeine Fitness',
    },
    days: {
      title: 'Wie oft möchtest du trainieren?',
      subtitle: 'Tage pro Woche',
      two: '2 Tage',
      three: '3 Tage',
      four: '4 Tage',
      five: '5 Tage',
      six: '6 Tage',
    },
    duration: {
      title: 'Wie lange pro Training?',
      subtitle: 'Durchschnittliche Zeit pro Einheit',
      thirty: '30 Minuten',
      fortyFive: '45 Minuten',
      sixty: '60 Minuten',
      ninety: '90 Minuten',
    },
    equipment: {
      title: 'Welche Ausrüstung hast du?',
      subtitle: 'Wähle deine Trainingsumgebung',
      gym: 'Fitnessstudio',
      gymDesc: 'Voller Zugang zu Geräten und Gewichten',
      home: 'Home Gym',
      homeDesc: 'Hanteln, Kettlebells, evtl. Rack',
      minimal: 'Minimal',
      minimalDesc: 'Nur Körpergewicht oder Resistance Bands',
    },
    focus: {
      title: 'Welche Bereiche möchtest du fokussieren?',
      subtitle: 'Mehrfachauswahl möglich',
      upper: 'Oberkörper',
      lower: 'Unterkörper',
      core: 'Core / Bauch',
      full: 'Ganzkörper',
    },
  },

  // Exercise Detail Screen
  exerciseDetail: {
    notFound: 'Nicht gefunden',
    exerciseNotFound: 'Übung nicht gefunden',
    muscles: 'Beteiligte Muskeln',
    primaryMuscle: 'Primär',
    secondaryMuscles: 'Sekundär',
    equipment: 'Benötigte Ausrüstung',
    instructions: 'Ausführung',
    breathing: 'Atmung',
    tips: 'Tipps',
    commonMistakes: 'Häufige Fehler',
  },

  // Difficulty Levels
  difficulty: {
    beginner: 'Anfänger',
    intermediate: 'Fortgeschritten',
    advanced: 'Profi',
  },

  // Equipment
  equipment: {
    barbell: 'Langhantel',
    dumbbells: 'Kurzhanteln',
    bench: 'Bank',
    cable: 'Kabelzug',
    machine: 'Maschine',
    dip_bars: 'Dip-Stangen',
    pull_up_bar: 'Klimmzugstange',
    ez_bar: 'SZ-Stange',
    squat_rack: 'Squat Rack',
    kettlebell: 'Kettlebell',
    resistance_bands: 'Widerstandsbänder',
  },

  // Running
  running: {
    title: 'Laufen',
    heroTitle: 'Starte dein Lauftraining',
    heroSubtitle: 'Trainingspläne für jedes Level - vom Einsteiger bis zum Marathon',
    quickStart: 'Schnellstart',
    min: 'Min',
    trainingPlans: 'Trainingspläne',
    allWorkouts: 'Alle Workouts anzeigen',
    tips: 'Tipps',
    tipTitle: 'Lauf-Tipp des Tages',
    tipText: 'Starte langsam und höre auf deinen Körper. Konsistenz ist wichtiger als Geschwindigkeit.',
    planList: 'Trainingspläne',
    noPlansFound: 'Keine Pläne gefunden',
    noPlansFoundDesc: 'Versuche einen anderen Filter.',
    weeks: 'Wochen',
    week: 'Woche',
    runsPerWeek: 'Läufe/Woche',
    viewPlan: 'Plan ansehen',
    planNotFound: 'Plan nicht gefunden',
    selectWeek: 'Woche auswählen',
    weekFocus: 'Fokus dieser Woche',
    weekSchedule: 'Wochenplan',
    restDay: 'Ruhetag',
    startPlan: 'Plan starten',
    workoutNotFound: 'Workout nicht gefunden',
    warmup: 'Aufwärmen',
    mainSet: 'Hauptteil',
    cooldown: 'Auslaufen',
    startWorkout: 'Workout starten',
    // Active Screen
    totalTime: 'Gesamtzeit',
    steps: 'Schritte',
    pacePerKm: 'Tempo /km',
    cancel: 'Abbrechen',
    finish: 'Beenden',
    keepGoing: 'Weiter trainieren',
    endWorkout: 'Training beenden?',
    endWorkoutConfirm: 'Möchtest du das Training jetzt beenden?',
    cancelWorkout: 'Training abbrechen?',
    progressNotSaved: 'Dein Fortschritt wird nicht gespeichert.',
    continue: 'Weiter',
    upNext: 'Als Nächstes',
    skip: 'Überspringen',
    pause: 'Pause',
    resume: 'Fortsetzen',
    loading: 'Lädt...',
  },

  // Yoga
  yoga: {
    title: 'Yoga',
    heroTitle: 'Finde deine Balance',
    heroSubtitle: 'Sessions für Flexibilität, Kraft und Entspannung',
    quickSessions: 'Schnelle Sessions',
    min: 'Min',
    programs: 'Programme',
    allSessions: 'Alle Sessions anzeigen',
    benefits: 'Vorteile von Yoga',
    benefitFlexibility: 'Flexibilität',
    benefitFlexibilityDesc: 'Verbessere deine Beweglichkeit',
    benefitStrength: 'Kraft',
    benefitStrengthDesc: 'Stärke deinen Körper',
    benefitRelaxation: 'Entspannung',
    benefitRelaxationDesc: 'Reduziere Stress',
    benefitBalance: 'Balance',
    benefitBalanceDesc: 'Finde innere Ruhe',
    sessionList: 'Yoga Sessions',
    sessionNotFound: 'Session nicht gefunden',
    noSessionsFound: 'Keine Sessions gefunden',
    poses: 'Posen',
    focusAreas: 'Schwerpunkte',
    poseSequence: 'Posen-Abfolge',
    startSession: 'Session starten',
    bothSides: 'Beide Seiten',
    leftSide: 'Linke Seite',
    rightSide: 'Rechte Seite',
    poseNotFound: 'Pose nicht gefunden',
    description: 'Beschreibung',
    instructions: 'Anleitung',
    modifications: 'Anpassungen',
    contraindications: 'Kontraindikationen',
    weeks: 'Wochen',
    quickVideos: 'Quick Yoga Videos',
    quickVideosDesc: 'Folge YouTube-Sessions von Top-Yogalehrern',
    videoError: 'Video nicht verfügbar',
    videoErrorDesc: 'Das Video konnte nicht geöffnet werden.',
    videoDisclaimer: 'Diese Videos sind keine Kooperationen, sondern aus persönlichem Empfinden für gut befunden.',
  },

  // Calisthenics
  calisthenics: {
    title: 'Calisthenics',
    heroTitle: 'Meistere dein Körpergewicht',
    heroSubtitle: 'Kraft, Kontrolle und Athletik ohne Equipment',
    quickVideos: 'Quick Calisthenics Videos',
    quickVideosDesc: 'Folge YouTube-Sessions von Top-Athleten',
    benefits: 'Vorteile von Calisthenics',
    benefitStrength: 'Kraft',
    benefitStrengthDesc: 'Maximalkraft durch Körpergewicht',
    benefitFlexibility: 'Beweglichkeit',
    benefitFlexibilityDesc: 'Funktionelle Mobilität',
    benefitEndurance: 'Ausdauer',
    benefitEnduranceDesc: 'Muskuläre Kondition',
    benefitControl: 'Körperkontrolle',
    benefitControlDesc: 'Balance und Koordination',
    videoError: 'Video nicht verfügbar',
    videoErrorDesc: 'Das Video konnte nicht geöffnet werden.',
    videoDisclaimer: 'Diese Videos sind keine Kooperationen, sondern aus persönlichem Empfinden für gut befunden.',
  },

  // Homeworkout
  homeworkout: {
    title: 'Home Workout',
    subtitle: 'Trainiere überall ohne Equipment',
    noEquipment: 'Kein Equipment nötig',
    noEquipmentDesc: 'Alle Workouts funktionieren nur mit deinem Körpergewicht',
    categories: 'Kategorien',
    workouts: 'Workouts',
    videoError: 'Video nicht verfügbar',
    videoErrorMessage: 'Das Video konnte nicht geöffnet werden.',
    disclaimerButton: 'Hinweise zu den Videos',
    disclaimerTitle: 'Hinweis',
    disclaimerText: 'Die Videos stammen von unabhängigen YouTube-Creatorn. Wir übernehmen keine Verantwortung für die Inhalte. Trainiere immer verantwortungsvoll und höre auf deinen Körper.',
  },

  // Guide Screen
  guide: {
    title: 'Guide',
    subtitle: 'Wissen für dein Training',
    comingSoon: 'Mehr Inhalte kommen',
    comingSoonDesc: 'Wir arbeiten an weiteren Guides für dich.',
    articleNotFound: 'Artikel nicht gefunden',
    sections: 'Abschnitte',
    sources: 'Quellen',
    sourcesDescription: 'Wissenschaftliche Referenzen und weiterführende Literatur',

    // Guide Articles
    articles: {
      trainingBasics: {
        title: 'Trainingsgrundlagen',
        subtitle: 'Die wissenschaftlichen Prinzipien für effektives Training',
        sections: {
          intro: {
            title: 'Einführung',
          },
          progressiveOverload: {
            title: 'Progressive Überlastung',
          },
          frequency: {
            title: 'Trainingsfrequenz',
          },
          volume: {
            title: 'Trainingsvolumen',
          },
          intensity: {
            title: 'Trainingsintensität',
          },
          exercises: {
            title: 'Übungsauswahl',
          },
          rest: {
            title: 'Pausenzeiten',
          },
          periodization: {
            title: 'Periodisierung',
          },
          recovery: {
            title: 'Regeneration',
          },
          summary: {
            title: 'Zusammenfassung',
          },
        },
      },
      cardio: {
        title: 'Ausdauertraining',
        subtitle: 'Herzfrequenz-Zonen, HIIT vs. LISS und optimale Cardio-Strategien',
        sections: {
          intro: {
            title: 'Einführung',
          },
          energySystems: {
            title: 'Energiesysteme',
          },
          zones: {
            title: 'Herzfrequenz-Zonen',
          },
          lissHiit: {
            title: 'LISS vs. HIIT',
          },
          cardioMuscle: {
            title: 'Cardio & Muskelaufbau',
          },
          vo2max: {
            title: 'VO2max',
          },
          fatBurning: {
            title: 'Fettverbrennung',
          },
          programming: {
            title: 'Training planen',
          },
          summary: {
            title: 'Zusammenfassung',
          },
        },
      },
      fatLoss: {
        title: 'Fettverbrennung: Mythen & Fakten',
        subtitle: 'Die größten Irrtümer und die Biochemie dahinter',
        sections: {
          intro: {
            title: 'Einführung',
          },
          biochemistry: {
            title: 'Biochemie der Fettverbrennung',
          },
          mythZone: {
            title: 'Mythos: Fettverbrennungszone',
          },
          mythCarbs: {
            title: 'Mythos: Kohlenhydrate machen dick',
          },
          mythEvening: {
            title: 'Mythos: Abends essen macht dick',
          },
          mythMeals: {
            title: 'Mythos: Viele kleine Mahlzeiten',
          },
          mythSpot: {
            title: 'Mythos: Lokale Fettverbrennung',
          },
          mythFat: {
            title: 'Mythos: Fett macht fett',
          },
          whatWorks: {
            title: 'Was wirklich funktioniert',
          },
          summary: {
            title: 'Zusammenfassung',
          },
        },
      },
      supplements: {
        title: 'Supplement Guide',
        subtitle: 'Wissenschaftlich fundierte Empfehlungen zu Nahrungsergänzungsmitteln im Sport',
        sections: {
          intro: {
            title: 'Einführung',
          },
          creatine: {
            title: 'Kreatin',
          },
          protein: {
            title: 'Proteinpulver',
          },
          vitaminD: {
            title: 'Vitamin D',
          },
          omega3: {
            title: 'Omega-3-Fettsäuren',
          },
          caffeine: {
            title: 'Koffein',
          },
          safety: {
            title: 'Sicherheit & Qualität',
          },
          summary: {
            title: 'Zusammenfassung',
          },
        },
      },
      sleep: {
        title: 'Schlaf & Leistung',
        subtitle: 'Wie Schlaf deine sportliche Leistung und Regeneration beeinflusst',
        sections: {
          intro: {
            title: 'Einführung',
          },
          phases: {
            title: 'Schlafphasen & Zyklen',
          },
          hormones: {
            title: 'Hormonelle Regeneration',
          },
          performance: {
            title: 'Schlaf & sportliche Leistung',
          },
          hygiene: {
            title: 'Schlafhygiene',
          },
          nutrition: {
            title: 'Ernährung & Schlaf',
          },
          napping: {
            title: 'Powernaps & Mittagsschlaf',
          },
          tracking: {
            title: 'Schlaf tracken',
          },
          summary: {
            title: 'Zusammenfassung',
          },
        },
      },
      stress: {
        title: 'Stressmanagement',
        subtitle: 'Cortisol, Training und Strategien für eine bessere Balance',
        sections: {
          intro: {
            title: 'Einführung',
          },
          physiology: {
            title: 'Stressphysiologie',
          },
          cortisol: {
            title: 'Cortisol & Training',
          },
          trainingStress: {
            title: 'Trainingsstress managen',
          },
          acuteManagement: {
            title: 'Akutes Stressmanagement',
          },
          lifestyle: {
            title: 'Lifestyle-Faktoren',
          },
          adaptation: {
            title: 'Stress-Adaptation',
          },
          summary: {
            title: 'Zusammenfassung',
          },
        },
      },
      recovery: {
        title: 'Regeneration',
        subtitle: 'Die Wissenschaft hinter optimaler Erholung und Supercompensation',
        sections: {
          intro: {
            title: 'Einführung',
          },
          physiology: {
            title: 'Regenerationsphysiologie',
          },
          nutrition: {
            title: 'Ernährung für Regeneration',
          },
          activeRecovery: {
            title: 'Aktive Regeneration',
          },
          passiveRecovery: {
            title: 'Passive Regeneration',
          },
          massage: {
            title: 'Massage & Mobility',
          },
          programming: {
            title: 'Regeneration planen',
          },
          summary: {
            title: 'Zusammenfassung',
          },
        },
      },
      muscleBuilding: {
        title: 'Muskelaufbau',
        subtitle: 'Hypertrophie verstehen – Training, Ernährung und Wissenschaft',
        sections: {
          intro: {
            title: 'Einführung',
          },
          biology: {
            title: 'Biologie des Muskelwachstums',
          },
          trainingParameters: {
            title: 'Optimale Trainingsparameter',
          },
          repRanges: {
            title: 'Wiederholungsbereiche',
          },
          muscleGroups: {
            title: 'Training nach Muskelgruppen',
          },
          nutrition: {
            title: 'Ernährung für Muskelaufbau',
          },
          supplements: {
            title: 'Supplemente',
          },
          commonMistakes: {
            title: 'Häufige Fehler',
          },
          programs: {
            title: 'Trainingsprogramme',
          },
          summary: {
            title: 'Zusammenfassung',
          },
        },
      },
      flexibility: {
        title: 'Beweglichkeit & Mobilität',
        subtitle: 'Flexibilität verstehen – Methoden, Mythen und praktische Routinen',
        sections: {
          intro: {
            title: 'Einführung',
          },
          definitions: {
            title: 'Flexibilität vs. Mobilität',
          },
          methods: {
            title: 'Dehnmethoden',
          },
          myths: {
            title: 'Mythen über Beweglichkeit',
          },
          practical: {
            title: 'Praktische Umsetzung',
          },
          problemAreas: {
            title: 'Problemzonen & Lösungen',
          },
          loadedStretching: {
            title: 'Loaded Stretching',
          },
          foamRolling: {
            title: 'Foam Rolling',
          },
          programming: {
            title: 'Beweglichkeit programmieren',
          },
          summary: {
            title: 'Zusammenfassung',
          },
        },
      },
    },

    sport: {
      title: 'Sport & Training',
      desc: 'Grundlagen und Techniken',
      trainingBasics: 'Trainingsgrundlagen',
      trainingBasicsDesc: 'Die Basics für effektives Training',
      muscleBuilding: 'Muskelaufbau',
      muscleBuildingDesc: 'Hypertrophie-Training erklärt',
      fatLoss: 'Fettverbrennung',
      fatLossDesc: 'Effektiv Körperfett reduzieren',
      flexibility: 'Beweglichkeit',
      flexibilityDesc: 'Dehnen und Mobility',
      cardio: 'Ausdauer',
      cardioDesc: 'Herz-Kreislauf-Training',
    },

    health: {
      title: 'Gesundheit',
      desc: 'Körper und Wohlbefinden',
      sleep: 'Schlaf',
      sleepDesc: 'Bessere Erholung durch guten Schlaf',
      stress: 'Stressmanagement',
      stressDesc: 'Stress reduzieren und Resilienz aufbauen',
      recovery: 'Regeneration',
      recoveryDesc: 'Richtig erholen für mehr Leistung',
      hydration: 'Hydration',
      hydrationDesc: 'Warum Wasser so wichtig ist',
    },

    nutrition: {
      title: 'Ernährung',
      desc: 'Essen für deine Ziele',
      macros: 'Makronährstoffe',
      macrosDesc: 'Proteine, Kohlenhydrate und Fette',
      protein: 'Protein-Guide',
      proteinDesc: 'Wie viel Eiweiß brauchst du?',
      supplements: 'Supplements',
      supplementsDesc: 'Welche Ergänzungen sinnvoll sind',
      mealTiming: 'Mahlzeiten-Timing',
      mealTimingDesc: 'Wann du was essen solltest',
    },
  },
} as const;

export default de;
