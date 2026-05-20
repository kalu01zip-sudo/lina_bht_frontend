

// components/scans/BaseProductCameraScan.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  Dimensions,
  Vibration,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult, CameraType } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../buttons/PrimaryButton';
import { PreScanInstructions } from '@/components/scans/PreScanInstructions';
import { BarCodeScanningIcon, CameraIcon, SquareFrameIcon, SunIcon } from '../icons';

const { width, height } = Dimensions.get('window');

type ScanMode = 'barcode' | 'manual';

interface BaseProductCameraScanProps {
  scanType: string;
  title?: string;
  subtitle?: string;
  onCapture?: (photoUri: string) => void;
  onBarcodeScanned?: (barcodeData: BarcodeScanningResult) => void;
  enableAutoScan?: boolean;
}

export const BaseProductCameraScan: React.FC<BaseProductCameraScanProps> = ({
  scanType,
  title = 'Scan product barcode or ingredients',
  subtitle = 'Position the product label within the frame',
  onCapture,
  onBarcodeScanned,
  enableAutoScan = true,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');
  const [frameHeight, setFrameHeight] = useState(height * 0.25);
  const [showInstructions, setShowInstructions] = useState(true);
  const [scanMode, setScanMode] = useState<ScanMode>('barcode');
  const [cameraFacing, setCameraFacing] = useState<CameraType>('back');
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  // Shown briefly after a barcode is detected to inform the user the endpoint is pending
  const [barcodeToastVisible, setBarcodeToastVisible] = useState(false);
  const barcodeToastOpacity = useRef(new Animated.Value(0)).current;

  const cameraRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

  const frameScale = useRef(new Animated.Value(1)).current;
  const scanLineTranslate = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const onFrameLayout = (event: any) => {
    const { height: measuredHeight } = event.nativeEvent.layout;
    setFrameHeight(measuredHeight);
  };

  // Camera switch animation
  const animateCameraSwitch = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(rotateAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const switchCamera = () => {
    setIsSwitchingCamera(true);
    animateCameraSwitch();
    setCameraFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    setTimeout(() => setIsSwitchingCamera(false), 500);
  };

  // Scan line animation
  useEffect(() => {
    if (isScanning && enableAutoScan && scanMode === 'barcode' && frameHeight > 0) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineTranslate, {
            toValue: frameHeight,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineTranslate, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isScanning, enableAutoScan, scanMode, frameHeight, scanLineTranslate]);

  // Show a brief "coming soon" toast then navigate to the loading screen
  const showBarcodeComingSoonToast = () => {
    setBarcodeToastVisible(true);
    Animated.sequence([
      Animated.timing(barcodeToastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(barcodeToastOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => setBarcodeToastVisible(false));
  };

  const handleBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanMode !== 'barcode') return;
    if (lastScannedCode === scanningResult.data || !isScanning || !enableAutoScan) return;

    Vibration.vibrate(50);
    setLastScannedCode(scanningResult.data);
    setIsScanning(false);

    if (onBarcodeScanned) {
      onBarcodeScanned(scanningResult);
    }

    // Show the toast to set user expectations, then continue to loading screen
    // The loading screen will build a placeholder result since the endpoint isn't ready.
    showBarcodeComingSoonToast();

    setTimeout(() => {
      router.push({
        pathname: `/(flow)/${scanType}/loading-screen`,
        params: {
          barcode: scanningResult.data,
          barcodeType: scanningResult.type,
          scanType,
        },
      });
    }, 300);
  };

  const takePicture = async () => {
    if (cameraRef.current && !isTakingPicture && scanMode === 'manual') {
      setIsTakingPicture(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: false });

        if (onCapture) {
          onCapture(photo.uri);
        } else {
          router.push({
            pathname: `/(flow)/${scanType}/loading-screen`,
            params: {
              imageUri: photo.uri,
              scanType,
              manualCapture: 'true',
            },
          });
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      } finally {
        setIsTakingPicture(false);
      }
    }
  };

  const resetScanning = () => {
    setLastScannedCode('');
    setIsScanning(true);
  };

  const productScanSteps = [
    {
      id: 'lighting',
      icon: <SunIcon size={24} color="#F59E0B" />,
      title: 'Good Lighting',
      description: 'Ensure the product label is well-lit and readable.',
    },
    {
      id: 'focus',
      icon: <BarCodeScanningIcon size={24} color="#3B82F6" />,
      title: 'Focus on Code',
      description: 'Center the barcode or QR code within the frame for quick detection.',
    },
    {
      id: 'stability',
      icon: <SquareFrameIcon size={24} color="#7A8B6A" />,
      title: 'Hold Steady',
      description: 'Keep the product steady and avoid glare or shadows.',
    },
  ];

  if (showInstructions) {
    return (
      <PreScanInstructions
        onStart={() => setShowInstructions(false)}
        title="For best results, follow these steps :"
        headerTitle="Scan Preparation"
        subTitle="Select what you would like to analyze today."
        videoSource={require('@/assets/videos/product_scan_guide.mp4')}
        instructionSteps={productScanSteps}
        startButtonTitle="Start Scanning"
      />
    );
  }

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="mb-4 text-white">We need camera permission to scan</Text>
        <TouchableOpacity onPress={requestPermission} className="rounded-lg bg-blue-500 px-6 py-3">
          <Text className="font-semibold text-white">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const RoundedCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const getCornerStyle = () => {
      switch (position) {
        case 'tl':
          return { top: -3, left: -3 };
        case 'tr':
          return { top: -3, right: -3 };
        case 'bl':
          return { bottom: -3, left: -3 };
        case 'br':
          return { bottom: -3, right: -3 };
      }
    };

    const isTop = position === 'tl' || position === 'tr';
    const isLeft = position === 'tl' || position === 'bl';

    return (
      <View style={[getCornerStyle(), { position: 'absolute', width: 30, height: 30 }]}>
        <View
          style={{
            position: 'absolute',
            [isTop ? 'top' : 'bottom']: 0,
            [isLeft ? 'left' : 'right']: 0,
            width: 24,
            height: 3,
            borderRadius: 3,
            backgroundColor: '#8FB87A',
          }}
        />
        <View
          style={{
            position: 'absolute',
            [isTop ? 'top' : 'bottom']: 0,
            [isLeft ? 'left' : 'right']: 0,
            width: 3,
            height: 24,
            borderRadius: 3,
            backgroundColor: '#8FB87A',
          }}
        />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <Animated.View style={{ flex: 1, transform: [{ scale: isSwitchingCamera ? 0.95 : 1 }] }}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={cameraFacing}
          barcodeScannerSettings={{
            barcodeTypes:
              scanMode === 'barcode'
                ? [
                    'ean13',
                    'ean8',
                    'upc_a',
                    'upc_e',
                    'code128',
                    'code39',
                    'qr',
                    'pdf417',
                    'aztec',
                    'codabar',
                    'code93',
                    'itf14',
                  ]
                : [],
          }}
          onBarcodeScanned={scanMode === 'barcode' ? handleBarcodeScanned : undefined}
        />
      </Animated.View>

      <View className="absolute inset-0">
        {scanMode === 'barcode' && <View className="absolute inset-0 bg-black/50" />}

        {/* Mode Switcher */}
        <View
          style={{
            position: 'absolute',
            top: Math.max(insets.top, 90),
            left: 20,
            right: 20,
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 30,
            padding: 4,
            zIndex: 20,
          }}>
          <TouchableOpacity
            onPress={() => setScanMode('barcode')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 26,
              backgroundColor: scanMode === 'barcode' ? '#8FB87A' : 'transparent',
              alignItems: 'center',
            }}>
            <Text
              className="font-outfitMedium text-[14px]"
              style={{ color: scanMode === 'barcode' ? '#fff' : 'rgba(255,255,255,0.6)' }}>
              Scan Barcode/QR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setScanMode('manual')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 26,
              backgroundColor: scanMode === 'manual' ? '#8FB87A' : 'transparent',
              alignItems: 'center',
            }}>
            <Text
              className="font-outfitMedium text-[14px]"
              style={{ color: scanMode === 'manual' ? '#fff' : 'rgba(255,255,255,0.6)' }}>
              Manual Capture
            </Text>
          </TouchableOpacity>
        </View>

        {/* Camera Switch Button */}
        <TouchableOpacity
          onPress={switchCamera}
          disabled={isSwitchingCamera}
          style={{
            position: 'absolute',
            top: Math.max(insets.top, 160),
            right: Math.max(insets.right, 16),
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 22,
            zIndex: 20,
          }}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>

        {/* Scanning Frame */}
        {scanMode === 'barcode' && (
          <View className="flex-1 items-center justify-center">
            <Animated.View
              onLayout={onFrameLayout}
              style={{
                width: width * 0.85,
                height: height * 0.25,
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                transform: [{ scale: frameScale }],
              }}>
              <RoundedCorner position="tl" />
              <RoundedCorner position="tr" />
              <RoundedCorner position="bl" />
              <RoundedCorner position="br" />

              {isScanning && enableAutoScan && (
                <Animated.View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: '#8FB87A',
                    shadowColor: '#8FB87A',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    borderRadius: 2,
                    transform: [{ translateY: scanLineTranslate }],
                  }}
                />
              )}

              <Text className="text-center font-outfit text-sm text-white">
                Position barcode or QR code within frame
              </Text>
            </Animated.View>
          </View>
        )}

        {/* Auto-detect status indicator */}
        {scanMode === 'barcode' && (
          <View
            style={{
              position: 'absolute',
              top: Math.max(insets.top, 160),
              left: 0,
              right: 0,
              alignItems: 'center',
              zIndex: 15,
            }}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons
                  name={isScanning ? 'scan-outline' : 'checkmark-circle'}
                  size={16}
                  color={isScanning ? '#8FB87A' : '#4CAF50'}
                />
                <Text className="font-outfit text-xs text-white">
                  {isScanning ? 'Auto-scanning active' : 'Barcode detected!'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: Math.max(insets.top, 16),
            left: Math.max(insets.left, 16),
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 22,
            zIndex: 10,
          }}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Camera Facing Indicator */}
        <View
          style={{
            position: 'absolute',
            top: Math.max(insets.top, 210),
            right: Math.max(insets.right, 16),
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
            zIndex: 20,
          }}>
          <Text className="font-outfit text-[10px] text-white/70">
            {cameraFacing === 'back' ? 'Back' : 'Front'} Camera
          </Text>
        </View>

        {/* Instruction Text */}
        <View
          style={{
            position: 'absolute',
            bottom: 160 + insets.bottom,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <Text className="mb-2 text-center font-outfitMedium text-base text-white">
            {scanMode === 'barcode'
              ? enableAutoScan
                ? 'Auto-detecting barcode/QR...'
                : title
              : 'Ready to capture product photo'}
          </Text>
          <Text className="text-center font-outfit text-sm text-white/70">
            {scanMode === 'barcode'
              ? enableAutoScan
                ? 'Position the code within the frame for automatic detection'
                : subtitle
              : 'Tap the capture button below to take a photo'}
          </Text>
        </View>

        {/* Capture Button — manual mode */}
        {scanMode === 'manual' && (
          <View
            style={{
              position: 'absolute',
              bottom: Math.max(insets.bottom + 20, 30),
              left: 20,
              right: 20,
              alignItems: 'center',
              gap: 12,
            }}>
            <PrimaryButton
              title="Capture Photo"
              onPress={takePicture}
              disabled={isTakingPicture}
              isLoading={isTakingPicture}
              loaderColor="#361A0D"
              style={{ width: '100%' }}
              gradientColors={['#759A52', '#FFFFFF99']}
              textStyle={{ fontSize: 16, fontWeight: '600' }}
            />
          </View>
        )}

        {/* Reset button — barcode mode after detection */}
        {scanMode === 'barcode' && enableAutoScan && !isScanning && (
          <View
            style={{
              position: 'absolute',
              bottom: Math.max(insets.bottom + 20, 30),
              left: 20,
              right: 20,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={resetScanning}
              style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
              <Text className="text-center font-outfit text-sm text-white/70">
                Tap to scan again
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Barcode "coming soon" toast ───────────────────────────────────── */}
        {barcodeToastVisible && (
          <Animated.View
            style={{
              position: 'absolute',
              bottom: Math.max(insets.bottom + 90, 100),
              left: 20,
              right: 20,
              alignItems: 'center',
              opacity: barcodeToastOpacity,
              zIndex: 30,
            }}>
            <View
              style={{
                backgroundColor: 'rgba(20,20,20,0.88)',
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                borderWidth: 1,
                borderColor: '#8FB87A44',
              }}>
              <Ionicons name="time-outline" size={18} color="#8FB87A" />
              <Text className="font-outfit text-[13px] text-white">
                Barcode lookup coming soon — continuing with preview
              </Text>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
};
