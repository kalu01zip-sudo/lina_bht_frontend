// import React, { useState } from 'react';
// import { View, TouchableOpacity, ActivityIndicator, Text, ScrollView } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import FormLayout from '@/components/layouts/FormLayout';
// import InputField from '@/components/inputs/Input';
// import SignUpFields from '@/components/formFields/SignUpFields';
// import PrimaryButton from '@/components/buttons/PrimaryButton';
// import PasswordInput from '@/components/inputs/PasswordInput';
// import InputLabel from '@/components/texts/InputLabel';
// import { AppleLogo, GoogleLogo } from '@/components/icons';
// import AuthFormTitle from '@/components/texts/auth/FormTitle';
// import AuthTextBodySmall from '@/components/texts/auth/AuthTextBodySmall';
// import IconButton from '@/components/buttons/IconButton';
// import { useAuth } from '@/hooks/useAuth';
// import { useToast } from '@/hooks/useToast';
// import { useFormValidation } from '@/hooks/useFormValidation';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// import LoadingScreen from '@/components/loading/LoadingScreen';

// export default function SignUpScreen() {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { login } = useAuth();
//   const { showSuccess, showError, showInfo } = useToast();
//   const { validateSignUp } = useFormValidation();
//   const { fields, setFields } = SignUpFields();

//   const { isRendering, renderError, isContentReady } = useScreenReady({
//     dependencies: [fields],
//     delay: 100,
//   });

//   const getField = (name: string) => fields?.find((field) => field.name === name);

//   const updateField = (name: string, value: string | boolean) => {
//     setFields?.((prev) =>
//       prev.map((field) => (field.name === name ? { ...field, value, error: false } : field))
//     );
//   };

//   const handleSignUp = async () => {
//     const formData = {
//       name: (getField('name')?.value as string) || '',
//       email: (getField('email')?.value as string) || '',
//       password: (getField('password')?.value as string) || '',
//       confirmPassword: (getField('confirmPassword')?.value as string) || '',
//     };

//     if (!validateSignUp(formData)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       // Replace with your actual signup API call
//       await AsyncStorage.setItem('auth_token', 'mock_token');
//       await AsyncStorage.setItem('user_email', formData.email);
//       await AsyncStorage.setItem('user_name', formData.name);
//       await AsyncStorage.setItem('hasSeenOnboarding', 'true');

//       showSuccess('Account created successfully!');

//       // Navigate to questionnaire instead of main
//       router.replace('/(questionnaire)/life-phase');

//       // After successful signup, log the user in
//       // await login('mock_token', { email: formData.email, name: formData.name });
//     } catch (error) {
//       showError('Sign up failed. Please try again.');
//       setLoading(false);
//     }
//   };

//   const handleRetry = () => {
//     // Force remount by replacing the route
//     router.replace('/(auth)/signup');
//   };

//   const handleSocialSignUp = (provider: string) => {
//     showInfo(`${provider} sign up coming soon!`);
//   };

//   // Show loading while screen is rendering
//   if (isRendering) {
//     <LoadingScreen />;
//   }

//   // Show error if rendering failed
//   if (renderError) {
//     return (
//       <FormLayout>
//         <ErrorScreen message={renderError} onRetry={handleRetry} />
//       </FormLayout>
//     );
//   }

//   return (
//     <FormLayout>
//       <View
//         className="px-container py-9"
//         style={{
//           opacity: isContentReady ? 1 : 0,
//           transform: [{ translateY: isContentReady ? 0 : 10 }],
//         }}>
//         <AuthFormTitle text="Sign Up" className={'mb-6'} />

//         {/* Full Name */}
//         <View className="mb-3">
//           <InputField
//             placeHolder="Full Name"
//             keyboard="default"
//             name="name"
//             value={(getField('name')?.value as string) || ''}
//             handler={(_, value) => updateField('name', value)}
//             error={!!getField('name')?.error}
//             height={56}
//           />
//         </View>

//         {/* Email */}
//         <View className="mb-3">
//           <InputField
//             placeHolder="Email Address"
//             keyboard="email-address"
//             name="email"
//             value={(getField('email')?.value as string) || ''}
//             handler={(_, value) => updateField('email', value)}
//             error={!!getField('email')?.error}
//             height={56}
//           />
//         </View>

//         {/* Password */}
//         <View className="mb-3">
//           <PasswordInput
//             placeHolder="Create Password"
//             name="password"
//             value={(getField('password')?.value as string) || ''}
//             handler={(_, value) => updateField('password', value)}
//             error={!!getField('password')?.error}
//             keyboard="default"
//             height={56}
//           />
//         </View>

//         {/* Confirm Password */}
//         <View className="mb-6">
//           <PasswordInput
//             placeHolder="Confirm Password"
//             name="confirmPassword"
//             value={(getField('confirmPassword')?.value as string) || ''}
//             handler={(_, value) => updateField('confirmPassword', value)}
//             error={!!getField('confirmPassword')?.error}
//             keyboard="default"
//             height={56}
//           />
//         </View>

//         {/* Sign Up Button */}
//         <PrimaryButton
//           title={loading ? 'Creating Account...' : 'Sign Up'}
//           onPress={handleSignUp}
//           className="mb-3"
//           disabled={loading}
//         />

//         {/* Already have an account */}
//         <View className="mt-6 flex-row justify-center gap-[10px]">
//           <AuthTextBodySmall text="Already have an account?" />
//           <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/(auth)/login')}>
//             <AuthTextBodySmall text="Sign In" style={{ fontSize: 17, fontWeight: '600' }} />
//           </TouchableOpacity>
//         </View>

//         {/* Social Sign Up */}
//         <InputLabel text="Or sign up with" className="mb-4 mt-[60px] text-center text-[361A0D]" />
//         <View className="flex-row items-center gap-4">
//           <IconButton
//             onPress={() => handleSocialSignUp('Apple')}
//             icon={<AppleLogo size={30} />}
//             style={{ flex: 1 }}
//           />
//           <IconButton
//             onPress={() => handleSocialSignUp('Google')}
//             icon={<GoogleLogo size={30} />}
//             style={{ flex: 1 }}
//           />
//         </View>

//         {/* Terms and Conditions */}
//         <View className="mt-8 flex-row flex-wrap justify-center">
//           <AuthTextBodySmall text="By signing up, you agree to our " />
//           <TouchableOpacity onPress={() => showInfo('Terms and Conditions')}>
//             <AuthTextBodySmall text="Terms" style={{ color: '#361A0D' }} />
//           </TouchableOpacity>
//           <AuthTextBodySmall text=" and " />
//           <TouchableOpacity onPress={() => showInfo('Privacy Policy')}>
//             <AuthTextBodySmall text="Privacy Policy" style={{ color: '#361A0D' }} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </FormLayout>
//   );
// }

import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useScreenReady } from '@/hooks/useScreenReady';
import ErrorScreen from '@/components/errors/ErrorScreen';
import LoadingScreen from '@/components/loading/LoadingScreen';

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const { validateSignUp } = useFormValidation();
  const { fields, setFields } = SignUpFields();

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

    if (!validateSignUp(formData)) {
      return;
    }

    setLoading(true);
    try {
      await AsyncStorage.setItem('auth_token', 'mock_token');
      await AsyncStorage.setItem('user_email', formData.email);
      await AsyncStorage.setItem('user_name', formData.name);
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');

      showSuccess('Account created successfully!');
      // router.replace('/(questionnaire)/life-phase');
      router.replace('/(questionnaire)/personal-info');
    } catch (error) {
      showError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    router.replace('/(auth)/signup');
  };

  const handleSocialSignUp = (provider: string) => {
    showInfo(`${provider} sign up coming soon!`);
  };

  // Mark initial load as complete after first render
  React.useEffect(() => {
    if (isContentReady && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isContentReady]);

  // Show initial render loading (useScreenReady) - ONLY on first load
  if (isRendering && isInitialLoad) {
    return (
      <FormLayout>
        <LoadingScreen loadingText="Preparing sign up..." backgroundColor="transparent" />
      </FormLayout>
    );
  }

  // Show error if rendering failed
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

        {/* Full Name */}
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

        {/* Email */}
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

        {/* Password */}
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

        {/* Confirm Password */}
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

        {/* Sign Up Button */}
        <PrimaryButton
          title={loading ? 'Creating Account...' : 'Sign Up'}
          onPress={handleSignUp}
          className="mb-3"
          disabled={loading}
          isLoading={loading}
        />

        {/* Already have an account */}
        <View className="mt-6 flex-row justify-center gap-[10px]">
          <AuthTextBodySmall text="Already have an account?" />
          <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/(auth)/login')}>
            <AuthTextBodySmall text="Sign In" style={{ fontSize: 17, color: '#361A0D' }} />
          </TouchableOpacity>
        </View>

        {/* Social Sign Up */}
        <InputLabel text="Or sign up with" className="mb-4 mt-[60px] text-center text-[361A0D]" />
        <View className="flex-row items-center gap-4">
          <IconButton
            onPress={() => handleSocialSignUp('Apple')}
            icon={<AppleLogo size={30} />}
            style={{ flex: 1 }}
          />
          <IconButton
            onPress={() => handleSocialSignUp('Google')}
            icon={<GoogleLogo size={30} />}
            style={{ flex: 1 }}
          />
        </View>

        {/* Terms and Conditions */}
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
