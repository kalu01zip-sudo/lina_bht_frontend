import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

type IconProps = SvgProps & {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function FlameIcon({ size = 16, color = '#000', style, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style} {...props}>
      <Path
        d="M7.99967 14.6667C9.23735 14.6667 10.4243 14.175 11.2995 13.2998C12.1747 12.4247 12.6663 11.2377 12.6663 10C12.6663 8.66667 11.9997 7.4 10.6663 6.33333C9.33301 5.26667 8.33301 3.66667 7.99967 2C7.66634 3.66667 6.66634 5.26667 5.33301 6.33333C3.99967 7.4 3.33301 8.66667 3.33301 10C3.33301 11.2377 3.82467 12.4247 4.69984 13.2998C5.57501 14.175 6.762 14.6667 7.99967 14.6667Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
