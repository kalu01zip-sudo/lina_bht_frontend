// components/articles/ArticleVideoPlayer.tsx
import React, { useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');
const VIDEO_ASPECT_RATIO = 16 / 9;
const VIDEO_HEIGHT = width / VIDEO_ASPECT_RATIO;

interface ArticleVideoPlayerProps {
  videoUrl: string;
}

export const ArticleVideoPlayer: React.FC<ArticleVideoPlayerProps> = ({ videoUrl }) => {
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return (
      <View
        style={{
          width: '100%',
          height: 200,
          borderRadius: 0,
          backgroundColor: '#F0E6D8',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
        <Ionicons name="image-outline" size={48} color="#2E211766" />
      </View>
    );
  }

  return (
    <View
      style={{
        width: '100%',
        height: VIDEO_HEIGHT,
        borderRadius: 0,
        overflow: 'hidden',
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
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
          <ActivityIndicator size="large" color="#7A8B6A" />
        </View>
      )}

      <YoutubePlayer
        height={VIDEO_HEIGHT}
        width="100%"
        play={playing}
        videoId={videoId}
        onChangeState={(state: string) => {
          if (state === 'ended') {
            setPlaying(false);
          }
        }}
        onReady={() => setIsLoading(false)}
        webViewProps={{
          allowsInlineMediaPlayback: true,
        }}
      />
    </View>
  );
};
