// app/(questionnaire)/life-phase.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormLayout from '@/components/layouts/FormLayout';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import AuthFormTitle from '@/components/texts/auth/FormTitle';
import { useToast } from '@/hooks/useToast';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { OptionCards } from '@/components/lifePhase/OptionCards';
import { PhaseSelection } from '@/components/lifePhase/PhaseSelection';
import { PregnancyDetails } from '@/components/lifePhase/PregnancyDetails';
import { CustomPhaseInput } from '@/components/lifePhase/CustomPhaseInput';
import { CURRENT_PHASE } from '@/constants/lifePhaseConstants';

export default function LifePhaseScreen() {
  const [selectedCurrentPhase, setSelectedCurrentPhase] = useState<string | null>(null);
  const [showPhaseSelection, setShowPhaseSelection] = useState(false);
  const [customPhase, setCustomPhase] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [pregnancyMonth, setPregnancyMonth] = useState(1);
  const [isPhaseContentReady, setIsPhaseContentReady] = useState(false);
  const router = useRouter();
  const { showError } = useToast();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const continueButtonAnim = useRef(new Animated.Value(0)).current;

  const { isRendering, renderError, isContentReady } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  useEffect(() => {
    if (showPhaseSelection) {
      // Show loading briefly then animate
      setIsPhaseContentReady(false);
      setTimeout(() => {
        setIsPhaseContentReady(true);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }, 50);
    }
  }, [showPhaseSelection]);

  useEffect(() => {
    const shouldShowButton = () => {
      if (!selectedCurrentPhase) return false;
      if (selectedCurrentPhase === 'other' && !customPhase.trim()) return false;
      return true;
    };

    if (shouldShowButton()) {
      Animated.timing(continueButtonAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      continueButtonAnim.setValue(0);
    }
  }, [selectedCurrentPhase, customPhase]);

  const handleOptionSelect = async (option: 'none' | 'issues') => {
    if (option === 'none') {
      await AsyncStorage.setItem('user_has_health_conditions', 'false');
      await AsyncStorage.setItem('user_current_phase', 'none');
      // router.push('/(questionnaire)/skin-hair-condition');
      router.push('/(questionnaire)/allergies');
    } else {
      setShowPhaseSelection(true);
    }
  };

  const handlePhaseSelect = (phaseValue: string) => {
    if (phaseValue === 'other') {
      setShowCustomInput(true);
      setSelectedCurrentPhase('other');
    } else {
      setShowCustomInput(false);
      setSelectedCurrentPhase(phaseValue);
    }
  };

  const handleMonthChange = (increment: boolean) => {
    if (increment && pregnancyMonth < 9) setPregnancyMonth(pregnancyMonth + 1);
    else if (!increment && pregnancyMonth > 1) setPregnancyMonth(pregnancyMonth - 1);
  };

  const handleMonthSelect = (month: number) => setPregnancyMonth(month);

  const handleContinue = async () => {
    if (!selectedCurrentPhase) {
      showError('Please select your current phase');
      return;
    }
    if (selectedCurrentPhase === 'other' && !customPhase.trim()) {
      showError('Please enter your current phase');
      return;
    }

    try {
      await AsyncStorage.setItem('user_has_health_conditions', 'true');
      await AsyncStorage.setItem('user_current_phase', selectedCurrentPhase);
      if (selectedCurrentPhase === 'other')
        await AsyncStorage.setItem('user_custom_phase', customPhase.trim());
      if (selectedCurrentPhase === 'pregnant')
        await AsyncStorage.setItem('user_pregnancy_month', pregnancyMonth.toString());
      // router.push('/(questionnaire)/skin-hair-condition');
      router.push('/(questionnaire)/allergies');
    } catch (error) {
      showError('Failed to save. Please try again.');
    }
  };

  if (isRendering) return <LoadingScreen loadingText="Getting to know you..." />;
  if (renderError)
    return (
      <FormLayout>
        <ErrorScreen
          message={renderError}
          onRetry={() => router.replace('/(questionnaire)/life-phase')}
        />
      </FormLayout>
    );

  return (
    <FormLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <View
            className="px-container py-9"
            style={{
              opacity: isContentReady ? 1 : 0,
              transform: [{ translateY: isContentReady ? 0 : 10 }],
            }}>
            <View className={'mb-10'}>
              <AuthFormTitle numberOfLines={1} text="Life phase & health" />
              <Text className="text-center font-outfit text-[14px] text-titleTextColor">
                Tell us about yourself to personalize your experience
              </Text>
            </View>

            <OptionCards
              onSelectNone={() => handleOptionSelect('none')}
              onSelectIssues={() => handleOptionSelect('issues')}
            />

            {showPhaseSelection && (
              <Animated.View
                style={{
                  marginTop: 24,
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}>
                {!isPhaseContentReady ? (
                  // Loading state while content prepares
                  <View className="items-center justify-center py-8">
                    <ActivityIndicator size="small" color="#759A52" />
                    <Text className="text-descriptionTextColor mt-2 font-outfit text-[12px]">
                      Loading options...
                    </Text>
                  </View>
                ) : (
                  <>
                    <PhaseSelection
                      phases={CURRENT_PHASE}
                      selectedPhase={selectedCurrentPhase}
                      onSelectPhase={handlePhaseSelect}
                    />

                    {selectedCurrentPhase === 'pregnant' && (
                      <PregnancyDetails
                        pregnancyMonth={pregnancyMonth}
                        onMonthChange={handleMonthChange}
                        onMonthSelect={handleMonthSelect}
                      />
                    )}

                    {showCustomInput && (
                      <CustomPhaseInput value={customPhase} onChange={setCustomPhase} />
                    )}

                    {((selectedCurrentPhase && selectedCurrentPhase !== 'other') ||
                      (selectedCurrentPhase === 'other' && customPhase.trim())) && (
                      <Animated.View
                        style={{
                          marginTop: 24,
                          marginBottom: 40,
                          opacity: continueButtonAnim,
                          transform: [
                            {
                              scale: continueButtonAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.95, 1],
                              }),
                            },
                          ],
                        }}>
                        <PrimaryButton
                          style={{ marginTop: 0 }}
                          title="Continue"
                          onPress={handleContinue}
                          gradientColors={['#e2d2c1', '#e2d2c1']}
                          textStyle={{
                            fontSize: 14,
                            fontFamily: 'Outfit-Medium',
                          }}
                        />
                      </Animated.View>
                    )}
                  </>
                )}
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormLayout>
  );
}
