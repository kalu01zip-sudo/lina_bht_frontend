// components/buttons/PrimaryVariantButton.tsx
import {
    TouchableOpacity,
    Text,
    View,
    ViewStyle,
    StyleProp,
    ActivityIndicator,
    TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shadow } from 'react-native-shadow-2';

type PrimaryVariantButtonProps = {
    title?: string;
    onPress?: () => void;
    disabled?: boolean;
    className?: string;
    textClassName?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    isLoading?: boolean;
    loaderColor?: string;
    gradientColors?: readonly [string, string, ...string[]];
    withShadow?: boolean;
    height?: number;

    // Border radius with full control
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;

    // Custom padding for left icon
    leftIconPaddingLeft?: number;
    leftIconPaddingRight?: number;
    rightIconPaddingLeft?: number;
    rightIconPaddingRight?: number;
};

export default function PrimaryVariantButton({
    title,
    onPress,
    disabled = false,
    className = '',
    textClassName = '',
    textStyle = {},
    leftIcon,
    rightIcon,
    isLoading = false,
    loaderColor = '#FFFFFF',
    height = 64,
    style,
    gradientColors = ['#e2d2c1', '#e2d2c1', '#e2d2c1', '#e2d2c1', '#e2d2c1', '#e2d2c1'],
    withShadow = true,
    borderTopLeftRadius = 100,
    borderTopRightRadius = 100,
    borderBottomLeftRadius = 100,
    borderBottomRightRadius = 100,
    leftIconPaddingLeft = 12,
    leftIconPaddingRight = 8,
    rightIconPaddingLeft = 8,
    rightIconPaddingRight = 12,
}: PrimaryVariantButtonProps) {
    const isButtonDisabled = disabled || isLoading;

    const ButtonContent = (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isButtonDisabled}
            style={{
                opacity: isButtonDisabled ? 0.5 : 1,
                overflow: 'hidden',
                borderTopLeftRadius,
                borderTopRightRadius,
                borderBottomLeftRadius,
                borderBottomRightRadius,
            }}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0.14, y: 0 }}
                end={{ x: 0.85, y: 1 }}
                style={{
                    height,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 12,
                    borderTopLeftRadius,
                    borderTopRightRadius,
                    borderBottomLeftRadius,
                    borderBottomRightRadius,
                    borderTopWidth: 1.5,
                    borderLeftWidth: 1.5,
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                    borderTopColor: 'rgba(255, 255, 255, 0.7)',
                    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
                    borderRightColor: 'rgba(255, 255, 255, 0.5)',
                    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                }}>
                {isLoading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="small" color={loaderColor} />
                    </View>
                ) : (
                    <>
                        {/* Left Icon - Now with proper padding and positioned next to text */}
                        {leftIcon && (
                            <View style={{
                                paddingLeft: leftIconPaddingLeft,
                                paddingRight: leftIconPaddingRight,
                            }}>
                                {leftIcon}
                            </View>
                        )}

                        {/* Title - Flexible center */}
                        <View style={{ flexShrink: 1 }}>
                            <Text
                                className={`font-outfitMedium text-btn20 text-[#361A0D] ${textClassName}`}
                                style={[{ textAlign: 'center' }, textStyle]}>
                                {title}
                            </Text>
                        </View>

                        {/* Right Icon - Now with proper padding and positioned next to text */}
                        {rightIcon && (
                            <View style={{
                                paddingLeft: rightIconPaddingLeft,
                                paddingRight: rightIconPaddingRight,
                            }}>
                                {rightIcon}
                            </View>
                        )}

                        {/* Empty view to balance when no right icon */}
                        {!rightIcon && leftIcon && <View style={{ width: 24 }} />}
                        {!leftIcon && rightIcon && <View style={{ width: 24 }} />}
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );

    if (!withShadow) {
        return <View style={style}>{ButtonContent}</View>;
    }

    return (
        <View style={style}>
            <Shadow
                stretch
                distance={8}
                startColor="rgba(0, 0, 0, 0.03)"
                endColor="rgba(0, 0, 0, 0)"
                offset={[2, 4]}
                containerStyle={{ width: '100%' }}
                style={{
                    borderTopLeftRadius,
                    borderTopRightRadius,
                    borderBottomLeftRadius,
                    borderBottomRightRadius,
                }}>
                <Shadow
                    stretch
                    distance={5}
                    startColor="rgba(0, 0, 0, 0.07)"
                    endColor="rgba(0, 0, 0, 0)"
                    offset={[1.8, 3.2]}
                    containerStyle={{ width: '100%' }}
                    style={{
                        borderTopLeftRadius,
                        borderTopRightRadius,
                        borderBottomLeftRadius,
                        borderBottomRightRadius,
                    }}>
                    <Shadow
                        stretch
                        distance={2.5}
                        startColor="rgba(0, 0, 0, 0.1)"
                        endColor="rgba(0, 0, 0, 0)"
                        offset={[1.2, 2.2]}
                        containerStyle={{ width: '100%' }}
                        style={{
                            borderTopLeftRadius,
                            borderTopRightRadius,
                            borderBottomLeftRadius,
                            borderBottomRightRadius,
                        }}>
                        <Shadow
                            stretch
                            distance={1}
                            startColor="rgba(0, 0, 0, 0.15)"
                            endColor="rgba(0, 0, 0, 0)"
                            offset={[0.8, 1.5]}
                            containerStyle={{ width: '100%' }}
                            style={{
                                borderTopLeftRadius,
                                borderTopRightRadius,
                                borderBottomLeftRadius,
                                borderBottomRightRadius,
                            }}>
                            {ButtonContent}
                        </Shadow>
                    </Shadow>
                </Shadow>
            </Shadow>
        </View>
    );
}