// components/routines/AddRoutineBottomSheet.tsx
import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../inputs/Input';
import MultilineInputField from '@/components/inputs/MultilineInputField';
import PrimaryButton from '@/components/buttons/PrimaryButton';

interface AddRoutineBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: { productName: string; instructions: string; routineType: string }) => void;
}

export const AddRoutineBottomSheet: React.FC<AddRoutineBottomSheetProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [productName, setProductName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState<'morning' | 'night' | 'weekly'>('morning');
  const [errors, setErrors] = useState({ productName: false });

  const snapPoints = ['50%', '75%'];

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle backdrop press
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  // Handle add button press
  const handleAdd = () => {
    if (!productName.trim()) {
      setErrors({ productName: true });
      return;
    }

    onAdd({
      productName: productName.trim(),
      instructions: instructions.trim(),
      routineType: selectedRoutine,
    });

    // Reset form
    setProductName('');
    setInstructions('');
    setSelectedRoutine('morning');
    setErrors({ productName: false });
    bottomSheetRef.current?.close();
  };

  // Open/close bottom sheet based on visible prop
  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: '#361A0D',
        width: 40,
        height: 4,
      }}
      backgroundStyle={{
        backgroundColor: '#F0E6D8',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}>
      <BottomSheetView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingTop: 8 }}>
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between px-6">
              <Text className="font-outfitMedium text-[24px]" style={{ color: '#361A0D' }}>
                Add Routine Step
              </Text>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.close()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color="#361A0D" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 70, paddingHorizontal: 24 }}>
              {/* Product Name Input */}
              <View className="mb-4 ">
                <Text className="mb-2 font-outfitMedium text-[14px]" style={{ color: '#361A0D' }}>
                  Product Name <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <InputField
                  value={productName}
                  handler={(_, value) => {
                    setProductName(value);
                    if (value.trim()) setErrors({ productName: false });
                  }}
                  placeHolder="e.g. Vitamin C Serum"
                  error={errors.productName}
                  showLabel={false}
                  height={56}
                />
                {errors.productName && (
                  <Text className="mt-1 font-outfit text-[12px]" style={{ color: '#EF4444' }}>
                    Product name is required
                  </Text>
                )}
              </View>

              {/* Instructions Input (Optional) */}
              <View className="mb-4">
                <Text className="mb-2 font-outfitMedium text-[14px]" style={{ color: '#361A0D' }}>
                  Instructions <Text style={{ color: '#361A0D' }}>(Optional)</Text>
                </Text>
                <MultilineInputField
                  value={instructions}
                  handler={(_, value) => setInstructions(value)}
                  placeHolder="e.g. Apply 3 drops to damp skin"
                  showLabel={false}
                  height={100}
                  numberOfLines={3}
                  borderRadius={24}
                />
              </View>

              {/* Routine Type Selection */}
              <View className="mb-6">
                <Text className="mb-2 font-outfitMedium text-[14px]" style={{ color: '#2E2117' }}>
                  Add to Routine
                </Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setSelectedRoutine('morning')}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: selectedRoutine === 'morning' ? '#7A8B6A' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: selectedRoutine === 'morning' ? '#7A8B6A' : '#E5E0D8',
                    }}>
                    <Text
                      className="text-center font-outfitMedium text-[14px]"
                      style={{ color: selectedRoutine === 'morning' ? '#FFFFFF' : '#2E2117' }}>
                      Morning
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSelectedRoutine('night')}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: selectedRoutine === 'night' ? '#7A8B6A' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: selectedRoutine === 'night' ? '#7A8B6A' : '#E5E0D8',
                    }}>
                    <Text
                      className="text-center font-outfitMedium text-[14px]"
                      style={{ color: selectedRoutine === 'night' ? '#FFFFFF' : '#2E2117' }}>
                      Night
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSelectedRoutine('weekly')}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: selectedRoutine === 'weekly' ? '#7A8B6A' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: selectedRoutine === 'weekly' ? '#7A8B6A' : '#E5E0D8',
                    }}>
                    <Text
                      className="text-center font-outfitMedium text-[14px]"
                      style={{ color: selectedRoutine === 'weekly' ? '#FFFFFF' : '#2E2117' }}>
                      Weekly
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Add Button */}
              <PrimaryButton title="Add to Routine" onPress={handleAdd} style={{ marginTop: 8 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
};
