import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraIcon } from '@/components/icons';
import { Ionicons } from '@expo/vector-icons';
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

const SCAN_ERROR_CODES: Record<string, { title: string; message: string }> = {
  PRODUCT_NOT_FOUND: {
    title: 'Product Not Found',
    message:
      'We could not find this product in our database. Try scanning the ingredient label instead using Manual Capture.',
  },
  INVALID_IMAGE: {
    title: 'Invalid Image',
    message: 'We could not process this image. Please try again with a clearer photo.',
  },
  NO_PRODUCT_DETECTED: {
    title: 'No Product Detected',
    message: 'No product label was detected. Ensure the label is clearly visible and well-lit.',
  },
};

const GENERIC_ERROR = {
  title: 'Scan Failed',
  message: 'Something went wrong. Please try again.',
};

interface ScanError {
  title: string;
  message: string;
}

export default function ProductLoadingScreen() {
  const { imageUri, scanType, manualCapture, barcode, barcodeType } = useLocalSearchParams<{
    imageUri?: string;
    scanType?: string;
    manualCapture?: string;
    barcode?: string;
    barcodeType?: string;
  }>();

  const [statusIndex, setStatusIndex] = useState(0);
  const [scanError, setScanError] = useState<ScanError | null>(null);

  const outerRingAnim = useRef(new Animated.Value(0)).current;
  const middleRingAnim = useRef(new Animated.Value(0)).current;
  const innerRingAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [scanByImage] = useScanProductByImageMutation();
  const [scanByBarcode] = useScanProductByBarcodeMutation();

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
    if (scanError) return;
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
    const detail = err?.data?.detail;

    if (detail && typeof detail === 'object' && detail.code) {
      const known = SCAN_ERROR_CODES[detail.code];
      return {
        title: known?.title ?? GENERIC_ERROR.title,
        message: known?.message ?? detail.message ?? GENERIC_ERROR.message,
      };
    }

    if (typeof detail === 'string') {
      return { title: GENERIC_ERROR.title, message: detail };
    }

    const flatMessage = err?.data?.message ?? err?.message;
    if (flatMessage) return { title: GENERIC_ERROR.title, message: flatMessage };

    return GENERIC_ERROR;
  };

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
        const result = await scanByImage({ imageUri }).unwrap();
        goToResults(result);
      } else if (barcode) {
        const result = await scanByBarcode({ barcode, barcodeType }).unwrap();
        goToResults(result);
      } else {
        setScanError({
          title: 'Nothing to Scan',
          message: 'No image or barcode was provided. Please go back and try again.',
        });
      }
    } catch (err: any) {
      console.log('❌ Product Scan Error:', JSON.stringify(err, null, 2));
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
    const isBarcode = !!barcode;
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
              <Ionicons name="cube-outline" size={38} color="#EF4444" />
            </View>

            <Text
              className="text-center font-outfitMedium text-[22px]"
              style={{ color: '#2E2117' }}>
              {scanError.title}
            </Text>

            <Text
              className="mt-3 text-center font-outfit text-[14px]"
              style={{ color: '#2E2117B2', lineHeight: 22 }}>
              {scanError.message}
            </Text>

            {/* Tips */}
            <View
              className="mt-6 w-full rounded-2xl p-4"
              style={{ backgroundColor: '#9778571A', borderWidth: 1, borderColor: '#97785733' }}>
              <Text className="mb-2 font-outfitMedium text-[12px]" style={{ color: '#7A5D3E' }}>
                {isBarcode ? 'Tips for barcode scanning:' : 'Tips for a good scan:'}
              </Text>
              {(isBarcode
                ? [
                    'Center the barcode within the frame',
                    'Hold the phone steady at ~20cm',
                    'Ensure good lighting with no glare',
                    'Try Manual Capture if barcode scanning fails',
                  ]
                : [
                    'Photograph the full ingredient label',
                    'Use natural light, avoid glare',
                    'Hold phone steady, ~20cm from label',
                    'Ensure text is sharp and readable',
                  ]
              ).map((tip, i) => (
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

            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.85}
              className="mt-8 w-full items-center rounded-2xl py-4"
              style={{ backgroundColor: '#361A0D' }}>
              <Text className="font-outfitMedium text-[16px] text-white">
                {isBarcode ? 'Try Again' : 'Retake Photo'}
              </Text>
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

  // ── Loading state ────────────────────────────────────────────────────────────
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
            Gixy AI Analyzing Product
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
