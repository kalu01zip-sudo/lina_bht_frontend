// // app/(flow)/tutorial-details/index.tsx
// import React, { useState, useEffect } from 'react';
// import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { TutorialVideoPlayer } from '@/components/tutorials/TutorialVideoPlayer';
// import { useTutorials } from '@/hooks/useTutorials';
// import { useToast } from '@/hooks/useToast';

// export default function TutorialDetailsScreen() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { showError } = useToast();
//   const [tutorial, setTutorial] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const tutorialId = Array.isArray(id) ? id[0] : id;

//   useEffect(() => {
//     fetchTutorialDetails();
//   }, [tutorialId]);

//   const fetchTutorialDetails = async () => {
//     try {
//       setIsLoading(true);

//       // TODO: Replace with actual API call
//       // const response = await fetch(`https://api.yourdomain.com/tutorials/${tutorialId}`);
//       // const data = await response.json();
//       // setTutorial(data);

//       // Mock: Find tutorial from list
//       const { tutorials } = useTutorials();
//       // For now, using mock data directly
//       const mockTutorials = [
//         {
//           id: '1',
//           title: 'Morning Depuffing',
//           description: 'Quick 3-minute routine to reduce morning puffiness',
//           videoUrl: 'https://youtu.be/dQw4w9WgXcQ',
//           duration: '3 mins',
//           category: 'face',
//           benefits: ['Reduces puffiness', 'Improves circulation', 'Wakes up skin'],
//           steps: [
//             'Start with clean hands and face',
//             'Use gentle pressure - never press too hard',
//             'Move from center of face outward',
//             'Repeat each movement 3-5 times',
//           ],
//         },
//       ];

//       const found = mockTutorials.find(t => t.id === tutorialId);
//       if (found) {
//         setTutorial(found);
//       } else {
//         showError('Tutorial not found');
//       }
//     } catch (error) {
//       console.error('Error fetching tutorial:', error);
//       showError('Failed to load tutorial');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Tutorial" height={50} backButton={true} />
//         <View className="flex-1 items-center justify-center">
//           <ActivityIndicator size="large" color="#977857" />
//           <Text className="mt-4 font-outfit text-[14px] text-descriptionTextColor">
//             Loading tutorial...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (!tutorial) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Tutorial" height={50} backButton={true} />
//         <View className="flex-1 items-center justify-center">
//           <Text className="font-outfit text-[16px] text-descriptionTextColor">
//             Tutorial not found
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Tutorial" height={50} backButton={true} />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 20,
//         }}
//         className="flex-1">
//         <View className="px-container">
//           {/* Video Player */}
//           <TutorialVideoPlayer videoUrl={tutorial.videoUrl} />

//           {/* Title */}
//           <Text className="font-outfitBold text-[24px]" style={{ color: '#361A0D' }}>
//             {tutorial.title}
//           </Text>

//           {/* Duration */}
//           <View className="mt-2 flex-row items-center gap-1">
//             <Text className="font-outfit text-[12px]" style={{ color: '#2E2117CC' }}>
//               Duration: {tutorial.duration}
//             </Text>
//           </View>

//           {/* Divider */}
//           <View className="my-4 h-[1px] bg-[#2E2117]/10" />

//           {/* Description */}
//           <BorderlessShadowCard style={{ marginBottom: 16, padding: 20 }}>
//             <Text className="font-outfitSemiBold text-[18px] text-titleTextColor mb-3">
//               About this tutorial
//             </Text>
//             <Text className="font-outfit text-[14px] text-descriptionTextColor leading-5">
//               {tutorial.description}
//             </Text>
//           </BorderlessShadowCard>

//           {/* Benefits */}
//           {tutorial.benefits && tutorial.benefits.length > 0 && (
//             <BorderlessShadowCard style={{ marginBottom: 16, padding: 20 }}>
//               <Text className="font-outfitSemiBold text-[18px] text-titleTextColor mb-3">
//                 Benefits
//               </Text>
//               {tutorial.benefits.map((benefit: string, index: number) => (
//                 <View key={index} className="flex-row items-start gap-2 mb-2">
//                   <Text className="text-[16px]">•</Text>
//                   <Text className="flex-1 font-outfit text-[14px] text-descriptionTextColor">
//                     {benefit}
//                   </Text>
//                 </View>
//               ))}
//             </BorderlessShadowCard>
//           )}

//           {/* Steps */}
//           {tutorial.steps && tutorial.steps.length > 0 && (
//             <BorderlessShadowCard style={{ marginBottom: 16, padding: 20 }}>
//               <Text className="font-outfitSemiBold text-[18px] text-titleTextColor mb-3">
//                 Step by Step
//               </Text>
//               {tutorial.steps.map((step: string, index: number) => (
//                 <View key={index} className="flex-row items-start gap-2 mb-3">
//                   <View className="w-6 h-6 rounded-full bg-[#97785720] items-center justify-center">
//                     <Text className="font-outfitMedium text-[12px] text-[#977857]">
//                       {index + 1}
//                     </Text>
//                   </View>
//                   <Text className="flex-1 font-outfit text-[14px] text-descriptionTextColor">
//                     {step}
//                   </Text>
//                 </View>
//               ))}
//             </BorderlessShadowCard>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// app/(flow)/tutorial-details/index.tsx (using hook properly)
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { TutorialVideoPlayer } from '@/components/tutorials/TutorialVideoPlayer';
import { useTutorials } from '@/hooks/useTutorials';
import { useToast } from '@/hooks/useToast';

export default function TutorialDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showError } = useToast();
  const { tutorials, isLoading: isTutorialsLoading } = useTutorials();
  const [tutorial, setTutorial] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tutorialId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (!isTutorialsLoading && tutorials.length > 0) {
      const found = tutorials.find((t) => t.id === tutorialId);
      if (found) {
        setTutorial(found);
      } else {
        showError('Tutorial not found');
      }
      setIsLoading(false);
    }
  }, [tutorials, isTutorialsLoading, tutorialId]);

  if (isLoading || isTutorialsLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Tutorial" height={50} backButton={true} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#977857" />
          <Text className="text-descriptionTextColor mt-4 font-outfit text-[14px]">
            Loading tutorial...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!tutorial) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Tutorial" height={50} backButton={true} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-descriptionTextColor font-outfit text-[16px]">
            Tutorial not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Tutorial" height={50} backButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 20,
        }}
        className="flex-1">
        <View className="px-container">
          {/* Video Player */}
          <TutorialVideoPlayer videoUrl={tutorial.videoUrl} />

          {/* Title */}
          <Text className="font-outfitBold text-[24px]" style={{ color: '#361A0D' }}>
            {tutorial.title}
          </Text>

          {/* Duration */}
          <View className="mt-2 flex-row items-center gap-1">
            <Text className="font-outfit text-[12px]" style={{ color: '#2E2117CC' }}>
              Duration: {tutorial.duration}
            </Text>
          </View>

          {/* Divider */}
          <View className="my-4 h-[1px] bg-[#2E2117]/10" />

          {/* Description */}
          <BorderlessShadowCard
            b_tl={24}
            b_tr={24}
            b_bl={0}
            b_br={0}
            style={{ marginBottom: 10, padding: 20 }}>
            <Text className="mb-2 font-outfitMedium text-[18px] text-titleTextColor">
              About this tutorial
            </Text>
            <Text className="text-descriptionTextColor font-outfit text-[14px] leading-5">
              {tutorial.description}
            </Text>
          </BorderlessShadowCard>

          {/* Benefits */}
          {tutorial.benefits && tutorial.benefits.length > 0 && (
            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              style={{ marginBottom: 16, padding: 20 }}>
              <Text className="mb-2 font-outfitMedium text-[18px] text-titleTextColor">
                Benefits
              </Text>
              {tutorial.benefits.map((benefit: string, index: number) => (
                <View key={index} className="mb-2 flex-row items-start gap-2">
                  <Text className="text-[16px]">•</Text>
                  <Text className="text-descriptionTextColor flex-1 font-outfit text-[14px]">
                    {benefit}
                  </Text>
                </View>
              ))}
            </BorderlessShadowCard>
          )}

          {/* Steps */}
          {tutorial.steps && tutorial.steps.length > 0 && (
            <BorderlessShadowCard style={{ marginBottom: 16, padding: 20 }}>
              <Text className="font-outfitSemiBold mb-3 text-[18px] text-titleTextColor">
                Step by Step
              </Text>
              {tutorial.steps.map((step: string, index: number) => (
                <View key={index} className="mb-3 flex-row items-start gap-2">
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-[#97785720]">
                    <Text className="font-outfitMedium text-[12px] text-[#977857]">
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="text-descriptionTextColor flex-1 font-outfit text-[14px]">
                    {step}
                  </Text>
                </View>
              ))}
            </BorderlessShadowCard>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
