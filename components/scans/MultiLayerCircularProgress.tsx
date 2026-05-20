// import React from 'react';
// import { View, Text, Dimensions } from 'react-native';
// import {
//   Svg,
//   Circle,
//   Path,
//   Defs,
//   LinearGradient,
//   Stop,
//   Filter,
//   FeGaussianBlur,
//   FeMerge,
//   FeMergeNode,
//   FeOffset,
// } from 'react-native-svg';

// const { width } = Dimensions.get('window');

// export interface SkinMetric {
//   label: string;
//   value: number;
//   color: string;
//   gradientColors?: string[];
// }

// interface MultiLayerCircularProgressProps {
//   metrics: SkinMetric[];
//   size?: number;
//   circleGap?: number;
//   centerCircleRadius?: number;
//   segmentGap?: number; // New prop for gap between segments (in degrees)
//   centerScore?: number;
// }

// // Draws an SVG arc path on a circle
// function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
//   const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
//   const clampedEnd = Math.min(endDeg, startDeg + 359.99);
//   const x1 = cx + r * Math.cos(toRad(startDeg));
//   const y1 = cy + r * Math.sin(toRad(startDeg));
//   const x2 = cx + r * Math.cos(toRad(clampedEnd));
//   const y2 = cy + r * Math.sin(toRad(clampedEnd));
//   const large = clampedEnd - startDeg > 180 ? 1 : 0;
//   return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
// }

// // Calculate stroke width based on percentage (min 2, max 10)
// const getStrokeWidth = (value: number): number => {
//   return Math.max(2, Math.min(10, (value / 100) * 10));
// };

// const MultiLayerCircularProgress: React.FC<MultiLayerCircularProgressProps> = ({
//   metrics,
//   size = width * 0.85,
//   circleGap = 16,
//   centerCircleRadius = 45,
//   segmentGap = 5, // 3 degrees gap between segments
//   centerScore,
// }) => {
//   // Use all metrics passed
//   const displayMetrics = metrics;
//   const TOTAL_CIRCLES = displayMetrics.length;

//   // Get values and colors from metrics
//   const circleValues = displayMetrics.map((m) => m.value);
//   const segmentColors = displayMetrics.map((m) => m.color);

//   // Default gradient colors for inner circles (fallback)
//   const defaultGradients = [
//     ['#f4e9dd', '#f2dec6'],
//     ['#f3ddc5', '#f1e7dd'],
//     ['#e8d9ca', '#f6e9da'],
//     ['#F0E6D8', '#FFFFFF'],
//     ['#EDE0D4', '#E9D9CB'],
//     ['#E8D9CA', '#F6E9DA'],
//   ];

//   const circleColors = displayMetrics.map(
//     (m, i) => m.gradientColors || defaultGradients[i % defaultGradients.length]
//   );

//   const calculateRadii = () => {
//     const radii = [];
//     const maxRadius = size / 2 - 10;

//     for (let i = 0; i < TOTAL_CIRCLES; i++) {
//       const radius = maxRadius - i * circleGap;
//       radii.push(radius);
//     }
//     return radii;
//   };

//   const radii = calculateRadii();
//   const centerX = size / 2;
//   const centerY = size / 2;

//   // Calculate average score from all metrics

//   const calculatedAverage =
//     metrics.length > 0
//       ? Math.round(metrics.reduce((acc, val) => acc + val.value, 0) / metrics.length)
//       : 0;

//   const displayScore = centerScore ?? calculatedAverage;

//   // Dynamic opacity levels based on number of circles
//   const circleOpacities = displayMetrics.map((_, index) => Math.max(0.4, 0.9 - index * 0.1));

//   // Dynamic light angles for each circle
//   const fixedAngles = [45, 135, 225, 315, 30, 60, 120, 150];

//   // Light intensity for each circle
//   const lightIntensities = displayMetrics.map((_, index) => Math.max(0.5, 0.95 - index * 0.1));

//   // Calculate segments for outer ring with gaps
//   const totalValue = circleValues.reduce((acc, val) => acc + val, 0);
//   const totalGapDegrees = segmentGap * TOTAL_CIRCLES;
//   const availableDegrees = 360 - totalGapDegrees;

//   let currentStartAngle = 0;
//   const segments = circleValues.map((value, index) => {
//     const angleSpan = (value / totalValue) * availableDegrees;
//     const startWithGap = currentStartAngle;
//     const endWithGap = startWithGap + angleSpan;
//     const segment = {
//       value,
//       startAngle: startWithGap,
//       endAngle: endWithGap,
//       color: segmentColors[index],
//     };
//     // Add gap after this segment (except for the last one)
//     currentStartAngle = endWithGap + segmentGap;
//     return segment;
//   });

//   return (
//     <View className="relative items-center justify-center" style={{ width: size, height: size }}>
//       <Svg width={size} height={size}>
//         <Defs>
//           {/* Stronger glow filter for light effects */}
//           <Filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
//             <FeGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
//             <FeMerge>
//               <FeMergeNode in="blur" />
//               <FeMergeNode in="SourceGraphic" />
//             </FeMerge>
//           </Filter>

//           {/* Soft glow filter */}
//           <Filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
//             <FeGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
//             <FeMerge>
//               <FeMergeNode in="blur" />
//               <FeMergeNode in="SourceGraphic" />
//             </FeMerge>
//           </Filter>

//           {/* Soft shadow filter */}
//           <Filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
//             <FeGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
//             <FeOffset in="blur" dx="0" dy="2" result="offsetBlur" />
//             <FeMerge>
//               <FeMergeNode in="offsetBlur" />
//               <FeMergeNode in="SourceGraphic" />
//             </FeMerge>
//           </Filter>

//           {/* Create Linear Gradients for each circle */}
//           {Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
//             const angle = fixedAngles[index % fixedAngles.length];
//             const radian = (angle * Math.PI) / 180;
//             const x1 = 50 + 50 * Math.cos(radian);
//             const y1 = 50 + 50 * Math.sin(radian);
//             const x2 = 50 - 50 * Math.cos(radian);
//             const y2 = 50 - 50 * Math.sin(radian);

//             return (
//               <LinearGradient
//                 key={`linear-${index}`}
//                 id={`gradient-${index}`}
//                 x1={`${x1}%`}
//                 y1={`${y1}%`}
//                 x2={`${x2}%`}
//                 y2={`${y2}%`}>
//                 <Stop
//                   offset="0%"
//                   stopColor={circleColors[index][0]}
//                   stopOpacity={circleOpacities[index]}
//                 />
//                 <Stop
//                   offset="40%"
//                   stopColor={circleColors[index][0]}
//                   stopOpacity={circleOpacities[index] - 0.1}
//                 />
//                 <Stop
//                   offset="100%"
//                   stopColor={circleColors[index][1]}
//                   stopOpacity={circleOpacities[index] - 0.2}
//                 />
//               </LinearGradient>
//             );
//           })}

//           {/* Border gradient 1 - Light from one side */}
//           {Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
//             const angle1 = fixedAngles[index % fixedAngles.length];
//             const radian1 = (angle1 * Math.PI) / 180;
//             const x1_1 = 50 + 50 * Math.cos(radian1);
//             const y1_1 = 50 + 50 * Math.sin(radian1);
//             const x2_1 = 50 - 50 * Math.cos(radian1);
//             const y2_1 = 50 - 50 * Math.sin(radian1);

//             return (
//               <LinearGradient
//                 key={`border1-${index}`}
//                 id={`borderGradient1-${index}`}
//                 x1={`${x1_1}%`}
//                 y1={`${y1_1}%`}
//                 x2={`${x2_1}%`}
//                 y2={`${y2_1}%`}>
//                 <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={lightIntensities[index]} />
//                 <Stop
//                   offset="20%"
//                   stopColor="#FFFFFF"
//                   stopOpacity={lightIntensities[index] - 0.2}
//                 />
//                 <Stop offset="50%" stopColor={circleColors[index][0]} stopOpacity="0.3" />
//                 <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
//               </LinearGradient>
//             );
//           })}

//           {/* Border gradient 2 - Light from opposite side (dual lighting) */}
//           {Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
//             const angle2 = fixedAngles[index % fixedAngles.length] + 180;
//             const radian2 = (angle2 * Math.PI) / 180;
//             const x1_2 = 50 + 50 * Math.cos(radian2);
//             const y1_2 = 50 + 50 * Math.sin(radian2);
//             const x2_2 = 50 - 50 * Math.cos(radian2);
//             const y2_2 = 50 - 50 * Math.sin(radian2);

//             return (
//               <LinearGradient
//                 key={`border2-${index}`}
//                 id={`borderGradient2-${index}`}
//                 x1={`${x1_2}%`}
//                 y1={`${y1_2}%`}
//                 x2={`${x2_2}%`}
//                 y2={`${y2_2}%`}>
//                 <Stop
//                   offset="0%"
//                   stopColor="#FFFFFF"
//                   stopOpacity={lightIntensities[index] - 0.15}
//                 />
//                 <Stop
//                   offset="20%"
//                   stopColor="#FFFFFF"
//                   stopOpacity={lightIntensities[index] - 0.3}
//                 />
//                 <Stop offset="50%" stopColor={circleColors[index][0]} stopOpacity="0.2" />
//                 <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
//               </LinearGradient>
//             );
//           })}

//           {/* Highlight gradients for extra light effects */}
//           {Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
//             const highlightAngle = fixedAngles[index % fixedAngles.length] + 90;
//             const radian = (highlightAngle * Math.PI) / 180;
//             const x1 = 50 + 50 * Math.cos(radian);
//             const y1 = 50 + 50 * Math.sin(radian);
//             const x2 = 50 - 50 * Math.cos(radian);
//             const y2 = 50 - 50 * Math.sin(radian);

//             return (
//               <LinearGradient
//                 key={`highlight-${index}`}
//                 id={`highlightGradient-${index}`}
//                 x1={`${x1}%`}
//                 y1={`${y1}%`}
//                 x2={`${x2}%`}
//                 y2={`${y2}%`}>
//                 <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
//                 <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
//               </LinearGradient>
//             );
//           })}

//           {/* Center circle gradient */}
//           <LinearGradient id="centerGradient" x1="30%" y1="20%" x2="100%" y2="100%">
//             <Stop offset="0%" stopColor="#F0E6D8" stopOpacity="1" />
//             <Stop offset="50%" stopColor="#F5EDE3" stopOpacity="0.9" />
//             <Stop offset="100%" stopColor="#FFFFFF3D" stopOpacity="0.8" />
//           </LinearGradient>

//           {/* Center border gradient with dual lighting */}
//           <LinearGradient id="centerBorderGrad1" x1="20%" y1="10%" x2="80%" y2="90%">
//             <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
//             <Stop offset="40%" stopColor="#F0E6D8" stopOpacity="0.6" />
//             <Stop offset="100%" stopColor="#FFFFFF3D" stopOpacity="0.15" />
//           </LinearGradient>

//           <LinearGradient id="centerBorderGrad2" x1="80%" y1="90%" x2="20%" y2="10%">
//             <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
//             <Stop offset="40%" stopColor="#F0E6D8" stopOpacity="0.4" />
//             <Stop offset="100%" stopColor="#FFFFFF3D" stopOpacity="0.1" />
//           </LinearGradient>
//         </Defs>

//         {/* Background ambient glow */}
//         <Circle
//           cx={centerX}
//           cy={centerY}
//           r={radii[0] + 15}
//           fill="#F0E6D810"
//           filter="url(#strongGlow)"
//         />

//         {/* === SEGMENTED OUTER RING WITH GAPS === */}
//         {segments.map((segment, idx) => {
//           const strokeWidth = getStrokeWidth(segment.value);
//           const radius = radii[0] - 20;

//           return (
//             <Path
//               key={`segment-${idx}`}
//               d={arcPath(centerX, centerY, radius, segment.startAngle, segment.endAngle)}
//               stroke={segment.color}
//               strokeWidth={strokeWidth}
//               strokeLinecap="butt"
//               fill="none"
//               filter="url(#softGlow)"
//               opacity={0.95}
//             />
//           );
//         })}

//         {/* === INNER CIRCLES with full layering === */}
//         {Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
//           const radius = radii[index];
//           const isFirst = index === 0;
//           const isLast = index === TOTAL_CIRCLES - 1;

//           // Skip rendering the outer circle as a filled circle (only its segments are shown)
//           if (isFirst) return null;

//           return (
//             <React.Fragment key={`fragment-${index}`}>
//               {/* Outer ring shadow */}
//               <Circle
//                 cx={centerX}
//                 cy={centerY}
//                 r={radius + 2}
//                 fill="#00000006"
//                 filter="url(#softShadow)"
//               />

//               {/* Main circle with its own linear gradient */}
//               <Circle cx={centerX} cy={centerY} r={radius} fill={`url(#gradient-${index})`} />

//               {/* Extra highlight layer for light effect */}
//               <Circle
//                 cx={centerX}
//                 cy={centerY}
//                 r={radius}
//                 fill={`url(#highlightGradient-${index})`}
//               />

//               {/* White border effect - Light from side 1 */}
//               <Circle
//                 cx={centerX}
//                 cy={centerY}
//                 r={radius}
//                 fill="none"
//                 stroke={`url(#borderGradient1-${index})`}
//                 strokeWidth={2}
//                 opacity={0.85}
//                 filter="url(#softGlow)"
//               />

//               {/* White border effect - Light from opposite side (dual lighting) */}
//               <Circle
//                 cx={centerX}
//                 cy={centerY}
//                 r={radius}
//                 fill="none"
//                 stroke={`url(#borderGradient2-${index})`}
//                 strokeWidth={1.5}
//                 opacity={0.6}
//                 filter="url(#softGlow)"
//               />

//               {/* Dual light reflections - Two spots on opposite sides */}
//               <Circle
//                 cx={centerX - radius * 0.25}
//                 cy={centerY - radius * 0.25}
//                 r={radius * 0.1}
//                 fill="#FFFFFF"
//                 opacity={0.3}
//                 filter="url(#strongGlow)"
//               />
//               <Circle
//                 cx={centerX + radius * 0.2}
//                 cy={centerY + radius * 0.2}
//                 r={radius * 0.07}
//                 fill="#FFFFFF"
//                 opacity={0.18}
//                 filter="url(#strongGlow)"
//               />

//               {/* Subtle inner highlight ring */}
//               {!isLast && (
//                 <Circle
//                   cx={centerX}
//                   cy={centerY}
//                   r={radius - 5}
//                   fill="none"
//                   stroke="#FFFFFF18"
//                   strokeWidth={0.8}
//                 />
//               )}
//             </React.Fragment>
//           );
//         })}

//         {/* === CENTER CIRCLE === */}
//         <Circle
//           cx={centerX}
//           cy={centerY}
//           r={centerCircleRadius}
//           fill="url(#centerGradient)"
//           filter="url(#softShadow)"
//         />

//         {/* Center circle white border - Light from side 1 */}
//         <Circle
//           cx={centerX}
//           cy={centerY}
//           r={centerCircleRadius}
//           fill="none"
//           stroke="url(#centerBorderGrad1)"
//           strokeWidth={2.5}
//           opacity={0.9}
//           filter="url(#strongGlow)"
//         />

//         {/* Center circle white border - Light from side 2 (dual lighting) */}
//         <Circle
//           cx={centerX}
//           cy={centerY}
//           r={centerCircleRadius}
//           fill="none"
//           stroke="url(#centerBorderGrad2)"
//           strokeWidth={2}
//           opacity={0.6}
//           filter="url(#strongGlow)"
//         />

//         {/* Dual center highlight reflections */}
//         <Circle
//           cx={centerX - 14}
//           cy={centerY - 12}
//           r={12}
//           fill="#FFFFFF"
//           opacity={0.45}
//           filter="url(#strongGlow)"
//         />
//         <Circle
//           cx={centerX + 10}
//           cy={centerY + 10}
//           r={8}
//           fill="#FFFFFF"
//           opacity={0.2}
//           filter="url(#strongGlow)"
//         />

//         {/* Inner subtle ring for depth */}
//         <Circle
//           cx={centerX}
//           cy={centerY}
//           r={centerCircleRadius - 8}
//           fill="none"
//           stroke="#FFFFFF25"
//           strokeWidth={0.8}
//         />

//         {/* Outer soft ring for blending */}
//         <Circle
//           cx={centerX}
//           cy={centerY}
//           r={centerCircleRadius + 4}
//           fill="none"
//           stroke="#F0E6D825"
//           strokeWidth={1.5}
//           filter="url(#softGlow)"
//         />
//       </Svg>

//       {/* Center Content */}
//       <View className="absolute h-full w-full items-center justify-center">
//         <Text className="font-outfitBold text-[38px] leading-[44px] text-[#361A0D]">
//           {displayScore}
//         </Text>
//         <Text className="mt-1.5 font-outfitMedium text-[11px] tracking-[0.5px] text-[#CAA789]">
//           Score
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default MultiLayerCircularProgress;

import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import {
  Svg,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Filter,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
  FeOffset,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

export interface SkinMetric {
  label: string;
  value: number;
  color: string;
  gradientColors?: string[];
}

interface MultiLayerCircularProgressProps {
  metrics: SkinMetric[];
  size?: number;
  circleGap?: number;
  centerCircleRadius?: number;
  segmentGap?: number;
  centerScore?: number;
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const clampedEnd = Math.min(endDeg, startDeg + 359.99);
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(clampedEnd));
  const y2 = cy + r * Math.sin(toRad(clampedEnd));
  const large = clampedEnd - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

const getStrokeWidth = (value: number): number => Math.max(2, Math.min(10, (value / 100) * 10));

const MultiLayerCircularProgress: React.FC<MultiLayerCircularProgressProps> = ({
  metrics,
  size = width * 0.85,
  circleGap = 16,
  centerCircleRadius = 45,
  segmentGap = 5,
  centerScore,
}) => {
  const displayMetrics = metrics;
  const TOTAL_CIRCLES = displayMetrics.length;

  const circleValues = displayMetrics.map((m) => m.value);
  const segmentColors = displayMetrics.map((m) => m.color);

  const defaultGradients = [
    ['#f4e9dd', '#f2dec6'],
    ['#f3ddc5', '#f1e7dd'],
    ['#e8d9ca', '#f6e9da'],
    ['#F0E6D8', '#FFFFFF'],
    ['#EDE0D4', '#E9D9CB'],
    ['#E8D9CA', '#F6E9DA'],
  ];

  const circleColors = displayMetrics.map(
    (m, i) => m.gradientColors || defaultGradients[i % defaultGradients.length]
  );

  const calculateRadii = () => {
    const radii = [];
    const maxRadius = size / 2 - 10;
    for (let i = 0; i < TOTAL_CIRCLES; i++) {
      radii.push(maxRadius - i * circleGap);
    }
    return radii;
  };

  const radii = calculateRadii();
  const centerX = size / 2;
  const centerY = size / 2;

  // centerScore is always passed explicitly from AnalysingResultScoreCard.
  // Only fall back to calculated average if it is genuinely absent (undefined).
  const displayScore =
    centerScore !== undefined
      ? centerScore
      : metrics.length > 0
        ? Math.round(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length)
        : 0;

  const circleOpacities = displayMetrics.map((_, index) => Math.max(0.4, 0.9 - index * 0.1));
  const fixedAngles = [45, 135, 225, 315, 30, 60, 120, 150];
  const lightIntensities = displayMetrics.map((_, index) => Math.max(0.5, 0.95 - index * 0.1));

  const totalValue = circleValues.reduce((acc, val) => acc + val, 0);
  const totalGapDegrees = segmentGap * TOTAL_CIRCLES;
  const availableDegrees = 360 - totalGapDegrees;

  let currentStartAngle = 0;
  const segments = circleValues.map((value, index) => {
    const angleSpan = (value / totalValue) * availableDegrees;
    const startWithGap = currentStartAngle;
    const endWithGap = startWithGap + angleSpan;
    const segment = {
      value,
      startAngle: startWithGap,
      endAngle: endWithGap,
      color: segmentColors[index],
    };
    currentStartAngle = endWithGap + segmentGap;
    return segment;
  });

  return (
    <View className="relative items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <Filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <FeMerge>
              <FeMergeNode in="blur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
          <Filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <FeMerge>
              <FeMergeNode in="blur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
          <Filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <FeGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <FeOffset in="blur" dx="0" dy="2" result="offsetBlur" />
            <FeMerge>
              <FeMergeNode in="offsetBlur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>

          {Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
            const angle = fixedAngles[index % fixedAngles.length];
            const radian = (angle * Math.PI) / 180;
            const x1 = 50 + 50 * Math.cos(radian);
            const y1 = 50 + 50 * Math.sin(radian);
            const x2 = 50 - 50 * Math.cos(radian);
            const y2 = 50 - 50 * Math.sin(radian);
            return (
              <LinearGradient
                key={`linear-${index}`}
                id={`gradient-${index}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}>
                <Stop
                  offset="0%"
                  stopColor={circleColors[index][0]}
                  stopOpacity={circleOpacities[index]}
                />
                <Stop
                  offset="40%"
                  stopColor={circleColors[index][0]}
                  stopOpacity={circleOpacities[index] - 0.1}
                />
                <Stop
                  offset="100%"
                  stopColor={circleColors[index][1]}
                  stopOpacity={circleOpacities[index] - 0.2}
                />
              </LinearGradient>
            );
          })}

          {Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
            const angle1 = fixedAngles[index % fixedAngles.length];
            const radian1 = (angle1 * Math.PI) / 180;
            const x1_1 = 50 + 50 * Math.cos(radian1);
            const y1_1 = 50 + 50 * Math.sin(radian1);
            const x2_1 = 50 - 50 * Math.cos(radian1);
            const y2_1 = 50 - 50 * Math.sin(radian1);
            return (
              <LinearGradient
                key={`border1-${index}`}
                id={`borderGradient1-${index}`}
                x1={`${x1_1}%`}
                y1={`${y1_1}%`}
                x2={`${x2_1}%`}
                y2={`${y2_1}%`}>
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={lightIntensities[index]} />
                <Stop
                  offset="20%"
                  stopColor="#FFFFFF"
                  stopOpacity={lightIntensities[index] - 0.2}
                />
                <Stop offset="50%" stopColor={circleColors[index][0]} stopOpacity="0.3" />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
              </LinearGradient>
            );
          })}

          {Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
            const angle2 = fixedAngles[index % fixedAngles.length] + 180;
            const radian2 = (angle2 * Math.PI) / 180;
            const x1_2 = 50 + 50 * Math.cos(radian2);
            const y1_2 = 50 + 50 * Math.sin(radian2);
            const x2_2 = 50 - 50 * Math.cos(radian2);
            const y2_2 = 50 - 50 * Math.sin(radian2);
            return (
              <LinearGradient
                key={`border2-${index}`}
                id={`borderGradient2-${index}`}
                x1={`${x1_2}%`}
                y1={`${y1_2}%`}
                x2={`${x2_2}%`}
                y2={`${y2_2}%`}>
                <Stop
                  offset="0%"
                  stopColor="#FFFFFF"
                  stopOpacity={lightIntensities[index] - 0.15}
                />
                <Stop
                  offset="20%"
                  stopColor="#FFFFFF"
                  stopOpacity={lightIntensities[index] - 0.3}
                />
                <Stop offset="50%" stopColor={circleColors[index][0]} stopOpacity="0.2" />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
              </LinearGradient>
            );
          })}

          {Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
            const highlightAngle = fixedAngles[index % fixedAngles.length] + 90;
            const radian = (highlightAngle * Math.PI) / 180;
            const x1 = 50 + 50 * Math.cos(radian);
            const y1 = 50 + 50 * Math.sin(radian);
            const x2 = 50 - 50 * Math.cos(radian);
            const y2 = 50 - 50 * Math.sin(radian);
            return (
              <LinearGradient
                key={`highlight-${index}`}
                id={`highlightGradient-${index}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}>
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </LinearGradient>
            );
          })}

          <LinearGradient id="centerGradient" x1="30%" y1="20%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F0E6D8" stopOpacity="1" />
            <Stop offset="50%" stopColor="#F5EDE3" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#FFFFFF3D" stopOpacity="0.8" />
          </LinearGradient>
          <LinearGradient id="centerBorderGrad1" x1="20%" y1="10%" x2="80%" y2="90%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="40%" stopColor="#F0E6D8" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#FFFFFF3D" stopOpacity="0.15" />
          </LinearGradient>
          <LinearGradient id="centerBorderGrad2" x1="80%" y1="90%" x2="20%" y2="10%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <Stop offset="40%" stopColor="#F0E6D8" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#FFFFFF3D" stopOpacity="0.1" />
          </LinearGradient>
        </Defs>

        <Circle
          cx={centerX}
          cy={centerY}
          r={radii[0] + 15}
          fill="#F0E6D810"
          filter="url(#strongGlow)"
        />

        {segments.map((segment, idx) => {
          const strokeWidth = getStrokeWidth(segment.value);
          const radius = radii[0] - 20;
          return (
            <Path
              key={`segment-${idx}`}
              d={arcPath(centerX, centerY, radius, segment.startAngle, segment.endAngle)}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              fill="none"
              filter="url(#softGlow)"
              opacity={0.95}
            />
          );
        })}

        {Array.from({ length: TOTAL_CIRCLES }).map((_, index) => {
          const radius = radii[index];
          const isFirst = index === 0;
          const isLast = index === TOTAL_CIRCLES - 1;
          if (isFirst) return null;
          return (
            <React.Fragment key={`fragment-${index}`}>
              <Circle
                cx={centerX}
                cy={centerY}
                r={radius + 2}
                fill="#00000006"
                filter="url(#softShadow)"
              />
              <Circle cx={centerX} cy={centerY} r={radius} fill={`url(#gradient-${index})`} />
              <Circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill={`url(#highlightGradient-${index})`}
              />
              <Circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={`url(#borderGradient1-${index})`}
                strokeWidth={2}
                opacity={0.85}
                filter="url(#softGlow)"
              />
              <Circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={`url(#borderGradient2-${index})`}
                strokeWidth={1.5}
                opacity={0.6}
                filter="url(#softGlow)"
              />
              <Circle
                cx={centerX - radius * 0.25}
                cy={centerY - radius * 0.25}
                r={radius * 0.1}
                fill="#FFFFFF"
                opacity={0.3}
                filter="url(#strongGlow)"
              />
              <Circle
                cx={centerX + radius * 0.2}
                cy={centerY + radius * 0.2}
                r={radius * 0.07}
                fill="#FFFFFF"
                opacity={0.18}
                filter="url(#strongGlow)"
              />
              {!isLast && (
                <Circle
                  cx={centerX}
                  cy={centerY}
                  r={radius - 5}
                  fill="none"
                  stroke="#FFFFFF18"
                  strokeWidth={0.8}
                />
              )}
            </React.Fragment>
          );
        })}

        <Circle
          cx={centerX}
          cy={centerY}
          r={centerCircleRadius}
          fill="url(#centerGradient)"
          filter="url(#softShadow)"
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={centerCircleRadius}
          fill="none"
          stroke="url(#centerBorderGrad1)"
          strokeWidth={2.5}
          opacity={0.9}
          filter="url(#strongGlow)"
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={centerCircleRadius}
          fill="none"
          stroke="url(#centerBorderGrad2)"
          strokeWidth={2}
          opacity={0.6}
          filter="url(#strongGlow)"
        />
        <Circle
          cx={centerX - 14}
          cy={centerY - 12}
          r={12}
          fill="#FFFFFF"
          opacity={0.45}
          filter="url(#strongGlow)"
        />
        <Circle
          cx={centerX + 10}
          cy={centerY + 10}
          r={8}
          fill="#FFFFFF"
          opacity={0.2}
          filter="url(#strongGlow)"
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={centerCircleRadius - 8}
          fill="none"
          stroke="#FFFFFF25"
          strokeWidth={0.8}
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={centerCircleRadius + 4}
          fill="none"
          stroke="#F0E6D825"
          strokeWidth={1.5}
          filter="url(#softGlow)"
        />
      </Svg>

      <View className="absolute h-full w-full items-center justify-center">
        <Text className="font-outfitBold text-[38px] leading-[44px] text-[#361A0D]">
          {displayScore}
        </Text>
        <Text className="mt-1.5 font-outfitMedium text-[11px] tracking-[0.5px] text-[#CAA789]">
          Score
        </Text>
      </View>
    </View>
  );
};

export default MultiLayerCircularProgress;
