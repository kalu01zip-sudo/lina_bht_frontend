import { baseApi } from './baseApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SignUpRequest {
  email: string;
  full_name: string;
  password: string;
  onesignal_id?: string | null;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
}

export interface SignInRequest {
  email: string;
  password: string;
  onesignal_id?: string | null;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_verified: boolean;
  auth_provider: string;
  avatar_url: string | null;
  apple_id: string | null;
  onboarding_completed: boolean;
  skin_type: string | null;
  hair_type: string | null;
  current_phase: string | null;
  skin_concerns: string[];
  hair_concerns: string[];
  allergies: string[];
  budget: string | null;
  created_at: string;
  plan: string;
}

export interface SignInResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface ResendOtpRequest {
  email: string;
  purpose: 'verify_email' | 'forgot_password';
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface GoogleSignInRequest {
  id_token: string;
  onesignal_id?: string | null;
}

export interface AppleSignInRequest {
  identity_token: string;
  full_name: string | null;
  onesignal_id?: string | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface SignOutRequest {
  refresh_token: string;
}

export interface SignOutResponse {
  success: boolean;
  message: string;
}

// ─── Injected Endpoints ───────────────────────────────────────────────────────

export const authApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),

    signIn: builder.mutation<SignInResponse, SignInRequest>({
      query: (body) => ({
        url: '/auth/signin',
        method: 'POST',
        body,
      }),
    }),

    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
    }),

    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (body) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body,
      }),
    }),

    googleSignIn: builder.mutation<SignInResponse, GoogleSignInRequest>({
      query: (body) => ({
        url: '/auth/google',
        method: 'POST',
        body,
      }),
    }),

    appleSignIn: builder.mutation<SignInResponse, AppleSignInRequest>({
      query: (body) => ({ url: '/auth/apple', method: 'POST', body }),
    }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),

    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),

    signOut: builder.mutation<SignOutResponse, SignOutRequest>({
      query: (body) => ({
        url: '/auth/signout',
        method: 'POST',
        body,
      }),
    }),

    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useGoogleSignInMutation,
  useAppleSignInMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSignOutMutation,
  useChangePasswordMutation,
} = authApi;
