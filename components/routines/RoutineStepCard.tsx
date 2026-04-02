// // components/routines/RoutineStepCard.tsx
// import React from 'react';
// import { View, Text, StyleProp, ViewStyle } from 'react-native';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { ToggleSwitch } from '@/components/buttons/ToggleSwitch';

// interface RoutineStepCardProps {
//   stepNumber: number;
//   title: string;
//   description: string;
//   isCompleted: boolean;
//   onToggle: (completed: boolean) => void;
//   isLast?: boolean;
//   isFirst?: boolean;
//   style?: StyleProp<ViewStyle>; // Style for the parent container
//   className?: string; // Optional className for Tailwind
//   contentContainerStyle?: StyleProp<ViewStyle>; // Style for the inner BorderlessShadowCard
// }

// export const RoutineStepCard: React.FC<RoutineStepCardProps> = ({
//   stepNumber,
//   title,
//   description,
//   isCompleted,
//   onToggle,
//   isLast = false,
//   isFirst = false,
//   style,
//   className = '',
//   contentContainerStyle,
// }) => {
//   return (
//     <View
//       className={className}
//       style={[
//         {
//           marginTop: isFirst ? 0 : 12,
//         },
//         style,
//       ]}>
//       <BorderlessShadowCard
//         b_tl={isFirst ? 24 : 0}
//         b_tr={isFirst ? 24 : 0}
//         b_bl={isLast ? 24 : 0}
//         b_br={isLast ? 24 : 0}
//         style={[
//           {
//             paddingVertical: 16,
//             paddingHorizontal: 24,
//           },
//           contentContainerStyle,
//         ]}>
//         <View className="flex-row items-center justify-between">
//           <Text className="font-outfitBold text-[14px]" style={{ color: '#977857' }}>
//             Step {stepNumber}
//           </Text>
//           <ToggleSwitch value={isCompleted} onValueChange={onToggle} />
//         </View>
//         <Text className="mt-3 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//           {title}
//         </Text>
//         <Text className="mt-[6px] font-outfit text-[14px]" style={{ color: '#2E2117B2' }}>
//           {description}
//         </Text>
//       </BorderlessShadowCard>
//     </View>
//   );
// };

// components/routines/RoutineStepCard.tsx
import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { ToggleSwitch } from '@/components/buttons/ToggleSwitch';

// components/routines/RoutineStepCard.tsx (add isCustom prop)
interface RoutineStepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  onToggle: (completed: boolean) => void;
  isLast?: boolean;
  isFirst?: boolean;
  isCustom?: boolean; // Add this
  style?: StyleProp<ViewStyle>;
  className?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const RoutineStepCard: React.FC<RoutineStepCardProps> = ({
  stepNumber,
  title,
  description,
  isCompleted,
  onToggle,
  isLast = false,
  isFirst = false,
  isCustom = false,
  style,
  className = '',
  contentContainerStyle,
}) => {
  return (
    <View
      className={className}
      style={[
        {
          marginTop: isFirst ? 0 : 12,
        },
        style,
      ]}>
      <BorderlessShadowCard
        b_tl={isFirst ? 24 : 0}
        b_tr={isFirst ? 24 : 0}
        b_bl={isLast ? 24 : 0}
        b_br={isLast ? 24 : 0}
        style={[
          {
            paddingVertical: 16,
            paddingHorizontal: 24,
          },
          contentContainerStyle,
        ]}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="font-outfitBold text-[14px]" style={{ color: '#977857' }}>
              Step {stepNumber}
            </Text>
            {isCustom && (
              <View className="rounded-full bg-[#7A8B6A20] px-2 py-0.5">
                <Text className="font-outfit text-[10px]" style={{ color: '#7A8B6A' }}>
                  Custom
                </Text>
              </View>
            )}
          </View>
          <ToggleSwitch value={isCompleted} onValueChange={onToggle} />
        </View>
        <Text className="mt-3 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
          {title}
        </Text>
        <Text className="mt-[6px] font-outfit text-[14px]" style={{ color: '#2E2117B2' }}>
          {description}
        </Text>
      </BorderlessShadowCard>
    </View>
  );
};
