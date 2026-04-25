// app/(flow)/settings/health-information/edit/edit-skin-hair-condition.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { useToast } from '@/hooks/useToast';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { RadioButton } from '@/components/buttons/RadioButton';
import { CheckIconButton } from '@/components/CheckIconButton';
import InputField from '@/components/inputs/Input';
import {
  CoilyOrKinkyHairIcon,
  CombinationSkinIcon,
  CurlyHairIcon,
  DrySkinIcon,
  NormalSkinIcon,
  OilySkinIcon,
  SensitiveSkinIcon,
  StraightHairIcon,
  WavyHairIcon,
} from '@/components/icons';
import VectorBg from '@/components/VectorBg';

// ==================== SKIN TYPE (with icons) ====================
const SKIN_TYPE = [
  {
    id: 'dry',
    label: 'Dry',
    value: 'dry',
    leftIcon: (color: string) => (
      <DrySkinIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'combination',
    label: 'Combination',
    value: 'combination',
    leftIcon: (color: string) => (
      <CombinationSkinIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'normal',
    label: 'Normal',
    value: 'normal',
    leftIcon: (color: string) => (
      <NormalSkinIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'oily',
    label: 'Oily',
    value: 'oily',
    leftIcon: (color: string) => (
      <OilySkinIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'sensitive',
    label: 'Sensitive',
    value: 'sensitive',
    leftIcon: (color: string) => (
      <SensitiveSkinIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
];

// ==================== SKIN CONCERNS (with Other option) ====================
const SKIN_CONCERNS_OPTIONS = [
  { id: 'acne', label: 'Acne, Pimple', value: 'acne_pimple' },
  { id: 'irritation', label: 'Irritation, redness', value: 'irritation_redness' },
  { id: 'pigmentation', label: 'Pigmentation', value: 'pigmentation' },
  { id: 'dullness', label: 'Dullness', value: 'dullness' },
  { id: 'none', label: 'No concerns', value: 'none' },
  { id: 'skin_other', label: 'Other', value: 'skin_other' },
];

// ==================== HAIR TYPE (with icons) ====================
const HAIR_TYPE = [
  {
    id: 'wavy',
    label: 'Wavy',
    value: 'wavy',
    leftIcon: (color: string) => (
      <WavyHairIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'straight',
    label: 'Straight',
    value: 'straight',
    leftIcon: (color: string) => (
      <StraightHairIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'curly',
    label: 'Curly',
    value: 'curly',
    leftIcon: (color: string) => (
      <CurlyHairIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'coily_or_kinky',
    label: 'Coily or Kinky',
    value: 'coily_or_kinky',
    leftIcon: (color: string) => (
      <CoilyOrKinkyHairIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
];

// ==================== HAIR CONCERNS (with Other option) ====================
const HAIR_CONCERNS_OPTIONS = [
  { id: 'hair_fall', label: 'Hair fall', value: 'hair_fall' },
  { id: 'dandruff', label: 'Dandruff', value: 'dandruff' },
  { id: 'oily_scalp', label: 'Oily Scalp', value: 'oily_scalp' },
  { id: 'dry_scalp', label: 'Dry Scalp', value: 'dry_scalp' },
  { id: 'none', label: 'No concerns', value: 'none' },
  { id: 'hair_other', label: 'Other', value: 'hair_other' },
];

export default function EditSkinHairConditionScreen() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { width: screenWidth } = useWindowDimensions();

  const [selectedSkinType, setSelectedSkinType] = useState<string | null>(null);
  const [selectedSkinConcerns, setSelectedSkinConcerns] = useState<string[]>([]);
  const [selectedHairType, setSelectedHairType] = useState<string | null>(null);
  const [selectedHairConcerns, setSelectedHairConcerns] = useState<string[]>([]);

  // Custom concerns states
  const [showSkinCustomInput, setShowSkinCustomInput] = useState(false);
  const [skinCustomConcern, setSkinCustomConcern] = useState('');
  const [skinCustomConcernsList, setSkinCustomConcernsList] = useState<string[]>([]);

  const [showHairCustomInput, setShowHairCustomInput] = useState(false);
  const [hairCustomConcern, setHairCustomConcern] = useState('');
  const [hairCustomConcernsList, setHairCustomConcernsList] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values
  const skinFadeAnim = React.useRef(new Animated.Value(0)).current;
  const skinSlideAnim = React.useRef(new Animated.Value(20)).current;
  const hairFadeAnim = React.useRef(new Animated.Value(0)).current;
  const hairSlideAnim = React.useRef(new Animated.Value(20)).current;

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  React.useEffect(() => {
    if (showSkinCustomInput) {
      Animated.parallel([
        Animated.timing(skinFadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(skinSlideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      skinFadeAnim.setValue(0);
      skinSlideAnim.setValue(20);
    }
  }, [showSkinCustomInput]);

  React.useEffect(() => {
    if (showHairCustomInput) {
      Animated.parallel([
        Animated.timing(hairFadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(hairSlideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      hairFadeAnim.setValue(0);
      hairSlideAnim.setValue(20);
    }
  }, [showHairCustomInput]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        savedSkinType,
        savedSkinConcerns,
        savedSkinCustom,
        savedHairType,
        savedHairConcerns,
        savedHairCustom,
      ] = await Promise.all([
        AsyncStorage.getItem('user_skin_type'),
        AsyncStorage.getItem('user_skin_concerns'),
        AsyncStorage.getItem('user_skin_custom_concerns'),
        AsyncStorage.getItem('user_hair_type'),
        AsyncStorage.getItem('user_hair_concerns'),
        AsyncStorage.getItem('user_hair_custom_concerns'),
      ]);

      if (savedSkinType) setSelectedSkinType(savedSkinType);
      if (savedSkinConcerns) setSelectedSkinConcerns(JSON.parse(savedSkinConcerns));
      if (savedSkinCustom) setSkinCustomConcernsList(JSON.parse(savedSkinCustom));
      if (savedHairType) setSelectedHairType(savedHairType);
      if (savedHairConcerns) setSelectedHairConcerns(JSON.parse(savedHairConcerns));
      if (savedHairCustom) setHairCustomConcernsList(JSON.parse(savedHairCustom));
    } catch (error) {
      console.error('Error loading skin/hair data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkinConcern = (concernValue: string) => {
    if (concernValue === 'skin_other') {
      setShowSkinCustomInput(!showSkinCustomInput);
      if (!showSkinCustomInput) {
        setSkinCustomConcern('');
      }
    } else {
      if (selectedSkinConcerns.includes(concernValue)) {
        setSelectedSkinConcerns(selectedSkinConcerns.filter((item) => item !== concernValue));
      } else {
        setSelectedSkinConcerns([...selectedSkinConcerns, concernValue]);
      }
    }
  };

  const toggleHairConcern = (concernValue: string) => {
    if (concernValue === 'hair_other') {
      setShowHairCustomInput(!showHairCustomInput);
      if (!showHairCustomInput) {
        setHairCustomConcern('');
      }
    } else {
      if (selectedHairConcerns.includes(concernValue)) {
        setSelectedHairConcerns(selectedHairConcerns.filter((item) => item !== concernValue));
      } else {
        setSelectedHairConcerns([...selectedHairConcerns, concernValue]);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedSkinType) {
      showError('Please select your skin type');
      return;
    }

    if (!selectedHairType) {
      showError('Please select your hair type');
      return;
    }

    // Process skin concerns
    let finalSkinConcerns = [...selectedSkinConcerns];
    let finalSkinCustomList = [...skinCustomConcernsList];

    if (showSkinCustomInput && skinCustomConcern.trim()) {
      const newConcern = skinCustomConcern.trim();
      if (!finalSkinConcerns.includes(newConcern)) {
        finalSkinConcerns.push(newConcern);
        finalSkinCustomList.push(newConcern);
      }
    }

    // Process hair concerns
    let finalHairConcerns = [...selectedHairConcerns];
    let finalHairCustomList = [...hairCustomConcernsList];

    if (showHairCustomInput && hairCustomConcern.trim()) {
      const newConcern = hairCustomConcern.trim();
      if (!finalHairConcerns.includes(newConcern)) {
        finalHairConcerns.push(newConcern);
        finalHairCustomList.push(newConcern);
      }
    }

    setIsSaving(true);
    try {
      await Promise.all([
        AsyncStorage.setItem('user_skin_type', selectedSkinType),
        AsyncStorage.setItem('user_skin_concerns', JSON.stringify(finalSkinConcerns)),
        AsyncStorage.setItem('user_skin_custom_concerns', JSON.stringify(finalSkinCustomList)),
        AsyncStorage.setItem('user_hair_type', selectedHairType),
        AsyncStorage.setItem('user_hair_concerns', JSON.stringify(finalHairConcerns)),
        AsyncStorage.setItem('user_hair_custom_concerns', JSON.stringify(finalHairCustomList)),
      ]);
      showSuccess('Skin & hair information updated successfully');
      router.back();
    } catch (error) {
      showError('Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetry = () => {
    router.replace('/(flow)/settings/health-information/edit/edit-skin-hair-condition');
  };

  // Determine number of columns based on screen width
  const getColumnsCount = () => {
    if (screenWidth < 380) return 1;
    if (screenWidth < 600) return 2;
    return 3;
  };

  const columns = getColumnsCount();

  // Combine predefined options with custom concerns
  const allSkinConcerns = [
    ...SKIN_CONCERNS_OPTIONS.filter((opt) => opt.value !== 'skin_other'),
    ...skinCustomConcernsList.map((concern, index) => ({
      id: `skin_custom_${index}`,
      label: concern,
      value: concern,
    })),
    { id: 'skin_other', label: 'Other', value: 'skin_other' },
  ];

  const allHairConcerns = [
    ...HAIR_CONCERNS_OPTIONS.filter((opt) => opt.value !== 'hair_other'),
    ...hairCustomConcernsList.map((concern, index) => ({
      id: `hair_custom_${index}`,
      label: concern,
      value: concern,
    })),
    { id: 'hair_other', label: 'Other', value: 'hair_other' },
  ];

  if (isRendering || isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1">
        {/* Vector BG */}
        <VectorBg />
        <LoadingScreen loadingText="Loading skin & hair data..." transparent={true} />
      </SafeAreaView>
    );
  }

  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Edit Skin & Hair" height={50} backButton={true} />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Edit Skin & Hair" height={50} backButton={true} />
      {/* Vector BG */}
      <VectorBg />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: LAYOUT.screen.scrollViewPaddingBottom + 40,
            paddingTop: 24,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}>
          <View
            className="px-container"
            style={{
              opacity: isContentReady ? 1 : 0,
              transform: [{ translateY: isContentReady ? 0 : 10 }],
            }}>
            {/* ==================== SKIN SECTION ==================== */}
            <Text className="mb-3 font-outfitMedium text-[18px]" style={{ color: '#2E2117' }}>
              Skin
            </Text>

            {/* Skin Type */}
            <Text className="mb-2 font-outfit text-[14px] text-titleTextColor">Skin Type</Text>
            <View className="mb-6 gap-3">
              {SKIN_TYPE.map((option) => {
                const isSelected = selectedSkinType === option.value;
                const activeColor = '#759A52';
                const inactiveColor = '#361A0D';
                const iconColor = isSelected ? activeColor : inactiveColor;

                return (
                  <PrimaryButton
                    key={option.id}
                    title={option.label}
                    onPress={() => setSelectedSkinType(option.value)}
                    leftIcon={option.leftIcon(iconColor)}
                    rightIcon={
                      <RadioButton
                        value={isSelected}
                        onValueChange={() => setSelectedSkinType(option.value)}
                        activeColor="#759A52"
                        inactiveColor="#FFFFFF80"
                        size={34}
                        innerCircleSize={20}
                      />
                    }
                    height={56}
                    gradientColors={['#e2d2c1', '#e2d2c1']}
                    textClassName={isSelected ? 'text-[#759A52]' : 'text-[#4A3F35]'}
                    textStyle={{
                      fontSize: 14,
                      fontFamily: 'Outfit-Regular',
                      width: '100%',
                      textAlign: 'left',
                      marginLeft: 40,
                    }}
                  />
                );
              })}
            </View>

            {/* Skin Concerns */}
            <Text className="mb-2 font-outfit text-[14px] text-titleTextColor">
              Skin Concerns (Select all that apply)
            </Text>
            <View className="mb-0 flex-row flex-wrap justify-between">
              {allSkinConcerns.map((option) => {
                const isSelected = selectedSkinConcerns.includes(option.value);
                const isOther = option.value === 'skin_other';

                if (isOther) {
                  return (
                    <View
                      key={option.id}
                      style={{
                        width: columns === 1 ? '100%' : `${100 / columns - 2}%`,
                        marginBottom: 12,
                      }}>
                      <PrimaryButton
                        title={option.label}
                        onPress={() => toggleSkinConcern(option.value)}
                        leftIcon={
                          <CheckIconButton
                            value={showSkinCustomInput}
                            onValueChange={() => toggleSkinConcern(option.value)}
                            activeColor="#759A52"
                            inactiveColor="#361A0D"
                            size={24}
                          />
                        }
                        height={56}
                        withShadow={true}
                        gradientColors={['#E8DDD0', '#E8DDD0']}
                        textClassName={showSkinCustomInput ? 'text-[#759A52]' : 'text-[#4A3F35]'}
                        textStyle={{
                          fontSize: columns === 1 ? 15 : 13,
                          fontFamily: 'Outfit-Medium',
                          textAlign: 'center',
                          flexWrap: 'wrap',
                          flexShrink: 1,
                          marginLeft: columns === 1 ? 0 : 8,
                        }}
                      />
                    </View>
                  );
                }

                return (
                  <View
                    key={option.id}
                    style={{
                      width: columns === 1 ? '100%' : `${100 / columns - 2}%`,
                      marginBottom: 12,
                    }}>
                    <PrimaryButton
                      title={option.label}
                      onPress={() => toggleSkinConcern(option.value)}
                      leftIcon={
                        <CheckIconButton
                          value={isSelected}
                          onValueChange={() => toggleSkinConcern(option.value)}
                          activeColor="#759A52"
                          inactiveColor="#361A0D"
                          size={24}
                        />
                      }
                      height={56}
                      withShadow={true}
                      gradientColors={['#E8DDD0', '#E8DDD0']}
                      textClassName={isSelected ? 'text-[#759A52]' : 'text-[#4A3F35]'}
                      textStyle={{
                        fontSize: columns === 1 ? 15 : 13,
                        fontFamily: 'Outfit-Medium',
                        textAlign: 'center',
                        flexWrap: 'wrap',
                        flexShrink: 1,
                        marginLeft: columns === 1 ? 0 : 8,
                      }}
                    />
                  </View>
                );
              })}
            </View>

            {/* Skin Custom Input Section */}
            {showSkinCustomInput && (
              <Animated.View
                style={{
                  marginTop: 16,
                  marginBottom: 16,
                  opacity: skinFadeAnim,
                  transform: [{ translateY: skinSlideAnim }],
                }}>
                <InputField
                  value={skinCustomConcern}
                  handler={(_, val) => setSkinCustomConcern(val)}
                  placeHolder="Enter your skin concern (e.g., Rosacea, Eczema, etc.)"
                  showLabel={false}
                  height={56}
                  withShadow={true}
                  borderRadius={100}
                  inputStyle={{ fontSize: 13 }}
                  animated={true}
                  animationDuration={200}
                  initialOpacity={0}
                />
              </Animated.View>
            )}

            {/* ==================== HAIR SECTION ==================== */}
            <Text className="mb-3 mt-4 font-outfitMedium text-[18px]" style={{ color: '#2E2117' }}>
              Hair
            </Text>

            {/* Hair Type */}
            <Text className="mb-2 font-outfit text-[14px] text-titleTextColor">Hair Type</Text>
            <View className="mb-6 gap-3">
              {HAIR_TYPE.map((option) => {
                const isSelected = selectedHairType === option.value;
                const activeColor = '#759A52';
                const inactiveColor = '#361A0D';
                const iconColor = isSelected ? activeColor : inactiveColor;

                return (
                  <PrimaryButton
                    key={option.id}
                    title={option.label}
                    onPress={() => setSelectedHairType(option.value)}
                    leftIcon={option.leftIcon(iconColor)}
                    rightIcon={
                      <RadioButton
                        value={isSelected}
                        onValueChange={() => setSelectedHairType(option.value)}
                        activeColor="#759A52"
                        inactiveColor="#FFFFFF80"
                        size={34}
                        innerCircleSize={20}
                      />
                    }
                    height={56}
                    gradientColors={['#e2d2c1', '#e2d2c1']}
                    textClassName={isSelected ? 'text-[#759A52]' : 'text-[#4A3F35]'}
                    textStyle={{
                      fontSize: 14,
                      fontFamily: 'Outfit-Regular',
                      width: '100%',
                      textAlign: 'left',
                      marginLeft: 40,
                    }}
                  />
                );
              })}
            </View>

            {/* Hair Concerns */}
            <Text className="mb-2 font-outfit text-[14px] text-titleTextColor">
              Hair Concerns (Select all that apply)
            </Text>
            <View className="mb-0 flex-row flex-wrap justify-between">
              {allHairConcerns.map((option) => {
                const isSelected = selectedHairConcerns.includes(option.value);
                const isOther = option.value === 'hair_other';

                if (isOther) {
                  return (
                    <View
                      key={option.id}
                      style={{
                        width: columns === 1 ? '100%' : `${100 / columns - 2}%`,
                        marginBottom: 12,
                      }}>
                      <PrimaryButton
                        title={option.label}
                        onPress={() => toggleHairConcern(option.value)}
                        leftIcon={
                          <CheckIconButton
                            value={showHairCustomInput}
                            onValueChange={() => toggleHairConcern(option.value)}
                            activeColor="#759A52"
                            inactiveColor="#361A0D"
                            size={24}
                          />
                        }
                        height={56}
                        withShadow={true}
                        gradientColors={['#E8DDD0', '#E8DDD0']}
                        textClassName={showHairCustomInput ? 'text-[#759A52]' : 'text-[#4A3F35]'}
                        textStyle={{
                          fontSize: columns === 1 ? 15 : 13,
                          fontFamily: 'Outfit-Medium',
                          textAlign: 'center',
                          flexWrap: 'wrap',
                          flexShrink: 1,
                          marginLeft: columns === 1 ? 0 : 8,
                        }}
                      />
                    </View>
                  );
                }

                return (
                  <View
                    key={option.id}
                    style={{
                      width: columns === 1 ? '100%' : `${100 / columns - 2}%`,
                      marginBottom: 12,
                    }}>
                    <PrimaryButton
                      title={option.label}
                      onPress={() => toggleHairConcern(option.value)}
                      leftIcon={
                        <CheckIconButton
                          value={isSelected}
                          onValueChange={() => toggleHairConcern(option.value)}
                          activeColor="#759A52"
                          inactiveColor="#361A0D"
                          size={24}
                        />
                      }
                      height={56}
                      withShadow={true}
                      gradientColors={['#E8DDD0', '#E8DDD0']}
                      textClassName={isSelected ? 'text-[#759A52]' : 'text-[#4A3F35]'}
                      textStyle={{
                        fontSize: columns === 1 ? 15 : 13,
                        fontFamily: 'Outfit-Medium',
                        textAlign: 'center',
                        flexWrap: 'wrap',
                        flexShrink: 1,
                        marginLeft: columns === 1 ? 0 : 8,
                      }}
                    />
                  </View>
                );
              })}
            </View>

            {/* Hair Custom Input Section */}
            {showHairCustomInput && (
              <Animated.View
                style={{
                  marginTop: 16,
                  marginBottom: 16,
                  opacity: hairFadeAnim,
                  transform: [{ translateY: hairSlideAnim }],
                }}>
                <InputField
                  value={hairCustomConcern}
                  handler={(_, val) => setHairCustomConcern(val)}
                  placeHolder="Enter your hair concern (e.g., Split ends, Frizz, etc.)"
                  showLabel={false}
                  height={56}
                  withShadow={true}
                  borderRadius={100}
                  inputStyle={{ fontSize: 13 }}
                  animated={true}
                  animationDuration={200}
                  initialOpacity={0}
                />
              </Animated.View>
            )}

            <View className="mt-6 gap-3">
              <PrimaryButton
                title={isSaving ? 'Saving...' : 'Save Changes'}
                onPress={handleSave}
                disabled={isSaving}
                isLoading={isSaving}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
