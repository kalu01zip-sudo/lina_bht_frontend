// components/articles/ArticleCard.tsx
import React, { useRef } from 'react';
import { View, Text, Image, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const hasVideo = !!article.videoUrl;
  const hasImage = !!article.imageUrl;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  return (
    <Pressable
      onPress={() => onPress(article)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 16 }}>
        <BorderlessShadowCard
          b_tl={24}
          b_tr={24}
          b_bl={24}
          b_br={24}
          style={{ paddingVertical: 16, paddingHorizontal: 16 }}>
          <View className="flex-row gap-4">
            {/* Thumbnail — video or image */}
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 24,
                backgroundColor: '#F0E6D8',
                overflow: 'hidden',
              }}>
              {hasVideo ? (
                <>
                  <Video
                    source={{ uri: article.videoUrl! }}
                    style={{ width: 100, height: 100 }}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={false}
                    isMuted={true}
                    // Seek to first frame for thumbnail
                    positionMillis={500}
                  />
                  {/* Play badge */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      right: 6,
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      borderRadius: 12,
                      padding: 4,
                    }}>
                    <Ionicons name="play" size={12} color="#FFF" />
                  </View>
                </>
              ) : hasImage ? (
                <Image
                  source={{ uri: article.imageUrl }}
                  style={{ width: 100, height: 100 }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="document-text-outline" size={32} color="#C0A882" />
                </View>
              )}
            </View>

            {/* Content */}
            <View className="flex-1 justify-between">
              <View>
                <Text
                  className="font-outfitMedium text-[16px]"
                  style={{ color: '#2E2117' }}
                  numberOfLines={2}>
                  {article.title}
                </Text>
                <Text
                  className="mt-1 font-outfit text-[12px]"
                  style={{ color: '#2E211766' }}
                  numberOfLines={2}>
                  {article.description}
                </Text>
              </View>

              {/* Meta row — read time + views */}
              <View className="mt-2 flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="time-outline" size={12} color="#2E211766" />
                  <Text className="font-outfit text-[10px]" style={{ color: '#2E211766' }}>
                    {article.readTime}
                  </Text>
                </View>

                {article.views > 0 && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="eye-outline" size={12} color="#2E211766" />
                    <Text className="font-outfit text-[10px]" style={{ color: '#2E211766' }}>
                      {article.views} {article.views === 1 ? 'view' : 'views'}
                    </Text>
                  </View>
                )}

                {hasVideo && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="videocam-outline" size={12} color="#977857" />
                    <Text className="font-outfit text-[10px]" style={{ color: '#977857' }}>
                      Video
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </BorderlessShadowCard>
      </Animated.View>
    </Pressable>
  );
};

// import React, { useRef } from 'react';
// import { View, Text, Image, Pressable, Animated } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { VideoView, useVideoPlayer } from 'expo-video';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { Article } from '@/types/article';

// interface ArticleCardProps {
//   article: Article;
//   onPress: (article: Article) => void;
// }

// // Separate component so useVideoPlayer hook is only called when there's actually a video
// const VideoThumbnail = ({ uri }: { uri: string }) => {
//   const player = useVideoPlayer(uri, (p) => {
//     p.muted = true;
//     p.pause();
//   });

//   return (
//     <VideoView
//       player={player}
//       style={{ width: 100, height: 100 }}
//       contentFit="cover"
//       nativeControls={false}
//       allowsFullscreen={false}
//       allowsPictureInPicture={false}
//     />
//   );
// };

// export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress }) => {
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const hasVideo = !!article.videoUrl;
//   const hasImage = !!article.imageUrl;

//   const handlePressIn = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 0.98,
//       useNativeDriver: true,
//       friction: 5,
//       tension: 100,
//     }).start();
//   };

//   const handlePressOut = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       useNativeDriver: true,
//       friction: 5,
//       tension: 100,
//     }).start();
//   };

//   return (
//     <Pressable
//       onPress={() => onPress(article)}
//       onPressIn={handlePressIn}
//       onPressOut={handlePressOut}>
//       <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 16 }}>
//         <BorderlessShadowCard
//           b_tl={24}
//           b_tr={24}
//           b_bl={24}
//           b_br={24}
//           style={{ paddingVertical: 16, paddingHorizontal: 16 }}>
//           <View className="flex-row gap-4">
//             {/* Thumbnail — video or image */}
//             <View
//               style={{
//                 width: 100,
//                 height: 100,
//                 borderRadius: 24,
//                 backgroundColor: '#F0E6D8',
//                 overflow: 'hidden',
//               }}>
//               {hasVideo ? (
//                 <>
//                   <VideoThumbnail uri={article.videoUrl!} />
//                   {/* Play badge */}
//                   <View
//                     style={{
//                       position: 'absolute',
//                       bottom: 6,
//                       right: 6,
//                       backgroundColor: 'rgba(0,0,0,0.55)',
//                       borderRadius: 12,
//                       padding: 4,
//                     }}>
//                     <Ionicons name="play" size={12} color="#FFF" />
//                   </View>
//                 </>
//               ) : hasImage ? (
//                 <Image
//                   source={{ uri: article.imageUrl }}
//                   style={{ width: 100, height: 100 }}
//                   resizeMode="cover"
//                 />
//               ) : (
//                 <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//                   <Ionicons name="document-text-outline" size={32} color="#C0A882" />
//                 </View>
//               )}
//             </View>

//             {/* Content */}
//             <View className="flex-1 justify-between">
//               <View>
//                 <Text
//                   className="font-outfitMedium text-[16px]"
//                   style={{ color: '#2E2117' }}
//                   numberOfLines={2}>
//                   {article.title}
//                 </Text>
//                 <Text
//                   className="mt-1 font-outfit text-[12px]"
//                   style={{ color: '#2E211766' }}
//                   numberOfLines={2}>
//                   {article.description}
//                 </Text>
//               </View>

//               {/* Meta row — read time + views */}
//               <View className="mt-2 flex-row items-center gap-3">
//                 <View className="flex-row items-center gap-1">
//                   <Ionicons name="time-outline" size={12} color="#2E211766" />
//                   <Text className="font-outfit text-[10px]" style={{ color: '#2E211766' }}>
//                     {article.readTime}
//                   </Text>
//                 </View>

//                 {article.views > 0 && (
//                   <View className="flex-row items-center gap-1">
//                     <Ionicons name="eye-outline" size={12} color="#2E211766" />
//                     <Text className="font-outfit text-[10px]" style={{ color: '#2E211766' }}>
//                       {article.views} {article.views === 1 ? 'view' : 'views'}
//                     </Text>
//                   </View>
//                 )}

//                 {hasVideo && (
//                   <View className="flex-row items-center gap-1">
//                     <Ionicons name="videocam-outline" size={12} color="#977857" />
//                     <Text className="font-outfit text-[10px]" style={{ color: '#977857' }}>
//                       Video
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </View>
//           </View>
//         </BorderlessShadowCard>
//       </Animated.View>
//     </Pressable>
//   );
// };
