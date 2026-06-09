import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientProgressBar } from '@/components/GradientProgressBar';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DetectedCondition {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  progressValue: number;
  progressColor: [string, string];
  ImageUri: ImageSourcePropType;
  phase?: string;
}

interface DetectedConditionCardProps {
  condition: DetectedCondition;
  style?: StyleProp<ViewStyle>;
  /** Called when the condition image thumbnail is tapped */
  onImagePress?: (source: ImageSourcePropType, title: string, severity: string) => void;
}

// ── Severity colours ──────────────────────────────────────────────────────────

const severityStyle = (
  severity: 'Low' | 'Medium' | 'High'
): { bg: string; text: string; dot: string } => {
  switch (severity) {
    case 'High':
      return { bg: '#FEF2F2', text: '#EF4444', dot: '#EF4444' };
    case 'Medium':
      return { bg: '#FFFBEB', text: '#F59E0B', dot: '#F59E0B' };
    default:
      return { bg: '#EFF6FF', text: '#3B82F6', dot: '#3B82F6' };
  }
};

// ── Component ─────────────────────────────────────────────────────────────────

export const DetectedConditionCard: React.FC<DetectedConditionCardProps> = ({
  condition,
  style,
  onImagePress,
}) => {
  const { bg, text, dot } = severityStyle(condition.severity);
  const handleImagePress = () => {
    onImagePress?.(condition.ImageUri, condition.title, condition.severity);
  };

  useEffect(() => {
    console.log('phase: ', condition.phase);
  }, []);

  return (
    <View
      style={[
        {
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#F0E6D8',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        },
        style,
      ]}>
      {/* ── Image thumbnail — tappable ───────────────────────────────────── */}
      <TouchableOpacity
        onPress={handleImagePress}
        activeOpacity={onImagePress ? 0.85 : 1}
        disabled={!onImagePress}
        style={{ position: 'relative' }}>
        <Image
          source={condition.ImageUri}
          style={{ width: '100%', height: 180, resizeMode: 'cover' }}
        />

        {/* Expand icon overlay — only when tappable */}
        {onImagePress && (
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#00000066',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="expand-outline" size={16} color="#FFFFFF" />
          </View>
        )}

        {/* Severity badge overlaid on image */}
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: bg + 'EE',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 100,
          }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dot }} />
          <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 11, color: text }}>
            {condition.severity} severity
          </Text>
        </View>
      </TouchableOpacity>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <View style={{ padding: 14 }}>
        <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, color: '#2E2117' }}>
          {condition.title}
        </Text>

        <Text
          style={{
            fontFamily: 'Outfit-Regular',
            fontSize: 13,
            color: '#2E2117AA',
            marginTop: 6,
            lineHeight: 19,
          }}>
          {condition.description}
        </Text>

        {/* Progress bar */}
        {/* Progress bar */}
        <View style={{ marginTop: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}>
            <Text style={{ fontFamily: 'Outfit-Regular', fontSize: 11, color: '#2E211766' }}>
              Severity score
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {/* Phase badge — only shown when present */}
              {condition.phase ? (
                <View
                  style={{
                    backgroundColor: '#2E211712',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 100,
                  }}>
                  <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 10, color: '#2E2117AA' }}>
                    {condition.phase}
                  </Text>
                </View>
              ) : null}

              <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 11, color: text }}>
                {condition.progressValue}/100
              </Text>
            </View>
          </View>

          <GradientProgressBar
            progress={condition.progressValue}
            gradientColors={condition.progressColor}
            style={{
              height: 8,
              borderRadius: 4,
              borderWidth: 1,
              borderTopColor: '#c9beb177',
              borderLeftColor: '#c9beb177',
              borderBottomColor: '#FFFFFF99',
              borderRightColor: '#FFFFFF99',
            }}
            backgroundColor="#F0EBE6"
          />
        </View>
      </View>
    </View>
  );
};
