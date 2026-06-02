// // hooks/useAuth.ts
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import {
//   setCredentials,
//   clearCredentials,
//   selectIsAuthenticated,
//   selectCurrentUser,
// } from '@/store/slices/authSlice';
// import { SignInResponse } from '@/store/api/authApi';
// import { baseApi } from '@/store/api/baseApi';
// import { signOutFromGoogle } from '@/hooks/useGoogleAuth'; // ✅ added

// export const useAuth = () => {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const isAuthenticated = useAppSelector(selectIsAuthenticated);
//   const user = useAppSelector(selectCurrentUser);

//   const rehydrate = async () => {
//     try {
//       const accessToken = await AsyncStorage.getItem('access_token');
//       const refreshToken = await AsyncStorage.getItem('refresh_token');
//       const userRaw = await AsyncStorage.getItem('user');

//       if (accessToken && userRaw) {
//         const user = JSON.parse(userRaw);
//         dispatch(setCredentials({ user, accessToken, refreshToken: refreshToken || '' }));

//         // ✅ If onboarding not marked complete locally, re-check from API
//         if (!user.onboarding_completed) {
//           try {
//             const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/profile`, {
//               headers: { Authorization: `Bearer ${accessToken}` },
//             });
//             const profileData = await response.json();
//             if (profileData?.onboarding?.onboarding_completed) {
//               const updatedUser = { ...user, onboarding_completed: true };
//               await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
//               dispatch(
//                 setCredentials({ user: updatedUser, accessToken, refreshToken: refreshToken || '' })
//               );
//             }
//           } catch {
//             // Silent fail — use cached value
//           }
//         }
//       }
//     } catch {
//       // Silent fail
//     }
//   };

//   const persistAndLogin = async (data: SignInResponse) => {
//     await AsyncStorage.multiSet([
//       ['access_token', data.access_token],
//       ['refresh_token', data.refresh_token],
//       ['user', JSON.stringify(data.user)],
//     ]);

//     dispatch(
//       setCredentials({
//         user: data.user,
//         accessToken: data.access_token,
//         refreshToken: data.refresh_token,
//       })
//     );

//     if (!data.user.onboarding_completed) {
//       // router.replace('/(questionnaire)/life-phase');
//       router.replace('/(questionnaire)/personal-info');
//     } else {
//       router.replace('/(main)');
//     }
//   };

//   const updateUser = async (updatedUser: Partial<typeof user>) => {
//     try {
//       const userRaw = await AsyncStorage.getItem('user');
//       if (userRaw) {
//         const existingUser = JSON.parse(userRaw);
//         const merged = { ...existingUser, ...updatedUser };
//         await AsyncStorage.setItem('user', JSON.stringify(merged));
//         dispatch(
//           setCredentials({
//             user: merged,
//             accessToken: (await AsyncStorage.getItem('access_token')) || '',
//             refreshToken: (await AsyncStorage.getItem('refresh_token')) || '',
//           })
//         );
//       }
//     } catch {
//       // Silent fail
//     }
//   };

//   const logout = async () => {
//     try {
//       // ✅ Get refresh token before clearing storage
//       const refreshToken = await AsyncStorage.getItem('refresh_token');

//       // ✅ Sign out from Google to clear cached account
//       await signOutFromGoogle();

//       // ✅ Call signout API — fire and forget, don't block logout on failure
//       if (refreshToken) {
//         try {
//           await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/signout`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${await AsyncStorage.getItem('access_token')}`,
//             },
//             body: JSON.stringify({ refresh_token: refreshToken }),
//           });
//         } catch {
//           // API call failed — still proceed with local logout
//         }
//       }
//     } finally {
//       // ✅ Always clear local state regardless of API success/failure
//       await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
//       dispatch(clearCredentials());
//       // ✅ Reset all RTK Query cache
//       dispatch(baseApi.util.resetApiState());
//       router.replace('/(onboarding)');
//     }
//   };

//   return {
//     isAuthenticated,
//     user,
//     rehydrate,
//     persistAndLogin,
//     updateUser,
//     logout,
//   };
// };

// hooks/useAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCredentials,
  clearCredentials,
  selectIsAuthenticated,
  selectCurrentUser,
} from '@/store/slices/authSlice';
import { SignInResponse } from '@/store/api/authApi';
import { baseApi } from '@/store/api/baseApi';
import { signOutFromGoogle } from '@/hooks/useGoogleAuth'; // ✅ added
import Purchases from 'react-native-purchases';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  const rehydrate = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      const userRaw = await AsyncStorage.getItem('user');

      if (accessToken && userRaw) {
        const user = JSON.parse(userRaw);
        dispatch(setCredentials({ user, accessToken, refreshToken: refreshToken || '' }));

        // ✅ If onboarding not marked complete locally, re-check from API
        if (!user.onboarding_completed) {
          try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/profile`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            const profileData = await response.json();
            if (profileData?.onboarding?.onboarding_completed) {
              const updatedUser = { ...user, onboarding_completed: true };
              await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
              dispatch(
                setCredentials({ user: updatedUser, accessToken, refreshToken: refreshToken || '' })
              );
            }
          } catch {
            // Silent fail — use cached value
          }
        }
      }
    } catch {
      // Silent fail
    }
  };

  const persistAndLogin = async (data: SignInResponse) => {
    await AsyncStorage.multiSet([
      ['access_token', data.access_token],
      ['refresh_token', data.refresh_token],
      ['user', JSON.stringify(data.user)],
    ]);

    dispatch(
      setCredentials({
        user: data.user,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      })
    );

    if (!data.user.onboarding_completed) {
      // router.replace('/(questionnaire)/life-phase');
      router.replace('/(questionnaire)/personal-info');
    } else {
      router.replace('/(main)');
    }
  };

  const updateUser = async (updatedUser: Partial<typeof user>) => {
    try {
      const userRaw = await AsyncStorage.getItem('user');
      if (userRaw) {
        const existingUser = JSON.parse(userRaw);
        const merged = { ...existingUser, ...updatedUser };
        await AsyncStorage.setItem('user', JSON.stringify(merged));
        dispatch(
          setCredentials({
            user: merged,
            accessToken: (await AsyncStorage.getItem('access_token')) || '',
            refreshToken: (await AsyncStorage.getItem('refresh_token')) || '',
          })
        );
      }
    } catch {
      // Silent fail
    }
  };

  const logout = async () => {
    try {
      // ✅ Get refresh token before clearing storage
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      // ✅ Sign out from Google to clear cached account
      await signOutFromGoogle();
      await Purchases.logOut();

      // ✅ Call signout API — fire and forget, don't block logout on failure
      if (refreshToken) {
        try {
          await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/signout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await AsyncStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
        } catch {
          // API call failed — still proceed with local logout
        }
      }
    } finally {
      // ✅ Always clear local state regardless of API success/failure
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
      dispatch(clearCredentials());
      // ✅ Reset all RTK Query cache
      dispatch(baseApi.util.resetApiState());
      router.replace('/(onboarding)');
    }
  };

  return {
    isAuthenticated,
    user,
    rehydrate,
    persistAndLogin,
    updateUser,
    logout,
  };
};
