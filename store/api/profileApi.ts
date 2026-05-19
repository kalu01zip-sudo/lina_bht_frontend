// import { baseApi } from './baseApi';

// export interface ProfileResponse {
//   avatar_url: string | null;
//   full_name: string;
//   email: string;
//   gender: string;
//   date_of_birth: string; // "1989-12-31"
//   language: string; // "en"
//   country: string; // "US"
// }

// export interface ProfileEditRequest {
//   full_name?: string;
//   gender?: string;
//   date_of_birth?: string;
//   language?: string;
//   country?: string;
//   avatar?: {
//     uri: string;
//     name: string;
//     type: string;
//   };
// }

// export interface ProfileTabResponse {
//   avatar_url: string | null;
//   name: string;
//   gmail: string;
//   plan: string;
//   onboarding: {
//     onboarding_completed: boolean;
//     skin_type: string | null;
//     hair_type: string | null;
//     current_phase: string | null;
//     skin_concerns: string[];
//     hair_concerns: string[];
//     allergies: string[];
//     budget: string | null;
//   };
// }

// export const profileApi = baseApi.injectEndpoints({
//   overrideExisting: false,
//   endpoints: (builder) => ({
//     getProfile: builder.query<ProfileResponse, void>({
//       query: () => '/profile/profile_edit',
//       // Normalize empty string avatar to null so ?? fallback works correctly
//       transformResponse: (response: ProfileResponse) => ({
//         ...response,
//         avatar_url: response.avatar_url || null,
//       }),
//       providesTags: ['User'],
//     }),

//     editProfile: builder.mutation<ProfileResponse, FormData>({
//       query: (formData) => ({
//         url: '/profile/profile_edit',
//         method: 'PATCH',
//         body: formData,
//         formData: true,
//       }),
//       // Normalize here too
//       transformResponse: (response: ProfileResponse) => ({
//         ...response,
//         avatar_url: response.avatar_url || null,
//       }),
//       invalidatesTags: ['User'],
//     }),

//     getProfileTab: builder.query<ProfileTabResponse, void>({
//       query: () => '/profile',
//       providesTags: ['User'],
//     }),
//   }),
// });

// export const { useGetProfileQuery, useEditProfileMutation, useGetProfileTabQuery } = profileApi;

// store/api/profileApi.ts
import { baseApi } from './baseApi';

export interface ProfileResponse {
  avatar_url: string | null;
  full_name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  language: string;
  country: string;
}

export interface ProfileEditRequest {
  full_name?: string;
  gender?: string;
  date_of_birth?: string;
  language?: string;
  country?: string;
  avatar?: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface ProfileTabResponse {
  avatar_url: string | null;
  name: string;
  gmail: string;
  plan: string;
  onboarding: {
    onboarding_completed: boolean;
    skin_type: string | null;
    hair_type: string | null;
    current_phase: string | null;
    skin_concerns: string[];
    hair_concerns: string[];
    allergies: string[];
    budget: string | null;
  };
}

export interface StressResponse {
  stress_level: string | null;
}

export interface StressRequest {
  stress_level: string;
}

export interface CyclePhaseResponse {
  current_phase: string | null;
  phase_description: string | null;
  period_start_date: string | null;
  detail?: string; // API returns "detail" on error/empty
}

export interface CycleStartDateRequest {
  period_start_date: string; // "YYYY-MM-DD"
}

export interface CycleStartDateResponse {
  message?: string;
  detail?: string;
}

export const profileApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => '/profile/profile_edit',
      transformResponse: (response: ProfileResponse) => ({
        ...response,
        avatar_url: response.avatar_url || null,
      }),
      providesTags: ['User'],
    }),

    editProfile: builder.mutation<ProfileResponse, FormData>({
      query: (formData) => ({
        url: '/profile/profile_edit',
        method: 'PATCH',
        body: formData,
        formData: true,
      }),
      transformResponse: (response: ProfileResponse) => ({
        ...response,
        avatar_url: response.avatar_url || null,
      }),
      invalidatesTags: ['User'],
    }),

    getProfileTab: builder.query<ProfileTabResponse, void>({
      query: () => '/profile',
      providesTags: ['User'],
    }),

    // ── Stress ──────────────────────────────────────────────────────────────

    getStress: builder.query<StressResponse, void>({
      query: () => '/profile/stress',
      transformResponse: (response: any) => ({
        stress_level: response?.stress_level ?? null,
      }),
      providesTags: ['Stress'],
    }),

    updateStress: builder.mutation<StressResponse, StressRequest>({
      query: (body) => ({
        url: '/profile/stress',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Stress'],
    }),

    // ── Cycle ────────────────────────────────────────────────────────────────

    getCyclePhase: builder.query<CyclePhaseResponse, void>({
      query: () => '/profile/cycle_phase',
      transformResponse: (response: any) => ({
        current_phase: response?.current_phase ?? null,
        phase_description: response?.phase_description ?? null,
        period_start_date: response?.period_start_date ?? null,
        detail: response?.detail ?? null,
      }),
      providesTags: ['CyclePhase'],
    }),

    updateCycleStartDate: builder.mutation<CycleStartDateResponse, CycleStartDateRequest>({
      query: (body) => ({
        url: '/profile/cycle_start_date',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['CyclePhase'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useEditProfileMutation,
  useGetProfileTabQuery,
  useGetStressQuery,
  useUpdateStressMutation,
  useGetCyclePhaseQuery,
  useUpdateCycleStartDateMutation,
} = profileApi;
