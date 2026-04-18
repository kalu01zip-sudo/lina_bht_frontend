
// components/routines/AddRoutineBottomSheet.tsx
import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../inputs/Input';
import MultilineInputField from '@/components/inputs/MultilineInputField';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { DangerIcon } from '@/components/icons';

interface AddRoutineBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: { productName: string; instructions: string; routineType: string }) => void;
  initialRoutineType?: 'morning' | 'night' | 'weekly';
  isPremium?: boolean;
}

interface ValidationResult {
  isSafe: boolean;
  warnings: string[];
  severity: 'low' | 'medium' | 'high';
}

export const AddRoutineBottomSheet: React.FC<AddRoutineBottomSheetProps> = ({
  visible,
  onClose,
  onAdd,
  initialRoutineType = 'morning',
  isPremium = false,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [productName, setProductName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState<'morning' | 'night' | 'weekly'>(
    initialRoutineType
  );
  const [errors, setErrors] = useState({ productName: false });
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const snapPoints = ['50%', '75%', '90%'];

  useEffect(() => {
    if (visible) {
      setSelectedRoutine(initialRoutineType);
      resetForm();
    }
  }, [visible, initialRoutineType]);

  const resetForm = () => {
    setProductName('');
    setInstructions('');
    setErrors({ productName: false });
    setValidationResult(null);
    setShowValidation(false);
  };

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
        resetForm();
      }
    },
    [onClose]
  );

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

  // Simulate AI validation API call
  const validateProduct = async (productName: string): Promise<ValidationResult> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock validation results based on product name
    const productLower = productName.toLowerCase();

    if (productLower.includes('retinol') || productLower.includes('tretinoin')) {
      return {
        isSafe: false,
        warnings: [
          'May cause irritation for sensitive skin',
          'Should not be used with other actives',
          'Requires sunscreen use during the day',
        ],
        severity: 'high',
      };
    } else if (
      productLower.includes('acid') ||
      productLower.includes('aha') ||
      productLower.includes('bha')
    ) {
      return {
        isSafe: true,
        warnings: [
          'Start with 1-2 times per week',
          'May cause mild tingling sensation',
          'Use sunscreen when using this product',
        ],
        severity: 'medium',
      };
    } else if (productLower.includes('vitamin c')) {
      return {
        isSafe: true,
        warnings: [
          'Store in a cool, dark place',
          'Can be used with sunscreen for better protection',
        ],
        severity: 'low',
      };
    }

    return {
      isSafe: true,
      warnings: [],
      severity: 'low',
    };
  };

  const handleValidateAndAdd = async () => {
    if (!productName.trim()) {
      setErrors({ productName: true });
      return;
    }

    if (isPremium) {
      // Premium users: AI validation
      setIsValidating(true);
      setShowValidation(true);

      try {
        const result = await validateProduct(productName);
        setValidationResult(result);

        if (!result.isSafe) {
          // Don't add, show warnings
          return;
        }
      } catch (error) {
        console.error('Validation error:', error);
      } finally {
        setIsValidating(false);
      }
    }

    // Non-premium users or safe premium products: add directly
    addToRoutine();
  };

  const addToRoutine = () => {
    onAdd({
      productName: productName.trim(),
      instructions: instructions.trim(),
      routineType: selectedRoutine,
    });

    resetForm();
    bottomSheetRef.current?.close();
  };

  const getButtonTitle = () => {
    if (isPremium && showValidation && !isValidating && validationResult?.isSafe === false) {
      return 'Product May Be Unsafe';
    }
    if (isPremium && isValidating) {
      return 'Validating...';
    }
    switch (selectedRoutine) {
      case 'morning':
        return 'Add to Morning Routine';
      case 'night':
        return 'Add to Night Routine';
      case 'weekly':
        return 'Add to Weekly Routine';
      default:
        return 'Add to Routine';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#FBBF24';
      default:
        return '#EF4444';
    }
  };

  useEffect(() => {
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
              <View className="mb-4">
                <Text className="mb-2 font-outfitMedium text-[14px]" style={{ color: '#361A0D' }}>
                  Product Name <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <InputField
                  value={productName}
                  handler={(_, value) => {
                    setProductName(value);
                    if (value.trim()) setErrors({ productName: false });
                    setValidationResult(null);
                    setShowValidation(false);
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

              {/* Premium Badge */}
              {isPremium && (
                <View className="mb-4 flex-row items-center gap-2 rounded-lg bg-[#97785720] p-3">
                  <Ionicons name="diamond" size={20} color="#977857" />
                  <Text className="flex-1 font-outfit text-[12px]" style={{ color: '#977857' }}>
                    Premium feature: AI will validate product safety for your skin
                  </Text>
                </View>
              )}

              {/* Validation Results */}
              {showValidation && validationResult && (
                <View
                  className={`mb-4 rounded-xl p-4 ${
                    validationResult.isSafe ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                  <View className="mb-2 flex-row items-center gap-2">
                    {!validationResult.isSafe && <DangerIcon size={20} color="#DC2626" />}
                    <Text
                      className={`font-outfitBold flex-1 text-[14px] ${
                        validationResult.isSafe ? 'text-green-700' : 'text-red-700'
                      }`}>
                      {validationResult.isSafe ? 'Safety Check Passed' : 'Safety Concerns Detected'}
                    </Text>
                  </View>

                  {validationResult.warnings.map((warning, index) => (
                    <View key={index} className="mt-2 flex-row items-start gap-2">
                      <Ionicons
                        name="warning-outline"
                        size={16}
                        color={validationResult.isSafe ? '#F59E0B' : '#DC2626'}
                      />
                      <Text
                        className={`flex-1 font-outfit text-[12px] ${
                          validationResult.isSafe ? 'text-yellow-700' : 'text-red-600'
                        }`}>
                        {warning}
                      </Text>
                    </View>
                  ))}

                  {!validationResult.isSafe && (
                    <TouchableOpacity
                      onPress={addToRoutine}
                      className="mt-3 rounded-lg bg-red-100 py-2">
                      <Text
                        className="text-center font-outfitMedium text-[12px]"
                        style={{ color: '#DC2626' }}>
                        Add Anyway (Not Recommended)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

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
                      backgroundColor: selectedRoutine === 'morning' ? '#977857' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: selectedRoutine === 'morning' ? '#977857' : '#E5E0D8',
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
                      backgroundColor: selectedRoutine === 'night' ? '#977857' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: selectedRoutine === 'night' ? '#977857' : '#E5E0D8',
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
                      backgroundColor: selectedRoutine === 'weekly' ? '#977857' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: selectedRoutine === 'weekly' ? '#977857' : '#E5E0D8',
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
              <PrimaryButton
                title={getButtonTitle()}
                onPress={handleValidateAndAdd}
                disabled={isValidating}
                isLoading={isValidating}
                style={{ marginTop: 8 }}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
};
