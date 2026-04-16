// // app/(flow)/settings/health-information/life-phase-health.tsx
// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import { useToast } from '@/hooks/useToast';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// import PrimaryVariantButton from '@/components/buttons/PrimaryVariantButton';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { InfoRow } from '@/components/personalInfo/InfoRow';
// import { MenoPauseIcon, PeriodIcon, PostpartumIcon, PregnantIcon } from '@/components/icons';

// const CURRENT_PHASE = [
//   {
//     id: 'period',
//     label: 'On my period',
//     value: 'period',
//   },
//   {
//     id: 'pregnant',
//     label: 'Pregnant',
//     value: 'pregnant',
//   },
//   {
//     id: 'postpartum',
//     label: 'Postpartum',
//     value: 'postpartum',
//   },
//   {
//     id: 'menopause',
//     label: 'Menopause',
//     value: 'menopause',
//   },
// ];

// export default function LifePhaseHealthScreen() {
//   const router = useRouter();
//   const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // TODO: Replace with actual user gender from API when integrating
//   const userGender = 'Female'; // Change to 'Male' to test different scenarios
//   const isFemale = userGender === 'Female';

//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   useEffect(() => {
//     loadPhase();
//   }, []);

//   const loadPhase = async () => {
//     try {
//       const savedPhase = await AsyncStorage.getItem('user_current_phase');
//       if (savedPhase) {
//         setSelectedPhase(savedPhase);
//       }
//     } catch (error) {
//       console.error('Error loading phase:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getPhaseLabel = (phaseValue: string) => {
//     const phase = CURRENT_PHASE.find((p) => p.value === phaseValue);
//     return phase?.label || 'Not set';
//   };

//   const handleEdit = () => {
//     router.push('/(flow)/settings/health-information/edit/edit-life-phase');
//   };

//   const handleRetry = () => {
//     router.replace('/(flow)/settings/health-information/life-phase-health');
//   };

//   if (isRendering || isLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Loading health information..." />
//       </SafeAreaView>
//     );
//   }

//   if (renderError) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Life Phase & Health" height={50} backButton={true} />
//         <ErrorScreen message={renderError} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1  bg-backgroundColor">
//       <CustomHeader title="Life Phase & Health" height={50} backButton={true} />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 30,
//           flexGrow: 1,
//         }}
//         className="flex-1 ">
//         <View
//           className="px-container"
//           style={{
//             opacity: isContentReady ? 1 : 0,
//             transform: [{ translateY: isContentReady ? 0 : 10 }],
//           }}>
//           {isFemale ? (
//             <>
//               <InfoRow
//                 label="Current Phase"
//                 value={selectedPhase ? getPhaseLabel(selectedPhase) : 'Not set'}
//                 isEditing={false}
//                 labelColor="#2E2117"
//                 valueColor="#2E2117B2"
//               />

//               <PrimaryVariantButton
//                 onPress={handleEdit}
//                 borderTopLeftRadius={24}
//                 borderTopRightRadius={24}
//                 borderBottomLeftRadius={24}
//                 borderBottomRightRadius={24}
//                 title="Edit Phase"
//                 style={{ marginTop: 24 }}
//               />
//             </>
//           ) : (
//             <BorderlessShadowCard
//               b_tl={24}
//               b_tr={24}
//               b_bl={24}
//               b_br={24}
//               style={{
//                 paddingVertical: 24,
//                 paddingHorizontal: 20,
//                 alignItems: 'center',
//                 marginTop: 12,
//               }}>
//               <Text className="text-center font-outfit text-[16px]" style={{ color: '#2E2117' }}>
//                 Life phase tracking is specifically designed for women&apos;s health cycles.
//               </Text>
//               <Text
//                 className="mt-2 text-center font-outfit text-[14px]"
//                 style={{ color: '#2E2117B2' }}>
//                 This feature helps track menstrual cycles, pregnancy, and menopause stages.
//               </Text>
//             </BorderlessShadowCard>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// app/(flow)/settings/health-information/life-phase-health.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { useToast } from '@/hooks/useToast';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import PrimaryVariantButton from '@/components/buttons/PrimaryVariantButton';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { InfoRow } from '@/components/personalInfo/InfoRow';
import { MenoPauseIcon, PeriodIcon, PostpartumIcon, PregnantIcon } from '@/components/icons';

const CURRENT_PHASE = [
  {
    id: 'period',
    label: 'On my period',
    value: 'period',
  },
  {
    id: 'pregnant',
    label: 'Pregnant',
    value: 'pregnant',
  },
  {
    id: 'postpartum',
    label: 'Postpartum',
    value: 'postpartum',
  },
  {
    id: 'menopause',
    label: 'Menopause',
    value: 'menopause',
  },
  {
    id: 'other',
    label: 'Other',
    value: 'other',
  },
];

export default function LifePhaseHealthScreen() {
  const router = useRouter();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [customPhase, setCustomPhase] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Replace with actual user gender from API when integrating
  const userGender = 'Female'; // Change to 'Male' to test different scenarios
  const isFemale = userGender === 'Female';

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  useEffect(() => {
    loadPhase();
  }, []);

  const loadPhase = async () => {
    try {
      const savedPhase = await AsyncStorage.getItem('user_current_phase');
      const savedCustomPhase = await AsyncStorage.getItem('user_custom_phase');

      if (savedPhase) {
        setSelectedPhase(savedPhase);
        if (savedPhase === 'other' && savedCustomPhase) {
          setCustomPhase(savedCustomPhase);
        }
      }
    } catch (error) {
      console.error('Error loading phase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPhaseLabel = (phaseValue: string) => {
    if (phaseValue === 'other' && customPhase) {
      return customPhase;
    }
    const phase = CURRENT_PHASE.find((p) => p.value === phaseValue);
    return phase?.label || 'Not set';
  };

  const getPhaseIcon = () => {
    switch (selectedPhase) {
      case 'period':
        return <PeriodIcon width={20} height={20} color="#7A8B6A" />;
      case 'pregnant':
        return <PregnantIcon width={20} height={20} color="#7A8B6A" />;
      case 'postpartum':
        return <PostpartumIcon width={20} height={20} color="#7A8B6A" />;
      case 'menopause':
        return <MenoPauseIcon width={20} height={20} color="#7A8B6A" />;
      default:
        return null;
    }
  };

  const handleEdit = () => {
    router.push('/(flow)/settings/health-information/edit/edit-life-phase');
  };

  const handleRetry = () => {
    router.replace('/(flow)/settings/health-information/life-phase-health');
  };

  if (isRendering || isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading health information..." />
      </SafeAreaView>
    );
  }

  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Life Phase & Health" height={50} backButton={true} />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Life Phase & Health" height={50} backButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 30,
          flexGrow: 1,
        }}
        className="flex-1">
        <View
          className="px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          {isFemale ? (
            <>
              <InfoRow
                label="Current Phase"
                value={selectedPhase ? getPhaseLabel(selectedPhase) : 'Not set'}
                isEditing={false}
                labelColor="#2E2117"
                valueColor="#2E2117B2"
              />

              {/* Show custom phase badge if applicable */}
              {selectedPhase === 'other' && customPhase && (
                <View className="mt-2 flex-row items-center gap-2">
                  {getPhaseIcon()}
                  <Text className="font-outfit text-[12px]" style={{ color: '#7A8B6A' }}>
                    Custom phase
                  </Text>
                </View>
              )}

              <PrimaryVariantButton
                onPress={handleEdit}
                borderTopLeftRadius={24}
                borderTopRightRadius={24}
                borderBottomLeftRadius={24}
                borderBottomRightRadius={24}
                title="Edit Phase"
                style={{ marginTop: 24 }}
              />
            </>
          ) : (
            <BorderlessShadowCard
              b_tl={24}
              b_tr={24}
              b_bl={24}
              b_br={24}
              style={{
                paddingVertical: 24,
                paddingHorizontal: 20,
                alignItems: 'center',
                marginTop: 12,
              }}>
              <Text className="text-center font-outfit text-[16px]" style={{ color: '#2E2117' }}>
                Life phase tracking is specifically designed for women&apos;s health cycles.
              </Text>
              <Text
                className="mt-2 text-center font-outfit text-[14px]"
                style={{ color: '#2E2117B2' }}>
                This feature helps track menstrual cycles, pregnancy, and menopause stages.
              </Text>
            </BorderlessShadowCard>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
