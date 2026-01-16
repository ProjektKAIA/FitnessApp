const en = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    remove: 'Remove',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    and: 'and',
    workouts: 'workouts',
    exercises: 'exercises',
    settings: 'Settings',
    viewAll: 'View All',
  },

  // Navigation
  nav: {
    home: 'Home',
    workout: 'Workout',
    plan: 'Plan',
    guide: 'Guide',
    progress: 'Progress',
    programs: 'Programs',
    you: 'You',
    more: 'More',
  },

  // Home Screen
  home: {
    greeting: 'Good Morning',
    greetingAfternoon: 'Good Afternoon',
    greetingEvening: 'Good Evening',
    readyToTrain: 'Ready to train?',
    startWorkout: 'Start Workout',
    thisWeek: 'This Week',
    totalVolume: 'Total Volume',
    weeklyGoal: 'Weekly Goal',
    weeklyGoalSettings: 'Set Weekly Goal',
    weeklyGoalDescription: 'How many workouts do you want to complete per week?',
    workoutsPerWeek: 'Workouts per week',
    directionPressed: 'Training Direction',
    comingSoon: 'Coming soon',
    trainingDirections: 'Training Directions',
    totalWorkouts: 'Total Workouts',
    thisMonth: 'This Month',
    premium: {
      title: 'Premium Supplements',
      description: 'Get 20% off your first order',
      cta: 'Shop Now',
    },
    ads: {
      import: {
        title: 'Plan Import',
        cta: 'Import',
      },
      plans: {
        title: 'Training Plans',
        description: 'Create personalized plans',
        cta: 'Explore',
      },
      health: {
        title: 'Connect Health',
        description: 'Sync your steps, calories & more',
        cta: 'Connect',
      },
      affiliate: {
        confirmTitle: 'External Website',
        confirmMessage: 'Do you want to be redirected to {{advertiser}}?',
      },
    },
  },

  // Workout Screen
  workout: {
    title: 'Start Workout',
    subtitle: 'Choose a template or create your own',
    inProgress: 'IN PROGRESS',
    exerciseCount: '{{count}} exercises',
    continueWorkout: 'Continue Workout',
    quickStart: 'Quick Start',
    quickStartDesc: 'Start an empty workout and add exercises',
    empty: 'Empty',
    last: 'Last',
    ai: 'AI',
    templates: 'Templates',
    startWorkout: 'Start Workout',
    restDayDesc: 'Your body needs rest for optimal results',
    startAnyway: 'Train Anyway',
    todaysWorkout: "Today's Workout",
    weekSchedule: 'Week Schedule',
    chooseSport: 'Choose your sport',
    sportCards: {
      fitnessDesc: 'Strength training & muscle building',
      customDesc: 'Create your own workout',
      runningDesc: 'Running & endurance',
      yogaDesc: 'Flexibility & relaxation',
      calisthenicsDesc: 'Bodyweight & body control',
    },
    lastWorkout: 'Last Workout',
    volume: 'Volume',
  },

  // Workout Active Screen
  workoutActive: {
    cancel: 'Cancel',
    finish: 'Finish',
    rest: 'Rest: {{time}}',
    skip: 'Skip',
    set: 'SET',
    kg: 'KG',
    reps: 'REPS',
    addSet: '+ Add Set',
    addExercise: '+ Add Exercise',
    addExerciseTitle: 'Add Exercise',
    endWorkout: 'End Workout?',
    endWorkoutMessage: 'Are you sure you want to end this workout? Your progress will be saved.',
    discard: 'Discard',
    newWorkout: 'New Workout',
    loadingWorkout: 'Loading workout...',
    lastTime: 'Last time',
    removeSet: 'Remove Set',
    deleteSelected: 'Delete ({{count}})',
    noExerciseDetails: 'No details available for this exercise yet.',
  },

  // Plan Screen
  plan: {
    title: 'Training Plan',
    subtitle: 'Your weekly schedule',
    thisWeek: 'This Week',
    edit: 'Edit',
    swap: 'Swap',
    skip: 'Skip',
    rest: 'Rest',
    activePlan: 'Active Plan',
    today: 'Today',
    exerciseCount: '{{count}} exercises',
    startWorkout: 'Start Workout',
    restDay: 'Rest Day',
    noPlan: 'No Training Plan',
    noPlanDescription: 'Create your first training plan or import an existing one.',
    createOptions: 'Create Plan',
    createPlan: 'Create Plan',
    createPlanDesc: 'Create or import your training plan',
    createManually: 'Create Manually',
    createManuallyDesc: 'Build your plan step by step',
    importFromChatGPT: 'Import from ChatGPT',
    importFromChatGPTDesc: 'Import your plan from your ChatGPT chat',
    managePlans: 'Manage {{count}} plan(s)',
    managePlansTitle: 'Training Plans',
  },

  // Progress Screen
  progress: {
    title: 'Progress',
    subtitle: 'Track your fitness journey',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    today: 'Today',
    activity: 'Activity',
    overview: 'Overview',
    weeklyActivity: 'Weekly Activity',
    workoutDuration: 'Workout Duration',
    minutesPerDay: 'Minutes per day',
    totalWorkouts: 'Workouts',
    currentStreak: 'Streak',
    dayStreak: 'Day Streak',
    totalVolume: 'Volume',
    bestStreak: 'Best Streak',
    personalRecords: 'Personal Records',
    noRecordsYet: 'No Personal Records Yet',
    noRecordsText: 'Complete workouts to start tracking your personal records',
    bodyStats: 'Body Stats',
    weight: 'Weight',
    bodyFat: 'Body Fat',
    muscle: 'Muscle Mass',
    addMeasurement: 'Add Measurement',
    allTime: 'All Time',
    days: 'days',
    rings: {
      move: 'Move',
      exercise: 'Exercise',
      stand: 'Stand',
    },
  },

  // More Screen (Settings)
  more: {
    title: 'More',
    guestUser: 'Your Name',
    notLoggedIn: 'Edit profile',
    edit: 'Edit',

    // Sections
    account: 'Account',
    preferences: 'Preferences',
    aiCoach: 'AI Coach',
    data: 'Data',
    support: 'Support',
    legal: 'Legal',

    // Account items
    profile: 'Profile',
    profileSubtitle: 'Edit your profile',
    security: 'Security',
    securitySubtitle: 'Password & 2FA',
    subscription: 'Subscription',
    subscriptionSubtitle: 'Free Plan',
    logout: 'Sign Out',
    logoutSubtitle: 'Sign out of your account',
    logoutTitle: 'Sign Out',
    logoutMessage: 'Are you sure you want to sign out?',

    // Preferences items
    notifications: 'Notifications',
    hapticFeedback: 'Haptic Feedback',
    units: 'Units',
    unitsMetric: 'Metric (kg, km)',
    unitsImperial: 'Imperial (lb, mi)',
    appearance: 'Appearance',
    appearanceSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    language: 'Language',
    languageSubtitle: 'Change app language',

    // Health Data
    healthData: 'Health Data',
    healthDataSubtitle: 'Apple Health & Health Connect',

    // AI Coach items
    aiSettings: 'AI Settings',
    aiSettingsSubtitle: 'Configure your AI coach',
    openaiKey: 'OpenAI API Key',
    openaiKeySubtitle: 'Bring your own key',
    chatgptImport: 'ChatGPT Import',
    chatgptImportSubtitle: 'Import from ChatGPT',

    // Data items
    exportData: 'Export Data',
    exportDataSubtitle: 'Download your workouts',
    importData: 'Import Data',
    importDataSubtitle: 'Import from other apps',
    backupData: 'Data Backup',
    backupDataSubtitle: 'Back up to iCloud or Google Drive',
    cloudSync: 'Cloud Sync',
    cloudSyncDisabled: 'Disabled',
    cloudSyncDisableTitle: 'Disable Cloud Sync?',
    cloudSyncDisableWarning: 'Your data will only be stored locally. If you lose your phone or uninstall the app, your saved data will be permanently lost.',
    cloudSyncDisableConfirm: 'Store locally',
    deleteAccount: 'Delete Account',
    deleteAccountSubtitle: 'Permanently delete',

    // Support items
    helpCenter: 'Help Center',
    contactUs: 'Contact Us',
    rateApp: 'Rate App',
    rateAppError: 'Could not open the App Store.',

    // Legal items
    terms: 'Terms of Service',
    termsSubtitle: 'Terms and Conditions',
    privacy: 'Privacy Policy',
    privacySubtitle: 'Data Protection',
    impressum: 'Imprint',
    impressumSubtitle: 'Legal Information',

    // Footer
    version: 'Version {{version}}',
    madeWith: 'Made by Kaia Shapes Web- und AppAgentur',
  },

  // Language Selection
  language: {
    title: 'Language',
    subtitle: 'Choose your preferred language',
    german: 'German',
    english: 'English',
    current: 'Current language',
  },

  // Profile
  profile: {
    editTitle: 'Edit Profile',
    personalInfo: 'Personal Information',
    bodyStats: 'Body Stats',
    name: 'Name',
    namePlaceholder: 'Your name',
    nameRequired: 'Please enter a name',
    birthday: 'Birthday',
    birthdayPlaceholder: 'Select date',
    years: 'years',
    weight: 'Weight',
    height: 'Height',
    bmi: 'BMI',
    changePhoto: 'Change Photo',
    chooseOption: 'Choose an option',
    takePhoto: 'Take Photo',
    chooseFromLibrary: 'Choose from Library',
    tapToChange: 'Tap to change',
    permissionRequired: 'Permission Required',
    permissionMessage: 'Please allow access to your photos in settings.',
    cameraPermissionMessage: 'Please allow access to the camera in settings.',
    saveError: 'Error saving. Please try again.',
    trainingGoals: 'Training Goals',
    weeklyGoal: 'Weekly Goal',
    weeklyGoalHint: 'How many times do you want to train per week?',
  },

  // Auth Screen
  auth: {
    logo: 'FitTrack',
    welcomeBack: 'Welcome back',
    createAccount: 'Create Account',
    forgotPassword: 'Forgot Password',
    loginSubtitle: 'Sign in to continue',
    registerSubtitle: 'Create a free account',
    forgotSubtitle: 'We will send you a reset link',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholder: 'Your password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Repeat password',
    forgotLink: 'Forgot password?',
    login: 'Sign In',
    register: 'Register',
    sendResetLink: 'Send Reset Link',
    noAccount: 'No account yet?',
    hasAccount: 'Already have an account?',
    backToLogin: 'Back to login',
    devLogin: 'DEV LOGIN (Skip Auth)',

    // Errors
    errorEmailRequired: 'Please enter email',
    errorPasswordRequired: 'Please enter password',
    errorPasswordLength: 'Password must be at least 8 characters',
    errorPasswordUppercase: 'Password must contain at least one uppercase letter',
    errorPasswordLowercase: 'Password must contain at least one lowercase letter',
    errorPasswordNumber: 'Password must contain at least one number',
    errorPasswordMismatch: 'Passwords do not match',
    successResetEmail: 'Password reset email has been sent',

    // Social
    socialLoginMessage: '{{provider}} login will be available after Firebase configuration.',
  },

  // Consent Screen
  consent: {
    title: 'Welcome to FitnessApp',
    subtitle: 'Before you start, we need your consent to some important points.',
    legalSection: 'Legal Information',
    privacyCheckbox: 'I have read and accept the Privacy Policy.',
    termsCheckbox: 'I accept the Terms and Conditions.',
    trackingSection: 'App Tracking',
    trackingDescription: 'We would like to track your activity across apps and websites of other companies to show you personalized advertising. This helps us keep the app free.',
    trackingNote: 'You can change this setting at any time in the system settings.',
    denyTracking: 'Do not allow tracking',
    allowTracking: 'Allow',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms and Conditions',
  },

  // Legal Screens
  legal: {
    termsTitle: 'Terms',
    termsHeader: 'Terms of Service',
    privacyTitle: 'Privacy',
    privacyHeader: 'Privacy Policy',
    impressumTitle: 'Imprint',
    back: 'Back',
    lastUpdated: 'Last updated: January 2025',
  },

  // Days
  days: {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
    short: {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
    },
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },

  // Training Directions
  directions: {
    gym: 'Gym',
    calisthenics: 'Calisthenics',
    cardio: 'Cardio',
    yoga: 'Yoga',
    mobility: 'Mobility',
    custom: 'Custom',
  },

  // Workout Templates
  templates: {
    pushDay: 'Push Day',
    pullDay: 'Pull Day',
    legDay: 'Leg Day',
    upperBody: 'Upper Body',
    fullBodyHiit: 'Full Body HIIT',
    morningYoga: 'Morning Yoga',
    activeRecovery: 'Active Recovery',
    restCardio: 'Rest / Cardio',
  },

  // Muscle Groups
  muscles: {
    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    biceps: 'Biceps',
    triceps: 'Triceps',
    arms: 'Arms',
    legs: 'Legs',
    glutes: 'Glutes',
    core: 'Core',
    fullBody: 'Full Body',
  },

  muscleGroups: {
    all: 'All',
    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    biceps: 'Biceps',
    triceps: 'Triceps',
    arms: 'Arms',
    legs: 'Legs',
    glutes: 'Glutes',
    core: 'Core',
    full_body: 'Full Body',
  },

  // Sport Types
  sportTypes: {
    fitness: 'Fitness',
    running: 'Running',
    cycling: 'Cycling',
    martial_arts: 'Martial Arts',
    swimming: 'Swimming',
    yoga: 'Yoga',
    calisthenics: 'Calisthenics',
    custom: 'Custom Workout',
  },

  // Sport Selection Screen
  sportSelection: {
    title: 'Choose Sport',
    subtitle: 'Select the sport type for your training plan',
    comingSoon: 'Coming Soon',
  },

  // Plan List Screen
  planList: {
    title: 'Training Plans',
    emptyTitle: 'No Plans',
    emptySubtitle: 'Create your first training plan',
    createFirst: 'Create Plan',
    createNew: 'Create New Plan',
    active: 'Active',
    sourceManual: 'Manual',
    sourceAI: 'AI Generated',
    sourceImported: 'Imported',
    sourceTemplate: 'Template',
    workoutsPerWeek: '{{count}} workouts/week',
    activate: 'Activate',
    edit: 'Edit',
    start: 'Start',
    deleteTitle: 'Delete Plan',
    deleteMessage: 'Do you really want to delete "{{name}}"?',
    noWorkoutToday: 'No workout today',
    noWorkoutTodayMessage: 'No workout is planned for today in this plan.',
    viewPlan: 'View Plan',
    startAnyway: 'Start anyway',
    view: 'View',
  },

  // Plan Detail Screen
  planDetail: {
    startWorkout: 'Start Workout',
  },

  // Plan Editor Screen
  planEditor: {
    createTitle: 'New Plan',
    editTitle: 'Edit Plan',
    planName: 'Plan Name',
    planNamePlaceholder: 'e.g. Push-Pull-Legs',
    description: 'Description (optional)',
    descriptionPlaceholder: 'Describe your training plan...',
    weeklySchedule: 'Weekly Schedule',
    restDay: 'Rest Day',
    exerciseCount: '{{count}} exercises',
    addWorkout: 'Add Workout',
    error: 'Error',
    nameRequired: 'Please enter a name for the plan',
    nameRequiredFirst: 'Please enter a name for the plan first',
    removeWorkoutTitle: 'Remove Workout',
    removeWorkoutMessage: 'Do you really want to remove this workout?',
  },

  // Training Plan Detail Screen
  trainingPlan: {
    notFound: 'Plan not found',
    trainingDays: 'Days',
    exercises: 'Exercises',
    sets: 'Sets',
    activatePlan: 'Activate Plan',
    activePlan: 'Active Plan',
    weeklySchedule: 'Weekly Schedule',
    estimatedDuration: 'Estimated Duration',
  },

  // Workout Day Editor Screen
  workoutEditor: {
    workoutName: 'Workout Name',
    workoutNamePlaceholder: 'e.g. Push Day',
    direction: 'Training Type',
    exercises: 'Exercises',
    exerciseCount: '{{count}} exercises',
    noExercises: 'No exercises yet',
    addFirstExercise: 'Add First Exercise',
    addExercise: 'Add Exercise',
    sets: 'Sets',
    reps: 'Reps',
    rest: 'Rest (s)',
    error: 'Error',
    nameRequired: 'Please enter a name for the workout',
    nameRequiredFirst: 'Please enter a name first',
    removeExerciseTitle: 'Remove Exercise',
    removeExerciseMessage: 'Do you really want to remove this exercise?',
  },

  // Exercise Picker Screen
  exercisePicker: {
    title: 'Select Exercise',
    searchPlaceholder: 'Search exercises...',
    noResults: 'No exercises found',
  },

  // Exercise Categories
  exerciseCategories: {
    compound: 'Compound',
    isolation: 'Isolation',
  },

  // Exercises
  exercises: {
    benchPress: 'Bench Press',
    inclineDumbbellPress: 'Incline Dumbbell Press',
    cableFlyes: 'Cable Flyes',
    overheadPress: 'Overhead Press',
    lateralRaises: 'Lateral Raises',
    tricepPushdowns: 'Tricep Pushdowns',
  },

  // Workout History
  workoutHistory: {
    title: 'Your Sport History',
    emptyTitle: 'No Activities Yet',
    emptyText: 'Start your first training to see your history',
    emptyFilteredTitle: 'No Activities Found',
    emptyFilteredText: 'You have no {{direction}} activities yet',
    duration: 'Duration',
    volume: 'Volume',
    all: 'All',
    filteredResults: '{{count}} activity(s) found',
    clearFilter: 'Clear Filter',
    poses: 'Poses',
    distance: 'Distance',
    pace: 'Pace',
  },

  // Workout Detail
  workoutDetail: {
    title: 'Workout Details',
    notFound: 'Workout not found',
    duration: 'Duration',
    totalKg: 'Total (kg)',
    exercises: 'Exercises',
    set: 'Set',
    weight: 'Weight',
    reps: 'Reps',
    volume: 'Volume',
    totalVolume: 'Total',
    notes: 'Notes',
    description: 'Description',
    noExercises: 'No exercises',
    nextProgram: 'Next Program',
    startWorkout: 'Start Workout',
  },

  // Streak Detail
  streakDetail: {
    title: 'Your Streak',
    currentStreak: 'Days in a row',
    longestStreak: 'Longest Streak',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    last12Weeks: 'Last 12 Weeks',
    less: 'Less',
    more: 'More',
    daysUntilRecord: '{{days}} more days to beat your record!',
    newRecord: 'New Record! Keep it up!',
    tips: 'Tips for your streak',
    tip1: 'Train at the same time every day to build a routine.',
    tip2: 'Even short workouts count - 15 minutes is better than nothing.',
    tip3: 'Plan your workouts in advance in your calendar.',
  },

  // Health Integration
  health: {
    title: 'Health Data',
    settings: 'Settings',
    dashboard: 'Dashboard',
    enable: 'Enable Health Data',
    enabled: 'Enabled',
    notSupported: 'Health data is not supported on this device.',
    disabled: 'Disabled',
    connected: 'Connected',
    notConnected: 'Not connected',
    connectNow: 'Connect Now',

    // Permissions
    permissions: {
      title: 'Permissions',
      subtitle: 'Choose the data we can access',
      granted: 'Granted',
      denied: 'Denied',
      notDetermined: 'Not determined',
      request: 'Request Permission',
      openSettings: 'Open Settings',
    },

    // Data Types
    dataTypes: {
      steps: 'Steps',
      distance: 'Distance',
      calories: 'Calories',
      activeCalories: 'Active Calories',
      heartRate: 'Heart Rate',
      restingHeartRate: 'Resting Heart Rate',
      workouts: 'Workouts',
    },

    // Summary
    summary: {
      today: 'Today',
      steps: 'Steps',
      stepsGoal: 'Steps Goal',
      distance: 'Distance',
      calories: 'Calories',
      activeCalories: 'Active Cal.',
      burned: 'burned',
      km: 'km',
      m: 'm',
      kcal: 'kcal',
      active: 'Active',
    },

    // Connect
    connect: {
      title: 'Connect Health',
      description: 'Connect Apple Health or Health Connect for detailed activity data',
    },

    // Heart Rate
    heartRate: {
      title: 'Heart Rate',
      current: 'Current',
      resting: 'Resting',
      average: 'Average',
      min: 'Min',
      max: 'Max',
      bpm: 'BPM',
      zones: 'HR Zones',
      zone: {
        rest: 'Rest',
        fatBurn: 'Fat Burn',
        cardio: 'Cardio',
        peak: 'Peak',
        max: 'Maximum',
      },
    },

    // Training Load
    trainingLoad: {
      title: 'Training Load',
      acute: 'Acute (7 days)',
      chronic: 'Chronic (28 days)',
      ratio: 'Ratio',
      level: {
        low: 'Low',
        moderate: 'Moderate',
        high: 'High',
        veryHigh: 'Very High',
      },
      recommendation: {
        low: 'You can increase intensity',
        moderate: 'Good balance, keep it up!',
        high: 'Make sure to get enough rest',
        veryHigh: 'Increased injury risk - take more breaks',
      },
    },

    // Sync
    sync: {
      now: 'Sync Now',
      syncing: 'Syncing...',
      lastSync: 'Last Sync',
      never: 'Never',
      success: 'Synced successfully',
      error: 'Sync failed',
    },

    // Privacy
    privacy: {
      title: 'Privacy Notice',
      description: 'Your health data is stored only locally on your device and never transmitted to our servers.',
      learnMore: 'Learn more',
    },

    // Activity Chart
    activity: {
      title: 'Activity',
      week: 'Week',
      month: 'Month',
      noData: 'No data available',
    },

    // Workouts from Health
    workouts: {
      title: 'Recent Workouts',
      fromHealth: 'From Health App',
      noWorkouts: 'No workouts',
      duration: 'Duration',
      calories: 'Calories',
      heartRate: 'Heart Rate',
    },

    // Platforms
    platform: {
      appleHealth: 'Apple Health',
      healthConnect: 'Health Connect',
    },
  },

  // AI Coach
  aiCoach: {
    title: 'AI Coach',
    subtitle: 'Your personal fitness assistant',
    howItWorks: 'How it works',
    howItWorksText: 'Import your ChatGPT conversations about fitness and training plans. The app automatically extracts relevant information and can use it for your training.',
    importFromChatGPT: 'Import from ChatGPT',
    importDescription: 'Export your chats and import them here',
    importedChats: 'Imported Chats',
    active: 'Active',
    importedOn: 'Imported on {{date}}',
    messageCount: '{{count}} messages',
    hasPlan: 'Training plan detected',
    viewChat: 'View Chat',
    noChatsYet: 'No Chats Yet',
    noChatsDescription: 'Import your ChatGPT conversations to activate your AI Coach.',
    removeChat: 'Remove Chat',
    removeChatConfirm: 'Do you really want to remove "{{title}}"?',
    chatNotFound: 'Chat not found',
    extractedPlan: 'Extracted Training Plan',
    usePlan: 'Use Plan',
    conversation: 'Conversation',
    you: 'You',

    // Import Screen
    importTitle: 'ChatGPT Import',
    importSubtitle: 'Import your ChatGPT conversations',
    howToExport: 'How to export from ChatGPT:',
    step1: 'Open ChatGPT at chat.openai.com',
    step2: 'Go to Settings → Data Controls',
    step3: 'Click on "Export Data"',
    step4: 'Download the ZIP file and select it here',
    selectFile: 'Select File',
    importError: 'Import Error',
    unknownError: 'An unknown error occurred',
    importSuccess: 'Import Successful',
    chatImported: '"{{title}}" has been imported',
    foundConversations: '{{count}} conversations found',
    fitnessOnly: 'Fitness Only',
    noFitnessChats: 'No fitness-related chats found',
    showAllChats: 'Show all chats',
    imported: 'Imported',
  },

  // Onboarding
  onboarding: {
    welcome: {
      greeting: 'Welcome',
      title: 'Take your body to the peak',
      subtitle: 'Start your fitness journey now with personalized training plans',
      letsGo: "Let's Go",
      getStarted: "Let's Go",
      skip: 'Skip',
    },
    gender: {
      title: 'What is your gender?',
      subtitle: 'Helps us customize your training',
      female: 'Female',
      male: 'Male',
    },
    height: {
      title: 'How tall are you?',
      subtitle: 'Used for calculations',
      cm: 'cm',
    },
    weight: {
      title: 'How much do you weigh?',
      subtitle: 'Used for calculations',
      kg: 'kg',
    },
    sport: {
      title: 'What are your favorite sports?',
      subtitle: 'Select one or more',
      sports: {
        bodybuilding: 'Bodybuilding',
        tennis: 'Tennis',
        basketball: 'Basketball',
        football: 'Football',
        volleyball: 'Volleyball',
        badminton: 'Badminton',
        shooting: 'Shooting',
        running: 'Running',
        swimming: 'Swimming',
        yoga: 'Yoga',
        kickboxing: 'Kickboxing',
        karate: 'Karate',
      },
      options: {
        bodybuilding: 'Bodybuilding',
        tennis: 'Tennis',
        basketball: 'Basketball',
        football: 'Football',
        volleyball: 'Volleyball',
        badminton: 'Badminton',
        shooting: 'Shooting',
        running: 'Running',
        swimming: 'Swimming',
        yoga: 'Yoga',
        kickboxing: 'Kickboxing',
        karate: 'Karate',
      },
    },
    goal: {
      title: 'What is your main goal?',
      subtitle: 'We will adjust your training accordingly',
      goals: {
        fat_burning: 'Fat Burning',
        fitness: 'General Fitness',
        strengthen_muscles: 'Build Muscles',
        increased_metabolism: 'Boost Metabolism',
        weight_gain: 'Weight Gain',
      },
      options: {
        fat_burning: 'Fat Burning',
        fitness: 'General Fitness',
        strengthen_muscles: 'Build Muscles',
        increased_metabolism: 'Boost Metabolism',
        weight_gain: 'Weight Gain',
      },
    },
    back: 'Back',
    continue: 'Continue',
    finish: 'Finish',
    step: 'Step {{current}} of {{total}}',
  },

  // Programs Screen
  programs: {
    title: 'Programs',
    subtitle: 'Choose your training program',
    featuredPrograms: 'Featured Programs',
    allPrograms: 'All Programs',
    selectLevel: 'Select Level',
    level: 'Level {{level}}',
    levelDescription: {
      1: 'Beginner - Light intensity',
      2: 'Intermediate - Medium intensity',
      3: 'Advanced - High intensity',
      4: 'Expert - Maximum intensity',
    },
    categories: {
      yoga: 'Yoga Time',
      meditation: 'Meditation Time',
      bodybuilding: 'Bodybuilding Time',
      cardio: 'Cardio Time',
      stretching: 'Stretching Time',
    },
    categoryDescriptions: {
      yoga: 'Relaxation & Flexibility',
      meditation: 'Peace & Focus',
      bodybuilding: 'Strength & Muscle Building',
      cardio: 'Endurance & Cardiovascular',
      stretching: 'Stretching & Mobility',
    },
    startProgram: 'Start Program',
  },

  // You Screen
  you: {
    title: 'You',
    guest: 'Guest',
    connectHealth: 'Connect Health',
    healthStats: 'Health Stats',
    steps: 'Steps',
    stepsUnit: 'steps',
    calories: 'Calories',
    activeMinutes: 'Active Min.',
    heartRate: 'Heart Rate',
    weight: 'Weight',
    bloodPressure: 'Blood Pressure',
    pulse: 'Pulse',
    history: 'History',
    goal: 'Goal',
    activity: 'Activity',
    streak: 'Streak',
    workouts: 'Workouts',
    caloriesSection: 'Calories',
    addCalories: 'Add Calories',
    editCalorieGoal: 'Edit Calorie Goal',
    adjustGoal: 'Adjust Goal',
    dailyCalorieGoal: 'Daily Calorie Goal',
    dailyNeed: 'Daily Need',
    consumed: 'Consumed',
    workoutBurned: 'Workout Burned',
    target: 'Target',
    balance: 'Balance',
    deficit: 'Deficit',
    surplus: 'Surplus',
    maintain: 'Maintain',
    calculateDailyNeed: 'Calculate Daily Need',
    myGoal: 'My Goal',
    addGoal: 'Add Goal',
    setGoal: 'Set your goal',
    goalPlaceholder: 'e.g. Reach 75kg',
    until: 'Until',
    addHealthData: 'Add Health Data',
    todayActivity: 'Today',
    editRings: 'Edit Rings',
    activeRings: 'Active Rings',
    addRing: 'Add Ring',
    currentValue: 'Current Value',
    ring: {
      steps: 'Steps',
      calories: 'Calories',
      activeMinutes: 'Active Minutes',
      heartRate: 'Heart Rate',
      distance: 'Distance',
      water: 'Water',
    },
  },

  // Weight History Screen
  weightHistory: {
    title: 'Weight History',
    noEntries: 'No weight entries yet',
    date: 'Date',
    weight: 'Weight',
    change: 'Change',
  },

  // Contact Screen
  contact: {
    title: 'Contact',
    infoTitle: 'Get in touch!',
    infoText: 'Have questions, feedback or suggestions? We would love to hear from you.',
    clickHere: 'Click here',
    formTitle: 'Contact Form',
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    subject: 'Subject',
    subjectPlaceholder: 'What is it about?',
    message: 'Message',
    messagePlaceholder: 'Your message to us...',
    send: 'Send Message',
    sending: 'Sending...',
    successTitle: 'Thank you!',
    successMessage: 'Your email app has been opened. Send the message to contact us.',
    noMailAppTitle: 'No Email App',
    noMailAppMessage: 'Please send your message directly to: {{email}}',
    errorName: 'Please enter your name.',
    errorEmail: 'Please enter your email address.',
    errorSubject: 'Please enter a subject.',
    errorMessage: 'Please write a message.',
    errorSending: 'Error opening email app.',
    alternativeTitle: 'Direct Email',
    alternativeText: 'You can also send us an email directly.',
  },

  // Security Screen
  security: {
    title: 'Security',
    biometricTitle: 'Biometric Unlock',
    biometricSubtitle: 'Unlock app with Face ID or fingerprint',
    biometricPrompt: 'Confirm your identity',
    biometricEnabled: 'Biometric unlock has been enabled.',
    biometricDisabled: 'Biometric unlock has been disabled.',
    usePassword: 'Use PIN',
    noBiometric: 'No biometric unlock available',
    noBiometricDesc: 'Your device does not support biometric authentication or none is set up.',
    infoTextLocal: 'With biometric unlock you can add extra protection to the app. Your data is stored locally on your device.',
    biometricNotAvailable: 'Biometric authentication is not available on this device.',
    biometricError: 'Error during biometric authentication.',
    appLocked: 'App Locked',
    authenticateToUnlock: 'Please authenticate to unlock the app.',
  },

  // Data Export Screen
  dataExport: {
    title: 'Export Data',
    infoTitle: 'Your Data',
    infoText: 'Export your fitness data as a JSON file. You can import this file later.',
    selectData: 'Select Data',
    options: {
      profile: 'Profile',
      profileDesc: 'Name, height, weight, goals',
      workouts: 'Workouts',
      workoutsDesc: 'All your training sessions',
      health: 'Health Data',
      healthDesc: 'Steps, calories, activities',
      settings: 'Settings',
      settingsDesc: 'App settings & preferences',
    },
    exportButton: 'Export Data',
    exporting: 'Exporting...',
    noSelection: 'Please select at least one data category.',
    success: 'Data has been exported successfully.',
    error: 'Error exporting data.',
    shareTitle: 'FrameFit Data Export',
    disclaimer: 'The exported file contains your personal data. Keep it safe.',
  },

  // Data Import Screen
  dataImport: {
    title: 'Import Data',
    infoTitle: 'Restore Data',
    infoText: 'Import a previously exported JSON file to restore your data.',
    selectFile: 'Select File',
    exportDate: 'Export Date',
    selectData: 'To Import',
    available: 'Available',
    notAvailable: 'Not available',
    workoutCount: '{{count}} workouts',
    importButton: 'Import Data',
    importing: 'Importing...',
    noSelection: 'Please select at least one data category.',
    confirmTitle: 'Import Data?',
    confirmMessage: 'The selected data will be overwritten. This action cannot be undone.',
    import: 'Import',
    success: 'Data has been imported successfully.',
    error: 'Error importing data.',
    invalidFile: 'The selected file is invalid or corrupted.',
    disclaimer: 'Only import files that you exported yourself.',
  },

  // Data Backup Screen
  backup: {
    title: 'Data Backup',
    infoTitle: 'Back up your data',
    infoText: 'Back up your data to the cloud or locally. You keep full control over your data.',
    currentDataSize: 'Current data size:',
    storageLocation: 'Storage Location',
    storageDesc: {
      local: 'Save on this device',
      icloud: 'Save to your iCloud Drive',
      gdrive: 'Save to your Google Drive',
    },
    autoBackup: 'Automatic Backup',
    frequency: {
      after_workout: 'After every workout',
      daily: 'Daily',
      weekly: 'Weekly',
      manual: 'Manual only',
    },
    createBackup: 'Create Backup',
    restoreBackup: 'Restore Backup',
    lastBackup: 'Last Backup',
    never: 'Never',
    size: 'Size',
    location: 'Location',
    history: 'Backup History',
    success: 'Success',
    error: 'Error',
    backupCreated: 'Backup "{{fileName}}" has been created.',
    backupSavedTo: 'Backup has been saved to {{location}}.',
    backupFailed: 'Backup could not be created.',
    restoreTitle: 'Restore Backup',
    restoreWarning: 'Warning: Restoring may overwrite your current data. Do you want to continue?',
    restore: 'Restore',
    restoreOptions: 'Restore Options',
    restoreOptionsDesc: 'Backup from {{date}} (Version {{version}})',
    replaceAll: 'Replace All',
    mergeData: 'Merge with current data',
    restoreComplete: 'Data has been restored successfully.',
    restoreFailed: 'Restore failed.',
    loadFailed: 'File could not be loaded.',
    invalidBackup: 'The file is not a valid ShapyFit backup.',
    icloudOnlyIOS: 'iCloud is only available on iOS devices.',
    gdriveOnlyAndroid: 'Google Drive is only available on Android devices.',
    privacyNote: 'Your data is saved directly to your personal cloud storage. We have no access to your backups.',
  },

  // Delete Account Screen
  deleteAccount: {
    title: 'Delete Data',
    warningTitle: 'Warning!',
    warningText: 'Deleting all data is permanent and cannot be undone.',
    whatWillBeDeleted: 'What will be deleted?',
    deleteItem1: 'Your profile and all personal data',
    deleteItem2: 'All your workouts and training plans',
    deleteItem3: 'Your settings and preferences',
    deleteItem4: 'Imported ChatGPT conversations',
    confirmSection: 'Confirmation',
    typeToConfirm: 'Type "{{word}}" to confirm',
    confirmWord: 'DELETE',
    deleteButton: 'Delete All Data',
    deleting: 'Deleting...',
    finalConfirmTitle: 'Are you sure?',
    finalConfirmMessage: 'All your data will be permanently deleted. This action cannot be undone.',
    deleteForever: 'Delete Forever',
    successTitle: 'Data Deleted',
    successMessage: 'All your data has been successfully deleted.',
    error: 'Error deleting data. Please try again later.',
    disclaimer: 'Create a backup before deleting your data.',
  },

  // Fitness Questionnaire
  questionnaire: {
    next: 'Next',
    finish: 'Create Plan',
    experience: {
      title: 'What\'s your experience level?',
      subtitle: 'This helps us find the right plan for you',
      beginner: 'Beginner',
      beginnerDesc: 'New to training or less than 6 months experience',
      intermediate: 'Intermediate',
      intermediateDesc: '6 months to 2 years of regular training',
      advanced: 'Advanced',
      advancedDesc: 'Over 2 years of consistent training',
    },
    goal: {
      title: 'What\'s your main goal?',
      subtitle: 'Choose the goal that matters most to you',
      muscle: 'Build Muscle',
      strength: 'Increase Strength',
      loseWeight: 'Lose Weight',
      fitness: 'General Fitness',
    },
    days: {
      title: 'How often do you want to train?',
      subtitle: 'Days per week',
      two: '2 Days',
      three: '3 Days',
      four: '4 Days',
      five: '5 Days',
      six: '6 Days',
    },
    duration: {
      title: 'How long per workout?',
      subtitle: 'Average time per session',
      thirty: '30 Minutes',
      fortyFive: '45 Minutes',
      sixty: '60 Minutes',
      ninety: '90 Minutes',
    },
    equipment: {
      title: 'What equipment do you have?',
      subtitle: 'Choose your training environment',
      gym: 'Full Gym',
      gymDesc: 'Full access to machines and weights',
      home: 'Home Gym',
      homeDesc: 'Dumbbells, kettlebells, maybe a rack',
      minimal: 'Minimal',
      minimalDesc: 'Bodyweight only or resistance bands',
    },
    focus: {
      title: 'Which areas do you want to focus on?',
      subtitle: 'Multiple selection possible',
      upper: 'Upper Body',
      lower: 'Lower Body',
      core: 'Core / Abs',
      full: 'Full Body',
    },
  },

  // Exercise Detail Screen
  exerciseDetail: {
    notFound: 'Not Found',
    exerciseNotFound: 'Exercise not found',
    muscles: 'Muscles Worked',
    primaryMuscle: 'Primary',
    secondaryMuscles: 'Secondary',
    equipment: 'Equipment Required',
    instructions: 'Instructions',
    breathing: 'Breathing',
    tips: 'Tips',
    commonMistakes: 'Common Mistakes',
    moreDetails: 'More Details',
  },

  // Difficulty Levels
  difficulty: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  },

  // Equipment
  equipment: {
    barbell: 'Barbell',
    dumbbells: 'Dumbbells',
    bench: 'Bench',
    cable: 'Cable Machine',
    machine: 'Machine',
    dip_bars: 'Dip Bars',
    pull_up_bar: 'Pull-up Bar',
    ez_bar: 'EZ Bar',
    squat_rack: 'Squat Rack',
    kettlebell: 'Kettlebell',
    resistance_bands: 'Resistance Bands',
  },

  // Running
  running: {
    title: 'Running',
    heroTitle: 'Start Running',
    heroSubtitle: 'Training plans for every goal',
    quickStart: 'Quick Start',
    quickStartDesc: 'Start an easy run without a plan',
    videos: 'Running Videos',
    trainingPlans: 'Training Plans',
    quickWorkouts: 'Quick Workouts',
    min: 'min',
    km: 'km',
    pace: 'Pace',
    distance: 'Distance',
    duration: 'Duration',
    allWorkouts: 'View All Workouts',
    tips: 'Tips',
    tipTitle: 'Running Tip of the Day',
    tipText: 'Start slow and listen to your body. Consistency is more important than speed.',
    planList: 'Training Plans',
    noPlansFound: 'No plans found',
    noPlansFoundDesc: 'Try a different filter.',
    weeks: 'Weeks',
    week: 'Week',
    runsPerWeek: 'Runs/Week',
    viewPlan: 'View Plan',
    planNotFound: 'Plan not found',
    selectWeek: 'Select Week',
    weekFocus: 'This Week\'s Focus',
    weekSchedule: 'Week Schedule',
    restDay: 'Rest Day',
    startPlan: 'Start Plan',
    workoutNotFound: 'Workout not found',
    warmup: 'Warm-up',
    mainSet: 'Main Set',
    cooldown: 'Cool-down',
    startWorkout: 'Start Workout',
    // Active Screen
    totalTime: 'Total Time',
    steps: 'Steps',
    pacePerKm: 'Pace /km',
    cancel: 'Cancel',
    finish: 'Finish',
    keepGoing: 'Keep going',
    endWorkout: 'End workout?',
    endWorkoutConfirm: 'Do you want to end the workout now?',
    cancelWorkout: 'Cancel workout?',
    progressNotSaved: 'Your progress will not be saved.',
    continue: 'Continue',
    upNext: 'Up Next',
    skip: 'Skip',
    pause: 'Pause',
    resume: 'Resume',
    loading: 'Loading...',
  },

  // Yoga
  yoga: {
    title: 'Yoga',
    heroTitle: 'Find Your Balance',
    heroSubtitle: 'Sessions for flexibility, strength and relaxation',
    quickSessions: 'Quick Sessions',
    min: 'Min',
    programs: 'Programs',
    allSessions: 'View All Sessions',
    benefits: 'Benefits of Yoga',
    benefitFlexibility: 'Flexibility',
    benefitFlexibilityDesc: 'Improve your mobility',
    benefitStrength: 'Strength',
    benefitStrengthDesc: 'Strengthen your body',
    benefitRelaxation: 'Relaxation',
    benefitRelaxationDesc: 'Reduce stress',
    benefitBalance: 'Balance',
    benefitBalanceDesc: 'Find inner peace',
    sessionList: 'Yoga Sessions',
    sessionNotFound: 'Session not found',
    noSessionsFound: 'No sessions found',
    poses: 'Poses',
    focusAreas: 'Focus Areas',
    poseSequence: 'Pose Sequence',
    startSession: 'Start Session',
    bothSides: 'Both Sides',
    leftSide: 'Left Side',
    rightSide: 'Right Side',
    poseNotFound: 'Pose not found',
    description: 'Description',
    instructions: 'Instructions',
    modifications: 'Modifications',
    contraindications: 'Contraindications',
    weeks: 'Weeks',
    quickVideos: 'Quick Yoga Videos',
    quickVideosDesc: 'Follow YouTube sessions from top yoga teachers',
    videoError: 'Video unavailable',
    videoErrorDesc: 'The video could not be opened.',
    videoDisclaimer: 'These videos are not sponsored, they are personal recommendations.',
  },

  // Calisthenics
  calisthenics: {
    title: 'Calisthenics',
    heroTitle: 'Master Your Bodyweight',
    heroSubtitle: 'Strength, control and athleticism without equipment',
    quickVideos: 'Quick Calisthenics Videos',
    quickVideosDesc: 'Follow YouTube sessions from top athletes',
    benefits: 'Benefits of Calisthenics',
    benefitStrength: 'Strength',
    benefitStrengthDesc: 'Maximum strength through bodyweight',
    benefitFlexibility: 'Flexibility',
    benefitFlexibilityDesc: 'Functional mobility',
    benefitEndurance: 'Endurance',
    benefitEnduranceDesc: 'Muscular conditioning',
    benefitControl: 'Body Control',
    benefitControlDesc: 'Balance and coordination',
    videoError: 'Video unavailable',
    videoErrorDesc: 'The video could not be opened.',
    videoDisclaimer: 'These videos are not sponsored, they are personal recommendations.',
  },

  // Homeworkout
  homeworkout: {
    title: 'Home Workout',
    subtitle: 'Train anywhere without equipment',
    noEquipment: 'No Equipment Needed',
    noEquipmentDesc: 'All workouts use only your bodyweight',
    categories: 'Categories',
    workouts: 'Workouts',
    videoError: 'Video unavailable',
    videoErrorMessage: 'The video could not be opened.',
    disclaimerButton: 'Video disclaimer',
    disclaimerTitle: 'Disclaimer',
    disclaimerText: 'These videos are from independent YouTube creators. We are not responsible for the content. Always train responsibly and listen to your body.',
  },

  // Guide Screen
  guide: {
    title: 'Guide',
    subtitle: 'Knowledge for your training',
    comingSoon: 'More content coming',
    comingSoonDesc: 'We are working on more guides for you.',
    articleNotFound: 'Article not found',
    sections: 'Sections',
    sources: 'Sources',
    sourcesDescription: 'Scientific references and further reading',

    // Guide Articles
    articles: {
      trainingBasics: {
        title: 'Training Basics',
        subtitle: 'Scientific principles for effective training',
        sections: {
          intro: {
            title: 'Introduction',
          },
          progressiveOverload: {
            title: 'Progressive Overload',
          },
          frequency: {
            title: 'Training Frequency',
          },
          volume: {
            title: 'Training Volume',
          },
          intensity: {
            title: 'Training Intensity',
          },
          exercises: {
            title: 'Exercise Selection',
          },
          rest: {
            title: 'Rest Periods',
          },
          periodization: {
            title: 'Periodization',
          },
          recovery: {
            title: 'Recovery',
          },
          summary: {
            title: 'Summary',
          },
        },
      },
      cardio: {
        title: 'Endurance Training',
        subtitle: 'Heart rate zones, HIIT vs. LISS and optimal cardio strategies',
        sections: {
          intro: {
            title: 'Introduction',
          },
          energySystems: {
            title: 'Energy Systems',
          },
          zones: {
            title: 'Heart Rate Zones',
          },
          lissHiit: {
            title: 'LISS vs. HIIT',
          },
          cardioMuscle: {
            title: 'Cardio & Muscle Building',
          },
          vo2max: {
            title: 'VO2max',
          },
          fatBurning: {
            title: 'Fat Burning',
          },
          programming: {
            title: 'Programming',
          },
          summary: {
            title: 'Summary',
          },
        },
      },
      fatLoss: {
        title: 'Fat Loss: Myths & Facts',
        subtitle: 'The biggest misconceptions and the biochemistry behind them',
        sections: {
          intro: {
            title: 'Introduction',
          },
          biochemistry: {
            title: 'Biochemistry of Fat Burning',
          },
          mythZone: {
            title: 'Myth: Fat Burning Zone',
          },
          mythCarbs: {
            title: 'Myth: Carbs Make You Fat',
          },
          mythEvening: {
            title: 'Myth: Eating at Night Makes You Fat',
          },
          mythMeals: {
            title: 'Myth: Many Small Meals',
          },
          mythSpot: {
            title: 'Myth: Spot Reduction',
          },
          mythFat: {
            title: 'Myth: Fat Makes You Fat',
          },
          whatWorks: {
            title: 'What Actually Works',
          },
          summary: {
            title: 'Summary',
          },
        },
      },
      supplements: {
        title: 'Supplement Guide',
        subtitle: 'Evidence-based recommendations for sports supplements',
        sections: {
          intro: {
            title: 'Introduction',
          },
          creatine: {
            title: 'Creatine',
          },
          protein: {
            title: 'Protein Powder',
          },
          vitaminD: {
            title: 'Vitamin D',
          },
          omega3: {
            title: 'Omega-3 Fatty Acids',
          },
          caffeine: {
            title: 'Caffeine',
          },
          safety: {
            title: 'Safety & Quality',
          },
          summary: {
            title: 'Summary',
          },
        },
      },
      sleep: {
        title: 'Sleep & Performance',
        subtitle: 'How sleep affects your athletic performance and recovery',
        sections: {
          intro: {
            title: 'Introduction',
          },
          phases: {
            title: 'Sleep Phases & Cycles',
          },
          hormones: {
            title: 'Hormonal Recovery',
          },
          performance: {
            title: 'Sleep & Athletic Performance',
          },
          hygiene: {
            title: 'Sleep Hygiene',
          },
          nutrition: {
            title: 'Nutrition & Sleep',
          },
          napping: {
            title: 'Power Naps & Daytime Sleep',
          },
          tracking: {
            title: 'Sleep Tracking',
          },
          summary: {
            title: 'Summary',
          },
        },
      },
      stress: {
        title: 'Stress Management',
        subtitle: 'Cortisol, training and strategies for better balance',
        sections: {
          intro: {
            title: 'Introduction',
          },
          physiology: {
            title: 'Stress Physiology',
          },
          cortisol: {
            title: 'Cortisol & Training',
          },
          trainingStress: {
            title: 'Managing Training Stress',
          },
          acuteManagement: {
            title: 'Acute Stress Management',
          },
          lifestyle: {
            title: 'Lifestyle Factors',
          },
          adaptation: {
            title: 'Stress Adaptation',
          },
          summary: {
            title: 'Summary',
          },
        },
      },
      recovery: {
        title: 'Recovery',
        subtitle: 'The science behind optimal recovery and supercompensation',
        sections: {
          intro: {
            title: 'Introduction',
          },
          physiology: {
            title: 'Recovery Physiology',
          },
          nutrition: {
            title: 'Nutrition for Recovery',
          },
          activeRecovery: {
            title: 'Active Recovery',
          },
          passiveRecovery: {
            title: 'Passive Recovery',
          },
          massage: {
            title: 'Massage & Mobility',
          },
          programming: {
            title: 'Programming Recovery',
          },
          summary: {
            title: 'Summary',
          },
        },
      },
      muscleBuilding: {
        title: 'Muscle Building',
        subtitle: 'Understanding hypertrophy – training, nutrition and science',
        sections: {
          intro: {
            title: 'Introduction',
          },
          biology: {
            title: 'Biology of Muscle Growth',
          },
          trainingParameters: {
            title: 'Optimal Training Parameters',
          },
          repRanges: {
            title: 'Rep Ranges',
          },
          muscleGroups: {
            title: 'Training by Muscle Groups',
          },
          nutrition: {
            title: 'Nutrition for Muscle Building',
          },
          supplements: {
            title: 'Supplements',
          },
          commonMistakes: {
            title: 'Common Mistakes',
          },
          programs: {
            title: 'Training Programs',
          },
          summary: {
            title: 'Summary',
          },
        },
      },
      flexibility: {
        title: 'Flexibility & Mobility',
        subtitle: 'Understanding flexibility – methods, myths and practical routines',
        sections: {
          intro: {
            title: 'Introduction',
          },
          definitions: {
            title: 'Flexibility vs. Mobility',
          },
          methods: {
            title: 'Stretching Methods',
          },
          myths: {
            title: 'Flexibility Myths',
          },
          practical: {
            title: 'Practical Implementation',
          },
          problemAreas: {
            title: 'Problem Areas & Solutions',
          },
          loadedStretching: {
            title: 'Loaded Stretching',
          },
          foamRolling: {
            title: 'Foam Rolling',
          },
          programming: {
            title: 'Programming Flexibility',
          },
          summary: {
            title: 'Summary',
          },
        },
      },
    },

    sport: {
      title: 'Sport & Training',
      desc: 'Fundamentals and techniques',
      trainingBasics: 'Training Basics',
      trainingBasicsDesc: 'The basics for effective training',
      muscleBuilding: 'Muscle Building',
      muscleBuildingDesc: 'Hypertrophy training explained',
      fatLoss: 'Fat Loss',
      fatLossDesc: 'Effectively reduce body fat',
      flexibility: 'Flexibility',
      flexibilityDesc: 'Stretching and mobility',
      cardio: 'Cardio',
      cardioDesc: 'Cardiovascular training',
    },

    health: {
      title: 'Health',
      desc: 'Body and well-being',
      sleep: 'Sleep',
      sleepDesc: 'Better recovery through good sleep',
      stress: 'Stress Management',
      stressDesc: 'Reduce stress and build resilience',
      recovery: 'Recovery',
      recoveryDesc: 'Recover properly for better performance',
      hydration: 'Hydration',
      hydrationDesc: 'Why water is so important',
    },

    nutrition: {
      title: 'Nutrition',
      desc: 'Eating for your goals',
      macros: 'Macronutrients',
      macrosDesc: 'Proteins, carbs and fats',
      protein: 'Protein Guide',
      proteinDesc: 'How much protein do you need?',
      supplements: 'Supplements',
      supplementsDesc: 'Which supplements make sense',
      mealTiming: 'Meal Timing',
      mealTimingDesc: 'When to eat what',
    },
  },
} as const;

export default en;
