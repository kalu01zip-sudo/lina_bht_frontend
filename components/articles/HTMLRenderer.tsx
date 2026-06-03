// components/articles/HTMLRenderer.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Linking,
  Text,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import ImageView from 'react-native-image-viewing';

interface HTMLRendererProps {
  content: string;
}

interface ImageItem {
  uri: string;
  alt?: string;
}

export const HTMLRenderer: React.FC<HTMLRendererProps> = ({ content }) => {
  const { width } = useWindowDimensions();
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<ImageItem[]>([]);
  const [videoVisible, setVideoVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  // Function to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Extract all images from HTML content
  const extractMediaFromHTML = useCallback((html: string) => {
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*(?:alt="([^"]*)")?/gi;
    const images: ImageItem[] = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      images.push({ uri: match[1], alt: match[2] });
    }
    setAllImages(images);
    return images;
  }, []);

  // Custom Image Renderer with Lightbox
  const CustomImageRenderer = ({ source, alt, index }: any) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const imageIndex = index || 0;

    // Check if source or source.uri exists
    if (!source || !source.uri) {
      return null;
    }

    if (imageError) {
      return (
        <View
          style={{
            backgroundColor: '#F5F5F5',
            height: 200,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 16,
          }}>
          <Ionicons name="image-outline" size={48} color="#CCC" />
          <Text style={{ fontSize: 12, color: '#999', marginTop: 8 }}>Image failed to load</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          setCurrentImageIndex(imageIndex);
          setGalleryVisible(true);
        }}
        style={{ marginVertical: 16 }}>
        <View
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: '#F5F5F5',
            position: 'relative',
          }}>
          {imageLoading && (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}>
              <ActivityIndicator size="large" color="#7A8B6A" />
            </View>
          )}
          <Image
            source={{ uri: source.uri }}
            style={{
              width: '100%',
              height: 200,
              resizeMode: 'cover',
            }}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageError(true)}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'flex-end',
              paddingHorizontal: 12,
              paddingBottom: 8,
            }}>
            <Ionicons
              name="expand-outline"
              size={20}
              color="#FFF"
              style={{ alignSelf: 'flex-end' }}
            />
          </View>
        </View>
        {alt && (
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 8,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: '#666',
                textAlign: 'center',
                fontStyle: 'italic',
              }}>
              {alt}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Custom Video Renderer for YouTube/Vimeo links
  const VideoRenderer = ({ source, poster, url }: any) => {
    const videoId = getYouTubeId(source?.uri || url);
    const [isPlaying, setIsPlaying] = useState(false);
    const video = React.useRef(null);

    if (!videoId) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (source?.uri || url) {
              setCurrentVideoUrl(source?.uri || url);
              setVideoVisible(true);
            }
          }}>
          <View
            style={{
              backgroundColor: '#000',
              height: 220,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 16,
              position: 'relative',
              overflow: 'hidden',
            }}>
            {poster ? (
              <Image
                source={{ uri: poster }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0.7,
                }}
              />
            ) : (
              <View
                style={{
                  backgroundColor: '#333',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="play-circle" size={64} color="#FFF" />
              </View>
            )}
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: 50,
                padding: 16,
              }}>
              <Ionicons name="play" size={48} color="#FFF" />
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View
        style={{
          marginVertical: 16,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#000',
          aspectRatio: 16 / 9,
        }}>
        <Video
          ref={video}
          source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          style={{ width: '100%', height: '100%' }}
          isLooping={false}
          shouldPlay={isPlaying}
        />
        {!isPlaying && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
            onPress={() => setIsPlaying(true)}>
            <Ionicons name="play-circle" size={64} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Custom Link Renderer with preview
  const CustomLinkRenderer = ({ attributes, children }: any) => {
    const url = attributes?.href;
    const isVideo =
      url && (url.includes('youtube') || url.includes('youtu.be') || url.includes('vimeo'));

    if (isVideo) {
      return <VideoRenderer url={url} />;
    }

    return (
      <TouchableOpacity onPress={() => url && Linking.openURL(url)} activeOpacity={0.7}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
          <Ionicons name="link-outline" size={14} color="#7A8B6A" />
          <Text
            style={{
              color: '#7A8B6A',
              textDecorationLine: 'underline',
              fontSize: 14,
            }}>
            {children}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Custom renderers for different HTML elements
  const renderers = {
    img: (props: any) => {
      // Safely access source with null check
      if (!props || !props.source || !props.source.uri) {
        return null;
      }
      const index = allImages.findIndex((img) => img.uri === props.source.uri);
      return <CustomImageRenderer {...props} index={index} />;
    },
    a: (props: any) => {
      if (!props || !props.attributes) {
        return <Text>{props?.children}</Text>;
      }
      return <CustomLinkRenderer {...props} />;
    },
    iframe: ({ attributes }: any) => {
      if (!attributes || !attributes.src) {
        return null;
      }
      const src = attributes.src;
      if (src.includes('youtube') || src.includes('vimeo')) {
        return <VideoRenderer url={src} />;
      }
      return null;
    },
    video: ({ attributes }: any) => {
      if (!attributes) {
        return null;
      }
      const src = attributes.src || attributes.poster;
      if (!src) {
        return null;
      }
      return <VideoRenderer source={{ uri: src }} poster={attributes.poster} />;
    },
    blockquote: ({ children }: any) => (
      <View
        style={{
          backgroundColor: '#F8F4EF',
          padding: 20,
          borderRadius: 24,
          marginVertical: 20,
          borderLeftWidth: 4,
          borderLeftColor: '#7A8B6A',
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          color="#7A8B6A"
          style={{ marginRight: 12, marginTop: 2 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, lineHeight: 24, color: '#2E2117CC', fontStyle: 'italic' }}>
            {children}
          </Text>
        </View>
      </View>
    ),
    div: ({ children, attributes }: any) => {
      // Safely access className with null check
      const className = attributes?.class || attributes?.className || '';

      if (className.includes('tip') || className.includes('pro-tip')) {
        return (
          <View
            style={{
              backgroundColor: '#E8F5E9',
              padding: 20,
              borderRadius: 24,
              marginVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#C8E6C9',
            }}>
            <View
              style={{
                backgroundColor: '#4CAF50',
                borderRadius: 40,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
              <Ionicons name="bulb-outline" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text>{children}</Text>
            </View>
          </View>
        );
      }

      if (className.includes('warning') || className.includes('danger')) {
        return (
          <View
            style={{
              backgroundColor: '#FFF3E0',
              padding: 20,
              borderRadius: 24,
              marginVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#FFE0B2',
            }}>
            <View
              style={{
                backgroundColor: '#FF9800',
                borderRadius: 40,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
              <Ionicons name="warning-outline" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text>{children}</Text>
            </View>
          </View>
        );
      }

      if (className.includes('info')) {
        return (
          <View
            style={{
              backgroundColor: '#E3F2FD',
              padding: 20,
              borderRadius: 24,
              marginVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#BBDEFB',
            }}>
            <View
              style={{
                backgroundColor: '#2196F3',
                borderRadius: 40,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
              <Ionicons name="information-outline" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text>{children}</Text>
            </View>
          </View>
        );
      }

      // Default div renderer
      return <View>{children}</View>;
    },
  };

  // Enhanced tags styles
  const tagsStyles = {
    body: {
      fontSize: 16,
      color: '#2E2117CC',
      lineHeight: 26,
    },
    h1: {
      fontSize: 34,
      fontFamily: 'Outfit-Bold',
      color: '#361A0D',
      marginTop: 24,
      marginBottom: 16,
    },
    h2: {
      fontSize: 28,
      fontFamily: 'Outfit-Bold',
      color: '#361A0D',
      marginTop: 20,
      marginBottom: 12,
    },
    h3: {
      fontSize: 24,
      fontFamily: 'Outfit-SemiBold',
      color: '#361A0D',
      marginTop: 16,
      marginBottom: 10,
    },
    p: {
      fontSize: 16,
      lineHeight: 26,
      marginBottom: 16,
      color: '#2E2117CC',
    },
    ul: {
      marginVertical: 12,
      paddingLeft: 24,
    },
    ol: {
      marginVertical: 12,
      paddingLeft: 24,
    },
    li: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 8,
    },
    strong: {
      fontFamily: 'Outfit-Bold',
      fontWeight: '600' as const,
      color: '#361A0D',
    },
  };

  // Extract media on mount
  React.useEffect(() => {
    extractMediaFromHTML(content);
  }, [content, extractMediaFromHTML]);

  return (
    <View style={{ paddingVertical: 8 }}>
      <RenderHTML
        contentWidth={width - 32}
        source={{ html: content }}
        tagsStyles={tagsStyles}
        renderers={renderers}
      />

      {/* Image Gallery Modal */}
      <ImageView
        images={allImages}
        imageIndex={currentImageIndex}
        visible={galleryVisible}
        onRequestClose={() => setGalleryVisible(false)}
        presentationStyle="overFullScreen"
      />

      {/* Video Modal */}
      <Modal
        visible={videoVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVideoVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              zIndex: 1,
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 30,
              padding: 10,
            }}
            onPress={() => setVideoVisible(false)}>
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>

          <Video
            source={{ uri: currentVideoUrl }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            style={{ width: '100%', height: 300 }}
            shouldPlay={true}
          />
        </View>
      </Modal>
    </View>
  );
};
