// import React from 'react';
// import {
//     StyleProp,
//     Text,
//     View,
//     ViewStyle,
//     TouchableOpacity,
//     TextStyle
// } from 'react-native';

// type PillowBadgeProps = {
//     title?: string;
//     className?: string;
//     style?: StyleProp<ViewStyle>;
//     textStyle?: StyleProp<TextStyle>;
//     onPress?: () => void;
// };

// export default function PillowBadge({
//     title,
//     className = '',
//     style,
//     textStyle,
//     onPress
// }: PillowBadgeProps) {

//     // 1. Match your specific design: rounded-[9999px] and items-center
//     const containerClasses = `rounded-[9999px] items-center justify-center ${className}`;

//     // 2. Initial Styles from your example
//     const defaultContainerStyle: ViewStyle = {
//         backgroundColor: '#CAA78933',
//         paddingVertical: 4,
//         paddingHorizontal: 12,
//     };

//     const defaultTextStyle: TextStyle = {
//         color: '#361A0D',
//     };

//     // Shared content to keep the code DRY
//     const renderContent = () => (
//         <Text
//             className="font-outfitMedium text-[12px]"
//             style={[defaultTextStyle, textStyle]}
//         >
//             {title}
//         </Text>
//     );

//     if (onPress) {
//         return (
//             <TouchableOpacity
//                 onPress={onPress}
//                 activeOpacity={0.7}
//                 // Array style allows merging default styles with custom passed-in styles
//                 style={[defaultContainerStyle, style]}
//                 className={containerClasses}
//             >
//                 {renderContent()}
//             </TouchableOpacity>
//         );
//     }

//     return (
//         <View
//             style={[defaultContainerStyle, style]}
//             className={containerClasses}
//         >
//             {renderContent()}
//         </View>
//     );
// }


import React from 'react';
import {
    StyleProp,
    Text,
    View,
    ViewStyle,
    TouchableOpacity,
    TextStyle,
} from 'react-native';

type PillowBadgeProps = {
    title?: string;
    className?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    onPress?: () => void;

    // ✅ NEW
    leftIcon?: React.ReactNode;
};

export default function PillowBadge({
    title,
    className = '',
    style,
    textStyle,
    onPress,
    leftIcon,
}: PillowBadgeProps) {
    const containerClasses = `
    rounded-full 
    border-t-[1.5px] border-t-white/40 
    border-l-[1px] border-l-white/20 
    border-b-[1.5px] border-b-white/40 
    border-r-[1px] border-r-white/20 
    flex-row items-center justify-center 
    ${className}
    `;
    // const containerClasses = `rounded-[9999px] flex-row items-center justify-center ${className}`;

    const defaultContainerStyle: ViewStyle = {
        backgroundColor: '#CAA78933',
        paddingVertical: 4,
        paddingHorizontal: 12,
    };

    const defaultTextStyle: TextStyle = {
        color: '#361A0D',
    };

    const renderContent = () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* ✅ Left Icon */}
            {leftIcon && (
                <View
                    style={{
                        width: 12,
                        height: 12,
                        marginRight: 10, // 👈 gap
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {leftIcon}
                </View>
            )}

            {/* ✅ Text */}
            <Text
                className="font-outfitMedium text-[12px]"
                style={[defaultTextStyle, textStyle]}
                numberOfLines={1}
            >
                {title}
            </Text>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={[defaultContainerStyle, style]}
                className={containerClasses}
            >
                {renderContent()}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[defaultContainerStyle, style]} className={containerClasses}>
            {renderContent()}
        </View>
    );
}