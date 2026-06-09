import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

type IconProps = SvgProps & {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function FaceScanIcon({ size = 26, color = '#000', style, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none" style={style} {...props}>
      <Path
        d="M3.25 7.58333V5.41667C3.25 4.84203 3.47827 4.29093 3.8846 3.8846C4.29093 3.47827 4.84203 3.25 5.41667 3.25H7.58333"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.417 3.25H20.5837C21.1583 3.25 21.7094 3.47827 22.1157 3.8846C22.5221 4.29093 22.7503 4.84203 22.7503 5.41667V7.58333"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22.7503 18.416V20.5827C22.7503 21.1573 22.5221 21.7084 22.1157 22.1147C21.7094 22.5211 21.1583 22.7493 20.5837 22.7493H18.417"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.58333 22.7493H5.41667C4.84203 22.7493 4.29093 22.5211 3.8846 22.1147C3.47827 21.7084 3.25 21.1573 3.25 20.5827V18.416"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.66699 15.166C8.66699 15.166 10.292 17.3327 13.0003 17.3327C15.7087 17.3327 17.3337 15.166 17.3337 15.166"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.75 9.75H9.76"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.25 9.75H16.26"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
