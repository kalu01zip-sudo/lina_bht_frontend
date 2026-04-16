// // app/(flow)/settings/health-information/edit-life-phase.tsx
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
// import PrimaryButton from '@/components/buttons/PrimaryButton';
// import { MenoPauseIcon, PeriodIcon, PostpartumIcon, PregnantIcon } from '@/components/icons';
// import { CheckInCircleIcon } from '@/components/icons/CheckInCircleIcon';

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

// export default function EditLifePhaseScreen() {
//   const router = useRouter();
//   const { showSuccess, showError } = useToast();

//   const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   useEffect(() => {
//     loadCurrentPhase();
//   }, []);

//   const loadCurrentPhase = async () => {
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

//   const handleSave = async () => {
//     if (!selectedPhase) {
//       showError('Please select a phase');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       await AsyncStorage.setItem('user_current_phase', selectedPhase);
//       showSuccess('Life phase updated successfully');
//       router.back();
//     } catch (error) {
//       showError('Failed to update');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleRetry = () => {
//     router.replace('/(flow)/settings/health-information/edit/edit-life-phase');
//   };

//   if (isRendering || isLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Loading..." />
//       </SafeAreaView>
//     );
//   }

//   if (renderError) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Edit Life Phase" height={50} backButton={true} />
//         <ErrorScreen message={renderError} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Edit Life Phase" height={50} backButton={true} />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 24,
//           flexGrow: 1,
//         }}
//         className="flex-1">
//         <View
//           className="px-container"
//           style={{
//             opacity: isContentReady ? 1 : 0,
//             transform: [{ translateY: isContentReady ? 0 : 10 }],
//           }}>
//           <Text className="mb-4 font-outfit text-[16px] text-titleTextColor">
//             Select your current phase
//           </Text>

//           <View className="gap-3">
//             {CURRENT_PHASE.map((option) => {
//               const isSelected = selectedPhase === option.value;
//               const activeColor = '#759A52';
//               const inactiveColor = '#361A0D';
//               const iconColor = isSelected ? activeColor : inactiveColor;

//               return (
//                 <PrimaryButton
//                   key={option.id}
//                   title={option.label}
//                   onPress={() => setSelectedPhase(option.value)}
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

//           <View className="mt-6 gap-3">
//             <PrimaryButton
//               title={isSaving ? 'Saving...' : 'Save Changes'}
//               onPress={handleSave}
//               disabled={isSaving}
//               isLoading={isSaving}
//             />
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// app/(flow)/settings/health-information/edit-life-phase.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, TextInput, TouchableOpacity } from 'react-native';
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
import { MenoPauseIcon, PeriodIcon, PostpartumIcon, PregnantIcon } from '@/components/icons';
import { CheckInCircleIcon } from '@/components/icons/CheckInCircleIcon';

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

export default function EditLifePhaseScreen() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [customPhase, setCustomPhase] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  useEffect(() => {
    loadCurrentPhase();
  }, []);

  const loadCurrentPhase = async () => {
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

  const handlePhaseSelect = (value: string) => {
    if (value === 'other') {
      setModalVisible(true);
    } else {
      setSelectedPhase(value);
    }
  };

  const handleSaveCustomPhase = () => {
    if (!customPhase.trim()) {
      showError('Please enter your current phase');
      return;
    }
    setSelectedPhase('other');
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!selectedPhase) {
      showError('Please select a phase');
      return;
    }

    setIsSaving(true);
    try {
      await AsyncStorage.setItem('user_current_phase', selectedPhase);

      if (selectedPhase === 'other' && customPhase.trim()) {
        await AsyncStorage.setItem('user_custom_phase', customPhase.trim());
      } else {
        await AsyncStorage.removeItem('user_custom_phase');
      }

      showSuccess('Life phase updated successfully');
      router.back();
    } catch (error) {
      console.error('Error saving phase:', error);
      showError('Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetry = () => {
    router.replace('/(flow)/settings/health-information/edit/edit-life-phase');
  };

  if (isRendering || isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading..." />
      </SafeAreaView>
    );
  }

  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Edit Life Phase" height={50} backButton={true} />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Edit Life Phase" height={50} backButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 24,
          flexGrow: 1,
        }}
        className="flex-1">
        <View
          className="px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          <Text className="mb-4 font-outfit text-[16px] text-titleTextColor">
            Select your current phase
          </Text>

          <View className="gap-3">
            {CURRENT_PHASE.map((option) => {
              const isSelected = selectedPhase === option.value;
              const activeColor = '#759A52';
              const inactiveColor = '#361A0D';
              const iconColor = isSelected ? activeColor : inactiveColor;

              return (
                <PrimaryButton
                  key={option.id}
                  title={option.label}
                  onPress={() => handlePhaseSelect(option.value)}
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

          {/* Show custom phase value if selected */}
          {selectedPhase === 'other' && customPhase && (
            <View className="mt-4 rounded-xl bg-[#F0E6D8] p-4">
              <Text className="mb-1 font-outfitMedium text-[14px] text-[#2A2118]">
                Your custom phase:
              </Text>
              <Text className="font-outfit text-[14px] text-[#2E2117B2]">{customPhase}</Text>
            </View>
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

      {/* Modal for custom phase input */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="m-6 w-11/12 max-w-md rounded-2xl bg-white p-6">
            <Text className="font-outfitBold mb-4 text-center text-xl text-[#361A0D]">
              Enter Your Current Phase
            </Text>

            <Text className="mb-2 font-outfit text-[14px] text-[#361A0D]">
              Please specify your current phase
            </Text>

            <TextInput
              className="mb-4 rounded-xl border border-[#e2d2c1] bg-[#f9f5f0] p-3 font-outfit text-[16px]"
              placeholder="e.g., Trying to conceive, Perimenopause, etc."
              placeholderTextColor="#999"
              value={customPhase}
              onChangeText={setCustomPhase}
              autoFocus={true}
              autoCapitalize="words"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-xl border border-[#e2d2c1] py-3"
                onPress={() => {
                  setModalVisible(false);
                  setCustomPhase('');
                }}>
                <Text className="text-center font-outfitMedium text-[#361A0D]">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-xl bg-[#759A52] py-3"
                onPress={handleSaveCustomPhase}>
                <Text className="text-center font-outfitMedium text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
