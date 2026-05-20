// // store/api/chatApi.ts
// import { baseApi } from './baseApi';

// export interface ChatMessageRequest {
//   message: string;
// }

// export interface ChatSyncResponse {
//   reply: string;
// }

// export interface ChatHistoryMessage {
//   role: 'user' | 'assistant';
//   content: string;
//   created_at: string;
// }

// export interface ChatHistoryResponse {
//   messages: ChatHistoryMessage[];
// }

// export const chatApi = baseApi.injectEndpoints({
//   overrideExisting: false,
//   endpoints: (builder) => ({
//     sendMessageSync: builder.mutation<ChatSyncResponse, ChatMessageRequest>({
//       query: (body) => ({
//         url: '/chat/message/sync',
//         method: 'POST',
//         body,
//       }),
//     }),

//     getChatHistory: builder.query<ChatHistoryResponse, { limit: number; offset: number }>({
//       query: ({ limit, offset }) => ({
//         url: `/chat/history?limit=${limit}&offset=${offset}`,
//         method: 'GET',
//       }),
//     }),

//     clearChatHistory: builder.mutation<void, void>({
//       query: () => ({
//         url: '/chat/history',
//         method: 'DELETE',
//       }),
//     }),
//   }),
// });

// export const {
//   useSendMessageSyncMutation,
//   useGetChatHistoryQuery,
//   useLazyGetChatHistoryQuery,
//   useClearChatHistoryMutation,
// } = chatApi;

// store/api/chatApi.ts
import { baseApi } from './baseApi';

export interface ChatMessageRequest {
  message: string;
}

export interface ChatSyncResponse {
  reply: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatHistoryResponse {
  messages: ChatHistoryMessage[];
}

export const chatApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    sendMessageSync: builder.mutation<ChatSyncResponse, ChatMessageRequest>({
      query: (body) => ({
        url: '/chat/message/sync',
        method: 'POST',
        body,
      }),
    }),

    getChatHistory: builder.query<ChatHistoryResponse, { limit: number; offset: number }>({
      query: ({ limit, offset }) => ({
        url: `/chat/history?limit=${limit}&offset=${offset}`,
        method: 'GET',
      }),
    }),

    clearChatHistory: builder.mutation<void, void>({
      query: () => ({
        url: '/chat/history',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useSendMessageSyncMutation,
  useGetChatHistoryQuery,
  useLazyGetChatHistoryQuery,
  useClearChatHistoryMutation,
} = chatApi;
