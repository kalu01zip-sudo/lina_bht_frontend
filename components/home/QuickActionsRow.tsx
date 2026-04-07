// screens/home/components/QuickActionsRow.tsx (Simpler version)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import {
  ScanProductIcon,
  ScanSkinIcon,
  RoutineIcon,
  AiAssistantIcon,
  ArticleIcon,
} from '@/components/icons';
import { QuickAction } from '@/types/home';

interface QuickActionsRowProps {
  actions: QuickAction[];
  onActionPress: (actionTitle: string) => void;
  articleAction?: QuickAction;
}

const getQuickActionIcon = (iconName: string, size: number, color: string) => {
  switch (iconName) {
    case 'scan_skin':
      return <ScanSkinIcon size={size} color={color} />;
    case 'scan_product':
      return <ScanProductIcon size={size} color={color} />;
    case 'routine':
      return <RoutineIcon size={size} color={color} />;
    case 'ai_assistant':
      return <AiAssistantIcon size={size} color={color} />;
    case 'article':
      return <ArticleIcon size={size} color={color} />;
    default:
      return null;
  }
};

const ActionButton: React.FC<{ action: QuickAction; onPress: () => void }> = ({
  action,
  onPress,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getDisplayTitle = (title: string) => {
    switch (title) {
      case 'Face Scan':
      case 'Scan Skin':
        return 'Face Scan';
      case 'Hair & Scalp Scan':
      case 'Scan Hair':
        return 'Hair & Scalp';
      case 'Product Scan':
      case 'Scan Product':
        return 'Product Scan';
      case 'Routine':
      case 'My Routine':
        return 'My Routine';
      case 'AI Assistant':
        return 'AI Assistant';
      default:
        return title;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={{ flex: 1 }}>
      <BorderlessShadowCard
        b_bl={0}
        b_br={0}
        b_tl={0}
        b_tr={0}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isPressed ? '#E8DDD0' : '#F0E6D8',
          paddingHorizontal: 12,
          paddingVertical: 21,
        }}>
        <BorderlessShadowCard
          b_bl={12}
          b_br={12}
          b_tl={12}
          b_tr={12}
          style={{
            width: 56,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}>
          {getQuickActionIcon(action.icon, 26, '#361A0D')}
        </BorderlessShadowCard>
        <Text className="mt-3 font-outfitMedium text-[16px]">{getDisplayTitle(action.title)}</Text>
      </BorderlessShadowCard>
    </TouchableOpacity>
  );
};

const ArticleButton: React.FC<{ action: QuickAction; onPress: () => void }> = ({
  action,
  onPress,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={{ flex: 1 }}>
      <BorderlessShadowCard
        b_bl={24}
        b_br={24}
        b_tl={0}
        b_tr={0}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isPressed ? '#E8DDD0' : '#F0E6D8',
          paddingHorizontal: 12,
          paddingVertical: 21,
        }}>
        <BorderlessShadowCard
          b_bl={12}
          b_br={12}
          b_tl={12}
          b_tr={12}
          style={{
            width: 56,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}>
          <ArticleIcon size={26} color="#361A0D" />
        </BorderlessShadowCard>
        <Text className="mt-3 font-outfitMedium text-[16px]">Articles</Text>
      </BorderlessShadowCard>
    </TouchableOpacity>
  );
};

export const QuickActionsRow: React.FC<QuickActionsRowProps> = ({
  actions,
  onActionPress,
  articleAction,
}) => {
  const firstRow = actions.slice(0, 2);
  const secondRow = actions.slice(2, 4);

  return (
    <>
      <View className="mt-4 flex-row gap-4">
        {firstRow.map((action) => (
          <ActionButton
            key={action.id}
            action={action}
            onPress={() => onActionPress(action.title)}
          />
        ))}
      </View>

      <View className="mt-4 flex-row gap-4">
        {secondRow.map((action) => (
          <ActionButton
            key={action.id}
            action={action}
            onPress={() => onActionPress(action.title)}
          />
        ))}
      </View>

      {/* Article Button - Single row with rounded bottom corners */}
      <View className="mt-4">
        <ArticleButton
          action={articleAction || { id: 'article', title: 'Articles', icon: 'article' }}
          onPress={() => onActionPress('Articles')}
        />
      </View>
    </>
  );
};
