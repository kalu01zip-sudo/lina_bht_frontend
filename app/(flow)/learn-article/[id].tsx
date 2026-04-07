// // app/(flow)/learn-article/[id].tsx
// import React from 'react';
// import { ScrollView, View, Text, Image } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import { SAMPLE_ARTICLES } from '@/constants/sampleArticles';
// import { ArticleVideoPlayer } from '@/components/articles/ArticleVideoPlayer';

// export default function ArticleDetailScreen() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const article = SAMPLE_ARTICLES.find((a) => a.id === id);

//   if (!article) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Article" height={50} backButton={true} />
//         <View className="flex-1 items-center justify-center">
//           <Text>Article not found</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Check if article has a video URL
//   const hasVideo = article.videoUrl && article.videoUrl.length > 0;

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Article" height={50} backButton={true} />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 10,
//           flexGrow: 1,
//         }}
//         className="flex-1">
//         <View className="px-container">
//           {/* Show Video Player if video URL exists, otherwise show image */}
//           {hasVideo ? (
//             <ArticleVideoPlayer videoUrl={article.videoUrl!} />
//           ) : (
//             <Image
//               source={{ uri: article.imageUrl }}
//               style={{
//                 width: '100%',
//                 height: 200,
//                 borderRadius: 24,
//                 marginBottom: 16,
//               }}
//               resizeMode="cover"
//             />
//           )}

//           {/* Title */}
//           <Text className="font-outfitBold text-[24px]" style={{ color: '#361A0D' }}>
//             {article.title}
//           </Text>

//           {/* Read Time */}
//           <View className="mt-2 flex-row items-center gap-1">
//             <Ionicons name="time-outline" size={14} color="#2E2117CC" />
//             <Text className="font-outfit text-[12px]" style={{ color: '#2E2117CC' }}>
//               {article.readTime}
//             </Text>
//           </View>

//           {/* Content */}
//           <View className="mt-6">
//             <Text className="font-outfit text-[14px] leading-6" style={{ color: '#2E2117CC' }}>
//               {article.description}
//             </Text>
//             {/* Add more detailed content here */}
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// app/(flow)/learn-article/[id].tsx
import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { SAMPLE_ARTICLES } from '@/constants/sampleArticles';
import { ArticleVideoPlayer } from '@/components/articles/ArticleVideoPlayer';
import { HTMLRenderer } from '@/components/articles/HTMLRenderer';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Make sure id is a string
  const articleId = Array.isArray(id) ? id[0] : id;
  const article = SAMPLE_ARTICLES.find((a) => a.id === articleId);

  if (!article) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Article" height={50} backButton={true} />
        <View className="flex-1 items-center justify-center">
          <Text>Article not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasVideo = article.videoUrl && article.videoUrl.length > 0;

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
          {/* Show Video Player if video URL exists, otherwise show image */}
          {hasVideo ? (
            <ArticleVideoPlayer videoUrl={article.videoUrl!} />
          ) : (
            <Image
              source={{ uri: article.imageUrl }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 24,
                marginBottom: 16,
              }}
              resizeMode="cover"
            />
          )}

          {/* Title */}
          <Text className="font-outfitBold text-[24px]" style={{ color: '#361A0D' }}>
            {article.title}
          </Text>

          {/* Read Time */}
          <View className="mt-2 flex-row items-center gap-1">
            <Ionicons name="time-outline" size={14} color="#2E2117CC" />
            <Text className="font-outfit text-[12px]" style={{ color: '#2E2117CC' }}>
              {article.readTime}
            </Text>
          </View>

          {/* Author */}
          {/* {article.author && (
            <View className="mt-2 flex-row items-center gap-1">
              <Ionicons name="person-outline" size={14} color="#2E2117CC" />
              <Text className="font-outfit text-[12px]" style={{ color: '#2E2117CC' }}>
                {article.author}
              </Text>
            </View>
          )} */}

          {/* Published Date */}
          {/* {article.publishedDate && (
            // <View className="mt-2 flex-row items-center gap-1">
            //   <Ionicons name="calendar-outline" size={14} color="#2E2117CC" />
            //   <Text className="font-outfit text-[12px]" style={{ color: '#2E2117CC' }}>
            //     {new Date(article.publishedDate).toLocaleDateString()}
            //   </Text>
            // </View>
          )} */}

          {/* Divider */}
          <View className="my-4 h-[1px] bg-[#2E2117]/10" />

          {/* Content */}
          {article.content ? (
            <HTMLRenderer content={article.content} />
          ) : (
            <Text className="font-outfit text-[14px] leading-6" style={{ color: '#2E2117CC' }}>
              {article.description}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
