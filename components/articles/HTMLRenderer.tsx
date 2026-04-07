// components/articles/HTMLRenderer.tsx
import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

interface HTMLRendererProps {
  content: string;
}

export const HTMLRenderer: React.FC<HTMLRendererProps> = ({ content }) => {
  const { width } = useWindowDimensions();

  if (!content) {
    return null;
  }

  // Define custom styles for HTML tags
  const tagsStyles = {
    body: {
      fontSize: 14,
      color: '#2E2117CC',
    },
    h1: {
      fontSize: 28,
      fontFamily: 'Outfit-Bold',
      color: '#361A0D',
      marginTop: 16,
      marginBottom: 12,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Outfit-Bold',
      color: '#361A0D',
      marginTop: 14,
      marginBottom: 10,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Outfit-SemiBold',
      color: '#361A0D',
      marginTop: 12,
      marginBottom: 8,
    },
    p: {
      fontSize: 14,
      lineHeight: 24,
      marginBottom: 12,
    },
    ul: {
      marginTop: 8,
      marginBottom: 8,
      paddingLeft: 16,
    },
    ol: {
      marginTop: 8,
      marginBottom: 8,
      paddingLeft: 16,
    },
    li: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 6,
    },
    strong: {
      fontFamily: 'Outfit-Bold',
      fontWeight: '600' as const, // Fixed: use const assertion
    },
    blockquote: {
      backgroundColor: '#F0E6D8',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginVertical: 12,
      borderLeftWidth: 3,
      borderLeftColor: '#7A8B6A',
    },
  };

  return (
    <View style={{ paddingVertical: 8 }}>
      <RenderHTML contentWidth={width - 32} source={{ html: content }} tagsStyles={tagsStyles} />
    </View>
  );
};
