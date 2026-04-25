import React, { useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PickerItem {
  id: string;
  label: string;
  value: string;
}

interface PickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: PickerItem[] | string[];
  selectedValue: string | null;
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

  // Helper function to get display text and value from item
  const getItemDisplay = (item: PickerItem | string): { label: string; value: string } => {
    if (typeof item === 'string') {
      return { label: item, value: item };
    }
    return { label: item.label, value: item.value };
  };

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
      handleIndicatorStyle={{ backgroundColor: '#CCC', width: 40, height: 4 }}
      backgroundStyle={{
        backgroundColor: '#E8DDD0',
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
            {items.map((item, index) => {
              const { label, value } = getItemDisplay(item);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onSelect(value);
                    onClose();
                  }}
                  className={`mb-2 rounded-xl px-4 py-4 ${
                    selectedValue === value ? 'bg-[#7A8B6A]' : 'bg-gray-100'
                  }`}>
                  <Text
                    className={`font-outfit text-[16px] ${
                      selectedValue === value ? 'text-white' : 'text-[#2E2117]'
                    }`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};
