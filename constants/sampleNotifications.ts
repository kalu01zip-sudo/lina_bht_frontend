// constants/sampleNotifications.ts
import { Notification } from '@/types/notification';

export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Scan Complete!',
    message: 'Your skin analysis is ready. Check out your results now!',
    time: '5 min ago',
    read: false,
    type: 'scan',
  },
  {
    id: '2',
    title: 'Morning Routine Reminder',
    message: "Don't forget to complete your morning skincare routine ✨",
    time: '1 hour ago',
    read: false,
    type: 'routine',
  },
  {
    id: '3',
    title: 'Product Mismatch Alert',
    message:
      'The salicylic acid serum you added may irritate your sensitive skin. Consider switching to a gentler alternative.',
    time: '2 hours ago',
    read: false,
    type: 'danger',
    severity: 'high',
  },
  {
    id: '4',
    title: 'New Product Match',
    message: 'We found a new serum that matches your skin needs!',
    time: '3 hours ago',
    read: true,
    type: 'product',
  },
  {
    id: '5',
    title: 'Weekly Progress Report',
    message: 'You completed 5 out of 7 routines this week! Keep it up! 🎉',
    time: 'Yesterday',
    read: true,
    type: 'system',
  },
  {
    id: '6',
    title: 'Special Offer',
    message: 'Get 20% off on all premium products this week!',
    time: 'Yesterday',
    read: true,
    type: 'promotion',
  },
  {
    id: '7',
    title: 'Skin Reaction Detected',
    message:
      'Your recent scan shows signs of increased redness and irritation. Consider taking a break from active ingredients.',
    time: '2 days ago',
    read: true,
    type: 'danger',
    severity: 'medium',
  },
  {
    id: '8',
    title: 'Hair Scan Available',
    message: 'New hair & scalp analysis feature is now available!',
    time: '2 days ago',
    read: true,
    type: 'scan',
  },
];
