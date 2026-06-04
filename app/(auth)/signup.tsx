import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FormLayout from '@/components/layouts/FormLayout';
import InputField from '@/components/inputs/Input';
import SignUpFields from '@/components/formFields/SignUpFields';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PasswordInput from '@/components/inputs/PasswordInput';
import InputLabel from '@/components/texts/InputLabel';
import { AppleLogo, GoogleLogo } from '@/components/icons';
import AuthFormTitle from '@/components/texts/auth/FormTitle';
import AuthTextBodySmall from '@/components/texts/auth/AuthTextBodySmall';
import IconButton from '@/components/buttons/IconButton';
import { useToast } from '@/hooks/useToast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useScreenReady } from '@/hooks/useScreenReady';
import ErrorScreen from '@/components/errors/ErrorScreen';
import LoadingScreen from '@/components/loading/LoadingScreen';
import { useSignUpMutation } from '@/store/api/authApi';
import { extractApiError } from '@/utils/apiError';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useAppleAuth } from '@/hooks/useAppleAuth';
import { useOneSignalId } from '@/hooks/useOneSignalId';

export default function SignUpScreen() {
  const onesignalId = useOneSignalId();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useToast();
  const { validateSignUp } = useFormValidation();
  const { fields, setFields } = SignUpFields();

  const [signUp, { isLoading }] = useSignUpMutation();

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

  const handleSignUp = async () => {
    const formData = {
      name: (getField('name')?.value as string) || '',
      email: (getField('email')?.value as string) || '',
      password: (getField('password')?.value as string) || '',
      confirmPassword: (getField('confirmPassword')?.value as string) || '',
    };

    if (!validateSignUp(formData)) return;

    try {
      await signUp({
        full_name: formData.name,
        email: formData.email,
        password: formData.password,
        onesignal_id: onesignalId,
      }).unwrap();

      showSuccess('Account created! Check your email for the verification code.');
      router.replace({
        pathname: '/(auth)/verify-code-s',
        params: { email: formData.email },
      });
    } catch (error: any) {
      showError(extractApiError(error, 'Sign up failed. Please try again.'));
    }
  };

  const handleRetry = () => router.replace('/(auth)/signup');

  React.useEffect(() => {
    if (isContentReady && isInitialLoad) setIsInitialLoad(false);
  }, [isContentReady]);

  if (isRendering && isInitialLoad) {
    return (
      <FormLayout>
        <LoadingScreen loadingText="Preparing sign up..." backgroundColor="transparent" />
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
      <View
        className="px-container py-9"
        style={{
          opacity: isContentReady ? 1 : 0,
          transform: [{ translateY: isContentReady ? 0 : 10 }],
        }}>
        <AuthFormTitle text="Sign Up" className={'mb-6'} />

        <View className="mb-3">
          <InputField
            placeHolder="Full Name"
            keyboard="default"
            name="name"
            value={(getField('name')?.value as string) || ''}
            handler={(_, value) => updateField('name', value)}
            error={!!getField('name')?.error}
            height={56}
          />
        </View>

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

        <View className="mb-3">
          <PasswordInput
            placeHolder="Create Password"
            name="password"
            value={(getField('password')?.value as string) || ''}
            handler={(_, value) => updateField('password', value)}
            error={!!getField('password')?.error}
            keyboard="default"
            height={56}
          />
        </View>

        <View className="mb-6">
          <PasswordInput
            placeHolder="Confirm Password"
            name="confirmPassword"
            value={(getField('confirmPassword')?.value as string) || ''}
            handler={(_, value) => updateField('confirmPassword', value)}
            error={!!getField('confirmPassword')?.error}
            keyboard="default"
            height={56}
          />
        </View>

        <PrimaryButton
          title={isLoading ? 'Creating Account...' : 'Sign Up'}
          onPress={handleSignUp}
          className="mb-3"
          disabled={isLoading || isSocialLoading}
          isLoading={isLoading}
        />

        <View className="mt-6 flex-row justify-center gap-[10px]">
          <AuthTextBodySmall text="Already have an account?" />
          <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/(auth)/login')}>
            <AuthTextBodySmall text="Sign In" style={{ fontSize: 17, color: '#361A0D' }} />
          </TouchableOpacity>
        </View>

        <InputLabel text="Or sign up with" className="mb-4 mt-[60px] text-center text-[361A0D]" />
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

        <View className="mt-8 flex-row flex-wrap justify-center">
          <AuthTextBodySmall text="By signing up, you agree to our " />
          <TouchableOpacity onPress={() => showInfo('Terms and Conditions')}>
            <AuthTextBodySmall text="Terms" style={{ color: '#361A0D' }} />
          </TouchableOpacity>
          <AuthTextBodySmall text=" and " />
          <TouchableOpacity onPress={() => showInfo('Privacy Policy')}>
            <AuthTextBodySmall text="Privacy Policy" style={{ color: '#361A0D' }} />
          </TouchableOpacity>
        </View>
      </View>
    </FormLayout>
  );
}
