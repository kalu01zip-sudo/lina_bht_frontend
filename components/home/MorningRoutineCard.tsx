// // screens/home/components/MorningRoutineCard.tsx
// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import ShadowCard from '@/components/cards/ShadowCard';
// import TextBodySmall from '@/components/texts/TextBodySmall';
// import { SunIcon, CheckInCircleIcon, BorderCircleIcon } from '@/components/icons';
// import { MorningRoutine, RoutineStep } from '@/types/home';

// interface MorningRoutineCardProps {
//   routine: MorningRoutine;
//   completedStepsCount: number;
//   routineProgress: number;
//   onToggleStep: (stepId: string, currentCompleted: boolean) => void;
//   onViewAll: () => void;
// }

// const RoutineStepItem: React.FC<{
//   step: RoutineStep;
//   onToggle: () => void;
// }> = ({ step, onToggle }) => (
//   <TouchableOpacity onPress={onToggle} className="flex-row items-center gap-[6px]">
//     {step.completed ? (
//       <CheckInCircleIcon size={18} color="#7A8B6A" strokeWidth={2} />
//     ) : (
//       <BorderCircleIcon size={18} color="#2A211833" strokeWidth={2} />
//     )}
//     <Text
//       className={`font-outfit text-[14px] ${
//         step.completed ? 'text-[#7A8B6A]' : 'font-outfitMedium text-[#2A2118]'
//       }`}>
//       {step.name}
//     </Text>
//   </TouchableOpacity>
// );

// export const MorningRoutineCard: React.FC<MorningRoutineCardProps> = ({
//   routine,
//   completedStepsCount,
//   routineProgress,
//   onToggleStep,
//   onViewAll,
// }) => {
//   return (
//     <ShadowCard style={{ borderBottomColor: '#FFFFFF66', borderBottomWidth: 2, marginTop: 24 }}>
//       <View className="flex-row items-center justify-between">
//         <View className="flex-row items-center gap-3">
//           <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
//             <SunIcon size={16} color="#F59E0B" />
//           </View>
//           <Text className="font-outfitMedium text-[16px] text-[#2A2118]">{routine.name}</Text>
//         </View>
//         <TouchableOpacity onPress={onViewAll} className="flex-row items-center gap-1">
//           <Text className="font-outfitMedium text-[12px] text-[#C8A97E]">View All</Text>
//           <Ionicons name="chevron-forward" size={16} color="#C8A97E" />
//         </TouchableOpacity>
//       </View>

//       <View className="mt-6 gap-3">
//         {routine.steps.map((step) => (
//           <RoutineStepItem
//             key={step.id}
//             step={step}
//             onToggle={() => onToggleStep(step.id, step.completed)}
//           />
//         ))}
//       </View>

//       <View className="mt-6 flex-row items-center justify-between gap-4">
//         <View className="flex-1">
//           <View
//             style={{
//               height: 6,
//               backgroundColor: '#2A21180D',
//               borderRadius: 100,
//               overflow: 'hidden',
//             }}>
//             <View
//               style={{
//                 width: `${routineProgress}%`,
//                 height: '100%',
//                 backgroundColor: '#C8A97E',
//                 borderRadius: 100,
//               }}
//             />
//           </View>
//         </View>
//         <TextBodySmall
//           text={`${completedStepsCount} of ${routine.totalSteps}`}
//           style={{ color: '#2A211880' }}
//         />
//       </View>
//     </ShadowCard>
//   );
// };

// screens/home/components/MorningRoutineCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ShadowCard from '@/components/cards/ShadowCard';
import TextBodySmall from '@/components/texts/TextBodySmall';
import { SunIcon, CheckInCircleIcon, BorderCircleIcon } from '@/components/icons';
import { MorningRoutine, RoutineStep } from '@/types/home';
import { GradientProgressBar } from '../GradientProgressBar';

interface MorningRoutineCardProps {
  routine: MorningRoutine;
  completedStepsCount: number;
  routineProgress: number;
  onToggleStep: (stepId: string, currentCompleted: boolean) => void;
  onViewAll: () => void;
}

const RoutineStepItem: React.FC<{
  step: RoutineStep;
  onToggle: () => void;
}> = ({ step, onToggle }) => (
  <TouchableOpacity onPress={onToggle} className="flex-row items-center gap-[6px]">
    <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
      {step.completed ? (
        <CheckInCircleIcon size={18} color="#7A8B6A" strokeWidth={2} />
      ) : (
        <BorderCircleIcon size={18} color="#2A211833" strokeWidth={2} />
      )}
    </View>
    <Text
      className={`font-outfit text-[14px] ${
        step.completed ? 'text-[#7A8B6A]' : 'font-outfitMedium text-[#2A2118]'
      }`}>
      {step.name}
    </Text>
  </TouchableOpacity>
);

export const MorningRoutineCard: React.FC<MorningRoutineCardProps> = ({
  routine,
  completedStepsCount,
  routineProgress,
  onToggleStep,
  onViewAll,
}) => {
  return (
    <ShadowCard style={{ borderBottomColor: '#FFFFFF66', borderBottomWidth: 2, marginTop: 24 }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
            <SunIcon size={16} color="#F59E0B" />
          </View>
          <Text className="font-outfitMedium text-[16px] text-[#2A2118]">{routine.name}</Text>
        </View>
        <TouchableOpacity onPress={onViewAll} className="flex-row items-center gap-1">
          <Text className="font-outfitMedium text-[12px] text-[#C8A97E]">View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#C8A97E" />
        </TouchableOpacity>
      </View>

      <View className="mt-6 gap-3">
        {routine.steps.map((step) => (
          <RoutineStepItem
            key={step.id}
            step={step}
            onToggle={() => onToggleStep(step.id, step.completed)}
          />
        ))}
      </View>

      <View className="mt-6 flex-row items-center justify-between gap-4">
        <GradientProgressBar
          progress={routineProgress}
          gradientStart={{ x: 0, y: 0 }}
          gradientEnd={{ x: 1, y: 1 }}
          gradientColors={['#977857', '#B89474', '#7A5D3E']}
          gradientLocations={[0.25, 0.6036, 0.9571]}
        />
        <TextBodySmall
          text={`${completedStepsCount} of ${routine.totalSteps}`}
          style={{ color: '#2A211880' }}
        />
      </View>
    </ShadowCard>
  );
};
