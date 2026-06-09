// components/ui/ImageViewerModal.tsx
import React, { useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  PanResponder,
  useWindowDimensions,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

interface ImageViewerModalProps {
  visible: boolean;
  imageSource: ImageSourcePropType | null;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  visible,
  imageSource,
  title,
  subtitle,
  onClose,
}) => {
  const { width, height } = useWindowDimensions();

  // ── Scale / pan state via Animated ───────────────────────────────────────
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const currentScale = useRef(1);
  const currentTranslateX = useRef(0);
  const currentTranslateY = useRef(0);

  const lastScale = useRef(1);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  const initialDistance = useRef<number | null>(null);

  const resetTransform = useCallback(() => {
    currentScale.current = 1;
    currentTranslateX.current = 0;
    currentTranslateY.current = 0;
    lastScale.current = 1;
    lastTranslateX.current = 0;
    lastTranslateY.current = 0;
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
    ]).start();
  }, [scale, translateX, translateY]);

  const getDistance = (touches: any[]) => {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        lastTranslateX.current = currentTranslateX.current;
        lastTranslateY.current = currentTranslateY.current;
        lastScale.current = currentScale.current;
        if (evt.nativeEvent.touches.length === 2) {
          initialDistance.current = getDistance(evt.nativeEvent.touches as any);
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length === 2) {
          // Pinch to zoom
          const dist = getDistance(touches as any);
          if (initialDistance.current) {
            const scaleFactor = (dist / initialDistance.current) * lastScale.current;
            const clampedScale = Math.min(Math.max(scaleFactor, 0.5), 4);
            currentScale.current = clampedScale;
            scale.setValue(clampedScale);
          }
        } else if (touches.length === 1 && currentScale.current > 1) {
          // Pan when zoomed in
          const newX = lastTranslateX.current + gestureState.dx;
          const newY = lastTranslateY.current + gestureState.dy;
          currentTranslateX.current = newX;
          currentTranslateY.current = newY;
          translateX.setValue(newX);
          translateY.setValue(newY);
        }
      },

      onPanResponderRelease: () => {
        initialDistance.current = null;
        // If scaled to near 1, snap back to center
        if (currentScale.current <= 1.05) {
          resetTransform();
        }
      },

      onPanResponderTerminate: () => {
        initialDistance.current = null;
      },
    })
  ).current;

  const handleClose = useCallback(() => {
    resetTransform();
    onClose();
  }, [resetTransform, onClose]);

  if (!imageSource) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      <View style={styles.backdrop}>
        {/* ── Close button ──────────────────────────────────────────────── */}
        <SafeAreaView edges={['top']} style={styles.headerRow}>
          <View style={styles.headerInner}>
            {/* Title + subtitle */}
            <View style={{ flex: 1 }}>
              {title ? (
                <Text style={styles.titleText} numberOfLines={1}>
                  {title}
                </Text>
              ) : null}
              {subtitle ? (
                <Text style={styles.subtitleText} numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeButton}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* ── Zoomable image ────────────────────────────────────────────── */}
        <View style={[styles.imageContainer, { width, height }]} {...panResponder.panHandlers}>
          <Animated.View
            style={{
              transform: [{ scale }, { translateX }, { translateY }],
            }}>
            <Image source={imageSource} style={{ width, height, resizeMode: 'contain' }} />
          </Animated.View>
        </View>

        {/* ── Hint ─────────────────────────────────────────────────────── */}
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <Text style={styles.hintText}>Pinch to zoom · drag to pan</Text>
          <TouchableOpacity onPress={resetTransform} style={styles.resetButton}>
            <Ionicons name="scan-outline" size={14} color="#FFFFFF88" />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#00000066',
    gap: 12,
  },
  titleText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  subtitleText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: '#FFFFFF88',
    marginTop: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  hintText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 11,
    color: '#FFFFFF55',
    textAlign: 'center',
    paddingBottom: 4,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  resetText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: '#FFFFFF88',
  },
});
