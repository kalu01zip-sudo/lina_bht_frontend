/* eslint-disable import/no-unresolved */
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PillowBadge from '@/components/buttons/PillowBadge';
import { Avatar } from '@/components/ui/Avatar';
import {
  ArrowRightHalfIcon,
  DesignInFlameIcon,
  GearIcon,
  LogOutIcon,
  SupportIcon,
  WaveInHeartIcon,
} from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'expo-router';
import { CircularIconButton } from '@/components/buttons/CircularIconButton';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { showSuccess, showError } = useToast();

  // State for user data
  const [userName, setUserName] = useState('Elena Rossi');
  const [userEmail, setUserEmail] = useState('testuser@skinsense.com');
  const [userAvatar, setUserAvatar] = useState('https://randomuser.me/api/portraits/women/64.jpg');

  // Screen ready state
  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  // Load user data from AsyncStorage
  // useEffect(() => {
  //   const loadUserData = async () => {
  //     try {
  //       // You can load user data from AsyncStorage or your auth context
  //       const name = await AsyncStorage.getItem('user_name');
  //       const email = await AsyncStorage.getItem('user_email');
  //       const avatar = await AsyncStorage.getItem('user_avatar');

  //       if (name) setUserName(name);
  //       if (email) setUserEmail(email);
  //       if (avatar) setUserAvatar(avatar);
  //     } catch (error) {
  //       console.error('Error loading user data:', error);
  //     }
  //   };

  //   loadUserData();
  // }, []);

  // 1. MOCK DATA OBJECT (Simulates a Backend API Response)
  const USER_PROFILE_DATA = [
    { id: '1', label: 'Skin Type', value: 'Combination' },
    { id: '2', label: 'Skin Concerns', value: 'Redness, Occasional Breakouts, Uneven Texture' },
    { id: '3', label: 'Hair Type', value: 'Fine' },
    { id: '4', label: 'Allergies', value: 'Fragrance, Sulfates' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('You have been logged out successfully');
    } catch (error) {
      showError('Failed to log out. Please try again.');
    }
  };

  const handleRetry = () => {
    router.replace('/(main)/profile');
  };

  // Show loading while screen is rendering
  if (isRendering) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading your profile..." />
      </SafeAreaView>
    );
  }

  // Show error if rendering failed
  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Profile" height={50} backButton={true} />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader
        title="Profile"
        height={50}
        backButton={true}
        rightIcon={
          <CircularIconButton
            size={40}
            icon={<GearIcon size={20} color="#361A0D" />}
            onPress={() => {
              router.push('/(flow)/settings');
            }}
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 10,
          flexGrow: 1,
        }}
        className="flex-1">
        <View
          className="px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          {/* Personal status Card */}
          <BorderlessShadowCard
            style={{
              paddingVertical: 24,
              paddingHorizontal: 24,
              alignItems: 'center',
            }}>
            <View className="flex-1 flex-row items-center gap-3">
              {/* Avatar Component */}
              <Avatar
                source={userAvatar}
                size={51}
                fallbackIcon="person-circle"
                iconColor="#361A0D"
                backgroundColor="#E5E0D8"
              />

              <View className="flex-1">
                <View className="w-full flex-row items-center justify-between">
                  <Text
                    className="flex-1 font-outfitMedium text-[24px]"
                    style={{ color: '#2A2118' }}>
                    {userName}
                  </Text>
                  <PillowBadge title="Free Plan" />
                </View>
                <Text
                  numberOfLines={1}
                  className="font-primous text-[16px]"
                  style={{ color: '#2A2118CC' }}>
                  {userEmail}
                </Text>
              </View>
            </View>
          </BorderlessShadowCard>

          <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={24}
            b_br={24}
            style={{ padding: 24, marginTop: 12 }}>
            <Text className="mb-5 font-outfitMedium text-[16px]" style={{ color: '#361A0D' }}>
              Skin & Hair Profile
            </Text>

            {/* 2. DYNAMIC LOOP */}
            {USER_PROFILE_DATA.map((item, index) => (
              <View key={item.id}>
                <View className="flex-row items-start justify-between">
                  <Text className="font-outfitMedium text-[14px]" style={{ color: '#361A0D' }}>
                    {item.label}:
                  </Text>
                  <Text
                    className="ml-4 flex-1 font-outfit text-[12px]"
                    style={{ color: '#2E2117', textAlign: 'right' }}>
                    {item.value}
                  </Text>
                </View>

                {/* Render divider only if it's NOT the last item */}
                {index < USER_PROFILE_DATA.length - 1 && (
                  <View className="my-2 h-[1px] w-full bg-[#dec8b3]" />
                )}
              </View>
            ))}

            {/* 3. PREMIUM SECTION */}
            <View className="mt-8">
              <Text className="font-outfitMedium text-[16px]" style={{ color: '#361A0D' }}>
                Unlock Premium
              </Text>
              <Text className="mt-[6px] font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
                Get advanced AI analysis, unlimited product scans, and priority support.
              </Text>

              <PrimaryButton
                title="Upgrade"
                height={48}
                style={{ marginTop: 16 }}
                textStyle={{ fontSize: 16 }}
                onPress={() => router.push('/(flow)/profile/asking-upgrage-to-premium-screen')}
              />
            </View>
          </BorderlessShadowCard>

          {/* Premium Upgrade Card */}
          {/* <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={24}
            b_br={24}
            style={{
              paddingVertical: 24,
              paddingHorizontal: 24,
              marginTop: 12,
            }}>
            <Text className="font-outfitMedium text-[16px]" style={{ color: '#361A0D' }}>
              Unlock Premium
            </Text>
            <Text className="mt-[6px] font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
              Get advanced AI analysis, unlimited product scans, and priority support.
            </Text>
            <PrimaryButton
              title="Upgrade"
              height={48}
              style={{ marginTop: 10 }}
              textStyle={{ fontSize: 16 }}
              onPress={() => {
                router.push('/(flow)/profile/asking-upgrage-to-premium-screen');
              }}
            />
          </BorderlessShadowCard> */}

          {/* Features Section */}
          <View className="mt-3">
            <View>
              <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
                Feature
              </Text>

              {/* AI Assistant */}
              <BorderlessShadowCard
                onPress={() => {
                  router.push('/(flow)/ai-assistant');
                }}
                b_tl={24}
                b_tr={24}
                b_bl={24}
                b_br={24}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  marginTop: 8,
                }}>
                <View className="flex-row items-center">
                  <View className="flex-1 flex-row items-center gap-3">
                    <Image
                      source={require('@/assets/images/ai_floating_logo.png')}
                      style={{ width: 16, height: 19 }}
                      resizeMode="contain"
                    />

                    <Text className="font-outfit text-[14px]" style={{ color: '#361A0D' }}>
                      AI Assistant
                    </Text>
                  </View>

                  <ArrowRightHalfIcon size={16} color="#361A0D" />
                </View>
              </BorderlessShadowCard>

              {/* Wellness & Cycle */}
              {/* <BorderlessShadowCard
                onPress={() => {
                  router.push('/(flow)/wellness');
                }}
                b_tl={0}
                b_tr={0}
                b_bl={0}
                b_br={0}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  marginTop: 12,
                }}>
                <View className="flex-row items-center">
                  <View className="flex-1 flex-row items-center gap-3">
                    <WaveInHeartIcon size={20} color="#361A0D" />
                    <Text className="font-outfit text-[14px]" style={{ color: '#361A0D' }}>
                      Wellness & Cycle
                    </Text>
                  </View>
                  <ArrowRightHalfIcon size={16} color="#361A0D" />
                </View>
              </BorderlessShadowCard> */}
            </View>
          </View>

          {/* Account Section */}
          <View>
            <Text className="mt-3 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              Account
            </Text>

            <BorderlessShadowCard
              onPress={() => {
                router.push('/(flow)/profile/premium-plan-screen');
              }}
              b_tl={24}
              b_tr={24}
              b_bl={24}
              b_br={24}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginTop: 8,
              }}>
              <View className="flex-row items-center">
                <View className="flex-1 flex-row items-center gap-3">
                  <WaveInHeartIcon size={20} color="#361A0D" />
                  <Text className="font-outfit text-[14px]" style={{ color: '#361A0D' }}>
                    Subscription & Billing
                  </Text>
                </View>
                <ArrowRightHalfIcon size={16} color="#361A0D" />
              </View>
            </BorderlessShadowCard>
          </View>

          {/* Legal & Support Section */}
          <View>
            <Text className="mt-3 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              Legal & Support
            </Text>
            {/* support */}
            <BorderlessShadowCard
              onPress={() => {
                router.push('/(flow)/support');
              }}
              b_tl={24}
              b_tr={24}
              b_bl={0}
              b_br={0}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginTop: 8,
              }}>
              <View className="flex-row items-center">
                <View className="flex-1 flex-row items-center gap-3">
                  <SupportIcon size={20} color="#361A0D" />
                  <Text className="font-outfit text-[14px]" style={{ color: '#361A0D' }}>
                    Support
                  </Text>
                </View>
                <ArrowRightHalfIcon size={16} color="#361A0D" />
              </View>
            </BorderlessShadowCard>

            {/* privacy and terms */}
            <BorderlessShadowCard
              onPress={() => {
                router.push('/(flow)/privacy-and-terms');
              }}
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginTop: 8,
              }}>
              <View className="flex-row items-center">
                <View className="flex-1 flex-row items-center gap-3">
                  <WaveInHeartIcon size={20} color="#361A0D" />
                  <Text className="font-outfit text-[14px]" style={{ color: '#361A0D' }}>
                    Privacy & Terms
                  </Text>
                </View>
                <ArrowRightHalfIcon size={16} color="#361A0D" />
              </View>
            </BorderlessShadowCard>
          </View>

          {/* Log Out Button */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.6}
            className="mt-8 w-full flex-row justify-center gap-3">
            <LogOutIcon size={18} color="#2E2117" />
            <Text
              className="text-center font-outfitMedium text-[14px]"
              style={{ color: '#2E2117' }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
