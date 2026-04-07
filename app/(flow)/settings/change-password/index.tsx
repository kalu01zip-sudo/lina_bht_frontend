// app/(flow)/settings/change-password/index.tsx
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import PasswordInput from '@/components/inputs/PasswordInput';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    };

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = true;
      showError('Please enter your current password');
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = true;
      showError('Please enter a new password');
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = true;
      showError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = true;
      showError('Please confirm your new password');
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = true;
      showError('Passwords do not match');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to change password
      console.log('Changing password for:', formData.currentPassword);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showSuccess('Password changed successfully');

      // Navigate back after success
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      showError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Change Password" height={50} backButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 24,
          flexGrow: 1,
        }}
        className="flex-1">
        <View className="px-container">
          {/* Description */}
          <Text className="mb-6 font-outfit text-[14px]" style={{ color: '#2A2118B2' }}>
            Please enter your current password and choose a new one
          </Text>

          {/* Current Password */}
          <View className="mb-4">
            <Text className="mb-2 font-outfitMedium text-[14px]" style={{ color: '#2E2117CC' }}>
              Current Password
            </Text>
            <PasswordInput
              value={formData.currentPassword}
              handler={(_, value) => updateField('currentPassword', value)}
              placeHolder="Enter current password"
              error={errors.currentPassword}
              height={56}
            />
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="mb-2 font-outfitMedium text-[14px]" style={{ color: '#2E2117CC' }}>
              New Password
            </Text>
            <PasswordInput
              value={formData.newPassword}
              handler={(_, value) => updateField('newPassword', value)}
              placeHolder="Enter new password"
              error={errors.newPassword}
              height={56}
            />
            <Text className="mt-1 font-outfit text-[12px]" style={{ color: '#2E211766' }}>
              Password must be at least 6 characters
            </Text>
          </View>

          {/* Confirm Password */}
          <View className="mb-8">
            <Text className="mb-2 font-outfitMedium text-[14px]" style={{ color: '#2E2117CC' }}>
              Confirm New Password
            </Text>
            <PasswordInput
              value={formData.confirmPassword}
              handler={(_, value) => updateField('confirmPassword', value)}
              placeHolder="Confirm new password"
              error={errors.confirmPassword}
              height={56}
            />
          </View>

          {/* Change Password Button */}
          <PrimaryButton
            title={isLoading ? 'Changing Password...' : 'Change Password'}
            onPress={handleChangePassword}
            disabled={isLoading}
            isLoading={isLoading}
            style={{ marginTop: 8 }}
          />

          {/* Password Requirements */}
          <BorderlessShadowCard
            b_tl={24}
            b_tr={24}
            b_bl={24}
            b_br={24}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              marginTop: 24,
              backgroundColor: '#F5F0EB',
            }}>
            <Text className="mb-2 font-outfitMedium text-[14px]" style={{ color: '#2E2117' }}>
              Password Requirements:
            </Text>
            <View className="mb-1 flex-row items-center gap-2">
              <Ionicons
                name={formData.newPassword.length >= 6 ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={formData.newPassword.length >= 6 ? '#7A8B6A' : '#2E211766'}
              />
              <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
                At least 6 characters
              </Text>
            </View>
            <View className="mb-1 flex-row items-center gap-2">
              <Ionicons
                name={/[A-Z]/.test(formData.newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={/[A-Z]/.test(formData.newPassword) ? '#7A8B6A' : '#2E211766'}
              />
              <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
                At least one uppercase letter
              </Text>
            </View>
            <View className="mb-1 flex-row items-center gap-2">
              <Ionicons
                name={/[0-9]/.test(formData.newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={/[0-9]/.test(formData.newPassword) ? '#7A8B6A' : '#2E211766'}
              />
              <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
                At least one number
              </Text>
            </View>
          </BorderlessShadowCard>

          {/* Forgot Password Link */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/(forgot-password)/email')}
            className="mt-6 items-center">
            <Text className="font-outfit text-[14px]" style={{ color: '#7A8B6A' }}>
              Forgot current password?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
