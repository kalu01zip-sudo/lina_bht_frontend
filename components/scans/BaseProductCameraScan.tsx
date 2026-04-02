// components/scans/BaseProductCameraScan.tsx
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Text, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
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
}

export const BaseProductCameraScan: React.FC<BaseProductCameraScanProps> = ({
  scanType,
  title = 'Scan product barcode or ingredients',
  subtitle = 'Position the product label within the frame',
  onCapture,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const cameraRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

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

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />

      <View className="absolute inset-0">
        <View className="absolute inset-0 bg-black/50" />

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

        {/* Product Scanning Frame */}
        <View className="flex-1 items-center justify-center">
          <View
            style={{
              width: width * 0.8,
              height: height * 0.25,
              borderWidth: 2,
              borderColor: '#3B82F600',
              borderRadius: 16,
              //   backgroundColor: 'rgba(59, 130, 246, 0.1)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              justifyContent: 'center',
              alignItems: 'center',
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

            <Text className="text-center font-outfit text-sm text-white">
              Position product label here
            </Text>
          </View>
        </View>

        {/* Instruction Text */}
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

        {/* Capture Button - Using PrimaryButton */}
        <View
          style={{
            position: 'absolute',
            bottom: Math.max(insets.bottom + 20, 30),
            left: 20,
            right: 20,
            alignItems: 'center',
          }}>
          <PrimaryButton
            title="Capture Product"
            onPress={takePicture}
            disabled={isTakingPicture}
            isLoading={isTakingPicture}
            loaderColor="#361A0D"
            style={{
              width: '100%',
              //   maxWidth: 280,
            }}
          />
        </View>
      </View>
    </View>
  );
};
