// types/notification.ts
export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'scan' | 'routine' | 'product' | 'promotion' | 'system' | 'danger';
  severity?: 'low' | 'medium' | 'high';
  image?: string;
}

export const getIconName = (type: string): string => {
  switch (type) {
    case 'scan':
      return 'camera-outline';
    case 'routine':
      return 'calendar-outline';
    case 'product':
      return 'cube-outline';
    case 'promotion':
      return 'pricetag-outline';
    case 'danger':
      return 'alert-circle';
    default:
      return 'notifications-outline';
  }
};

export const getIconColor = (type: string): string => {
  switch (type) {
    case 'scan':
      return '#3B82F6';
    case 'routine':
      return '#10B981';
    case 'product':
      return '#8B5CF6';
    case 'promotion':
      return '#F59E0B';
    case 'danger':
      return '#EF4444';
    default:
      return '#7A8B6A';
  }
};

export const getSeverityColor = (severity?: string): string => {
  switch (severity) {
    case 'high':
      return '#DC2626';
    case 'medium':
      return '#F59E0B';
    case 'low':
      return '#FBBF24';
    default:
      return '#EF4444';
  }
};
