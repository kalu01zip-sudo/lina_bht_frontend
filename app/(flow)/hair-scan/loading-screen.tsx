// app/(flow)/hair-scan/loading-screen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraIcon } from '@/components/icons';
import { useScanHairScalpMutation } from '@/store/api/scanApi';
import { Ionicons } from '@expo/vector-icons';

const STATUS_MESSAGES = [
  'Analyzing hair & scalp...',
  'Checking for dandruff...',
  'Evaluating scalp health...',
  'Preparing your results...',
];

// Known error codes from the API
const SCAN_ERROR_CODES: Record<string, { title: string; message: string }> = {
  NO_SCALP_OR_HAIR: {
    title: 'No Hair or Scalp Detected',
    message:
      'Please upload a clear photo of your scalp or hair. Make sure your hair is visible and the lighting is good.',
  },
  INVALID_IMAGE: {
    title: 'Invalid Image',
    message: 'We could not process this image. Please try again with a different photo.',
  },
  // Add more codes as the API evolves
};

const GENERIC_ERROR = {
  title: 'Scan Failed',
  message: 'Something went wrong. Please try again.',
};

interface ScanError {
  title: string;
  message: string;
  reason?: string;
}

export default function HairLoadingScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const [statusIndex, setStatusIndex] = useState(0);
  const [scanError, setScanError] = useState<ScanError | null>(null);

  const outerRingAnim = useRef(new Animated.Value(0)).current;
  const middleRingAnim = useRef(new Animated.Value(0)).current;
  const innerRingAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [scanHairScalp] = useScanHairScalpMutation();

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

  useEffect(() => {
    if (scanError) return; // stop cycling messages once error shows
    const id = setInterval(
      () => setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length),
      1800
    );
    return () => clearInterval(id);
  }, [scanError]);

  useEffect(() => {
    runScan();
  }, []);

  const parseApiError = (err: any): ScanError => {
    // Shape: { data: { detail: { code, message, reason } } }
    const detail = err?.data?.detail;

    if (detail?.code) {
      const known = SCAN_ERROR_CODES[detail.code];
      return {
        title: known?.title ?? GENERIC_ERROR.title,
        message: known?.message ?? detail.message ?? GENERIC_ERROR.message,
        reason: detail.reason,
      };
    }

    // Flat message fallback
    const flatMessage = err?.data?.message ?? err?.message;
    if (flatMessage) {
      return { title: GENERIC_ERROR.title, message: flatMessage };
    }

    return GENERIC_ERROR;
  };

  const runScan = async () => {
    if (!imageUri) {
      setScanError({
        title: 'No Image',
        message: 'No image was provided. Please go back and try again.',
      });
      return;
    }

    try {
      const result = await scanHairScalp({ imageUri }).unwrap();
      router.replace({
        pathname: '/(flow)/hair-scan/analysis-complete',
        params: { scanResult: JSON.stringify(result), imageUri },
      });
    } catch (err: any) {
      console.log('❌ Hair Scan Error:', JSON.stringify(err, null, 2));
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

  // ── Error state ────────────────────────────────────────────────────────────
  if (scanError) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
        <Animated.View
          className="flex-1 items-center justify-center px-8"
          style={{ opacity: fadeAnim }}>
          {/* Icon */}
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
            <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
          </View>

          {/* Title */}
          <Text className="text-center font-outfitMedium text-[22px]" style={{ color: '#2E2117' }}>
            {scanError.title}
          </Text>

          {/* Message */}
          <Text
            className="mt-3 text-center font-outfit text-[14px]"
            style={{ color: '#2E2117B2', lineHeight: 22 }}>
            {scanError.message}
          </Text>

          {/* Reason from API (extra context) */}
          {scanError.reason && (
            <View
              className="mt-4 rounded-2xl px-4 py-3"
              style={{ backgroundColor: '#9778571A', borderWidth: 1, borderColor: '#97785733' }}>
              <Text
                className="text-center font-outfit text-[12px]"
                style={{ color: '#7A5D3E', lineHeight: 18 }}>
                {scanError.reason}
              </Text>
            </View>
          )}

          {/* Actions */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.85}
            className="mt-8 w-full items-center rounded-2xl py-4"
            style={{ backgroundColor: '#361A0D' }}>
            <Text className="font-outfitMedium text-[16px] text-white">Retake Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(main)')}
            activeOpacity={0.6}
            className="mt-4 w-full items-center py-4">
            <Text className="font-outfitMedium text-[15px]" style={{ color: '#2E211799' }}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={[]} className="flex-1 bg-backgroundColor">
      <Animated.View className="flex-1 items-center justify-center" style={{ opacity: fadeAnim }}>
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
          <View className="items-center justify-center">
            <CameraIcon size={30} color="#361A0D" />
          </View>
        </View>

        <View className="mt-8 items-center">
          <Text className="font-outfitMedium text-[24px]" style={{ color: '#2E2117' }}>
            Lia Analyzing Hair & Scalp
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
