// app/(flow)/product-scan/loading-screen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraIcon } from '@/components/icons';

export default function ProductLoadingScreen() {
    const { imageUri, scanType } = useLocalSearchParams();

    const outerRingAnim = useRef(new Animated.Value(0)).current;
    const middleRingAnim = useRef(new Animated.Value(0)).current;
    const innerRingAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startLoadingAnimation();

        const timer = setTimeout(() => {
            router.replace({
                // pathname: '/(flow)/product-scan/analysis-complete',
                pathname: '/(flow)/product-scan/analysis-compatibility-check',
                params: {
                    imageUri: imageUri || '',
                    scanType: scanType || ''
                }
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const startLoadingAnimation = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        Animated.loop(
            Animated.timing(outerRingAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.timing(middleRingAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.timing(innerRingAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
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

    return (
        <SafeAreaView edges={[]} className="flex-1 bg-backgroundColor">
            <Animated.View
                className="flex-1 items-center justify-center"
                style={{ opacity: fadeAnim }}>

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
                    <Text
                        className="text-[24px] font-outfitMedium"
                        style={{ color: '#2E2117' }}>
                        AI Analyzing Product
                    </Text>
                    <Text
                        className="font-outfit text-[14px] text-center px-8 mt-2"
                        style={{ color: '#2E2117CC' }}>
                        Analyzing ingredients, checking compatibility, and finding matches...
                    </Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}