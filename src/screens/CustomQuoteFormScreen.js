import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

const CATEGORIES = [
  'Personal',
  'Success',
  'Discipline',
  'Life',
  'Mindset',
  'Growth',
  'Focus',
  'Resilience',
  'Leadership',
];

const CATEGORY_ICONS = {
  Personal:   'account-heart-outline',
  Success:    'trophy-outline',
  Discipline: 'sword',
  Life:       'leaf-circle-outline',
  Mindset:    'brain',
  Growth:     'sprout-outline',
  Focus:      'bullseye-arrow',
  Resilience: 'shield-star-outline',
  Leadership: 'account-group-outline',
};

const CHAR_LIMIT = 500;

export default function CustomQuoteFormScreen() {
  const { colors, addCustomQuote, updateCustomQuote } = useApp();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const editingQuote = route.params?.quote || null;
  const isEditing = Boolean(editingQuote);

  const [text, setText] = useState(editingQuote?.text || '');
  const [author, setAuthor] = useState(editingQuote?.author || '');
  const [category, setCategory] = useState(editingQuote?.category || 'Personal');

  function handleSave() {
    if (!text.trim()) {
      Alert.alert('Missing Quote', 'Please enter your quote text before saving.');
      return;
    }
    if (text.trim().length < 5) {
      Alert.alert('Too Short', 'Your quote is too short. Write something meaningful!');
      return;
    }

    if (isEditing) {
      updateCustomQuote(editingQuote.id, { text, author, category });
    } else {
      addCustomQuote({ text, author, category });
    }
    navigation.goBack();
  }

  function handleDiscard() {
    const hasChanges =
      text !== (editingQuote?.text || '') ||
      author !== (editingQuote?.author || '') ||
      category !== (editingQuote?.category || 'Personal');

    if (!hasChanges) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Discard Changes',
      'You have unsaved changes. Are you sure you want to go back?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ],
    );
  }

  const charCount = text.length;
  const isNearLimit = charCount > CHAR_LIMIT * 0.85;
  const isOverLimit = charCount > CHAR_LIMIT;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── preview card ── */}
        <LinearGradient
          colors={['#2D2A6E', '#1A1846']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.previewCard}>
          <View style={styles.previewBadge}>
            <Icon name={CATEGORY_ICONS[category] || 'format-quote-open'} size={12} color="#A09CFF" />
            <Text style={styles.previewBadgeTxt}>{category}</Text>
          </View>
          <Text style={styles.previewText} numberOfLines={6}>
            {text.trim() ? `"${text.trim()}"` : 'Your quote will appear here…'}
          </Text>
          {author.trim() ? (
            <View style={styles.previewAuthorRow}>
              <View style={styles.previewAuthorLine} />
              <Text style={styles.previewAuthor}>{author.trim()}</Text>
            </View>
          ) : null}
          <Text style={styles.previewWatermark}>Daily Motivation</Text>
        </LinearGradient>

        {/* ── quote text field ── */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Icon name="format-quote-open" size={16} color={colors.primary} />
            <Text style={[styles.label, { color: colors.onSurface }]}>Quote Text</Text>
            <Text style={[styles.required, { color: colors.error }]}>*</Text>
          </View>
          <View
            style={[
              styles.textAreaWrap,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: isOverLimit ? colors.error : colors.outline,
              },
            ]}>
            <TextInput
              style={[styles.textArea, { color: colors.onSurface }]}
              placeholder="Write something inspiring…"
              placeholderTextColor={colors.onSurfaceVariant}
              multiline
              value={text}
              onChangeText={setText}
              maxLength={CHAR_LIMIT + 20}
              textAlignVertical="top"
            />
            <Text
              style={[
                styles.charCount,
                {
                  color: isOverLimit
                    ? colors.error
                    : isNearLimit
                    ? colors.secondary
                    : colors.onSurfaceVariant,
                },
              ]}>
              {charCount}/{CHAR_LIMIT}
            </Text>
          </View>
        </View>

        {/* ── author field ── */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Icon name="account-outline" size={16} color={colors.primary} />
            <Text style={[styles.label, { color: colors.onSurface }]}>Author</Text>
            <Text style={[styles.optional, { color: colors.onSurfaceVariant }]}>(optional)</Text>
          </View>
          <TextInput
            style={[
              styles.inputField,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.outline,
                color: colors.onSurface,
              },
            ]}
            placeholder="e.g. Your Name or Anonymous"
            placeholderTextColor={colors.onSurfaceVariant}
            value={author}
            onChangeText={setAuthor}
            maxLength={80}
            returnKeyType="done"
          />
        </View>

        {/* ── category picker ── */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Icon name="tag-outline" size={16} color={colors.primary} />
            <Text style={[styles.label, { color: colors.onSurface }]}>Category</Text>
          </View>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => {
              const active = cat === category;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    active
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { backgroundColor: colors.surfaceVariant, borderColor: colors.outline },
                  ]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.75}>
                  <Icon
                    name={CATEGORY_ICONS[cat] || 'tag-outline'}
                    size={13}
                    color={active ? colors.onPrimary : colors.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.catChipTxt,
                      { color: active ? colors.onPrimary : colors.onSurface },
                    ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── action buttons ── */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: colors.outline, backgroundColor: colors.surfaceVariant }]}
            onPress={handleDiscard}
            activeOpacity={0.75}>
            <Icon name="close" size={16} color={colors.onSurfaceVariant} />
            <Text style={[styles.cancelBtnTxt, { color: colors.onSurfaceVariant }]}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: isOverLimit ? colors.error : colors.primary },
            ]}
            onPress={handleSave}
            disabled={isOverLimit}
            activeOpacity={0.8}>
            <Icon name={isEditing ? 'content-save-outline' : 'check'} size={16} color={colors.onPrimary} />
            <Text style={[styles.saveBtnTxt, { color: colors.onPrimary }]}>
              {isEditing ? 'Save Changes' : 'Save Quote'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 20,
  },

  previewCard: {
    borderRadius: 20,
    padding: 22,
    gap: 12,
    minHeight: 160,
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#A09CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(160,156,255,0.20)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  previewBadgeTxt: {
    color: '#A09CFF',
    fontSize: 11,
    fontWeight: '700',
  },
  previewText: {
    color: '#ECE7FF',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  previewAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewAuthorLine: {
    width: 28,
    height: 2,
    backgroundColor: '#A09CFF',
    borderRadius: 1,
  },
  previewAuthor: {
    color: '#C9C3DC',
    fontSize: 13,
    fontWeight: '600',
  },
  previewWatermark: {
    color: 'rgba(160,156,255,0.35)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  section: { gap: 8 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  required: {
    fontSize: 14,
    fontWeight: '700',
  },
  optional: {
    fontSize: 12,
    fontWeight: '400',
  },

  textAreaWrap: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    minHeight: 130,
  },
  textArea: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
    minHeight: 100,
  },
  charCount: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 6,
  },

  inputField: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  catChipTxt: {
    fontSize: 13,
    fontWeight: '600',
  },

  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
  },
  cancelBtnTxt: {
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 16,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: '#A09CFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.30,
    shadowRadius: 8,
  },
  saveBtnTxt: {
    fontSize: 14,
    fontWeight: '800',
  },
});
