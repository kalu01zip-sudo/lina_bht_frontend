/* eslint-disable import/no-unresolved */
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react'; // ✅ Add useState
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PillowBadge from '@/components/buttons/PillowBadge';
import { Avatar } from '@/components/ui/Avatar';
import {
  ArrowRightHalfIcon,
  GearIcon,
  LogOutIcon,
  SupportIcon,
  WaveInHeartIcon,
} from '@/components/icons';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'expo-router';
import { CircularIconButton } from '@/components/buttons/CircularIconButton';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useGetProfileQuery, useGetProfileTabQuery } from '@/store/api/profileApi';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';

const Profile = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const { isPremium } = useRevenueCat(currentUser?.id);

  // ✅ Single source of truth for this screen
  // const { data: profile, isLoading: profileLoading } = useGetProfileTabQuery();
  const { data: profile, isLoading: profileLoading } = useGetProfileTabQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const USER_PROFILE_DATA = [
    {
      id: '1',
      label: 'Skin Type',
      value: profile?.onboarding.skin_type ? capitalize(profile.onboarding.skin_type) : 'Not set',
    },
    {
      id: '2',
      label: 'Skin Concerns',
      value: profile?.onboarding.skin_concerns?.length
        ? profile.onboarding.skin_concerns.map(capitalize).join(', ')
        : 'None',
    },
    {
      id: '3',
      label: 'Hair Type',
      value: profile?.onboarding.hair_type ? capitalize(profile.onboarding.hair_type) : 'Not set',
    },
    {
      id: '4',
      label: 'Allergies',
      value: profile?.onboarding.allergies?.length
        ? profile.onboarding.allergies.join(', ')
        : 'None',
    },
  ];

  const handleLogoutPress = () => setShowLogoutModal(true);

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logout();
      showSuccess('You have been logged out successfully');
    } catch {
      showError('Failed to log out. Please try again.');
    }
  };

  const handleRetry = () => router.replace('/(main)/profile');

  if (isRendering || profileLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading your profile..." />
      </SafeAreaView>
    );
  }

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
            onPress={() => router.push('/(flow)/settings')}
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
          {/* Profile Header Card */}`
          <BorderlessShadowCard
            style={{ paddingVertical: 24, paddingHorizontal: 24, alignItems: 'center' }}>
            <PillowBadge
              // title={profile?.plan ? capitalize(profile.plan) + ' Plan' : 'Free Plan'}
              title={isPremium ? 'Premium Plan' : 'Free Plan'}
              style={{ maxWidth: 120, flex: 1, alignSelf: 'flex-end', marginBottom: 5 }}
            />
            <View className="w-full flex-row items-center gap-3">
              {/* ✅ avatar comes from /profile/profile_edit via useGetProfileQuery, */}

              {/* <AvatarFromApi /> */}
              <Avatar
                source={profile?.avatar_url ?? undefined}
                size={50}
                fallbackIcon="person-circle"
                iconColor="#361A0D"
                backgroundColor="#E5E0D8"
              />
              <View className="flex-1 justify-center">
                <Text className="flex-1 font-outfitMedium text-[24px]" style={{ color: '#2A2118' }}>
                  {profile?.name || 'User'}
                </Text>
                <Text
                  numberOfLines={1}
                  className="font-primous text-[16px]"
                  style={{ color: '#2A2118CC' }}>
                  {profile?.gmail || ''}
                </Text>
              </View>
            </View>
          </BorderlessShadowCard>
          {/* ... rest of your JSX unchanged, just replace user?.X with profile?.onboarding.X ... */}
          {/* Skin & Hair Profile Card */}
          <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={0}
            b_br={0}
            style={{ padding: 24, marginTop: 12 }}>
            <Text className="mb-5 font-outfitMedium text-[16px]" style={{ color: '#361A0D' }}>
              Skin & Hair Profile
            </Text>
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
                {index < USER_PROFILE_DATA.length - 1 && (
                  <View className="my-2 h-[1px] w-full bg-[#dec8b3]" />
                )}
              </View>
            ))}
          </BorderlessShadowCard>
          {/* Premium Upgrade Card */}
          {profile?.plan === 'free' && (
            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              style={{ paddingVertical: 24, paddingHorizontal: 24, marginTop: 12 }}>
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
                onPress={() => router.push('/(flow)/profile/asking-upgrage-to-premium-screen')}
              />
            </BorderlessShadowCard>
          )}
          {/* Features Section */}
          <View className="mt-3">
            <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              Feature
            </Text>
            <BorderlessShadowCard
              onPress={() => router.push('/(flow)/ai-assistant')}
              b_tl={24}
              b_tr={24}
              b_bl={0}
              b_br={0}
              style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 8 }}>
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

            <BorderlessShadowCard
              onPress={() => router.push('/(flow)/wellness')}
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 8 }}>
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
          {/* Account Section */}
          <View>
            <Text className="mt-3 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              Account
            </Text>
            <BorderlessShadowCard
              onPress={() => router.push('/(flow)/profile/premium-plan-screen')}
              b_tl={24}
              b_tr={24}
              b_bl={24}
              b_br={24}
              style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 8 }}>
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
            <BorderlessShadowCard
              onPress={() => router.push('/(flow)/support')}
              b_tl={24}
              b_tr={24}
              b_bl={0}
              b_br={0}
              style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 8 }}>
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

            <BorderlessShadowCard
              onPress={() => router.push('/(flow)/privacy-and-terms')}
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 8 }}>
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
          {/* Log Out Button - Updated with modal trigger */}
          <TouchableOpacity
            onPress={handleLogoutPress}
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

      {/* ✅ Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Log Out"
        message="Are you sure you want to log out? You'll need to sign in again to access your account."
        confirmText="Log Out"
        cancelText="Cancel"
        iconName="log-out-outline"
        iconColor="#977857"
        confirmButtonColor="#EF4444"
      />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
