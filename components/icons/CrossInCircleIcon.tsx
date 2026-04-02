import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

type IconProps = SvgProps & {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function CrossInCircleIcon({ size = 32, color = '#000', style, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style} {...props}>
      <Path
        d="M16.0003 29.3327C23.3641 29.3327 29.3337 23.3631 29.3337 15.9993C29.3337 8.63555 23.3641 2.66602 16.0003 2.66602C8.63653 2.66602 2.66699 8.63555 2.66699 15.9993C2.66699 23.3631 8.63653 29.3327 16.0003 29.3327Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 12L12 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 12L20 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
