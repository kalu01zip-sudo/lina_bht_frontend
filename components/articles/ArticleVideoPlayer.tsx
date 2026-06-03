// components/articles/ArticleVideoPlayer.tsx
import React, { useState, useRef } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width / (16 / 9);

interface ArticleVideoPlayerProps {
  videoUrl: string;
}

const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtube\.com\/shorts\/)([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

export const ArticleVideoPlayer: React.FC<ArticleVideoPlayerProps> = ({ videoUrl }) => {
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<Video>(null);

  // ── YouTube ───────────────────────────────────────────────────────────────
  if (isYouTubeUrl(videoUrl)) {
    const videoId = getYouTubeId(videoUrl);
    if (!videoId) return null;

    return (
      <View
        style={{
          width: '100%',
          height: VIDEO_HEIGHT,
          overflow: 'hidden',
          borderRadius: 24,
          marginBottom: 16,
        }}>
        {isLoading && (
          <View
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0001',
            }}>
            <ActivityIndicator size="large" color="#7A8B6A" />
          </View>
        )}
        <YoutubePlayer
          height={VIDEO_HEIGHT}
          play={playing}
          videoId={videoId}
          onChangeState={(state: string) => state === 'ended' && setPlaying(false)}
          onReady={() => setIsLoading(false)}
          webViewProps={{ allowsInlineMediaPlayback: true }}
        />
      </View>
    );
  }

  // ── Direct MP4 / any other URL ────────────────────────────────────────────
  return (
    <View
      style={{
        width: '100%',
        height: VIDEO_HEIGHT,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#000',
        marginBottom: 16,
      }}>
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#7A8B6A" />
        </View>
      )}

      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: '100%', height: '100%' }}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay={false}
        onReadyForDisplay={() => setIsLoading(false)}
        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
          if (status.isLoaded && status.isBuffering && !status.isPlaying) {
            setIsLoading(true);
          } else if (status.isLoaded && !status.isBuffering) {
            setIsLoading(false);
          }
        }}
        onError={() => setIsLoading(false)}
      />
    </View>
  );
};

// // components/articles/ArticleVideoPlayer.tsx
// import React, { useState } from 'react';
// import { View, ActivityIndicator, Dimensions } from 'react-native';
// import { VideoView, useVideoPlayer } from 'expo-video';
// import YoutubePlayer from 'react-native-youtube-iframe';

// const { width } = Dimensions.get('window');
// const VIDEO_HEIGHT = width / (16 / 9);

// interface ArticleVideoPlayerProps {
//   videoUrl: string;
// }

// const getYouTubeId = (url: string): string | null => {
//   const patterns = [
//     /(?:youtube\.com\/watch\?v=)([^&]+)/,
//     /(?:youtu\.be\/)([^?]+)/,
//     /(?:youtube\.com\/embed\/)([^?]+)/,
//     /(?:youtube\.com\/shorts\/)([^?]+)/,
//   ];
//   for (const pattern of patterns) {
//     const match = url.match(pattern);
//     if (match) return match[1];
//   }
//   return null;
// };

// const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

// // Separate component so useVideoPlayer hook is always called unconditionally
// const DirectVideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
//   const [isLoading, setIsLoading] = useState(true);

//   const player = useVideoPlayer(videoUrl, (p) => {
//     p.pause();
//   });

//   return (
//     <View
//       style={{
//         width: '100%',
//         height: VIDEO_HEIGHT,
//         borderRadius: 24,
//         overflow: 'hidden',
//         backgroundColor: '#000',
//         marginBottom: 16,
//       }}>
//       {isLoading && (
//         <View
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             zIndex: 10,
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//           <ActivityIndicator size="large" color="#7A8B6A" />
//         </View>
//       )}
//       <VideoView
//         player={player}
//         style={{ width: '100%', height: '100%' }}
//         contentFit="contain"
//         nativeControls={true}
//         onFirstFrameRender={() => setIsLoading(false)}
//       />
//     </View>
//   );
// };

// export const ArticleVideoPlayer: React.FC<ArticleVideoPlayerProps> = ({ videoUrl }) => {
//   const [ytLoading, setYtLoading] = useState(true);
//   const [ytPlaying, setYtPlaying] = useState(false);

//   if (isYouTubeUrl(videoUrl)) {
//     const videoId = getYouTubeId(videoUrl);
//     if (!videoId) return null;

//     return (
//       <View
//         style={{
//           width: '100%',
//           height: VIDEO_HEIGHT,
//           overflow: 'hidden',
//           borderRadius: 24,
//           marginBottom: 16,
//         }}>
//         {ytLoading && (
//           <View
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 10,
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//             <ActivityIndicator size="large" color="#7A8B6A" />
//           </View>
//         )}
//         <YoutubePlayer
//           height={VIDEO_HEIGHT}
//           play={ytPlaying}
//           videoId={videoId}
//           onChangeState={(state: string) => state === 'ended' && setYtPlaying(false)}
//           onReady={() => setYtLoading(false)}
//           webViewProps={{ allowsInlineMediaPlayback: true }}
//         />
//       </View>
//     );
//   }

//   return <DirectVideoPlayer videoUrl={videoUrl} />;
// };
