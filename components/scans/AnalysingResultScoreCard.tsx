// // components/scans/AnalysingResultScoreCard.tsx
// import React from 'react';
// import { View, Text } from 'react-native';
// import BorderlessShadowCard from '../cards/BorderlessShadowCard';
// import MultiLayerCircularProgress, { SkinMetric } from './MultiLayerCircularProgress';

// interface SkinStat {
//   label: string;
//   value: string;
//   color: string;
// }

// interface AnalysingResultScoreCardProps {
//   title?: string;
//   stats: SkinStat[];
//   averageScore?: number; // New prop - overall average score from backend
//   overallScore?: number;
// }

// export default function AnalysingResultScoreCard({
//   title = 'Face Scan Result',
//   stats,
//   averageScore, // Backend-provided average score
//   overallScore,
// }: AnalysingResultScoreCardProps) {
//   // Convert stats to metrics format for the circular progress
//   const metrics: SkinMetric[] = stats.map((stat, index) => ({
//     label: stat.label,
//     value: parseInt(stat.value, 10),
//     color: stat.color,
//   }));

//   // Use overallScore from props, or fallback to calculated average
//   const centerScore =
//     overallScore ??
//     (metrics.length > 0
//       ? Math.round(metrics.reduce((acc, val) => acc + val.value, 0) / metrics.length)
//       : 0);

//   return (
//     <BorderlessShadowCard
//       b_tl={24}
//       b_tr={24}
//       b_bl={24}
//       b_br={24}
//       style={{
//         paddingVertical: 30,
//         paddingHorizontal: 24,
//         alignItems: 'center',
//         marginBottom: 0,
//         borderWidth: 1,
//         borderColor: '#FFFFFF99',
//       }}>
//       <Text className="font-outfitMedium text-[20px] text-[#361A0D]">{title}</Text>

//       <MultiLayerCircularProgress
//         metrics={metrics}
//         size={300}
//         circleGap={24}
//         centerCircleRadius={52}
//         centerScore={centerScore}
//       />

//       {/* Stats list */}
//       <View className="w-full">
//         {metrics.map((item, index) => (
//           <View key={index} className="mb-3 w-full flex-row items-center">
//             <View className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
//             <Text className="ms-3 font-outfit text-[14px] text-[#5A5A5A]">{item.label}</Text>
//             <Text className="ml-auto font-outfitMedium text-[14px] text-[#2A2118]">
//               {item.value}%
//             </Text>
//           </View>
//         ))}
//       </View>
//     </BorderlessShadowCard>
//   );
// }

// components/scans/AnalysingResultScoreCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import BorderlessShadowCard from '../cards/BorderlessShadowCard';
import MultiLayerCircularProgress, { SkinMetric } from './MultiLayerCircularProgress';

interface SkinStat {
  label: string;
  value: string;
  color: string;
}

interface AnalysingResultScoreCardProps {
  title?: string;
  stats: SkinStat[];
  averageScore?: number;
  overallScore?: number;
}

export default function AnalysingResultScoreCard({
  title = 'Face Scan Result',
  stats,
  averageScore,
  overallScore,
}: AnalysingResultScoreCardProps) {
  const metrics: SkinMetric[] = stats.map((stat) => ({
    label: stat.label,
    value: parseInt(stat.value, 10),
    color: stat.color,
  }));

  // Use overallScore when it is explicitly provided (including 0),
  // otherwise fall back to the average of the score profile values.
  const centerScore =
    overallScore !== undefined
      ? overallScore
      : metrics.length > 0
        ? Math.round(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length)
        : 0;

  return (
    <BorderlessShadowCard
      b_tl={24}
      b_tr={24}
      b_bl={24}
      b_br={24}
      style={{
        paddingVertical: 30,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginBottom: 0,
        borderWidth: 1,
        borderColor: '#FFFFFF99',
      }}>
      <Text className="font-outfitMedium text-[20px] text-[#361A0D]">{title}</Text>

      <MultiLayerCircularProgress
        metrics={metrics}
        size={300}
        circleGap={24}
        centerCircleRadius={52}
        centerScore={centerScore}
      />

      {/* Stats list */}
      <View className="w-full">
        {metrics.map((item, index) => (
          <View key={index} className="mb-3 w-full flex-row items-center">
            <View className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <Text className="ms-3 font-outfit text-[14px] text-[#5A5A5A]">{item.label}</Text>
            <Text className="ml-auto font-outfitMedium text-[14px] text-[#2A2118]">
              {item.value}%
            </Text>
          </View>
        ))}
      </View>
    </BorderlessShadowCard>
  );
}
