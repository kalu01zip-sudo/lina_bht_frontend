// components/articles/ArticleVideoPlayer.tsx
import React, { useRef, useState } from 'react';
import { View, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round(width / (16 / 9));

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

// ── Direct video via expo-av (avoids expo-video / media3 crash) ───────────────
const DirectVideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
    }
  };

  if (hasError) {
    return (
      <View
        style={{
          width: '100%',
          height: VIDEO_HEIGHT,
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: '#1a1a1a',
          marginBottom: 16,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
        <Ionicons name="alert-circle-outline" size={40} color="#C0A882" />
      </View>
    );
  }

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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </View>
  );
};

// ── YouTube player ────────────────────────────────────────────────────────────
const YouTubeVideoPlayer = ({ videoId }: { videoId: string }) => {
  const [ytLoading, setYtLoading] = useState(true);
  const [ytPlaying, setYtPlaying] = useState(false);

  return (
    <View
      style={{
        width: '100%',
        height: VIDEO_HEIGHT,
        overflow: 'hidden',
        borderRadius: 24,
        marginBottom: 16,
      }}>
      {ytLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#7A8B6A" />
        </View>
      )}
      <YoutubePlayer
        height={VIDEO_HEIGHT}
        play={ytPlaying}
        videoId={videoId}
        onChangeState={(state: string) => state === 'ended' && setYtPlaying(false)}
        onReady={() => setYtLoading(false)}
        webViewProps={{ allowsInlineMediaPlayback: true }}
      />
    </View>
  );
};

// ── Public component ──────────────────────────────────────────────────────────
export const ArticleVideoPlayer: React.FC<ArticleVideoPlayerProps> = ({ videoUrl }) => {
  if (isYouTubeUrl(videoUrl)) {
    const videoId = getYouTubeId(videoUrl);
    if (!videoId) return null;
    return <YouTubeVideoPlayer videoId={videoId} />;
  }

  return <DirectVideoPlayer videoUrl={videoUrl} />;
};
