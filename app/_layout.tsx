// import '../global.css';
// import { useEffect, useState } from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import Toast from 'react-native-toast-message';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import CustomSplashScreen from '@/components/CustomSplashScreen';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { Provider, useDispatch, useSelector } from 'react-redux';
// import { store } from '@/store/store';
// import { setCredentials, selectCurrentUser } from '@/store/slices/authSlice';

// import { useFontLoading } from '@/hooks/useFontLoading';
// import { toastConfig } from '@/config/toastConfig';
// import { configureGoogleSignIn } from '@/hooks/useGoogleAuth';
// import { useOneSignal } from '@/hooks/useOneSignal';

// SplashScreen.preventAutoHideAsync();

// // ✅ Configure Google Sign-In once at module load time (before any component renders)
// configureGoogleSignIn();

// // ✅ Rehydrates Redux state from AsyncStorage before any screen renders
// function AuthBootstrap({ children }: { children: React.ReactNode }) {
//   const dispatch = useDispatch();
//   const [bootstrapped, setBootstrapped] = useState(false);

//   useEffect(() => {
//     const run = async () => {
//       try {
//         const [[, accessToken], [, refreshToken], [, userRaw]] = await AsyncStorage.multiGet([
//           'access_token',
//           'refresh_token',
//           'user',
//         ]);

//         if (accessToken && userRaw) {
//           dispatch(
//             setCredentials({
//               user: JSON.parse(userRaw),
//               accessToken,
//               refreshToken: refreshToken || '',
//             })
//           );
//         }
//       } catch {
//         // Silent fail
//       } finally {
//         setBootstrapped(true);
//       }
//     };

//     run();
//   }, []);

//   if (!bootstrapped) return null;

//   return <>{children}</>;
// }

// const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
// const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

// export default function RootLayout() {
//   useOneSignal();

//   const fontsLoaded = useFontLoading();
//   const [isReady, setIsReady] = useState(false);
//   const [showSplash, setShowSplash] = useState(true);

//   useEffect(() => {
//     const prepare = async () => {
//       if (fontsLoaded && !showSplash) {
//         await new Promise((resolve) => setTimeout(resolve, 100));
//         setIsReady(true);
//         await SplashScreen.hideAsync();
//       }
//     };

//     prepare();
//   }, [fontsLoaded, showSplash]);

//   const handleSplashComplete = () => {
//     setShowSplash(false);
//   };

//   if (showSplash) {
//     return <CustomSplashScreen onAnimationComplete={handleSplashComplete} />;
//   }

//   if (!fontsLoaded || !isReady) {
//     return <LoadingScreen loadingText="The system is getting ready for you" transparent={false} />;
//   }

//   return (
//     <Provider store={store}>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <SafeAreaProvider>
//           {/* ✅ Rehydrate auth before rendering any screen */}
//           <AuthBootstrap>
//             <StatusBar style="dark" backgroundColor="#E8DDD0" translucent={false} />
//             <Stack
//               screenOptions={{
//                 headerShown: false,
//                 contentStyle: { backgroundColor: '#E8DDD0' },
//               }}>
//               <Stack.Screen name="index" options={{ animation: 'none' }} />
//               <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
//               <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
//               <Stack.Screen name="(questionnaire)" options={{ animation: 'slide_from_right' }} />
//               <Stack.Screen name="(main)" options={{ animation: 'fade' }} />
//               <Stack.Screen name="(flow)" options={{ animation: 'slide_from_right' }} />
//             </Stack>
//             <Toast config={toastConfig} />
//           </AuthBootstrap>
//         </SafeAreaProvider>
//       </GestureHandlerRootView>
//     </Provider>
//   );
// }

// app/_layout.tsx
import '../global.css';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import LoadingScreen from '@/components/loading/LoadingScreen';
import CustomSplashScreen from '@/components/CustomSplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '@/store/store';
import { setCredentials, selectCurrentUser } from '@/store/slices/authSlice';
import { useFontLoading } from '@/hooks/useFontLoading';
import { toastConfig } from '@/config/toastConfig';
import { configureGoogleSignIn } from '@/hooks/useGoogleAuth';
import { useOneSignal } from '@/hooks/useOneSignal';
import { RevenueCatInitializer } from '@/components/RevenueCatInitializer';

SplashScreen.preventAutoHideAsync();
configureGoogleSignIn();

// This component handles auth rehydration
function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const [[, accessToken], [, refreshToken], [, userRaw]] = await AsyncStorage.multiGet([
          'access_token',
          'refresh_token',
          'user',
        ]);

        if (accessToken && userRaw) {
          dispatch(
            setCredentials({
              user: JSON.parse(userRaw),
              accessToken,
              refreshToken: refreshToken || '',
            })
          );
        }
      } catch (error) {
        console.warn('Auth bootstrap error:', error);
      } finally {
        setBootstrapped(true);
      }
    };

    run();
  }, [dispatch]);

  if (!bootstrapped) return null;
  return <>{children}</>;
}

// This is the main app content (wrapped in Provider)
function AppContent() {
  const fontsLoaded = useFontLoading();
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  useOneSignal();

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded && !showSplash) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded, showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <CustomSplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  if (!fontsLoaded || !isReady) {
    return <LoadingScreen loadingText="The system is getting ready for you" transparent={false} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#E8DDD0" translucent={false} />
        <RevenueCatInitializer />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#E8DDD0' },
          }}>
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(questionnaire)" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="(main)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(flow)" options={{ animation: 'slide_from_right' }} />
        </Stack>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Root layout - Provider at the very top
export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthBootstrap>
        <AppContent />
      </AuthBootstrap>
    </Provider>
  );
}
