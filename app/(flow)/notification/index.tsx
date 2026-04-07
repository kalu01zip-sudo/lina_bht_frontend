// // // app/(flow)/notification/index.tsx
// // import {
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   RefreshControl,
// //   Alert,
// //   Modal,
// // } from 'react-native';
// // import React, { useState, useEffect } from 'react';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { Ionicons } from '@expo/vector-icons';
// // import CustomHeader from '@/components/header/CustomHeader';
// // import { LAYOUT } from '@/constants/constants';
// // import { useToast } from '@/hooks/useToast';
// // import { useRouter } from 'expo-router';
// // import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// // import { DangerIcon } from '@/components/icons';

// // interface Notification {
// //   id: string;
// //   title: string;
// //   message: string;
// //   time: string;
// //   read: boolean;
// //   type: 'scan' | 'routine' | 'product' | 'promotion' | 'system' | 'danger';
// //   severity?: 'low' | 'medium' | 'high';
// //   image?: string;
// // }

// // export default function NotificationScreen() {
// //   const router = useRouter();
// //   const { showSuccess } = useToast();
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [showClearConfirm, setShowClearConfirm] = useState(false);
// //   const [notifications, setNotifications] = useState<Notification[]>([
// //     {
// //       id: '1',
// //       title: 'Scan Complete!',
// //       message: 'Your skin analysis is ready. Check out your results now!',
// //       time: '5 min ago',
// //       read: false,
// //       type: 'scan',
// //     },
// //     {
// //       id: '2',
// //       title: 'Morning Routine Reminder',
// //       message: "Don't forget to complete your morning skincare routine ✨",
// //       time: '1 hour ago',
// //       read: false,
// //       type: 'routine',
// //     },
// //     {
// //       id: '3',
// //       title: '⚠️ Product Mismatch Alert',
// //       message:
// //         'The salicylic acid serum you added may irritate your sensitive skin. Consider switching to a gentler alternative.',
// //       time: '2 hours ago',
// //       read: false,
// //       type: 'danger',
// //       severity: 'high',
// //     },
// //     {
// //       id: '4',
// //       title: 'New Product Match',
// //       message: 'We found a new serum that matches your skin needs!',
// //       time: '3 hours ago',
// //       read: true,
// //       type: 'product',
// //     },
// //     {
// //       id: '5',
// //       title: 'Weekly Progress Report',
// //       message: 'You completed 5 out of 7 routines this week! Keep it up! 🎉',
// //       time: 'Yesterday',
// //       read: true,
// //       type: 'system',
// //     },
// //     {
// //       id: '6',
// //       title: 'Special Offer',
// //       message: 'Get 20% off on all premium products this week!',
// //       time: 'Yesterday',
// //       read: true,
// //       type: 'promotion',
// //     },
// //     {
// //       id: '7',
// //       title: '⚠️ Skin Reaction Detected',
// //       message:
// //         'Your recent scan shows signs of increased redness and irritation. Consider taking a break from active ingredients.',
// //       time: '2 days ago',
// //       read: true,
// //       type: 'danger',
// //       severity: 'medium',
// //     },
// //     {
// //       id: '8',
// //       title: 'Hair Scan Available',
// //       message: 'New hair & scalp analysis feature is now available!',
// //       time: '2 days ago',
// //       read: true,
// //       type: 'scan',
// //     },
// //   ]);

// //   const [unreadCount, setUnreadCount] = useState(0);
// //   const [dangerCount, setDangerCount] = useState(0);

// //   useEffect(() => {
// //     const count = notifications.filter((n) => !n.read).length;
// //     const danger = notifications.filter((n) => n.type === 'danger' && !n.read).length;
// //     setUnreadCount(count);
// //     setDangerCount(danger);
// //   }, [notifications]);

// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     setTimeout(() => {
// //       setRefreshing(false);
// //       showSuccess('Notifications refreshed');
// //     }, 1500);
// //   };

// //   const markAsRead = (id: string) => {
// //     setNotifications((prev) =>
// //       prev.map((notification) =>
// //         notification.id === id ? { ...notification, read: true } : notification
// //       )
// //     );
// //   };

// //   const markAllAsRead = () => {
// //     setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
// //     showSuccess('All notifications marked as read');
// //   };

// //   // Replace the clearAllNotifications function
// //   const clearAllNotifications = () => {
// //     setShowClearConfirm(true);
// //   };

// //   const confirmClearAll = () => {
// //     setNotifications([]);
// //     showSuccess('All notifications cleared');
// //     setShowClearConfirm(false);
// //   };

// //   const deleteNotification = (id: string) => {
// //     setNotifications((prev) => prev.filter((notification) => notification.id !== id));
// //     showSuccess('Notification deleted');
// //   };

// //   const handleNotificationPress = (notification: Notification) => {
// //     if (!notification.read) {
// //       markAsRead(notification.id);
// //     }

// //     // For danger alerts, show warning before proceeding
// //     if (notification.type === 'danger') {
// //       Alert.alert(
// //         '⚠️ Health Alert',
// //         notification.message,
// //         [
// //           { text: 'Dismiss', style: 'cancel' },
// //           { text: 'View Details', onPress: () => router.push('/(flow)/health-alert') },
// //         ],
// //         { cancelable: true }
// //       );
// //       return;
// //     }

// //     switch (notification.type) {
// //       case 'scan':
// //         router.push('/(flow)/face-scan/analysis-complete');
// //         break;
// //       case 'routine':
// //         router.push('/(flow)/face-scan/analysis-compatibility-check');
// //         break;
// //       case 'product':
// //         router.push('/(flow)/product-scan/analysis-complete');
// //         break;
// //       default:
// //         break;
// //     }
// //   };

// //   const getIconName = (type: string): string => {
// //     switch (type) {
// //       case 'scan':
// //         return 'camera-outline';
// //       case 'routine':
// //         return 'calendar-outline';
// //       case 'product':
// //         return 'cube-outline';
// //       case 'promotion':
// //         return 'pricetag-outline';
// //       case 'danger':
// //         return 'alert-circle';
// //       default:
// //         return 'notifications-outline';
// //     }
// //   };

// //   const getIconColor = (type: string): string => {
// //     switch (type) {
// //       case 'scan':
// //         return '#3B82F6';
// //       case 'routine':
// //         return '#10B981';
// //       case 'product':
// //         return '#8B5CF6';
// //       case 'promotion':
// //         return '#F59E0B';
// //       case 'danger':
// //         return '#EF4444';
// //       default:
// //         return '#7A8B6A';
// //     }
// //   };

// //   const getSeverityColor = (severity?: string): string => {
// //     switch (severity) {
// //       case 'high':
// //         return '#DC2626';
// //       case 'medium':
// //         return '#F59E0B';
// //       case 'low':
// //         return '#FBBF24';
// //       default:
// //         return '#EF4444';
// //     }
// //   };

// //   return (
// //     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
// //       <CustomHeader
// //         title="Notifications"
// //         height={50}
// //         backButton={true}
// //         rightIcon={
// //           notifications.length > 0 && (
// //             <TouchableOpacity onPress={markAllAsRead} className="mr-2">
// //               <Text className="font-outfitMedium text-[14px]" style={{ color: '#977857' }}>
// //                 Mark all read
// //               </Text>
// //             </TouchableOpacity>
// //           )
// //         }
// //       />

// //       <ScrollView
// //         showsVerticalScrollIndicator={false}
// //         contentContainerStyle={{
// //           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
// //           paddingTop: 10,
// //           flexGrow: 1,
// //         }}
// //         className="flex-1"
// //         refreshControl={
// //           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7A8B6A']} />
// //         }>
// //         {notifications.length === 0 ? (
// //           <View className="flex-1 items-center justify-center px-container pt-20">
// //             <View className="h-24 w-24 items-center justify-center rounded-full bg-[#F0E6D8]">
// //               <Ionicons name="notifications-off-outline" size={48} color="#2E211733" />
// //             </View>
// //             <Text className="mt-4 font-outfitMedium text-[18px]" style={{ color: '#2E2117' }}>
// //               No Notifications
// //             </Text>
// //             <Text
// //               className="mt-2 text-center font-outfit text-[14px]"
// //               style={{ color: '#2E211766' }}>
// //               You&apos;re all caught up! Check back later for updates.
// //             </Text>
// //           </View>
// //         ) : (
// //           <View className="px-container">
// //             {/* Danger Alert Banner */}
// //             {dangerCount > 0 && (
// //               <View className="mb-4 mt-2 flex-row items-center gap-2 rounded-xl bg-red-50 p-3">
// //                 <DangerIcon size={20} color="#DC2626" />
// //                 <Text className="flex-1 font-outfit text-[12px]" style={{ color: '#DC2626' }}>
// //                   You have {dangerCount} urgent health alert{dangerCount > 1 ? 's' : ''}
// //                 </Text>
// //               </View>
// //             )}

// //             {/* Unread Section Header */}
// //             {unreadCount > 0 && (
// //               <View className="mb-2 mt-2">
// //                 <Text className="font-outfitMedium text-[12px]" style={{ color: '#7A8B6A' }}>
// //                   NEW ({unreadCount})
// //                 </Text>
// //               </View>
// //             )}

// //             {/* Notifications List */}
// //             {notifications.map((notification, index) => (
// //               <TouchableOpacity
// //                 key={notification.id}
// //                 onPress={() => handleNotificationPress(notification)}
// //                 activeOpacity={0.7}>
// //                 <BorderlessShadowCard
// //                   b_tl={index === 0 ? 24 : 0}
// //                   b_tr={index === 0 ? 24 : 0}
// //                   b_bl={index === notifications.length - 1 ? 24 : 0}
// //                   b_br={index === notifications.length - 1 ? 24 : 0}
// //                   style={{
// //                     paddingVertical: 16,
// //                     paddingHorizontal: 24,
// //                     marginTop: index === 0 ? 0 : 1,
// //                     backgroundColor: notification.read ? '#F0E6D8' : '#FEF9E8',
// //                     marginBottom: 12,
// //                     borderLeftWidth: notification.type === 'danger' ? 4 : 0,
// //                     borderLeftColor:
// //                       notification.type === 'danger'
// //                         ? getSeverityColor(notification.severity)
// //                         : 'transparent',
// //                   }}>
// //                   <View className="flex-row items-start gap-3">
// //                     {/* Icon */}
// //                     {notification.type === 'danger' ? (
// //                       <DangerIcon size={20} color={getIconColor(notification.type)} />
// //                     ) : (
// //                       <Ionicons
// //                         name={getIconName(notification.type)}
// //                         size={20}
// //                         color={getIconColor(notification.type)}
// //                       />
// //                     )}

// //                     {/* Content */}
// //                     <View className="flex-1">
// //                       <View className="flex-row items-center justify-between">
// //                         <Text
// //                           className={`flex-1 font-outfitMedium text-[16px] ${
// //                             notification.read ? 'text-[#2E2117]' : 'text-[#2E2117]'
// //                           }`}>
// //                           {notification.title}
// //                         </Text>
// //                         {/* Unread Dot */}
// //                         {!notification.read && (
// //                           <View className="ml-2 h-2 w-2 rounded-full bg-[#EF4444]" />
// //                         )}
// //                       </View>

// //                       {/* Message */}
// //                       <Text
// //                         className="mt-[6px] font-outfit text-[12px]"
// //                         style={{ color: '#2E211766' }}>
// //                         {notification.message}
// //                       </Text>

// //                       {/* Time */}
// //                       <Text
// //                         className="mt-[6px] font-outfit text-[10px]"
// //                         style={{ color: '#2E211766' }}>
// //                         {notification.time}
// //                       </Text>
// //                     </View>

// //                     {/* Delete Button */}
// //                     <TouchableOpacity
// //                       onPress={() => deleteNotification(notification.id)}
// //                       className="p-1">
// //                       <Ionicons name="close" size={16} color="#2E211766" />
// //                     </TouchableOpacity>
// //                   </View>
// //                 </BorderlessShadowCard>
// //               </TouchableOpacity>
// //             ))}

// //             {/* Clear All Button - Centered at Bottom */}
// //             {notifications.length > 0 && (
// //               <TouchableOpacity
// //                 onPress={clearAllNotifications}
// //                 className="mb-8 mt-4 items-center justify-center py-3">
// //                 <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E211780' }}>
// //                   Clear All Notifications
// //                 </Text>
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         )}

// //         <Modal
// //           visible={showClearConfirm}
// //           transparent
// //           animationType="fade"
// //           onRequestClose={() => setShowClearConfirm(false)}>
// //           <View className="flex-1 items-center justify-center bg-black/50">
// //             <View className="mx-6 rounded-2xl bg-white p-6" style={{ width: '80%' }}>
// //               {/* Icon */}
// //               <View className="mb-4 items-center">
// //                 <View className="h-16 w-16 items-center justify-center rounded-full bg-red-100">
// //                   <Ionicons name="trash-outline" size={32} color="#EF4444" />
// //                 </View>
// //               </View>

// //               {/* Title */}
// //               <Text
// //                 className="font-outfitBold mb-2 text-center text-[20px]"
// //                 style={{ color: '#2E2117' }}>
// //                 Clear All Notifications
// //               </Text>

// //               {/* Message */}
// //               <Text
// //                 className="mb-6 text-center font-outfit text-[14px]"
// //                 style={{ color: '#2E211766' }}>
// //                 Are you sure you want to delete all notifications? This action cannot be undone.
// //               </Text>

// //               {/* Buttons */}
// //               <View className="flex-row gap-3">
// //                 <TouchableOpacity
// //                   onPress={() => setShowClearConfirm(false)}
// //                   className="flex-1 rounded-xl bg-gray-100 py-3">
// //                   <Text
// //                     className="text-center font-outfitMedium text-[14px]"
// //                     style={{ color: '#2E2117' }}>
// //                     Cancel
// //                   </Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   onPress={confirmClearAll}
// //                   className="flex-1 rounded-xl bg-red-500 py-3">
// //                   <Text className="text-center font-outfitMedium text-[14px] text-white">
// //                     Clear All
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </View>
// //         </Modal>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({});

// // app/(flow)/notification/index.tsx (updated)
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   RefreshControl,
//   Alert,
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import { useToast } from '@/hooks/useToast';
// import { useRouter } from 'expo-router';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { DangerIcon } from '@/components/icons';
// import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   time: string;
//   read: boolean;
//   type: 'scan' | 'routine' | 'product' | 'promotion' | 'system' | 'danger';
//   severity?: 'low' | 'medium' | 'high';
//   image?: string;
// }

// export default function NotificationScreen() {
//   const router = useRouter();
//   const { showSuccess } = useToast();
//   const [refreshing, setRefreshing] = useState(false);
//   const [showClearConfirm, setShowClearConfirm] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([
//     // ... your notifications array (same as before)
//     {
//       id: '1',
//       title: 'Scan Complete!',
//       message: 'Your skin analysis is ready. Check out your results now!',
//       time: '5 min ago',
//       read: false,
//       type: 'scan',
//     },
//     {
//       id: '2',
//       title: 'Morning Routine Reminder',
//       message: "Don't forget to complete your morning skincare routine ✨",
//       time: '1 hour ago',
//       read: false,
//       type: 'routine',
//     },
//     {
//       id: '3',
//       title: 'Product Mismatch Alert',
//       message:
//         'The salicylic acid serum you added may irritate your sensitive skin. Consider switching to a gentler alternative.',
//       time: '2 hours ago',
//       read: false,
//       type: 'danger',
//       severity: 'high',
//     },
//     {
//       id: '4',
//       title: 'New Product Match',
//       message: 'We found a new serum that matches your skin needs!',
//       time: '3 hours ago',
//       read: true,
//       type: 'product',
//     },
//     {
//       id: '5',
//       title: 'Weekly Progress Report',
//       message: 'You completed 5 out of 7 routines this week! Keep it up! 🎉',
//       time: 'Yesterday',
//       read: true,
//       type: 'system',
//     },
//     {
//       id: '6',
//       title: 'Special Offer',
//       message: 'Get 20% off on all premium products this week!',
//       time: 'Yesterday',
//       read: true,
//       type: 'promotion',
//     },
//     {
//       id: '7',
//       title: 'Skin Reaction Detected',
//       message:
//         'Your recent scan shows signs of increased redness and irritation. Consider taking a break from active ingredients.',
//       time: '2 days ago',
//       read: true,
//       type: 'danger',
//       severity: 'medium',
//     },
//     {
//       id: '8',
//       title: 'Hair Scan Available',
//       message: 'New hair & scalp analysis feature is now available!',
//       time: '2 days ago',
//       read: true,
//       type: 'scan',
//     },
//   ]);

//   const [unreadCount, setUnreadCount] = useState(0);
//   const [dangerCount, setDangerCount] = useState(0);

//   useEffect(() => {
//     const count = notifications.filter((n) => !n.read).length;
//     const danger = notifications.filter((n) => n.type === 'danger' && !n.read).length;
//     setUnreadCount(count);
//     setDangerCount(danger);
//   }, [notifications]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setRefreshing(false);
//       showSuccess('Notifications refreshed');
//     }, 1500);
//   };

//   const markAsRead = (id: string) => {
//     setNotifications((prev) =>
//       prev.map((notification) =>
//         notification.id === id ? { ...notification, read: true } : notification
//       )
//     );
//   };

//   const markAllAsRead = () => {
//     setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
//     showSuccess('All notifications marked as read');
//   };

//   const clearAllNotifications = () => {
//     setShowClearConfirm(true);
//   };

//   const confirmClearAll = () => {
//     setNotifications([]);
//     showSuccess('All notifications cleared');
//     setShowClearConfirm(false);
//   };

//   const deleteNotification = (id: string) => {
//     setNotifications((prev) => prev.filter((notification) => notification.id !== id));
//     showSuccess('Notification deleted');
//   };

//   const handleNotificationPress = (notification: Notification) => {
//     if (!notification.read) {
//       markAsRead(notification.id);
//     }

//     if (notification.type === 'danger') {
//       Alert.alert(
//         '⚠️ Health Alert',
//         notification.message,
//         [
//           { text: 'Dismiss', style: 'cancel' },
//           { text: 'View Details', onPress: () => router.push('/(flow)/health-alert') },
//         ],
//         { cancelable: true }
//       );
//       return;
//     }

//     switch (notification.type) {
//       case 'scan':
//         router.push('/(flow)/face-scan/analysis-complete');
//         break;
//       case 'routine':
//         router.push('/(flow)/face-scan/analysis-compatibility-check');
//         break;
//       case 'product':
//         router.push('/(flow)/product-scan/analysis-complete');
//         break;
//       default:
//         break;
//     }
//   };

//   const getIconName = (type: string): string => {
//     switch (type) {
//       case 'scan':
//         return 'camera-outline';
//       case 'routine':
//         return 'calendar-outline';
//       case 'product':
//         return 'cube-outline';
//       case 'promotion':
//         return 'pricetag-outline';
//       case 'danger':
//         return 'alert-circle';
//       default:
//         return 'notifications-outline';
//     }
//   };

//   const getIconColor = (type: string): string => {
//     switch (type) {
//       case 'scan':
//         return '#3B82F6';
//       case 'routine':
//         return '#10B981';
//       case 'product':
//         return '#8B5CF6';
//       case 'promotion':
//         return '#F59E0B';
//       case 'danger':
//         return '#EF4444';
//       default:
//         return '#7A8B6A';
//     }
//   };

//   const getSeverityColor = (severity?: string): string => {
//     switch (severity) {
//       case 'high':
//         return '#DC2626';
//       case 'medium':
//         return '#F59E0B';
//       case 'low':
//         return '#FBBF24';
//       default:
//         return '#EF4444';
//     }
//   };

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader
//         title="Notifications"
//         height={50}
//         backButton={true}
//         rightIcon={
//           notifications.length > 0 && (
//             <TouchableOpacity onPress={markAllAsRead} className="mr-2">
//               <Text className="font-outfitMedium text-[14px]" style={{ color: '#977857' }}>
//                 Mark all read
//               </Text>
//             </TouchableOpacity>
//           )
//         }
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 10,
//           flexGrow: 1,
//         }}
//         className="flex-1"
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7A8B6A']} />
//         }>
//         {notifications.length === 0 ? (
//           <View className="flex-1 items-center justify-center px-container pt-20">
//             <View className="h-24 w-24 items-center justify-center rounded-full bg-[#F0E6D8]">
//               <Ionicons name="notifications-off-outline" size={48} color="#2E211733" />
//             </View>
//             <Text className="mt-4 font-outfitMedium text-[18px]" style={{ color: '#2E2117' }}>
//               No Notifications
//             </Text>
//             <Text
//               className="mt-2 text-center font-outfit text-[14px]"
//               style={{ color: '#2E211766' }}>
//               You&apos;re all caught up! Check back later for updates.
//             </Text>
//           </View>
//         ) : (
//           <View className="px-container">
//             {/* Danger Alert Banner */}
//             {dangerCount > 0 && (
//               <View className="mb-4 mt-2 flex-row items-center gap-2 rounded-xl bg-red-50 p-3">
//                 <DangerIcon size={20} color="#DC2626" />
//                 <Text className="flex-1 font-outfit text-[12px]" style={{ color: '#DC2626' }}>
//                   You have {dangerCount} urgent health alert{dangerCount > 1 ? 's' : ''}
//                 </Text>
//               </View>
//             )}

//             {/* Unread Section Header */}
//             {unreadCount > 0 && (
//               <View className="mb-2 mt-2">
//                 <Text className="font-outfitMedium text-[12px]" style={{ color: '#7A8B6A' }}>
//                   NEW ({unreadCount})
//                 </Text>
//               </View>
//             )}

//             {/* Notifications List */}
//             {notifications.map((notification, index) => (
//               <TouchableOpacity
//                 key={notification.id}
//                 onPress={() => handleNotificationPress(notification)}
//                 activeOpacity={0.7}>
//                 <BorderlessShadowCard
//                   b_tl={index === 0 ? 24 : 0}
//                   b_tr={index === 0 ? 24 : 0}
//                   b_bl={index === notifications.length - 1 ? 24 : 0}
//                   b_br={index === notifications.length - 1 ? 24 : 0}
//                   style={{
//                     paddingVertical: 16,
//                     paddingHorizontal: 16,
//                     marginTop: index === 0 ? 0 : 1,
//                     backgroundColor: notification.read ? '#F0E6D8' : '#FEF9E8',
//                     marginBottom: 12,
//                     borderLeftWidth: notification.type === 'danger' ? 4 : 0,
//                     borderLeftColor:
//                       notification.type === 'danger'
//                         ? getSeverityColor(notification.severity)
//                         : 'transparent',
//                   }}>
//                   <View className="flex-row items-start gap-3">
//                     {/* Icon */}
//                     {notification.type === 'danger' ? (
//                       <DangerIcon size={20} color={getIconColor(notification.type)} />
//                     ) : (
//                       <Ionicons
//                         name={getIconName(notification.type)}
//                         size={20}
//                         color={getIconColor(notification.type)}
//                       />
//                     )}

//                     {/* Content */}
//                     <View className="flex-1">
//                       <View className="flex-row items-center justify-between">
//                         <Text
//                           className={`flex-1 font-outfitMedium text-[16px] ${
//                             notification.read ? 'text-[#2E2117]' : 'text-[#2E2117]'
//                           }`}>
//                           {notification.title}
//                         </Text>
//                         {/* {!notification.read && (
//                           <View className="ml-2 h-2 w-2 rounded-full bg-[#EF4444]" />
//                         )} */}
//                       </View>

//                       <Text
//                         className="mt-[6px] font-outfit text-[12px]"
//                         style={{ color: '#2E211766' }}>
//                         {notification.message}
//                       </Text>

//                       <Text
//                         className="mt-[6px] font-outfit text-[10px]"
//                         style={{ color: '#2E211766' }}>
//                         {notification.time}
//                       </Text>
//                     </View>

//                     <TouchableOpacity
//                       onPress={() => deleteNotification(notification.id)}
//                       className="p-1">
//                       <Ionicons name="close" size={16} color="#2E211766" />
//                     </TouchableOpacity>
//                   </View>
//                 </BorderlessShadowCard>
//               </TouchableOpacity>
//             ))}

//             {/* Clear All Button */}
//             {notifications.length > 0 && (
//               <TouchableOpacity
//                 onPress={clearAllNotifications}
//                 className="mb-8 mt-4 items-center justify-center py-3">
//                 <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E211780' }}>
//                   Clear All Notifications
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       </ScrollView>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         visible={showClearConfirm}
//         onClose={() => setShowClearConfirm(false)}
//         onConfirm={confirmClearAll}
//         title="Clear All Notifications"
//         message="Are you sure you want to delete all notifications? This action cannot be undone."
//         confirmText="Clear All"
//         cancelText="Cancel"
//         iconName="trash-outline"
//         iconColor="#EF4444"
//         confirmButtonColor="#EF4444"
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({});

// app/(flow)/notification/index.tsx
import { ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { useToast } from '@/hooks/useToast';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { DangerBanner } from '@/components/notifications/DangerBanner';
import { NotificationList } from '@/components/notifications/NotificationList';
import { EmptyState } from '@/components/notifications/EmptyState';
import { SAMPLE_NOTIFICATIONS } from '@/constants/sampleNotifications';
import { Notification } from '@/types/notification';

export default function NotificationScreen() {
  const router = useRouter();
  const { showSuccess } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dangerCount, setDangerCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    const danger = notifications.filter((n) => n.type === 'danger' && !n.read).length;
    setUnreadCount(count);
    setDangerCount(danger);
  }, [notifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showSuccess('Notifications refreshed');
    }, 1500);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    showSuccess('All notifications marked as read');
  };

  const clearAllNotifications = () => {
    setShowClearConfirm(true);
  };

  const confirmClearAll = () => {
    setNotifications([]);
    showSuccess('All notifications cleared');
    setShowClearConfirm(false);
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    showSuccess('Notification deleted');
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.type === 'danger') {
      Alert.alert(
        '⚠️ Health Alert',
        notification.message,
        [
          { text: 'Dismiss', style: 'cancel' },
          { text: 'View Details', onPress: () => router.push('/(flow)/health-alert') },
        ],
        { cancelable: true }
      );
      return;
    }

    switch (notification.type) {
      case 'scan':
        router.push('/(flow)/face-scan/analysis-complete');
        break;
      case 'routine':
        router.push('/(flow)/face-scan/analysis-compatibility-check');
        break;
      case 'product':
        router.push('/(flow)/product-scan/analysis-complete');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader
        title="Notifications"
        height={50}
        backButton={true}
        rightIcon={
          notifications.length > 0 && (
            <TouchableOpacity onPress={markAllAsRead} className="mr-2">
              <Text className="font-outfitMedium text-[14px]" style={{ color: '#977857' }}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 10,
          flexGrow: 1,
        }}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7A8B6A']} />
        }>
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <DangerBanner count={dangerCount} />
            <NotificationList
              notifications={notifications}
              unreadCount={unreadCount}
              onNotificationPress={handleNotificationPress}
              onDelete={deleteNotification}
            />
            {/* Clear All Button */}
            <TouchableOpacity
              onPress={clearAllNotifications}
              className="mb-8 mt-4 items-center justify-center py-3">
              <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E211780' }}>
                Clear All Notifications
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearAll}
        title="Clear All Notifications"
        message="Are you sure you want to delete all notifications? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        iconName="trash-outline"
        iconColor="#EF4444"
        confirmButtonColor="#EF4444"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
