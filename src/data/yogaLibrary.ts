// /workspaces/claude-workspace/fitnessapp/src/data/yogaLibrary.ts
// Yoga Posen und Sessions

import {
  IYogaPose,
  IYogaSession,
  IYogaProgram,
  TYogaStyle,
  TYogaLevel,
  TYogaFocus,
} from '@/types';

// ============================================
// YOGA POSES
// ============================================
export const YOGA_POSES: IYogaPose[] = [
  // Beginner Poses
  {
    id: 'mountain_pose',
    name: 'Bergstellung',
    nameEn: 'Mountain Pose',
    sanskritName: 'Tadasana',
    level: 'beginner',
    focus: ['balance', 'full_body'],
    holdTime: '30-60 Sekunden',
    description: 'Die Grundlage aller stehenden Posen. Fördert Körperbewusstsein und Haltung.',
    instructions: [
      'Stehe mit geschlossenen oder hüftbreit geöffneten Füßen.',
      'Verteile das Gewicht gleichmäßig auf beide Füße.',
      'Aktiviere die Oberschenkel, ziehe das Steißbein leicht nach unten.',
      'Rolle die Schultern zurück und öffne die Brust.',
      'Arme hängen entspannt an den Seiten, Handflächen nach vorne.',
      'Blick geradeaus, Kinn parallel zum Boden.',
    ],
    benefits: [
      'Verbessert die Körperhaltung',
      'Stärkt die Oberschenkel und Knöchel',
      'Fördert das Gleichgewicht',
      'Beruhigt den Geist',
    ],
    modifications: [
      'Bei Gleichgewichtsproblemen: Füße hüftbreit öffnen',
      'An der Wand üben für mehr Stabilität',
    ],
  },
  {
    id: 'downward_dog',
    name: 'Herabschauender Hund',
    nameEn: 'Downward-Facing Dog',
    sanskritName: 'Adho Mukha Svanasana',
    level: 'beginner',
    focus: ['flexibility', 'strength', 'full_body'],
    holdTime: '1-3 Minuten',
    description: 'Eine der bekanntesten Yoga-Posen. Dehnt den gesamten Körper und kräftigt Arme und Beine.',
    instructions: [
      'Starte im Vierfüßlerstand, Hände schulterbreit.',
      'Hebe die Knie vom Boden, schiebe die Hüfte nach oben und hinten.',
      'Strecke die Beine (leicht gebeugt ist OK) und drücke die Fersen Richtung Boden.',
      'Arme sind gestreckt, Finger gespreizt.',
      'Kopf zwischen den Armen, Blick zu den Füßen oder zum Nabel.',
      'Forme ein umgekehrtes V mit deinem Körper.',
    ],
    benefits: [
      'Dehnt Waden, Oberschenkelrückseite und Schultern',
      'Kräftigt Arme und Beine',
      'Beruhigt das Nervensystem',
      'Verbessert die Durchblutung',
    ],
    contraindications: [
      'Karpaltunnelsyndrom',
      'Hoher Blutdruck (kurz halten)',
      'Späte Schwangerschaft',
    ],
    modifications: [
      'Knie leicht gebeugt lassen',
      'Hände auf Blöcke stellen',
    ],
  },
  {
    id: 'warrior_1',
    name: 'Krieger I',
    nameEn: 'Warrior I',
    sanskritName: 'Virabhadrasana I',
    level: 'beginner',
    focus: ['strength', 'balance', 'hip_opener'],
    holdTime: '30-60 Sekunden pro Seite',
    description: 'Kraftvolle stehende Pose, die Beine und Hüfte stärkt.',
    instructions: [
      'Aus dem Stand mache einen großen Schritt nach hinten mit dem rechten Fuß.',
      'Drehe den hinteren Fuß etwa 45 Grad nach außen.',
      'Beuge das vordere Knie auf 90 Grad (Knie über dem Knöchel).',
      'Hüfte zeigt nach vorne, Becken ist ausgerichtet.',
      'Hebe die Arme über den Kopf, Handflächen zueinander.',
      'Blick geradeaus oder leicht nach oben.',
    ],
    benefits: [
      'Stärkt Oberschenkel, Waden und Knöchel',
      'Öffnet Hüfte und Brust',
      'Verbessert Fokus und Konzentration',
      'Baut Kraft und Ausdauer auf',
    ],
    modifications: [
      'Hände an der Hüfte lassen',
      'Kürzerer Stand für mehr Stabilität',
    ],
  },
  {
    id: 'warrior_2',
    name: 'Krieger II',
    nameEn: 'Warrior II',
    sanskritName: 'Virabhadrasana II',
    level: 'beginner',
    focus: ['strength', 'balance', 'hip_opener'],
    holdTime: '30-60 Sekunden pro Seite',
    description: 'Starke stehende Pose mit geöffneter Hüfte.',
    instructions: [
      'Stehe breit, Füße etwa einen Meter auseinander.',
      'Drehe den rechten Fuß 90 Grad nach außen, linken Fuß leicht nach innen.',
      'Beuge das rechte Knie auf 90 Grad.',
      'Arme auf Schulterhöhe ausstrecken, parallel zum Boden.',
      'Hüfte und Oberkörper sind zur Seite geöffnet.',
      'Blick über die rechte Hand.',
    ],
    benefits: [
      'Stärkt Beine und Arme',
      'Öffnet Hüfte und Brust',
      'Verbessert Ausdauer und Konzentration',
      'Dehnt die Innenseite der Oberschenkel',
    ],
    modifications: [
      'Kürzerer Stand bei Knieproblemen',
      'An der Wand üben für Balance',
    ],
  },
  {
    id: 'child_pose',
    name: 'Kindhaltung',
    nameEn: 'Child\'s Pose',
    sanskritName: 'Balasana',
    level: 'beginner',
    focus: ['relaxation', 'flexibility', 'back_relief'],
    holdTime: '1-5 Minuten',
    description: 'Erholsame Pose, die den Rücken dehnt und den Geist beruhigt.',
    instructions: [
      'Knie auf dem Boden, große Zehen berühren sich.',
      'Setze dich auf die Fersen.',
      'Beuge dich nach vorne, lege den Oberkörper auf die Oberschenkel.',
      'Arme nach vorne gestreckt oder neben dem Körper.',
      'Stirn ruht auf dem Boden oder einer Decke.',
      'Atme tief und entspanne.',
    ],
    benefits: [
      'Dehnt Rücken, Hüfte und Oberschenkel',
      'Beruhigt das Nervensystem',
      'Löst Spannungen im Rücken',
      'Fördert tiefe Entspannung',
    ],
    modifications: [
      'Kissen zwischen Gesäß und Fersen',
      'Knie weiter öffnen für mehr Platz',
      'Stirn auf gestapelte Fäuste',
    ],
  },
  {
    id: 'cat_cow',
    name: 'Katze-Kuh',
    nameEn: 'Cat-Cow',
    sanskritName: 'Marjaryasana-Bitilasana',
    level: 'beginner',
    focus: ['flexibility', 'back_relief', 'core'],
    holdTime: '5-10 Wiederholungen',
    description: 'Sanfte Wirbelsäulenbewegung zum Aufwärmen und Mobilisieren.',
    instructions: [
      'Starte im Vierfüßlerstand, Handgelenke unter den Schultern, Knie unter der Hüfte.',
      'KUH: Einatmen, Bauch senken, Brust heben, Blick nach oben.',
      'KATZE: Ausatmen, Rücken runden, Kinn zur Brust.',
      'Wechsle mit dem Atem zwischen beiden Positionen.',
      'Bewegung sollte fließend und kontrolliert sein.',
    ],
    benefits: [
      'Mobilisiert die gesamte Wirbelsäule',
      'Löst Verspannungen im Rücken',
      'Koordiniert Bewegung und Atmung',
      'Massiert die inneren Organe',
    ],
  },
  {
    id: 'cobra',
    name: 'Kobra',
    nameEn: 'Cobra Pose',
    sanskritName: 'Bhujangasana',
    level: 'beginner',
    focus: ['flexibility', 'strength', 'back_relief'],
    holdTime: '15-30 Sekunden',
    description: 'Rückbeuge, die den Rücken stärkt und die Brust öffnet.',
    instructions: [
      'Liege auf dem Bauch, Beine zusammen, Fußrücken auf dem Boden.',
      'Hände unter den Schultern, Ellbogen nah am Körper.',
      'Einatmen, hebe Kopf und Brust vom Boden.',
      'Arme leicht gebeugt, Schultern weg von den Ohren.',
      'Blick nach vorne oder leicht nach oben.',
      'Schambein bleibt auf dem Boden.',
    ],
    benefits: [
      'Stärkt die Rückenmuskulatur',
      'Öffnet Brust und Schultern',
      'Stimuliert die Bauchorgane',
      'Kann bei leichten Rückenschmerzen helfen',
    ],
    contraindications: [
      'Bandscheibenprobleme',
      'Schwangerschaft',
      'Karpaltunnelsyndrom',
    ],
    modifications: [
      'Sphinx-Pose (auf Unterarmen) als sanftere Variante',
      'Nicht zu hoch kommen',
    ],
  },
  {
    id: 'tree_pose',
    name: 'Baum',
    nameEn: 'Tree Pose',
    sanskritName: 'Vrksasana',
    level: 'beginner',
    focus: ['balance', 'strength'],
    holdTime: '30-60 Sekunden pro Seite',
    description: 'Einbeinige Balance-Pose, die Fokus und Stabilität trainiert.',
    instructions: [
      'Stehe auf dem linken Bein, Gewicht gleichmäßig verteilt.',
      'Hebe den rechten Fuß und platziere ihn am linken Oberschenkel oder Wade (nicht am Knie!).',
      'Drücke Fuß und Bein sanft gegeneinander.',
      'Hände vor der Brust zusammen oder über dem Kopf.',
      'Fixiere einen Punkt vor dir für bessere Balance.',
      'Halte die Hüfte gerade.',
    ],
    benefits: [
      'Verbessert Balance und Koordination',
      'Stärkt Beine und Fußgelenke',
      'Fördert Konzentration und Fokus',
      'Öffnet die Hüfte',
    ],
    modifications: [
      'Fuß am Knöchel oder Wand für Support',
      'Hände an der Hüfte für mehr Stabilität',
    ],
  },
  {
    id: 'seated_forward_fold',
    name: 'Sitzende Vorbeuge',
    nameEn: 'Seated Forward Fold',
    sanskritName: 'Paschimottanasana',
    level: 'beginner',
    focus: ['flexibility', 'relaxation'],
    holdTime: '1-3 Minuten',
    description: 'Intensive Dehnung für die Körperrückseite.',
    instructions: [
      'Sitze mit ausgestreckten Beinen, Füße flexed.',
      'Einatmen, Arme über den Kopf, Wirbelsäule lang.',
      'Ausatmen, beuge dich aus der Hüfte nach vorne.',
      'Greife zu Füßen, Knöcheln oder Schienbeinen.',
      'Halte den Rücken möglichst gerade.',
      'Lass den Kopf entspannt hängen.',
    ],
    benefits: [
      'Dehnt Wirbelsäule, Schultern und Oberschenkelrückseite',
      'Beruhigt den Geist',
      'Stimuliert Leber, Nieren und Verdauung',
      'Kann bei Kopfschmerzen helfen',
    ],
    contraindications: [
      'Bandscheibenprobleme',
      'Akute Rückenschmerzen',
    ],
    modifications: [
      'Knie leicht gebeugt',
      'Gurt um die Füße',
      'Auf gefalteter Decke sitzen',
    ],
  },
  {
    id: 'bridge_pose',
    name: 'Brücke',
    nameEn: 'Bridge Pose',
    sanskritName: 'Setu Bandhasana',
    level: 'beginner',
    focus: ['strength', 'flexibility', 'back_relief'],
    holdTime: '30-60 Sekunden',
    description: 'Sanfte Rückbeuge, die den Rücken stärkt und die Brust öffnet.',
    instructions: [
      'Liege auf dem Rücken, Knie gebeugt, Füße hüftbreit.',
      'Arme neben dem Körper, Handflächen nach unten.',
      'Drücke Füße in den Boden und hebe das Becken.',
      'Rolle die Schultern unter, verschränke optional die Hände.',
      'Oberschenkel parallel, Knie über den Knöcheln.',
      'Halte den Nacken entspannt.',
    ],
    benefits: [
      'Stärkt Gesäß, Beine und Rücken',
      'Öffnet Brust und Schultern',
      'Dehnt die Wirbelsäule',
      'Kann Stress und Müdigkeit lindern',
    ],
    modifications: [
      'Block unter dem Kreuzbein für supported Bridge',
      'Füße weiter oder näher am Gesäß',
    ],
  },

  // Intermediate Poses
  {
    id: 'triangle_pose',
    name: 'Dreieck',
    nameEn: 'Triangle Pose',
    sanskritName: 'Trikonasana',
    level: 'intermediate',
    focus: ['flexibility', 'strength', 'hip_opener'],
    holdTime: '30-60 Sekunden pro Seite',
    description: 'Stehende Seitbeuge, die den gesamten Körper dehnt.',
    instructions: [
      'Stehe breit, rechter Fuß 90 Grad nach außen, linker leicht nach innen.',
      'Arme auf Schulterhöhe ausstrecken.',
      'Schiebe die Hüfte nach links, strecke den rechten Arm nach unten.',
      'Rechte Hand an Schienbein, Knöchel oder Block.',
      'Linker Arm zeigt zur Decke.',
      'Blick zur oberen Hand oder geradeaus.',
    ],
    benefits: [
      'Dehnt Beine, Hüfte, Wirbelsäule und Brust',
      'Stärkt Beine und Core',
      'Verbessert Balance',
      'Stimuliert die Verdauung',
    ],
    modifications: [
      'Hand auf Block statt Boden',
      'Blick nach unten bei Nackenproblemen',
    ],
  },
  {
    id: 'pigeon_pose',
    name: 'Taube',
    nameEn: 'Pigeon Pose',
    sanskritName: 'Eka Pada Rajakapotasana',
    level: 'intermediate',
    focus: ['hip_opener', 'flexibility'],
    holdTime: '1-3 Minuten pro Seite',
    description: 'Intensive Hüftöffnung, die auch emotional lösend wirken kann.',
    instructions: [
      'Aus dem herabschauenden Hund bringe das rechte Knie nach vorne.',
      'Platziere das rechte Schienbein diagonal oder parallel zur Matte.',
      'Strecke das linke Bein nach hinten, Fußrücken auf dem Boden.',
      'Hüfte ist möglichst gerade ausgerichtet.',
      'Aufrecht bleiben oder nach vorne beugen.',
      'Arme gestreckt oder auf dem Boden.',
    ],
    benefits: [
      'Tiefe Hüftöffnung',
      'Dehnt Gesäß und Piriformis',
      'Kann emotionale Spannungen lösen',
      'Bereitet auf fortgeschrittene Posen vor',
    ],
    contraindications: [
      'Knieprobleme',
      'Sakroiliakalgelenk-Probleme',
    ],
    modifications: [
      'Decke unter der Hüfte',
      'Reclining Pigeon (auf dem Rücken) als Alternative',
    ],
  },
  {
    id: 'boat_pose',
    name: 'Boot',
    nameEn: 'Boat Pose',
    sanskritName: 'Navasana',
    level: 'intermediate',
    focus: ['core', 'strength', 'balance'],
    holdTime: '20-60 Sekunden',
    description: 'Kraftvolle Core-Übung, die die Bauchmuskulatur aktiviert.',
    instructions: [
      'Sitze mit gebeugten Knien, Füße auf dem Boden.',
      'Lehne dich leicht zurück, hebe die Füße vom Boden.',
      'Strecke die Beine nach oben (oder halte sie gebeugt).',
      'Arme parallel zum Boden, Handflächen zueinander.',
      'Körper bildet ein V.',
      'Brust offen, Schultern entspannt.',
    ],
    benefits: [
      'Stärkt die gesamte Bauchmuskulatur',
      'Verbessert Balance und Körperspannung',
      'Stärkt Hüftbeuger und Wirbelsäule',
      'Fördert Konzentration',
    ],
    modifications: [
      'Knie gebeugt halten',
      'Hände hinter den Oberschenkeln',
    ],
  },
  {
    id: 'half_moon',
    name: 'Halbmond',
    nameEn: 'Half Moon Pose',
    sanskritName: 'Ardha Chandrasana',
    level: 'intermediate',
    focus: ['balance', 'strength', 'hip_opener'],
    holdTime: '30-60 Sekunden pro Seite',
    description: 'Anspruchsvolle Balance-Pose mit Hüftöffnung.',
    instructions: [
      'Aus Krieger II, lege die vordere Hand etwa 30 cm vor dem Fuß ab.',
      'Hebe das hintere Bein parallel zum Boden.',
      'Öffne die Hüfte zur Seite.',
      'Oberer Arm zeigt zur Decke.',
      'Blick zur oberen Hand oder geradeaus.',
      'Standbein ist leicht gebeugt oder gestreckt.',
    ],
    benefits: [
      'Stärkt Beine, Gesäß und Core',
      'Verbessert Koordination und Balance',
      'Öffnet Hüfte und Brust',
      'Fördert Konzentration',
    ],
    modifications: [
      'Hand auf Block',
      'Unteres Bein gebeugt',
      'An der Wand üben',
    ],
  },

  // Savasana
  {
    id: 'corpse_pose',
    name: 'Totenstellung',
    nameEn: 'Corpse Pose',
    sanskritName: 'Savasana',
    level: 'beginner',
    focus: ['relaxation'],
    holdTime: '5-15 Minuten',
    description: 'Die wichtigste Entspannungspose zum Abschluss jeder Praxis.',
    instructions: [
      'Liege auf dem Rücken, Beine entspannt ausgestreckt.',
      'Füße fallen natürlich zur Seite.',
      'Arme neben dem Körper, Handflächen nach oben.',
      'Schultern entspannt, weg von den Ohren.',
      'Schließe die Augen.',
      'Lass jeden Muskel los und atme natürlich.',
    ],
    benefits: [
      'Tiefe körperliche Entspannung',
      'Reduziert Stress und Angst',
      'Integriert die Vorteile der Praxis',
      'Senkt Blutdruck und Herzfrequenz',
    ],
    modifications: [
      'Kissen unter den Knien bei Rückenschmerzen',
      'Decke über den Körper',
      'Augenkissen verwenden',
    ],
  },
];

// ============================================
// YOGA SESSIONS
// ============================================
export const YOGA_SESSIONS: IYogaSession[] = [
  // Beginner Sessions
  {
    id: 'morning_gentle_20',
    name: 'Sanfter Morgen',
    style: 'hatha',
    level: 'beginner',
    duration: 20,
    focus: ['energy', 'flexibility'],
    description: 'Sanfter Start in den Tag mit einfachen Posen zum Aufwachen.',
    poses: [
      { poseId: 'cat_cow', duration: 120 },
      { poseId: 'downward_dog', duration: 60 },
      { poseId: 'mountain_pose', duration: 60 },
      { poseId: 'warrior_1', duration: 60, side: 'both' },
      { poseId: 'tree_pose', duration: 45, side: 'both' },
      { poseId: 'seated_forward_fold', duration: 90 },
      { poseId: 'corpse_pose', duration: 180 },
    ],
  },
  {
    id: 'beginner_basics_30',
    name: 'Yoga Grundlagen',
    style: 'hatha',
    level: 'beginner',
    duration: 30,
    focus: ['full_body', 'flexibility'],
    description: 'Lerne die grundlegenden Yoga-Posen in einer entspannten Session.',
    poses: [
      { poseId: 'child_pose', duration: 60 },
      { poseId: 'cat_cow', duration: 120 },
      { poseId: 'downward_dog', duration: 90 },
      { poseId: 'mountain_pose', duration: 60 },
      { poseId: 'warrior_1', duration: 60, side: 'both' },
      { poseId: 'warrior_2', duration: 60, side: 'both' },
      { poseId: 'tree_pose', duration: 45, side: 'both' },
      { poseId: 'cobra', duration: 45 },
      { poseId: 'bridge_pose', duration: 60 },
      { poseId: 'seated_forward_fold', duration: 90 },
      { poseId: 'corpse_pose', duration: 300 },
    ],
  },
  {
    id: 'stress_relief_25',
    name: 'Stress abbauen',
    style: 'restorative',
    level: 'beginner',
    duration: 25,
    focus: ['relaxation', 'back_relief'],
    description: 'Entspannende Session zum Stressabbau nach einem langen Tag.',
    poses: [
      { poseId: 'child_pose', duration: 120 },
      { poseId: 'cat_cow', duration: 90 },
      { poseId: 'downward_dog', duration: 60 },
      { poseId: 'pigeon_pose', duration: 120, side: 'both' },
      { poseId: 'seated_forward_fold', duration: 120 },
      { poseId: 'bridge_pose', duration: 90 },
      { poseId: 'corpse_pose', duration: 300 },
    ],
  },
  {
    id: 'hip_opener_30',
    name: 'Hüftöffner',
    style: 'yin',
    level: 'beginner',
    duration: 30,
    focus: ['hip_opener', 'flexibility'],
    description: 'Fokus auf die Öffnung der Hüfte mit längeren Haltezeiten.',
    poses: [
      { poseId: 'child_pose', duration: 90 },
      { poseId: 'cat_cow', duration: 90 },
      { poseId: 'warrior_1', duration: 90, side: 'both' },
      { poseId: 'warrior_2', duration: 90, side: 'both' },
      { poseId: 'pigeon_pose', duration: 180, side: 'both' },
      { poseId: 'seated_forward_fold', duration: 120 },
      { poseId: 'corpse_pose', duration: 240 },
    ],
  },

  // Intermediate Sessions
  {
    id: 'vinyasa_flow_45',
    name: 'Vinyasa Flow',
    style: 'vinyasa',
    level: 'intermediate',
    duration: 45,
    focus: ['full_body', 'strength', 'flexibility'],
    description: 'Dynamischer Flow, der Bewegung mit Atmung verbindet.',
    poses: [
      { poseId: 'mountain_pose', duration: 60 },
      { poseId: 'cat_cow', duration: 90 },
      { poseId: 'downward_dog', duration: 60 },
      { poseId: 'warrior_1', duration: 45, side: 'both' },
      { poseId: 'warrior_2', duration: 45, side: 'both' },
      { poseId: 'triangle_pose', duration: 45, side: 'both' },
      { poseId: 'half_moon', duration: 30, side: 'both' },
      { poseId: 'downward_dog', duration: 60 },
      { poseId: 'cobra', duration: 30 },
      { poseId: 'pigeon_pose', duration: 90, side: 'both' },
      { poseId: 'boat_pose', duration: 45 },
      { poseId: 'bridge_pose', duration: 60 },
      { poseId: 'seated_forward_fold', duration: 90 },
      { poseId: 'corpse_pose', duration: 300 },
    ],
  },
  {
    id: 'core_strength_30',
    name: 'Core Kraft',
    style: 'power',
    level: 'intermediate',
    duration: 30,
    focus: ['core', 'strength'],
    description: 'Intensive Session zur Stärkung der Körpermitte.',
    poses: [
      { poseId: 'cat_cow', duration: 90 },
      { poseId: 'downward_dog', duration: 60 },
      { poseId: 'boat_pose', duration: 60 },
      { poseId: 'warrior_1', duration: 45, side: 'both' },
      { poseId: 'warrior_2', duration: 45, side: 'both' },
      { poseId: 'half_moon', duration: 30, side: 'both' },
      { poseId: 'boat_pose', duration: 60 },
      { poseId: 'bridge_pose', duration: 60 },
      { poseId: 'cobra', duration: 45 },
      { poseId: 'child_pose', duration: 90 },
      { poseId: 'corpse_pose', duration: 240 },
    ],
  },
  {
    id: 'balance_focus_35',
    name: 'Balance Training',
    style: 'hatha',
    level: 'intermediate',
    duration: 35,
    focus: ['balance', 'strength'],
    description: 'Verbessere deine Balance und Körperkontrolle.',
    poses: [
      { poseId: 'mountain_pose', duration: 60 },
      { poseId: 'tree_pose', duration: 60, side: 'both' },
      { poseId: 'warrior_1', duration: 60, side: 'both' },
      { poseId: 'warrior_2', duration: 60, side: 'both' },
      { poseId: 'half_moon', duration: 45, side: 'both' },
      { poseId: 'tree_pose', duration: 60, side: 'both' },
      { poseId: 'boat_pose', duration: 45 },
      { poseId: 'bridge_pose', duration: 60 },
      { poseId: 'child_pose', duration: 90 },
      { poseId: 'corpse_pose', duration: 300 },
    ],
  },
  {
    id: 'evening_wind_down_20',
    name: 'Abend Routine',
    style: 'restorative',
    level: 'beginner',
    duration: 20,
    focus: ['relaxation', 'flexibility'],
    description: 'Entspannende Abendpraxis für besseren Schlaf.',
    poses: [
      { poseId: 'child_pose', duration: 120 },
      { poseId: 'cat_cow', duration: 90 },
      { poseId: 'seated_forward_fold', duration: 120 },
      { poseId: 'pigeon_pose', duration: 90, side: 'both' },
      { poseId: 'bridge_pose', duration: 60 },
      { poseId: 'corpse_pose', duration: 300 },
    ],
  },
];

// ============================================
// YOGA PROGRAMS
// ============================================
export const YOGA_PROGRAMS: IYogaProgram[] = [
  {
    id: 'beginner_4weeks',
    name: '4 Wochen Yoga Einstieg',
    description: 'Der perfekte Start für Yoga-Anfänger. Lerne die Grundlagen in 4 Wochen.',
    level: 'beginner',
    durationWeeks: 4,
    focus: ['flexibility', 'relaxation', 'full_body'],
    weeklySchedule: [
      {
        week: 1,
        focusNote: 'Grundlagen lernen',
        days: [
          { day: 'mon', session: YOGA_SESSIONS.find(s => s.id === 'beginner_basics_30')! },
          { day: 'tue', session: null },
          { day: 'wed', session: YOGA_SESSIONS.find(s => s.id === 'morning_gentle_20')! },
          { day: 'thu', session: null },
          { day: 'fri', session: YOGA_SESSIONS.find(s => s.id === 'beginner_basics_30')! },
          { day: 'sat', session: null },
          { day: 'sun', session: YOGA_SESSIONS.find(s => s.id === 'stress_relief_25')! },
        ],
      },
      {
        week: 2,
        focusNote: 'Mehr Flexibilität',
        days: [
          { day: 'mon', session: YOGA_SESSIONS.find(s => s.id === 'beginner_basics_30')! },
          { day: 'tue', session: null },
          { day: 'wed', session: YOGA_SESSIONS.find(s => s.id === 'hip_opener_30')! },
          { day: 'thu', session: null },
          { day: 'fri', session: YOGA_SESSIONS.find(s => s.id === 'morning_gentle_20')! },
          { day: 'sat', session: YOGA_SESSIONS.find(s => s.id === 'beginner_basics_30')! },
          { day: 'sun', session: null },
        ],
      },
      {
        week: 3,
        focusNote: 'Balance finden',
        days: [
          { day: 'mon', session: YOGA_SESSIONS.find(s => s.id === 'beginner_basics_30')! },
          { day: 'tue', session: YOGA_SESSIONS.find(s => s.id === 'morning_gentle_20')! },
          { day: 'wed', session: null },
          { day: 'thu', session: YOGA_SESSIONS.find(s => s.id === 'hip_opener_30')! },
          { day: 'fri', session: null },
          { day: 'sat', session: YOGA_SESSIONS.find(s => s.id === 'beginner_basics_30')! },
          { day: 'sun', session: YOGA_SESSIONS.find(s => s.id === 'stress_relief_25')! },
        ],
      },
      {
        week: 4,
        focusNote: 'Alles zusammen',
        days: [
          { day: 'mon', session: YOGA_SESSIONS.find(s => s.id === 'beginner_basics_30')! },
          { day: 'tue', session: null },
          { day: 'wed', session: YOGA_SESSIONS.find(s => s.id === 'hip_opener_30')! },
          { day: 'thu', session: YOGA_SESSIONS.find(s => s.id === 'morning_gentle_20')! },
          { day: 'fri', session: null },
          { day: 'sat', session: YOGA_SESSIONS.find(s => s.id === 'beginner_basics_30')! },
          { day: 'sun', session: YOGA_SESSIONS.find(s => s.id === 'evening_wind_down_20')! },
        ],
      },
    ],
  },
  {
    id: 'flexibility_challenge_2weeks',
    name: '2 Wochen Flexibilität',
    description: 'Intensives Programm zur Verbesserung deiner Beweglichkeit.',
    level: 'intermediate',
    durationWeeks: 2,
    focus: ['flexibility', 'hip_opener'],
    weeklySchedule: [
      {
        week: 1,
        focusNote: 'Hüfte öffnen',
        days: [
          { day: 'mon', session: YOGA_SESSIONS.find(s => s.id === 'hip_opener_30')! },
          { day: 'tue', session: YOGA_SESSIONS.find(s => s.id === 'morning_gentle_20')! },
          { day: 'wed', session: YOGA_SESSIONS.find(s => s.id === 'vinyasa_flow_45')! },
          { day: 'thu', session: null },
          { day: 'fri', session: YOGA_SESSIONS.find(s => s.id === 'hip_opener_30')! },
          { day: 'sat', session: YOGA_SESSIONS.find(s => s.id === 'vinyasa_flow_45')! },
          { day: 'sun', session: YOGA_SESSIONS.find(s => s.id === 'stress_relief_25')! },
        ],
      },
      {
        week: 2,
        focusNote: 'Ganzkörper-Flexibilität',
        days: [
          { day: 'mon', session: YOGA_SESSIONS.find(s => s.id === 'vinyasa_flow_45')! },
          { day: 'tue', session: YOGA_SESSIONS.find(s => s.id === 'hip_opener_30')! },
          { day: 'wed', session: null },
          { day: 'thu', session: YOGA_SESSIONS.find(s => s.id === 'vinyasa_flow_45')! },
          { day: 'fri', session: YOGA_SESSIONS.find(s => s.id === 'hip_opener_30')! },
          { day: 'sat', session: YOGA_SESSIONS.find(s => s.id === 'vinyasa_flow_45')! },
          { day: 'sun', session: YOGA_SESSIONS.find(s => s.id === 'evening_wind_down_20')! },
        ],
      },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getYogaPoseById = (id: string): IYogaPose | undefined => {
  return YOGA_POSES.find((p) => p.id === id);
};

export const getYogaPosesByLevel = (level: TYogaLevel): IYogaPose[] => {
  return YOGA_POSES.filter((p) => p.level === level);
};

export const getYogaPosesByFocus = (focus: TYogaFocus): IYogaPose[] => {
  return YOGA_POSES.filter((p) => p.focus.includes(focus));
};

export const getYogaSessionById = (id: string): IYogaSession | undefined => {
  return YOGA_SESSIONS.find((s) => s.id === id);
};

export const getYogaSessionsByLevel = (level: TYogaLevel): IYogaSession[] => {
  return YOGA_SESSIONS.filter((s) => s.level === level);
};

export const getYogaSessionsByStyle = (style: TYogaStyle): IYogaSession[] => {
  return YOGA_SESSIONS.filter((s) => s.style === style);
};

export const getYogaProgramById = (id: string): IYogaProgram | undefined => {
  return YOGA_PROGRAMS.find((p) => p.id === id);
};

// Style Labels
export const YOGA_STYLE_LABELS: Record<TYogaStyle, { de: string; en: string; icon: string }> = {
  hatha: { de: 'Hatha', en: 'Hatha', icon: '🧘' },
  vinyasa: { de: 'Vinyasa', en: 'Vinyasa', icon: '🌊' },
  yin: { de: 'Yin', en: 'Yin', icon: '🌙' },
  power: { de: 'Power', en: 'Power', icon: '💪' },
  restorative: { de: 'Restorative', en: 'Restorative', icon: '😌' },
  ashtanga: { de: 'Ashtanga', en: 'Ashtanga', icon: '🔥' },
  kundalini: { de: 'Kundalini', en: 'Kundalini', icon: '✨' },
};

// Focus Labels
export const YOGA_FOCUS_LABELS: Record<TYogaFocus, { de: string; en: string; icon: string }> = {
  flexibility: { de: 'Flexibilität', en: 'Flexibility', icon: '🤸' },
  strength: { de: 'Kraft', en: 'Strength', icon: '💪' },
  balance: { de: 'Balance', en: 'Balance', icon: '⚖️' },
  relaxation: { de: 'Entspannung', en: 'Relaxation', icon: '😌' },
  energy: { de: 'Energie', en: 'Energy', icon: '⚡' },
  core: { de: 'Core', en: 'Core', icon: '🎯' },
  back_relief: { de: 'Rückenschmerzen', en: 'Back Relief', icon: '🔙' },
  hip_opener: { de: 'Hüftöffner', en: 'Hip Opener', icon: '🦵' },
  full_body: { de: 'Ganzkörper', en: 'Full Body', icon: '🏃' },
};

// Level Labels
export const YOGA_LEVEL_LABELS: Record<TYogaLevel, { de: string; en: string }> = {
  beginner: { de: 'Anfänger', en: 'Beginner' },
  intermediate: { de: 'Fortgeschritten', en: 'Intermediate' },
  advanced: { de: 'Profi', en: 'Advanced' },
};
