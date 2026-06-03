// app/(flow)/learn-article/[id].tsx
import React from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { ArticleVideoPlayer } from '@/components/articles/ArticleVideoPlayer';
import { HTMLRenderer } from '@/components/articles/HTMLRenderer';
import { useGetArticleByIdQuery } from '@/store/api/articleApi';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const articleId = Array.isArray(id) ? id[0] : id;

  const {
    data: article,
    isLoading,
    isError,
    refetch,
  } = useGetArticleByIdQuery(articleId!, {
    skip: !articleId,
  });

  const hasVideo = !!article?.videoUrl;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Article" height={50} backButton={true} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#759A52" />
          <Text className="mt-3 font-outfit text-[14px]" style={{ color: '#2E211799' }}>
            Loading article...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error / not found ─────────────────────────────────────────────────────
  if (isError || !article) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Article" height={50} backButton={true} />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="document-text-outline" size={64} color="#2E211733" />
          <Text className="mt-4 text-center font-outfit text-[16px]" style={{ color: '#2E2117CC' }}>
            Article not found
          </Text>
          <Text className="mt-2 text-center font-outfit text-[14px]" style={{ color: '#2E211799' }}>
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Article" height={50} backButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 10,
          flexGrow: 1,
        }}
        className="flex-1">
        <View className="px-container">
          {/* Hero — video if present, otherwise cover image */}
          {hasVideo ? (
            <ArticleVideoPlayer videoUrl={article.videoUrl!} />
          ) : (
            <Image
              source={{ uri: article.imageUrl }}
              style={{
                width: '100%',
                height: 220,
                borderRadius: 24,
                marginBottom: 16,
              }}
              resizeMode="cover"
            />
          )}

          {/* Category pill */}
          <View
            className="mb-3 max-w-[100px] rounded-full px-3 py-1"
            style={{ backgroundColor: '#F0E6D8' }}>
            <Text className="font-outfitMedium text-[11px]" style={{ color: '#977857' }}>
              {article.category}
            </Text>
          </View>

          {/* Title */}
          <Text className="font-outfitBold text-[24px]" style={{ color: '#361A0D' }}>
            {article.title}
          </Text>

          {/* Meta row */}
          <View className="mt-2 flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={14} color="#2E2117CC" />
              <Text className="font-outfit text-[12px]" style={{ color: '#2E2117CC' }}>
                {article.readTime}
              </Text>
            </View>
            {article.views > 0 && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="eye-outline" size={14} color="#2E2117CC" />
                <Text className="font-outfit text-[12px]" style={{ color: '#2E2117CC' }}>
                  {article.views} {article.views === 1 ? 'view' : 'views'}
                </Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View className="my-4 h-[1px] bg-[#2E2117]/10" />

          {/* Content — HTML from admin editor, or plain description as fallback */}
          {article.content ? (
            <HTMLRenderer content={article.content} />
          ) : (
            <Text className="font-outfit text-[15px] leading-6" style={{ color: '#2E2117CC' }}>
              {article.description}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
