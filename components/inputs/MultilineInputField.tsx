// components/inputs/MultilineInputField.tsx
import React, { useState } from 'react';
import { KeyboardType, TextInput, TextStyle, View, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shadow } from 'react-native-shadow-2';
import InputLabel from '../texts/InputLabel';

interface MultilineInputFieldProps {
  keyboard?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  placeHolder?: string;
  label?: string;
  error?: boolean;
  handler?: (name: string, value: string) => void;
  value?: string;
  name?: string;
  required?: boolean;
  showLabel?: boolean;
  onBlur?: (value: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  withShadow?: boolean;
  height?: number;
  gradientColors?: readonly [string, string, ...string[]];

  // Border radius controls
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
}

export default function MultilineInputField({
  keyboard = 'default',
  style,
  inputStyle,
  placeHolder = 'Please enter',
  label = 'Enter your',
  error = false,
  handler,
  value,
  name,
  required = true,
  showLabel = false,
  onBlur,
  numberOfLines = 3,
  secureTextEntry = false,
  withShadow = true,
  height = 100,
  gradientColors = ['#ede4d9', '#ede4d9', '#ede4d9'],
  borderRadius = 24,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
}: MultilineInputFieldProps) {
  const [focused, setFocused] = useState(false);

  // Calculate final border radius values
  const finalBorderTopLeft = borderTopLeftRadius ?? borderRadius;
  const finalBorderTopRight = borderTopRightRadius ?? borderRadius;
  const finalBorderBottomLeft = borderBottomLeftRadius ?? borderRadius;
  const finalBorderBottomRight = borderBottomRightRadius ?? borderRadius;

  // Get border colors based on state
  const getBorderColors = () => {
    if (error) {
      return {
        top: 'rgba(255, 0, 0, 0.7)',
        left: 'rgba(255, 0, 0, 0.6)',
        right: 'rgba(255, 0, 0, 0.3)',
        bottom: 'rgba(255, 0, 0, 0.3)',
      };
    }
    if (focused) {
      return {
        top: 'rgba(255, 255, 255, 1)',
        left: 'rgba(255, 255, 255, 1)',
        right: 'rgba(255, 255, 255, 1)',
        bottom: 'rgba(255, 255, 255, 1)',
      };
    }
    return {
      top: 'rgba(255, 255, 255, 1)',
      left: 'rgba(255, 255, 255, 1)',
      right: 'rgba(255, 255, 255, 1)',
      bottom: 'rgba(255, 255, 255, 1)',
    };
  };

  const borderColors = getBorderColors();

  const InputContent = (
    <View>
      {showLabel && (
        <InputLabel
          style={{
            color: error ? '#FF4444' : focused ? '#361A0D' : '#323135',
            marginBottom: 8,
            fontWeight: '500',
          }}
          text={label}
        />
      )}

      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.14, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={{
          minHeight: height,
          borderTopLeftRadius: finalBorderTopLeft,
          borderTopRightRadius: finalBorderTopRight,
          borderBottomLeftRadius: finalBorderBottomLeft,
          borderBottomRightRadius: finalBorderBottomRight,
          borderTopWidth: 2,
          borderLeftWidth: 2,
          borderRightWidth: 2,
          borderBottomWidth: 2,
          borderTopColor: borderColors.top,
          borderLeftColor: borderColors.left,
          borderRightColor: borderColors.right,
          borderBottomColor: borderColors.bottom,
          overflow: 'hidden',
        }}>
        <TextInput
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.(value + '');
          }}
          value={value}
          style={{
            color: '#4A3F35',
            fontSize: 16,
            paddingHorizontal: 20,
            paddingVertical: 14,
            minHeight: height,
            textAlignVertical: 'top',
            fontFamily: 'Outfit-Regular',
            ...inputStyle,
          }}
          placeholder={placeHolder}
          placeholderTextColor="#83735A"
          keyboardType={keyboard as KeyboardType}
          onChangeText={(text) => handler?.(name as string, text)}
          multiline={true}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
        />
      </LinearGradient>
    </View>
  );

  if (!withShadow) {
    return <View style={style}>{InputContent}</View>;
  }

  // Multi-layer shadow matching button design
  return (
    <View style={[{ overflow: 'visible' }, style]}>
      <Shadow
        stretch
        distance={8}
        startColor="rgba(0, 0, 0, 0.03)"
        endColor="rgba(0, 0, 0, 0)"
        offset={[2, 4]}
        containerStyle={{ width: '100%', overflow: 'visible' }}
        style={{
          borderTopLeftRadius: finalBorderTopLeft,
          borderTopRightRadius: finalBorderTopRight,
          borderBottomLeftRadius: finalBorderBottomLeft,
          borderBottomRightRadius: finalBorderBottomRight,
        }}>
        <Shadow
          stretch
          distance={5}
          startColor="rgba(0, 0, 0, 0.07)"
          endColor="rgba(0, 0, 0, 0)"
          offset={[1.8, 3.2]}
          containerStyle={{ width: '100%', overflow: 'visible' }}
          style={{
            borderTopLeftRadius: finalBorderTopLeft,
            borderTopRightRadius: finalBorderTopRight,
            borderBottomLeftRadius: finalBorderBottomLeft,
            borderBottomRightRadius: finalBorderBottomRight,
          }}>
          <Shadow
            stretch
            distance={2.5}
            startColor="rgba(0, 0, 0, 0.1)"
            endColor="rgba(0, 0, 0, 0)"
            offset={[1.2, 2.2]}
            containerStyle={{ width: '100%', overflow: 'visible' }}
            style={{
              borderTopLeftRadius: finalBorderTopLeft,
              borderTopRightRadius: finalBorderTopRight,
              borderBottomLeftRadius: finalBorderBottomLeft,
              borderBottomRightRadius: finalBorderBottomRight,
            }}>
            <Shadow
              stretch
              distance={1}
              startColor="rgba(0, 0, 0, 0.15)"
              endColor="rgba(0, 0, 0, 0)"
              offset={[0.8, 1.5]}
              containerStyle={{ width: '100%', overflow: 'visible' }}
              style={{
                borderTopLeftRadius: finalBorderTopLeft,
                borderTopRightRadius: finalBorderTopRight,
                borderBottomLeftRadius: finalBorderBottomLeft,
                borderBottomRightRadius: finalBorderBottomRight,
              }}>
              {InputContent}
            </Shadow>
          </Shadow>
        </Shadow>
      </Shadow>
    </View>
  );
}
