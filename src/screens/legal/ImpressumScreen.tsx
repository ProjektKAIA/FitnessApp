import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { useTheme } from '@/contexts';

export const ImpressumScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Impressum</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Angaben gemäß § 5 TMG</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          FitnessApp GmbH{'\n'}
          Musterstraße 123{'\n'}
          12345 Musterstadt{'\n'}
          Deutschland
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Vertreten durch</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Geschäftsführer: Max Mustermann
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Kontakt</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Telefon: +49 (0) 123 456789{'\n'}
          E-Mail: info@fitnessapp-example.de{'\n'}
          Website: www.fitnessapp-example.de
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Registereintrag</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Eintragung im Handelsregister{'\n'}
          Registergericht: Amtsgericht Musterstadt{'\n'}
          Registernummer: HRB 12345
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Umsatzsteuer-ID</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:{'\n'}
          DE123456789
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Max Mustermann{'\n'}
          Musterstraße 123{'\n'}
          12345 Musterstadt
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Streitschlichtung</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
          bereit: https://ec.europa.eu/consumers/odr/{'\n\n'}
          Unsere E-Mail-Adresse finden Sie oben im Impressum.{'\n\n'}
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Haftung für Inhalte</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen
          Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind
          wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte
          fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen.{'\n\n'}
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach
          den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung
          ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
          möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
          Inhalte umgehend entfernen.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Haftung für Links</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir
          keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
          Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
          Anbieter oder Betreiber der Seiten verantwortlich.{'\n\n'}
          Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
          überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.{'\n\n'}
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
          Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
          Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Urheberrecht</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
          Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
          bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.{'\n\n'}
          Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
          Gebrauch gestattet.{'\n\n'}
          Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden
          die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
          gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam
          werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
          Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
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
