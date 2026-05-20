// // app/(flow)/ai-assistant/index.tsx
// import {
//   ScrollView,
//   Text,
//   View,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Animated,
//   Modal,
// } from 'react-native';
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import * as Haptics from 'expo-haptics';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CustomHeader from '@/components/header/CustomHeader';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { SendButtonIcon } from '@/components/icons';
// import { useToast } from '@/hooks/useToast';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// import { useRouter } from 'expo-router';

// import {
//   useSendMessageSyncMutation,
//   useLazyGetChatHistoryQuery,
//   useClearChatHistoryMutation,
// } from '@/store/api/chatApi';
// import { useChatStream } from '@/hooks/useChatStream';
// import { MarkdownText } from '@/components/chat/MarkdownText';
// import ClearChatModal from '@/components/ui/ClearChatModal';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Message {
//   id: string;
//   text: string;
//   isUser: boolean;
//   timestamp: Date;
//   isStreaming?: boolean;
// }

// const WELCOME_MESSAGE: Message = {
//   id: 'welcome',
//   text: "Hello! I'm your **Gixy AI** assistant. 👋\n\nI can help you with:\n- Skincare advice tailored to your profile\n- Ingredient guidance\n- Routine building\n\nHow can I help you today?",
//   isUser: false,
//   timestamp: new Date(),
// };

// const PAGE_LIMIT = 20;

// // ─── Typing dots indicator ────────────────────────────────────────────────────

// function TypingIndicator() {
//   const dot1 = useRef(new Animated.Value(0.3)).current;
//   const dot2 = useRef(new Animated.Value(0.3)).current;
//   const dot3 = useRef(new Animated.Value(0.3)).current;

//   useEffect(() => {
//     const animate = (dot: Animated.Value, delay: number) =>
//       Animated.loop(
//         Animated.sequence([
//           Animated.delay(delay),
//           Animated.timing(dot, { toValue: 1, duration: 350, useNativeDriver: true }),
//           Animated.timing(dot, { toValue: 0.3, duration: 350, useNativeDriver: true }),
//         ])
//       ).start();
//     animate(dot1, 0);
//     animate(dot2, 150);
//     animate(dot3, 300);
//   }, []);

//   const dotStyle = {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#2E211799',
//     marginHorizontal: 2,
//   };

//   return (
//     <View style={{ marginBottom: 12, alignItems: 'flex-start' }}>
//       <BorderlessShadowCard
//         b_tl={2}
//         b_tr={16}
//         b_bl={16}
//         b_br={16}
//         style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF' }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <Animated.View style={[dotStyle, { opacity: dot1 }]} />
//           <Animated.View style={[dotStyle, { opacity: dot2 }]} />
//           <Animated.View style={[dotStyle, { opacity: dot3 }]} />
//         </View>
//       </BorderlessShadowCard>
//     </View>
//   );
// }

// // ─── Load more indicator (shown at top while fetching older messages) ─────────

// function LoadMoreIndicator() {
//   return (
//     <View style={{ paddingVertical: 12, alignItems: 'center' }}>
//       <ActivityIndicator size="small" color="#7A8B6A" />
//       <Text
//         style={{ fontFamily: 'Outfit-Regular', fontSize: 12, color: '#2E211799', marginTop: 4 }}>
//         Loading older messages...
//       </Text>
//     </View>
//   );
// }

// // ─── Message bubble ───────────────────────────────────────────────────────────

// function MessageBubble({ message }: { message: Message }) {
//   const isUser = message.isUser;
//   const formatTime = (date: Date) =>
//     date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   return (
//     <View style={{ marginBottom: 12, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
//       <BorderlessShadowCard
//         b_tl={isUser ? 16 : 2}
//         b_tr={isUser ? 2 : 16}
//         b_bl={16}
//         b_br={16}
//         style={{
//           paddingVertical: 12,
//           paddingHorizontal: 16,
//           backgroundColor: isUser ? '#7A8B6A' : '#FFFFFF',
//           maxWidth: '85%',
//         }}>
//         {isUser ? (
//           <Text
//             style={{
//               fontFamily: 'Outfit-Regular',
//               fontSize: 14,
//               lineHeight: 22,
//               color: '#FFFFFF',
//             }}>
//             {message.text}
//           </Text>
//         ) : (
//           <MarkdownText content={message.text} color="#2E2117" fontSize={14} />
//         )}
//         {!message.isStreaming && (
//           <Text
//             style={{
//               marginTop: 4,
//               fontFamily: 'Outfit-Regular',
//               fontSize: 10,
//               color: isUser ? '#FFFFFFB2' : '#2E211766',
//               textAlign: 'right',
//             }}>
//             {formatTime(message.timestamp)}
//           </Text>
//         )}
//       </BorderlessShadowCard>
//     </View>
//   );
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// /** Convert API history message → local Message */
// const toLocalMessage = (
//   m: { role: string; content: string; created_at: string },
//   index: number
// ): Message => ({
//   id: `history_${index}_${m.created_at}`,
//   text: m.content,
//   isUser: m.role === 'user',
//   timestamp: new Date(m.created_at),
//   isStreaming: false,
// });

// // ─── Main screen ──────────────────────────────────────────────────────────────

// const AiAssistantScreen = () => {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { showError } = useToast();

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState('');
//   const [isWaiting, setIsWaiting] = useState(false);
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [isLoadingHistory, setIsLoadingHistory] = useState(true);
//   const [showClearModal, setShowClearModal] = useState(false);

//   // ── Pagination state ──────────────────────────────────────────────────────
//   const [offset, setOffset] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   // Track scroll height before prepending so we can restore position
//   const scrollHeightBeforeLoad = useRef(0);

//   const scrollViewRef = useRef<ScrollView>(null);
//   const inputRef = useRef<TextInput>(null);
//   const streamingMessageIdRef = useRef<string | null>(null);

//   const { streamMessage, cancelStream } = useChatStream();
//   const [sendSync] = useSendMessageSyncMutation();
//   const [fetchHistory] = useLazyGetChatHistoryQuery();
//   const [clearHistory] = useClearChatHistoryMutation();

//   const { isRendering, renderError } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   // ── Initial history load ──────────────────────────────────────────────────

//   const loadInitialHistory = useCallback(async () => {
//     try {
//       const result = await fetchHistory({ limit: PAGE_LIMIT, offset: 0 }).unwrap();
//       const msgs = result.messages ?? [];

//       if (msgs.length === 0) {
//         setMessages([WELCOME_MESSAGE]);
//         setHasMore(false);
//       } else {
//         // API returns newest-first or oldest-first depending on backend.
//         // Your sample shows chronological order (oldest first) — we use as-is.
//         setMessages(msgs.map(toLocalMessage));
//         setHasMore(msgs.length === PAGE_LIMIT);
//         setOffset(PAGE_LIMIT);
//       }
//     } catch {
//       // Fall back to welcome message if history fails
//       setMessages([WELCOME_MESSAGE]);
//       setHasMore(false);
//     } finally {
//       setIsLoadingHistory(false);
//     }
//   }, [fetchHistory]);

//   useEffect(() => {
//     loadInitialHistory();
//   }, [loadInitialHistory]);

//   // ── Auto-scroll to bottom on new messages ─────────────────────────────────

//   useEffect(() => {
//     if (!isLoadingHistory) {
//       setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 80);
//     }
//   }, [messages, isWaiting]);

//   // ── Load older messages on scroll-to-top ──────────────────────────────────

//   const handleLoadMore = useCallback(async () => {
//     if (isLoadingMore || !hasMore || isLoadingHistory) return;

//     setIsLoadingMore(true);
//     try {
//       const result = await fetchHistory({ limit: PAGE_LIMIT, offset }).unwrap();
//       const older = result.messages ?? [];

//       if (older.length === 0) {
//         setHasMore(false);
//         return;
//       }

//       // Prepend older messages, keeping stable IDs
//       setMessages((prev) => [...older.map((m, i) => toLocalMessage(m, offset + i)), ...prev]);
//       setOffset((prev) => prev + older.length);
//       setHasMore(older.length === PAGE_LIMIT);
//     } catch {
//       // Silent — don't break the chat if pagination fails
//     } finally {
//       setIsLoadingMore(false);
//     }
//   }, [isLoadingMore, hasMore, isLoadingHistory, offset, fetchHistory]);

//   // Detect scroll-to-top to trigger pagination
//   const handleScroll = useCallback(
//     (event: any) => {
//       const y = event.nativeEvent.contentOffset.y;
//       // Trigger load when within 60px of the top
//       if (y < 60 && hasMore && !isLoadingMore) {
//         handleLoadMore();
//       }
//     },
//     [hasMore, isLoadingMore, handleLoadMore]
//   );

//   // ── Send ─────────────────────────────────────────────────────────────────

//   const isBusy = isWaiting || isStreaming;

//   const handleSend = async () => {
//     const text = inputText.trim();
//     if (!text || isBusy) return;

//     if (Platform.OS !== 'web') {
//       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     }

//     const userMsg: Message = {
//       id: `user_${Date.now()}`,
//       text,
//       isUser: true,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMsg]);
//     setInputText('');
//     setIsWaiting(true);

//     const aiMsgId = `ai_${Date.now()}`;
//     streamingMessageIdRef.current = aiMsgId;

//     await streamMessage(text, {
//       onChunk: (chunk) => {
//         setIsWaiting(false);
//         setIsStreaming(true);
//         setMessages((prev) => {
//           const existing = prev.find((m) => m.id === aiMsgId);
//           if (existing) {
//             return prev.map((m) => (m.id === aiMsgId ? { ...m, text: m.text + chunk } : m));
//           }
//           return [
//             ...prev,
//             { id: aiMsgId, text: chunk, isUser: false, timestamp: new Date(), isStreaming: true },
//           ];
//         });
//       },

//       onDone: () => {
//         setIsWaiting(false);
//         setIsStreaming(false);
//         setMessages((prev) =>
//           prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
//         );
//         streamingMessageIdRef.current = null;
//       },

//       onError: () => {
//         setIsWaiting(false);
//         setIsStreaming(false);
//         streamingMessageIdRef.current = null;
//         setMessages((prev) => prev.filter((m) => m.id !== aiMsgId || m.text.length > 0));
//         handleSyncFallback(text);
//       },
//     });
//   };

//   const handleSyncFallback = async (text: string) => {
//     setIsWaiting(true);
//     try {
//       const result = await sendSync({ message: text }).unwrap();
//       const aiMsg: Message = {
//         id: `ai_sync_${Date.now()}`,
//         text: result.reply,
//         isUser: false,
//         timestamp: new Date(),
//         isStreaming: false,
//       };
//       setMessages((prev) => [...prev, aiMsg]);
//     } catch (err: any) {
//       const detail = err?.data?.detail || err?.data?.message;
//       showError(detail || 'Something went wrong. Please try again.');
//     } finally {
//       setIsWaiting(false);
//     }
//   };

//   // ── Clear ─────────────────────────────────────────────────────────────────

//   const handleClearChat = () => {
//     if (isBusy) return;
//     setShowClearModal(true);
//   };

//   const confirmClearChat = async () => {
//     setShowClearModal(false);
//     cancelStream();
//     if (Platform.OS !== 'web') {
//       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     }
//     try {
//       await clearHistory().unwrap();
//     } catch {
//       // Even if the API call fails, clear locally
//     }
//     setMessages([WELCOME_MESSAGE]);
//     setIsWaiting(false);
//     setIsStreaming(false);
//     setOffset(0);
//     setHasMore(true);
//   };

//   // ── Render guards ────────────────────────────────────────────────────────

//   if (isRendering || isLoadingHistory) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Loading your skincare companion..." />
//       </SafeAreaView>
//     );
//   }

//   if (renderError) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="AI Assistant" height={50} backButton={true} />
//         <ErrorScreen message={renderError} onRetry={() => router.replace('/(flow)/ai-assistant')} />
//       </SafeAreaView>
//     );
//   }

//   // ── UI ───────────────────────────────────────────────────────────────────

//   return (
//     <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="AI Assistant" height={50} backButton={true} />

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={0}>
//         <SafeAreaView edges={[]} className="flex-1 px-container" style={{ paddingBottom: 0 }}>
//           <BorderlessShadowCard
//             b_tl={24}
//             b_tr={24}
//             b_bl={0}
//             b_br={0}
//             style={{
//               paddingVertical: 16,
//               paddingHorizontal: 0,
//               borderWidth: 1,
//               borderColor: '#FFFFFF',
//               marginTop: 12,
//               flex: 1,
//             }}>
//             {/* Header */}
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 gap: 12,
//                 borderBottomWidth: 1,
//                 borderBottomColor: '#2E211719',
//                 paddingHorizontal: 24,
//                 paddingBottom: 16,
//                 marginBottom: 4,
//               }}>
//               <Image
//                 source={require('@/assets/images/ai_floating_logo.png')}
//                 style={{ width: 50, height: 50 }}
//                 resizeMode="contain"
//               />
//               <View style={{ flex: 1 }}>
//                 <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 24, color: '#2A2118' }}>
//                   Gixy AI
//                 </Text>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
//                   <View
//                     style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' }}
//                   />
//                   <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 12, color: '#77B839' }}>
//                     Online
//                   </Text>
//                 </View>
//               </View>
//               <TouchableOpacity
//                 onPress={handleClearChat}
//                 disabled={isBusy}
//                 style={{ opacity: isBusy ? 0.4 : 1, paddingHorizontal: 4 }}>
//                 <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 13, color: '#EF4444' }}>
//                   Clear
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* Messages */}
//             <ScrollView
//               ref={scrollViewRef}
//               showsVerticalScrollIndicator={false}
//               style={{ flex: 1 }}
//               onScroll={handleScroll}
//               scrollEventThrottle={200}
//               contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 24, flexGrow: 1 }}>
//               {/* Pagination loader at top */}
//               {isLoadingMore && <LoadMoreIndicator />}

//               {/* "You're at the beginning" hint */}
//               {!hasMore && messages.length > 1 && (
//                 <View style={{ paddingVertical: 12, alignItems: 'center' }}>
//                   <View
//                     style={{ height: 1, width: 60, backgroundColor: '#2E211733', marginBottom: 8 }}
//                   />
//                   <Text style={{ fontFamily: 'Outfit-Regular', fontSize: 11, color: '#2E211766' }}>
//                     Beginning of conversation
//                   </Text>
//                 </View>
//               )}

//               {messages.map((message) => (
//                 <MessageBubble key={message.id} message={message} />
//               ))}
//               {isWaiting && <TypingIndicator />}
//             </ScrollView>
//           </BorderlessShadowCard>

//           {/* Input bar */}
//           <View style={{ marginBottom: insets.bottom }}>
//             <BorderlessShadowCard
//               b_tl={0}
//               b_tr={0}
//               b_bl={24}
//               b_br={24}
//               style={{
//                 paddingVertical: 12,
//                 paddingHorizontal: 20,
//                 borderWidth: 1,
//                 borderColor: '#FFFFFF',
//               }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                 <View
//                   style={{
//                     flex: 1,
//                     borderRadius: 100,
//                     backgroundColor: '#FFFFFF',
//                     paddingHorizontal: 16,
//                     paddingVertical: 10,
//                   }}>
//                   <TextInput
//                     ref={inputRef}
//                     value={inputText}
//                     onChangeText={setInputText}
//                     placeholder="Ask about your skin..."
//                     placeholderTextColor="#2E211766"
//                     style={{
//                       fontFamily: 'Outfit-Regular',
//                       fontSize: 14,
//                       color: '#2E2117',
//                       padding: 0,
//                       maxHeight: 100,
//                     }}
//                     multiline
//                     returnKeyType="send"
//                     blurOnSubmit={false}
//                     onSubmitEditing={handleSend}
//                     editable={!isBusy}
//                   />
//                 </View>

//                 <TouchableOpacity
//                   onPress={isBusy ? cancelStream : handleSend}
//                   activeOpacity={0.8}
//                   style={{
//                     width: 44,
//                     height: 44,
//                     borderRadius: 22,
//                     backgroundColor: isBusy
//                       ? '#EF444466'
//                       : inputText.trim()
//                         ? '#7A8B6A'
//                         : '#2E21173D',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                   }}>
//                   {isWaiting ? (
//                     <ActivityIndicator size="small" color="#FFFFFF" />
//                   ) : isStreaming ? (
//                     <View
//                       style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: '#FFFFFF' }}
//                     />
//                   ) : (
//                     <SendButtonIcon size={18} color="#FFFFFF" />
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </BorderlessShadowCard>
//           </View>
//         </SafeAreaView>
//       </KeyboardAvoidingView>

//       <ClearChatModal
//         visible={showClearModal}
//         onConfirm={confirmClearChat}
//         onClose={() => setShowClearModal(false)}
//       />
//     </SafeAreaView>
//   );
// };

// export default AiAssistantScreen;

// app/(flow)/ai-assistant/index.tsx
import {
  ScrollView,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import CustomHeader from '@/components/header/CustomHeader';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { SendButtonIcon } from '@/components/icons';
import { useToast } from '@/hooks/useToast';
import LoadingScreen from '@/components/loading/LoadingScreen';
import { useScreenReady } from '@/hooks/useScreenReady';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useRouter } from 'expo-router';

import {
  useSendMessageSyncMutation,
  useLazyGetChatHistoryQuery,
  useClearChatHistoryMutation,
} from '@/store/api/chatApi';
import { useChatStream } from '@/hooks/useChatStream';
import { MarkdownText } from '@/components/chat/MarkdownText';
import ClearChatModal from '@/components/ui/ClearChatModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

// A rendered list item is either a message or a date separator
type ListItem =
  | { type: 'message'; message: Message }
  | { type: 'separator'; label: string; key: string };

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  text: "Hello! I'm your **Gixy AI** assistant. 👋\n\nI can help you with:\n- Skincare advice tailored to your profile\n- Ingredient guidance\n- Routine building\n\nHow can I help you today?",
  isUser: false,
  timestamp: new Date(),
};

const PAGE_LIMIT = 20;

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Returns "YYYY-MM-DD" string for any Date, in local time */
const toDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Converts a date key to a human-readable label */
const dateKeyToLabel = (key: string): string => {
  const today = toDateKey(new Date());
  const yesterday = toDateKey(new Date(Date.now() - 86_400_000));

  if (key === today) return 'Today';
  if (key === yesterday) return 'Yesterday';

  // For older dates: "Mon, 19 May" or "Mon, 19 May 2024" (include year if not current)
  const [year, month, day] = key.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const isCurrentYear = year === new Date().getFullYear();

  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(isCurrentYear ? {} : { year: 'numeric' }),
  });
};

// ─── Build list items with date separators ────────────────────────────────────

const buildListItems = (messages: Message[]): ListItem[] => {
  const items: ListItem[] = [];
  let lastDateKey = '';

  for (const message of messages) {
    const dateKey = toDateKey(message.timestamp);
    if (dateKey !== lastDateKey) {
      items.push({
        type: 'separator',
        label: dateKeyToLabel(dateKey),
        key: `sep_${dateKey}`,
      });
      lastDateKey = dateKey;
    }
    items.push({ type: 'message', message });
  }

  return items;
};

// ─── Typing dots indicator ────────────────────────────────────────────────────

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        ])
      ).start();
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  const dotStyle = {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E211799',
    marginHorizontal: 2,
  };

  return (
    <View style={{ marginBottom: 12, alignItems: 'flex-start' }}>
      <BorderlessShadowCard
        b_tl={2}
        b_tr={16}
        b_bl={16}
        b_br={16}
        style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Animated.View style={[dotStyle, { opacity: dot1 }]} />
          <Animated.View style={[dotStyle, { opacity: dot2 }]} />
          <Animated.View style={[dotStyle, { opacity: dot3 }]} />
        </View>
      </BorderlessShadowCard>
    </View>
  );
}

// ─── Date separator ───────────────────────────────────────────────────────────

function DateSeparator({ label }: { label: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        paddingHorizontal: 4,
      }}>
      <View style={{ flex: 1, height: 1, backgroundColor: '#2E211719' }} />
      <View
        style={{
          marginHorizontal: 10,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 100,
          backgroundColor: '#2E21170D',
        }}>
        <Text
          style={{
            fontFamily: 'Outfit-Medium',
            fontSize: 11,
            color: '#2E211799',
            letterSpacing: 0.3,
          }}>
          {label}
        </Text>
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: '#2E211719' }} />
    </View>
  );
}

// ─── Load more indicator ──────────────────────────────────────────────────────

function LoadMoreIndicator() {
  return (
    <View style={{ paddingVertical: 12, alignItems: 'center' }}>
      <ActivityIndicator size="small" color="#7A8B6A" />
      <Text
        style={{ fontFamily: 'Outfit-Regular', fontSize: 12, color: '#2E211799', marginTop: 4 }}>
        Loading older messages...
      </Text>
    </View>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.isUser;
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={{ marginBottom: 12, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isUser ? '#7A8B6A' : '#FFFFFF',
          maxWidth: '85%',

          borderTopLeftRadius: isUser ? 16 : 2,
          borderTopRightRadius: isUser ? 2 : 16,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,

          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 0.8,
        }}>
        {isUser ? (
          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              fontSize: 14,
              lineHeight: 22,
              color: '#FFFFFF',
            }}>
            {message.text}
          </Text>
        ) : (
          <MarkdownText content={message.text} color="#2E2117" fontSize={14} />
        )}

        {!message.isStreaming && (
          <Text
            style={{
              marginTop: 4,
              fontFamily: 'Outfit-Regular',
              fontSize: 10,
              color: isUser ? '#FFFFFFB2' : '#2E211766',
              textAlign: 'right',
            }}>
            {formatTime(message.timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toLocalMessage = (
  m: { role: string; content: string; created_at: string },
  index: number
): Message => ({
  id: `history_${index}_${m.created_at}`,
  text: m.content,
  isUser: m.role === 'user',
  timestamp: new Date(m.created_at),
  isStreaming: false,
});

// ─── Main screen ──────────────────────────────────────────────────────────────

const AiAssistantScreen = () => {
  const router = useRouter();
  const { showError } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);

  // Pagination
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const streamingMessageIdRef = useRef<string | null>(null);

  const { streamMessage, cancelStream } = useChatStream();
  const [sendSync] = useSendMessageSyncMutation();
  const [fetchHistory] = useLazyGetChatHistoryQuery();
  const [clearHistory] = useClearChatHistoryMutation();

  const { isRendering, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  // ── Build list items (messages + date separators) ─────────────────────────

  const listItems = useMemo(() => buildListItems(messages), [messages]);

  // ── Initial load ──────────────────────────────────────────────────────────

  const loadInitialHistory = useCallback(async () => {
    try {
      const result = await fetchHistory({ limit: PAGE_LIMIT, offset: 0 }).unwrap();
      const msgs = result.messages ?? [];

      if (msgs.length === 0) {
        setMessages([WELCOME_MESSAGE]);
        setHasMore(false);
      } else {
        setMessages(msgs.map(toLocalMessage));
        setHasMore(msgs.length === PAGE_LIMIT);
        setOffset(PAGE_LIMIT);
      }
    } catch {
      setMessages([WELCOME_MESSAGE]);
      setHasMore(false);
    } finally {
      setIsLoadingHistory(false);
      // After initial load, jump to the bottom (no animation needed)
      shouldScrollToBottom.current = true;
    }
  }, [fetchHistory]);

  useEffect(() => {
    loadInitialHistory();
  }, [loadInitialHistory]);

  // Scroll to bottom after initial history renders
  useEffect(() => {
    if (!isLoadingHistory && shouldScrollToBottom.current) {
      shouldScrollToBottom.current = false;
      scrollToBottom(false);
    }
  }, [isLoadingHistory]);

  // Auto-scroll to bottom ONLY for new outgoing/incoming messages, not pagination prepends
  const shouldScrollToBottom = useRef(false);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated }), 80);
  }, []);

  // ── Pagination ────────────────────────────────────────────────────────────

  // Tracks scroll position before prepend so we can restore it after
  const scrollYBeforePrepend = useRef(0);
  const contentHeightBeforePrepend = useRef(0);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoadingHistory) return;
    // Snapshot current content height and scroll position before we prepend messages.
    // handleContentSizeChange will use this to restore scroll position after prepend.
    // contentHeightBeforePrepend is set here; scrollYBeforePrepend is kept current via onScroll.
    setIsLoadingMore(true);
    try {
      const result = await fetchHistory({ limit: PAGE_LIMIT, offset }).unwrap();
      const older = result.messages ?? [];

      if (older.length === 0) {
        setHasMore(false);
        return;
      }

      // Prepend — after React re-renders we restore the scroll position
      setMessages((prev) => [...older.map((m, i) => toLocalMessage(m, offset + i)), ...prev]);
      setOffset((prev) => prev + older.length);
      setHasMore(older.length === PAGE_LIMIT);
    } catch {
      // Silent
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, isLoadingHistory, offset, fetchHistory]);

  const handleScroll = useCallback(
    (event: any) => {
      const y = event.nativeEvent.contentOffset.y;
      scrollYBeforePrepend.current = y;
      if (y < 60 && hasMore && !isLoadingMore) {
        handleLoadMore();
      }
    },
    [hasMore, isLoadingMore, handleLoadMore]
  );

  // After older messages are prepended, content height grows.
  // We restore scroll to (oldScrollY + heightDiff) so the user stays
  // at the same message they were reading — not bounced to the bottom.
  const handleContentSizeChange = useCallback(
    (_: number, newHeight: number) => {
      const prevHeight = contentHeightBeforePrepend.current;
      // Only act if:
      // 1. We have a saved snapshot (prevHeight > 0)
      // 2. Content grew (messages were prepended)
      // 3. We are NOT still loading (load is complete)
      if (prevHeight > 0 && newHeight > prevHeight && !isLoadingMore) {
        const diff = newHeight - prevHeight;
        scrollViewRef.current?.scrollTo({
          y: scrollYBeforePrepend.current + diff,
          animated: false,
        });
        contentHeightBeforePrepend.current = 0; // reset until next load
      } else if (prevHeight === 0 && !isLoadingMore) {
        // Normal growth (new messages sent) — save current height for next load
        contentHeightBeforePrepend.current = newHeight;
      }
    },
    [isLoadingMore]
  );

  // ── Send ──────────────────────────────────────────────────────────────────

  const isBusy = isWaiting || isStreaming;

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isBusy) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsWaiting(true);
    scrollToBottom(true);

    const aiMsgId = `ai_${Date.now()}`;
    streamingMessageIdRef.current = aiMsgId;

    await streamMessage(text, {
      onChunk: (chunk) => {
        setIsWaiting(false);
        setIsStreaming(true);
        setMessages((prev) => {
          const existing = prev.find((m) => m.id === aiMsgId);
          if (existing)
            return prev.map((m) => (m.id === aiMsgId ? { ...m, text: m.text + chunk } : m));
          return [
            ...prev,
            { id: aiMsgId, text: chunk, isUser: false, timestamp: new Date(), isStreaming: true },
          ];
        });
      },
      onDone: () => {
        setIsWaiting(false);
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
        );
        streamingMessageIdRef.current = null;
      },
      onError: () => {
        setIsWaiting(false);
        setIsStreaming(false);
        streamingMessageIdRef.current = null;
        setMessages((prev) => prev.filter((m) => m.id !== aiMsgId || m.text.length > 0));
        handleSyncFallback(text);
      },
    });
  };

  const handleSyncFallback = async (text: string) => {
    setIsWaiting(true);
    try {
      const result = await sendSync({ message: text }).unwrap();
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_sync_${Date.now()}`,
          text: result.reply,
          isUser: false,
          timestamp: new Date(),
          isStreaming: false,
        },
      ]);
    } catch (err: any) {
      const detail = err?.data?.detail || err?.data?.message;
      showError(detail || 'Something went wrong. Please try again.');
    } finally {
      setIsWaiting(false);
    }
  };

  // ── Clear ─────────────────────────────────────────────────────────────────

  const handleClearChat = () => {
    if (!isBusy) setShowClearModal(true);
  };

  const confirmClearChat = async () => {
    setShowClearModal(false);
    cancelStream();
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await clearHistory().unwrap();
    } catch {}
    setMessages([WELCOME_MESSAGE]);
    setIsWaiting(false);
    setIsStreaming(false);
    setOffset(0);
    setHasMore(true);
  };

  // ── Render guards ─────────────────────────────────────────────────────────

  if (isRendering || isLoadingHistory) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading your skincare companion..." />
      </SafeAreaView>
    );
  }

  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="AI Assistant" height={50} backButton={true} />
        <ErrorScreen message={renderError} onRetry={() => router.replace('/(flow)/ai-assistant')} />
      </SafeAreaView>
    );
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="AI Assistant" height={50} backButton={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}>
        <SafeAreaView
          // edges={['bottom']}
          className="flex-1 px-container"
          style={{ paddingBottom: 0 }}>
          <BorderlessShadowCard
            b_tl={24}
            b_tr={24}
            b_bl={0}
            b_br={0}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 0,
              borderWidth: 1,
              borderColor: '#FFFFFF',
              flex: 1,
            }}>
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#2E211719',
                // ,
                paddingHorizontal: 14,
                paddingBottom: 16,
                marginBottom: 4,
              }}>
              <Image
                source={require('@/assets/images/ai_floating_logo.png')}
                style={{ width: 50, height: 50 }}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 24, color: '#2A2118' }}>
                  Gixy AI
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View
                    style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' }}
                  />
                  <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 12, color: '#77B839' }}>
                    Online
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleClearChat}
                disabled={isBusy}
                style={{ opacity: isBusy ? 0.4 : 1, paddingHorizontal: 4 }}>
                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 13, color: '#EF4444' }}>
                  Clear
                </Text>
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              onScroll={handleScroll}
              scrollEventThrottle={100}
              onContentSizeChange={handleContentSizeChange}
              // paddingHorizontal: 24
              contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 14, flexGrow: 1 }}>
              {isLoadingMore && <LoadMoreIndicator />}

              {!hasMore && messages.length > 1 && (
                <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                  <View
                    style={{ height: 1, width: 60, backgroundColor: '#2E211733', marginBottom: 8 }}
                  />
                  <Text style={{ fontFamily: 'Outfit-Regular', fontSize: 11, color: '#2E211766' }}>
                    Beginning of conversation
                  </Text>
                </View>
              )}

              {listItems.map((item) =>
                item.type === 'separator' ? (
                  <DateSeparator key={item.key} label={item.label} />
                ) : (
                  <MessageBubble key={item.message.id} message={item.message} />
                )
              )}

              {isWaiting && <TypingIndicator />}
            </ScrollView>
          </BorderlessShadowCard>

          {/* Input bar */}
          <View>
            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              style={{
                paddingVertical: 12,
                // paddingHorizontal: 20,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: '#FFFFFF',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    flex: 1,
                    borderRadius: 100,
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}>
                  <TextInput
                    ref={inputRef}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Ask about your skin..."
                    placeholderTextColor="#2E211766"
                    style={{
                      fontFamily: 'Outfit-Regular',
                      fontSize: 14,
                      color: '#2E2117',
                      padding: 0,
                      maxHeight: 100,
                    }}
                    multiline
                    returnKeyType="send"
                    blurOnSubmit={false}
                    onSubmitEditing={handleSend}
                    editable={!isBusy}
                  />
                </View>
                <TouchableOpacity
                  onPress={isBusy ? cancelStream : handleSend}
                  activeOpacity={0.8}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: isBusy
                      ? '#EF444466'
                      : inputText.trim()
                        ? '#7A8B6A'
                        : '#2E21173D',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {isWaiting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : isStreaming ? (
                    <View
                      style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: '#FFFFFF' }}
                    />
                  ) : (
                    <SendButtonIcon size={18} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>
            </BorderlessShadowCard>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <ClearChatModal
        visible={showClearModal}
        onConfirm={confirmClearChat}
        onClose={() => setShowClearModal(false)}
      />
    </SafeAreaView>
  );
};

export default AiAssistantScreen;
