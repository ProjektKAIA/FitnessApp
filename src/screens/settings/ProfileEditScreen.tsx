import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useUserStore, useStatsStore } from '@/stores';
import { useTheme } from '@/contexts';

export const ProfileEditScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const settings = user?.settings;

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [birthday, setBirthday] = useState<Date | undefined>(
    user?.birthday ? new Date(user.birthday) : undefined
  );
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const weeklyGoal = useStatsStore((state) => state.weeklyGoal);
  const setWeeklyGoal = useStatsStore((state) => state.setWeeklyGoal);
  const [selectedGoal, setSelectedGoal] = useState(weeklyGoal || 5);

  // Default to metric (Europe) if settings are undefined
  const isMetric = settings?.units !== 'imperial'; // metric ist default

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        t('profile.permissionRequired'),
        t('profile.permissionMessage')
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUrl(result.assets[0].uri);
    }
  }, [t]);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        t('profile.permissionRequired'),
        t('profile.cameraPermissionMessage')
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUrl(result.assets[0].uri);
    }
  }, [t]);

  const showImageOptions = useCallback(() => {
    Alert.alert(
      t('profile.changePhoto'),
      t('profile.chooseOption'),
      [
        { text: t('profile.takePhoto'), onPress: takePhoto },
        { text: t('profile.chooseFromLibrary'), onPress: pickImage },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  }, [t, takePhoto, pickImage]);

  const handleDateChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  }, []);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('profile.nameRequired'));
      return;
    }

    setIsSaving(true);

    try {
      const weightValue = weight ? parseFloat(weight) : undefined;
      const heightValue = height ? parseFloat(height) : undefined;

      updateProfile({
        name: name.trim(),
        avatarUrl: avatarUrl || undefined,
        birthday: birthday?.toISOString(),
        weight: weightValue,
        height: heightValue,
      });

      setWeeklyGoal(selectedGoal);

      navigation.goBack();
    } catch (error) {
      Alert.alert(t('common.error'), t('profile.saveError'));
    } finally {
      setIsSaving(false);
    }
  }, [name, avatarUrl, birthday, weight, height, updateProfile, navigation, t]);

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backText, { color: colors.primary }]}>← {t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{t('profile.editTitle')}</Text>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={[styles.saveText, { color: colors.primary }]}>
              {isSaving ? t('common.loading') : t('common.save')}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={showImageOptions}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {name?.charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraIconText}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={[styles.changePhotoText, { color: colors.textSecondary }]}>{t('profile.tapToChange')}</Text>
          </View>

          <Card style={styles.formCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.personalInfo')}</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('profile.name')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
                placeholder={t('profile.namePlaceholder')}
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('profile.birthday')}</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={birthday ? styles.dateText : styles.datePlaceholder}>
                  {birthday ? formatDate(birthday) : t('profile.birthdayPlaceholder')}
                </Text>
                {birthday && (
                  <Text style={styles.ageText}>
                    ({calculateAge(birthday)} {t('profile.years')})
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={birthday || new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.datePickerDone}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.datePickerDoneText}>{t('common.done')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Card>

          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>{t('profile.bodyStats')}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('profile.weight')} ({isMetric ? 'kg' : 'lb'})
              </Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder={isMetric ? '70' : '154'}
                placeholderTextColor={COLORS.gray[400]}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('profile.height')} ({isMetric ? 'cm' : 'in'})
              </Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder={isMetric ? '175' : '69'}
                placeholderTextColor={COLORS.gray[400]}
                keyboardType="decimal-pad"
              />
            </View>

            {weight && height && (
              <View style={styles.bmiContainer}>
                <Text style={styles.bmiLabel}>{t('profile.bmi')}</Text>
                <Text style={styles.bmiValue}>
                  {calculateBMI(parseFloat(weight), parseFloat(height), isMetric)}
                </Text>
              </View>
            )}
          </Card>

          <Card style={styles.formCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.trainingGoals')}</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('profile.weeklyGoal')}</Text>
              <View style={styles.goalSelector}>
                {[1, 2, 3, 4, 5, 6, 7].map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.goalButton,
                      { backgroundColor: colors.background, borderColor: colors.border },
                      selectedGoal === goal && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                    onPress={() => setSelectedGoal(goal)}
                  >
                    <Text
                      style={[
                        styles.goalButtonText,
                        { color: colors.text },
                        selectedGoal === goal && { color: COLORS.white },
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.goalHint, { color: colors.textSecondary }]}>{t('profile.weeklyGoalHint')}</Text>
            </View>
          </Card>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const calculateBMI = (weight: number, height: number, isMetric: boolean): string => {
  if (!weight || !height || height === 0) return '-';

  let bmi: number;
  if (isMetric) {
    const heightInMeters = height / 100;
    bmi = weight / (heightInMeters * heightInMeters);
  } else {
    bmi = (weight * 703) / (height * height);
  }

  return bmi.toFixed(1);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.md,
  },
  backText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  saveButton: {
    paddingVertical: SPACING.sm,
    paddingLeft: SPACING.md,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.white,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraIconText: {
    fontSize: 18,
  },
  changePhotoText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  formCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  input: {
    height: 48,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  dateInput: {
    height: 48,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  dateText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
  },
  datePlaceholder: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[400],
  },
  ageText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  datePickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  datePickerDone: {
    alignItems: 'flex-end',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  datePickerDoneText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
  bmiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  bmiLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  bmiValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  bottomPadding: {
    height: SPACING['3xl'],
  },
  goalSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  goalButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  goalButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  goalHint: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
});
