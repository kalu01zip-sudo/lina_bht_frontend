// import React, { useState, useRef } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Text,
//   Dimensions,
//   Vibration,
// } from 'react-native';
// import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import PrimaryButton from '../buttons/PrimaryButton';

// const { width, height } = Dimensions.get('window');

// interface BaseProductCameraScanProps {
//   scanType: string;
//   title?: string;
//   subtitle?: string;
//   onCapture?: (photoUri: string) => void;
//   onBarcodeScanned?: (barcodeData: BarcodeScanningResult) => void;
//   enableAutoScan?: boolean; // New prop to enable/disable auto-scan
// }

// export const BaseProductCameraScan: React.FC<BaseProductCameraScanProps> = ({
//   scanType,
//   title = 'Scan product barcode or ingredients',
//   subtitle = 'Position the product label within the frame',
//   onCapture,
//   onBarcodeScanned,
//   enableAutoScan = true, // Default to true for automatic scanning
// }) => {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [isTakingPicture, setIsTakingPicture] = useState(false);
//   const [isScanning, setIsScanning] = useState(true); // Control whether we're actively scanning
//   const [lastScannedCode, setLastScannedCode] = useState<string>('');
//   const cameraRef = useRef<any>(null);
//   const insets = useSafeAreaInsets();

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

//   // Handle barcode detection
//   const handleBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
//     // Prevent multiple scans of the same barcode
//     if (lastScannedCode === scanningResult.data && isScanning === false) {
//       return;
//     }

//     // Only process if we're still in scanning mode
//     if (isScanning && enableAutoScan) {
//       // Provide haptic feedback for better UX
//       Vibration.vibrate(50);

//       console.log('Barcode detected:', scanningResult);
//       setLastScannedCode(scanningResult.data);
//       setIsScanning(false); // Stop scanning after detection

//       // Call the custom handler if provided
//       if (onBarcodeScanned) {
//         onBarcodeScanned(scanningResult);
//       } else {
//         // Default behavior: Navigate to loading screen with barcode data
//         router.push({
//           pathname: `/(flow)/${scanType}/loading-screen`,
//           params: {
//             barcode: scanningResult.data,
//             barcodeType: scanningResult.type,
//             scanType: scanType,
//           },
//         });
//       }
//     }
//   };

//   const takePicture = async () => {
//     if (cameraRef.current && !isTakingPicture) {
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
//               manualCapture: 'true', // Indicate this was a manual capture
//             },
//           });
//         }
//       } catch (error) {
//         console.error('Error taking picture:', error);
//         Alert.alert('Error', 'Failed to capture image. Please try again.');
//         setIsTakingPicture(false);
//       }
//     }
//   };

//   // Reset scanning state (useful if user wants to try scanning again)
//   const resetScanning = () => {
//     setLastScannedCode('');
//     setIsScanning(true);
//   };

//   return (
//     <View className="flex-1 bg-black">
//       <CameraView
//         ref={cameraRef}
//         style={StyleSheet.absoluteFillObject}
//         facing="back"
//         barcodeScannerSettings={{
//           barcodeTypes: [
//             'ean13', // European Article Number (most common for products)
//             'ean8',
//             'upc_a', // Universal Product Code (US/Canada)
//             'upc_e',
//             'code128', // Used for many retail products
//             'code39',
//             'qr', // QR codes
//             'pdf417',
//             'aztec',
//             'codabar',
//             'code93',
//             'itf14', // Used for packaging
//           ],
//         }}
//         onBarcodeScanned={isScanning && enableAutoScan ? handleBarcodeScanned : undefined}
//       />

//       <View className="absolute inset-0">
//         <View className="absolute inset-0 bg-black/50" />

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

//         {/* Barcode Scanning Frame */}
//         <View className="flex-1 items-center justify-center">
//           <View
//             style={{
//               width: width * 0.85,
//               height: height * 0.2,
//               borderWidth: 2,
//               borderColor: '#3B82F600',
//               borderRadius: 16,
//               backgroundColor: 'rgba(59, 130, 246, 0.1)',
//               justifyContent: 'center',
//               alignItems: 'center',
//               position: 'relative',
//             }}>
//             {/* Corner accents */}
//             <View style={{ position: 'absolute', top: -2, left: -2, width: 30, height: 30 }}>
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: 20,
//                   height: 3,
//                   backgroundColor: '#E8DDD0',
//                 }}
//               />
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: 3,
//                   height: 20,
//                   backgroundColor: '#E8DDD0',
//                 }}
//               />
//             </View>
//             <View style={{ position: 'absolute', top: -2, right: -2, width: 30, height: 30 }}>
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   right: 0,
//                   width: 20,
//                   height: 3,
//                   backgroundColor: '#E8DDD0',
//                 }}
//               />
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   right: 0,
//                   width: 3,
//                   height: 20,
//                   backgroundColor: '#E8DDD0',
//                 }}
//               />
//             </View>
//             <View style={{ position: 'absolute', bottom: -2, left: -2, width: 30, height: 30 }}>
//               <View
//                 style={{
//                   position: 'absolute',
//                   bottom: 0,
//                   left: 0,
//                   width: 20,
//                   height: 3,
//                   backgroundColor: '#E8DDD0',
//                 }}
//               />
//               <View
//                 style={{
//                   position: 'absolute',
//                   bottom: 0,
//                   left: 0,
//                   width: 3,
//                   height: 20,
//                   backgroundColor: '#E8DDD0',
//                 }}
//               />
//             </View>
//             <View style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30 }}>
//               <View
//                 style={{
//                   position: 'absolute',
//                   bottom: 0,
//                   right: 0,
//                   width: 20,
//                   height: 3,
//                   backgroundColor: '#E8DDD0',
//                 }}
//               />
//               <View
//                 style={{
//                   position: 'absolute',
//                   bottom: 0,
//                   right: 0,
//                   width: 3,
//                   height: 20,
//                   backgroundColor: '#E8DDD0',
//                 }}
//               />
//             </View>

//             {/* Animated scanning line (optional) */}
//             {isScanning && enableAutoScan && (
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   height: 2,
//                   backgroundColor: '#E8DDD0',
//                   shadowColor: '#E8DDD0',
//                   shadowOffset: { width: 0, height: 0 },
//                   shadowOpacity: 1,
//                   shadowRadius: 4,
//                   animation: 'scanLine 2s linear infinite',
//                 }}
//               />
//             )}

//             <Text className="text-center font-outfit text-sm text-white">
//               Position barcode within frame
//             </Text>
//           </View>
//         </View>

//         {/* Instruction Text - Updated for barcode scanning */}
//         <View
//           style={{
//             position: 'absolute',
//             bottom: 160 + insets.bottom,
//             left: 0,
//             right: 0,
//             alignItems: 'center',
//           }}>
//           <Text className="mb-2 text-center font-outfitMedium text-base text-white">
//             {enableAutoScan ? 'Auto-detecting barcode...' : title}
//           </Text>
//           <Text className="text-center font-outfit text-sm text-white/70">
//             {enableAutoScan
//               ? 'Position the barcode in the frame for automatic detection'
//               : subtitle}
//           </Text>

//           {/* Show scanning status */}
//           {enableAutoScan && !isScanning && (
//             <View className="mt-4 flex-row items-center rounded-full bg-green-500/20 px-4 py-2">
//               <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
//               <Text className="ml-2 text-white">Barcode detected! Processing...</Text>
//             </View>
//           )}
//         </View>

//         {/* Capture Button - Optional when auto-scan is enabled */}
//         <View
//           style={{
//             position: 'absolute',
//             bottom: Math.max(insets.bottom + 20, 30),
//             left: 20,
//             right: 20,
//             alignItems: 'center',
//             gap: 12,
//           }}>
//           <PrimaryButton
//             title={enableAutoScan ? 'Manual Capture (if barcode fails)' : 'Capture Product'}
//             onPress={takePicture}
//             disabled={isTakingPicture}
//             isLoading={isTakingPicture}
//             loaderColor="#361A0D"
//             style={{
//               width: '100%',
//             }}
//           />

//           {/* Reset button for when scanning stops */}
//           {enableAutoScan && !isScanning && (
//             <TouchableOpacity
//               onPress={resetScanning}
//               style={{
//                 paddingVertical: 8,
//                 paddingHorizontal: 16,
//               }}>
//               <Text className="text-center font-outfit text-sm text-white/70">
//                 Tap to scan again
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

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
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../buttons/PrimaryButton';

const { width, height } = Dimensions.get('window');

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
  // ✅ ALL HOOKS MUST BE CALLED FIRST - before any conditional returns
  const [permission, requestPermission] = useCameraPermissions();
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');
  const [barcodeBounds, setBarcodeBounds] = useState<any>(null);
  const [showDynamicFrame, setShowDynamicFrame] = useState(false);
  const [frameHeight, setFrameHeight] = useState(height * 0.2); // Store frame height

  const cameraRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

  // Animation values
  const frameScale = useRef(new Animated.Value(1)).current;
  const scanLineTranslate = useRef(new Animated.Value(0)).current;

  // Measure the actual frame height on layout
  const onFrameLayout = (event: any) => {
    const { height: measuredHeight } = event.nativeEvent.layout;
    setFrameHeight(measuredHeight);
  };

  // Continuous scan line animation
  useEffect(() => {
    if (isScanning && enableAutoScan && frameHeight > 0) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineTranslate, {
            toValue: frameHeight, // Use actual frame height
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
  }, [isScanning, enableAutoScan, frameHeight, scanLineTranslate]);

  // Handle barcode detection with dynamic positioning
  const handleBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (lastScannedCode === scanningResult.data || !isScanning || !enableAutoScan) {
      return;
    }

    // Get barcode position from the scan result
    if (scanningResult.bounds) {
      setBarcodeBounds(scanningResult.bounds);
      setShowDynamicFrame(true);
    }

    Vibration.vibrate(50);
    console.log('Barcode detected:', scanningResult);
    console.log('Barcode position:', scanningResult.bounds);

    setLastScannedCode(scanningResult.data);
    setIsScanning(false);

    // Slight delay to show the detection animation
    setTimeout(() => {
      if (onBarcodeScanned) {
        onBarcodeScanned(scanningResult);
      } else {
        router.push({
          pathname: `/(flow)/${scanType}/loading-screen`,
          params: {
            barcode: scanningResult.data,
            barcodeType: scanningResult.type,
            scanType: scanType,
          },
        });
      }
    }, 300);
  };

  const takePicture = async () => {
    if (cameraRef.current && !isTakingPicture) {
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
    setShowDynamicFrame(false);
    setBarcodeBounds(null);
  };

  // Calculate dynamic frame styles based on barcode position
  const getDynamicFrameStyle = () => {
    if (!barcodeBounds) return {};

    const frameWidth = barcodeBounds.size.width;
    const frameHeight = barcodeBounds.size.height;
    const left = barcodeBounds.origin.x;
    const top = barcodeBounds.origin.y;

    return {
      position: 'absolute' as const,
      left: left - 10,
      top: top - 10,
      width: frameWidth + 20,
      height: frameHeight + 20,
      borderWidth: 2,
      borderColor: '#8FB87A',
      borderRadius: 8,
      backgroundColor: 'rgba(143, 184, 122, 0.15)',
    };
  };

  // ✅ NOW we can do conditional returns AFTER all hooks
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

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: [
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
          ],
        }}
        onBarcodeScanned={isScanning && enableAutoScan ? handleBarcodeScanned : undefined}
      />

      <View className="absolute inset-0">
        {/* Dark overlay */}
        <View className="absolute inset-0 bg-black/50" />

        {/* Barcode Scanning Frame - Static */}
        {!showDynamicFrame && (
          <View className="flex-1 items-center justify-center">
            <Animated.View
              onLayout={onFrameLayout}
              style={{
                width: width * 0.85,
                height: height * 0.2,
                borderWidth: 2,
                borderColor: '#3B82F600',
                borderRadius: 16,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                transform: [{ scale: frameScale }],
              }}>
              {/* Corner accents */}
              <View style={{ position: 'absolute', top: -2, left: -2, width: 30, height: 30 }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 20,
                    height: 3,
                    backgroundColor: '#E8DDD0',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 3,
                    height: 20,
                    backgroundColor: '#E8DDD0',
                  }}
                />
              </View>
              <View style={{ position: 'absolute', top: -2, right: -2, width: 30, height: 30 }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 20,
                    height: 3,
                    backgroundColor: '#E8DDD0',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 3,
                    height: 20,
                    backgroundColor: '#E8DDD0',
                  }}
                />
              </View>
              <View style={{ position: 'absolute', bottom: -2, left: -2, width: 30, height: 30 }}>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 20,
                    height: 3,
                    backgroundColor: '#E8DDD0',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 3,
                    height: 20,
                    backgroundColor: '#E8DDD0',
                  }}
                />
              </View>
              <View style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30 }}>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 20,
                    height: 3,
                    backgroundColor: '#E8DDD0',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 3,
                    height: 20,
                    backgroundColor: '#E8DDD0',
                  }}
                />
              </View>

              {/* Static scan line - now properly constrained within frame */}
              {isScanning && enableAutoScan && (
                <Animated.View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: '#E8DDD0',
                    shadowColor: '#E8DDD0',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    transform: [{ translateY: scanLineTranslate }],
                  }}
                />
              )}

              <Text className="text-center font-outfit text-sm text-white">
                Position barcode within frame
              </Text>
            </Animated.View>
          </View>
        )}

        {/* Dynamic Frame - Follows the detected barcode */}
        {showDynamicFrame && barcodeBounds && (
          <Animated.View
            style={[
              getDynamicFrameStyle(),
              {
                transform: [{ scale: frameScale }],
              },
            ]}>
            {/* Dynamic corner accents */}
            <View style={{ position: 'absolute', top: -2, left: -2, width: 20, height: 20 }}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 15,
                  height: 2,
                  backgroundColor: '#8FB87A',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 2,
                  height: 15,
                  backgroundColor: '#8FB87A',
                }}
              />
            </View>
            <View style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20 }}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 15,
                  height: 2,
                  backgroundColor: '#8FB87A',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 2,
                  height: 15,
                  backgroundColor: '#8FB87A',
                }}
              />
            </View>
            <View style={{ position: 'absolute', bottom: -2, left: -2, width: 20, height: 20 }}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 15,
                  height: 2,
                  backgroundColor: '#8FB87A',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 2,
                  height: 15,
                  backgroundColor: '#8FB87A',
                }}
              />
            </View>
            <View style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20 }}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 15,
                  height: 2,
                  backgroundColor: '#8FB87A',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 2,
                  height: 15,
                  backgroundColor: '#8FB87A',
                }}
              />
            </View>
          </Animated.View>
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
            {enableAutoScan ? 'Auto-detecting barcode...' : title}
          </Text>
          <Text className="text-center font-outfit text-sm text-white/70">
            {enableAutoScan ? 'Frame will automatically adjust to the barcode' : subtitle}
          </Text>

          {enableAutoScan && !isScanning && (
            <View className="mt-4 flex-row items-center rounded-full bg-green-500/20 px-4 py-2">
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text className="ml-2 text-white">Barcode detected! Processing...</Text>
            </View>
          )}
        </View>

        {/* Capture Button */}
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
            title={enableAutoScan ? 'Manual Capture (if barcode fails)' : 'Capture Product'}
            onPress={takePicture}
            disabled={isTakingPicture}
            isLoading={isTakingPicture}
            loaderColor="#361A0D"
            style={{ width: '100%' }}
            textStyle={{ fontSize: 16, fontWeight: '600' }}
          />

          {enableAutoScan && !isScanning && (
            <TouchableOpacity
              onPress={resetScanning}
              style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
              <Text className="text-center font-outfit text-sm text-white/70">
                Tap to scan again
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
