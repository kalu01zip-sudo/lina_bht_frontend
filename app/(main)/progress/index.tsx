// /* eslint-disable import/no-unresolved */
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Dimensions,
//   Image,
// } from 'react-native';
// import React, { useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LineChart } from 'react-native-gifted-charts';
// import ImageView from 'react-native-image-viewing';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import IconBadge from '@/components/icons/modified/IconBadge';
// import { CurvedArrowTopRightIcon } from '@/components/icons';

// const { width } = Dimensions.get('window');

// type TabType = 'analytics' | 'beforeAfter';

// interface ScoreData {
//   week: string;
//   score: number;
//   date: string;
// }

// interface BeforeAfterItem {
//   id: string;
//   before: string;
//   after: string;
//   date: string;
//   message: string;
// }

// const ProgressScreen = () => {
//   const [activeTab, setActiveTab] = useState<TabType>('analytics');
//   const [imageViewerVisible, setImageViewerVisible] = useState(false);
//   const [selectedImages, setSelectedImages] = useState<string[]>([]);
//   const [imageIndex, setImageIndex] = useState(0);

//   // Sample data - replace with API data later
//   const weeklyScores: ScoreData[] = [
//     { week: 'W1', score: 45, date: 'Jan 1' },
//     { week: 'W2', score: 52, date: 'Jan 8' },
//     { week: 'W3', score: 48, date: 'Jan 15' },
//     { week: 'W4', score: 58, date: 'Jan 22' },
//     { week: 'W5', score: 65, date: 'Jan 29' },
//     { week: 'W6', score: 72, date: 'Feb 5' },
//     { week: 'W7', score: 78, date: 'Feb 12' },
//     { week: 'W8', score: 82, date: 'Feb 19' },
//   ];

//   // Sample before/after data with actual image URLs and messages
//   const beforeAfterData: BeforeAfterItem[] = [
//     {
//       id: '1',
//       before: 'https://randomuser.me/api/portraits/women/68.jpg',
//       after: 'https://randomuser.me/api/portraits/women/44.jpg',
//       date: 'Week 1 → Week 8',
//       message: 'Noticeable reduction in redness and improved hydration.',
//     },
//     {
//       id: '2',
//       before: 'https://randomuser.me/api/portraits/women/32.jpg',
//       after: 'https://randomuser.me/api/portraits/women/55.jpg',
//       date: 'Week 2 → Week 6',
//       message: 'Significant improvement in skin texture and glow.',
//     },
//     {
//       id: '3',
//       before: 'https://randomuser.me/api/portraits/women/91.jpg',
//       after: 'https://randomuser.me/api/portraits/women/79.jpg',
//       date: 'Week 3 → Week 7',
//       message: 'Reduced pore size and better skin barrier function.',
//     },
//   ];

//   // Prepare chart data with abbreviated weeks
//   const chartData = weeklyScores.map((item) => ({
//     value: item.score,
//     label: item.week,
//     dataPointText: item.score.toString(),
//   }));

//   const getAverageScore = () => {
//     const sum = weeklyScores.reduce((acc, curr) => acc + curr.score, 0);
//     return Math.round(sum / weeklyScores.length);
//   };

//   const getHighestScore = () => {
//     return Math.max(...weeklyScores.map((item) => item.score));
//   };

//   const getImprovement = () => {
//     const first = weeklyScores[0].score;
//     const last = weeklyScores[weeklyScores.length - 1].score;
//     const improvement = last - first;
//     return improvement > 0 ? `+${improvement}` : `${improvement}`;
//   };

//   const handleImagePress = (imageUrl: string) => {
//     setSelectedImages([imageUrl]);
//     setImageIndex(0);
//     setImageViewerVisible(true);
//   };

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader
//         title="Your Progress"
//         subtitle="Track your skin's journey over time."
//         height={70}
//         backButton={false}
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 20,
//           flexGrow: 1,
//         }}
//         className="flex-1">
//         <View className="px-container">
//           {/* Tabs Container */}
//           <BorderlessShadowCard
//             b_tl={24}
//             b_tr={24}
//             b_bl={0}
//             b_br={0}
//             style={{
//               paddingVertical: 20,
//               paddingHorizontal: 24,
//             }}>
//             {/* Tabs inside the same container */}
//             <View className="flex-row gap-4">
//               <TouchableOpacity
//                 activeOpacity={1}
//                 onPress={() => setActiveTab('analytics')}
//                 style={{ flex: 1 }}>
//                 <BorderlessShadowCard
//                   b_tl={6}
//                   b_tr={6}
//                   b_bl={6}
//                   b_br={6}
//                   style={{
//                     paddingVertical: 8,
//                     alignItems: 'center',
//                     backgroundColor: activeTab === 'analytics' ? '#F0E6D8' : '#E8DDD0',
//                   }}>
//                   <Text
//                     className="font-outfitMedium text-[14px]"
//                     style={{ color: activeTab === 'analytics' ? '#7A8B6A' : '#2E211780' }}>
//                     Analytics
//                   </Text>
//                 </BorderlessShadowCard>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 activeOpacity={1}
//                 onPress={() => setActiveTab('beforeAfter')}
//                 style={{ flex: 1 }}>
//                 <BorderlessShadowCard
//                   b_tl={6}
//                   b_tr={6}
//                   b_bl={6}
//                   b_br={6}
//                   style={{
//                     paddingVertical: 8,
//                     alignItems: 'center',
//                     backgroundColor: activeTab === 'beforeAfter' ? '#F0E6D8' : '#E8DDD0',
//                   }}>
//                   <Text
//                     className="font-outfitMedium text-[14px]"
//                     style={{ color: activeTab === 'beforeAfter' ? '#7A8B6A' : '#2E211780' }}>
//                     Before & After
//                   </Text>
//                 </BorderlessShadowCard>
//               </TouchableOpacity>
//             </View>
//           </BorderlessShadowCard>

//           {/* Stats Row - Separate Card with 0 border radius and margin top 16 */}
//           {/* <BorderlessShadowCard
//             b_tl={0}
//             b_tr={0}
//             b_bl={0}
//             b_br={0}
//             style={{
//               marginTop: 16,
//               paddingVertical: 20,
//               paddingHorizontal: 24,
//             }}>
//             <View className="flex-row justify-between">
//               <View className="items-center">
//                 <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
//                   Average Score
//                 </Text>
//                 <Text className="font-outfitBold mt-1 text-[24px]" style={{ color: '#2E2117' }}>
//                   {getAverageScore()}
//                 </Text>
//               </View>
//               <View className="items-center">
//                 <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
//                   Highest Score
//                 </Text>
//                 <Text className="font-outfitBold mt-1 text-[24px]" style={{ color: '#2E2117' }}>
//                   {getHighestScore()}
//                 </Text>
//               </View>
//               <View className="items-center">
//                 <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
//                   Improvement
//                 </Text>
//                 <Text
//                   className="font-outfitBold mt-1 text-[24px]"
//                   style={{ color: getImprovement().startsWith('+') ? '#10B981' : '#EF4444' }}>
//                   {getImprovement()}
//                 </Text>
//               </View>
//             </View>
//           </BorderlessShadowCard> */}

//           {/* Analytics Tab Content */}
//           {activeTab === 'analytics' && (
//             <BorderlessShadowCard
//               b_tl={0}
//               b_tr={0}
//               b_bl={0}
//               b_br={0}
//               style={{
//                 marginTop: 16,
//                 paddingVertical: 24,
//                 paddingHorizontal: 24,
//               }}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 <View>
//                   <View className="mb-6 flex-row items-center justify-between bg-red-400">
//                     {/* Left side: Text Content */}
//                     <View className="flex-1 pr-4">
//                       <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E2117' }}>
//                         Overall Skin Score
//                       </Text>
//                       <Text className="text-[12px] opacity-60">+13% this month</Text>
//                     </View>

//                     {/* Right side: Badge */}
//                     <View>
//                       <IconBadge
//                         style={{ backgroundColor: '#7A8B6A1A' }}
//                         size={40}
//                         icon={<CurvedArrowTopRightIcon size={20} color="#7A8B6A" />}
//                       />
//                     </View>
//                   </View>
//                   <LineChart
//                     data={chartData}
//                     height={250}
//                     width={Math.max(width - 60, chartData.length * 55)}
//                     spacing={45}
//                     initialSpacing={10}
//                     color1="#7A8B6A"
//                     textColor1="#2E2117"
//                     textFontSize={10}
//                     textShiftY={-8}
//                     dataPointsColor1="#7A8B6A"
//                     dataPointsHeight={6}
//                     dataPointsWidth={6}
//                     showVerticalLines={false}
//                     showXAxisIndices={true}
//                     xAxisIndicesColor="#2E211733"
//                     xAxisColor="#2E211733"
//                     yAxisColor="#2E211733"
//                     yAxisTextStyle={{
//                       color: '#9C7C5C',
//                       fontSize: 12,
//                       fontFamily: 'Outfit-Regular',
//                     }}
//                     xAxisLabelTextStyle={{
//                       color: '#9C7C5C',
//                       fontSize: 12,
//                       fontFamily: 'Outfit-Regular',
//                     }}
//                     yAxisSide="left"
//                     yAxisIndices={[0, 20, 40, 60, 80, 100]}
//                     yAxisIndicesHeight={6}
//                     noOfSections={5}
//                     maxValue={100}
//                     minValue={0}
//                     stepValue={20}
//                     areaChart
//                     startFillColor="#7A8B6A33"
//                     endFillColor="#7A8B6A00"
//                     startOpacity={0.4}
//                     endOpacity={0}
//                     isAnimated
//                     animationDuration={1000}
//                     pointerConfig={{
//                       pointerStripHeight: 250,
//                       pointerStripColor: '#7A8B6A',
//                       pointerColor: '#7A8B6A',
//                       radius: 6,
//                       pointerLabelWidth: 40,
//                       pointerLabelHeight: 25,
//                       activatePointersOnLongPress: true,
//                       autoAdjustPointerLabelPosition: true,
//                       pointerLabelComponent: (items: any) => (
//                         <View
//                           style={{
//                             backgroundColor: '#7A8B6A',
//                             borderRadius: 8,
//                           }}>
//                           <Text
//                             style={{ color: 'white', fontSize: 12, fontFamily: 'outfit-medium' }}>
//                             {items[0].value}
//                           </Text>
//                         </View>
//                       ),
//                     }}
//                   />
//                 </View>
//               </ScrollView>

//               {/* Legend */}
//               <View className="mt-4 flex-row justify-center gap-6">
//                 <View className="flex-row items-center gap-2">
//                   <View className="h-2 w-4 rounded-full bg-[#7A8B6A]" />
//                   <Text className="font-outfit text-[10px]" style={{ color: '#2E211799' }}>
//                     Skin Health Score
//                   </Text>
//                 </View>
//               </View>
//             </BorderlessShadowCard>
//           )}

//           {/* Before & After Tab Content */}
//           {activeTab === 'beforeAfter' && (
//             <View className="mt-0">
//               {beforeAfterData.map((item, index) => {
//                 const isFirst = index === 0;
//                 const isLast = index === beforeAfterData.length - 1;

//                 return (
//                   <View key={item.id}>
//                     <BorderlessShadowCard
//                       b_tl={isFirst ? 0 : 0}
//                       b_tr={isFirst ? 0 : 0}
//                       b_bl={isLast ? 24 : 0}
//                       b_br={isLast ? 24 : 0}
//                       style={{
//                         paddingVertical: 16,
//                         paddingHorizontal: 16,
//                         marginTop: 16,
//                       }}>
//                       <Text
//                         className="mb-3 text-center font-outfitMedium text-[14px]"
//                         style={{ color: '#2E2117' }}>
//                         {item.date}
//                       </Text>

//                       <View className="flex-row justify-between gap-4">
//                         {/* Before Image */}
//                         <TouchableOpacity
//                           onPress={() => handleImagePress(item.before)}
//                           activeOpacity={0.9}
//                           className="flex-1">
//                           <Text
//                             className="mb-2 text-center font-outfit text-[12px]"
//                             style={{ color: '#2E211799' }}>
//                             Before
//                           </Text>
//                           <View
//                             style={{
//                               height: 180,
//                               backgroundColor: '#F5EDE3',
//                               borderRadius: 12,
//                               overflow: 'hidden',
//                             }}>
//                             <Image
//                               source={{ uri: item.before }}
//                               style={{ width: '100%', height: '100%' }}
//                               resizeMode="cover"
//                             />
//                           </View>
//                         </TouchableOpacity>

//                         {/* After Image */}
//                         <TouchableOpacity
//                           onPress={() => handleImagePress(item.after)}
//                           activeOpacity={0.9}
//                           className="flex-1">
//                           <Text
//                             className="mb-2 text-center font-outfit text-[12px]"
//                             style={{ color: '#2E211799' }}>
//                             After
//                           </Text>
//                           <View
//                             style={{
//                               height: 180,
//                               backgroundColor: '#F5EDE3',
//                               borderRadius: 12,
//                               overflow: 'hidden',
//                             }}>
//                             <Image
//                               source={{ uri: item.after }}
//                               style={{ width: '100%', height: '100%' }}
//                               resizeMode="cover"
//                             />
//                           </View>
//                         </TouchableOpacity>
//                       </View>

//                       {/* Result Message */}
//                       <View className="mt-4">
//                         <Text
//                           className="text-center font-outfit text-[12px] leading-5"
//                           style={{ color: '#2E2117B2' }}>
//                           {item.message}
//                         </Text>
//                       </View>
//                     </BorderlessShadowCard>

//                     {/* Add margin between cards except for the last one */}
//                     {!isLast && <View className="h-4" />}
//                   </View>
//                 );
//               })}
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Image Viewer Modal */}
//       <ImageView
//         images={selectedImages.map((uri) => ({ uri }))}
//         imageIndex={imageIndex}
//         visible={imageViewerVisible}
//         onRequestClose={() => setImageViewerVisible(false)}
//         animationType="slide"
//         presentationStyle="overFullScreen"
//         swipeToCloseEnabled={true}
//         doubleTapToZoomEnabled={true}
//       />
//     </SafeAreaView>
//   );
// };

// export default ProgressScreen;

// const styles = StyleSheet.create({});

/* eslint-disable import/no-unresolved */
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import ImageView from 'react-native-image-viewing';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import IconBadge from '@/components/icons/modified/IconBadge';
import { CurvedArrowTopRightIcon } from '@/components/icons';

const { width } = Dimensions.get('window');

type TabType = 'analytics' | 'beforeAfter';

interface ScoreData {
  week: string;
  score: number;
  date: string;
}

interface BeforeAfterItem {
  id: string;
  before: string;
  after: string;
  date: string;
  message: string;
}

const ProgressScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  // Sample data - replace with API data later
  const weeklyScores: ScoreData[] = [
    { week: 'W1', score: 45, date: 'Jan 1' },
    { week: 'W2', score: 52, date: 'Jan 8' },
    { week: 'W3', score: 48, date: 'Jan 15' },
    { week: 'W4', score: 58, date: 'Jan 22' },
    { week: 'W5', score: 65, date: 'Jan 29' },
    { week: 'W6', score: 72, date: 'Feb 5' },
    { week: 'W7', score: 78, date: 'Feb 12' },
    { week: 'W8', score: 82, date: 'Feb 19' },
  ];

  // Sample before/after data with actual image URLs and messages
  const beforeAfterData: BeforeAfterItem[] = [
    {
      id: '1',
      before: 'https://randomuser.me/api/portraits/women/68.jpg',
      after: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: 'Week 1 → Week 8',
      message: 'Noticeable reduction in redness and improved hydration.',
    },
    {
      id: '2',
      before: 'https://randomuser.me/api/portraits/women/32.jpg',
      after: 'https://randomuser.me/api/portraits/women/55.jpg',
      date: 'Week 2 → Week 6',
      message: 'Significant improvement in skin texture and glow.',
    },
    {
      id: '3',
      before: 'https://randomuser.me/api/portraits/women/91.jpg',
      after: 'https://randomuser.me/api/portraits/women/79.jpg',
      date: 'Week 3 → Week 7',
      message: 'Reduced pore size and better skin barrier function.',
    },
  ];

  // Prepare chart data with abbreviated weeks
  const chartData = weeklyScores.map((item) => ({
    value: item.score,
    label: item.week,
    dataPointText: item.score.toString(),
  }));

  const getAverageScore = () => {
    const sum = weeklyScores.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / weeklyScores.length);
  };

  const getHighestScore = () => {
    return Math.max(...weeklyScores.map((item) => item.score));
  };

  const getImprovement = () => {
    const first = weeklyScores[0].score;
    const last = weeklyScores[weeklyScores.length - 1].score;
    const improvement = last - first;
    return improvement > 0 ? `+${improvement}` : `${improvement}`;
  };

  const handleImagePress = (imageUrl: string) => {
    setSelectedImages([imageUrl]);
    setImageIndex(0);
    setImageViewerVisible(true);
  };

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader
        title="Your Progress"
        subtitle="Track your skin's journey over time."
        height={70}
        backButton={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 20,
          flexGrow: 1,
        }}
        className="flex-1">
        <View className="px-container">
          {/* Tabs Container */}
          <BorderlessShadowCard
            b_tl={24}
            b_tr={24}
            b_bl={0}
            b_br={0}
            style={{
              paddingVertical: 20,
              paddingHorizontal: 24,
              marginBottom: 16,
            }}>
            {/* Tabs inside the same container */}
            <View className="flex-row gap-4">
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setActiveTab('analytics')}
                style={{ flex: 1 }}>
                <BorderlessShadowCard
                  b_tl={6}
                  b_tr={6}
                  b_bl={6}
                  b_br={6}
                  style={{
                    paddingVertical: 8,
                    alignItems: 'center',
                    backgroundColor: activeTab === 'analytics' ? '#F0E6D8' : '#E8DDD0',
                  }}>
                  <Text
                    className="font-outfitMedium text-[14px]"
                    style={{ color: activeTab === 'analytics' ? '#7A8B6A' : '#2E211780' }}>
                    Analytics
                  </Text>
                </BorderlessShadowCard>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setActiveTab('beforeAfter')}
                style={{ flex: 1 }}>
                <BorderlessShadowCard
                  b_tl={6}
                  b_tr={6}
                  b_bl={6}
                  b_br={6}
                  style={{
                    paddingVertical: 8,
                    alignItems: 'center',
                    backgroundColor: activeTab === 'beforeAfter' ? '#F0E6D8' : '#E8DDD0',
                  }}>
                  <Text
                    className="font-outfitMedium text-[14px]"
                    style={{ color: activeTab === 'beforeAfter' ? '#7A8B6A' : '#2E211780' }}>
                    Before & After
                  </Text>
                </BorderlessShadowCard>
              </TouchableOpacity>
            </View>
          </BorderlessShadowCard>

          {/* Stats Row - Separate Card with 0 border radius and margin top 16 */}
          {/* <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={0}
            b_br={0}
            style={{
              marginTop: 16,
              paddingVertical: 20,
              paddingHorizontal: 24,
            }}>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
                  Average Score
                </Text>
                <Text className="font-outfitBold mt-1 text-[24px]" style={{ color: '#2E2117' }}>
                  {getAverageScore()}
                </Text>
              </View>
              <View className="items-center">
                <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
                  Highest Score
                </Text>
                <Text className="font-outfitBold mt-1 text-[24px]" style={{ color: '#2E2117' }}>
                  {getHighestScore()}
                </Text>
              </View>
              <View className="items-center">
                <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
                  Improvement
                </Text>
                <Text
                  className="font-outfitBold mt-1 text-[24px]"
                  style={{ color: getImprovement().startsWith('+') ? '#10B981' : '#EF4444' }}>
                  {getImprovement()}
                </Text>
              </View>
            </View>
          </BorderlessShadowCard> */}

          {/* Analytics Tab Content */}
          {activeTab === 'analytics' && (
            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              style={{
                paddingVertical: 24,
                paddingHorizontal: 24,
              }}>
              {/* Header with Overall Skin Score */}
              <View className="mb-6 flex-row items-center justify-between">
                {/* Left side: Text Content */}
                <View className="flex-1 pr-4">
                  <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E2117' }}>
                    Overall Skin Score
                  </Text>
                  <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
                    +13% this month
                  </Text>
                </View>

                {/* Right side: Badge */}
                <IconBadge
                  style={{ backgroundColor: '#7A8B6A1A' }}
                  size={40}
                  icon={<CurvedArrowTopRightIcon size={20} color="#7A8B6A" />}
                />
              </View>

              {/* Chart */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  <LineChart
                    data={chartData}
                    height={250}
                    width={Math.max(width - 60, chartData.length * 55)}
                    spacing={45}
                    initialSpacing={10}
                    color1="#7A8B6A"
                    textColor1="#2E2117"
                    textFontSize={10}
                    textShiftY={-8}
                    dataPointsColor1="#7A8B6A"
                    dataPointsHeight={6}
                    dataPointsWidth={6}
                    showVerticalLines={false}
                    showXAxisIndices={true}
                    xAxisIndicesColor="#2E211733"
                    xAxisColor="#2E211733"
                    yAxisColor="#2E211733"
                    yAxisTextStyle={{
                      color: '#9C7C5C',
                      fontSize: 12,
                      fontFamily: 'Outfit-Regular',
                    }}
                    xAxisLabelTextStyle={{
                      color: '#9C7C5C',
                      fontSize: 12,
                      fontFamily: 'Outfit-Regular',
                    }}
                    yAxisSide="left"
                    yAxisIndices={[0, 20, 40, 60, 80, 100]}
                    yAxisIndicesHeight={6}
                    noOfSections={5}
                    maxValue={100}
                    minValue={0}
                    stepValue={20}
                    areaChart
                    startFillColor="#7A8B6A33"
                    endFillColor="#7A8B6A00"
                    startOpacity={0.4}
                    endOpacity={0}
                    isAnimated
                    animationDuration={1000}
                    pointerConfig={{
                      pointerStripHeight: 250,
                      pointerStripColor: '#7A8B6A',
                      pointerColor: '#7A8B6A',
                      radius: 6,
                      pointerLabelWidth: 40,
                      pointerLabelHeight: 25,
                      activatePointersOnLongPress: true,
                      autoAdjustPointerLabelPosition: true,
                      pointerLabelComponent: (items: any) => (
                        <View
                          style={{
                            backgroundColor: '#7A8B6A',
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                          }}>
                          <Text
                            style={{ color: 'white', fontSize: 12, fontFamily: 'outfit-medium' }}>
                            {items[0].value}
                          </Text>
                        </View>
                      ),
                    }}
                  />
                </View>
              </ScrollView>

              {/* Legend */}
              <View className="mt-4 flex-row justify-center gap-6">
                <View className="flex-row items-center gap-2">
                  <View className="h-2 w-4 rounded-full bg-[#7A8B6A]" />
                  <Text className="font-outfit text-[10px]" style={{ color: '#2E211799' }}>
                    Skin Health Score
                  </Text>
                </View>
              </View>
            </BorderlessShadowCard>
          )}

          {/* Before & After Tab Content */}
          {activeTab === 'beforeAfter' && (
            <View className="mt-0">
              {beforeAfterData.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === beforeAfterData.length - 1;

                return (
                  <View key={item.id}>
                    <BorderlessShadowCard
                      b_tl={isFirst ? 0 : 0}
                      b_tr={isFirst ? 0 : 0}
                      b_bl={isLast ? 24 : 0}
                      b_br={isLast ? 24 : 0}
                      style={{
                        paddingVertical: 16,
                        paddingHorizontal: 16,
                      }}>
                      <Text
                        className="mb-3 text-center font-outfitMedium text-[14px]"
                        style={{ color: '#2E2117' }}>
                        {item.date}
                      </Text>

                      <View className="flex-row justify-between gap-4">
                        {/* Before Image */}
                        <TouchableOpacity
                          onPress={() => handleImagePress(item.before)}
                          activeOpacity={0.9}
                          className="flex-1">
                          <Text
                            className="mb-2 text-center font-outfit text-[12px]"
                            style={{ color: '#2E211799' }}>
                            Before
                          </Text>
                          <View
                            style={{
                              height: 180,
                              backgroundColor: '#F5EDE3',
                              borderRadius: 12,
                              overflow: 'hidden',
                            }}>
                            <Image
                              source={{ uri: item.before }}
                              style={{ width: '100%', height: '100%' }}
                              resizeMode="cover"
                            />
                          </View>
                        </TouchableOpacity>

                        {/* After Image */}
                        <TouchableOpacity
                          onPress={() => handleImagePress(item.after)}
                          activeOpacity={0.9}
                          className="flex-1">
                          <Text
                            className="mb-2 text-center font-outfit text-[12px]"
                            style={{ color: '#2E211799' }}>
                            After
                          </Text>
                          <View
                            style={{
                              height: 180,
                              backgroundColor: '#F5EDE3',
                              borderRadius: 12,
                              overflow: 'hidden',
                            }}>
                            <Image
                              source={{ uri: item.after }}
                              style={{ width: '100%', height: '100%' }}
                              resizeMode="cover"
                            />
                          </View>
                        </TouchableOpacity>
                      </View>

                      {/* Result Message */}
                      <View className="mt-4">
                        <Text
                          className="text-center font-outfit text-[12px] leading-5"
                          style={{ color: '#2E2117B2' }}>
                          {item.message}
                        </Text>
                      </View>
                    </BorderlessShadowCard>

                    {/* Add margin between cards except for the last one */}
                    {!isLast && <View className="h-4" />}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Image Viewer Modal */}
      <ImageView
        images={selectedImages.map((uri) => ({ uri }))}
        imageIndex={imageIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        animationType="slide"
        presentationStyle="overFullScreen"
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </SafeAreaView>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({});
