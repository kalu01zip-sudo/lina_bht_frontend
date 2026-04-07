/* eslint-disable import/no-unresolved */
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
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

const Profile = () => {
  const router = useRouter();

  const { logout } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('You have been logged out successfully');
    } catch (error) {
      showError('Failed to log out. Please try again.');
    }
  };

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
        <View className="px-container">
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
                source="https://randomuser.me/api/portraits/women/64.jpg"
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
                    Elena Rossi
                  </Text>
                  <PillowBadge title="Free Plan" />
                </View>
                <Text
                  numberOfLines={1}
                  className="font-primous text-[16px]  "
                  style={{ color: '#2A2118CC' }}>
                  testuser@skinsense.com
                </Text>
              </View>
            </View>
          </BorderlessShadowCard>

          {/* Premium Upgrade Card */}
          <BorderlessShadowCard
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
          </BorderlessShadowCard>

          {/* Features Section */}
          <View className="mt-3">
            <View>
              <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
                Features
              </Text>

              {/* AI Assistant */}
              <BorderlessShadowCard
                onPress={() => {
                  router.push('/(flow)/ai-assistant');
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
              <BorderlessShadowCard
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
              </BorderlessShadowCard>
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
              b_tl={0}
              b_tr={0}
              b_bl={0}
              b_br={0}
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
