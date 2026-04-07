/* eslint-disable import/no-unresolved */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { Avatar } from '@/components/ui/Avatar';
import { ArrowRightHalfIcon, LockIcon, ProfileIcon } from '@/components/icons';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const router = useRouter();

  const { showSuccess, showError } = useToast();

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Profile Settings" height={50} backButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 10,
          flexGrow: 1,
        }}
        className="flex-1">
        <View className="gap-3 px-container">
          {/* Personal status Card */}

          <BorderlessShadowCard
            onPress={() => {
              router.push('/(flow)/settings/personal-info');
            }}
            b_tl={24}
            b_tr={24}
            b_bl={0}
            b_br={0}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 24,
              marginTop: 12,
            }}>
            <View className="flex-row items-center">
              <View className="flex-1 flex-row items-center gap-3">
                <ProfileIcon size={20} color="#361A0D" />

                <Text className="font-outfit text-[14px]" style={{ color: '#361A0D' }}>
                  Personal Info
                </Text>
              </View>

              <ArrowRightHalfIcon size={16} color="#361A0D" />
            </View>
          </BorderlessShadowCard>

          <BorderlessShadowCard
            onPress={() => router.push('/(flow)/settings/change-password')}
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
                <LockIcon size={20} color="#361A0D" />
                <Text className="font-outfit text-[14px]" style={{ color: '#361A0D' }}>
                  Change Password
                </Text>
              </View>
              <ArrowRightHalfIcon size={16} color="#361A0D" />
            </View>
          </BorderlessShadowCard>

          <Text className="mt-3 font-outfitMedium text-[16px] " style={{ color: '#2E2117' }}>
            Health Information
          </Text>
          <BorderlessShadowCard
            onPress={() => {
              router.push('/(flow)/settings/health-information/life-phase-health');
            }}
            b_tl={24}
            b_tr={24}
            b_bl={0}
            b_br={0}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 24,
            }}>
            <View className="flex-row items-center">
              <View className="flex-1 flex-row items-center gap-3">
                {/* <LockIcon size={20} color="#361A0D" /> */}

                <Text className="font-outfit text-[14px]" style={{ color: '#361A0D' }}>
                  Life phase & health
                </Text>
              </View>

              <ArrowRightHalfIcon size={16} color="#361A0D" />
            </View>
          </BorderlessShadowCard>
          <BorderlessShadowCard
            onPress={() => {
              router.push('/(flow)/settings/health-information/Allergies');
            }}
            b_tl={0}
            b_tr={0}
            b_bl={0}
            b_br={0}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 24,
            }}>
            <View className="flex-row items-center">
              <View className="flex-1 flex-row items-center gap-3">
                {/* <LockIcon size={20} color="#361A0D" /> */}

                <Text className="font-outfit text-[14px]" style={{ color: '#361A0D' }}>
                  Allergies
                </Text>
              </View>

              <ArrowRightHalfIcon size={16} color="#361A0D" />
            </View>
          </BorderlessShadowCard>
          <BorderlessShadowCard
            onPress={() => {
              router.push('/(flow)/settings/health-information/skin-hair-condition');
            }}
            b_tl={0}
            b_tr={0}
            b_bl={24}
            b_br={24}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 24,
            }}>
            <View className="flex-row items-center">
              <View className="flex-1 flex-row items-center gap-3">
                {/* <LockIcon size={20} color="#361A0D" /> */}

                <Text className="font-outfit text-[14px]" style={{ color: '#361A0D' }}>
                  Skin & Hair Condition
                </Text>
              </View>

              <ArrowRightHalfIcon size={16} color="#361A0D" />
            </View>
          </BorderlessShadowCard>

          {/* <InputField
            placeHolder="Name"
            showLabel={false}
            height={56}
            withShadow={true}
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}
          />
          <InputField
            placeHolder="Email"
            showLabel={false}
            height={56}
            withShadow={true}
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
