import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import TextBodySmall from '../texts/TextBodySmall';
import HeaderPrimary from '../texts/HeaderPrimary';

// ✅ NEW import
import NotificationBellIconWithBg from '../icons/modified/NotificationBellIconWithBg';

type HomeHeaderProps = {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  backButton?: boolean;
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
  backIconSize?: number;
  backIconColor?: string;
  needPaddingX?: boolean;

  // ✅ NEW prop
  notificationCount?: number;
};

const HomeHeader: React.FC<HomeHeaderProps> = ({
  title,
  subtitle,
  backgroundColor = '#E8DDD0',
  backButton = true,
  height = 65,
  paddingTop = 0,
  paddingBottom = 0,
  backIconSize = 24,
  backIconColor = '#111827',
  needPaddingX = true,
  notificationCount = 0, // default
}) => {
  const router = useRouter();

  return (
    <View
      className={`${needPaddingX ? 'px-container' : ''}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop,
        paddingBottom,
        backgroundColor,
        height,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
      }}>
      {/* 🔙 Back Button */}
      {backButton && (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 0 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <LinearGradient
            colors={['#2B7FFF1A', '#2B7FFF1A', '#2B7FFF1A', '#2B7FFF1A']}
            locations={[0.03, 0.7, 1, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 43,
              height: 43,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 23,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name="arrow-back" size={backIconSize} color={backIconColor} />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* 🧠 Title + Notification */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {/* 📝 Title Section */}
        <View>
          <HeaderPrimary
            text={title}
            numberOfLines={1}
            style={{ textAlign: 'left', width: '100%' }}
          />

          {subtitle && (
            <TextBodySmall
              text={subtitle}
              style={{ textAlign: 'left', fontSize: 16, color: '#361A0DCC', width: '100%' }}
            />
          )}
        </View>

        {/* 🔔 Notification Bell */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/(flow)/notification')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <NotificationBellIconWithBg
            size={50}
            iconSize={20}
            color="#361A0D"
            badgeCount={notificationCount}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
