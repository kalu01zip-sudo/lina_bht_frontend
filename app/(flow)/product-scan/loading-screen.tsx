// app/(flow)/product-scan/loading-screen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraIcon } from '@/components/icons';
import {
  useScanProductByImageMutation,
  useScanProductByBarcodeMutation,
  ProductScanResult,
} from '@/store/api/scanApi';

const STATUS_MESSAGES = [
  'Analyzing ingredients...',
  'Checking compatibility...',
  'Evaluating safety profile...',
  'Finding matches...',
];

// Placeholder used until the barcode backend endpoint ships.
// Shape matches ProductScanResult so the analysis screen handles it uniformly.
const buildBarcodePlaceholder = (barcode: string, barcodeType?: string): ProductScanResult => ({
  scan_id: `barcode_placeholder_${Date.now()}`,
  product: {
    id: 'barcode_placeholder',
    name: 'Barcode lookup coming soon',
    brand: '',
    category: '',
    image_url: '',
  },
  detected_ingredients: [],
  ingredient_conflicts: [],
  ingredient_intelligence: {
    irritation_load: 0,
    exfoliation_load: 0,
    barrier_stress: 0,
    active_intensity: 0,
  },
  analysis: {
    overall_score: 0,
    score_profile: { compatibility: 0, safety: 0, redness: 0, effectiveness: 0, evenness: 0 },
    compatibility_analysis: {
      ingredient_conflict: { score: 0, intensity: 'low', why: '' },
      allergy_risk: { score: 0, intensity: 'low', why: '' },
    },
    product_benefits: {
      high_compatibility: { score: 0, intensity: 'low', why: '' },
      ingredient_synergy: { score: 0, intensity: 'low', why: '' },
    },
    what_to_stop: [],
    what_to_do: [],
    learn_more: `Barcode detected: ${barcode}. Product lookup via barcode is coming soon — please use Manual Capture in the meantime.`,
  },
  catalog_product: null,
});

export default function ProductLoadingScreen() {
  const { imageUri, scanType, manualCapture, barcode, barcodeType } = useLocalSearchParams<{
    imageUri?: string;
    scanType?: string;
    manualCapture?: string;
    barcode?: string;
    barcodeType?: string;
  }>();

  const [statusIndex, setStatusIndex] = useState(0);

  const outerRingAnim = useRef(new Animated.Value(0)).current;
  const middleRingAnim = useRef(new Animated.Value(0)).current;
  const innerRingAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [scanByImage] = useScanProductByImageMutation();
  const [scanByBarcode] = useScanProductByBarcodeMutation();

  // ── Animations ──────────────────────────────────────────────────────────────

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
    const id = setInterval(
      () => setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length),
      1800
    );
    return () => clearInterval(id);
  }, []);

  // ── Scan trigger ─────────────────────────────────────────────────────────────

  useEffect(() => {
    runScan();
  }, []);

  const goToResults = (result: ProductScanResult) => {
    router.replace({
      pathname: '/(flow)/product-scan/analysis-complete',
      params: {
        scanResult: JSON.stringify(result),
        imageUri: imageUri ?? '',
        scanType: scanType ?? '',
      },
    });
  };

  const runScan = async () => {
    try {
      if (manualCapture === 'true' && imageUri) {
        // ── Image path ──────────────────────────────────────────────────────
        const result = await scanByImage({ imageUri }).unwrap();
        goToResults(result);
      } else if (barcode) {
        // ── Barcode path ────────────────────────────────────────────────────
        // Try the real endpoint; fall back to placeholder if it 404s / isn't live.
        try {
          const result = await scanByBarcode({ barcode, barcodeType }).unwrap();
          goToResults(result);
        } catch {
          goToResults(buildBarcodePlaceholder(barcode, barcodeType));
        }
      } else {
        throw new Error('No image or barcode provided.');
      }
    } catch (err: any) {
      console.error('[ProductScan]', err);
      Alert.alert(
        'Scan Failed',
        err?.data?.message ?? err?.message ?? 'Something went wrong. Please try again.',
        [{ text: 'Go Back', onPress: () => router.back() }]
      );
    }
  };

  // ── Interpolations ───────────────────────────────────────────────────────────

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

  // ── Render ───────────────────────────────────────────────────────────────────

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
            Lia Analyzing Product
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
