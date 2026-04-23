import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

type IconProps = SvgProps & {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function CubeIcon({ size = 28, color = '#000', style, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={style} {...props}>
      <Path
        d="M12.8333 25.3519C13.188 25.5567 13.5904 25.6645 14 25.6645C14.4096 25.6645 14.812 25.5567 15.1667 25.3519L23.3333 20.6852C23.6877 20.4806 23.982 20.1864 24.1868 19.8322C24.3916 19.4779 24.4996 19.0761 24.5 18.6669V9.33354C24.4996 8.92436 24.3916 8.52249 24.1868 8.16823C23.982 7.81398 23.6877 7.5198 23.3333 7.31521L15.1667 2.64854C14.812 2.44375 14.4096 2.33594 14 2.33594C13.5904 2.33594 13.188 2.44375 12.8333 2.64854L4.66667 7.31521C4.31231 7.5198 4.01798 7.81398 3.81321 8.16823C3.60843 8.52249 3.50042 8.92436 3.5 9.33354V18.6669C3.50042 19.0761 3.60843 19.4779 3.81321 19.8322C4.01798 20.1864 4.31231 20.4806 4.66667 20.6852L12.8333 25.3519Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 25.6667V14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.83789 8.16602L13.9996 13.9993L24.1612 8.16602"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.75 4.98242L19.25 10.9908"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
