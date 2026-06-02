// import * as AppleAuthentication from 'expo-apple-authentication';
// import { useAuth } from './useAuth';
// import { useToast } from './useToast';
// import { useAppleSignInMutation } from '@/store/api/authApi';
// import { useCallback } from 'react';
// import { extractApiError } from '@/utils/apiError';

// export function useAppleAuth() {
//   const { persistAndLogin } = useAuth();
//   const { showError } = useToast();
//   const [appleSignIn, { isLoading }] = useAppleSignInMutation();

//   const signInWithApple = useCallback(async () => {
//     try {
//       // 1. Trigger native Apple sign-in sheet
//       console.log('[Apple] Starting sign-in...');
//       const credential = await AppleAuthentication.signInAsync({
//         requestedScopes: [
//           AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
//           AppleAuthentication.AppleAuthenticationScope.EMAIL,
//         ],
//       });
//       console.log('[Apple] Credential received');

//       const identityToken = credential.identityToken;
//       console.log(
//         '[Apple] Identity Token:',
//         identityToken ? `${identityToken.slice(0, 40)}...` : 'NULL'
//       );

//       if (!identityToken) {
//         showError('Apple sign-in did not return a token. Please try again.');
//         return;
//       }

//       // 2. Build full name — Apple only provides this on the VERY FIRST sign-in
//       const { givenName, familyName } = credential.fullName ?? {};
//       const fullName = [givenName, familyName].filter(Boolean).join(' ') || null;
//       console.log('[Apple] Full name:', fullName);

//       // 3. Send identity_token directly to your backend
//       console.log('[Apple] Calling backend /auth/apple...');
//       const data = await appleSignIn({
//         identity_token: identityToken,
//         full_name: fullName,
//       }).unwrap();
//       console.log('[Apple] Backend OK:', JSON.stringify(data, null, 2));

//       // 4. Persist session
//       await persistAndLogin(data);
//       console.log('[Apple] Done!');
//     } catch (error: any) {
//       console.error('[Apple] ERROR:', JSON.stringify(error, null, 2));
//       console.error('[Apple] code:', error?.code);
//       console.error('[Apple] message:', error?.message);

//       // User dismissed the sheet — no toast
//       if (error?.code === 'ERR_REQUEST_CANCELED') return;

//       showError(extractApiError(error, 'Apple sign-in failed. Please try again.'));
//     }
//   }, [appleSignIn, persistAndLogin, showError]);

//   return { signInWithApple, isLoading };
// }

import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useAppleSignInMutation } from '@/store/api/authApi';
import { useCallback } from 'react';
import { extractApiError } from '@/utils/apiError';
import { useOneSignalId } from './useOneSignalId';

export function useAppleAuth() {
  const { persistAndLogin } = useAuth();
  const { showError } = useToast();
  const [appleSignIn, { isLoading }] = useAppleSignInMutation();

  const onesignalId = useOneSignalId(); // ← add

  const signInWithApple = useCallback(async () => {
    try {
      // 1. Trigger native Apple sign-in sheet
      console.log('[Apple] Starting sign-in...');
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log('[Apple] Credential received');

      const identityToken = credential.identityToken;
      console.log(
        '[Apple] Identity Token:',
        identityToken ? `${identityToken.slice(0, 40)}...` : 'NULL'
      );

      if (!identityToken) {
        showError('Apple sign-in did not return a token. Please try again.');
        return;
      }

      // 2. Build full name — Apple only provides this on the VERY FIRST sign-in
      const { givenName, familyName } = credential.fullName ?? {};
      const fullName = [givenName, familyName].filter(Boolean).join(' ') || null;
      console.log('[Apple] Full name:', fullName);

      // 3. Send identity_token directly to your backend
      console.log('[Apple] Calling backend /auth/apple...');
      const data = await appleSignIn({
        identity_token: identityToken,
        full_name: fullName,
        onesignal_id: onesignalId, // ← add
      }).unwrap();
      console.log('[Apple] Backend OK:', JSON.stringify(data, null, 2));

      // 4. Persist session
      await persistAndLogin(data);
      console.log('[Apple] Done!');
    } catch (error: any) {
      console.error('[Apple] ERROR:', JSON.stringify(error, null, 2));
      console.error('[Apple] code:', error?.code);
      console.error('[Apple] message:', error?.message);

      // User dismissed the sheet — no toast
      if (error?.code === 'ERR_REQUEST_CANCELED') return;

      showError(extractApiError(error, 'Apple sign-in failed. Please try again.'));
    }
  }, [appleSignIn, persistAndLogin, showError, onesignalId]);

  return { signInWithApple, isLoading };
}
