// app/(flow)/face-scan/loading-screen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useScanFaceMutation } from '@/store/api/scanApi';
import { getFaceScanCaptures } from '@/utils/storage';

// ── Status messages cycling during analysis ───────────────────────────────────
const STATUS_MESSAGES = [
  'Detecting facial features...',
  'Analyzing skin texture...',
  'Checking hydration levels...',
  'Evaluating pigmentation...',
  'Preparing your results...',
];

// ── Human-readable error labels for per-image errors ─────────────────────────
const IMAGE_ERROR_LABELS: Record<string, string> = {
  no_face: 'No face detected',
  face_too_small: 'Face too small — move closer',
  blurry: 'Image too blurry',
  low_light: 'Poor lighting',
};

const getImageErrorLabel = (error: string) =>
  IMAGE_ERROR_LABELS[error] ?? 'Could not process image';

// ── Known top-level error codes ───────────────────────────────────────────────
const SCAN_ERROR_CODES: Record<string, { title: string; message: string }> = {
  INVALID_FACE_IMAGES: {
    title: 'Face Images Invalid',
    message:
      'Some of your photos could not be verified. Please retake with your face clearly visible, well-lit, and close to the camera.',
  },
};

const GENERIC_ERROR = {
  title: 'Scan Failed',
  message: 'Something went wrong. Please try again.',
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface ImageValidationError {
  image: number;
  filename: string;
  error: string;
}

interface ScanError {
  title: string;
  message: string;
  validCount?: number;
  imageErrors?: ImageValidationError[];
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FaceScanLoadingScreen() {
  const { sessionId, scanType } = useLocalSearchParams<{
    sessionId?: string;
    scanType?: string;
  }>();

  const [statusIndex, setStatusIndex] = useState(0);
  const [scanError, setScanError] = useState<ScanError | null>(null);

  // Animated rings
  const outerRingAnim = useRef(new Animated.Value(0)).current;
  const middleRingAnim = useRef(new Animated.Value(0)).current;
  const innerRingAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [scanFace] = useScanFaceMutation();

  // ── Start animations ────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    const loops = (
      [
        [outerRingAnim, 2000],
        [middleRingAnim, 1500],
        [innerRingAnim, 1000],
      ] as [Animated.Value, number][]
    ).map(([anim, duration]) =>
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, []);

  // ── Cycle status messages ───────────────────────────────────────────────────
  useEffect(() => {
    if (scanError) return;
    const id = setInterval(
      () => setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length),
      1800
    );
    return () => clearInterval(id);
  }, [scanError]);

  // ── Kick off scan ───────────────────────────────────────────────────────────
  useEffect(() => {
    runScan();
  }, []);

  // ── Error parser ────────────────────────────────────────────────────────────
  const parseApiError = (err: any): ScanError => {
    const detail = err?.data?.detail;

    // Structured detail object (INVALID_FACE_IMAGES etc.)
    if (detail && typeof detail === 'object' && detail.code) {
      const known = SCAN_ERROR_CODES[detail.code];
      return {
        title: known?.title ?? GENERIC_ERROR.title,
        message: known?.message ?? detail.message ?? GENERIC_ERROR.message,
        validCount: detail.valid_count,
        imageErrors: detail.errors ?? [],
      };
    }

    // Plain string detail (e.g. "Exactly 5 images required")
    if (typeof detail === 'string') {
      return { title: GENERIC_ERROR.title, message: detail };
    }

    // Flat message fallback
    const flatMessage = err?.data?.message ?? err?.message;
    if (flatMessage) return { title: GENERIC_ERROR.title, message: flatMessage };

    return GENERIC_ERROR;
  };

  // ── Main scan runner ────────────────────────────────────────────────────────
  const runScan = async () => {
    if (!sessionId) {
      setScanError({
        title: 'Session Error',
        message: 'No scan session found. Please go back and try again.',
      });
      return;
    }

    // Load captured image URIs from storage
    const captures = await getFaceScanCaptures(sessionId);
    if (!captures || captures.length === 0) {
      setScanError({
        title: 'No Images Found',
        message: 'Could not retrieve your captured photos. Please go back and try again.',
      });
      return;
    }

    const imageUris = captures.map((c) => c.uri);

    try {
      const result = await scanFace({ imageUris }).unwrap();
      router.replace({
        pathname: '/(flow)/face-scan/analysis-complete',
        params: {
          scanResult: JSON.stringify(result),
          capturesJson: JSON.stringify(captures),
        },
      });
    } catch (err: any) {
      console.log('❌ Face Scan Error:', JSON.stringify(err, null, 2));
      setScanError(parseApiError(err));
    }
  };

  const outerRotate = outerRingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const middleRotate = middleRingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });
  const innerRotate = innerRingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // ── Error state ─────────────────────────────────────────────────────────────
  if (scanError) {
    const hasImageErrors = scanError.imageErrors && scanError.imageErrors.length > 0;
    const failedCount = scanError.imageErrors?.length ?? 0;
    const validCount = scanError.validCount ?? 0;

    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
        <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
              paddingVertical: 40,
            }}
            showsVerticalScrollIndicator={false}>
            {/* Error icon */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#FEF2F2',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                borderWidth: 1,
                borderColor: '#FECACA',
              }}>
              <Ionicons name="scan-outline" size={38} color="#EF4444" />
            </View>

            {/* Title */}
            <Text
              className="text-center font-outfitMedium text-[22px]"
              style={{ color: '#2E2117' }}>
              {scanError.title}
            </Text>

            {/* Message */}
            <Text
              className="mt-3 text-center font-outfit text-[14px]"
              style={{ color: '#2E2117B2', lineHeight: 22 }}>
              {scanError.message}
            </Text>

            {/* Valid count pill */}
            {scanError.validCount !== undefined && (
              <View
                className="mt-4 flex-row items-center gap-2 rounded-2xl px-4 py-2"
                style={{ backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' }}>
                <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                <Text className="font-outfit text-[13px]" style={{ color: '#15803D' }}>
                  {validCount} of 5 photos valid
                </Text>
              </View>
            )}

            {/* Per-image error breakdown */}
            {hasImageErrors && (
              <View
                className="mt-4 w-full rounded-2xl p-4"
                style={{
                  backgroundColor: '#FFF7ED',
                  borderWidth: 1,
                  borderColor: '#FED7AA',
                }}>
                <Text className="mb-3 font-outfitMedium text-[13px]" style={{ color: '#92400E' }}>
                  Issues detected ({failedCount} photo{failedCount !== 1 ? 's' : ''}):
                </Text>
                {scanError.imageErrors!.map((imgErr, idx) => (
                  <View
                    key={idx}
                    className="mb-2 flex-row items-start gap-2"
                    style={idx === scanError.imageErrors!.length - 1 ? { marginBottom: 0 } : {}}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: '#FEE2E2',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 1,
                        flexShrink: 0,
                      }}>
                      <Text
                        style={{
                          color: '#DC2626',
                          fontSize: 10,
                          fontFamily: 'Outfit-Medium',
                        }}>
                        {imgErr.image}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-outfitMedium text-[12px]" style={{ color: '#7C2D12' }}>
                        {getImageErrorLabel(imgErr.error)}
                      </Text>
                      <Text
                        className="font-outfit text-[11px]"
                        style={{ color: '#92400E', opacity: 0.7 }}>
                        {imgErr.filename}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Tips */}
            <View
              className="mt-4 w-full rounded-2xl p-4"
              style={{ backgroundColor: '#9778571A', borderWidth: 1, borderColor: '#97785733' }}>
              <Text className="mb-2 font-outfitMedium text-[12px]" style={{ color: '#7A5D3E' }}>
                Tips for a good scan:
              </Text>
              {[
                'Face must fill the oval frame',
                'Use natural light, facing a window',
                'Remove glasses and pull back hair',
                'Hold phone at eye level, ~30cm away',
              ].map((tip, i) => (
                <View key={i} className="mb-1 flex-row items-start gap-2">
                  <Text style={{ color: '#977857', fontSize: 10, marginTop: 2 }}>•</Text>
                  <Text
                    className="flex-1 font-outfit text-[11px]"
                    style={{ color: '#7A5D3E', lineHeight: 16 }}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>

            {/* CTA buttons */}
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.85}
              className="mt-8 w-full items-center rounded-2xl py-4"
              style={{ backgroundColor: '#361A0D' }}>
              <Text className="font-outfitMedium text-[16px] text-white">Retake Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(main)')}
              activeOpacity={0.6}
              className="mt-4 w-full items-center py-4">
              <Text className="font-outfitMedium text-[15px]" style={{ color: '#2E211799' }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── Loading state ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={[]} className="flex-1 bg-backgroundColor">
      <Animated.View className="flex-1 items-center justify-center" style={{ opacity: fadeAnim }}>
        {/* Triple spinning rings */}
        <View className="relative items-center justify-center" style={{ width: 95, height: 95 }}>
          <Animated.View
            style={{
              position: 'absolute',
              width: 95,
              height: 95,
              borderRadius: 47.5,
              borderWidth: 1.5,
              borderColor: '#E5D5C0',
              borderTopColor: '#361A0D',
              transform: [{ rotate: outerRotate }],
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              width: 75,
              height: 75,
              borderRadius: 37.5,
              borderWidth: 1.8,
              borderColor: '#D4BDA5',
              borderTopColor: '#5A3A2A',
              transform: [{ rotate: middleRotate }],
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              width: 55,
              height: 55,
              borderRadius: 27.5,
              borderWidth: 2,
              borderColor: '#C4B7AA',
              borderTopColor: '#8B5A3C',
              transform: [{ rotate: innerRotate }],
            }}
          />
          {/* Face icon in centre */}
          <Ionicons name="scan-outline" size={26} color="#361A0D" />
        </View>

        <View className="mt-8 items-center">
          <Text className="font-outfitMedium text-[24px]" style={{ color: '#2E2117' }}>
            Lia Analyzing Your Skin
          </Text>
          <Text
            className="mt-2 px-8 text-center font-outfit text-[14px]"
            style={{ color: '#2E2117CC' }}>
            {STATUS_MESSAGES[statusIndex]}
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
