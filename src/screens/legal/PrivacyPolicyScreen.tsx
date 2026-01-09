// /workspaces/claude-workspace/fitnessapp/src/screens/legal/PrivacyPolicyScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { useTheme } from '@/contexts';

export const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@kaiashapes.de');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Datenschutz</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.mainTitle, { color: colors.text }]}>Datenschutzerklärung</Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Datenschutz auf einen Blick</Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>Allgemeine Hinweise</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie die FrameFit App nutzen. Personenbezogene
          Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>Datenerfassung in dieser App</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          <Text style={styles.bold}>Wer ist verantwortlich für die Datenerfassung?</Text>{'\n'}
          Die Datenverarbeitung erfolgt durch den App-Betreiber. Dessen Kontaktdaten können
          Sie dem Impressum entnehmen.{'\n\n'}
          <Text style={styles.bold}>Wie erfassen wir Ihre Daten?</Text>{'\n'}
          Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei
          kann es sich z.B. um Daten handeln, die Sie bei der Registrierung eingeben.{'\n\n'}
          Andere Daten werden automatisch beim Nutzen der App durch unsere IT-Systeme erfasst.
          Das sind vor allem technische Daten (z.B. Gerätetyp, Betriebssystem). Die Erfassung
          dieser Daten erfolgt automatisch, sobald Sie die App nutzen.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Verantwortliche Stelle</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Die verantwortliche Stelle für die Datenverarbeitung ist:{'\n\n'}
          KAIA by Kantarevic & Bastong GbR{'\n'}
          Effertzfeld 10{'\n'}
          41564 Kaarst{'\n'}
          Deutschland{'\n\n'}
          Telefon: +49 176 66816778{'\n'}
        </Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={[styles.link, { color: colors.primary }]}>
            E-Mail: info@kaiashapes.de
          </Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Datenerfassung in dieser App</Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>Welche Daten werden erfasst?</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          • <Text style={styles.bold}>Kontodaten:</Text> E-Mail-Adresse, Name, Profilbild (optional){'\n'}
          • <Text style={styles.bold}>Profildaten:</Text> Geburtsdatum, Gewicht, Größe (optional){'\n'}
          • <Text style={styles.bold}>Trainingsdaten:</Text> Workouts, Übungen, Gewichte, Wiederholungen, Sätze{'\n'}
          • <Text style={styles.bold}>Gesundheitsdaten:</Text> Daten aus Apple Health / Health Connect (nur mit Ihrer Zustimmung){'\n'}
          • <Text style={styles.bold}>Geräteinformationen:</Text> Gerätetyp, Betriebssystem, App-Version{'\n'}
          • <Text style={styles.bold}>Nutzungsstatistiken:</Text> App-Nutzung (anonymisiert)
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>Wofür nutzen wir Ihre Daten?</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          • Bereitstellung der App-Funktionen (Workout-Tracking, Fortschrittsverfolgung){'\n'}
          • Synchronisierung Ihrer Trainingsdaten über Cloud-Backup (iCloud/Google Drive){'\n'}
          • Personalisierte Trainingsempfehlungen durch KI-Coach (optional){'\n'}
          • Integration mit Yoga-, Lauf- und Calisthenics-Funktionen{'\n'}
          • Verbesserung unserer Services{'\n'}
          • Anzeige von Werbung (kann in den Geräteeinstellungen eingeschränkt werden)
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Gesundheitsdaten</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Die App kann mit Apple Health (iOS) bzw. Health Connect (Android) verbunden werden.
          Dies geschieht nur mit Ihrer ausdrücklichen Zustimmung.{'\n\n'}
          <Text style={styles.bold}>Welche Gesundheitsdaten werden verarbeitet?</Text>{'\n'}
          • Schritte und zurückgelegte Distanz{'\n'}
          • Verbrannte Kalorien{'\n'}
          • Herzfrequenz und Ruheherzfrequenz{'\n'}
          • Workout-Daten{'\n\n'}
          Diese Daten werden lokal auf Ihrem Gerät gespeichert und nur bei aktiviertem
          Cloud-Backup synchronisiert. Sie können die Verbindung jederzeit in den
          App-Einstellungen trennen.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Cloud-Synchronisation</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Die App bietet die Möglichkeit, Ihre Daten in der Cloud zu sichern:{'\n\n'}
          • <Text style={styles.bold}>iOS:</Text> iCloud Drive{'\n'}
          • <Text style={styles.bold}>Android:</Text> Google Drive{'\n\n'}
          Die Cloud-Synchronisation ist optional und kann jederzeit in den Einstellungen
          aktiviert oder deaktiviert werden. Ihre Daten werden verschlüsselt übertragen.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>6. KI-Funktionen</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Die App bietet optionale KI-gestützte Funktionen (z.B. KI-Coach, Trainingsplan-Import).
          Bei Nutzung dieser Funktionen werden relevante Daten an den Dienst OpenAI übermittelt.{'\n\n'}
          Die Nutzung der KI-Funktionen ist freiwillig. Sie können einen eigenen OpenAI API-Key
          in den Einstellungen hinterlegen.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Ihre Rechte</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Sie haben jederzeit das Recht:{'\n\n'}
          • <Text style={styles.bold}>Auskunft</Text> über Ihre gespeicherten Daten zu erhalten{'\n'}
          • <Text style={styles.bold}>Berichtigung</Text> unrichtiger Daten zu verlangen{'\n'}
          • <Text style={styles.bold}>Löschung</Text> Ihrer Daten zu verlangen{'\n'}
          • <Text style={styles.bold}>Einschränkung</Text> der Verarbeitung zu verlangen{'\n'}
          • <Text style={styles.bold}>Widerspruch</Text> gegen die Verarbeitung einzulegen{'\n'}
          • <Text style={styles.bold}>Datenübertragbarkeit</Text> zu verlangen{'\n\n'}
          Sie können Ihr Konto und alle zugehörigen Daten jederzeit in den App-Einstellungen
          unter "Konto löschen" vollständig entfernen.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>8. Werbung und Tracking</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Diese App zeigt Werbung an, um kostenlos zu bleiben. Wir nutzen das App Tracking
          Transparency Framework von Apple, um Ihre Zustimmung für personalisierte Werbung
          einzuholen.{'\n\n'}
          Sie können die Verwendung Ihrer Daten für personalisierte Werbung jederzeit
          ablehnen oder in den Systemeinstellungen Ihres Geräts ändern.{'\n\n'}
          <Text style={styles.bold}>Affiliate-Links:</Text> Die App enthält Affiliate-Links zu
          Partnern. Bei Klick auf diese Links werden Sie auf externe Websites weitergeleitet.
          Sie werden vor der Weiterleitung informiert.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>9. Datensicherheit</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Wir nutzen innerhalb der App SSL- bzw. TLS-Verschlüsselung. Ihre Daten werden
          verschlüsselt übertragen und auf sicheren Servern gespeichert.{'\n\n'}
          Lokale Daten werden auf Ihrem Gerät in verschlüsseltem Speicher (AsyncStorage)
          abgelegt. Bei aktiviertem Cloud-Backup werden die Daten zusätzlich in Ihrem
          persönlichen Cloud-Speicher gesichert.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>10. Drittanbieter</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Wir nutzen folgende Drittanbieter-Dienste:{'\n\n'}
          • <Text style={styles.bold}>Firebase (Google)</Text> - Authentifizierung und Datenspeicherung{'\n'}
          • <Text style={styles.bold}>Apple Health / Health Connect</Text> - Gesundheitsdaten (optional){'\n'}
          • <Text style={styles.bold}>iCloud / Google Drive</Text> - Cloud-Backup (optional){'\n'}
          • <Text style={styles.bold}>OpenAI</Text> - KI-Funktionen (optional){'\n'}
          • <Text style={styles.bold}>YouTube</Text> - Eingebettete Trainingsvideos (Yoga, Calisthenics){'\n'}
          • <Text style={styles.bold}>ESN und weitere Partner</Text> - Affiliate-Werbung
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>11. Änderungen</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie
          an geänderte rechtliche Rahmenbedingungen oder Änderungen der App anzupassen.
          Die aktuelle Version finden Sie stets in der App.
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
  subTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[800],
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
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
  link: {
    fontSize: FONT_SIZES.base,
    lineHeight: 22,
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
