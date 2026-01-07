import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { useTheme } from '@/contexts';

export const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

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
          personenbezogenen Daten passiert, wenn Sie diese App nutzen. Personenbezogene
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

        <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Allgemeine Hinweise und Pflichtinformationen</Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>Datenschutz</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Die Betreiber dieser App nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
          Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der
          gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>Hinweis zur verantwortlichen Stelle</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Die verantwortliche Stelle für die Datenverarbeitung ist:{'\n\n'}
          FitnessApp GmbH{'\n'}
          Musterstraße 123{'\n'}
          12345 Musterstadt{'\n\n'}
          Telefon: +49 (0) 123 456789{'\n'}
          E-Mail: datenschutz@fitnessapp-example.de
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Datenerfassung in dieser App</Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>Welche Daten werden erfasst?</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          • Kontodaten (E-Mail-Adresse, Name){'\n'}
          • Trainingsdaten (Übungen, Gewichte, Wiederholungen){'\n'}
          • Körperdaten (Gewicht, sofern eingegeben){'\n'}
          • Geräteinformationen (Gerätetyp, Betriebssystem){'\n'}
          • Nutzungsstatistiken (anonymisiert)
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>Wofür nutzen wir Ihre Daten?</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          • Bereitstellung der App-Funktionen{'\n'}
          • Synchronisierung Ihrer Trainingsdaten{'\n'}
          • Verbesserung unserer Services{'\n'}
          • Personalisierte Trainingsempfehlungen (optional){'\n'}
          • Anzeige von Werbung (kann deaktiviert werden)
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Ihre Rechte</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Sie haben jederzeit das Recht:{'\n\n'}
          • <Text style={styles.bold}>Auskunft</Text> über Ihre gespeicherten Daten zu erhalten{'\n'}
          • <Text style={styles.bold}>Berichtigung</Text> unrichtiger Daten zu verlangen{'\n'}
          • <Text style={styles.bold}>Löschung</Text> Ihrer Daten zu verlangen{'\n'}
          • <Text style={styles.bold}>Einschränkung</Text> der Verarbeitung zu verlangen{'\n'}
          • <Text style={styles.bold}>Widerspruch</Text> gegen die Verarbeitung einzulegen{'\n'}
          • <Text style={styles.bold}>Datenübertragbarkeit</Text> zu verlangen
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Werbung und Tracking</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Diese App zeigt Werbung an, um kostenlos zu bleiben. Für personalisierte Werbung
          werden anonymisierte Nutzungsdaten verwendet.{'\n\n'}
          Sie können die Verwendung Ihrer Daten für personalisierte Werbung jederzeit in
          den App-Einstellungen oder in den Systemeinstellungen Ihres Geräts deaktivieren.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Datensicherheit</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Wir nutzen innerhalb der App SSL- bzw. TLS-Verschlüsselung. Ihre Daten werden
          verschlüsselt übertragen und auf sicheren Servern gespeichert.{'\n\n'}
          Trotz regelmäßiger Kontrollen ist ein vollständiger Schutz vor allen Gefahren
          nicht möglich.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Drittanbieter</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Wir nutzen folgende Drittanbieter-Dienste:{'\n\n'}
          • <Text style={styles.bold}>Firebase (Google)</Text> - Authentifizierung und Datenspeicherung{'\n'}
          • <Text style={styles.bold}>OpenAI</Text> - KI-Funktionen (nur wenn aktiviert){'\n'}
          • <Text style={styles.bold}>Werbepartner</Text> - Anzeige von Werbung
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>8. Änderungen</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen.
          Die aktuelle Version finden Sie stets in der App.
        </Text>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Stand: Januar 2025
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
