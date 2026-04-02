// components/routines/AddRoutineStepModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../inputs/Input';

import MultilineInputField from '@/components/inputs/MultilineInputField';
import PrimaryButton from '@/components/buttons/PrimaryButton';

interface AddRoutineStepModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: { productName: string; instructions: string; routineType: string }) => void;
}

export const AddRoutineStepModal: React.FC<AddRoutineStepModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [productName, setProductName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState<'morning' | 'night' | 'weekly'>('morning');
  const [errors, setErrors] = useState({ productName: false });

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
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 justify-center bg-black/50">
          <View
            style={{
              backgroundColor: '#F0E6D8',
              borderRadius: 24,
              marginHorizontal: 20,
              padding: 24,
              maxHeight: '90%',
              overflow: 'hidden',
            }}>
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="font-outfitBold text-[20px]" style={{ color: '#2E2117' }}>
                Add Routine Step
              </Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color="#2E2117" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Product Name Input */}
              <View className="mb-4">
                <Text className="mb-2 font-outfitMedium text-[14px]" style={{ color: '#2E2117' }}>
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

              {/* Instructions Input (Optional) - Using MultilineInputField */}
              <View className="mb-4">
                <Text className="mb-2 font-outfitMedium text-[14px]" style={{ color: '#2E2117' }}>
                  Instructions <Text style={{ color: '#9CA3AF' }}>(Optional)</Text>
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
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
