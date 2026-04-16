import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormLayout from '@/components/layouts/FormLayout';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import AuthFormTitle from '@/components/texts/auth/FormTitle';
import { useToast } from '@/hooks/useToast';
import { useScreenReady } from '@/hooks/useScreenReady';
import { DateOfBirthPicker } from '@/components/ui/CustomDatePicker';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { PickerBottomSheet } from '@/components/personalInfo/PickerBottomSheet';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { RoundedInfoRow } from '@/components/personalInfo/RoundedInfoRow';

// Gender options
const GENDERS = [
  { id: 'female', label: 'Female', value: 'Female' },
  { id: 'male', label: 'Male', value: 'Male' },
  { id: 'non-binary', label: 'Non-binary', value: 'Non-binary' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say', value: 'Prefer not to say' },
];

// Language options
const LANGUAGES = [
  { id: 'en', label: 'English', value: 'English' },
  { id: 'es', label: 'Spanish', value: 'Spanish' },
  { id: 'fr', label: 'French', value: 'French' },
  { id: 'de', label: 'German', value: 'German' },
  { id: 'it', label: 'Italian', value: 'Italian' },
  { id: 'pt', label: 'Portuguese', value: 'Portuguese' },
  { id: 'zh', label: 'Chinese', value: 'Chinese' },
  { id: 'ja', label: 'Japanese', value: 'Japanese' },
  { id: 'ko', label: 'Korean', value: 'Korean' },
  { id: 'ar', label: 'Arabic', value: 'Arabic' },
  { id: 'hi', label: 'Hindi', value: 'Hindi' },
];

// Country options
const COUNTRIES = [
  { id: 'us', label: 'United States', value: 'United States' },
  { id: 'uk', label: 'United Kingdom', value: 'United Kingdom' },
  { id: 'ca', label: 'Canada', value: 'Canada' },
  { id: 'au', label: 'Australia', value: 'Australia' },
  { id: 'de', label: 'Germany', value: 'Germany' },
  { id: 'fr', label: 'France', value: 'France' },
  { id: 'it', label: 'Italy', value: 'Italy' },
  { id: 'es', label: 'Spain', value: 'Spain' },
  { id: 'nl', label: 'Netherlands', value: 'Netherlands' },
  { id: 'se', label: 'Sweden', value: 'Sweden' },
  { id: 'no', label: 'Norway', value: 'Norway' },
  { id: 'dk', label: 'Denmark', value: 'Denmark' },
  { id: 'fi', label: 'Finland', value: 'Finland' },
  { id: 'jp', label: 'Japan', value: 'Japan' },
  { id: 'cn', label: 'China', value: 'China' },
  { id: 'in', label: 'India', value: 'India' },
  { id: 'br', label: 'Brazil', value: 'Brazil' },
  { id: 'mx', label: 'Mexico', value: 'Mexico' },
  { id: 'za', label: 'South Africa', value: 'South Africa' },
  { id: 'ae', label: 'UAE', value: 'UAE' },
];

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { showError } = useToast();

  // Form state
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  // Picker visibility
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  // Screen ready state
  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not selected';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = async () => {
    // Validate required fields
    if (!selectedGender) {
      showError('Please select your gender');
      return;
    }

    if (!selectedCountry) {
      showError('Please select your country');
      return;
    }

    if (!selectedLanguage) {
      showError('Please select your language');
      return;
    }

    if (!dateOfBirth) {
      showError('Please enter your date of birth');
      return;
    }

    // Calculate age
    const age = calculateAge(dateOfBirth);

    if (age < 18) {
      showError('You must be 18 or older to use this app');
      return;
    }

    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('user_gender', selectedGender);
      await AsyncStorage.setItem('user_country', selectedCountry);
      await AsyncStorage.setItem('user_language', selectedLanguage);
      await AsyncStorage.setItem('user_date_of_birth', dateOfBirth.toISOString());
      await AsyncStorage.setItem('user_age', age.toString());

      // Navigate to next screen in questionnaire flow
      router.push('/(questionnaire)/life-phase');
    } catch (error) {
      console.error('Error saving personal info:', error);
      showError('Failed to save. Please try again.');
    }
  };

  const handleRetry = () => {
    router.replace('/(questionnaire)/personal-info');
  };

  // Show loading while screen is rendering
  if (isRendering) {
    return <LoadingScreen loadingText="Set up your inviorment" />;
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View
          className="px-container py-9"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          {/* Header */}
          <View className="mb-8">
            <AuthFormTitle text="Personal Info" />
            <Text className="text-center font-outfit text-[14px] text-titleTextColor">
              This helps us personalize your experience
            </Text>
          </View>

          {/* Country Selection */}
          <View className="mb-3">
            <RoundedInfoRow
              label="Select your country"
              value={selectedCountry || 'Not selected'}
              onPress={() => setShowCountryPicker(true)}
              isEditing={true}
              topRounded={true}
              bottomRounded={true}
              borderRadius={100}
            />
          </View>

          {/* Language Selection */}
          <View className="mb-3">
            <RoundedInfoRow
              label="Select your language"
              value={selectedLanguage || 'Not selected'}
              onPress={() => setShowLanguagePicker(true)}
              isEditing={true}
              topRounded={true}
              bottomRounded={true}
              borderRadius={100}
            />
          </View>

          {/* Date of Birth */}
          <View className="mb-3">
            <BorderlessShadowCard
              b_tl={100}
              b_tr={100}
              b_bl={100}
              b_br={100}
              style={{
                paddingVertical: 0,
                paddingHorizontal: 24,
                backgroundColor: '#F0E6D8',
                borderWidth: 2,
                borderColor: '#FFFFFF',
              }}>
              <DateOfBirthPicker
                value={dateOfBirth}
                onChange={setDateOfBirth}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                label="Date of Birth" // Add label here
                placeholder="Select your date of birth" // Optional custom placeholder
              />
            </BorderlessShadowCard>

            {/* Show calculated age if date selected */}
            {dateOfBirth && (
              <Text className="mt-2 text-start font-outfit text-[12px] text-[#759A52]">
                Age: {calculateAge(dateOfBirth)} years
              </Text>
            )}
          </View>

          {/* Gender Selection */}
          <View className="mb-6">
            <RoundedInfoRow
              label="Select your gender"
              value={selectedGender || 'Not selected'}
              onPress={() => setShowGenderPicker(true)}
              isEditing={true}
              topRounded={true}
              bottomRounded={true}
              borderRadius={100}
            />
          </View>

          {/* Next Button */}
          <PrimaryButton title="Next" onPress={handleNext} className="mb-3" />
        </View>
      </ScrollView>

      {/* Gender Picker Bottom Sheet */}
      <PickerBottomSheet
        visible={showGenderPicker}
        onClose={() => setShowGenderPicker(false)}
        title="Select Gender"
        items={GENDERS}
        selectedValue={selectedGender}
        onSelect={(value) => {
          setSelectedGender(value);
          setShowGenderPicker(false);
        }}
      />

      {/* Country Picker Bottom Sheet */}
      <PickerBottomSheet
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        title="Select Country"
        items={COUNTRIES}
        selectedValue={selectedCountry}
        onSelect={(value) => {
          setSelectedCountry(value);
          setShowCountryPicker(false);
        }}
      />

      {/* Language Picker Bottom Sheet */}
      <PickerBottomSheet
        visible={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
        title="Select Language"
        items={LANGUAGES}
        selectedValue={selectedLanguage}
        onSelect={(value) => {
          setSelectedLanguage(value);
          setShowLanguagePicker(false);
        }}
      />
    </FormLayout>
  );
}
