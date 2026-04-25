// // components/scans/BaseProductCameraScan.tsx
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Text,
//   Dimensions,
//   Vibration,
//   Animated,
// } from 'react-native';
// import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import PrimaryButton from '../buttons/PrimaryButton';
// import { PreScanInstructions } from '@/components/scans/PreScanInstructions';

// import { BarCodeScanningIcon, CameraIcon, SquareFrameIcon, SunIcon } from '../icons';

// const { width, height } = Dimensions.get('window');

// type ScanMode = 'barcode' | 'manual';

// interface BaseProductCameraScanProps {
//   scanType: string;
//   title?: string;
//   subtitle?: string;
//   onCapture?: (photoUri: string) => void;
//   onBarcodeScanned?: (barcodeData: BarcodeScanningResult) => void;
//   enableAutoScan?: boolean;
// }

// export const BaseProductCameraScan: React.FC<BaseProductCameraScanProps> = ({
//   scanType,
//   title = 'Scan product barcode or ingredients',
//   subtitle = 'Position the product label within the frame',
//   onCapture,
//   onBarcodeScanned,
//   enableAutoScan = true,
// }) => {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [isTakingPicture, setIsTakingPicture] = useState(false);
//   const [isScanning, setIsScanning] = useState(true);
//   const [lastScannedCode, setLastScannedCode] = useState<string>('');
//   const [frameHeight, setFrameHeight] = useState(height * 0.25);
//   const [showInstructions, setShowInstructions] = useState(true);
//   const [scanMode, setScanMode] = useState<ScanMode>('barcode');

//   const cameraRef = useRef<any>(null);
//   const insets = useSafeAreaInsets();

//   // Animation values
//   const frameScale = useRef(new Animated.Value(1)).current;
//   const scanLineTranslate = useRef(new Animated.Value(0)).current;

//   const onFrameLayout = (event: any) => {
//     const { height: measuredHeight } = event.nativeEvent.layout;
//     setFrameHeight(measuredHeight);
//   };

//   // Continuous scan line animation
//   useEffect(() => {
//     if (isScanning && enableAutoScan && scanMode === 'barcode' && frameHeight > 0) {
//       const animation = Animated.loop(
//         Animated.sequence([
//           Animated.timing(scanLineTranslate, {
//             toValue: frameHeight,
//             duration: 2000,
//             useNativeDriver: true,
//           }),
//           Animated.timing(scanLineTranslate, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//         ])
//       );
//       animation.start();
//       return () => animation.stop();
//     }
//   }, [isScanning, enableAutoScan, scanMode, frameHeight, scanLineTranslate]);

//   // Handle barcode detection
//   const handleBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
//     if (scanMode !== 'barcode') return;

//     console.log('📷 Barcode detected:', scanningResult.data);

//     if (lastScannedCode === scanningResult.data || !isScanning || !enableAutoScan) {
//       return;
//     }

//     Vibration.vibrate(50);

//     setLastScannedCode(scanningResult.data);
//     setIsScanning(false);

//     if (onBarcodeScanned) {
//       onBarcodeScanned(scanningResult);
//     }

//     setTimeout(() => {
//       router.push({
//         pathname: `/(flow)/${scanType}/loading-screen`,
//         params: {
//           barcode: scanningResult.data,
//           barcodeType: scanningResult.type,
//           scanType: scanType,
//         },
//       });
//     }, 300);
//   };

//   // Handle manual capture
//   const takePicture = async () => {
//     if (cameraRef.current && !isTakingPicture && scanMode === 'manual') {
//       setIsTakingPicture(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync({
//           quality: 0.8,
//           base64: true,
//         });

//         if (onCapture) {
//           onCapture(photo.uri);
//         } else {
//           router.push({
//             pathname: `/(flow)/${scanType}/loading-screen`,
//             params: {
//               imageUri: photo.uri,
//               scanType: scanType,
//               manualCapture: 'true',
//             },
//           });
//         }
//       } catch (error) {
//         console.error('Error taking picture:', error);
//         Alert.alert('Error', 'Failed to capture image. Please try again.');
//       } finally {
//         setIsTakingPicture(false);
//       }
//     }
//   };

//   const resetScanning = () => {
//     setLastScannedCode('');
//     setIsScanning(true);
//   };

//   const productScanSteps = [
//     {
//       id: 'lighting',
//       icon: <SunIcon size={24} color="#F59E0B" />,
//       title: 'Good Lighting',
//       description: 'Ensure the product label is well-lit and readable.',
//     },
//     {
//       id: 'focus',
//       icon: <BarCodeScanningIcon size={24} color="#3B82F6" />,
//       title: 'Focus on Code',
//       description: 'Center the barcode or QR code within the frame for quick detection.',
//     },
//     {
//       id: 'stability',
//       icon: <SquareFrameIcon size={24} color="#7A8B6A" />,
//       title: 'Hold Steady',
//       description: 'Keep the product steady and avoid glare or shadows.',
//     },
//   ];

//   if (showInstructions) {
//     return (
//       <PreScanInstructions
//         onStart={() => setShowInstructions(false)}
//         title="For best results, follow these steps :"
//         headerTitle="Scan Preparation"
//         subTitle="Select what you would like to analyze today. "
//         videoSource={require('@/assets/videos/product_scan_guide.mp4')}
//         instructionSteps={productScanSteps}
//         startButtonTitle="Start Scanning"
//       />
//     );
//   }

//   if (!permission) return <View />;

//   if (!permission.granted) {
//     return (
//       <View className="flex-1 items-center justify-center bg-black">
//         <Text className="mb-4 text-white">We need camera permission to scan</Text>
//         <TouchableOpacity onPress={requestPermission} className="rounded-lg bg-blue-500 px-6 py-3">
//           <Text className="font-semibold text-white">Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Create rounded corner component for cleaner code
//   const RoundedCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
//     const getCornerStyle = () => {
//       switch (position) {
//         case 'tl':
//           return { top: -3, left: -3 };
//         case 'tr':
//           return { top: -3, right: -3 };
//         case 'bl':
//           return { bottom: -3, left: -3 };
//         case 'br':
//           return { bottom: -3, right: -3 };
//       }
//     };

//     const getLineStyles = () => {
//       const isTop = position === 'tl' || position === 'tr';
//       const isLeft = position === 'tl' || position === 'bl';
//       const isRight = position === 'tr' || position === 'br';
//       const isBottom = position === 'bl' || position === 'br';

//       return {
//         horizontal: {
//           position: 'absolute' as const,
//           [isTop ? 'top' : 'bottom']: 0,
//           [isLeft ? 'left' : 'right']: 0,
//           width: 24,
//           height: 3,
//           borderRadius: 3,
//           backgroundColor: '#8FB87A',
//         },
//         vertical: {
//           position: 'absolute' as const,
//           [isTop ? 'top' : 'bottom']: 0,
//           [isLeft ? 'left' : 'right']: 0,
//           width: 3,
//           height: 24,
//           borderRadius: 3,
//           backgroundColor: '#8FB87A',
//         },
//       };
//     };

//     const lineStyles = getLineStyles();

//     return (
//       <View style={[getCornerStyle(), { position: 'absolute', width: 30, height: 30 }]}>
//         <View style={lineStyles.horizontal} />
//         <View style={lineStyles.vertical} />
//       </View>
//     );
//   };

//   return (
//     <View className="flex-1 bg-black">
//       <CameraView
//         ref={cameraRef}
//         style={StyleSheet.absoluteFillObject}
//         facing="back"
//         barcodeScannerSettings={{
//           barcodeTypes:
//             scanMode === 'barcode'
//               ? [
//                   'ean13',
//                   'ean8',
//                   'upc_a',
//                   'upc_e',
//                   'code128',
//                   'code39',
//                   'qr',
//                   'pdf417',
//                   'aztec',
//                   'codabar',
//                   'code93',
//                   'itf14',
//                 ]
//               : [],
//         }}
//         onBarcodeScanned={scanMode === 'barcode' ? handleBarcodeScanned : undefined}
//       />

//       <View className="absolute inset-0">
//         {/* Dark overlay */}
//         {/* <View className="absolute inset-0 bg-black/50" /> */}

//         {/* Mode Switcher */}
//         <View
//           style={{
//             position: 'absolute',
//             top: Math.max(insets.top, 90),
//             left: 20,
//             right: 20,
//             flexDirection: 'row',
//             backgroundColor: 'rgba(0,0,0,0.6)',
//             borderRadius: 30,
//             padding: 4,
//             zIndex: 20,
//           }}>
//           <TouchableOpacity
//             onPress={() => setScanMode('barcode')}
//             style={{
//               flex: 1,
//               paddingVertical: 10,
//               borderRadius: 26,
//               backgroundColor: scanMode === 'barcode' ? '#8FB87A' : 'transparent',
//               alignItems: 'center',
//             }}>
//             <Text
//               className="font-outfitMedium text-[14px]"
//               style={{ color: scanMode === 'barcode' ? '#fff' : 'rgba(255,255,255,0.6)' }}>
//               Scan Barcode/QR
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setScanMode('manual')}
//             style={{
//               flex: 1,
//               paddingVertical: 10,
//               borderRadius: 26,
//               backgroundColor: scanMode === 'manual' ? '#8FB87A' : 'transparent',
//               alignItems: 'center',
//             }}>
//             <Text
//               className="font-outfitMedium text-[14px]"
//               style={{ color: scanMode === 'manual' ? '#fff' : 'rgba(255,255,255,0.6)' }}>
//               Manual Capture
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Scanning Frame - Only show in barcode mode */}
//         {scanMode === 'barcode' && (
//           <View className="flex-1 items-center justify-center">
//             <Animated.View
//               onLayout={onFrameLayout}
//               style={{
//                 width: width * 0.85,
//                 height: height * 0.25,
//                 borderRadius: 0,
//                 // backgroundColor: 'rgba(143, 184, 122, 0.08)',
//                 backgroundColor: 'rgba(59, 130, 246, 0.08)',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 position: 'relative',
//                 transform: [{ scale: frameScale }],
//               }}>
//               {/* Rounded corner accents with fully rounded corners */}
//               <RoundedCorner position="tl" />
//               <RoundedCorner position="tr" />
//               <RoundedCorner position="bl" />
//               <RoundedCorner position="br" />

//               {/* Scan line */}
//               {isScanning && enableAutoScan && (
//                 <Animated.View
//                   style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     height: 2,
//                     backgroundColor: '#8FB87A',
//                     shadowColor: '#8FB87A',
//                     shadowOffset: { width: 0, height: 0 },
//                     shadowOpacity: 1,
//                     shadowRadius: 4,
//                     borderRadius: 2,
//                     transform: [{ translateY: scanLineTranslate }],
//                   }}
//                 />
//               )}

//               <Text className="text-center font-outfit text-sm text-white">
//                 Position barcode or QR code within frame
//               </Text>
//             </Animated.View>
//           </View>
//         )}

//         {/* Manual Capture Frame - Show in manual mode */}
//         {/* {scanMode === 'manual' && (
//           <View className="flex-1 items-center justify-center">
//             <View
//               style={{
//                 width: width * 0.9,
//                 height: height * 0.5,
//                 borderRadius: 24,
//                 borderWidth: 2,
//                 borderColor: '#8FB87A',
//                 backgroundColor: 'rgba(143,184,122,0.1)',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <Ionicons name="camera-outline" size={48} color="#8FB87A" />
//               <Text className="mt-4 text-center font-outfit text-sm text-white">
//                 Frame your product here
//               </Text>
//               <Text className="mt-2 text-center font-outfit text-xs text-white/60">
//                 Ensure good lighting and clear visibility of the product label
//               </Text>
//             </View>
//           </View>
//         )} */}

//         {/* Back Button */}
//         <TouchableOpacity
//           onPress={() => router.back()}
//           style={{
//             position: 'absolute',
//             top: Math.max(insets.top, 16),
//             left: Math.max(insets.left, 16),
//             width: 44,
//             height: 44,
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             borderRadius: 22,
//             zIndex: 10,
//           }}>
//           <Ionicons name="chevron-back" size={24} color="white" />
//         </TouchableOpacity>

//         {/* Instruction Text */}
//         <View
//           style={{
//             position: 'absolute',
//             bottom: 160 + insets.bottom,
//             left: 0,
//             right: 0,
//             alignItems: 'center',
//           }}>
//           <Text className="mb-2 text-center font-outfitMedium text-base text-white">
//             {scanMode === 'barcode'
//               ? enableAutoScan
//                 ? 'Auto-detecting barcode/QR...'
//                 : title
//               : 'Ready to capture product photo'}
//           </Text>
//           <Text className="text-center font-outfit text-sm text-white/70">
//             {scanMode === 'barcode'
//               ? enableAutoScan
//                 ? 'Position the code within the frame for automatic detection'
//                 : subtitle
//               : 'Tap the capture button below to take a photo'}
//           </Text>
//         </View>

//         {/* Capture Button - For manual mode only */}
//         {scanMode === 'manual' && (
//           <View
//             style={{
//               position: 'absolute',
//               bottom: Math.max(insets.bottom + 20, 30),
//               left: 20,
//               right: 20,
//               alignItems: 'center',
//               gap: 12,
//             }}>
//             <PrimaryButton
//               title="Capture Photo"
//               onPress={takePicture}
//               disabled={isTakingPicture}
//               isLoading={isTakingPicture}
//               loaderColor="#361A0D"
//               style={{ width: '100%' }}
//               gradientColors={['#759A52', '#FFFFFF99']}
//               textStyle={{ fontSize: 16, fontWeight: '600' }}
//             />
//           </View>
//         )}

//         {/* Reset button for barcode mode after detection */}
//         {scanMode === 'barcode' && enableAutoScan && !isScanning && (
//           <View
//             style={{
//               position: 'absolute',
//               bottom: Math.max(insets.bottom + 20, 30),
//               left: 20,
//               right: 20,
//               alignItems: 'center',
//             }}>
//             <TouchableOpacity
//               onPress={resetScanning}
//               style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
//               <Text className="text-center font-outfit text-sm text-white/70">
//                 Tap to scan again
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

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

  const cameraRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

  // Animation values
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
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Handle camera switching
  const switchCamera = () => {
    setIsSwitchingCamera(true);
    animateCameraSwitch();
    setCameraFacing((prev) => (prev === 'back' ? 'front' : 'back'));

    // Reset switching state after animation
    setTimeout(() => {
      setIsSwitchingCamera(false);
    }, 500);
  };

  // Continuous scan line animation
  useEffect(() => {
    if (isScanning && enableAutoScan && scanMode === 'barcode' && frameHeight > 0) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineTranslate, {
            toValue: frameHeight,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineTranslate, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isScanning, enableAutoScan, scanMode, frameHeight, scanLineTranslate]);

  // Handle barcode detection
  const handleBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanMode !== 'barcode') return;

    console.log('📷 Barcode detected:', scanningResult.data);

    if (lastScannedCode === scanningResult.data || !isScanning || !enableAutoScan) {
      return;
    }

    Vibration.vibrate(50);

    setLastScannedCode(scanningResult.data);
    setIsScanning(false);

    if (onBarcodeScanned) {
      onBarcodeScanned(scanningResult);
    }

    setTimeout(() => {
      router.push({
        pathname: `/(flow)/${scanType}/loading-screen`,
        params: {
          barcode: scanningResult.data,
          barcodeType: scanningResult.type,
          scanType: scanType,
        },
      });
    }, 300);
  };

  // Handle manual capture
  const takePicture = async () => {
    if (cameraRef.current && !isTakingPicture && scanMode === 'manual') {
      setIsTakingPicture(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });

        if (onCapture) {
          onCapture(photo.uri);
        } else {
          router.push({
            pathname: `/(flow)/${scanType}/loading-screen`,
            params: {
              imageUri: photo.uri,
              scanType: scanType,
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
        subTitle="Select what you would like to analyze today. "
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

  // Create rounded corner component for cleaner code
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

    const getLineStyles = () => {
      const isTop = position === 'tl' || position === 'tr';
      const isLeft = position === 'tl' || position === 'bl';
      const isRight = position === 'tr' || position === 'br';
      const isBottom = position === 'bl' || position === 'br';

      return {
        horizontal: {
          position: 'absolute' as const,
          [isTop ? 'top' : 'bottom']: 0,
          [isLeft ? 'left' : 'right']: 0,
          width: 24,
          height: 3,
          borderRadius: 3,
          backgroundColor: '#8FB87A',
        },
        vertical: {
          position: 'absolute' as const,
          [isTop ? 'top' : 'bottom']: 0,
          [isLeft ? 'left' : 'right']: 0,
          width: 3,
          height: 24,
          borderRadius: 3,
          backgroundColor: '#8FB87A',
        },
      };
    };

    const lineStyles = getLineStyles();

    return (
      <View style={[getCornerStyle(), { position: 'absolute', width: 30, height: 30 }]}>
        <View style={lineStyles.horizontal} />
        <View style={lineStyles.vertical} />
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
        {/* Dark overlay - only show in barcode mode */}
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

        {/* Torch/Flash Button - Optional enhancement */}
        {/* <TouchableOpacity
          onPress={() => {
            // Add torch functionality if needed
            console.log('Toggle flash');
          }}
          style={{
            position: 'absolute',
            top: Math.max(insets.top, 160),
            left: Math.max(insets.left, 16),
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 22,
            zIndex: 20,
          }}>
          <Ionicons name="flash-outline" size={24} color="white" />
        </TouchableOpacity> */}

        {/* Scanning Frame - Only show in barcode mode */}
        {scanMode === 'barcode' && (
          <View className="flex-1 items-center justify-center">
            <Animated.View
              onLayout={onFrameLayout}
              style={{
                width: width * 0.85,
                height: height * 0.25,
                borderRadius: 0,
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                transform: [{ scale: frameScale }],
              }}>
              {/* Rounded corner accents with fully rounded corners */}
              <RoundedCorner position="tl" />
              <RoundedCorner position="tr" />
              <RoundedCorner position="bl" />
              <RoundedCorner position="br" />

              {/* Scan line */}
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

        {/* Auto-detect status indicator for barcode mode */}
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

        {/* Capture Button - For manual mode only */}
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

        {/* Reset button for barcode mode after detection */}
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
      </View>
    </View>
  );
};
