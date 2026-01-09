// /workspaces/claude-workspace/fitnessapp/src/screens/legal/TermsOfServiceScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { useTheme } from '@/contexts';

export const TermsOfServiceScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>AGB</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.mainTitle, { color: colors.text }]}>Allgemeine Geschäftsbedingungen</Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 1 Geltungsbereich</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der
          FrameFit App (nachfolgend "App" genannt), die von der KAIA by Kantarevic & Bastong GbR
          (nachfolgend "Anbieter" genannt) bereitgestellt wird.{'\n\n'}
          (2) Mit der Registrierung und Nutzung der App akzeptieren Sie diese AGB.{'\n\n'}
          (3) Abweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn,
          der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 2 Leistungsbeschreibung</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          (1) Die App ermöglicht das Tracking von Fitnessaktivitäten, darunter:{'\n\n'}
          <Text style={styles.bold}>Krafttraining (Gym)</Text>{'\n'}
          • Workout-Protokollierung mit Übungen, Gewichten, Sätzen und Wiederholungen{'\n'}
          • Fortschrittsverfolgung und Statistiken{'\n'}
          • Erstellung individueller Trainingspläne{'\n'}
          • KI-gestützte Trainingsempfehlungen (optional){'\n\n'}
          <Text style={styles.bold}>Yoga</Text>{'\n'}
          • Geführte Yoga-Sessions über YouTube-Videos{'\n'}
          • Verschiedene Schwierigkeitsstufen und Stile{'\n\n'}
          <Text style={styles.bold}>Laufen (Running)</Text>{'\n'}
          • GPS-Tracking für Laufstrecken{'\n'}
          • Distanz-, Zeit- und Pace-Erfassung{'\n\n'}
          <Text style={styles.bold}>Calisthenics</Text>{'\n'}
          • Bodyweight-Training mit Video-Anleitungen{'\n'}
          • Progressive Übungsprogramme{'\n\n'}
          <Text style={styles.bold}>Weitere Funktionen</Text>{'\n'}
          • Integration mit Apple Health / Health Connect{'\n'}
          • Cloud-Backup über iCloud oder Google Drive{'\n'}
          • Wochenziele und Streak-Tracking{'\n'}
          • Datenexport und -import{'\n\n'}
          (2) Die Nutzung der Grundfunktionen ist kostenlos. Die App finanziert sich
          durch Werbung. Premium-Funktionen können zukünftig kostenpflichtig angeboten werden.{'\n\n'}
          (3) Der Anbieter behält sich vor, den Funktionsumfang jederzeit zu ändern,
          zu erweitern oder einzuschränken.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 3 Registrierung und Nutzerkonto</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          (1) Für die vollständige Nutzung der App ist eine Registrierung erforderlich.
          Die Registrierung ist möglich über:{'\n'}
          • E-Mail und Passwort{'\n'}
          • Google-Konto{'\n'}
          • Apple-ID (nur iOS){'\n'}
          • Facebook-Konto{'\n\n'}
          (2) Der Nutzer ist verpflichtet, bei der Registrierung wahrheitsgemäße
          Angaben zu machen und diese aktuell zu halten.{'\n\n'}
          (3) Das Nutzerkonto ist nicht übertragbar. Die Zugangsdaten sind
          vertraulich zu behandeln.{'\n\n'}
          (4) Bei Verdacht auf Missbrauch ist der Anbieter berechtigt, das
          Nutzerkonto vorübergehend zu sperren.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 4 Nutzungsbedingungen</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          (1) Die App darf nur für private, nicht-kommerzielle Zwecke genutzt werden.{'\n\n'}
          (2) Dem Nutzer ist es untersagt:{'\n'}
          • Die App für rechtswidrige Zwecke zu nutzen{'\n'}
          • Inhalte zu verbreiten, die gegen geltendes Recht verstoßen{'\n'}
          • Die technische Infrastruktur zu stören oder zu manipulieren{'\n'}
          • Daten anderer Nutzer unbefugt zu sammeln{'\n'}
          • Die KI-Funktionen für unzulässige Zwecke zu missbrauchen{'\n\n'}
          (3) Bei Verstoß gegen diese Bedingungen kann das Nutzerkonto
          gesperrt oder gelöscht werden.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 5 Externe Inhalte und Links</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          (1) Die App enthält Links zu externen Inhalten, insbesondere:{'\n'}
          • YouTube-Videos für Yoga- und Calisthenics-Sessions{'\n'}
          • Affiliate-Links zu Partnern (z.B. ESN){'\n\n'}
          (2) Für externe Inhalte ist der jeweilige Anbieter verantwortlich.
          Der Anbieter der App übernimmt keine Haftung für externe Inhalte.{'\n\n'}
          (3) Vor dem Öffnen externer Links wird der Nutzer informiert und
          muss die Weiterleitung bestätigen.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 6 Geistiges Eigentum</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          (1) Alle Rechte an der App, einschließlich Design, Logos, Texte und
          Software, gehören dem Anbieter oder dessen Lizenzgebern.{'\n\n'}
          (2) Die Nutzung der App gewährt dem Nutzer keine Rechte am geistigen
          Eigentum des Anbieters.{'\n\n'}
          (3) Nutzerinhalte (z.B. Trainingsdaten, Profilbilder) bleiben im Eigentum des Nutzers.
          Der Nutzer räumt dem Anbieter jedoch die erforderlichen Nutzungsrechte
          zur Erbringung der Leistungen ein.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 7 Haftungsbeschränkung</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          (1) Die App dient ausschließlich Informations- und Dokumentationszwecken.
          Sie ersetzt keine ärztliche Beratung, medizinische Diagnose oder
          professionelle Trainingsbetreuung.{'\n\n'}
          (2) Der Anbieter haftet nicht für:{'\n'}
          • Gesundheitliche Schäden durch unsachgemäßes Training{'\n'}
          • Verletzungen bei der Ausführung von Übungen{'\n'}
          • Datenverlust durch technische Störungen{'\n'}
          • Schäden durch Nutzung der KI-Empfehlungen{'\n'}
          • Ausfälle oder Einschränkungen der Verfügbarkeit{'\n'}
          • Inhalte externer Anbieter (YouTube, Affiliate-Partner){'\n\n'}
          (3) Der Nutzer trainiert auf eigene Verantwortung und sollte bei
          gesundheitlichen Bedenken einen Arzt konsultieren.{'\n\n'}
          (4) Die Haftung für Vorsatz und grobe Fahrlässigkeit bleibt unberührt.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 8 Datenschutz</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß
          unserer Datenschutzerklärung, die Teil dieser AGB ist und in der App
          unter "Mehr → Datenschutz" eingesehen werden kann.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 9 Kündigung und Kontolöschung</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          (1) Der Nutzer kann sein Konto jederzeit in den App-Einstellungen
          unter "Konto löschen" vollständig und unwiderruflich entfernen.{'\n\n'}
          (2) Bei Kontolöschung werden alle gespeicherten Daten gelöscht.
          Eine vorherige Datensicherung wird empfohlen.{'\n\n'}
          (3) Der Anbieter kann das Nutzungsverhältnis mit einer Frist von 14 Tagen
          kündigen.{'\n\n'}
          (4) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt
          unberührt.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 10 Änderungen der AGB</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          (1) Der Anbieter behält sich vor, diese AGB mit angemessener Frist zu ändern.{'\n\n'}
          (2) Änderungen werden dem Nutzer in der App mitgeteilt. Bei Widerspruch
          innerhalb von 30 Tagen kann das Nutzungsverhältnis gekündigt werden.{'\n\n'}
          (3) Die Weiternutzung der App nach Ablauf der Widerspruchsfrist gilt als
          Zustimmung zu den geänderten AGB.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>§ 11 Schlussbestimmungen</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          (1) Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.{'\n\n'}
          (2) Gerichtsstand für alle Streitigkeiten ist Neuss,
          sofern der Nutzer Kaufmann ist oder keinen allgemeinen Gerichtsstand
          in Deutschland hat.{'\n\n'}
          (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die
          Wirksamkeit der übrigen Bestimmungen unberührt.
        </Text>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Stand: 09. Januar 2026
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    width: 80,
  },
  backText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  mainTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  paragraph: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[700],
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  footer: {
    marginTop: SPACING['3xl'],
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
});
