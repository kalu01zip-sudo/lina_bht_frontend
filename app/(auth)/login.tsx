import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FormLayout from '@/components/layouts/FormLayout';
import InputField from '@/components/inputs/Input';
import LoginFields from '@/components/formFields/LoginFields';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PasswordInput from '@/components/inputs/PasswordInput';
import InputLabel from '@/components/texts/InputLabel';
import { AppleLogo, GoogleLogo } from '@/components/icons';
import AuthFormTitle from '@/components/texts/auth/FormTitle';
import AuthTextBodySmall from '@/components/texts/auth/AuthTextBodySmall';
import IconButton from '@/components/buttons/IconButton';
import TextBodySmall from '@/components/texts/TextBodySmall';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useSignInMutation, useResendOtpMutation } from '@/store/api/authApi';
import { extractApiError } from '@/utils/apiError';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useAppleAuth } from '@/hooks/useAppleAuth';
import { useOneSignalId } from '@/hooks/useOneSignalId';

export default function LoginScreen() {
  const onesignalId = useOneSignalId();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const router = useRouter();
  const { persistAndLogin } = useAuth();
  const { showError, showInfo } = useToast();
  const { validateLogin } = useFormValidation();
  const { fields, setFields } = LoginFields();

  const [signIn, { isLoading }] = useSignInMutation();
  const [resendOtp] = useResendOtpMutation();

  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();
  const { signInWithApple, isLoading: isAppleLoading } = useAppleAuth();

  const isSocialLoading = isGoogleLoading || isAppleLoading;

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  const getField = (name: string) => fields?.find((field) => field.name === name);

  const updateField = (name: string, value: string | boolean) => {
    setFields?.((prev) =>
      prev.map((field) => (field.name === name ? { ...field, value, error: false } : field))
    );
  };

  const handleLogin = async () => {
    console.log('[Login] onesignal_id at submit time:', onesignalId);
    const formData = {
      email: (getField('email')?.value as string) || '',
      password: (getField('password')?.value as string) || '',
    };

    if (!validateLogin(formData)) return;

    try {
      const data = await signIn({
        ...formData,
        onesignal_id: onesignalId,
      }).unwrap();
      await persistAndLogin(data);
    } catch (error: any) {
      const apiError = error?.data;

      const isNotVerified =
        apiError?.detail?.toLowerCase?.().includes('not verified') ||
        apiError?.message?.toLowerCase?.().includes('not verified') ||
        apiError?.detail?.toLowerCase?.().includes('verify') ||
        apiError?.message?.toLowerCase?.().includes('verify');

      if (isNotVerified) {
        showInfo('Please verify your email to continue.');
        try {
          await resendOtp({ email: formData.email, purpose: 'verify_email' }).unwrap();
        } catch {
          // Silently ignore — user can resend manually on next screen
        }
        router.push({
          pathname: '/(auth)/verify-code-s',
          params: { email: formData.email },
        });
        return;
      }

      showError(extractApiError(error, 'Login failed. Please try again.'));
    }
  };

  const handleRetry = () => router.replace('/(auth)/login');
  const handleForgotPassword = () => router.push('/(auth)/(forgot-password)/email');

  React.useEffect(() => {
    if (isContentReady && isInitialLoad) setIsInitialLoad(false);
  }, [isContentReady]);

  if (isRendering && isInitialLoad) {
    return (
      <FormLayout>
        <LoadingScreen loadingText="Preparing login..." backgroundColor="transparent" />
      </FormLayout>
    );
  }

  if (renderError) {
    return (
      <FormLayout>
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </FormLayout>
    );
  }

  return (
    <FormLayout>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}>
        <View
          className="px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
            paddingVertical: 40,
          }}>
          <AuthFormTitle text="Sign In" className={'mb-10'} />

          <View className="mb-3">
            <InputField
              placeHolder="Email Address"
              keyboard="email-address"
              name="email"
              value={(getField('email')?.value as string) || ''}
              handler={(_, value) => updateField('email', value)}
              error={!!getField('email')?.error}
              height={56}
            />
          </View>

          <View className="mb-6">
            <PasswordInput
              placeHolder="Enter Password"
              name="password"
              value={(getField('password')?.value as string) || ''}
              handler={(_, value) => updateField('password', value)}
              error={!!getField('password')?.error}
              keyboard="default"
            />
          </View>

          <PrimaryButton
            title={isLoading ? 'Signing in...' : 'Sign In'}
            onPress={handleLogin}
            className="mb-3"
            disabled={isLoading || isSocialLoading}
            isLoading={isLoading}
          />

          <TouchableOpacity onPress={handleForgotPassword}>
            <TextBodySmall
              text="Forgot password?"
              style={{ textAlign: 'right', marginHorizontal: 12 }}
            />
          </TouchableOpacity>

          <View className="mt-8 flex-row justify-center gap-[10px]">
            <AuthTextBodySmall text="Don't have an account " />
            <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/(auth)/signup')}>
              <AuthTextBodySmall text="Sign Up" style={{ fontSize: 17, fontWeight: '600' }} />
            </TouchableOpacity>
          </View>

          <InputLabel text="Sign in with" className="mb-4 mt-[100px] text-center text-[361A0D]" />
          <View className="flex-row items-center gap-4">
            <IconButton
              onPress={signInWithApple}
              icon={<AppleLogo size={30} />}
              style={{ flex: 1 }}
              disabled={isLoading || isSocialLoading}
            />
            <IconButton
              onPress={signInWithGoogle}
              icon={<GoogleLogo size={30} />}
              style={{ flex: 1 }}
              disabled={isLoading || isSocialLoading}
            />
          </View>
        </View>
      </ScrollView>
    </FormLayout>
  );
}
