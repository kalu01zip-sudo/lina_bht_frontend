// import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter } from 'expo-router';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import { useToast } from '@/hooks/useToast';
// import PrimaryVariantButton from '@/components/buttons/PrimaryVariantButton';
// import { DateOfBirthPicker } from '@/components/ui/CustomDatePicker';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { EditInputRow } from '@/components/personalInfo/EditInputRow';
// import { AvatarCard } from '@/components/personalInfo/AvatarCard';
// import { PickerBottomSheet } from '@/components/personalInfo/PickerBottomSheet';
// import { genders, languages, countries } from '@/types/personalInfo';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// import { useGetProfileQuery, useEditProfileMutation } from '@/store/api/profileApi';
// import { useAuth } from '@/hooks/useAuth';
// import { extractApiError } from '@/utils/apiError';

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const getLabelForCode = (items: { id: string; label: string; value: string }[], code: string) =>
//   items.find((i) => i.value === code)?.label ?? '';

// // ─── Screen ───────────────────────────────────────────────────────────────────

// export default function EditPersonalInfoScreen() {
//   const router = useRouter();
//   const { showSuccess, showError } = useToast();
//   const { updateUser } = useAuth();

//   const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
//   const [editProfile, { isLoading: isSaving }] = useEditProfileMutation();

//   // Form state — store codes (e.g. "en", "US", "male") not display labels
//   const [fullName, setFullName] = useState('');

//   const [gender, setGender] = useState(''); // "male" | "female" | "other"
//   const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
//   const [language, setLanguage] = useState(''); // "en"
//   const [country, setCountry] = useState(''); // "US"
//   const [avatarUri, setAvatarUri] = useState<string | null>(null);
//   const [avatarChanged, setAvatarChanged] = useState(false);

//   const [showGenderPicker, setShowGenderPicker] = useState(false);
//   const [showLanguagePicker, setShowLanguagePicker] = useState(false);
//   const [showCountryPicker, setShowCountryPicker] = useState(false);

//   // Seed form once profile loads
//   // Replace your useEffect with this:
//   useEffect(() => {
//     if (!profile) return;
//     if (profile) {
//       console.log('[Profile] avatar_url from API:', profile.avatar_url);
//     }

//     setFullName(profile.full_name ?? '');
//     setGender(profile.gender ?? '');
//     setLanguage(profile.language ?? '');
//     setCountry(profile.country ?? '');
//     // Only seed avatarUri from API — don't fall back to hardcoded here
//     // so we can tell the difference between "no avatar" and "not loaded yet"
//     setAvatarUri(profile.avatar_url ?? null);
//     setAvatarChanged(false); // reset dirty flag on fresh load
//     if (profile.date_of_birth) {
//       setDateOfBirth(new Date(profile.date_of_birth));
//     }
//   }, [profile]);

//   const handleAvatarChange = (uri: string) => {
//     setAvatarUri(uri);
//     setAvatarChanged(true);
//   };

//   const handleSave = async () => {
//     if (!fullName.trim()) {
//       showError('Please enter your name');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('full_name', fullName.trim());
//     formData.append('gender', gender);
//     formData.append('language', language);
//     formData.append('country', country);

//     if (dateOfBirth) {
//       formData.append('date_of_birth', dateOfBirth.toISOString().split('T')[0]);
//     }

//     if (avatarChanged && avatarUri) {
//       const filename = avatarUri.split('/').pop() ?? 'avatar.jpg';
//       const match = /\.(\w+)$/.exec(filename);
//       const type = match ? `image/${match[1]}` : 'image/jpeg';
//       formData.append('avatar', { uri: avatarUri, name: filename, type } as any);
//     }

//     try {
//       const updated = await editProfile(formData).unwrap();

//       // Sync Redux/AsyncStorage with the URL the server actually stored
//       await updateUser({
//         full_name: updated.full_name,
//         avatar_url: updated.avatar_url, // use server response, not local state
//       });

//       // Update local state with server-confirmed URL so view is correct if
//       // RTK Query cache hasn't propagated yet
//       setAvatarUri(updated.avatar_url ?? null);
//       setAvatarChanged(false);

//       showSuccess('Personal information updated successfully');
//       router.back();
//     } catch (error: any) {
//       showError(extractApiError(error, 'Failed to update. Please try again.'));
//     }
//   };

//   // ── Loading / Error states ────────────────────────────────────────────────

//   if (isLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Preparing edit form..." />
//       </SafeAreaView>
//     );
//   }

//   if (isError || !profile) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Edit Personal Info" height={50} backButton={true} />
//         <ErrorScreen message="Failed to load profile." onRetry={refetch} />
//       </SafeAreaView>
//     );
//   }

//   // ── Derived display labels for pickers ────────────────────────────────────

//   const genderLabel = getLabelForCode(genders, gender) || 'Select gender';
//   const languageLabel = getLabelForCode(languages, language) || 'Select language';
//   const countryLabel = getLabelForCode(countries, country) || 'Select country';

//   const cardStyle = {
//     paddingVertical: 10,
//     paddingHorizontal: 24,
//     backgroundColor: '#F0E6D8',
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//     marginTop: 8,
//   };

//   // ── Render ────────────────────────────────────────────────────────────────

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Edit Personal Info" height={50} backButton={true} />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 24,
//           flexGrow: 1,
//         }}
//         className="flex-1">
//         <View className="px-container">
//           <AvatarCard isEditing={true} avatarUrl={avatarUri} onAvatarChange={handleAvatarChange} />
//           <View className="mt-2" />

//           {/* Full Name */}
//           <EditInputRow label="Full Name" value={fullName} onChangeText={setFullName} />

//           {/* Email — read-only */}
//           <BorderlessShadowCard b_tl={0} b_tr={0} b_bl={0} b_br={0} style={cardStyle}>
//             <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
//               Email Address
//             </Text>
//             <Text className="mt-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//               {profile.email}
//             </Text>
//           </BorderlessShadowCard>

//           {/* Gender */}
//           <BorderlessShadowCard b_tl={0} b_tr={0} b_bl={0} b_br={0} style={cardStyle}>
//             <TouchableOpacity onPress={() => setShowGenderPicker(true)}>
//               <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
//                 Gender
//               </Text>
//               <Text className="mt-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//                 {genderLabel}
//               </Text>
//             </TouchableOpacity>
//           </BorderlessShadowCard>

//           {/* Date of Birth */}
//           <BorderlessShadowCard
//             b_tl={0}
//             b_tr={0}
//             b_bl={0}
//             b_br={0}
//             style={{ ...cardStyle, paddingVertical: 8 }}>
//             <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
//               Date of Birth
//             </Text>
//             <DateOfBirthPicker
//               value={dateOfBirth}
//               onChange={setDateOfBirth}
//               maximumDate={new Date()}
//             />
//           </BorderlessShadowCard>

//           {/* Language */}
//           <BorderlessShadowCard b_tl={0} b_tr={0} b_bl={0} b_br={0} style={cardStyle}>
//             <TouchableOpacity onPress={() => setShowLanguagePicker(true)}>
//               <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
//                 Language
//               </Text>
//               <Text className="mt-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//                 {languageLabel}
//               </Text>
//             </TouchableOpacity>
//           </BorderlessShadowCard>

//           {/* Country */}
//           <BorderlessShadowCard b_tl={0} b_tr={0} b_bl={0} b_br={0} style={cardStyle}>
//             <TouchableOpacity onPress={() => setShowCountryPicker(true)}>
//               <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
//                 Country
//               </Text>
//               <Text className="mt-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//                 {countryLabel}
//               </Text>
//             </TouchableOpacity>
//           </BorderlessShadowCard>

//           <View className="mt-3">
//             <PrimaryVariantButton
//               title={isSaving ? 'Saving...' : 'Save Changes'}
//               onPress={handleSave}
//               disabled={isSaving}
//               isLoading={isSaving}
//               borderTopLeftRadius={0}
//               borderTopRightRadius={0}
//               borderBottomLeftRadius={24}
//               borderBottomRightRadius={24}
//             />
//           </View>
//         </View>
//       </ScrollView>

//       <PickerBottomSheet
//         visible={showGenderPicker}
//         onClose={() => setShowGenderPicker(false)}
//         title="Select Gender"
//         items={genders}
//         selectedValue={gender}
//         onSelect={(value) => {
//           setGender(value);
//           setShowGenderPicker(false);
//         }}
//       />

//       <PickerBottomSheet
//         visible={showLanguagePicker}
//         onClose={() => setShowLanguagePicker(false)}
//         title="Select Language"
//         items={languages}
//         selectedValue={language}
//         onSelect={(value) => {
//           setLanguage(value);
//           setShowLanguagePicker(false);
//         }}
//       />

//       <PickerBottomSheet
//         visible={showCountryPicker}
//         onClose={() => setShowCountryPicker(false)}
//         title="Select Country"
//         items={countries}
//         selectedValue={country}
//         onSelect={(value) => {
//           setCountry(value);
//           setShowCountryPicker(false);
//         }}
//       />
//     </SafeAreaView>
//   );
// }

// app/(flow)/settings/personal-info/edit.tsx  (or wherever this screen lives)
import { ScrollView, View, Text, TouchableOpacity, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { useToast } from '@/hooks/useToast';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PrimaryVariantButton from '@/components/buttons/PrimaryVariantButton';
import { DateOfBirthPicker } from '@/components/ui/CustomDatePicker';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { EditInputRow } from '@/components/personalInfo/EditInputRow';
import { AvatarCard } from '@/components/personalInfo/AvatarCard';
import { PickerBottomSheet } from '@/components/personalInfo/PickerBottomSheet';
import { genders, languages, countries } from '@/types/personalInfo';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useGetProfileQuery, useEditProfileMutation } from '@/store/api/profileApi';
import { useAuth } from '@/hooks/useAuth';
import { extractApiError } from '@/utils/apiError';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getLabelForCode = (items: { id: string; label: string; value: string }[], code: string) =>
  items.find((i) => i.value === code)?.label ?? '';

/**
 * Normalises a photo URI so it always works with FormData on both platforms.
 *
 * Problems this fixes:
 *  - iOS camera returns `ph://` asset-library URIs which crash FormData
 *  - Some pickers return URIs without a file extension
 *  - `file://` prefix is sometimes missing on Android
 */
const normaliseAvatarUri = (uri: string): string => {
  if (!uri) return uri;

  // ph:// is an iOS Photos framework URI — it cannot be read by the network
  // layer directly. expo-image-picker already copies these to a temp path,
  // but some older setups / camera implementations still return ph://.
  // If we somehow get one, we can't fix it here — the picker itself must be
  // configured to copy the asset. Log a warning so it's easy to find.
  if (uri.startsWith('ph://')) {
    console.warn(
      '[Avatar] Received a ph:// URI — ensure your image picker has copyToCacheDirectory: true'
    );
    return uri;
  }

  // On Android, URIs from the camera roll sometimes lack the file:// prefix.
  if (
    Platform.OS === 'android' &&
    !uri.startsWith('file://') &&
    !uri.startsWith('content://') &&
    !uri.startsWith('http')
  ) {
    return `file://${uri}`;
  }

  return uri;
};

/**
 * Derives a safe filename + MIME type from a URI.
 *
 * Falls back to jpeg if nothing can be inferred (camera photos on some
 * Android devices have no extension in their URI).
 */
const getImageFileMeta = (uri: string): { filename: string; mimeType: string } => {
  // Strip query params / fragments before grabbing the extension
  const clean = uri.split('?')[0].split('#')[0];
  const lastSegment = clean.split('/').pop() ?? '';
  const extMatch = /\.(\w+)$/.exec(lastSegment);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';

  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    heic: 'image/heic',
    heif: 'image/heif',
  };

  const mimeType = mimeMap[ext] ?? 'image/jpeg';
  // Always use .jpg as the filename extension so the server doesn't choke on
  // uncommon formats like heic when the MIME is image/jpeg after conversion.
  const filename = lastSegment || `avatar_${Date.now()}.jpg`;

  return { filename, mimeType };
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EditPersonalInfoScreen() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { updateUser } = useAuth();

  const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
  const [editProfile, { isLoading: isSaving }] = useEditProfileMutation();

  // Form state — store codes ("en", "US", "male") not display labels
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [language, setLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);

  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Seed form once profile loads
  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? '');
    setGender(profile.gender ?? '');
    setLanguage(profile.language ?? '');
    setCountry(profile.country ?? '');
    setAvatarUri(profile.avatar_url ?? null);
    setAvatarChanged(false);
    if (profile.date_of_birth) {
      // Parse without timezone shift: "1989-12-31" → local midnight
      const [year, month, day] = profile.date_of_birth.split('-').map(Number);
      setDateOfBirth(new Date(year, month - 1, day));
    }
  }, [profile]);

  const handleAvatarChange = (uri: string) => {
    const normalised = normaliseAvatarUri(uri);
    console.log('[Avatar] original URI:', uri);
    console.log('[Avatar] normalised URI:', normalised);
    setAvatarUri(normalised);
    setAvatarChanged(true);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      showError('Please enter your name');
      return;
    }

    const formData = new FormData();
    formData.append('full_name', fullName.trim());
    formData.append('gender', gender);
    formData.append('language', language);
    formData.append('country', country);

    if (dateOfBirth) {
      // Format as YYYY-MM-DD without timezone conversion
      const y = dateOfBirth.getFullYear();
      const m = String(dateOfBirth.getMonth() + 1).padStart(2, '0');
      const d = String(dateOfBirth.getDate()).padStart(2, '0');
      formData.append('date_of_birth', `${y}-${m}-${d}`);
    }

    if (avatarChanged && avatarUri) {
      const { filename, mimeType } = getImageFileMeta(avatarUri);
      console.log('[Avatar] appending to FormData:', { uri: avatarUri, filename, mimeType });

      // React Native FormData requires this exact shape — do NOT spread or
      // use a plain object variable, some RN versions lose the type field.
      formData.append('avatar', {
        uri: avatarUri,
        name: filename,
        type: mimeType,
      } as any);
    }

    try {
      const updated = await editProfile(formData).unwrap();

      await updateUser({
        full_name: updated.full_name,
        avatar_url: updated.avatar_url,
      });

      // Update local state with the server-confirmed URL so the view is
      // correct even before the RTK Query cache propagates.
      setAvatarUri(updated.avatar_url ?? null);
      setAvatarChanged(false);

      showSuccess('Personal information updated successfully');
      router.back();
    } catch (error: any) {
      console.error('[EditProfile] save error:', error);

      // Surface a helpful message for the most common avatar failure
      const isNetworkError = !error?.status && !error?.data;
      const detail = error?.data?.detail || error?.data?.message;

      if (avatarChanged && (isNetworkError || error?.status === 400)) {
        showError(
          detail || 'Failed to upload photo. Try choosing a different image and saving again.'
        );
      } else {
        showError(extractApiError(error, 'Failed to update. Please try again.'));
      }
    }
  };

  // ── Loading / Error states ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Preparing edit form..." />
      </SafeAreaView>
    );
  }

  if (isError || !profile) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Edit Personal Info" height={50} backButton={true} />
        <ErrorScreen message="Failed to load profile." onRetry={refetch} />
      </SafeAreaView>
    );
  }

  // ── Derived display labels ────────────────────────────────────────────────

  const genderLabel = getLabelForCode(genders, gender) || 'Select gender';
  const languageLabel = getLabelForCode(languages, language) || 'Select language';
  const countryLabel = getLabelForCode(countries, country) || 'Select country';

  const cardStyle = {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#F0E6D8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginTop: 8,
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Edit Personal Info" height={50} backButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 24,
          flexGrow: 1,
        }}
        className="flex-1">
        <View className="px-container">
          <AvatarCard isEditing={true} avatarUrl={avatarUri} onAvatarChange={handleAvatarChange} />
          <View className="mt-2" />

          {/* Full Name */}
          <EditInputRow label="Full Name" value={fullName} onChangeText={setFullName} />

          {/* Email — read-only */}
          <BorderlessShadowCard b_tl={0} b_tr={0} b_bl={0} b_br={0} style={cardStyle}>
            <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
              Email Address
            </Text>
            <Text className="mt-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              {profile.email}
            </Text>
          </BorderlessShadowCard>

          {/* Gender */}
          <BorderlessShadowCard b_tl={0} b_tr={0} b_bl={0} b_br={0} style={cardStyle}>
            <TouchableOpacity onPress={() => setShowGenderPicker(true)}>
              <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
                Gender
              </Text>
              <Text className="mt-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
                {genderLabel}
              </Text>
            </TouchableOpacity>
          </BorderlessShadowCard>

          {/* Date of Birth */}
          <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={0}
            b_br={0}
            style={{ ...cardStyle, paddingVertical: 8 }}>
            <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
              Date of Birth
            </Text>
            <DateOfBirthPicker
              value={dateOfBirth}
              onChange={setDateOfBirth}
              maximumDate={new Date()}
            />
          </BorderlessShadowCard>

          {/* Language */}
          <BorderlessShadowCard b_tl={0} b_tr={0} b_bl={0} b_br={0} style={cardStyle}>
            <TouchableOpacity onPress={() => setShowLanguagePicker(true)}>
              <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
                Language
              </Text>
              <Text className="mt-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
                {languageLabel}
              </Text>
            </TouchableOpacity>
          </BorderlessShadowCard>

          {/* Country */}
          <BorderlessShadowCard b_tl={0} b_tr={0} b_bl={0} b_br={0} style={cardStyle}>
            <TouchableOpacity onPress={() => setShowCountryPicker(true)}>
              <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
                Country
              </Text>
              <Text className="mt-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
                {countryLabel}
              </Text>
            </TouchableOpacity>
          </BorderlessShadowCard>

          <View className="mt-3">
            <PrimaryVariantButton
              title={isSaving ? 'Saving...' : 'Save Changes'}
              onPress={handleSave}
              disabled={isSaving}
              isLoading={isSaving}
              borderTopLeftRadius={0}
              borderTopRightRadius={0}
              borderBottomLeftRadius={24}
              borderBottomRightRadius={24}
            />
          </View>
        </View>
      </ScrollView>

      <PickerBottomSheet
        visible={showGenderPicker}
        onClose={() => setShowGenderPicker(false)}
        title="Select Gender"
        items={genders}
        selectedValue={gender}
        onSelect={(value) => {
          setGender(value);
          setShowGenderPicker(false);
        }}
      />

      <PickerBottomSheet
        visible={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
        title="Select Language"
        items={languages}
        selectedValue={language}
        onSelect={(value) => {
          setLanguage(value);
          setShowLanguagePicker(false);
        }}
      />

      <PickerBottomSheet
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        title="Select Country"
        items={countries}
        selectedValue={country}
        onSelect={(value) => {
          setCountry(value);
          setShowCountryPicker(false);
        }}
      />
    </SafeAreaView>
  );
}
