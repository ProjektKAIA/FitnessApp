// /workspaces/claude-workspace/fitnessapp/src/components/common/Modal.tsx

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<Props> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  const { colors } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View style={[styles.content, { backgroundColor: colors.surface }]}>
                {(title || showCloseButton) && (
                  <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    {showCloseButton && (
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                      >
                        <Text style={[styles.closeText, { color: colors.textTertiary }]}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <View style={styles.body}>{children}</View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  content: {
    borderRadius: BORDER_RADIUS.xl,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  closeButton: {
    padding: SPACING.xs,
  },
  closeText: {
    fontSize: FONT_SIZES.lg,
  },
  body: {
    padding: SPACING.lg,
  },
});
