// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';

// interface RoutineSummaryStep {
//   id: string;
//   name: string;
//   completed: boolean;
// }

// interface RoutineSummaryCardProps {
//   title: string;
//   icon: 'sunny-outline' | 'moon-outline';
//   steps: RoutineSummaryStep[];
//   completedCount: number;
//   progress: number; // 0–100
//   maxVisible?: number;
//   onToggleStep: (stepId: string, currentCompleted: boolean) => void;
//   onViewAll: () => void;
// }

// export const RoutineSummaryCard: React.FC<RoutineSummaryCardProps> = ({
//   title,
//   icon,
//   steps,
//   completedCount,
//   progress,
//   maxVisible = 3,
//   onToggleStep,
//   onViewAll,
// }) => {
//   const visibleSteps = steps.slice(0, maxVisible);
//   const hiddenCount = steps.length - maxVisible;

//   return (
//     <BorderlessShadowCard style={{ marginBottom: 16, paddingVertical: 16, paddingHorizontal: 16 }}>
//       {/* Header */}
//       <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
//         <View
//           style={{
//             width: 36,
//             height: 36,
//             borderRadius: 18,
//             backgroundColor: '#F0E6D8',
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginRight: 10,
//           }}>
//           <Ionicons name={icon} size={18} color="#977857" />
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 15, color: '#361A0D' }}>
//             {title}
//           </Text>
//           <Text style={{ fontFamily: 'Outfit', fontSize: 11, color: '#2E211799', marginTop: 1 }}>
//             {completedCount} of {steps.length} completed
//           </Text>
//         </View>
//         <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
//           <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 12, color: '#977857' }}>
//             View All
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Progress bar */}
//       <View
//         style={{
//           height: 4,
//           backgroundColor: '#F0E6D8',
//           borderRadius: 2,
//           marginBottom: 14,
//           overflow: 'hidden',
//         }}>
//         <View
//           style={{
//             width: `${progress}%`,
//             height: '100%',
//             backgroundColor: '#977857',
//             borderRadius: 2,
//           }}
//         />
//       </View>

//       {/* Steps */}
//       {steps.length === 0 ? (
//         <View style={{ alignItems: 'center', paddingVertical: 12 }}>
//           <Text style={{ fontFamily: 'Outfit', fontSize: 13, color: '#2E211766' }}>
//             No {title.toLowerCase()} steps yet
//           </Text>
//         </View>
//       ) : (
//         <>
//           {visibleSteps.map((step, index) => (
//             <TouchableOpacity
//               key={step.id}
//               onPress={() => onToggleStep(step.id, step.completed)}
//               activeOpacity={0.7}
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 paddingVertical: 8,
//                 borderTopWidth: index === 0 ? 0 : 1,
//                 borderTopColor: '#2E21170A',
//               }}>
//               {/* Checkbox */}
//               <View
//                 style={{
//                   width: 22,
//                   height: 22,
//                   borderRadius: 11,
//                   borderWidth: 1.5,
//                   borderColor: step.completed ? '#977857' : '#2E211733',
//                   backgroundColor: step.completed ? '#977857' : 'transparent',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginRight: 12,
//                 }}>
//                 {step.completed && <Ionicons name="checkmark" size={13} color="#FFF" />}
//               </View>

//               {/* Step name */}
//               <Text
//                 style={{
//                   flex: 1,
//                   fontFamily: step.completed ? 'Outfit' : 'Outfit-Medium',
//                   fontSize: 13,
//                   color: step.completed ? '#2E211766' : '#361A0D',
//                   textDecorationLine: step.completed ? 'line-through' : 'none',
//                 }}
//                 numberOfLines={1}>
//                 {step.name}
//               </Text>
//             </TouchableOpacity>
//           ))}

//           {/* "X more steps" pill */}
//           {hiddenCount > 0 && (
//             <TouchableOpacity
//               onPress={onViewAll}
//               activeOpacity={0.7}
//               style={{
//                 marginTop: 8,
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 paddingVertical: 8,
//                 borderRadius: 12,
//                 backgroundColor: '#F5EFE8',
//               }}>
//               <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 12, color: '#977857' }}>
//                 +{hiddenCount} more step{hiddenCount > 1 ? 's' : ''}
//               </Text>
//               <Ionicons
//                 name="chevron-forward"
//                 size={14}
//                 color="#977857"
//                 style={{ marginLeft: 4 }}
//               />
//             </TouchableOpacity>
//           )}
//         </>
//       )}
//     </BorderlessShadowCard>
//   );
// };

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { usePatchRoutineStepMutation } from '@/store/api/routineApi';
import { useToast } from '@/hooks/useToast';

interface RoutineSummaryStep {
  id: string;
  name: string;
  completed: boolean;
}

interface RoutineSummaryCardProps {
  title: string;
  icon: 'sunny-outline' | 'moon-outline';
  steps: RoutineSummaryStep[];
  completedCount: number;
  progress: number; // 0–100
  maxVisible?: number;
  // Radius control for stacked card visual
  topRadius?: number;
  bottomRadius?: number;
  onViewAll: () => void;
  // Callback so parent can sync its completedSteps state
  onStepToggled?: (stepId: string, newCompleted: boolean) => void;
}

export const RoutineSummaryCard: React.FC<RoutineSummaryCardProps> = ({
  title,
  icon,
  steps,
  completedCount,
  progress,
  maxVisible = 3,
  topRadius = 24,
  bottomRadius = 24,
  onViewAll,
  onStepToggled,
}) => {
  const visibleSteps = steps.slice(0, maxVisible);
  const hiddenCount = Math.max(0, steps.length - maxVisible);

  // Local optimistic state — mirrors parent but allows instant feedback
  const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>({});
  const [pendingSteps, setPendingSteps] = useState<Set<string>>(new Set());

  const [patchStep] = usePatchRoutineStepMutation();
  const { showError } = useToast();

  const isCompleted = (step: RoutineSummaryStep) =>
    step.id in localCompleted ? localCompleted[step.id] : step.completed;

  const handleToggle = useCallback(
    async (stepId: string, currentCompleted: boolean) => {
      if (pendingSteps.has(stepId)) return;

      const newCompleted = !currentCompleted;

      // 1. Optimistic update locally
      setLocalCompleted((prev) => ({ ...prev, [stepId]: newCompleted }));
      setPendingSteps((prev) => new Set(prev).add(stepId));

      try {
        await patchStep({ step_id: stepId, is_completed: newCompleted }).unwrap();
        // Notify parent to sync its state
        onStepToggled?.(stepId, newCompleted);
      } catch (err: any) {
        // Rollback
        setLocalCompleted((prev) => ({ ...prev, [stepId]: currentCompleted }));
        const detail = err?.data?.detail;
        showError(typeof detail === 'string' ? detail : 'Failed to update step');
      } finally {
        setPendingSteps((prev) => {
          const next = new Set(prev);
          next.delete(stepId);
          return next;
        });
      }
    },
    [pendingSteps, patchStep, onStepToggled, showError]
  );

  // Recalculate progress from local state
  const localCompletedCount = steps.filter((s) => isCompleted(s)).length;
  const localProgress = steps.length > 0 ? (localCompletedCount / steps.length) * 100 : 0;

  return (
    <BorderlessShadowCard
      b_tl={topRadius}
      b_tr={topRadius}
      b_bl={bottomRadius}
      b_br={bottomRadius}
      style={{
        marginBottom: bottomRadius === 0 ? 2 : 16, // tight gap when connecting to next card
        paddingVertical: 16,
        paddingHorizontal: 16,
      }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#F0E6D8',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}>
          <Ionicons name={icon} size={18} color="#977857" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Outfit-SemiBold', fontSize: 15, color: '#361A0D' }}>
            {title}
          </Text>
          <Text style={{ fontFamily: 'Outfit', fontSize: 11, color: '#2E211799', marginTop: 1 }}>
            {localCompletedCount} of {steps.length} completed
          </Text>
        </View>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 12, color: '#977857' }}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 4,
          backgroundColor: '#F0E6D8',
          borderRadius: 2,
          marginBottom: 14,
          overflow: 'hidden',
        }}>
        <View
          style={{
            width: `${localProgress}%`,
            height: '100%',
            backgroundColor: '#977857',
            borderRadius: 2,
          }}
        />
      </View>

      {/* Steps */}
      {steps.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <Text style={{ fontFamily: 'Outfit', fontSize: 13, color: '#2E211766' }}>
            No {title.toLowerCase()} steps yet
          </Text>
        </View>
      ) : (
        <>
          {visibleSteps.map((step, index) => {
            const completed = isCompleted(step);
            const isPending = pendingSteps.has(step.id);

            return (
              <TouchableOpacity
                key={step.id}
                onPress={() => handleToggle(step.id, completed)}
                activeOpacity={0.7}
                disabled={isPending}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: '#2E21170A',
                  opacity: isPending ? 0.6 : 1,
                }}>
                {/* Checkbox / spinner */}
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 1.5,
                    borderColor: completed ? '#977857' : '#2E211733',
                    backgroundColor: completed ? '#977857' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                  {isPending ? (
                    <ActivityIndicator size={10} color={completed ? '#FFF' : '#977857'} />
                  ) : (
                    completed && <Ionicons name="checkmark" size={13} color="#FFF" />
                  )}
                </View>

                {/* Step name */}
                <Text
                  style={{
                    flex: 1,
                    fontFamily: completed ? 'Outfit' : 'Outfit-Medium',
                    fontSize: 13,
                    color: completed ? '#2E211766' : '#361A0D',
                    textDecorationLine: completed ? 'line-through' : 'none',
                  }}
                  numberOfLines={1}>
                  {step.name}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* "+N more steps" pill */}
          {hiddenCount > 0 && (
            <TouchableOpacity
              onPress={onViewAll}
              activeOpacity={0.7}
              style={{
                marginTop: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: '#F5EFE8',
              }}>
              <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 12, color: '#977857' }}>
                +{hiddenCount} more step{hiddenCount > 1 ? 's' : ''}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color="#977857"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          )}
        </>
      )}
    </BorderlessShadowCard>
  );
};
