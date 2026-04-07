// // screens/home/components/InsightsSection.tsx
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import ShadowCard from '@/components/cards/ShadowCard';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import TextBodySmall from '@/components/texts/TextBodySmall';
// import { DailyInsightIcon, SkinNutritionIcon } from '@/components/icons';
// import { InsightArticle } from '@/types/home';

// interface InsightsSectionProps {
//   insights: InsightArticle[];
//   onInsightPress: (insightId: string) => void;
// }

// const getInsightIcon = (iconName: string, size: number, color: string) => {
//   switch (iconName) {
//     case 'daily_insight':
//       return <DailyInsightIcon size={size} color={color} />;
//     case 'skin_nutrition':
//       return <SkinNutritionIcon size={size} color={color} />;
//     default:
//       return null;
//   }
// };

// const InsightItem: React.FC<{
//   insight: InsightArticle;
//   onPress: () => void;
//   isFirst: boolean;
// }> = ({ insight, onPress, isFirst }) => {
//   const [isPressed, setIsPressed] = useState(false);

//   return (
//     <TouchableOpacity
//       activeOpacity={1}
//       onPress={onPress}
//       onPressIn={() => setIsPressed(true)}
//       onPressOut={() => setIsPressed(false)}
//       className={`flex-row items-start gap-3 ${!isFirst ? 'mt-4' : ''}`}>
//       <BorderlessShadowCard
//         b_bl={6}
//         b_br={6}
//         b_tl={6}
//         b_tr={6}
//         style={{
//           width: 40,
//           height: 40,
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: isPressed ? '#E8DDD0' : '#F0E6D8',
//         }}>
//         {getInsightIcon(insight.icon, 18, '#7A8B6A')}
//       </BorderlessShadowCard>
//       <View className="flex-1">
//         <Text className="font-outfitMedium text-[14px] text-[#2A2118]">{insight.title}</Text>
//         <TextBodySmall style={{ fontFamily: 'Outfit-Regular' }} text={insight.description} />
//       </View>
//       <Ionicons name="chevron-forward" size={16} color="#C8A97E" />
//     </TouchableOpacity>
//   );
// };

// export const InsightsSection: React.FC<InsightsSectionProps> = ({ insights, onInsightPress }) => {
//   return (
//     <ShadowCard
//       b_bl={0}
//       b_br={0}
//       b_tl={0}
//       b_tr={0}
//       style={{ borderBottomColor: '#FFFFFF66', borderBottomWidth: 2, marginTop: 16 }}>
//       {insights.map((insight, index) => (
//         <InsightItem
//           key={insight.id}
//           insight={insight}
//           isFirst={index === 0}
//           onPress={() => onInsightPress(insight.id)}
//         />
//       ))}
//     </ShadowCard>
//   );
// };
