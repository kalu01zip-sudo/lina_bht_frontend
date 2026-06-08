// components/scans/MultiAngleCameraScan.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { saveFaceScanCaptures } from '@/utils/storage';
import { PreScanInstructions } from '@/components/scans/PreScanInstructions';

import { SunIcon, ManBottomLessIcon, SquareFrameIcon } from '@/components/icons';
import { useToast } from '@/hooks/useToast';

const { width, height } = Dimensions.get('window');

// ─── UI Colors ────────────────────────────────────────────────────────────────
const GREEN = '#8FB87A';
const GREEN_DIM = 'rgba(143,184,122,0.25)';
const GREEN_BORDER = 'rgba(143,184,122,0.5)';
const WHITE_GLASS = 'rgba(255,255,255,0.15)';
const WHITE_GLASS_BORDER = 'rgba(255,255,255,0.2)';

// ─── Timing Constants (in milliseconds) ───────────────────────────────────────
const PRE_COUNTDOWN_DELAY_MS = 1000; // How long to hold steady before countdown (2 seconds)
const COUNTDOWN_DURATION = 4; // Countdown seconds (5 seconds)
const CAPTURE_DELAY_MS = 1000; // Delay between angle captures (2 seconds)

export interface AngleCapture {
  angle: 'front' | 'left' | 'right' | 'up' | 'down';
  uri: string;
  timestamp: number;
}

interface MultiAngleCameraScanProps {
  scanType: string;
  onComplete?: (captures: AngleCapture[]) => void;
  onAngleCaptured?: (angle: string, index: number, total: number) => void;
  requiredAngles?: ('front' | 'left' | 'right' | 'up' | 'down')[];
  autoCapture?: boolean;
}

const ANGLE_CONFIG = {
  front: { label: 'Front', instruction: 'Look straight ahead' },
  left: { label: 'Left', instruction: 'Turn your head to the left' },
  right: { label: 'Right', instruction: 'Turn your head to the right' },
  up: { label: 'Up', instruction: 'Tilt your head up' },
  down: { label: 'Down', instruction: 'Tilt your head down' },
};

const CORNER_SIZE = 0;
const CORNER_THICKNESS = 0;
const CORNER_RADIUS = 4;

export const MultiAngleCameraScan: React.FC<MultiAngleCameraScanProps> = ({
  scanType,
  onComplete,
  onAngleCaptured,
  requiredAngles = ['front', 'left', 'right', 'up', 'down'],
  autoCapture = true,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [showInstructions, setShowInstructions] = useState(true);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0);
  const [capturedAngles, setCapturedAngles] = useState<AngleCapture[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [flashOpacity] = useState(new Animated.Value(0));
  const [isPreCountdown, setIsPreCountdown] = useState(false);
  const [preCountdownProgress, setPreCountdownProgress] = useState(0);

  const { showError, showSuccess } = useToast();

  const cameraRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const preCountdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preCountdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  const currentAngle = requiredAngles[currentAngleIndex];
  const currentConfig = ANGLE_CONFIG[currentAngle];
  const progress = (capturedAngles.length / requiredAngles.length) * 100;
  const isComplete = capturedAngles.length === requiredAngles.length;

  const guideWidth = width * 0.72;
  const guideHeight = height * 0.44;
  const ovalRadius = guideWidth / 2;

  // ─── Flash animation ─────────────────────────────────────────────────────────
  const animateFlash = () => {
    flashOpacity.setValue(0.7);
    Animated.timing(flashOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  // ─── Scan line animation ──────────────────────────────────────────────────────
  const startScanLine = () => {
    scanLineAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // ─── Pulse animation ──────────────────────────────────────────────────────────
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.015,
          duration: 1600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startPulseAnimation();
    startScanLine();
    return () => {
      pulseAnim.stopAnimation();
      scanLineAnim.stopAnimation();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (preCountdownTimerRef.current) clearTimeout(preCountdownTimerRef.current);
      if (preCountdownIntervalRef.current) clearInterval(preCountdownIntervalRef.current);
    };
  }, []);

  // ─── Debug log ────────────────────────────────────────────────────────────────
  useEffect(() => {
    console.log('📊 State Update:', {
      captured: capturedAngles.length,
      total: requiredAngles.length,
      isComplete,
      hasNavigated,
      currentAngle,
    });
  }, [capturedAngles, isComplete, hasNavigated, currentAngle]);

  // ─── Navigate when complete ───────────────────────────────────────────────────
  useEffect(() => {
    if (isComplete && capturedAngles.length > 0 && !hasNavigated) {
      console.log('🎉 ALL ANGLES CAPTURED! Navigating now...');
      setHasNavigated(true);
      const sessionId = Date.now().toString();
      const capturesToStore = capturedAngles.map((c) => ({
        angle: c.angle,
        uri: c.uri,
        timestamp: c.timestamp,
      }));
      const saveCaptures = async () => {
        const saved = await saveFaceScanCaptures(sessionId, capturesToStore);
        if (saved) {
          router.replace({
            pathname: '/(flow)/face-scan/loading-screen',
            params: { sessionId, scanType },
          });
        } else {
          showError('Failed to save captures. Please try again.');
        }
      };
      saveCaptures();
    }
  }, [isComplete, capturedAngles, hasNavigated, scanType]);

  // ─── Countdown function ───────────────────────────────────────────────────────
  const startCountdown = React.useCallback(() => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    let count = COUNTDOWN_DURATION;
    setCountdown(count);
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count < 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        if (!isTakingPicture && !isComplete) takePicture();
      }
    }, 1000);
    countdownTimerRef.current = timer;
  }, [isTakingPicture, isComplete]);

  // ─── Pre-countdown delay before countdown starts ──────────────────────────────
  const startPreCountdown = React.useCallback(() => {
    if (preCountdownTimerRef.current) clearTimeout(preCountdownTimerRef.current);
    if (preCountdownIntervalRef.current) clearInterval(preCountdownIntervalRef.current);

    setIsPreCountdown(true);
    setPreCountdownProgress(0);

    const startTime = Date.now();

    // Animate progress
    preCountdownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressValue = Math.min(elapsed / PRE_COUNTDOWN_DELAY_MS, 1);
      setPreCountdownProgress(progressValue);

      if (elapsed >= PRE_COUNTDOWN_DELAY_MS) {
        if (preCountdownIntervalRef.current) clearInterval(preCountdownIntervalRef.current);
        if (preCountdownTimerRef.current) clearTimeout(preCountdownTimerRef.current);
        setIsPreCountdown(false);
        setPreCountdownProgress(0);
        startCountdown();
      }
    }, 50);

    preCountdownTimerRef.current = setTimeout(() => {
      if (preCountdownIntervalRef.current) clearInterval(preCountdownIntervalRef.current);
      setIsPreCountdown(false);
      setPreCountdownProgress(0);
      startCountdown();
    }, PRE_COUNTDOWN_DELAY_MS);
  }, [startCountdown]);

  // ─── Take picture ─────────────────────────────────────────────────────────────
  const takePicture = React.useCallback(async () => {
    console.log('📸 Auto-capturing for angle:', currentAngle);
    if (!cameraRef.current || isTakingPicture || !currentAngle || isComplete) {
      console.log('❌ Cannot take picture');
      return;
    }
    setIsTakingPicture(true);
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (preCountdownTimerRef.current) {
      clearTimeout(preCountdownTimerRef.current);
      preCountdownTimerRef.current = null;
    }
    if (preCountdownIntervalRef.current) {
      clearInterval(preCountdownIntervalRef.current);
      preCountdownIntervalRef.current = null;
    }
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: false });
      console.log('✅ Picture captured for:', currentAngle);
      animateFlash();
      const newCapture: AngleCapture = {
        angle: currentAngle,
        uri: photo.uri,
        timestamp: Date.now(),
      };
      const updatedCaptures = [...capturedAngles, newCapture];
      setCapturedAngles(updatedCaptures);

      // Show checkmark animation
      checkmarkAnim.setValue(0);
      Animated.spring(checkmarkAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
      setTimeout(() => checkmarkAnim.setValue(0), 600);

      onAngleCaptured?.(currentAngle, currentAngleIndex + 1, requiredAngles.length);

      if (currentAngleIndex + 1 < requiredAngles.length) {
        console.log(`➡️ Moving to next angle in ${CAPTURE_DELAY_MS / 1000} seconds...`);

        // Reset pre-countdown state
        setIsPreCountdown(false);
        setPreCountdownProgress(0);

        // Delay before moving to next angle
        setTimeout(() => {
          setCurrentAngleIndex(currentAngleIndex + 1);
          setIsTakingPicture(false);
          setCountdown(null);
        }, CAPTURE_DELAY_MS);
      } else {
        console.log('🏁 Last angle captured!');
        setIsTakingPicture(false);
        setCountdown(null);
        setIsPreCountdown(false);
        setPreCountdownProgress(0);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      // Alert.alert('Error', 'Failed to capture image. Please try again.');
      showError('Failed to capture image. Please try again.');

      setIsTakingPicture(false);
    }
  }, [
    cameraRef,
    isTakingPicture,
    currentAngle,
    isComplete,
    capturedAngles,
    currentAngleIndex,
    onAngleCaptured,
    requiredAngles,
  ]);

  // ─── Auto-trigger pre-countdown when angle changes ───────────────────────────
  useEffect(() => {
    if (
      autoCapture &&
      currentAngle &&
      !isTakingPicture &&
      !isComplete &&
      capturedAngles.length === currentAngleIndex
    ) {
      startPreCountdown();
    }
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (preCountdownTimerRef.current) clearTimeout(preCountdownTimerRef.current);
      if (preCountdownIntervalRef.current) clearInterval(preCountdownIntervalRef.current);
    };
  }, [
    currentAngleIndex,
    currentAngle,
    isComplete,
    isTakingPicture,
    capturedAngles.length,
    autoCapture,
    startPreCountdown,
  ]);

  // ─── Retake last angle ───────────────────────────────────────────────────────
  const retakeLastAngle = () => {
    if (capturedAngles.length > 0 && !isComplete) {
      console.log('🔄 Retaking last angle...');
      const newCaptures = capturedAngles.slice(0, -1);
      setCapturedAngles(newCaptures);
      setCurrentAngleIndex(newCaptures.length);
      setCountdown(null);
      setHasNavigated(false);
      setIsPreCountdown(false);
      setPreCountdownProgress(0);
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      if (preCountdownTimerRef.current) {
        clearTimeout(preCountdownTimerRef.current);
        preCountdownTimerRef.current = null;
      }
      if (preCountdownIntervalRef.current) {
        clearInterval(preCountdownIntervalRef.current);
        preCountdownIntervalRef.current = null;
      }
    }
  };

  const faceScanSteps = [
    {
      id: 'lighting',
      icon: <SunIcon size={24} color="#F59E0B" />,
      title: 'Good Lighting',
      description: 'Find a well-lit area, preferably natural daylight facing a window.',
    },
    {
      id: 'clear_face',
      icon: <ManBottomLessIcon size={24} color="#3B82F6" />,
      title: 'Clear Face',
      description: 'Remove makeup, glasses, and pull hair back from your face.',
    },
    {
      id: 'positioning',
      icon: <SquareFrameIcon size={24} color="#7A8B6A" />,
      title: 'Positioning',
      description: 'Hold phone at eye level, about 30cm away. Fill the oval frame.',
    },
  ];

  if (showInstructions) {
    return (
      <PreScanInstructions
        onStart={() => setShowInstructions(false)}
        title="For best results, follow these steps :"
        headerTitle="Face Scan Instructions"
        subTitle="For personalized face and skin analysis"
        videoSource={require('@/assets/videos/face_scan_guide.mp4')}
        instructionSteps={faceScanSteps}
        startButtonTitle="Start Scan"
      />
    );
  }

  // ─── Pre-scan instructions ────────────────────────────────────────────────────
  // if (showInstructions) {
  //   return <PreScanInstructions onStart={() => setShowInstructions(false)} />;
  // }

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIconWrap}>
            <Ionicons name="camera-outline" size={32} color={GREEN} />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionSub}>
            We need camera access to capture your face scan for AI analysis.
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={styles.permissionBtn}
            activeOpacity={0.8}>
            <Text style={styles.permissionBtnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Scan line Y interpolation inside the oval
  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [guideHeight * 0.1, guideHeight * 0.82],
  });

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#111' }}>
      {/* Camera */}
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="front" />

      {/* Flash overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { backgroundColor: 'white', opacity: flashOpacity }]}
        pointerEvents="none"
      />

      {/* ── Top HUD ── */}
      <View
        style={{
          position: 'absolute',
          top: Math.max(insets.top, 16),
          left: 16,
          right: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}>
        {/* Left: back + retake grouped */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
            activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Retake pill — only appears after at least one capture */}
          {!isComplete && capturedAngles.length > 0 && (
            <TouchableOpacity
              onPress={retakeLastAngle}
              activeOpacity={0.8}
              style={styles.retakeBtn}>
              <Ionicons name="refresh" size={13} color="rgba(255,255,255,0.85)" />
              <Text style={styles.retakeBtnText}>Retake</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right: step counter */}
        <View style={styles.stepPill}>
          <Text style={styles.stepPillText}>
            {capturedAngles.length} / {requiredAngles.length}
          </Text>
        </View>
      </View>

      {/* ── Progress bar + dots ── */}
      <View
        style={{
          position: 'absolute',
          top: Math.max(insets.top + 52, 68),
          left: 20,
          right: 20,
          zIndex: 20,
        }}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
        </View>
        <View style={styles.dotsRow}>
          {requiredAngles.map((angle, idx) => {
            const isDone = idx < capturedAngles.length;
            const isActive = idx === capturedAngles.length && !isComplete;
            return (
              <View
                key={angle}
                style={[
                  styles.dot,
                  isDone && styles.dotDone,
                  isActive && styles.dotActive,
                  !isDone && !isActive && styles.dotPending,
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* ── Face guide oval ── */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            style={{
              width: guideWidth,
              height: guideHeight,
              transform: [{ scale: pulseAnim }],
            }}>
            {/* Oval border */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: ovalRadius,
                borderWidth: isComplete ? 2.5 : 2,
                borderColor: isComplete ? GREEN : 'rgba(143,184,122,0.55)',
                backgroundColor: isComplete ? 'rgba(143,184,122,0.10)' : 'rgba(143,184,122,0.05)',
              }}
            />

            {/* Corner brackets */}
            <View
              style={[
                styles.corner,
                {
                  top: 20,
                  left: 20,
                  borderTopWidth: CORNER_THICKNESS,
                  borderLeftWidth: CORNER_THICKNESS,
                  borderTopLeftRadius: CORNER_RADIUS,
                },
              ]}
            />
            <View
              style={[
                styles.corner,
                {
                  top: 20,
                  right: 20,
                  borderTopWidth: CORNER_THICKNESS,
                  borderRightWidth: CORNER_THICKNESS,
                  borderTopRightRadius: CORNER_RADIUS,
                },
              ]}
            />
            <View
              style={[
                styles.corner,
                {
                  bottom: 20,
                  left: 20,
                  borderBottomWidth: CORNER_THICKNESS,
                  borderLeftWidth: CORNER_THICKNESS,
                  borderBottomLeftRadius: CORNER_RADIUS,
                },
              ]}
            />
            <View
              style={[
                styles.corner,
                {
                  bottom: 20,
                  right: 20,
                  borderBottomWidth: CORNER_THICKNESS,
                  borderRightWidth: CORNER_THICKNESS,
                  borderBottomRightRadius: CORNER_RADIUS,
                },
              ]}
            />

            {/* Pre-countdown progress ring */}
            {!isComplete &&
              isPreCountdown &&
              preCountdownProgress > 0 &&
              preCountdownProgress < 1 && (
                <View style={styles.preCountdownOverlay}>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      borderWidth: 3,
                      borderColor: GREEN,
                      opacity: 0.5,
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 80,
                        height: 80 * preCountdownProgress,
                        borderRadius: 40,
                        backgroundColor: GREEN,
                        opacity: 0.15,
                        overflow: 'hidden',
                      }}
                    />
                  </View>
                  <Text style={styles.preCountdownText}>Hold steady...</Text>
                </View>
              )}

            {/* Countdown */}
            {!isComplete && countdown !== null && countdown >= 0 && !isPreCountdown && (
              <View style={styles.countdownInsideOval}>
                <Text style={styles.countdownInsideText}>{countdown}</Text>
              </View>
            )}

            {/* Complete checkmark */}
            {isComplete && (
              <View style={styles.completeOverlay}>
                <View style={styles.completeCircle}>
                  <Ionicons name="checkmark" size={36} color={GREEN} />
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </View>

      {/* ── "Captured" badge ── */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: height / 2 - guideHeight / 2 - 20,
          left: 0,
          right: 0,
          alignItems: 'center',
          opacity: checkmarkAnim,
          transform: [{ scale: checkmarkAnim }],
          zIndex: 30,
        }}>
        <View style={styles.capturedBadge}>
          <Ionicons name="checkmark" size={14} color="#fff" />
          <Text style={styles.capturedBadgeText}>Captured</Text>
        </View>
      </Animated.View>

      {/* ── Bottom bar ── */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 20) },
          isComplete && styles.bottomBarComplete,
        ]}>
        {!isComplete ? (
          <>
            <View className="mb-5 flex items-center justify-center">
              <View style={styles.angleTagRow}>
                <View style={styles.angleTag}>
                  <Text style={styles.angleTagText}>{currentConfig?.label ?? currentAngle}</Text>
                </View>
                <Text style={styles.stepSubText}>
                  Step {currentAngleIndex + 1} of {requiredAngles.length}
                </Text>
              </View>
              <Text style={styles.instructionMain} numberOfLines={1} adjustsFontSizeToFit>
                {currentConfig?.instruction ?? 'Position your face'}
              </Text>
              <Text style={styles.instructionSub}>Hold steady — photo captures automatically</Text>
            </View>
          </>
        ) : (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <Ionicons name="checkmark-circle" size={18} color={GREEN} />
              <Text style={[styles.instructionMain, { color: GREEN }]}>All angles captured</Text>
            </View>
            <Text style={styles.instructionSub}>Sending to AI for analysis...</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ── Permission screen ──────────────────────────────────────────────────────
  permissionContainer: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  permissionIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(143,184,122,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(143,184,122,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionBtn: {
    backgroundColor: '#8FB87A',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  permissionBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Top HUD ───────────────────────────────────────────────────────────────
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WHITE_GLASS,
    borderWidth: 0.5,
    borderColor: WHITE_GLASS_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: WHITE_GLASS,
    borderWidth: 0.5,
    borderColor: WHITE_GLASS_BORDER,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  retakeBtnText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '500',
  },
  stepPill: {
    backgroundColor: WHITE_GLASS,
    borderWidth: 0.5,
    borderColor: WHITE_GLASS_BORDER,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  stepPillText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },

  // ── Progress ──────────────────────────────────────────────────────────────
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: '#8FB87A',
    borderRadius: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotDone: { backgroundColor: '#8FB87A' },
  dotActive: { backgroundColor: '#fff' },
  dotPending: { backgroundColor: 'rgba(255,255,255,0.22)' },

  // ── Corner brackets ───────────────────────────────────────────────────────
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#8FB87A',
  },

  // ── Pre-countdown overlay ─────────────────────────────────────────────────
  preCountdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preCountdownText: {
    marginTop: 90,
    color: GREEN,
    fontSize: 12,
    fontWeight: '500',
  },

  // ── Countdown inside oval ─────────────────────────────────────────────────
  countdownInsideOval: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownInsideText: {
    fontSize: 96,
    fontWeight: '100',
    color: 'rgba(255,255,255,0.22)',
    lineHeight: 100,
    includeFontPadding: false,
  },

  // ── Complete overlay ──────────────────────────────────────────────────────
  completeOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(143,184,122,0.18)',
    borderWidth: 2,
    borderColor: '#8FB87A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Captured badge ────────────────────────────────────────────────────────
  capturedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#8FB87A',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  capturedBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },

  // ── Bottom bar ────────────────────────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 120,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 0.5,
    borderColor: WHITE_GLASS_BORDER,
    paddingTop: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 20,
  },
  bottomBarComplete: {
    backgroundColor: 'rgba(20,40,20,0.7)',
    borderColor: GREEN_BORDER,
  },
  angleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  angleTag: {
    backgroundColor: GREEN_DIM,
    borderWidth: 0.5,
    borderColor: GREEN_BORDER,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  angleTagText: {
    color: '#8FB87A',
    fontSize: 11,
    fontWeight: '600',
  },
  stepSubText: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 11,
  },
  instructionMain: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 6,
  },
  instructionSub: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MultiAngleCameraScan;
