// components/personalInfo/PickerBottomSheet.tsx
import React, { useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const PickerBottomSheet: React.FC<PickerBottomSheetProps> = ({
  visible,
  onClose,
  title,
  items = [],
  selectedValue,
  onSelect,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, 100);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
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

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['50%', '70%']}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40, height: 4 }}
      backgroundStyle={{
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}>
      <BottomSheetView style={{ flex: 1 }}>
        <View className="p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-outfitBold text-[20px]" style={{ color: '#2E2117' }}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#2E2117" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} className="max-h-80">
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                className={`mb-2 rounded-xl px-4 py-4 ${
                  selectedValue === item ? 'bg-[#7A8B6A]' : 'bg-gray-100'
                }`}>
                <Text
                  className={`font-outfit text-[16px] ${
                    selectedValue === item ? 'text-white' : 'text-[#2E2117]'
                  }`}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};
