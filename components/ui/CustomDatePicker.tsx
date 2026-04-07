// components/personalInfo/DateOfBirthPicker.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DateOfBirthPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({
  value,
  onChange,
  maximumDate,
  minimumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(value.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(value.getMonth());
  const [selectedDay, setSelectedDay] = useState(value.getDate());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    onChange(newDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setSelectedYear(value.getFullYear());
    setSelectedMonth(value.getMonth());
    setSelectedDay(value.getDate());
    setShowPicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        className="flex-row items-center justify-between py-3">
        <Text className="font-outfit text-[16px]" style={{ color: '#2E2117' }}>
          {formatDate(value)}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#361A0D" />
      </TouchableOpacity>

      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={handleCancel}>
        <View className="flex-1 justify-end bg-black/50">
          <View
            className="rounded-t-3xl bg-backgroundColor "
            style={{ height: Platform.OS === 'ios' ? 400 : 500 }}>
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
              <TouchableOpacity onPress={handleCancel}>
                <Text className="font-outfit text-[16px]" style={{ color: '#EF4444' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <Text className="font-outfitBold text-[18px]" style={{ color: '#2E2117' }}>
                Select Date of Birth
              </Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text className="font-outfit text-[16px]" style={{ color: '#7A8B6A' }}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            {/* Pickers */}
            <View className="flex-1 flex-row">
              {/* Year Picker */}
              <View className="flex-1">
                <Text
                  className="py-3 text-center font-outfitMedium text-[14px]"
                  style={{ color: '#7A8B6A' }}>
                  Year
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      onPress={() => setSelectedYear(year)}
                      className={`mx-2 my-1 rounded-lg px-4 py-3 ${
                        selectedYear === year ? 'bg-[#7A8B6A]' : ''
                      }`}>
                      <Text
                        className={`text-center font-outfit text-[16px] ${
                          selectedYear === year ? 'text-white' : 'text-[#2E2117]'
                        }`}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Month Picker */}
              <View className="flex-1">
                <Text
                  className="py-3 text-center font-outfitMedium text-[14px]"
                  style={{ color: '#7A8B6A' }}>
                  Month
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      onPress={() => setSelectedMonth(index)}
                      className={`mx-2 my-1 rounded-lg px-4 py-3 ${
                        selectedMonth === index ? 'bg-[#7A8B6A]' : ''
                      }`}>
                      <Text
                        className={`text-center font-outfit text-[14px] ${
                          selectedMonth === index ? 'text-white' : 'text-[#2E2117]'
                        }`}>
                        {month.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Day Picker */}
              <View className="flex-1">
                <Text
                  className="py-3 text-center font-outfitMedium text-[14px]"
                  style={{ color: '#7A8B6A' }}>
                  Day
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => setSelectedDay(day)}
                      className={`mx-2 my-1 rounded-lg px-4 py-3 ${
                        selectedDay === day ? 'bg-[#7A8B6A]' : ''
                      }`}>
                      <Text
                        className={`text-center font-outfit text-[16px] ${
                          selectedDay === day ? 'text-white' : 'text-[#2E2117]'
                        }`}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
