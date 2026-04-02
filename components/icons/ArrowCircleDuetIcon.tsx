import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

type IconProps = SvgProps & {
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
};

export function PlusIcon({ size = 18, color = '#000', style, ...props }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style} {...props}>
            <Path
                d="M3.75 9H14.25"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9 3.75V14.25"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
