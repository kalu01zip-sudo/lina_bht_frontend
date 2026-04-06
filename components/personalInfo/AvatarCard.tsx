// // components/personalInfo/AvatarCard.tsx
// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { Avatar } from '@/components/ui/Avatar';

// interface AvatarCardProps {
//   isEditing: boolean;
//   onPress: () => void;
// }

// export const AvatarCard: React.FC<AvatarCardProps> = ({ isEditing, onPress }) => (
//   <BorderlessShadowCard
//     style={{
//       paddingVertical: 24,
//       paddingHorizontal: 24,
//       alignItems: 'center',
//     }}>
//     <TouchableOpacity onPress={onPress} disabled={!isEditing} activeOpacity={0.7}>
//       <View
//         style={{
//           shadowColor: '#000',
//           shadowOffset: { width: 4, height: 5 },
//           shadowOpacity: 0.2,
//           shadowRadius: 8,
//           elevation: 8,
//           borderRadius: 999,
//           borderWidth: 2,
//           borderColor: '#759A52',
//         }}>
//         <Avatar
//           source="https://randomuser.me/api/portraits/women/64.jpg"
//           size={102}
//           fallbackIcon="person-circle"
//           iconColor="#361A0D"
//           backgroundColor="#E5E0D8"
//         />
//       </View>
//       {isEditing && (
//         <View className="absolute bottom-0 right-0 rounded-full bg-[#7A8B6A] p-2">
//           <Ionicons name="camera" size={14} color="#FFFFFF" />
//         </View>
//       )}
//     </TouchableOpacity>
//     <Text className="mt-3 font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
//       {isEditing ? 'Tap to change photo' : 'Upload Photo'}
//     </Text>
//   </BorderlessShadowCard>
// );

// components/personalInfo/AvatarCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/hooks/useToast';

interface AvatarCardProps {
  isEditing: boolean;
  avatarUrl?: string;
  onAvatarChange?: (uri: string) => void;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({
  isEditing,
  avatarUrl = 'https://randomuser.me/api/portraits/women/64.jpg',
  onAvatarChange,
}) => {
  const [imageUri, setImageUri] = useState(avatarUrl);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        showError('Permission needed', 'Please grant camera roll permission to change photo');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedUri = result.assets[0].uri;
        setImageUri(selectedUri);
        onAvatarChange?.(selectedUri);
        showSuccess('Photo updated successfully');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showError('Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        showError('Permission needed', 'Please grant camera permission to take a photo');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedUri = result.assets[0].uri;
        setImageUri(selectedUri);
        onAvatarChange?.(selectedUri);
        showSuccess('Photo updated successfully');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      showError('Failed to take photo');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handlePress = () => {
    if (isEditing) {
      showImageOptions();
    }
  };

  return (
    <BorderlessShadowCard
      style={{
        paddingVertical: 24,
        paddingHorizontal: 24,
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={handlePress} disabled={!isEditing} activeOpacity={0.7}>
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 4, height: 5 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: '#759A52',
          }}>
          <Avatar
            source={imageUri}
            size={102}
            fallbackIcon="person-circle"
            iconColor="#361A0D"
            backgroundColor="#E5E0D8"
          />
          {isLoading && (
            <View className="absolute inset-0 items-center justify-center rounded-full bg-black/50">
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}
        </View>
        {isEditing && (
          <View className="absolute bottom-0 right-0 rounded-full bg-[#7A8B6A] p-2">
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
      <Text className="mt-3 font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
        {isEditing ? 'Tap to change photo' : 'Upload Photo'}
      </Text>
    </BorderlessShadowCard>
  );
};
