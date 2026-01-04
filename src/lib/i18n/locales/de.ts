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
  },

  // Navigation
  nav: {
    home: 'Home',
    workout: 'Workout',
    plan: 'Plan',
    progress: 'Fortschritt',
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
    trainingDirections: 'Trainingsrichtungen',
    totalWorkouts: 'Gesamt Workouts',
    thisMonth: 'Diesen Monat',
    premium: {
      title: 'Premium Supplements',
      description: '20% Rabatt auf deine erste Bestellung',
      cta: 'Jetzt shoppen',
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
    empty: 'Leer',
    last: 'Letztes',
    ai: 'KI',
    templates: 'Vorlagen',
    startWorkout: 'Workout starten',
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
  },

  // Plan Screen
  plan: {
    title: 'Trainingsplan',
    subtitle: 'Dein Wochenplan',
    thisWeek: 'Diese Woche',
    edit: 'Bearbeiten',
    swap: 'Tauschen',
    skip: 'Überspringen',
    aiCoach: 'KI Coach',
    aiDescription: 'Lass unsere KI einen personalisierten Trainingsplan basierend auf deinen Zielen erstellen.',
    generatePlan: 'Plan generieren',
    rest: 'Ruhetag',
    activePlan: 'Aktiver Plan',
    today: 'Heute',
    exerciseCount: '{{count}} Übungen',
    startWorkout: 'Workout starten',
    restDay: 'Ruhetag',
    noPlan: 'Kein Trainingsplan',
    noPlanDescription: 'Erstelle deinen ersten Trainingsplan manuell oder lass dir von unserer KI helfen.',
    createManually: 'Manuell erstellen',
    createManuallyDesc: 'Erstelle deinen Plan Schritt für Schritt',
    createWithAI: 'Mit KI erstellen',
    createWithAIDesc: 'Lass dir einen personalisierten Plan generieren',
    managePlans: '{{count}} Trainingsplan(e) verwalten',
    openAICoach: 'KI Coach öffnen',
  },

  // Progress Screen
  progress: {
    title: 'Fortschritt',
    subtitle: 'Verfolge deine Fitness-Reise',
    week: 'Woche',
    month: 'Monat',
    year: 'Jahr',
    workoutDuration: 'Workout-Dauer',
    minutesPerDay: 'Minuten pro Tag',
    totalWorkouts: 'Gesamt Workouts',
    dayStreak: 'Tage Streak',
    totalVolume: 'Gesamtvolumen (kg)',
    bestStreak: 'Bester Streak',
    personalRecords: 'Persönliche Rekorde',
    noRecordsYet: 'Noch keine persönlichen Rekorde',
    noRecordsText: 'Schließe Workouts ab, um deine persönlichen Rekorde zu tracken',
    bodyStats: 'Körperstatistiken',
    weight: 'Gewicht',
    bodyFat: 'Körperfett',
    addMeasurement: '+ Messung hinzufügen',
  },

  // More Screen (Settings)
  more: {
    title: 'Mehr',
    guestUser: 'Gastnutzer',
    notLoggedIn: 'Nicht angemeldet',
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
    language: 'Sprache',
    languageSubtitle: 'App-Sprache ändern',

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
    deleteAccount: 'Konto löschen',
    deleteAccountSubtitle: 'Permanent löschen',

    // Support items
    helpCenter: 'Hilfe-Center',
    contactUs: 'Kontakt',
    rateApp: 'App bewerten',

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
    errorPasswordLength: 'Passwort muss mindestens 6 Zeichen haben',
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
    custom: 'Benutzerdefiniert',
  },

  // Sport Selection Screen
  sportSelection: {
    title: 'Sportart wählen',
    subtitle: 'Wähle die Sportart für deinen Trainingsplan',
    comingSoon: 'Demnächst',
  },

  // Plan List Screen
  planList: {
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
    duplicate: 'Duplizieren',
    deleteTitle: 'Plan löschen',
    deleteMessage: 'Möchtest du "{{name}}" wirklich löschen?',
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
} as const;

export default de;
