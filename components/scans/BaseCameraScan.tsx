// components/scans/BaseCameraScan.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraCaptureIcon } from '@/components/icons/CameraCaptureIcon';

const { width, height } = Dimensions.get('window');

interface BaseCameraScanProps {
  scanType: string;
  title?: string;
  subtitle?: string;
  onCapture?: (photoUri: string) => void;
}

export const BaseCameraScan: React.FC<BaseCameraScanProps> = ({
  scanType,
  title = 'Position your face within the frame',
  subtitle = 'Ensure good lighting for best results',
  onCapture,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const cameraRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

  // Animation values
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startScanAnimation();
    startPulseAnimation();
    return () => {
      scanLineAnim.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, []);

  const startScanAnimation = () => {
    Animated.loop(
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

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
            },
          });
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        setIsTakingPicture(false);
      }
    }
  };

  const guideWidth = width * 0.75;
  const guideHeight = height * 0.45;
  const cornerSize = 40;
  const lineWidth = 4;

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, guideHeight - lineWidth],
  });

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="front" />

      <View className="absolute inset-0">
        <View className="absolute inset-0 bg-black/50" />

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

        <View className="flex-1 items-center justify-center">
          <Animated.View
            style={{
              width: guideWidth,
              height: guideHeight,
              position: 'relative',
              transform: [{ scale: pulseAnim }],
            }}>
            {/* Corner Brackets */}
            <View
              style={{
                position: 'absolute',
                top: -2,
                left: -2,
                width: cornerSize,
                height: cornerSize,
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: cornerSize,
                  height: lineWidth,
                  backgroundColor: '#E8DDD0',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: lineWidth,
                  height: cornerSize,
                  backgroundColor: '#E8DDD0',
                }}
              />
            </View>

            <View
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: cornerSize,
                height: cornerSize,
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: cornerSize,
                  height: lineWidth,
                  backgroundColor: '#E8DDD0',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: lineWidth,
                  height: cornerSize,
                  backgroundColor: '#E8DDD0',
                }}
              />
            </View>

            <View
              style={{
                position: 'absolute',
                bottom: -2,
                left: -2,
                width: cornerSize,
                height: cornerSize,
              }}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: cornerSize,
                  height: lineWidth,
                  backgroundColor: '#E8DDD0',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: lineWidth,
                  height: cornerSize,
                  backgroundColor: '#E8DDD0',
                }}
              />
            </View>

            <View
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: cornerSize,
                height: cornerSize,
              }}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: cornerSize,
                  height: lineWidth,
                  backgroundColor: '#E8DDD0',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: lineWidth,
                  height: cornerSize,
                  backgroundColor: '#E8DDD0',
                }}
              />
            </View>

            <Animated.View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 3,
                backgroundColor: '#E8DDD0',
                shadowColor: '#E8DDD0',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 10,
                elevation: 5,
                zIndex: 20,
                transform: [{ translateY: translateY }],
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: -10,
                  height: 23,
                  //   backgroundColor: 'rgba(59, 130, 246, 0.3)',
                  backgroundColor: '#361A0D33',
                }}
              />
            </Animated.View>

            <View
              style={{
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                borderWidth: 1,
                borderColor: '#361A0D55',
                zIndex: -2,
                borderRadius: 12,
              }}
            />
          </Animated.View>

          <View
            style={{
              position: 'absolute',
              bottom: 120 + insets.bottom,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}>
            <Text className="mb-2 text-center font-outfitMedium text-base text-white">{title}</Text>
            <Text className="text-center font-outfit text-sm text-white/70">{subtitle}</Text>
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: Math.max(insets.bottom + 20, 30),
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={takePicture}
            activeOpacity={0.7}
            disabled={isTakingPicture}
            style={{ transform: [{ scale: isTakingPicture ? 0.95 : 1 }] }}>
            <CameraCaptureIcon size={80} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
