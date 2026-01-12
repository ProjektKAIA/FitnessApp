// /workspaces/claude-workspace/fitnessapp/src/data/guideContent.ts

export interface IGuideSource {
  title: string;
  url: string;
  institution?: string;
}

export interface IGuideSection {
  id: string;
  titleKey: string;
  content: string;
}

export interface IGuideArticle {
  id: string;
  categoryId: string;
  icon: string;
  titleKey: string;
  subtitleKey: string;
  readingTime: number;
  sections: IGuideSection[];
  sources: IGuideSource[];
}

export const GUIDE_ARTICLES: Record<string, IGuideArticle> = {
  // ============================================
  // TRAININGSGRUNDLAGEN (Training Basics)
  // ============================================
  'training-basics': {
    id: 'training-basics',
    categoryId: 'sport',
    icon: '📚',
    titleKey: 'guide.articles.trainingBasics.title',
    subtitleKey: 'guide.articles.trainingBasics.subtitle',
    readingTime: 15,
    sections: [
      {
        id: 'intro',
        titleKey: 'guide.articles.trainingBasics.sections.intro.title',
        content: `Effektives Training basiert auf wissenschaftlichen Prinzipien. Ob Muskelaufbau, Kraftsteigerung oder allgemeine Fitness – wer die Grundlagen versteht, trainiert zielgerichteter und vermeidet typische Fehler.

Dieser Guide fasst die wichtigsten Erkenntnisse der Trainingswissenschaft zusammen, gestützt auf Forschung von führenden Institutionen wie der Deutschen Sporthochschule Köln, dem American College of Sports Medicine (ACSM) und aktuellen Meta-Analysen.`,
      },
      {
        id: 'progressive-overload',
        titleKey: 'guide.articles.trainingBasics.sections.progressiveOverload.title',
        content: `**Das wichtigste Prinzip im Training**

Progressive Überlastung (Progressive Overload) ist das fundamentale Prinzip für jede Art von Trainingsanpassung. Der Körper passt sich nur an, wenn er kontinuierlich gefordert wird.

**Wie funktioniert es?**
Der Körper reagiert auf Trainingsreize mit Anpassung. Bleibt der Reiz gleich, stagniert die Entwicklung. Die Belastung muss systematisch gesteigert werden.

**Methoden der Progression:**
• **Gewicht erhöhen** – Klassisch: +2,5 kg bei Oberkörper, +5 kg bei Unterkörper
• **Wiederholungen steigern** – Erst mehr Reps, dann mehr Gewicht
• **Sätze hinzufügen** – Von 3 auf 4 Sätze pro Übung
• **Pausenzeiten verkürzen** – Gleiche Arbeit in weniger Zeit
• **Bewegungsqualität verbessern** – Saubere Technik, mehr Range of Motion

**Praktische Umsetzung:**
Führe ein Trainingstagebuch. Notiere Gewichte, Wiederholungen und wie es sich anfühlte. Steigere dich nur, wenn die Technik stimmt.

**Die 2-für-2-Regel:**
Wenn du in 2 aufeinanderfolgenden Trainings die Zielwiederholungen in allen Sätzen schaffst, erhöhe das Gewicht.`,
      },
      {
        id: 'training-frequency',
        titleKey: 'guide.articles.trainingBasics.sections.frequency.title',
        content: `**Wie oft pro Woche trainieren?**

Eine Meta-Analyse von Schoenfeld et al. (2016) zeigte: Jede Muskelgruppe sollte mindestens 2x pro Woche trainiert werden für optimalen Muskelaufbau.

**Empfehlungen nach Trainingslevel:**

**Anfänger (0-1 Jahr):**
• 2-3x pro Woche Ganzkörpertraining
• Fokus auf Technik und Grundübungen
• 48-72 Stunden Pause zwischen den Einheiten

**Fortgeschrittene (1-3 Jahre):**
• 3-4x pro Woche
• Split-Training möglich (Ober-/Unterkörper oder Push/Pull/Legs)
• Jede Muskelgruppe 2x pro Woche

**Weit Fortgeschrittene (3+ Jahre):**
• 4-6x pro Woche möglich
• Höheres Volumen und Spezialisierung
• Periodisierung wichtig

**Wichtig:**
Mehr ist nicht immer besser. Die Erholung zwischen den Einheiten ist entscheidend für den Fortschritt. Die Deutsche Sporthochschule betont: "Superkompensation findet in der Erholungsphase statt."`,
      },
      {
        id: 'volume',
        titleKey: 'guide.articles.trainingBasics.sections.volume.title',
        content: `**Wie viele Sätze pro Muskelgruppe?**

Das Trainingsvolumen ist einer der wichtigsten Faktoren für Muskelwachstum. Aktuelle Forschung gibt klare Richtwerte.

**Wissenschaftliche Empfehlungen (Schoenfeld & Krieger, 2017):**
• **Minimum für Fortschritt:** 10 Sätze pro Muskelgruppe pro Woche
• **Optimal für Hypertrophie:** 10-20 Sätze pro Muskelgruppe pro Woche
• **Maximum sinnvoll:** 20-25 Sätze (mehr bringt kaum Zusatznutzen)

**Volumen nach Trainingserfahrung:**
• Anfänger: 10-12 Sätze/Woche
• Fortgeschrittene: 12-18 Sätze/Woche
• Weit Fortgeschrittene: 18-25 Sätze/Woche

**Verteilung auf die Woche:**
Bei 2x Training pro Muskelgruppe:
• 16 Sätze/Woche = 8 Sätze pro Training
• Besser verteilt als alles an einem Tag

**Qualität vor Quantität:**
Jeder Satz sollte mit hoher Intensität ausgeführt werden. "Junk Volume" (Sätze weit vom Muskelversagen) zählt nicht voll.

**Praxistipp:**
Starte am unteren Ende und steigere das Volumen nur, wenn du nicht mehr Fortschritte machst.`,
      },
      {
        id: 'intensity',
        titleKey: 'guide.articles.trainingBasics.sections.intensity.title',
        content: `**Wie schwer trainieren?**

Die Intensität beschreibt, wie nah du am Muskelversagen trainierst. Das ACSM empfiehlt verschiedene Bereiche je nach Ziel.

**Wiederholungsbereiche nach Ziel:**
• **Maximalkraft:** 1-5 Wiederholungen (85-100% 1RM)
• **Hypertrophie (Muskelaufbau):** 6-12 Wiederholungen (65-85% 1RM)
• **Kraftausdauer:** 12-20+ Wiederholungen (50-65% 1RM)

**Wichtige Erkenntnis:**
Meta-Analysen zeigen: Muskelwachstum ist über einen breiten Rep-Bereich (6-30) möglich, solange die Sätze nahe am Muskelversagen enden.

**RPE-Skala (Rate of Perceived Exertion):**
• RPE 10 = Muskelversagen
• RPE 9 = 1 Wiederholung in Reserve
• RPE 8 = 2 Wiederholungen in Reserve
• RPE 7 = 3 Wiederholungen in Reserve

**Empfehlung für Hypertrophie:**
Die meisten Sätze bei RPE 7-9 ausführen. Nicht jeder Satz muss bis zum Versagen gehen – das erhöht nur die Erschöpfung ohne proportionalen Nutzen.

**RIR (Reps in Reserve):**
Trainiere so, dass du noch 1-3 saubere Wiederholungen könntest. Das maximiert den Stimulus bei akzeptabler Ermüdung.`,
      },
      {
        id: 'exercise-selection',
        titleKey: 'guide.articles.trainingBasics.sections.exercises.title',
        content: `**Die richtigen Übungen wählen**

Nicht alle Übungen sind gleich effektiv. Die Übungsauswahl beeinflusst maßgeblich den Trainingsfortschritt.

**Grundübungen (Compound Exercises):**
Diese Mehrgelenkübungen bilden die Basis jedes guten Programms:
• **Kniebeuge** – König der Übungen, trainiert Beine und Core
• **Kreuzheben** – Gesamte hintere Kette
• **Bankdrücken** – Brust, Schultern, Trizeps
• **Rudern** – Gesamter Rücken, Bizeps
• **Schulterdrücken** – Schultern, Trizeps
• **Klimmzüge** – Latissimus, Bizeps

**Warum Grundübungen?**
• Mehr Muskelmasse pro Übung aktiviert
• Höhere Hormonausschüttung
• Funktionellere Bewegungsmuster
• Zeiteffizienter

**Isolationsübungen als Ergänzung:**
• Bizeps-Curls, Trizeps-Extensions
• Seitheben, Face Pulls
• Beinbeuger, Beinstrecker
• Wadenheben

**Die 80/20-Regel:**
80% des Trainings sollten aus Grundübungen bestehen, 20% aus Isolationsübungen für spezifische Schwachstellen.

**Übungsreihenfolge:**
1. Komplexe Grundübungen zuerst (wenn frisch)
2. Dann Isolationsübungen
3. Core-Training am Ende`,
      },
      {
        id: 'rest-periods',
        titleKey: 'guide.articles.trainingBasics.sections.rest.title',
        content: `**Pausenzeiten zwischen den Sätzen**

Die Pausenlänge beeinflusst sowohl die Trainingsqualität als auch die Anpassungen.

**Empfehlungen nach Ziel:**

**Maximalkraft (1-5 Reps):**
• 3-5 Minuten Pause
• Vollständige ATP-Regeneration
• Maximale Leistung in jedem Satz

**Hypertrophie (6-12 Reps):**
• 1,5-3 Minuten Pause
• Gute Balance aus Erholung und metabolischem Stress
• Schoenfeld-Studie: 3 Min. > 1 Min. für Kraftzuwächse

**Kraftausdauer (12+ Reps):**
• 30-90 Sekunden Pause
• Höherer metabolischer Stress
• Kürzere Gesamttrainingsdauer

**Praktische Tipps:**
• Bei schweren Grundübungen: Eher länger pausieren
• Bei Isolationsübungen: Kürzere Pausen möglich
• Supersätze für Zeiteffizienz (antagonistische Muskeln)

**Was während der Pause tun?**
• Locker bleiben (nicht komplett hinsetzen)
• Hydrieren
• Mental auf den nächsten Satz vorbereiten
• Mobilisieren der nächsten Übung`,
      },
      {
        id: 'periodization',
        titleKey: 'guide.articles.trainingBasics.sections.periodization.title',
        content: `**Langfristige Trainingsplanung**

Periodisierung bedeutet, das Training in Phasen zu strukturieren. Das verhindert Plateaus und optimiert die Anpassung.

**Warum Periodisierung?**
• Der Körper gewöhnt sich an gleichbleibende Reize
• Verschiedene Fähigkeiten erfordern unterschiedliche Trainingsmethoden
• Verletzungsprävention durch Variation
• Mentale Frische

**Klassische lineare Periodisierung:**
• Phase 1: Hypertrophie (4-6 Wochen, 8-12 Reps)
• Phase 2: Kraft (4-6 Wochen, 4-6 Reps)
• Phase 3: Maximalkraft/Peaking (2-4 Wochen, 1-3 Reps)
• Deload-Woche

**Wellenförmige Periodisierung:**
• Wechsel der Intensität innerhalb einer Woche
• Tag 1: Schwer (5x5)
• Tag 2: Mittel (3x10)
• Tag 3: Leicht (3x15)

**Deload-Wochen:**
Alle 4-8 Wochen das Volumen oder die Intensität um 40-60% reduzieren. Das ermöglicht:
• Komplette Erholung
• Ausheilung kleiner Verletzungen
• Mentale Erholung

**Empfehlung für Freizeitsportler:**
Starte mit linearer Progression. Wechsle zu periodisiertem Training, wenn du fortgeschritten bist und Plateaus erreichst.`,
      },
      {
        id: 'recovery',
        titleKey: 'guide.articles.trainingBasics.sections.recovery.title',
        content: `**Training ist nur der Reiz – Wachstum passiert in der Erholung**

Die Regeneration wird oft unterschätzt. Ohne ausreichende Erholung keine Anpassung.

**Die drei Säulen der Regeneration:**

**1. Schlaf (7-9 Stunden)**
• Wachstumshormon-Ausschüttung hauptsächlich nachts
• Muskelproteinsynthese während des Schlafs aktiv
• Kognitive Erholung für Koordination
• Studie: Weniger als 6h Schlaf = 60% weniger Testosteron

**2. Ernährung**
• Protein: 1,6-2,2 g/kg Körpergewicht
• Ausreichend Kalorien (keine chronische Unterversorgung)
• Mikronährstoffe nicht vergessen
• Post-Workout: Protein + Kohlenhydrate

**3. Aktive Erholung**
• Leichte Bewegung an trainingsfreien Tagen
• Fördert Durchblutung und Nährstofftransport
• Spazieren, leichtes Radfahren, Schwimmen
• Mobility-Arbeit und Dehnen

**Zeichen von Übertraining:**
• Leistungsabfall über mehrere Wochen
• Ständige Müdigkeit
• Schlafprobleme
• Erhöhte Verletzungsanfälligkeit
• Motivationsverlust

**Maßnahme bei Übertraining:**
Eine komplette Trainingspause von 1-2 Wochen. Dann reduziertes Volumen für 2-4 Wochen.`,
      },
      {
        id: 'summary',
        titleKey: 'guide.articles.trainingBasics.sections.summary.title',
        content: `**Die 7 Grundprinzipien auf einen Blick:**

1. **Progressive Überlastung** – Steigere kontinuierlich die Anforderungen
2. **Frequenz** – Jede Muskelgruppe mind. 2x pro Woche
3. **Volumen** – 10-20 Sätze pro Muskelgruppe pro Woche
4. **Intensität** – Training nahe am Muskelversagen (RPE 7-9)
5. **Übungsauswahl** – 80% Grundübungen, 20% Isolation
6. **Pausenzeiten** – 1,5-3 Minuten für Hypertrophie
7. **Regeneration** – Schlaf, Ernährung, aktive Erholung

**Für Anfänger:**
• Starte mit 2-3x Ganzkörper pro Woche
• Lerne die Technik der Grundübungen
• Führe ein Trainingstagebuch
• Sei geduldig – Fortschritt braucht Zeit

**Merke:**
Konsistenz schlägt Perfektion. Ein "durchschnittliches" Programm, das du durchziehst, ist besser als ein "perfektes" Programm, das du nach 3 Wochen abbrichst.`,
      },
    ],
    sources: [
      {
        title: 'Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27102172/',
        institution: 'Schoenfeld et al. (2016) - Sports Medicine',
      },
      {
        title: 'Dose-response relationship between weekly resistance training volume and increases in muscle mass',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27433992/',
        institution: 'Schoenfeld et al. (2017) - Journal of Sports Sciences',
      },
      {
        title: 'ACSM Position Stand: Progression Models in Resistance Training',
        url: 'https://journals.lww.com/acsm-msse/fulltext/2009/03000/progression_models_in_resistance_training_for.26.aspx',
        institution: 'American College of Sports Medicine',
      },
      {
        title: 'Trainingslehre und Trainingswissenschaft',
        url: 'https://www.dshs-koeln.de/',
        institution: 'Deutsche Sporthochschule Köln',
      },
      {
        title: 'Longer Interset Rest Periods Enhance Muscle Strength and Hypertrophy',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26605807/',
        institution: 'Schoenfeld et al. (2016) - Journal of Strength and Conditioning',
      },
      {
        title: 'Sleep and Athletic Performance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28662971/',
        institution: 'Watson (2017) - Current Sports Medicine Reports',
      },
    ],
  },

  // ============================================
  // AUSDAUER (Cardio/Endurance)
  // ============================================
  cardio: {
    id: 'cardio',
    categoryId: 'sport',
    icon: '🏃',
    titleKey: 'guide.articles.cardio.title',
    subtitleKey: 'guide.articles.cardio.subtitle',
    readingTime: 14,
    sections: [
      {
        id: 'intro',
        titleKey: 'guide.articles.cardio.sections.intro.title',
        content: `Ausdauertraining ist weit mehr als nur "Kalorien verbrennen". Es verbessert die Herzgesundheit, steigert die Leistungsfähigkeit und hat positive Effekte auf Stimmung und Schlaf.

Dieser Guide erklärt die wissenschaftlichen Grundlagen des Ausdauertrainings und wie du es optimal für deine Ziele einsetzt – egal ob für allgemeine Fitness, Fettabbau oder sportliche Leistung.

Die WHO empfiehlt mindestens 150-300 Minuten moderate oder 75-150 Minuten intensive Ausdaueraktivität pro Woche für Erwachsene.`,
      },
      {
        id: 'energy-systems',
        titleKey: 'guide.articles.cardio.sections.energySystems.title',
        content: `**Wie der Körper Energie bereitstellt**

Um Ausdauertraining zu verstehen, musst du die drei Energiesysteme kennen:

**1. Phosphatsystem (ATP-CP)**
• Dauer: 0-10 Sekunden
• Intensität: Maximal (Sprints, Gewichtheben)
• Keine Sauerstoffbeteiligung
• Beispiel: 100m-Sprint, maximaler Krafteinsatz

**2. Anaerobe Glykolyse (Laktat-System)**
• Dauer: 10 Sekunden - 2 Minuten
• Intensität: Sehr hoch
• Kohlenhydrate als Brennstoff, kein Sauerstoff
• Milchsäurebildung → "Brennen" in den Muskeln
• Beispiel: 400m-Lauf, intensive Intervalle

**3. Aerobe Energiebereitstellung**
• Dauer: Ab 2 Minuten bis Stunden
• Intensität: Niedrig bis moderat
• Sauerstoff + Kohlenhydrate/Fette als Brennstoff
• Keine Milchsäure-Akkumulation
• Beispiel: Joggen, Radfahren, Schwimmen

**Praktische Bedeutung:**
Je nach Trainingsform trainierst du unterschiedliche Systeme. Ein gutes Ausdauertraining sollte alle Systeme berücksichtigen.`,
      },
      {
        id: 'training-zones',
        titleKey: 'guide.articles.cardio.sections.zones.title',
        content: `**Herzfrequenz-Zonen verstehen**

Die Trainingsintensität wird oft über Herzfrequenz-Zonen gesteuert. Basis ist die maximale Herzfrequenz (HFmax).

**Berechnung HFmax:**
• Grobe Formel: 220 - Alter
• Genauer (Tanaka-Formel): 208 - (0,7 × Alter)
• Am genauesten: Leistungsdiagnostik

**Die 5 Trainingszonen:**

**Zone 1: Regeneration (50-60% HFmax)**
• Sehr leicht, Unterhaltung problemlos möglich
• Aktive Erholung
• Fettverbrennung niedrig, aber aus Fettspeichern

**Zone 2: Grundlagenausdauer (60-70% HFmax)**
• Leicht bis moderat, längere Sätze sprechen möglich
• Aufbau der aeroben Basis
• Höchster Anteil Fettverbrennung
• Ideal für lange, lockere Einheiten

**Zone 3: Aerob-anaerobe Schwelle (70-80% HFmax)**
• Moderat bis anstrengend
• Kurze Sätze sprechen
• Tempodauerläufe, Schwellentraining

**Zone 4: Anaerobe Zone (80-90% HFmax)**
• Hart, nur einzelne Worte möglich
• Intervalltraining, VO2max-Training
• Starke Laktatbildung

**Zone 5: Maximale Zone (90-100% HFmax)**
• Alles geben, kein Sprechen möglich
• Nur kurz haltbar (Sekunden bis wenige Minuten)
• Sprints, maximale Intervalle`,
      },
      {
        id: 'liss-vs-hiit',
        titleKey: 'guide.articles.cardio.sections.lissHiit.title',
        content: `**LISS vs. HIIT – Was ist besser?**

Zwei populäre Trainingsformen mit unterschiedlichen Vor- und Nachteilen.

**LISS (Low-Intensity Steady State)**
Gleichmäßiges Training bei niedriger Intensität (Zone 2)
• 30-60+ Minuten Dauer
• Beispiele: Lockeres Joggen, Radfahren, Schwimmen

**Vorteile LISS:**
• Geringere Belastung für Gelenke und Nervensystem
• Gut kombinierbar mit Krafttraining
• Aufbau der aeroben Basis
• Niedrige Verletzungsgefahr
• Stressabbau

**HIIT (High-Intensity Interval Training)**
Wechsel zwischen hoher Intensität und Erholung
• 15-30 Minuten Dauer
• Beispiel: 30 Sek Sprint, 90 Sek Gehen, 8-10 Runden

**Vorteile HIIT:**
• Zeiteffizient
• Hoher Nachbrenneffekt (EPOC)
• Verbessert VO2max schnell
• Hält Stoffwechsel aktiv

**Was sagt die Wissenschaft?**
Meta-Analysen zeigen: Beide Methoden sind für Fettabbau ähnlich effektiv, wenn die Kalorienverbrennung gleich ist. HIIT spart Zeit, LISS ist weniger erschöpfend.

**Empfehlung:**
Kombiniere beide! 2-3x LISS + 1-2x HIIT pro Woche. Das gibt dir die Vorteile beider Methoden.`,
      },
      {
        id: 'cardio-and-muscle',
        titleKey: 'guide.articles.cardio.sections.cardioMuscle.title',
        content: `**Cardio und Muskelaufbau – Freund oder Feind?**

Ein häufiges Bedenken: "Killt Cardio meine Gains?" Die Antwort ist differenzierter.

**Der "Interference Effect":**
Übermäßiges Ausdauertraining kann den Muskelaufbau beeinträchtigen. Die molekularen Signalwege für Ausdauer (AMPK) und Hypertrophie (mTOR) hemmen sich teilweise gegenseitig.

**Wann ist es ein Problem?**
• Sehr hohes Cardio-Volumen (>5h/Woche intensiv)
• Cardio direkt vor dem Krafttraining
• Gleiche Muskelgruppen (z.B. Laufen und Beintraining am selben Tag)
• Kaloriendefizit bei hohem Trainingsvolumen

**So kombinierst du optimal:**
1. **Zeitlicher Abstand:** Mind. 6-8 Stunden zwischen Cardio und Kraft
2. **Reihenfolge:** Krafttraining vor Cardio (wenn am selben Tag)
3. **Modalität wählen:** Radfahren stört Beintraining weniger als Laufen
4. **Volumen anpassen:** 2-3 moderate Cardio-Einheiten stören kaum
5. **Ernährung:** Ausreichend Kalorien und Protein

**Für die meisten Freizeitsportler:**
20-30 Minuten Cardio 2-3x pro Woche beeinträchtigt den Muskelaufbau nicht. Es verbessert sogar die Erholung und Herzgesundheit.

**Die Realität:**
Die meisten Menschen machen zu wenig Cardio, nicht zu viel. Der "Interference Effect" ist vor allem für Leistungssportler relevant.`,
      },
      {
        id: 'vo2max',
        titleKey: 'guide.articles.cardio.sections.vo2max.title',
        content: `**VO2max – Der wichtigste Ausdauerwert**

Die maximale Sauerstoffaufnahme (VO2max) ist der Goldstandard zur Bewertung der Ausdauerleistungsfähigkeit.

**Was ist VO2max?**
Die maximale Menge Sauerstoff, die dein Körper bei maximaler Belastung aufnehmen und verwerten kann. Angegeben in ml/kg/min.

**Referenzwerte:**
• Untrainiert: 35-40 ml/kg/min
• Freizeitsportler: 45-55 ml/kg/min
• Gut trainiert: 55-65 ml/kg/min
• Eliteausdauersportler: 70-85+ ml/kg/min

**Warum ist VO2max wichtig?**
Studien zeigen: Eine hohe VO2max korreliert mit:
• Längerer Lebenserwartung
• Geringerem Risiko für Herz-Kreislauf-Erkrankungen
• Besserer kognitiver Funktion
• Höherer Alltagsenergie

**So verbesserst du deine VO2max:**

**1. HIIT (am effektivsten):**
4x4-Minuten-Intervalle bei 90-95% HFmax mit 3 Min aktiver Pause
Studienergebnis: 7-10% Verbesserung in 8 Wochen

**2. Langes Grundlagentraining:**
60-90 Minuten in Zone 2
Baut die aerobe Basis auf

**3. Kombination:**
2x HIIT + 2-3x Zone 2 pro Woche
Das zeigt die beste Gesamtverbesserung

**Messung:**
Am genauesten: Spiroergometrie im Labor
Schätzung: Lauf-/Radtest mit Fitness-Uhr`,
      },
      {
        id: 'fat-burning',
        titleKey: 'guide.articles.cardio.sections.fatBurning.title',
        content: `**Fettverbrennung durch Cardio**

Der Begriff "Fettverbrennungszone" ist verwirrend. Hier die Fakten.

**Der Mythos der Fettverbrennungszone:**
Bei niedriger Intensität (Zone 2) stammt ein höherer PROZENTANTEIL der Energie aus Fett. ABER: Die absolute Fettverbrennung kann bei höherer Intensität größer sein.

**Rechenbeispiel:**
• 30 Min lockeres Joggen: 300 kcal, davon 60% aus Fett = 180 kcal Fett
• 30 Min intensives Laufen: 500 kcal, davon 40% aus Fett = 200 kcal Fett

**Was wirklich zählt:**
Für Fettabbau ist die GESAMTENERGIEBILANZ entscheidend, nicht die Trainingsintensität. Verbrenne mehr als du isst = Fettabbau.

**Cardio-Strategien für Fettabbau:**

**1. Nüchtern-Cardio:**
• Morgens vor dem Frühstück
• Niedrige Intensität (Zone 2)
• Nutzt verstärkt Fettspeicher
• Nicht zwingend besser, aber praktisch

**2. Nach dem Krafttraining:**
• Glykogenspeicher bereits entleert
• Körper greift schneller auf Fett zurück
• 15-20 Minuten reichen

**3. HIIT für Nachbrenneffekt:**
• Erhöhter Kalorienverbrauch nach dem Training
• EPOC (Excess Post-Exercise Oxygen Consumption)
• Bis zu 15% mehr Kalorienverbrauch über 24h

**Das Wichtigste:**
Wähle die Cardio-Form, die du langfristig durchhältst. Konsistenz > "optimale" Methode.`,
      },
      {
        id: 'programming',
        titleKey: 'guide.articles.cardio.sections.programming.title',
        content: `**Ausdauertraining in den Alltag integrieren**

So baust du Cardio sinnvoll in dein Programm ein.

**Für allgemeine Fitness (WHO-Empfehlung):**
• 150 Min moderate ODER 75 Min intensive Aktivität/Woche
• Verteilt auf 3-5 Tage
• Beispiel: 3x 50 Min lockeres Joggen oder 3x 25 Min HIIT

**Für Kraftsportler:**
• 2-3x 20-30 Min moderate Cardio/Woche
• Ideale Tage: Trainingsfreie Tage oder nach dem Krafttraining
• Bevorzugt: Low-Impact (Radfahren, Rudern, Crosstrainer)

**Für Fettabbau:**
• 3-5x Cardio pro Woche
• Mix aus LISS (2-3x) und HIIT (1-2x)
• Gesamtvolumen: 150-250 Min/Woche
• Plus: Alltagsaktivität erhöhen (Schritte!)

**Für Ausdauerleistung:**
• 4-6x pro Woche
• 80% Zone 2, 20% intensive Einheiten
• Wöchentlich steigern (max. 10%/Woche)
• Periodisierung beachten

**Beispiel-Wochenplan (Kraft + Cardio):**
• Mo: Krafttraining Oberkörper
• Di: 30 Min Zone 2 Cardio
• Mi: Krafttraining Unterkörper
• Do: HIIT 20 Min
• Fr: Krafttraining Ganzkörper
• Sa: 45 Min Zone 2 Cardio
• So: Aktive Erholung/Spazieren`,
      },
      {
        id: 'summary',
        titleKey: 'guide.articles.cardio.sections.summary.title',
        content: `**Die wichtigsten Punkte zusammengefasst:**

**Grundlagen:**
• Ausdauertraining verbessert Herzgesundheit und Lebensqualität
• Kombiniere verschiedene Intensitäten (Zone 2 + HIIT)
• Die WHO empfiehlt 150-300 Min moderate Aktivität/Woche

**Für Kraftsportler:**
• 2-3x moderate Cardio beeinträchtigt Muskelaufbau nicht
• Zeitlicher Abstand zum Krafttraining halten
• Radfahren/Rudern schont die Beine

**Für Fettabbau:**
• Gesamtenergiebilanz entscheidend
• Cardio-Form ist zweitrangig – Hauptsache konsistent
• HIIT zeitsparend, LISS weniger erschöpfend

**Für Ausdauerleistung:**
• 80% Zone 2, 20% intensive Einheiten
• VO2max durch HIIT-Intervalle verbessern
• Langsam steigern (max. 10%/Woche)

**Der beste Rat:**
Finde eine Cardio-Form, die dir Spaß macht. Laufen, Radfahren, Schwimmen, Rudern, Tanzen – alles zählt. Regelmäßigkeit ist wichtiger als Perfektion.

Cardio und Kraft sind keine Gegensätze. Kombiniert ergeben sie ein optimales Programm für Gesundheit und Leistung.`,
      },
    ],
    sources: [
      {
        title: 'WHO Guidelines on Physical Activity and Sedentary Behaviour',
        url: 'https://www.who.int/publications/i/item/9789240015128',
        institution: 'World Health Organization (2020)',
      },
      {
        title: 'Concurrent Training: A Meta-Analysis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22002517/',
        institution: 'Wilson et al. (2012) - Journal of Strength and Conditioning',
      },
      {
        title: 'High-Intensity Interval Training vs. Moderate-Intensity Continuous Training',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28076933/',
        institution: 'Weston et al. (2014) - British Journal of Sports Medicine',
      },
      {
        title: 'Cardiorespiratory Fitness and Mortality',
        url: 'https://www.frontiersin.org/articles/10.3389/fcvm.2018.00048/full',
        institution: 'Frontiers in Cardiovascular Medicine',
      },
      {
        title: 'Ausdauertraining und Herzgesundheit',
        url: 'https://www.dshs-koeln.de/',
        institution: 'Deutsche Sporthochschule Köln',
      },
      {
        title: 'ACSM Guidelines for Exercise Testing and Prescription',
        url: 'https://www.acsm.org/',
        institution: 'American College of Sports Medicine',
      },
      {
        title: 'Effect of Exercise on VO2max: Meta-Analysis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17414804/',
        institution: 'Bacon et al. (2013) - Sports Medicine',
      },
    ],
  },

  // ============================================
  // FETTVERBRENNUNG (Fat Loss)
  // ============================================
  'fat-loss': {
    id: 'fat-loss',
    categoryId: 'sport',
    icon: '🔥',
    titleKey: 'guide.articles.fatLoss.title',
    subtitleKey: 'guide.articles.fatLoss.subtitle',
    readingTime: 12,
    sections: [
      {
        id: 'intro',
        titleKey: 'guide.articles.fatLoss.sections.intro.title',
        content: `Rund um das Thema Fettverbrennung kursieren unzählige Mythen. "Fettverbrennungszone", "Kohlenhydrate machen dick", "Abends essen macht fett" – die Liste ist endlos.

In diesem Guide räumen wir mit den größten Mythen auf und erklären die Biochemie dahinter. Du wirst verstehen, warum manche "Weisheiten" Unsinn sind und was wirklich zählt.

Spoiler: Fettabbau ist am Ende simple Physik – aber die Details sind faszinierend.`,
      },
      {
        id: 'biochemistry',
        titleKey: 'guide.articles.fatLoss.sections.biochemistry.title',
        content: `**Wie Fettverbrennung wirklich funktioniert**

Um Mythen zu entlarven, musst du die Grundlagen verstehen.

**Der Prozess in 4 Schritten:**

**1. Lipolyse – Fett wird mobilisiert**
Hormone (Adrenalin, Noradrenalin, Glucagon) aktivieren die Lipolyse. Triglyceride in den Fettzellen werden in Glycerin und freie Fettsäuren gespalten.

**2. Transport im Blut**
Freie Fettsäuren binden an Albumin und werden zu den Muskeln transportiert.

**3. Beta-Oxidation – Fettsäuren werden zerlegt**
In den Mitochondrien werden Fettsäuren in Acetyl-CoA zerlegt. Pro Durchgang entstehen 2 Kohlenstoffatome weniger.

**4. Citratzyklus & Atmungskette**
Acetyl-CoA geht in den Citratzyklus. Hier entsteht ATP – die Energie, die dein Körper nutzt.

**Der entscheidende Punkt:**
Für Schritt 4 braucht der Citratzyklus Oxalacetat. Und woher kommt das? Hauptsächlich aus Kohlenhydraten!

**"Fette verbrennen im Feuer der Kohlenhydrate"**
Dieser alte Biochemie-Spruch ist wahr. Ohne ausreichend Kohlenhydrate kann der Körper Fette nicht effizient verbrennen. Dann muss er auf Ketose umschalten – ein langsamerer Notfallplan.`,
      },
      {
        id: 'myth-zone',
        titleKey: 'guide.articles.fatLoss.sections.mythZone.title',
        content: `**MYTHOS: "In der Fettverbrennungszone verbrenne ich am meisten Fett"**

❌ FALSCH (oder zumindest irreführend)

**Was ist die "Fettverbrennungszone"?**
Bei niedriger Intensität (60-70% HFmax) stammt ein höherer PROZENTANTEIL der Energie aus Fett – etwa 60% vs. 40% bei hoher Intensität.

**Warum das irreführend ist:**
Es geht nicht um den Prozentsatz, sondern um die ABSOLUTE Menge.

**Rechenbeispiel:**
• 30 Min bei 60% HFmax: 200 kcal, davon 60% Fett = **120 kcal aus Fett**
• 30 Min bei 85% HFmax: 400 kcal, davon 40% Fett = **160 kcal aus Fett**

Trotz niedrigerem Prozentsatz verbrennt das intensive Training mehr Fett!

**Die Wahrheit:**
Für Fettabbau zählt die Gesamtenergiebilanz. Verbrenne mehr als du isst – egal bei welcher Intensität. Die "Fettverbrennungszone" ist ein Marketing-Mythos der 90er Jahre.

**Was wirklich stimmt:**
Niedrige Intensität ist schonender für Gelenke und Nervensystem. Das kann ein Argument sein – aber nicht "mehr Fettverbrennung".`,
      },
      {
        id: 'myth-carbs',
        titleKey: 'guide.articles.fatLoss.sections.mythCarbs.title',
        content: `**MYTHOS: "Kohlenhydrate machen dick"**

❌ FALSCH

**Die Wahrheit:**
Ein Kalorienüberschuss macht dick – nicht Kohlenhydrate. Du kannst mit jeder Ernährungsform zu- oder abnehmen.

**Die Biochemie dahinter:**
Kohlenhydrate werden zu Glukose abgebaut und als Glykogen in Muskeln (~400g) und Leber (~100g) gespeichert. Erst wenn diese Speicher voll sind UND du im Überschuss isst, wird Glukose in Fett umgewandelt (De-novo-Lipogenese).

**Interessant:**
De-novo-Lipogenese ist ineffizient und spielt bei normaler Ernährung kaum eine Rolle. Studien zeigen: Bei isokalorischer Ernährung (gleiche Kalorien) ist der Fettabbau bei Low-Carb und High-Carb gleich.

**Warum Kohlenhydrate wichtig sind:**
• Primärer Brennstoff für intensive Aktivitäten
• Schützen Muskelmasse (protein-sparend)
• Nötig für effiziente Fettverbrennung (Oxalacetat!)
• Füllen Glykogenspeicher für Training
• Unterstützen Schilddrüsenfunktion

**Low-Carb funktioniert – aber warum?**
Nicht wegen weniger Kohlenhydraten, sondern wegen:
• Weniger verarbeitete Lebensmittel
• Mehr Protein (sättigend)
• Weniger Kalorien insgesamt
• Wasserverlust (1g Glykogen bindet 3g Wasser)`,
      },
      {
        id: 'myth-evening',
        titleKey: 'guide.articles.fatLoss.sections.mythEvening.title',
        content: `**MYTHOS: "Abends essen macht dick"**

❌ FALSCH

**Die Wahrheit:**
Dein Körper zählt keine Uhrzeit. Was zählt, ist die Gesamtenergiebilanz über den Tag (oder die Woche).

**Woher kommt der Mythos?**
• Menschen, die abends viel essen, essen oft INSGESAMT zu viel
• Abends werden oft hochkalorische Snacks konsumiert
• Correlation ≠ Causation

**Was die Forschung sagt:**
Studien mit kontrollierter Kalorienzufuhr zeigen: Bei gleicher Kalorienmenge ist es egal, wann du isst. Ramadan-Studien zeigen sogar Vorteile von spätem Essen.

**Was für spätes Essen spricht:**
• Soziale Aspekte (Familienessen)
• Bessere Schlafqualität mit Kohlenhydraten am Abend
• Flexiblerer Lifestyle
• Intermittent Fasting funktioniert auch mit spätem Essensfenster

**Was für frühes Essen spricht:**
• Manche schlafen mit leerem Magen besser
• Verdauung kann bei manchen den Schlaf stören
• Persönliche Vorlieben

**Fazit:**
Wähle das Timing, das zu deinem Leben passt und das du durchhalten kannst. Konsistenz > Timing.`,
      },
      {
        id: 'myth-meal-frequency',
        titleKey: 'guide.articles.fatLoss.sections.mythMeals.title',
        content: `**MYTHOS: "Viele kleine Mahlzeiten kurbeln den Stoffwechsel an"**

❌ FALSCH

**Die Theorie dahinter:**
Jede Mahlzeit erhöht den Stoffwechsel durch den "Thermic Effect of Food" (TEF). Mehr Mahlzeiten = mehr TEF = mehr Kalorienverbrauch.

**Warum das nicht stimmt:**
Der TEF ist proportional zur Kalorienmenge – nicht zur Mahlzeitenanzahl.

**Rechenbeispiel (2000 kcal/Tag):**
• 6 Mahlzeiten à 333 kcal: 6 × (333 × 10% TEF) = 200 kcal TEF
• 3 Mahlzeiten à 667 kcal: 3 × (667 × 10% TEF) = 200 kcal TEF

Ergebnis: Identisch!

**Was die Forschung sagt:**
Meta-Analysen zeigen keinen Unterschied im Fettabbau zwischen verschiedenen Mahlzeitenfrequenzen bei gleicher Kalorienzufuhr.

**Was für dich passt:**
• Einige fühlen sich mit vielen kleinen Mahlzeiten kontrollierter
• Andere bevorzugen wenige große Mahlzeiten (mehr Sättigung)
• Intermittent Fasting (1-2 Mahlzeiten) funktioniert auch

**Der Stoffwechsel-Mythos:**
Der "Hungerstoffwechsel" tritt erst bei extremem Kaloriendefizit über längere Zeit ein – nicht wenn du das Frühstück auslässt.`,
      },
      {
        id: 'myth-spot-reduction',
        titleKey: 'guide.articles.fatLoss.sections.mythSpot.title',
        content: `**MYTHOS: "Mit Bauchübungen bekomme ich einen flachen Bauch"**

❌ FALSCH

**Die harte Wahrheit:**
Lokale Fettverbrennung (Spot Reduction) existiert nicht. 1000 Crunches verbrennen kein Bauchfett.

**Warum nicht?**
• Fett wird systemisch mobilisiert, nicht lokal
• Hormone steuern, wo Fett zuerst abgebaut wird
• Genetik bestimmt die Fettverteilung
• Training einer Körperregion verbrennt dort kein Fett

**Was Bauchübungen wirklich tun:**
• Stärken die Bauchmuskulatur
• Verbessern Haltung und Core-Stabilität
• Verbrennen minimal Kalorien
• Zeigen das Sixpack – WENN das Fett weg ist

**Die Reihenfolge des Fettabbaus:**
Typischerweise: Gesicht → Arme → Brust → Bauch → Hüfte → Oberschenkel
(Variiert je nach Genetik und Geschlecht)

**Was wirklich hilft:**
1. Kaloriendefizit für Fettabbau
2. Krafttraining für Muskelerhalt
3. Geduld – Bauchfett geht oft als letztes
4. Realistische Erwartungen

**Der Sixpack wird in der Küche gemacht:**
Bei Männern werden Bauchmuskeln ab ~12% KFA sichtbar, bei Frauen ab ~18-20%.`,
      },
      {
        id: 'myth-fat-makes-fat',
        titleKey: 'guide.articles.fatLoss.sections.mythFat.title',
        content: `**MYTHOS: "Fett macht fett"**

❌ FALSCH

**Die Logik dahinter:**
Körperfett = Nahrungsfett? Klingt logisch, ist aber falsch.

**Die Wahrheit:**
Nahrungsfett hat 9 kcal/g (vs. 4 kcal/g bei Kohlenhydraten/Protein). Es ist kalorienreich, aber nicht automatisch "dick machend".

**Warum Fett sogar hilft:**
• Sehr sättigend (langsame Verdauung)
• Wichtig für Hormone (Testosteron, Östrogen)
• Essenzielle Fettsäuren lebensnotwendig
• Fettlösliche Vitamine (A, D, E, K) brauchen Fett
• Stabilerer Blutzucker als bei reinen Kohlenhydraten

**Der Fehler der 90er Jahre:**
"Low-Fat" Produkte ersetzten Fett durch Zucker. Ergebnis: Gleiche Kalorien, weniger Sättigung, Adipositas-Epidemie.

**Gesunde Fettquellen:**
• Olivenöl, Avocado (einfach ungesättigte)
• Nüsse, Samen (mehrfach ungesättigte)
• Fetter Fisch (Omega-3)
• Eier, Fleisch (gesättigte in Maßen ok)

**Empfehlung:**
20-35% der Kalorien aus Fett. Minimum ~0,5-1g/kg Körpergewicht für hormonelle Gesundheit.`,
      },
      {
        id: 'what-works',
        titleKey: 'guide.articles.fatLoss.sections.whatWorks.title',
        content: `**Was WIRKLICH für Fettabbau funktioniert**

Nach all den Mythen – hier die Fakten:

**1. Kaloriendefizit (nicht verhandelbar)**
• 300-500 kcal unter deinem Verbrauch
• Größeres Defizit = schneller, aber härter + Muskelverlust
• Tracke am Anfang, um ein Gefühl zu bekommen

**2. Protein hoch halten**
• 1,6-2,4 g/kg Körpergewicht
• Schützt Muskelmasse im Defizit
• Sättigendster Makronährstoff
• Höchster TEF (20-30%)

**3. Krafttraining**
• Signal an den Körper: "Muskeln werden gebraucht!"
• Erhöht Grundumsatz langfristig
• Verhindert "skinny fat"
• 2-4x pro Woche reicht

**4. Bewegung im Alltag (NEAT)**
• 10.000+ Schritte täglich
• Treppe statt Aufzug
• Macht 200-500 kcal/Tag Unterschied
• Oft unterschätzt!

**5. Schlaf & Stressmanagement**
• Schlafmangel erhöht Hunger (Ghrelin ↑, Leptin ↓)
• Cortisol fördert Fetteinlagerung am Bauch
• 7-9 Stunden Schlaf anstreben

**6. Geduld & Konsistenz**
• 0,5-1% Körpergewicht pro Woche verlieren
• Plateaus sind normal
• Langfristig denken`,
      },
      {
        id: 'summary',
        titleKey: 'guide.articles.fatLoss.sections.summary.title',
        content: `**Die größten Mythen im Überblick:**

❌ "Fettverbrennungszone" → Gesamtkalorien zählen
❌ "Kohlenhydrate machen dick" → Überschuss macht dick
❌ "Abends essen macht fett" → Timing egal
❌ "Viele kleine Mahlzeiten" → Frequenz egal
❌ "Bauchübungen für flachen Bauch" → Spot Reduction existiert nicht
❌ "Fett macht fett" → Fett ist wichtig und sättigend

**Die Wahrheit in einem Satz:**
Fettabbau = Kaloriendefizit + Proteinzufuhr + Krafttraining + Geduld

**Die Biochemie-Lektion:**
"Fette verbrennen im Feuer der Kohlenhydrate" – dein Körper braucht Kohlenhydrate für effiziente Fettverbrennung. Extreme Low-Carb ist nicht magisch, sondern ein Umweg.

**Merke dir:**
• Keine Wundermittel, keine Abkürzungen
• Jede Diät, die funktioniert, funktioniert über Kaloriendefizit
• Die beste Diät ist die, die du durchhalten kannst
• Muskeln schützen, nicht aushungern

Fettabbau ist simple Thermodynamik. Aber "simpel" heißt nicht "einfach". Der Schlüssel ist Konsistenz über Wochen und Monate – nicht Perfektion für 3 Tage.`,
      },
    ],
    sources: [
      {
        title: 'Effect of diet composition on energy expenditure',
        url: 'https://pubmed.ncbi.nlm.nih.gov/15466943/',
        institution: 'American Journal of Clinical Nutrition',
      },
      {
        title: 'Comparison of weight-loss diets with different compositions',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa0804748',
        institution: 'New England Journal of Medicine',
      },
      {
        title: 'Meal frequency and energy balance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/9155494/',
        institution: 'British Journal of Nutrition',
      },
      {
        title: 'Regional fat loss: spot reduction myth',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17596787/',
        institution: 'Journal of Strength and Conditioning Research',
      },
      {
        title: 'Effects of meal frequency on body composition',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26024494/',
        institution: 'International Society of Sports Nutrition',
      },
      {
        title: 'Biochemie der Fettsäureoxidation',
        url: 'https://www.dshs-koeln.de/',
        institution: 'Deutsche Sporthochschule Köln',
      },
      {
        title: 'The role of protein in weight loss and maintenance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25926512/',
        institution: 'American Journal of Clinical Nutrition',
      },
    ],
  },

  // ============================================
  // SUPPLEMENTS GUIDE
  // ============================================
  supplements: {
    id: 'supplements',
    categoryId: 'nutrition',
    icon: '💊',
    titleKey: 'guide.articles.supplements.title',
    subtitleKey: 'guide.articles.supplements.subtitle',
    readingTime: 12,
    sections: [
      {
        id: 'intro',
        titleKey: 'guide.articles.supplements.sections.intro.title',
        content: `Nahrungsergänzungsmittel (NEM) sind im Fitness- und Sportbereich weit verbreitet. Doch welche sind wirklich sinnvoll, welche überbewertet – und worauf solltest du achten?

Wichtig vorab: NEM ersetzen keine ausgewogene Ernährung. Sie können eine gute Basisernährung ergänzen, aber niemals ersetzen. Die Deutsche Sporthochschule Köln betont: "Für Sportler ist eine ausgewogene und den Bedürfnissen angepasste Ernährung ein grundlegendes Erfordernis."

In diesem Guide erfährst du, welche Supplements wissenschaftlich fundiert sind und wie du sie optimal einsetzt.`,
      },
      {
        id: 'creatine',
        titleKey: 'guide.articles.supplements.sections.creatine.title',
        content: `Kreatin ist das am besten erforschte und effektivste Supplement für Kraftsportler. Mit über 500 wissenschaftlichen Studien gilt es als Gold-Standard.

**Was ist Kreatin?**
Kreatin ist eine natürlich vorkommende Verbindung, die in jeder Körperzelle vorhanden ist und eine wichtige Rolle im Energiestoffwechsel spielt. Der tägliche Umsatz beträgt etwa 2-4 g pro Tag.

**Wissenschaftlich belegte Vorteile:**
• Steigerung der Maximalkraft um durchschnittlich 8% (Meta-Analyse Lanhers et al., 2017)
• Zunahme der fettfreien Körpermasse um ca. 1,3 kg
• Verbesserung der Leistung bei kurzen, intensiven Belastungen
• Unterstützung der Regeneration

**Dosierung:**
• Erhaltungsdosis: 3-5 g täglich
• Ladephase (optional): 20 g/Tag für 5-7 Tage, dann 3-5 g/Tag
• Timing: Zeitpunkt ist nicht entscheidend – Konsistenz zählt

**Wichtige Hinweise:**
• Kreatin-Monohydrat ist die am besten erforschte und günstigste Form
• Ausreichend Wasser trinken (ca. 0,5 L mehr pro Tag)
• Gewichtszunahme durch Wassereinlagerung ist normal (1-2 kg)

Die International Society of Sports Nutrition (ISSN) bezeichnet Kreatin-Monohydrat als "das effektivste leistungssteigernde Nahrungsergänzungsmittel, das Athleten derzeit zur Verfügung steht."`,
      },
      {
        id: 'protein',
        titleKey: 'guide.articles.supplements.sections.protein.title',
        content: `Proteinpulver ist praktisch, aber kein Muss – wenn du deinen Bedarf über die Ernährung deckst.

**Proteinbedarf nach Ziel:**
• Erhaltung: 0,8-1,0 g/kg Körpergewicht
• Muskelaufbau: 1,6-2,2 g/kg Körpergewicht
• Diät mit Muskelerhalt: 2,0-2,4 g/kg Körpergewicht

**Whey vs. Casein:**
Eine Studie von Boirie et al. (1997) zeigte die unterschiedlichen Absorptionsprofile:
• **Whey**: Schnelle Aufnahme, hoher Leucin-Peak – ideal post-workout
• **Casein**: Langsame Freisetzung über 7 Stunden – ideal vor dem Schlafen

**Timing:**
Aktuelle Forschung zeigt: Der Zeitpunkt ist weniger wichtig als gedacht. Entscheidend ist die Gesamtproteinzufuhr über den Tag.

**Qualitätsmerkmale:**
• Biologische Wertigkeit beachten
• Aminosäureprofil prüfen (mind. 2-3 g Leucin pro Portion)
• Auf Zusatzstoffe achten

**Praxistipp:**
Echte Lebensmittel (Eier, Fleisch, Fisch, Hülsenfrüchte) liefern neben Protein auch wichtige Mikronährstoffe. Nutze Proteinpulver als Ergänzung, nicht als Ersatz.`,
      },
      {
        id: 'vitamin-d',
        titleKey: 'guide.articles.supplements.sections.vitaminD.title',
        content: `Vitamin D ist für Sportler besonders relevant – und ein Mangel ist in unseren Breitengraden häufig.

**Warum ist Vitamin D wichtig?**
Die Deutsche Gesellschaft für Sportmedizin betont: Eine mangelhafte Versorgung kann mit Einschränkungen von Leistungsfähigkeit und Regeneration einhergehen. Betroffene Systeme sind:
• Immunsystem
• Skelettmuskulatur
• Knochengesundheit

**Wer ist besonders gefährdet?**
• Indoor-Sportler
• Training in den Wintermonaten
• Personen mit dunklerem Hauttyp
• Alle, die wenig Sonnenlicht bekommen

**Empfohlene Werte:**
• EFSA-Referenzwert: 15-20 µg (600-800 IE) täglich
• Sportmedizinische Empfehlung: Mindestspiegel von 30 ng/ml im Blut
• Tolerable Upper Limit: 100 µg (4.000 IE) täglich

**Supplementierung:**
• Tägliche Einnahme: 1.000-2.000 IE (bei nachgewiesenem Mangel mehr)
• Zu einer fetthaltigen Mahlzeit einnehmen
• Idealerweise mit Vitamin K2 kombinieren

**Wichtig:**
Vor einer Hochdosis-Supplementierung sollte der Vitamin-D-Spiegel im Blut gemessen werden. Das Bundesinstitut für Risikobewertung warnt vor unkontrollierter hochdosierter Einnahme.`,
      },
      {
        id: 'omega3',
        titleKey: 'guide.articles.supplements.sections.omega3.title',
        content: `Omega-3-Fettsäuren haben entzündungshemmende und regenerationsfördernde Eigenschaften – besonders relevant für intensive Trainingsphasen.

**Die wichtigsten Omega-3-Fettsäuren:**
• **EPA** (Eicosapentaensäure): Entzündungshemmend
• **DHA** (Docosahexaensäure): Wichtig für Gehirn und Nervensystem
• **ALA** (Alpha-Linolensäure): Pflanzlich, aber nur 5-10% wird in EPA umgewandelt

**Wissenschaftlich belegte Vorteile:**
• Reduktion von Muskelkater (DOMS)
• Erhöhte Muskelproteinsynthese (Studie: 4 g/Tag über 8 Wochen)
• Schutz vor Muskelabbau in Trainingspausen
• Unterstützung des Immunsystems

**Dosierung nach Ziel:**
• Gesundheitsbasis: 1-2 g EPA+DHA täglich
• Freizeitsportler: 1-2 g EPA+DHA täglich
• Leistungssportler: 2-3 g EPA+DHA täglich

**Qualitätsmerkmale:**
• Hoher EPA/DHA-Gehalt (nicht nur "Fischöl")
• Triglycerid-Form (bessere Bioverfügbarkeit)
• Auf Oxidation und Reinheit achten

**Natürliche Quellen:**
Fetter Seefisch (Lachs, Makrele, Hering) 2-3x pro Woche kann den Bedarf oft decken. Supplementierung ist vor allem bei geringem Fischkonsum sinnvoll.`,
      },
      {
        id: 'caffeine',
        titleKey: 'guide.articles.supplements.sections.caffeine.title',
        content: `Koffein ist ein legales und effektives Stimulans zur Leistungssteigerung – aber richtig eingesetzt.

**Wissenschaftliche Evidenz:**
Die ISSN bestätigt ergogene Wirkungen im Ausdauersport, bei Maximalkraft und Sprunghöhe.

**Optimale Dosierung:**
• Leistungssteigerung: 3-6 mg/kg Körpergewicht
• Beispiel (70 kg): 210-420 mg
• Maximum: 9 mg/kg (mehr Nebenwirkungen, kaum mehr Wirkung)

**Timing:**
• 60 Minuten vor dem Training
• Peak-Wirkung nach 30-60 Minuten
• Halbwertszeit: 3-5 Stunden

**Wirkungsmechanismen:**
• Blockiert Adenosin-Rezeptoren (weniger Müdigkeit)
• Erhöht Kalziumfreisetzung in Muskeln
• Verbessert Fokus und Reaktionszeit

**Wichtige Hinweise:**
• Gewohnheitstrinker profitieren weniger (Toleranzentwicklung)
• Bei Schlafproblemen: Kein Koffein nach 14 Uhr
• Genetische Unterschiede im Abbau (CYP1A2-Gen)

**EFSA-Sicherheitsempfehlung:**
200 mg vor intensivem Training sind unbedenklich. Tägliches Maximum: 400 mg.

**Doping-Status:**
Seit 2004 nicht mehr auf der Verbotsliste der WADA.`,
      },
      {
        id: 'safety',
        titleKey: 'guide.articles.supplements.sections.safety.title',
        content: `Die Deutsche Sporthochschule Köln warnt: "Manche Athleten nehmen einen Cocktail an Nahrungsergänzungsmitteln zu sich und überschreiten Mengen, bei denen wir toxische Nebenwirkungen nicht mehr ausschließen können."

**Risiken bei NEM:**
• Keine staatliche Prüfung vor Inverkehrbringen
• Mögliche Verunreinigungen (besonders bei Importprodukten)
• Wechselwirkungen zwischen Supplements
• Überdosierung bei Kombination mehrerer Produkte

**Die Kölner Liste®:**
Für Wettkampfsportler besonders wichtig: Die Kölner Liste führt NEM mit minimiertem Dopingrisiko. Bei der Herstellung können unbeabsichtigt Dopingsubstanzen in Produkte gelangen.

**Empfehlungen:**
• Kaufe nur bei seriösen Herstellern mit Qualitätszertifikaten
• Weniger ist oft mehr – fokussiere dich auf das Wesentliche
• Dokumentiere, was du einnimmst
• Konsultiere bei Unsicherheit einen Sportmediziner

**Was du NICHT brauchst:**
• BCAAs (bei ausreichender Proteinzufuhr überflüssig)
• Testosteron-Booster (keine Wirkung nachgewiesen)
• Die meisten "Fatburner" (oft überteuert und wirkungslos)
• Magnesium gegen Krämpfe (wissenschaftlich nicht belegt)`,
      },
      {
        id: 'summary',
        titleKey: 'guide.articles.supplements.sections.summary.title',
        content: `**Die "Big 4" für die meisten Sportler:**

1. **Kreatin** (3-5 g/Tag) – Nachweislich wirksam für Kraft und Muskelmasse
2. **Protein** – Nur wenn Bedarf nicht über Ernährung gedeckt
3. **Vitamin D** – Besonders im Winter und bei Mangel
4. **Omega-3** – Bei geringem Fischkonsum

**Optional bei spezifischen Zielen:**
• Koffein vor dem Training (Leistungssteigerung)
• Magnesium und Zink bei nachgewiesenem Mangel

**Prioritäten:**
1. Ausgewogene Ernährung
2. Ausreichend Schlaf und Regeneration
3. Konsistentes Training
4. DANN erst Supplements

Denk dran: Supplements machen vielleicht 5% des Erfolgs aus. Die anderen 95% kommen von Training, Ernährung, Schlaf und Konsistenz.`,
      },
    ],
    sources: [
      {
        title: 'Nahrungsergänzungsmittel im Sport',
        url: 'https://www.dshs-koeln.de/institut-fuer-biochemie/sporternaehrung/forschungsschwerpunkte/nahrungsergaenzungsmittel/',
        institution: 'Deutsche Sporthochschule Köln',
      },
      {
        title: 'Kölner Liste® – Mehr Sicherheit durch getestete Produkte',
        url: 'https://www.koelnerliste.com/',
        institution: 'Deutsche Sporthochschule Köln',
      },
      {
        title: 'ISSN Exercise & Sports Nutrition Review',
        url: 'https://link.springer.com/article/10.1186/s12970-018-0242-y',
        institution: 'International Society of Sports Nutrition',
      },
      {
        title: 'ISSN Position Stand: Protein and Exercise',
        url: 'https://link.springer.com/article/10.1186/s12970-017-0177-8',
        institution: 'International Society of Sports Nutrition',
      },
      {
        title: 'ISSN Position Stand: Creatine Supplementation',
        url: 'https://link.springer.com/collections/bdgfbegaef',
        institution: 'International Society of Sports Nutrition',
      },
      {
        title: 'Vitamin D und Leistungssport: Perspektiven und Fallstricke',
        url: 'https://www.zeitschrift-sportmedizin.de/vitamin-d-und-leistungssport-perspektiven-und-fallstricke/',
        institution: 'Deutsche Zeitschrift für Sportmedizin',
      },
      {
        title: 'EFSA legt Referenzwerte für Vitamin D fest',
        url: 'https://www.efsa.europa.eu/de/press/news/161028',
        institution: 'European Food Safety Authority',
      },
      {
        title: 'Koffein zur Leistungssteigerung im Sport',
        url: 'https://www.zeitschrift-sportmedizin.de/koffein-zur-leistungssteigerung-im-sport/',
        institution: 'Deutsche Zeitschrift für Sportmedizin',
      },
      {
        title: 'Hochdosierte Nahrungsergänzungsmittel mit Vitamin D',
        url: 'https://www.bfr.bund.de/cm/343/hochdosierte-nahrungsergaenzungsmittel-mit-vitamin-d-koennen-langfristig-die-gesundheit-beeintraechtigen.pdf',
        institution: 'Bundesinstitut für Risikobewertung',
      },
      {
        title: 'Meta-Analyse: Kreatin und Maximalkraft (Lanhers et al., 2017)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/',
        institution: 'PubMed / NIH',
      },
    ],
  },

  // ============================================
  // SCHLAF (Sleep)
  // ============================================
  sleep: {
    id: 'sleep',
    categoryId: 'health',
    icon: '😴',
    titleKey: 'guide.articles.sleep.title',
    subtitleKey: 'guide.articles.sleep.subtitle',
    readingTime: 12,
    sections: [
      {
        id: 'intro',
        titleKey: 'guide.articles.sleep.sections.intro.title',
        content: `Schlaf ist der mächtigste Regenerationsfaktor überhaupt. Während wir schlafen, repariert der Körper Gewebe, konsolidiert Erinnerungen und reguliert Hormone – Prozesse, die für sportliche Leistung unverzichtbar sind.

Die Deutsche Gesellschaft für Schlafforschung und Schlafmedizin (DGSM) betont: "Ausreichender und erholsamer Schlaf ist eine wesentliche Voraussetzung für körperliche und geistige Gesundheit."

Dieser Guide erklärt die Wissenschaft hinter dem Schlaf und gibt praktische Tipps für bessere Erholung.`,
      },
      {
        id: 'sleep-phases',
        titleKey: 'guide.articles.sleep.sections.phases.title',
        content: `**Die Architektur des Schlafs**

Ein Schlafzyklus dauert etwa 90 Minuten und wiederholt sich 4-6 Mal pro Nacht.

**Die 4 Schlafphasen:**

**N1 – Einschlafphase (5%)**
• Übergang vom Wachen zum Schlafen
• Leicht aufzuwecken
• Dauer: wenige Minuten

**N2 – Leichter Schlaf (45-55%)**
• Herzfrequenz und Temperatur sinken
• Schlafspindeln im EEG
• Wichtig für motorisches Lernen

**N3 – Tiefschlaf (15-25%)**
• Tiefste Schlafphase, schwer aufzuwecken
• Wachstumshormon-Ausschüttung (bis zu 70% der Tagesproduktion)
• Muskelregeneration und Immunsystem aktiv
• Besonders wichtig in der ersten Nachthälfte

**REM-Schlaf (20-25%)**
• Rapid Eye Movement, lebhafte Träume
• Gehirn hochaktiv, Körper paralysiert
• Gedächtniskonsolidierung und Emotionsverarbeitung
• Nimmt in der zweiten Nachthälfte zu

**Für Sportler besonders wichtig:**
Tiefschlaf (N3) ist die Phase der körperlichen Regeneration. Wer zu kurz schläft, verliert vor allem REM-Schlaf – wichtig für Koordination und Lernen.`,
      },
      {
        id: 'hormones',
        titleKey: 'guide.articles.sleep.sections.hormones.title',
        content: `**Schlaf und Hormone – Die unsichtbaren Effekte**

Schlafmangel bringt das hormonelle Gleichgewicht durcheinander – mit direkten Folgen für Training und Körperzusammensetzung.

**Wachstumshormon (HGH)**
• 70% der täglichen Ausschüttung im Tiefschlaf
• Fördert Muskelaufbau und Fettabbau
• Bei Schlafmangel: Signifikant reduziert

**Testosteron**
• Produktion hauptsächlich nachts
• Studie (Leproult & Van Cauter, 2011): 5 Stunden Schlaf über eine Woche = 10-15% weniger Testosteron
• Entspricht einer Alterung um 10-15 Jahre

**Cortisol**
• Stresshormon, normalerweise morgens am höchsten
• Bei Schlafmangel: Erhöhte Abendwerte
• Fördert Muskelabbau und Fetteinlagerung (besonders am Bauch)

**Leptin und Ghrelin**
• Leptin = Sättigungshormon (↓ bei Schlafmangel)
• Ghrelin = Hungerhormon (↑ bei Schlafmangel)
• Ergebnis: Mehr Hunger, weniger Sättigung

**Insulin**
• Schlafmangel reduziert Insulinsensitivität
• Erhöhtes Risiko für Typ-2-Diabetes
• Schlechtere Nährstoffverwertung

**Fazit:**
Schlafmangel ist wie ein Anti-Doping-Cocktail – weniger Muskelaufbau, mehr Fetteinlagerung, mehr Hunger.`,
      },
      {
        id: 'performance',
        titleKey: 'guide.articles.sleep.sections.performance.title',
        content: `**Schlaf und sportliche Leistung**

Die Forschung zeigt eindeutig: Schlaf ist ein legales Leistungsoptimierungsmittel.

**Stanford-Basketballstudie (Mah et al., 2011):**
• Spieler schliefen 10 Stunden pro Nacht (5-7 Wochen)
• Ergebnis: Sprint-Zeit verbessert, Freiwurfquote +9%, Reaktionszeit schneller

**Auswirkungen von Schlafmangel:**

**Kraft und Power:**
• 1 Nacht Schlafentzug: Maximalkraft -9% (Reilly & Piercy, 1994)
• Reduktion der Muskelglykogen-Resynthese
• Langsamere Erholung zwischen Sätzen

**Ausdauer:**
• Zeit bis zur Erschöpfung sinkt um 11% (Oliver et al., 2009)
• Höhere wahrgenommene Anstrengung bei gleicher Leistung
• Verschlechterte Thermoregulation

**Verletzungsrisiko:**
• Studie mit Jugendsportlern: <8h Schlaf = 1,7x höheres Verletzungsrisiko
• Verschlechterte Koordination und Reaktionszeit
• Langsamere Geweberegeneration

**Kognitive Funktion:**
• Reaktionszeit verlangsamt
• Entscheidungsfindung beeinträchtigt
• Fokus und Konzentration reduziert

**Die Empfehlung der ACSM:**
Athleten sollten 7-9 Stunden Schlaf anstreben, bei hohem Trainingsvolumen eher 9-10 Stunden.`,
      },
      {
        id: 'sleep-hygiene',
        titleKey: 'guide.articles.sleep.sections.hygiene.title',
        content: `**Schlafhygiene – Praktische Optimierung**

Die Schlafumgebung und Gewohnheiten haben großen Einfluss auf die Schlafqualität.

**Schlafumgebung:**

**Temperatur:**
• Optimal: 16-19°C
• Körpertemperatur muss zum Einschlafen sinken
• Kühles Schlafzimmer unterstützt diesen Prozess

**Dunkelheit:**
• Komplette Dunkelheit ideal
• Melatonin-Produktion wird durch Licht gehemmt
• Verdunkelungsvorhänge oder Schlafmaske nutzen

**Lärm:**
• Stille oder konstantes Hintergrundrauschen
• White Noise oder Ohrstöpsel bei Bedarf
• Elektronische Geräte stumm schalten

**Matratze und Kissen:**
• Individuell anpassen
• Alle 7-10 Jahre erneuern
• Wirbelsäule sollte neutral liegen

**Verhaltensregeln:**

**1-Stunde-Regel vor dem Schlafen:**
• Kein blaues Licht (Handy, Laptop, TV)
• Keine intensive körperliche Aktivität
• Keine schweren Mahlzeiten
• Kein Koffein nach 14 Uhr

**Konstanter Rhythmus:**
• Jeden Tag zur gleichen Zeit aufstehen
• Auch am Wochenende maximal ±1 Stunde abweichen
• Zirkadianer Rhythmus liebt Routine`,
      },
      {
        id: 'nutrition-sleep',
        titleKey: 'guide.articles.sleep.sections.nutrition.title',
        content: `**Ernährung für besseren Schlaf**

Was du isst und wann du isst, beeinflusst deinen Schlaf.

**Schlaffördernde Nährstoffe:**

**Tryptophan:**
• Vorstufe von Serotonin und Melatonin
• Quellen: Truthahn, Eier, Käse, Nüsse, Samen
• Am besten mit Kohlenhydraten kombinieren (verbessert Aufnahme)

**Magnesium:**
• Entspannt Muskeln und Nervensystem
• Quellen: Nüsse, Vollkorn, grünes Blattgemüse
• Supplementierung: 200-400 mg abends

**Melatonin-reiche Lebensmittel:**
• Sauerkirschen (hoher Melatonin-Gehalt)
• Studien zeigen verbesserte Schlafqualität
• 30-60 Minuten vor dem Schlafen

**Timing der Mahlzeiten:**

**Letzte große Mahlzeit:**
• 2-3 Stunden vor dem Schlafen
• Zu voller Magen stört den Schlaf
• Aber: Nicht hungrig ins Bett gehen

**Kohlenhydrate am Abend:**
• Entgegen dem Mythos: Können Schlaf verbessern
• Fördern Tryptophan-Aufnahme ins Gehirn
• High-GI Kohlenhydrate 4h vor dem Schlafen optimal (Afaghi et al., 2007)

**Was du meiden solltest:**
• Koffein nach 14 Uhr (Halbwertszeit 5-6 Stunden)
• Alkohol (stört REM-Schlaf und Tiefschlaf)
• Scharfe Speisen am Abend
• Zu viel Flüssigkeit (häufiges Aufwachen)`,
      },
      {
        id: 'napping',
        titleKey: 'guide.articles.sleep.sections.napping.title',
        content: `**Power Naps – Strategisches Nickerchen**

Kurze Nickerchen können Leistung und Erholung verbessern – wenn richtig eingesetzt.

**Die optimale Nap-Dauer:**

**10-20 Minuten (Power Nap):**
• Nur leichter Schlaf (N1-N2)
• Sofort mehr Wachheit und Fokus
• Keine Schlaftrunkenheit
• Ideal für Arbeitstage

**60 Minuten:**
• Einschließlich Tiefschlaf
• Gut für Gedächtnis und Lernen
• Kann kurze Schlaftrunkenheit verursachen

**90 Minuten:**
• Vollständiger Schlafzyklus
• Alle Schlafphasen inklusive REM
• Aufwachen am Ende des Zyklus = erfrischt
• Ideal vor Wettkämpfen bei Schlafdefizit

**Timing:**
• Zwischen 13-15 Uhr optimal (natürliches Tief)
• Nicht nach 16 Uhr (stört Nachtschlaf)
• Bei Schlafproblemen: Naps vermeiden

**Für Athleten:**

**Vor dem Training:**
• 20-Minuten-Nap kann Leistung verbessern
• Besonders bei Schlafdefizit hilfreich

**Nach dem Training:**
• 20-60 Minuten beschleunigt Regeneration
• Wachstumshormon-Ausschüttung

**Coffee Nap:**
• Kaffee trinken, dann 20 Min schlafen
• Koffein wirkt nach dem Aufwachen
• Studienergebnis: Besser als nur Kaffee oder nur Nap`,
      },
      {
        id: 'tracking',
        titleKey: 'guide.articles.sleep.sections.tracking.title',
        content: `**Schlaf messen und optimieren**

Was gemessen wird, kann verbessert werden.

**Schlaftracker:**

**Consumer-Geräte (Fitbit, Apple Watch, Oura Ring):**
• Messen Bewegung, Herzfrequenz, HRV
• Schätzen Schlafphasen ab
• ~70-80% Übereinstimmung mit Polysomnographie
• Gut für Trends, nicht für exakte Phasen

**Was du tracken solltest:**
• Gesamtschlafdauer
• Schlafeffizienz (Zeit im Bett vs. Schlafzeit)
• Anzahl der Aufwachphasen
• Subjektive Erholung am Morgen

**Schlaftagebuch führen:**
• Zu Bett / Aufgestanden
• Gefühlte Schlafqualität (1-10)
• Koffein, Alkohol, Training am Vortag
• Stresslevel

**Herzratenvariabilität (HRV):**
• Zeigt Erholungszustand des Nervensystems
• Hohe HRV = gute Erholung
• Morgens im Liegen messen
• Trend über Wochen beobachten

**Warnsignale für schlechten Schlaf:**
• Regelmäßig <7 Stunden
• Mehr als 30 Min zum Einschlafen
• Häufiges Aufwachen nachts
• Müdigkeit trotz ausreichender Schlafdauer
• Leistungsabfall im Training`,
      },
      {
        id: 'summary',
        titleKey: 'guide.articles.sleep.sections.summary.title',
        content: `**Die wichtigsten Punkte:**

**Schlafdauer:**
• 7-9 Stunden für die meisten Erwachsenen
• Athleten: Eher 8-10 Stunden
• Konsistenter Schlafrhythmus wichtiger als exakte Dauer

**Schlafqualität:**
• Tiefschlaf für körperliche Regeneration
• REM-Schlaf für Koordination und Lernen
• Beide Phasen brauchen ausreichende Schlafdauer

**Hormonelle Effekte:**
• Wachstumshormon hauptsächlich im Tiefschlaf
• Schlafmangel senkt Testosteron, erhöht Cortisol
• Hunger-/Sättigungshormone werden gestört

**Praktische Tipps:**
• Kühles, dunkles, ruhiges Schlafzimmer
• 1 Stunde vor dem Schlafen kein Bildschirm
• Konstante Schlafzeiten einhalten
• Koffein nur bis 14 Uhr

**Power Naps:**
• 10-20 Minuten für schnelle Erholung
• Nicht nach 16 Uhr
• Besonders hilfreich bei Schlafdefizit

**Merke:**
Du kannst nicht "vorschlafen" – aber du kannst Schlafschulden aufbauen. Priorisiere Schlaf wie Training und Ernährung.`,
      },
    ],
    sources: [
      {
        title: 'Sleep and Athletic Performance: The Effects of Sleep Loss on Exercise Performance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28662971/',
        institution: 'Watson (2017) - Current Sports Medicine Reports',
      },
      {
        title: 'Effect of Sleep Extension on the Athletic Performance of College Basketball Players',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21731144/',
        institution: 'Mah et al. (2011) - Sleep',
      },
      {
        title: 'Effect of 1 Week of Sleep Restriction on Testosterone Levels',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21632481/',
        institution: 'Leproult & Van Cauter (2011) - JAMA',
      },
      {
        title: 'Chronic Sleep Restriction and the Risk of Injury in Adolescent Athletes',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25028798/',
        institution: 'Milewski et al. (2014) - Journal of Pediatric Orthopaedics',
      },
      {
        title: 'Schlaf und Erholung im Leistungssport',
        url: 'https://www.dgsm.de/',
        institution: 'Deutsche Gesellschaft für Schlafforschung und Schlafmedizin',
      },
      {
        title: 'High-glycemic-index carbohydrate meals shorten sleep onset',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17284739/',
        institution: 'Afaghi et al. (2007) - American Journal of Clinical Nutrition',
      },
      {
        title: 'Sleep Hygiene and Sleep Quality',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25903579/',
        institution: 'Irish et al. (2015) - Sleep Medicine Reviews',
      },
    ],
  },

  // ============================================
  // STRESS (Stress Management)
  // ============================================
  stress: {
    id: 'stress',
    categoryId: 'health',
    icon: '🧠',
    titleKey: 'guide.articles.stress.title',
    subtitleKey: 'guide.articles.stress.subtitle',
    readingTime: 11,
    sections: [
      {
        id: 'intro',
        titleKey: 'guide.articles.stress.sections.intro.title',
        content: `Stress ist nicht per se schlecht – er ist eine natürliche Anpassungsreaktion. Training selbst ist Stress. Das Problem entsteht, wenn Stress chronisch wird und die Erholung übersteigt.

Das Robert Koch-Institut berichtet: Etwa 20% der Erwachsenen in Deutschland leiden unter chronischem Stress mit Auswirkungen auf die Gesundheit.

Dieser Guide erklärt, wie Stress funktioniert, wann er schadet – und wie du ihn managst, um Training und Alltag in Balance zu bringen.`,
      },
      {
        id: 'stress-response',
        titleKey: 'guide.articles.stress.sections.response.title',
        content: `**Die Stressreaktion verstehen**

Die Stressreaktion ist ein evolutionäres Überlebensprogramm – "Fight or Flight".

**Akuter Stress (hilfreich):**
• Adrenalin und Noradrenalin werden freigesetzt
• Herzfrequenz und Blutdruck steigen
• Glukose wird mobilisiert
• Fokus und Reaktionsfähigkeit erhöht
• Nach der Bedrohung: Rückkehr zur Baseline

**Chronischer Stress (schädlich):**
• Cortisol bleibt dauerhaft erhöht
• Körper kann nicht mehr regenerieren
• Immunsystem wird unterdrückt
• Schlafqualität leidet
• Fetteinlagerung am Bauch nimmt zu

**Die HPA-Achse:**
Hypothalamus → Hypophyse → Nebenniere

Diese Achse reguliert die Cortisolausschüttung. Bei chronischem Stress wird sie dysreguliert – der Körper "vergisst", wie er entspannen kann.

**Wichtig für Sportler:**
Training ist ein kontrollierter Stressor. Aber: Training + Arbeitsstress + Schlafmangel + Beziehungsprobleme = Gesamtstress überfordert die Anpassungsfähigkeit.

**Das Stress-Fass-Modell:**
Stell dir deinen Körper als Fass vor. Jeder Stressor füllt es. Wenn es überläuft, kommst du nicht mehr hinterher.`,
      },
      {
        id: 'cortisol',
        titleKey: 'guide.articles.stress.sections.cortisol.title',
        content: `**Cortisol – Freund und Feind**

Cortisol ist nicht "das böse Hormon" – es ist lebensnotwendig. Problematisch wird es bei chronischer Erhöhung.

**Normale Cortisol-Funktionen:**
• Mobilisiert Energie (Glukose aus Speichern)
• Reguliert Immunantwort
• Folgt einem Tagesrhythmus (morgens hoch, abends niedrig)
• Hilft bei der Anpassung an Stress

**Cortisol im Training:**
• Steigt während des Trainings an (normal!)
• Ermöglicht Energiebereitstellung
• Nach dem Training: Sollte sinken
• Bei guter Erholung: Kein Problem

**Chronisch erhöhtes Cortisol:**
• Muskelabbau (katabol)
• Fetteinlagerung, besonders am Bauch
• Erhöhter Blutzucker
• Unterdrücktes Immunsystem
• Schlafprobleme
• Verminderte Testosteronproduktion

**Zeichen für zu viel Stress:**
• Leistungsstagnation trotz Training
• Ständige Müdigkeit
• Häufige Infekte
• Gereiztheit und Stimmungsschwankungen
• Heißhunger auf Süßes/Salziges
• Schlafprobleme

**Cortisol senken:**
• Ausreichend Schlaf (wichtigster Faktor!)
• Entspannungstechniken
• Soziale Kontakte
• Zeit in der Natur
• Lachen und Spaß`,
      },
      {
        id: 'training-stress',
        titleKey: 'guide.articles.stress.sections.training.title',
        content: `**Training und Stress – Die Balance finden**

Training ist Stress. Erfolgreiche Athleten managen ihren Gesamtstress – nicht nur die Trainingsbelastung.

**Das Supercompensations-Prinzip:**
• Training = Reiz (Stress)
• Erholung = Anpassung
• Nächste Einheit = Auf höherem Level
• ABER: Nur bei ausreichender Erholung!

**Übertraining – wenn die Balance kippt:**

**Frühe Warnsignale:**
• Leistungsstagnation
• Erhöhte Morgen-Herzfrequenz
• Gestörter Schlaf
• Motivationsverlust
• Vermehrte Verletzungen

**Manifestes Übertraining:**
• Leistungsabfall über Wochen
• Chronische Müdigkeit
• Depression und Angst
• Hormonstörungen
• Kann Monate zur Erholung brauchen

**Wie Alltagsstress das Training beeinflusst:**
Studie (Stults-Kolehmainen et al., 2014): Personen mit hohem Alltagsstress erholten sich langsamer von Krafttraining. Gleiche Trainingsbelastung, schlechtere Anpassung.

**Praktische Konsequenz:**
An stressigen Tagen: Trainingsvolumen oder -intensität reduzieren. Der Körper hat nur ein "Erholungsbudget".

**Die 80/20-Regel:**
80% der Trainingseinheiten: Moderat
20% der Trainingseinheiten: Intensiv
Mehr ist oft nicht besser!`,
      },
      {
        id: 'stress-management',
        titleKey: 'guide.articles.stress.sections.management.title',
        content: `**Evidenzbasierte Stressmanagement-Techniken**

Diese Methoden sind wissenschaftlich untersucht und wirksam.

**1. Atemübungen:**

**Box Breathing (4-4-4-4):**
• 4 Sekunden einatmen
• 4 Sekunden halten
• 4 Sekunden ausatmen
• 4 Sekunden halten
• 4-5 Runden, mehrmals täglich

**Physiologischer Seufzer:**
• Doppelte Einatmung (durch Nase)
• Lange Ausatmung (durch Mund)
• Aktiviert Parasympathikus in Sekunden
• Stanford-Studie: Effektivste schnelle Methode

**2. Progressive Muskelentspannung:**
• Muskelgruppen nacheinander anspannen (5 Sek)
• Dann entspannen (30 Sek)
• Ganzer Körper: 15-20 Minuten
• Vor dem Schlafen besonders effektiv

**3. Meditation:**
• Schon 10 Minuten täglich wirksam
• Apps wie Headspace, Calm, 7Mind
• Fokus auf Atem oder Body Scan
• Studie: 8 Wochen MBSR senkt Cortisol signifikant

**4. Zeit in der Natur:**
• "Forest Bathing" (Shinrin-yoku)
• 20 Minuten reichen für messbare Effekte
• Senkt Cortisol, Blutdruck, Herzfrequenz
• Steigert Immunfunktion`,
      },
      {
        id: 'lifestyle',
        titleKey: 'guide.articles.stress.sections.lifestyle.title',
        content: `**Lifestyle-Faktoren für weniger Stress**

Langfristige Stressresilienz entsteht durch tägliche Gewohnheiten.

**Schlaf (der wichtigste Faktor):**
• 7-9 Stunden Priorität geben
• Konstante Schlafzeiten
• Schlafschulden erhöhen Stressempfindlichkeit dramatisch

**Bewegung:**
• Regelmäßige moderate Bewegung senkt Cortisol
• Aber: Nicht übertrainieren!
• Yoga und leichtes Cardio besonders stressabbauend
• Bewegung im Freien verstärkt den Effekt

**Ernährung:**
• Blutzuckerspitzen vermeiden (führen zu Cortisol-Ausschüttung)
• Ausreichend Protein und gesunde Fette
• Koffein limitieren bei Stressempfindlichkeit
• Alkohol reduzieren (stört Schlaf, erhöht Cortisol)

**Soziale Verbindungen:**
• Oxytocin (Bindungshormon) wirkt anti-Cortisol
• Positive soziale Kontakte sind Stresspuffer
• Einsamkeit ist ein massiver Stressor
• Qualität vor Quantität

**Mindset:**
• Stress als Herausforderung, nicht als Bedrohung sehen
• Studien zeigen: Die Interpretation von Stress beeinflusst die Wirkung
• "Ich bin aufgeregt" statt "Ich bin gestresst"
• Kontrollierbaren Fokus behalten

**Digital Detox:**
• Benachrichtigungen minimieren
• Bildschirmzeit vor dem Schlafen reduzieren
• Social Media bewusst konsumieren
• Erreichbarkeit begrenzen`,
      },
      {
        id: 'recovery-strategies',
        titleKey: 'guide.articles.stress.sections.recovery.title',
        content: `**Aktive Erholungsstrategien**

Erholung ist nicht nur Nichtstun – sie kann aktiv gefördert werden.

**Parasympathikus aktivieren:**

**Kälteanwendung:**
• Kaltes Wasser im Gesicht (Tauchreflex)
• Kalte Duschen (60-90 Sekunden am Ende)
• Aktiviert Vagusnerv
• Senkt akut Herzfrequenz und Cortisol

**Wärmeanwendung:**
• Sauna (nachweislich stressreduzierend)
• Warmes Bad (vor dem Schlafen)
• Entspannt Muskulatur
• Fördert Durchblutung

**Massage und Selbstmassage:**
• Senkt Cortisol, erhöht Serotonin
• Foam Rolling als Selbstmassage
• Auch kurze Sessions wirksam

**Herzratenvariabilität (HRV) Training:**
• Biofeedback für Nervensystem
• Apps: Elite HRV, HRV4Training
• Training des Vagustonus
• Langfristig: Bessere Stressresilienz

**Hobbys und Lachen:**
• Aktivitäten ohne Leistungsdruck
• Lachen senkt messbar Cortisol
• Musik hören oder machen
• Kreative Tätigkeiten

**Grenzen setzen:**
• "Nein" sagen lernen
• Arbeitszeiten einhalten
• Erholungszeiten blockieren wie Termine
• Pausen ohne schlechtes Gewissen`,
      },
      {
        id: 'summary',
        titleKey: 'guide.articles.stress.sections.summary.title',
        content: `**Die wichtigsten Punkte:**

**Stress verstehen:**
• Akuter Stress ist natürlich und hilfreich
• Chronischer Stress schadet Gesundheit und Leistung
• Der Körper summiert allen Stress (Training + Leben)

**Cortisol im Blick:**
• Normal: Morgens hoch, abends niedrig
• Chronisch erhöht: Muskelabbau, Fetteinlagerung, Schlafprobleme
• Wichtigste Gegenmaßnahme: Ausreichend Schlaf

**Training anpassen:**
• An stressigen Tagen weniger intensiv trainieren
• Übertraining ernst nehmen
• 80% moderat, 20% intensiv

**Praktische Techniken:**
• Atemübungen (Box Breathing, Physiologischer Seufzer)
• Progressive Muskelentspannung
• Meditation (10 Min/Tag reichen)
• Zeit in der Natur

**Lifestyle:**
• Schlaf priorisieren
• Soziale Kontakte pflegen
• Digitale Auszeiten nehmen
• Erholung aktiv einplanen

**Merke:**
Du kannst nicht allen Stress vermeiden – aber du kannst deine Erholungsfähigkeit trainieren. Stressmanagement ist eine Fähigkeit, die sich verbessern lässt.`,
      },
    ],
    sources: [
      {
        title: 'Stress und Gesundheit in Deutschland',
        url: 'https://www.rki.de/',
        institution: 'Robert Koch-Institut',
      },
      {
        title: 'Recovery from stress-induced cortisol secretion',
        url: 'https://pubmed.ncbi.nlm.nih.gov/',
        institution: 'Psychoneuroendocrinology',
      },
      {
        title: 'Chronic Psychological Stress Impairs Recovery of Muscular Function',
        url: 'https://pubmed.ncbi.nlm.nih.gov/24343323/',
        institution: 'Stults-Kolehmainen et al. (2014) - Medicine & Science in Sports',
      },
      {
        title: 'Brief structured respiration practices enhance mood and reduce physiological arousal',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36630953/',
        institution: 'Balban et al. (2023) - Cell Reports Medicine (Stanford)',
      },
      {
        title: 'Effect of Forest Bathing on Physiological and Psychological Responses',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28245811/',
        institution: 'International Journal of Environmental Research',
      },
      {
        title: 'Mindfulness-Based Stress Reduction and Health Benefits',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23724462/',
        institution: 'JAMA Internal Medicine',
      },
      {
        title: 'Overtraining Syndrome in Athletes',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27566991/',
        institution: 'Sports Medicine',
      },
    ],
  },

  // ============================================
  // REGENERATION (Recovery)
  // ============================================
  recovery: {
    id: 'recovery',
    categoryId: 'health',
    icon: '🛁',
    titleKey: 'guide.articles.recovery.title',
    subtitleKey: 'guide.articles.recovery.subtitle',
    readingTime: 13,
    sections: [
      {
        id: 'intro',
        titleKey: 'guide.articles.recovery.sections.intro.title',
        content: `"Wachstum passiert nicht im Training, sondern in der Erholung." Dieser Grundsatz wird oft zitiert, aber selten konsequent umgesetzt.

Die Deutsche Sporthochschule Köln betont: "Regeneration ist ein aktiver Prozess, der durch gezielte Maßnahmen unterstützt werden kann. Training ohne ausreichende Erholung führt zu Stagnation oder Leistungsabfall."

Dieser Guide erklärt die Wissenschaft der Regeneration und welche Methoden tatsächlich funktionieren – basierend auf aktueller Forschung.`,
      },
      {
        id: 'science',
        titleKey: 'guide.articles.recovery.sections.science.title',
        content: `**Die Physiologie der Regeneration**

Was passiert eigentlich, wenn wir uns erholen?

**Superkompensation:**
1. Training setzt einen Reiz (Stress)
2. Leistungsfähigkeit sinkt kurzzeitig
3. In der Erholung: Anpassung ÜBER das Ausgangsniveau
4. Nächstes Training auf höherem Level

**Zeitliche Abläufe:**

**Neurale Erholung (Stunden):**
• Nervensystem erholt sich schnell
• Koordination und Technik zuerst wieder da

**Energiespeicher (12-48 Stunden):**
• Glykogen-Resynthese
• Abhängig von Kohlenhydratzufuhr
• Nach 24h meist vollständig

**Muskuläre Reparatur (24-72 Stunden):**
• Mikrorisse werden repariert
• Muskelproteinsynthese erhöht für 24-48h
• Abhängig von Intensität und Volumen

**Bindegewebe (48-96+ Stunden):**
• Sehnen und Bänder erholen langsamer
• Grund für gestaffelte Belastung

**Individuelle Faktoren:**
• Alter (ältere Athleten brauchen länger)
• Trainingserfahrung (Fortgeschrittene erholen schneller)
• Schlafqualität
• Ernährungsstatus
• Psychischer Stress

**Die Faustregel:**
Je intensiver die Belastung, desto länger die Erholung. Schwere Kniebeugen: 72h+. Leichtes Cardio: 24h.`,
      },
      {
        id: 'nutrition-recovery',
        titleKey: 'guide.articles.recovery.sections.nutrition.title',
        content: `**Ernährung für optimale Regeneration**

Die Ernährung nach dem Training legt den Grundstein für Erholung und Anpassung.

**Protein:**

**Timing:**
• Post-Workout: 20-40g Protein
• Fenster: 0-4 Stunden (nicht so eng wie früher gedacht)
• Vor dem Schlafen: 40g Casein verlängert Muskelproteinsynthese

**Menge:**
• 1,6-2,2 g/kg Körpergewicht täglich
• Gleichmäßig über den Tag verteilen
• 0,4-0,5 g/kg pro Mahlzeit optimal

**Kohlenhydrate:**

**Glykogen-Resynthese:**
• 1-1,2 g/kg Körpergewicht post-workout
• Bei mehreren Einheiten pro Tag: Kritisch wichtig
• Bei einer Einheit pro Tag: Weniger zeitkritisch

**Quellen:**
• Reis, Kartoffeln, Haferflocken
• Obst für schnelle Energie
• Bei intensivem Training: Höherer Bedarf

**Hydration:**

**Flüssigkeitsverlust ausgleichen:**
• Wiegen vor und nach dem Training
• 1,5 Liter pro kg Gewichtsverlust trinken
• Mit Elektrolyten bei starkem Schwitzen

**Täglicher Bedarf:**
• 35-40 ml pro kg Körpergewicht
• Mehr bei Training und Hitze

**Mikronährstoffe:**
• Magnesium: Muskelentspannung, 300-400 mg/Tag
• Zink: Immunsystem und Testosteron
• Omega-3: Entzündungshemmend
• Antioxidantien: Vorsicht bei Überdosierung (können Anpassung hemmen)`,
      },
      {
        id: 'active-recovery',
        titleKey: 'guide.articles.recovery.sections.active.title',
        content: `**Aktive Regeneration**

Leichte Bewegung kann die Erholung beschleunigen – richtig eingesetzt.

**Warum aktive Erholung funktioniert:**
• Erhöhte Durchblutung = mehr Nährstoffe zu den Muskeln
• Abtransport von Stoffwechselprodukten
• Aufrechterhaltung der Beweglichkeit
• Psychologischer Effekt: "Ich tue etwas"

**Geeignete Aktivitäten:**
• Leichtes Cardio (Zone 1, 30-40 Min)
• Schwimmen (gelenkschonend, Wasserdruck)
• Radfahren (wenig exzentrische Belastung)
• Spazierengehen
• Leichtes Yoga

**Intensität:**
• Herzfrequenz: 50-60% HFmax
• Unterhaltung problemlos möglich
• Keine Ermüdung, kein Schwitzen
• Fühlt sich leicht an – und sollte es auch sein!

**Wann aktive Erholung:**
• 24-48 Stunden nach intensivem Training
• An "Rest Days"
• Bei Muskelkater (leichte Bewegung kann helfen)

**Wann KEINE aktive Erholung:**
• Bei Verletzungen (Arzt fragen)
• Bei extremer Erschöpfung (dann Ruhe)
• Wenn sie selbst zum Stress wird

**Häufiger Fehler:**
"Aktive Erholung" wird zu intensiv. Dann ist es Training, keine Erholung.`,
      },
      {
        id: 'passive-recovery',
        titleKey: 'guide.articles.recovery.sections.passive.title',
        content: `**Passive Regenerationsmaßnahmen**

Was die Forschung zu beliebten Methoden sagt.

**Schlaf (Goldstandard):**
• Wichtigste Regenerationsmaßnahme überhaupt
• 7-9 Stunden, bei intensivem Training mehr
• Qualität > Quantität
• Nicht durch andere Maßnahmen ersetzbar

**Kälteanwendung:**

**Eisbad/Kryotherapie:**
• Effektiv für akute Entzündungsreduktion
• ABER: Kann Muskelanpassung hemmen!
• Studie (Roberts et al., 2015): Regelmäßige Eisbäder reduzierten Muskelzuwächse
• Einsatz: Wettkampfphasen ja, Aufbauphase nein

**Kalte Dusche:**
• Weniger extrem, kaum Nachteile
• Aktiviert Parasympathikus
• Psychologisch belebend

**Wärmeanwendung:**

**Sauna:**
• Studien zeigen: Verbesserte Erholung
• Erhöht Wachstumshormon kurzfristig
• Fördert Schlafqualität
• 2-3x pro Woche, 15-20 Min

**Warmes Bad:**
• Entspannt Muskulatur
• Vor dem Schlafen: Körpertemperatur sinkt danach = einschlaffördernd
• Mit Magnesiumsalz (Epsom Salt) noch effektiver

**Kompressionskleidung:**
• Moderate Evidenz für schnellere Erholung
• Kann Muskelkater leicht reduzieren
• Während und nach dem Training tragen
• Nicht teuer sein, Hauptsache Kompression`,
      },
      {
        id: 'massage-mobility',
        titleKey: 'guide.articles.recovery.sections.massage.title',
        content: `**Massage, Foam Rolling & Mobility**

Hands-on Methoden für bessere Erholung.

**Sportmassage:**
• Senkt Cortisol, erhöht Serotonin und Dopamin
• Verbessert Durchblutung
• Löst Verspannungen
• Psychologisch entspannend
• Evidenz: Moderat positiv für Erholung

**Foam Rolling (Selbstmassage):**

**Was die Forschung sagt:**
• Kann Muskelkater leicht reduzieren (ca. 1 Punkt auf 10er-Skala)
• Verbessert kurzfristig Beweglichkeit
• Keine negativen Effekte auf Kraft
• Ideal vor dem Training oder abends

**Anwendung:**
• 30-60 Sekunden pro Muskelgruppe
• Langsam und kontrolliert
• Nicht direkt auf Knochen oder Gelenke
• Bei Schmerz: Druck reduzieren

**Mobility-Arbeit:**

**Dehnen:**
• Statisch nach dem Training oder abends
• Dynamisch vor dem Training
• Erhält Beweglichkeit, verbessert sie kaum
• 30-60 Sekunden pro Position

**Mobility-Flows:**
• Aktive Bewegung durch Bewegungsumfang
• Vor dem Training ideal
• Hält Gelenke gesund
• 5-10 Minuten reichen

**Percussion-Massage (Massage Gun):**
• Vibration + Druck
• Studien zeigen: Ähnlich effektiv wie Foam Rolling
• Praktischer für bestimmte Bereiche
• Nicht übermaßig anwenden (2 Min pro Bereich)`,
      },
      {
        id: 'programming',
        titleKey: 'guide.articles.recovery.sections.programming.title',
        content: `**Regeneration in die Trainingsplanung integrieren**

Die beste Regenerationsstrategie ist eingebaute Erholung im Trainingsplan.

**Mikrozyklus (Woche):**
• Nicht jeden Tag maximal trainieren
• Leichte und schwere Tage wechseln
• 1-2 echte Ruhetage pro Woche
• Beispiel: Hart - Moderat - Hart - Leicht - Hart - Aktive Erholung - Ruhe

**Mesozyklus (3-6 Wochen):**
• Nach 3-4 Wochen intensiven Trainings: Deload-Woche
• Volumen um 40-60% reduzieren
• Intensität kann bleiben oder auch sinken
• Verhindert Übertraining, ermöglicht Superkompensation

**Makrozyklus (Monate):**
• Periodisierung einbauen
• Phasen mit unterschiedlichen Schwerpunkten
• Nach der Saison: Komplette Erholungsphase (1-2 Wochen)

**Zeichen, dass du mehr Erholung brauchst:**
• Leistung stagniert oder sinkt
• Motivation fehlt
• Schlaf verschlechtert sich
• Erhöhte Morgen-Herzfrequenz
• Appetitlosigkeit oder Heißhunger
• Häufige Infekte

**Das Erholungs-Budget:**
Stell dir vor, du hast jeden Tag 100 Erholungspunkte. Training, Arbeit, Stress – alles zieht ab. Schlaf, Ernährung, Entspannung lädt auf. Gehe nie ins Minus.`,
      },
      {
        id: 'summary',
        titleKey: 'guide.articles.recovery.sections.summary.title',
        content: `**Die Regenerations-Hierarchie:**

**1. Schlaf (nicht ersetzbar)**
• 7-9 Stunden, Qualität zählt
• Der wichtigste Regenerationsfaktor

**2. Ernährung (Grundlage)**
• Protein: 1,6-2,2 g/kg, verteilt über den Tag
• Kohlenhydrate: Je nach Trainingsintensität
• Hydration: 35-40 ml/kg + Trainingsverluste

**3. Trainingsplanung (eingebaute Erholung)**
• Deload alle 3-6 Wochen
• Schwere und leichte Tage wechseln
• Ruhetage einplanen

**4. Aktive Erholung (unterstützend)**
• Leichtes Cardio, Schwimmen, Spazieren
• Nur wenn wirklich leicht!

**5. Passive Maßnahmen (nice to have)**
• Sauna, warmes Bad
• Kälteanwendung: Mit Vorsicht
• Massage, Foam Rolling

**Was du NICHT brauchst:**
• Teure Gadgets
• Stundenlanges Stretching
• Jeden Tag "aktive Erholung"
• Extreme Kältekammern

**Der wichtigste Tipp:**
Höre auf deinen Körper. Müdigkeit, Leistungsabfall und Motivationsverlust sind Warnsignale. Manchmal ist die beste Trainingseinheit gar keine.

Regeneration ist kein Luxus – sie ist die Hälfte des Trainings.`,
      },
    ],
    sources: [
      {
        title: 'Regeneration und Erholung im Sport',
        url: 'https://www.dshs-koeln.de/',
        institution: 'Deutsche Sporthochschule Köln',
      },
      {
        title: 'Post-exercise cold water immersion attenuates acute anabolic signalling',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26174323/',
        institution: 'Roberts et al. (2015) - Journal of Physiology',
      },
      {
        title: 'Sleep and Athletic Performance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28662971/',
        institution: 'Watson (2017) - Current Sports Medicine Reports',
      },
      {
        title: 'Effects of foam rolling on performance and recovery',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29145783/',
        institution: 'Wiewelhove et al. (2019) - Frontiers in Physiology',
      },
      {
        title: 'Dietary Protein and Muscle Mass: Evidence-Based Guidelines',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/',
        institution: 'Morton et al. (2018) - British Journal of Sports Medicine',
      },
      {
        title: 'Sauna bathing and recovery from exercise',
        url: 'https://pubmed.ncbi.nlm.nih.gov/',
        institution: 'Scandinavian Journal of Medicine & Science in Sports',
      },
      {
        title: 'Massage for promoting recovery in athletes',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29755363/',
        institution: 'Davis et al. (2020) - Sports Medicine',
      },
    ],
  },
};

export const getGuideArticle = (articleId: string): IGuideArticle | undefined => {
  return GUIDE_ARTICLES[articleId];
};

export const getGuideArticlesByCategory = (categoryId: string): IGuideArticle[] => {
  return Object.values(GUIDE_ARTICLES).filter((article) => article.categoryId === categoryId);
};
