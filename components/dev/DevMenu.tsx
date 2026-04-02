// components/dev/DevMenu.tsx (without haptics)
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface DevMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const DevMenu: React.FC<DevMenuProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleClose = () => {
    bottomSheetRef.current?.close();
    setTimeout(onClose, 300);
  };

  const resetOnboarding = async () => {
    console.log('Reset Onboarding pressed');
    try {
      await AsyncStorage.removeItem('hasSeenOnboarding');
      await AsyncStorage.setItem('forceOnboarding', 'true');
      console.log('Onboarding reset, force flag set');
      handleClose();
      setTimeout(() => {
        router.replace('/(onboarding)');
      }, 300);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      Alert.alert('Error', 'Failed to reset onboarding');
    }
  };

  const clearAllData = async () => {
    console.log('Clear All Data pressed');
    try {
      await AsyncStorage.clear();
      console.log('All AsyncStorage data cleared');
      handleClose();
      setTimeout(() => {
        router.replace('/(onboarding)');
      }, 300);
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  const simulateAuthenticated = async () => {
    console.log('Simulate Authenticated pressed');
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      await AsyncStorage.setItem('userToken', 'fake-token');
      console.log('Auth simulated, token set');
      handleClose();
      setTimeout(() => {
        router.replace('/(main)');
      }, 300);
    } catch (error) {
      console.error('Error simulating auth:', error);
      Alert.alert('Error', 'Failed to simulate authentication');
    }
  };

  if (!__DEV__) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['50%']}
      enablePanDownToClose
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior="close"
        />
      )}
      onClose={onClose}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.bottomSheetBackground}>
      <BottomSheetView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <LinearGradient
              colors={['#FF6B35', '#FF8C42']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientIcon}>
              <Ionicons name="code-slash" size={24} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Developer Menu</Text>
          <Text style={styles.subtitle}>Development Tools & Utilities</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {/* Reset Onboarding */}
          <TouchableOpacity
            onPress={resetOnboarding}
            activeOpacity={0.8}
            style={styles.actionButton}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}>
              <Ionicons name="refresh-circle" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Reset Onboarding</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Clear All Data */}
          <TouchableOpacity onPress={clearAllData} activeOpacity={0.8} style={styles.actionButton}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}>
              <Ionicons name="trash-bin" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Clear All Data</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Simulate Logged In */}
          <TouchableOpacity
            onPress={simulateAuthenticated}
            activeOpacity={0.8}
            style={styles.actionButton}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}>
              <Ionicons name="log-in" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Simulate Logged In</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity onPress={handleClose} activeOpacity={0.7} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Development Mode Only</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v1.0.0-dev</Text>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: '#D1D5DB',
    width: 40,
    height: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  headerIcon: {
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 22,
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: '#6B7280',
  },
  actionsContainer: {
    flex: 1,
    gap: 12,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonText: {
    flex: 1,
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  closeButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerText: {
    fontFamily: 'outfit',
    fontSize: 12,
    color: '#9CA3AF',
  },
  versionBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  versionText: {
    fontFamily: 'outfit-medium',
    fontSize: 10,
    color: '#6B7280',
  },
});
