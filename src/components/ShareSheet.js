import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';

const SOCIAL = [
  { id: 'whatsapp',  label: 'WhatsApp',  icon: 'whatsapp',   color: '#25D366' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram',  color: '#E1306C' },
  { id: 'facebook',  label: 'Facebook',  icon: 'facebook',   color: '#1877F2' },
  { id: 'twitter',   label: 'X',         icon: 'twitter',    color: '#1DA1F2' },
  { id: 'telegram',  label: 'Telegram',  icon: 'send',       color: '#229ED9' },
  { id: 'system',    label: 'More',      icon: 'share-variant', color: null },
];

export default function ShareSheet({
  visible,
  onClose,
  onShare,
  onDownload,
  onCopy,
  loading,
  colors,
}) {
  const insets = useSafeAreaInsets();

  const handleSocial = useCallback(
    id => {
      onShare(id);
    },
    [onShare],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { backgroundColor: colors.scrim }]} />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            paddingBottom: insets.bottom + 8,
            borderTopColor: colors.outline,
          },
        ]}>
        {/* Handle */}
        <View
          style={[styles.handle, { backgroundColor: colors.onSurfaceVariant }]}
        />

        <Text style={[styles.sheetTitle, { color: colors.onSurface }]}>
          Share Quote
        </Text>

        {/* Social row */}
        <View style={styles.socialRow}>
          {SOCIAL.map(s => (
            <TouchableOpacity
              key={s.id}
              style={styles.socialItem}
              onPress={() => handleSocial(s.id)}
              disabled={loading}>
              <View
                style={[
                  styles.socialCircle,
                  {
                    backgroundColor: s.color
                      ? s.color + '22'
                      : colors.primaryContainer,
                    borderColor: s.color
                      ? s.color + '55'
                      : colors.outline,
                  },
                ]}>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={s.color || colors.primary}
                  />
                ) : (
                  <Icon
                    name={s.icon}
                    size={26}
                    color={s.color || colors.primary}
                  />
                )}
              </View>
              <Text style={[styles.socialLabel, { color: colors.onSurfaceVariant }]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        {/* Utility row */}
        <View style={styles.utilRow}>
          <TouchableOpacity
            style={[
              styles.utilBtn,
              { backgroundColor: colors.surfaceVariant, borderColor: colors.outline },
            ]}
            onPress={onDownload}
            disabled={loading}>
            <Icon name="download" size={20} color={colors.primary} />
            <Text style={[styles.utilTxt, { color: colors.onSurface }]}>
              Save to Gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.utilBtn,
              { backgroundColor: colors.surfaceVariant, borderColor: colors.outline },
            ]}
            onPress={onCopy}
            disabled={loading}>
            <Icon name="content-copy" size={20} color={colors.primary} />
            <Text style={[styles.utilTxt, { color: colors.onSurface }]}>
              Copy Text
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.cancelBtn, { borderColor: colors.outline }]}
          onPress={onClose}>
          <Text style={[styles.cancelTxt, { color: colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    opacity: 0.4,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.15,
    marginBottom: 20,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  socialItem: {
    alignItems: 'center',
    width: 52,
  },
  socialCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    marginBottom: 14,
  },
  utilRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  utilBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  utilTxt: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancelBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 4,
  },
  cancelTxt: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.15,
  },
});
