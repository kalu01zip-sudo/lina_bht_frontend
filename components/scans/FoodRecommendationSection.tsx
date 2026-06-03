// // components/scans/FoodRecommendationSection.tsx
// import React from 'react';
// import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
// import { FoodRecommendationIcon } from '../icons/FoodRecommendationIcon';

// export interface RecommendedFood {
//   id: string;
//   name: string;
//   description: string;
//   imageUrl: any; // Can be require() result or URL string
// }

// interface FoodRecommendationSectionProps {
//   recommendedFoods: RecommendedFood[];
//   title?: string;
//   showIcon?: boolean;
//   containerWidth?: number;
// }

// // ── Handles both local require() assets and remote HTTP URLs ─────────────────
// const getImageSource = (source: any) => {
//   if (
//     typeof source === 'string' &&
//     (source.startsWith('http://') || source.startsWith('https://'))
//   ) {
//     return { uri: source };
//   }
//   return source;
// };

// export const FoodRecommendationSection: React.FC<FoodRecommendationSectionProps> = ({
//   recommendedFoods,
//   title = 'Your Food Recommendations',
//   showIcon = true,
//   containerWidth,
// }) => {
//   const screenWidth = Dimensions.get('window').width;
//   const paddingHorizontal = 32;
//   const availableWidth = (containerWidth || screenWidth) - paddingHorizontal;
//   const circleSize = Math.min(availableWidth / 2.5, 140);

//   if (!recommendedFoods || recommendedFoods.length === 0) {
//     return (
//       <View className="mt-6">
//         <View className="flex-row items-center gap-3">
//           {showIcon && <FoodRecommendationIcon size={32} />}
//           <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//             {title}
//           </Text>
//         </View>
//         <View
//           className="mt-3 p-4"
//           style={{
//             borderRadius: 24,
//             borderWidth: 1,
//             borderColor: '#FFFFFF99',
//             alignItems: 'center',
//           }}>
//           <Text className="text-center font-outfit text-[14px]" style={{ color: '#977857' }}>
//             No food recommendations available
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View className="mt-6">
//       {/* Header */}
//       <View className="flex-row items-center gap-3">
//         {showIcon && <FoodRecommendationIcon size={32} />}
//         <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//           {title}
//         </Text>
//       </View>

//       {/* Horizontal Scrollable Food List */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         className="mt-3"
//         contentContainerStyle={{
//           paddingRight: 16,
//           gap: 12,
//         }}>
//         {recommendedFoods.map((food) => (
//           <View
//             key={food.id}
//             style={{
//               width: circleSize,
//               height: circleSize,
//               alignItems: 'center',
//               justifyContent: 'center',
//               padding: 12,
//               borderRadius: circleSize / 2,
//               borderWidth: 2,
//               borderColor: '#FFFFFF99',
//               borderLeftWidth: 1,
//               borderRightWidth: 1,
//               backgroundColor: 'transparent',
//               overflow: 'hidden',
//             }}>
//             {/* Food Image */}
//             <View
//               style={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: 24,
//                 overflow: 'hidden',
//                 marginBottom: 8,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 backgroundColor: '#E8DDD0',
//               }}>
//               <Image
//                 source={getImageSource(food.imageUrl)}
//                 style={{ width: '100%', height: '100%' }}
//                 resizeMode="contain"
//               />
//             </View>

//             {/* Food Name */}
//             <Text
//               className="text-center font-outfit text-[12px]"
//               style={{
//                 color: '#1A1A1A',
//                 textShadowColor: '#FFFFFF',
//                 textShadowOffset: { width: 1, height: 2 },
//                 textShadowRadius: 2,
//                 marginBottom: 2,
//               }}>
//               {food.name}
//             </Text>

//             {/* Food Description */}
//             <Text
//               className="text-center font-outfit text-[9px]"
//               style={{
//                 color: '#666666',
//                 textShadowColor: '#FFFFFF',
//                 textShadowOffset: { width: 1, height: 1 },
//                 textShadowRadius: 2,
//                 lineHeight: 11,
//               }}>
//               {food.description}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// // components/scans/FoodRecommendationSection.tsx
// import React from 'react';
// import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
// import { FoodRecommendationIcon } from '../icons/FoodRecommendationIcon';

// export interface RecommendedFood {
//   id: string;
//   name: string;
//   description: string;
//   imageUrl: any; // Can be require() result or URL string
// }

// interface FoodRecommendationSectionProps {
//   recommendedFoods: RecommendedFood[];
//   title?: string;
//   showIcon?: boolean;
//   containerWidth?: number;
// }

// // ── Handles both local require() assets and remote HTTP URLs ─────────────────
// const getImageSource = (source: any) => {
//   if (
//     typeof source === 'string' &&
//     (source.startsWith('http://') || source.startsWith('https://'))
//   ) {
//     return { uri: source };
//   }
//   return source;
// };

// export const FoodRecommendationSection: React.FC<FoodRecommendationSectionProps> = ({
//   recommendedFoods,
//   title = 'Your Food Recommendations',
//   showIcon = true,
//   containerWidth,
// }) => {
//   const screenWidth = Dimensions.get('window').width;
//   const paddingHorizontal = 32;
//   const availableWidth = (containerWidth || screenWidth) - paddingHorizontal;
//   // Make circles wider to accommodate text
//   const circleWidth = Math.min(availableWidth / 2.8, 130);
//   const circleHeight = circleWidth * 1.2; // 20% taller for text
//   const imageSize = Math.min(circleWidth * 0.32, 44);

//   if (!recommendedFoods || recommendedFoods.length === 0) {
//     return (
//       <View className="mt-6">
//         <View className="flex-row items-center gap-3">
//           {showIcon && <FoodRecommendationIcon size={32} />}
//           <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//             {title}
//           </Text>
//         </View>
//         <View
//           className="mt-3 p-4"
//           style={{
//             borderRadius: 24,
//             borderWidth: 1,
//             borderColor: '#FFFFFF99',
//             alignItems: 'center',
//           }}>
//           <Text className="text-center font-outfit text-[14px]" style={{ color: '#977857' }}>
//             No food recommendations available
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View className="mt-6">
//       {/* Header */}
//       <View className="flex-row items-center gap-3">
//         {showIcon && <FoodRecommendationIcon size={32} />}
//         <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//           {title}
//         </Text>
//       </View>

//       {/* Horizontal Scrollable Food List */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         className="mt-3"
//         contentContainerStyle={{
//           paddingRight: 16,
//           gap: 12,
//         }}>
//         {recommendedFoods.map((food) => (
//           <View
//             key={food.id}
//             style={{
//               width: circleWidth,
//               height: circleHeight,
//               alignItems: 'center',
//               justifyContent: 'flex-start',
//               paddingTop: 12,
//               paddingHorizontal: 10,
//               borderRadius: circleWidth / 2,
//               borderWidth: 2,
//               borderColor: '#FFFFFF99',
//               borderLeftWidth: 1,
//               borderRightWidth: 1,
//               backgroundColor: 'transparent',
//               overflow: 'hidden',
//             }}>
//             {/* Food Image */}
//             <View
//               style={{
//                 width: imageSize,
//                 height: imageSize,
//                 borderRadius: imageSize / 2,
//                 overflow: 'hidden',
//                 marginBottom: 8,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 backgroundColor: '#E8DDD0',
//               }}>
//               <Image
//                 source={getImageSource(food.imageUrl)}
//                 style={{ width: '100%', height: '100%' }}
//                 resizeMode="contain"
//               />
//             </View>

//             {/* Food Name */}
//             <Text
//               className="text-center font-outfit text-[12px]"
//               style={{
//                 color: '#1A1A1A',
//                 fontWeight: '600',
//                 marginBottom: 6,
//               }}
//               numberOfLines={1}
//               ellipsizeMode="tail">
//               {food.name}
//             </Text>

//             {/* Food Description - Fixed for multi-line text */}
//             <View
//               style={{
//                 width: circleWidth - 20,
//                 alignItems: 'center',
//                 flex: 1,
//               }}>
//               <Text
//                 style={{
//                   color: '#666666',
//                   fontSize: 10,
//                   fontFamily: 'Outfit-Regular',
//                   textAlign: 'center',
//                   lineHeight: 14,
//                   flexWrap: 'wrap',
//                   width: '100%',
//                 }}
//                 numberOfLines={2}
//                 ellipsizeMode="tail">
//                 {food.description}
//               </Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// components/scans/FoodRecommendationSection.tsx
import React from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import { FoodRecommendationIcon } from '../icons/FoodRecommendationIcon';

export interface RecommendedFood {
  id: string;
  name: string;
  description: string;
  imageUrl: any; // Can be require() result or URL string
}

interface FoodRecommendationSectionProps {
  recommendedFoods: RecommendedFood[];
  title?: string;
  showIcon?: boolean;
  containerWidth?: number;
}

// ── Handles both local require() assets and remote HTTP URLs ─────────────────
const getImageSource = (source: any) => {
  if (
    typeof source === 'string' &&
    (source.startsWith('http://') || source.startsWith('https://'))
  ) {
    return { uri: source };
  }
  return source;
};

export const FoodRecommendationSection: React.FC<FoodRecommendationSectionProps> = ({
  recommendedFoods,
  title = 'Your Food Recommendations',
  showIcon = true,
  containerWidth,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const paddingHorizontal = 32;
  const availableWidth = (containerWidth || screenWidth) - paddingHorizontal;
  // Keep perfect circle by using same width and height
  const circleSize = Math.min(availableWidth / 2.5, 140);
  const imageSize = Math.min(circleSize * 0.42, 45);

  if (!recommendedFoods || recommendedFoods.length === 0) {
    return (
      <View className="mt-6">
        <View className="flex-row items-center gap-3">
          {showIcon && <FoodRecommendationIcon size={32} />}
          <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
            {title}
          </Text>
        </View>
        <View
          className="mt-3 p-4"
          style={{
            borderRadius: 24,
            borderWidth: 1,
            borderColor: '#FFFFFF99',
            alignItems: 'center',
          }}>
          <Text className="text-center font-outfit text-[14px]" style={{ color: '#977857' }}>
            No food recommendations available
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-6">
      {/* Header */}
      <View className="flex-row items-center gap-3">
        {showIcon && <FoodRecommendationIcon size={32} />}
        <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
          {title}
        </Text>
      </View>

      {/* Horizontal Scrollable Food List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerStyle={{
          paddingRight: 16,
          gap: 12,
        }}>
        {recommendedFoods.map((food) => (
          <View
            key={food.id}
            style={{
              width: circleSize,
              height: circleSize, // Same as width for perfect circle
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              paddingHorizontal: 10,
              borderRadius: circleSize / 2, // Perfect circle radius
              borderWidth: 2,
              borderColor: '#FFFFFF99',
              borderLeftWidth: 1,
              borderRightWidth: 1,
              backgroundColor: 'transparent',
              overflow: 'hidden',
            }}>
            {/* Food Image */}
            <View
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: imageSize / 2,
                overflow: 'hidden',
                marginBottom: 6,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#E8DDD0',
              }}>
              <Image
                source={getImageSource(food.imageUrl)}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>

            {/* Food Name */}
            <Text
              className="text-center font-outfit text-[12px]"
              style={{
                color: '#1A1A1A',
                fontWeight: '600',
                marginBottom: 4,
              }}
              numberOfLines={1}
              ellipsizeMode="tail">
              {food.name}
            </Text>

            {/* Food Description - Multi-line text within circle */}
            <View
              style={{
                width: circleSize - 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#666666',
                  fontSize: 9,
                  fontFamily: 'Outfit-Regular',
                  textAlign: 'center',
                  lineHeight: 12,
                  flexWrap: 'wrap',
                  width: '100%',
                }}
                numberOfLines={2}
                ellipsizeMode="tail">
                {food.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
