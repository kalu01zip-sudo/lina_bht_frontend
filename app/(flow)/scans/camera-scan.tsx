// // app/(main)/scan/camera-scan.tsx (Fully safe version)
// import React, { useState, useRef } from 'react';
// import { View, TouchableOpacity, StyleSheet, Alert, Text, Dimensions, Platform } from 'react-native';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { CameraCaptureIcon } from '@/components/icons/CameraCaptureIcon';

// const { width, height } = Dimensions.get('window');

// interface CameraScanProps {
//     scanType: string;
// }

// export default function CameraScan({ scanType }: CameraScanProps) {
//     const [permission, requestPermission] = useCameraPermissions();
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [isTakingPicture, setIsTakingPicture] = useState(false);
//     const cameraRef = useRef<any>(null);
//     const insets = useSafeAreaInsets();

//     if (!permission) {
//         return <View />;
//     }

//     if (!permission.granted) {
//         return (
//             <View className="flex-1 items-center justify-center bg-black">
//                 <Text className="text-white mb-4">We need camera permission to scan</Text>
//                 <TouchableOpacity
//                     onPress={requestPermission}
//                     className="bg-blue-500 px-6 py-3 rounded-lg">
//                     <Text className="text-white font-semibold">Grant Permission</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     const takePicture = async () => {
//         if (cameraRef.current && !isTakingPicture) {
//             setIsTakingPicture(true);
//             try {
//                 const photo = await cameraRef.current.takePictureAsync({
//                     quality: 0.8,
//                     base64: true,
//                 });
//                 setCapturedPhoto(photo.uri);

//                 router.push({
//                     pathname: '/(flow)/scans/loading-screen',
//                     params: {
//                         imageUri: photo.uri,
//                         scanType: scanType
//                     }
//                 });
//             } catch (error) {
//                 console.error('Error taking picture:', error);
//                 Alert.alert('Error', 'Failed to capture image. Please try again.');
//                 setIsTakingPicture(false);
//             }
//         }
//     };

//     // Calculate guide size
//     const guideSize = width * 0.7;
//     const cornerSize = 40;
//     const lineWidth = 4;

//     return (
//         <View className="flex-1 bg-black">
//             <CameraView
//                 ref={cameraRef}
//                 style={StyleSheet.absoluteFillObject}
//                 facing="front"
//             />

//             {/* Use View instead of SafeAreaView for absolute positioning */}
//             <View className="absolute inset-0">
//                 {/* Back Button - Dynamically positioned based on safe area */}
//                 <TouchableOpacity
//                     onPress={() => router.back()}
//                     style={{
//                         position: 'absolute',
//                         top: Math.max(insets.top, 16),
//                         left: Math.max(insets.left, 16),
//                         width: 44,
//                         height: 44,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         backgroundColor: 'rgba(0,0,0,0.5)',
//                         borderRadius: 22,
//                         zIndex: 10,
//                     }}>
//                     <Ionicons name="chevron-back" size={24} color="white" />
//                 </TouchableOpacity>

//                 {/* Face Framing Guide with Corner Brackets */}
//                 <View className="flex-1 items-center justify-center">
//                     <View
//                         style={{
//                             width: guideSize,
//                             height: guideSize,
//                             position: 'relative',
//                         }}>
//                         {/* Top Left Corner - L shape */}
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 width: cornerSize,
//                                 height: cornerSize,
//                             }}>
//                             <View style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 width: cornerSize,
//                                 height: lineWidth,
//                                 backgroundColor: 'white'
//                             }} />
//                             <View style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 width: lineWidth,
//                                 height: cornerSize,
//                                 backgroundColor: 'white'
//                             }} />
//                         </View>

//                         {/* Top Right Corner */}
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 right: 0,
//                                 width: cornerSize,
//                                 height: cornerSize,
//                             }}>
//                             <View style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 right: 0,
//                                 width: cornerSize,
//                                 height: lineWidth,
//                                 backgroundColor: 'white'
//                             }} />
//                             <View style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 right: 0,
//                                 width: lineWidth,
//                                 height: cornerSize,
//                                 backgroundColor: 'white'
//                             }} />
//                         </View>

//                         {/* Bottom Left Corner */}
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 left: 0,
//                                 width: cornerSize,
//                                 height: cornerSize,
//                             }}>
//                             <View style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 left: 0,
//                                 width: cornerSize,
//                                 height: lineWidth,
//                                 backgroundColor: 'white'
//                             }} />
//                             <View style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 left: 0,
//                                 width: lineWidth,
//                                 height: cornerSize,
//                                 backgroundColor: 'white'
//                             }} />
//                         </View>

//                         {/* Bottom Right Corner */}
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 right: 0,
//                                 width: cornerSize,
//                                 height: cornerSize,
//                             }}>
//                             <View style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 right: 0,
//                                 width: cornerSize,
//                                 height: lineWidth,
//                                 backgroundColor: 'white'
//                             }} />
//                             <View style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 right: 0,
//                                 width: lineWidth,
//                                 height: cornerSize,
//                                 backgroundColor: 'white'
//                             }} />
//                         </View>
//                     </View>

//                     {/* Instruction Text */}
//                     <View
//                         style={{
//                             position: 'absolute',
//                             bottom: 120 + insets.bottom,
//                             left: 0,
//                             right: 0,
//                             alignItems: 'center',
//                         }}>
//                         <Text className="text-white text-center text-base font-outfitMedium mb-2">
//                             Position your face within the frame
//                         </Text>
//                         <Text className="text-white/70 text-center font-outfit text-sm">
//                             Ensure good lighting for best results
//                         </Text>
//                     </View>
//                 </View>

//                 {/* Capture Button - Dynamically positioned with safe area */}
//                 <View
//                     style={{
//                         position: 'absolute',
//                         bottom: Math.max(insets.bottom + 20, 30),
//                         left: 0,
//                         right: 0,
//                         alignItems: 'center',
//                     }}>
//                     <TouchableOpacity
//                         onPress={takePicture}
//                         activeOpacity={0.7}
//                         disabled={isTakingPicture}
//                         style={{
//                             transform: [{ scale: isTakingPicture ? 0.95 : 1 }],
//                         }}>
//                         <CameraCaptureIcon size={80} />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     );
// }

// // app/(main)/scan/camera-scan.tsx (Fixed animation)
// import React, { useState, useRef, useEffect } from 'react';
// import { View, TouchableOpacity, StyleSheet, Alert, Text, Dimensions, Animated, Easing } from 'react-native';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { CameraCaptureIcon } from '@/components/icons/CameraCaptureIcon';

// const { width, height } = Dimensions.get('window');

// interface CameraScanProps {
//     scanType: string;
// }

// export default function CameraScan({ scanType }: CameraScanProps) {
//     const [permission, requestPermission] = useCameraPermissions();
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [isTakingPicture, setIsTakingPicture] = useState(false);
//     const cameraRef = useRef<any>(null);
//     const insets = useSafeAreaInsets();

//     // Animation values
//     const scanLineAnim = useRef(new Animated.Value(0)).current;
//     const pulseAnim = useRef(new Animated.Value(1)).current;

//     useEffect(() => {
//         // Start scanning animation loop
//         startScanAnimation();
//         startPulseAnimation();
//     }, []);

//     const startScanAnimation = () => {
//         // Continuous loop from top to bottom
//         Animated.loop(
//             Animated.timing(scanLineAnim, {
//                 toValue: 1,
//                 duration: 3000,
//                 easing: Easing.linear,
//                 useNativeDriver: true,
//             })
//         ).start();
//     };

//     const startPulseAnimation = () => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(pulseAnim, {
//                     toValue: 1.02,
//                     duration: 1500,
//                     easing: Easing.ease,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(pulseAnim, {
//                     toValue: 1,
//                     duration: 1500,
//                     easing: Easing.ease,
//                     useNativeDriver: true,
//                 }),
//             ])
//         ).start();
//     };

//     if (!permission) {
//         return <View />;
//     }

//     if (!permission.granted) {
//         return (
//             <View className="flex-1 items-center justify-center bg-black">
//                 <Text className="text-white mb-4">We need camera permission to scan</Text>
//                 <TouchableOpacity
//                     onPress={requestPermission}
//                     className="bg-blue-500 px-6 py-3 rounded-lg">
//                     <Text className="text-white font-semibold">Grant Permission</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     const takePicture = async () => {
//         if (cameraRef.current && !isTakingPicture) {
//             setIsTakingPicture(true);
//             try {
//                 const photo = await cameraRef.current.takePictureAsync({
//                     quality: 0.8,
//                     base64: true,
//                 });
//                 setCapturedPhoto(photo.uri);

//                 router.push({
//                     pathname: '/(flow)/scans/loading-screen',
//                     params: {
//                         imageUri: photo.uri,
//                         scanType: scanType
//                     }
//                 });
//             } catch (error) {
//                 console.error('Error taking picture:', error);
//                 Alert.alert('Error', 'Failed to capture image. Please try again.');
//                 setIsTakingPicture(false);
//             }
//         }
//     };

//     // Calculate guide size - make it taller for face scanning
//     const guideWidth = width * 0.75;
//     const guideHeight = height * 0.45; // Taller frame for face
//     const cornerSize = 40;
//     const lineWidth = 4;

//     // Calculate translateY for scan line (from 0 to guideHeight)
//     const translateY = scanLineAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, guideHeight - lineWidth],
//     });

//     return (
//         <View className="flex-1 bg-black">
//             <CameraView
//                 ref={cameraRef}
//                 style={StyleSheet.absoluteFillObject}
//                 facing="front"
//             />

//             {/* Overlay View */}
//             <View className="absolute inset-0">
//                 {/* Semi-transparent overlay */}
//                 <View className="absolute inset-0 bg-black/50" />

//                 {/* Back Button */}
//                 <TouchableOpacity
//                     onPress={() => router.back()}
//                     style={{
//                         position: 'absolute',
//                         top: Math.max(insets.top, 16),
//                         left: Math.max(insets.left, 16),
//                         width: 44,
//                         height: 44,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         backgroundColor: 'rgba(0,0,0,0.5)',
//                         borderRadius: 22,
//                         zIndex: 10,
//                     }}>
//                     <Ionicons name="chevron-back" size={24} color="white" />
//                 </TouchableOpacity>

//                 {/* Face Framing Guide with Scanning Animation */}
//                 <View className="flex-1 items-center justify-center">
//                     {/* Outer frame container */}
//                     <Animated.View
//                         style={{
//                             width: guideWidth,
//                             height: guideHeight,
//                             position: 'relative',
//                             transform: [{ scale: pulseAnim }],
//                         }}>

//                         {/* Corner Brackets - Top Left */}
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 top: -2,
//                                 left: -2,
//                                 width: cornerSize,
//                                 height: cornerSize,
//                             }}>
//                             <View style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 width: cornerSize,
//                                 height: lineWidth,
//                                 backgroundColor: '#3B82F6',
//                             }} />
//                             <View style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 width: lineWidth,
//                                 height: cornerSize,
//                                 backgroundColor: '#3B82F6',
//                             }} />
//                         </View>

//                         {/* Top Right Corner */}
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 top: -2,
//                                 right: -2,
//                                 width: cornerSize,
//                                 height: cornerSize,
//                             }}>
//                             <View style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 right: 0,
//                                 width: cornerSize,
//                                 height: lineWidth,
//                                 backgroundColor: '#3B82F6',
//                             }} />
//                             <View style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 right: 0,
//                                 width: lineWidth,
//                                 height: cornerSize,
//                                 backgroundColor: '#3B82F6',
//                             }} />
//                         </View>

//                         {/* Bottom Left Corner */}
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 bottom: -2,
//                                 left: -2,
//                                 width: cornerSize,
//                                 height: cornerSize,
//                             }}>
//                             <View style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 left: 0,
//                                 width: cornerSize,
//                                 height: lineWidth,
//                                 backgroundColor: '#3B82F6',
//                             }} />
//                             <View style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 left: 0,
//                                 width: lineWidth,
//                                 height: cornerSize,
//                                 backgroundColor: '#3B82F6',
//                             }} />
//                         </View>

//                         {/* Bottom Right Corner */}
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 bottom: -2,
//                                 right: -2,
//                                 width: cornerSize,
//                                 height: cornerSize,
//                             }}>
//                             <View style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 right: 0,
//                                 width: cornerSize,
//                                 height: lineWidth,
//                                 backgroundColor: '#3B82F6',
//                             }} />
//                             <View style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 right: 0,
//                                 width: lineWidth,
//                                 height: cornerSize,
//                                 backgroundColor: '#3B82F6',
//                             }} />
//                         </View>

//                         {/* Scanning Line - Using transform translateY instead of top */}
//                         <Animated.View
//                             style={{
//                                 position: 'absolute',
//                                 left: 0,
//                                 right: 0,
//                                 height: 3,
//                                 backgroundColor: '#3B82F6',
//                                 shadowColor: '#3B82F6',
//                                 shadowOffset: { width: 0, height: 0 },
//                                 shadowOpacity: 1,
//                                 shadowRadius: 10,
//                                 elevation: 5,
//                                 zIndex: 20,
//                                 transform: [{ translateY: translateY }],
//                             }}>
//                             {/* Glow effect */}
//                             <View
//                                 style={{
//                                     position: 'absolute',
//                                     left: 0,
//                                     right: 0,
//                                     top: -10,
//                                     height: 23,
//                                     backgroundColor: 'rgba(59, 130, 246, 0.3)',
//                                 }}
//                             />
//                         </Animated.View>

//                         {/* Border outline */}
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 top: -2,
//                                 left: -2,
//                                 right: -2,
//                                 bottom: -2,
//                                 borderWidth: 1,
//                                 borderColor: 'rgba(59, 130, 246, 0.5)',
//                                 borderRadius: 12,
//                             }}
//                         />
//                     </Animated.View>

//                     {/* Instruction Text */}
//                     <View
//                         style={{
//                             position: 'absolute',
//                             bottom: 120 + insets.bottom,
//                             left: 0,
//                             right: 0,
//                             alignItems: 'center',
//                         }}>
//                         <Text className="text-white text-center text-base font-outfitMedium mb-2">
//                             Position your face within the frame
//                         </Text>
//                         <Text className="text-white/70 text-center font-outfit text-sm">
//                             Scanning in progress...
//                         </Text>
//                     </View>
//                 </View>

//                 {/* Capture Button */}
//                 <View
//                     style={{
//                         position: 'absolute',
//                         bottom: Math.max(insets.bottom + 20, 30),
//                         left: 0,
//                         right: 0,
//                         alignItems: 'center',
//                     }}>
//                     <TouchableOpacity
//                         onPress={takePicture}
//                         activeOpacity={0.7}
//                         disabled={isTakingPicture}
//                         style={{
//                             transform: [{ scale: isTakingPicture ? 0.95 : 1 }],
//                         }}>
//                         <CameraCaptureIcon size={80} />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     );
// }
