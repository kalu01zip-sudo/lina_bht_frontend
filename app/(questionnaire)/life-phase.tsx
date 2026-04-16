// import React, { useState } from 'react';
// import { View, Text } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import FormLayout from '@/components/layouts/FormLayout';
// import PrimaryButton from '@/components/buttons/PrimaryButton';

// import AuthFormTitle from '@/components/texts/auth/FormTitle';
// import { useToast } from '@/hooks/useToast';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import { MenoPauseIcon, PeriodIcon, PostpartumIcon, PregnantIcon } from '@/components/icons';
// import { CheckInCircleIcon } from '@/components/icons/CheckInCircleIcon';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// // const PrimaryButton = lazy(() => import('@/components/buttons/PrimaryButton'));
// const CURRENT_PHASE = [
//   {
//     id: 'period',
//     label: 'On my period',
//     value: 'period',
//     leftIcon: (color: string) => (
//       <PeriodIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
//     ),
//   },
//   {
//     id: 'pregnant',
//     label: 'Pregnant',
//     value: 'pregnant',
//     leftIcon: (color: string) => (
//       <PregnantIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
//     ),
//   },
//   {
//     id: 'postpartum',
//     label: 'Postpartum',
//     value: 'postpartum',
//     leftIcon: (color: string) => (
//       <PostpartumIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
//     ),
//   },
//   {
//     id: 'menopause',
//     label: 'Menopause',
//     value: 'menopause',
//     leftIcon: (color: string) => (
//       <MenoPauseIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
//     ),
//   },
// ];

// export default function LifePhaseScreen() {
//   const [selectedCurrentPhase, setSelectedCurrentPhase] = useState<string | null>(null);
//   const [isDealingWithAllergies, setIsDealingWithAllergies] = useState<boolean | null>(null);
//   const router = useRouter();
//   const { showError } = useToast();

//   // Use screen ready hook to prevent shadow spread
//   const { isRendering, renderError, isContentReady } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   const handleNext = async () => {
//     // Validate current phase selection
//     if (!selectedCurrentPhase) {
//       showError('Please select your current phase');
//       return;
//     }

//     // Validate allergy question
//     // if (isDealingWithAllergies === null) {
//     //   showError('Please answer whether you are dealing with allergies');
//     //   return;
//     // }

//     try {
//       // Save current phase
//       await AsyncStorage.setItem('user_current_phase', selectedCurrentPhase);

//       // Save allergy status
//       await AsyncStorage.setItem(
//         'user_is_dealing_with_allergies',
//         isDealingWithAllergies.toString()
//       );

//       // If user is dealing with allergies, navigate to allergies screen
//       if (isDealingWithAllergies) {
//         router.push('/(questionnaire)/allergies');
//       } else {
//         // Otherwise, go to skin hair condition
//         router.push('/(questionnaire)/skin-hair-condition');
//       }
//     } catch (error) {
//       console.error('Error saving data:', error);
//       showError('Failed to save. Please try again.');
//     }
//   };

//   const handleRetry = () => {
//     router.replace('/(questionnaire)/life-phase');
//   };

//   // Show loading while screen is rendering
//   if (isRendering) {
//     return <LoadingScreen loadingText="Getting to know you..." />;
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
//         <View className={'mb-10'}>
//           <AuthFormTitle numberOfLines={1} text="Life phase & health" />
//           <Text className="text-center font-outfit text-[14px] text-titleTextColor">
//             Tell us about yourself to personalize your experience
//           </Text>
//         </View>

//         {/* Current Phase Section */}
//         <View className="">
//           <Text className="font-outfit text-[18px] font-semibold text-titleTextColor">
//             Current Phase
//           </Text>
//           <Text className="mb-3 font-outfit text-[14px] text-titleTextColor">
//             What is your current phase?
//           </Text>
//           <View className="gap-3">
//             {CURRENT_PHASE.map((option) => {
//               const isSelected = selectedCurrentPhase === option.value;
//               const activeColor = '#759A52';
//               const inactiveColor = '#361A0D';
//               const iconColor = isSelected ? activeColor : inactiveColor;

//               return (
//                 <PrimaryButton
//                   key={option.id}
//                   title={option.label}
//                   onPress={() => setSelectedCurrentPhase(option.value)}
//                   leftIcon={option.leftIcon(iconColor)}
//                   rightIcon={
//                     isSelected ? (
//                       <CheckInCircleIcon size={24} color="#759A52" style={{ marginRight: 6 }} />
//                     ) : (
//                       <CheckInCircleIcon size={24} color="#361A0D" style={{ marginRight: 6 }} />
//                     )
//                   }
//                   height={54}
//                   gradientColors={['#e2d2c1', '#e2d2c1']}
//                   textClassName={isSelected ? 'text-[#759A52]' : 'text-[#4A3F35]'}
//                   textStyle={{
//                     fontSize: 14,
//                     fontFamily: 'Outfit-Regular',
//                     width: '100%',
//                     textAlign: 'left',
//                     marginLeft: 24,
//                   }}
//                 />
//               );
//             })}
//           </View>
//         </View>

//         <Text className="mt-6 font-outfitMedium text-[16px]" style={{ color: '#361A0D' }}>
//           Are you currently in the stage of selecting or eliminating allergies?
//         </Text>

//         <View className="my-6 h-[1px] bg-[#361A0D77]" />

//         <View className="flex-row items-center justify-between gap-3">
//           <PrimaryButton
//             textStyle={{ fontFamily: 'Outfit-Medium', fontSize: 14 }}
//             title="Yes, I am"
//             height={45}
//             onPress={() => {
//               setIsDealingWithAllergies(true);
//               handleNext();
//             }}
//             className="flex-1"
//           />
//           <PrimaryButton
//             textStyle={{ fontFamily: 'Outfit-Medium', fontSize: 14 }}
//             title="No, not yet"
//             height={45}
//             onPress={() => {
//               setIsDealingWithAllergies(false);
//               handleNext();
//             }}
//             className="flex-1"
//           />
//         </View>
//       </View>
//     </FormLayout>
//   );
// }

// import React, { useState } from 'react';
// import { View, Text } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import FormLayout from '@/components/layouts/FormLayout';
// import PrimaryButton from '@/components/buttons/PrimaryButton';

// import AuthFormTitle from '@/components/texts/auth/FormTitle';
// import { useToast } from '@/hooks/useToast';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import { MenoPauseIcon, PeriodIcon, PostpartumIcon, PregnantIcon } from '@/components/icons';
// import { CheckInCircleIcon } from '@/components/icons/CheckInCircleIcon';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';

// const CURRENT_PHASE = [
//   {
//     id: 'period',
//     label: 'On my period',
//     value: 'period',
//     leftIcon: (color: string) => (
//       <PeriodIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
//     ),
//   },
//   {
//     id: 'pregnant',
//     label: 'Pregnant',
//     value: 'pregnant',
//     leftIcon: (color: string) => (
//       <PregnantIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
//     ),
//   },
//   {
//     id: 'postpartum',
//     label: 'Postpartum',
//     value: 'postpartum',
//     leftIcon: (color: string) => (
//       <PostpartumIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
//     ),
//   },
//   {
//     id: 'menopause',
//     label: 'Menopause',
//     value: 'menopause',
//     leftIcon: (color: string) => (
//       <MenoPauseIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
//     ),
//   },
// ];

// export default function LifePhaseScreen() {
//   const [selectedCurrentPhase, setSelectedCurrentPhase] = useState<string | null>(null);
//   const [isDealingWithAllergies, setIsDealingWithAllergies] = useState<boolean | null>(null);
//   const router = useRouter();
//   const { showError } = useToast();

//   // Use screen ready hook to prevent shadow spread
//   const { isRendering, renderError, isContentReady } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   const handleNext = async () => {
//     // Validate current phase selection
//     if (!selectedCurrentPhase) {
//       showError('Please select your current phase');
//       return;
//     }

//     // Validate allergy question
//     if (isDealingWithAllergies === null) {
//       showError('Please answer whether you are dealing with allergies');
//       return;
//     }

//     try {
//       // Save current phase
//       await AsyncStorage.setItem('user_current_phase', selectedCurrentPhase);

//       // Save allergy status - now safe because we validated it's not null
//       await AsyncStorage.setItem(
//         'user_is_dealing_with_allergies',
//         isDealingWithAllergies.toString()
//       );

//       // If user is dealing with allergies, navigate to allergies screen
//       if (isDealingWithAllergies) {
//         router.push('/(questionnaire)/allergies');
//       } else {
//         // Otherwise, go to skin hair condition
//         router.push('/(questionnaire)/skin-hair-condition');
//       }
//     } catch (error) {
//       console.error('Error saving data:', error);
//       showError('Failed to save. Please try again.');
//     }
//   };

//   const handleRetry = () => {
//     router.replace('/(questionnaire)/life-phase');
//   };

//   // Show loading while screen is rendering
//   if (isRendering) {
//     return <LoadingScreen loadingText="Getting to know you..." />;
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
//         <View className={'mb-10'}>
//           <AuthFormTitle numberOfLines={1} text="Life phase & health" />
//           <Text className="text-center font-outfit text-[14px] text-titleTextColor">
//             Tell us about yourself to personalize your experience
//           </Text>
//         </View>

//         {/* Current Phase Section */}
//         <View className="">
//           <Text className="font-outfit text-[18px] font-semibold text-titleTextColor">
//             Current Phase
//           </Text>
//           <Text className="mb-3 font-outfit text-[14px] text-titleTextColor">
//             What is your current phase?
//           </Text>
//           <View className="gap-3">
//             {CURRENT_PHASE.map((option) => {
//               const isSelected = selectedCurrentPhase === option.value;
//               const activeColor = '#759A52';
//               const inactiveColor = '#361A0D';
//               const iconColor = isSelected ? activeColor : inactiveColor;

//               return (
//                 <PrimaryButton
//                   key={option.id}
//                   title={option.label}
//                   onPress={() => setSelectedCurrentPhase(option.value)}
//                   leftIcon={option.leftIcon(iconColor)}
//                   rightIcon={
//                     isSelected ? (
//                       <CheckInCircleIcon size={24} color="#759A52" style={{ marginRight: 6 }} />
//                     ) : (
//                       <CheckInCircleIcon size={24} color="#361A0D" style={{ marginRight: 6 }} />
//                     )
//                   }
//                   height={54}
//                   gradientColors={['#e2d2c1', '#e2d2c1']}
//                   textClassName={isSelected ? 'text-[#759A52]' : 'text-[#4A3F35]'}
//                   textStyle={{
//                     fontSize: 14,
//                     fontFamily: 'Outfit-Regular',
//                     width: '100%',
//                     textAlign: 'left',
//                     marginLeft: 24,
//                   }}
//                 />
//               );
//             })}
//           </View>
//         </View>

//         <Text className="mt-6 font-outfitMedium text-[16px]" style={{ color: '#361A0D' }}>
//           Are you currently in the stage of selecting or eliminating allergies?
//         </Text>

//         <View className="my-6 h-[1px] bg-[#361A0D77]" />

//         <View className="flex-row items-center justify-between gap-3">
//           <PrimaryButton
//             textStyle={{ fontFamily: 'Outfit-Medium', fontSize: 14 }}
//             title="Yes, I am"
//             height={45}
//             onPress={() => {
//               setIsDealingWithAllergies(true);
//               handleNext();
//             }}
//             className="flex-1"
//           />
//           <PrimaryButton
//             textStyle={{ fontFamily: 'Outfit-Medium', fontSize: 14 }}
//             title="No, not yet"
//             height={45}
//             onPress={() => {
//               setIsDealingWithAllergies(false);
//               handleNext();
//             }}
//             className="flex-1"
//           />
//         </View>
//       </View>
//     </FormLayout>
//   );
// }

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormLayout from '@/components/layouts/FormLayout';
import PrimaryButton from '@/components/buttons/PrimaryButton';

import AuthFormTitle from '@/components/texts/auth/FormTitle';
import { useToast } from '@/hooks/useToast';
import { useScreenReady } from '@/hooks/useScreenReady';
import { MenoPauseIcon, PeriodIcon, PostpartumIcon, PregnantIcon } from '@/components/icons';
import { CheckInCircleIcon } from '@/components/icons/CheckInCircleIcon';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';

const CURRENT_PHASE = [
  {
    id: 'period',
    label: 'On my period',
    value: 'period',
    leftIcon: (color: string) => (
      <PeriodIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'pregnant',
    label: 'Pregnant',
    value: 'pregnant',
    leftIcon: (color: string) => (
      <PregnantIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'postpartum',
    label: 'Postpartum',
    value: 'postpartum',
    leftIcon: (color: string) => (
      <PostpartumIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'menopause',
    label: 'Menopause',
    value: 'menopause',
    leftIcon: (color: string) => (
      <MenoPauseIcon width={24} height={24} color={color} style={{ marginLeft: 6 }} />
    ),
  },
  {
    id: 'other',
    label: 'Other',
    value: 'other',
    leftIcon: (color: string) => null,
  },
];

export default function LifePhaseScreen() {
  const [selectedCurrentPhase, setSelectedCurrentPhase] = useState<string | null>(null);
  const [isDealingWithAllergies, setIsDealingWithAllergies] = useState<boolean | null>(null);
  const router = useRouter();
  const { showError } = useToast();

  const { isRendering, renderError, isContentReady } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  const handleAllergyResponse = (value: boolean) => {
    setIsDealingWithAllergies(value);
    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      handleNext(value);
    }, 0);
  };

  const handleNext = async (allergyValue: boolean) => {
    // Validate current phase selection
    if (!selectedCurrentPhase) {
      showError('Please select your current phase');
      return;
    }

    try {
      // Save current phase
      await AsyncStorage.setItem('user_current_phase', selectedCurrentPhase);

      // Save allergy status
      await AsyncStorage.setItem('user_is_dealing_with_allergies', allergyValue.toString());

      // If user is dealing with allergies, navigate to allergies screen
      if (allergyValue) {
        router.push('/(questionnaire)/allergies');
      } else {
        // Otherwise, go to skin hair condition
        router.push('/(questionnaire)/skin-hair-condition');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showError('Failed to save. Please try again.');
    }
  };

  const handleRetry = () => {
    router.replace('/(questionnaire)/life-phase');
  };

  if (isRendering) {
    return <LoadingScreen loadingText="Getting to know you..." />;
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
        <View className={'mb-10'}>
          <AuthFormTitle numberOfLines={1} text="Life phase & health" />
          <Text className="text-center font-outfit text-[14px] text-titleTextColor">
            Tell us about yourself to personalize your experience
          </Text>
        </View>

        <View className="">
          <Text className="font-outfit text-[18px] font-semibold text-titleTextColor">
            Current Phase
          </Text>
          <Text className="mb-3 font-outfit text-[14px] text-titleTextColor">
            What is your current phase?
          </Text>
          <View className="gap-3">
            {CURRENT_PHASE.map((option) => {
              const isSelected = selectedCurrentPhase === option.value;
              const activeColor = '#759A52';
              const inactiveColor = '#361A0D';
              const iconColor = isSelected ? activeColor : inactiveColor;

              return (
                <PrimaryButton
                  key={option.id}
                  title={option.label}
                  onPress={() => setSelectedCurrentPhase(option.value)}
                  leftIcon={option.leftIcon ? option.leftIcon(iconColor) : null}
                  rightIcon={
                    isSelected ? (
                      <CheckInCircleIcon size={24} color="#759A52" style={{ marginRight: 6 }} />
                    ) : (
                      <CheckInCircleIcon size={24} color="#361A0D" style={{ marginRight: 6 }} />
                    )
                  }
                  height={54}
                  gradientColors={['#e2d2c1', '#e2d2c1']}
                  textClassName={isSelected ? 'text-[#759A52]' : 'text-[#4A3F35]'}
                  textStyle={{
                    fontSize: 14,
                    fontFamily: 'Outfit-Regular',
                    width: '100%',
                    textAlign: 'left',
                    marginLeft: 24,
                  }}
                />
              );
            })}
          </View>
        </View>

        <Text className="mt-6 font-outfitMedium text-[16px]" style={{ color: '#361A0D' }}>
          Are you currently in the stage of selecting or eliminating allergies?
        </Text>

        <View className="my-6 h-[1px] bg-[#361A0D77]" />

        <View className="flex-row items-center justify-between gap-3">
          <PrimaryButton
            textStyle={{ fontFamily: 'Outfit-Medium', fontSize: 14 }}
            title="Yes, I am"
            height={45}
            onPress={() => handleAllergyResponse(true)}
            className="flex-1"
          />
          <PrimaryButton
            textStyle={{ fontFamily: 'Outfit-Medium', fontSize: 14 }}
            title="No, not yet"
            height={45}
            onPress={() => handleAllergyResponse(false)}
            className="flex-1"
          />
        </View>
      </View>
    </FormLayout>
  );
}
