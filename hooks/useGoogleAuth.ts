// import {
//   GoogleSignin,
//   isErrorWithCode,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
// import { useAuth } from './useAuth';
// import { useToast } from './useToast';
// import { useGoogleSignInMutation } from '@/store/api/authApi';
// import { useCallback } from 'react';
// import { extractApiError } from '@/utils/apiError';
// import { useOneSignalId } from '@/hooks/useOneSignalId';

// export function configureGoogleSignIn() {
//   const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
//   console.log('[Google] configureGoogleSignIn webClientId:', webClientId);
//   GoogleSignin.configure({
//     webClientId,
//   });
// }

// export function useGoogleAuth() {
//   const { persistAndLogin } = useAuth();
//   const { showError } = useToast();
//   const [googleSignIn, { isLoading }] = useGoogleSignInMutation();
//   const onesignalId = useOneSignalId(); // ← add

//   const signInWithGoogle = useCallback(async () => {
//     try {
//       console.log('[Google] Checking Play Services...');
//       await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//       console.log('[Google] Play Services OK');

//       // ✅ Always sign out first so the account picker is always shown
//       // This lets users switch accounts and prevents silent re-auth
//       await GoogleSignin.signOut();

//       console.log('[Google] Starting sign-in...');
//       const userInfo = await GoogleSignin.signIn();
//       console.log('[Google] Sign-in result:', JSON.stringify(userInfo, null, 2));

//       const idToken = userInfo.data?.idToken;
//       console.log('[Google] ID Token:', idToken ? `${idToken.slice(0, 40)}...` : 'NULL');

//       if (!idToken) {
//         showError('Google sign-in did not return a token. Please try again.');
//         return;
//       }

//       console.log('[Google] Calling backend /auth/google...');
//       const data = await googleSignIn({ id_token: idToken }).unwrap();
//       console.log('[Google] Backend OK:', JSON.stringify(data, null, 2));

//       await persistAndLogin(data);
//       console.log('[Google] Done!');
//     } catch (error: any) {
//       console.error('[Google] ERROR:', JSON.stringify(error, null, 2));
//       console.error('[Google] code:', error?.code);
//       console.error('[Google] message:', error?.message);

//       if (isErrorWithCode(error)) {
//         switch (error.code) {
//           case statusCodes.SIGN_IN_CANCELLED:
//             return;
//           case statusCodes.IN_PROGRESS:
//             return;
//           case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//             showError('Google Play Services are not available on this device.');
//             return;
//           default:
//             break;
//         }
//       }

//       showError(extractApiError(error, 'Google sign-in failed. Please try again.'));
//     }
//   }, [googleSignIn, persistAndLogin, showError]);

//   return { signInWithGoogle, isLoading };
// }

// // ✅ Call this from useAuth logout() to fully clear Google session
// export async function signOutFromGoogle() {
//   try {
//     const isSignedIn = await GoogleSignin.getCurrentUser();
//     if (isSignedIn) {
//       await GoogleSignin.signOut();
//       console.log('[Google] Signed out from Google');
//     }
//   } catch {
//     // Silent fail — local logout should still proceed
//   }
// }

import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useGoogleSignInMutation } from '@/store/api/authApi';
import { useCallback } from 'react';
import { extractApiError } from '@/utils/apiError';
import { useOneSignalId } from '@/hooks/useOneSignalId';

export function configureGoogleSignIn() {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
  console.log('[Google] configureGoogleSignIn webClientId:', webClientId);
  GoogleSignin.configure({
    webClientId,
  });
}

export function useGoogleAuth() {
  const { persistAndLogin } = useAuth();
  const { showError } = useToast();
  const [googleSignIn, { isLoading }] = useGoogleSignInMutation();
  const onesignalId = useOneSignalId(); // ← add

  const signInWithGoogle = useCallback(async () => {
    try {
      console.log('[Google] Checking Play Services...');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('[Google] Play Services OK');

      // ✅ Always sign out first so the account picker is always shown
      // This lets users switch accounts and prevents silent re-auth
      await GoogleSignin.signOut();

      console.log('[Google] Starting sign-in...');
      const userInfo = await GoogleSignin.signIn();
      console.log('[Google] Sign-in result:', JSON.stringify(userInfo, null, 2));

      const idToken = userInfo.data?.idToken;
      console.log('[Google] ID Token:', idToken ? `${idToken.slice(0, 40)}...` : 'NULL');

      if (!idToken) {
        showError('Google sign-in did not return a token. Please try again.');
        return;
      }

      console.log('[Google] Calling backend /auth/google...');
      // const data = await googleSignIn({ id_token: idToken }).unwrap();
      const data = await googleSignIn({
        id_token: idToken,
        onesignal_id: onesignalId, // ← add
      }).unwrap();
      console.log('[Google] Backend OK:', JSON.stringify(data, null, 2));

      await persistAndLogin(data);
      console.log('[Google] Done!');
    } catch (error: any) {
      console.error('[Google] ERROR:', JSON.stringify(error, null, 2));
      console.error('[Google] code:', error?.code);
      console.error('[Google] message:', error?.message);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            return;
          case statusCodes.IN_PROGRESS:
            return;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            showError('Google Play Services are not available on this device.');
            return;
          default:
            break;
        }
      }

      showError(extractApiError(error, 'Google sign-in failed. Please try again.'));
    }
  }, [googleSignIn, persistAndLogin, showError, onesignalId]);

  return { signInWithGoogle, isLoading };
}

// ✅ Call this from useAuth logout() to fully clear Google session
export async function signOutFromGoogle() {
  try {
    const isSignedIn = await GoogleSignin.getCurrentUser();
    if (isSignedIn) {
      await GoogleSignin.signOut();
      console.log('[Google] Signed out from Google');
    }
  } catch {
    // Silent fail — local logout should still proceed
  }
}
