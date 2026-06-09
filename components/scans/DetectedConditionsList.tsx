import React, { useState, useCallback } from 'react';
import { View, Text, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { DetectedConditionCard, DetectedCondition } from './DetectedConditionCard';
import { ImageViewerModal } from '@/components/ui/ImageViewerModal';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { Ionicons } from '@expo/vector-icons';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DetectedConditionsListProps {
  conditions: DetectedCondition[];
  title?: string;
  showIcon?: boolean;
  /** When true the image thumbnails on each card are shown and tappable */
  showFaceImages?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ── Modal state shape ─────────────────────────────────────────────────────────

interface ModalState {
  visible: boolean;
  source: ImageSourcePropType | null;
  title: string;
  severity: string;
}

const INITIAL_MODAL: ModalState = {
  visible: false,
  source: null,
  title: '',
  severity: '',
};

// ── Component ─────────────────────────────────────────────────────────────────

export const DetectedConditionsList: React.FC<DetectedConditionsListProps> = ({
  conditions,
  title = 'Detected Conditions',
  showIcon = true,
  showFaceImages = true,
  style,
}) => {
  const [modal, setModal] = useState<ModalState>(INITIAL_MODAL);

  const handleImagePress = useCallback(
    (source: ImageSourcePropType, conditionTitle: string, severity: string) => {
      setModal({ visible: true, source, title: conditionTitle, severity });
    },
    []
  );

  const handleClose = useCallback(() => {
    setModal(INITIAL_MODAL);
  }, []);

  if (!conditions.length) return null;

  return (
    <>
      <BorderlessShadowCard
        b_tl={24}
        b_tr={24}
        b_bl={24}
        b_br={24}
        style={[{ paddingVertical: 18, paddingHorizontal: 20, marginTop: 24 }, style]}>
        {/* Section header */}
        {title ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            {showIcon && (
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#EF444418',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="scan-outline" size={18} color="#EF4444" />
              </View>
            )}
            <Text style={{ flex: 1, fontFamily: 'Outfit-Medium', fontSize: 16, color: '#2E2117' }}>
              {title}
            </Text>
          </View>
        ) : null}

        {/* Cards */}
        {conditions.map((condition, index) => (
          <DetectedConditionCard
            key={condition.id}
            condition={condition}
            style={{ marginTop: index === 0 ? 0 : 24 }}
            // Only pass the press handler when face images are enabled;
            // this preserves the original behaviour for non-face contexts.
            onImagePress={showFaceImages ? handleImagePress : undefined}
          />
        ))}
      </BorderlessShadowCard>

      {/* Full-screen image viewer — renders outside the card so it's truly fullscreen */}
      <ImageViewerModal
        visible={modal.visible}
        imageSource={modal.source}
        title={modal.title}
        subtitle={`${modal.severity} severity`}
        onClose={handleClose}
      />
    </>
  );
};
