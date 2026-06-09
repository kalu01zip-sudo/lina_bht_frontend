// app/(flow)/routines/routine-check.tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomHeader from '@/components/header/CustomHeader';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { LAYOUT } from '@/constants/constants';
import { useCheckRoutineMutation } from '@/store/api/routineCheckApi';
import type {
  RoutineConflict,
  RoutineAllergyIssue,
  RoutinePregnancyIssue,
  RoutineBudgetAnalysis,
} from '@/store/api/routineCheckApi';

// ── Helpers ───────────────────────────────────────────────────────────────────

const severityColor = (s: string): string => {
  switch (s.toLowerCase()) {
    case 'high':
      return '#EF4444';
    case 'medium':
      return '#F59E0B';
    default:
      return '#3B82F6';
  }
};

const severityBg = (s: string): string => {
  switch (s.toLowerCase()) {
    case 'high':
      return '#FEF2F2';
    case 'medium':
      return '#FFFBEB';
    default:
      return '#EFF6FF';
  }
};

const severityLabel = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionHeader = ({
  icon,
  title,
  count,
  accent,
}: {
  icon: string;
  title: string;
  count?: number;
  accent: string;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
    <View
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: accent + '18',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Ionicons name={icon as any} size={18} color={accent} />
    </View>
    <Text style={{ flex: 1, fontFamily: 'Outfit-Medium', fontSize: 16, color: '#2E2117' }}>
      {title}
    </Text>
    {count !== undefined && (
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 100,
          backgroundColor: count === 0 ? '#10B98118' : '#EF444418',
        }}>
        <Text
          style={{
            fontFamily: 'Outfit-Medium',
            fontSize: 12,
            color: count === 0 ? '#10B981' : '#EF4444',
          }}>
          {count === 0 ? 'Clear' : count}
        </Text>
      </View>
    )}
  </View>
);

const EmptyState = ({ message }: { message: string }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 4,
    }}>
    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
    <Text style={{ fontFamily: 'Outfit-Regular', fontSize: 14, color: '#10B981' }}>{message}</Text>
  </View>
);

const ConflictCard = ({ item }: { item: RoutineConflict }) => (
  <View
    style={{
      backgroundColor: severityBg(item.severity),
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderLeftWidth: 3,
      borderLeftColor: severityColor(item.severity),
    }}>
    {/* Severity badge */}
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 100,
          backgroundColor: severityColor(item.severity) + '22',
        }}>
        <Text
          style={{
            fontFamily: 'Outfit-Medium',
            fontSize: 11,
            color: severityColor(item.severity),
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
          {severityLabel(item.severity)} severity
        </Text>
      </View>
    </View>

    {/* Products involved */}
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      <Text
        style={{ flex: 1, fontFamily: 'Outfit-Medium', fontSize: 13, color: '#2E2117' }}
        numberOfLines={2}>
        {item.product_a}
      </Text>
      <Ionicons name="swap-horizontal" size={14} color="#2E211766" />
      <Text
        style={{ flex: 1, fontFamily: 'Outfit-Medium', fontSize: 13, color: '#2E2117' }}
        numberOfLines={2}>
        {item.product_b}
      </Text>
    </View>

    {/* Reason */}
    <Text
      style={{ fontFamily: 'Outfit-Regular', fontSize: 13, color: '#2E2117CC', lineHeight: 19 }}>
      {item.reason}
    </Text>
  </View>
);

const IssueCard = ({
  product,
  detail,
  note,
}: {
  product: string;
  detail: string;
  note: string;
}) => (
  <View
    style={{
      backgroundColor: '#FFF7ED',
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderLeftWidth: 3,
      borderLeftColor: '#F59E0B',
    }}>
    <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 13, color: '#2E2117', marginBottom: 4 }}>
      {product}
    </Text>
    <Text
      style={{
        fontFamily: 'Outfit-Medium',
        fontSize: 12,
        color: '#F59E0B',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      }}>
      {detail}
    </Text>
    <Text
      style={{ fontFamily: 'Outfit-Regular', fontSize: 13, color: '#2E2117CC', lineHeight: 19 }}>
      {note}
    </Text>
  </View>
);

const BudgetCard = ({ data }: { data: RoutineBudgetAnalysis }) => {
  const isOk = data.is_within_budget;
  const accent = isOk ? '#10B981' : '#EF4444';
  const bg = isOk ? '#F0FDF4' : '#FEF2F2';

  return (
    <View style={{ backgroundColor: bg, borderRadius: 16, padding: 16 }}>
      {/* Total cost row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
        <View>
          <Text style={{ fontFamily: 'Outfit-Regular', fontSize: 12, color: '#2E211788' }}>
            Total estimated cost
          </Text>
          <Text
            style={{ fontFamily: 'Outfit-Medium', fontSize: 28, color: '#2E2117', marginTop: 2 }}>
            ${data.total_estimated_cost.toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: accent + '18',
          }}>
          <Ionicons name={isOk ? 'checkmark-circle' : 'close-circle'} size={32} color={accent} />
        </View>
      </View>

      {/* Budget tier pill */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginBottom: 10,
        }}>
        <Ionicons name="wallet-outline" size={14} color="#2E211777" />
        <Text style={{ fontFamily: 'Outfit-Regular', fontSize: 12, color: '#2E211799' }}>
          Budget tier:{'  '}
          <Text style={{ fontFamily: 'Outfit-Medium', color: '#2E2117' }}>
            {data.user_budget_tier.charAt(0).toUpperCase() + data.user_budget_tier.slice(1)}
          </Text>
        </Text>

        <View
          style={{
            marginLeft: 'auto',
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 100,
            backgroundColor: accent + '18',
          }}>
          <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 11, color: accent }}>
            {isOk ? 'Within budget' : 'Over budget'}
          </Text>
        </View>
      </View>

      {/* Feedback */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: accent + '22',
          paddingTop: 10,
        }}>
        <Text
          style={{
            fontFamily: 'Outfit-Regular',
            fontSize: 13,
            color: '#2E2117CC',
            lineHeight: 20,
          }}>
          {data.feedback}
        </Text>
      </View>
    </View>
  );
};

// ── Main screen ───────────────────────────────────────────────────────────────

const RoutineCheckScreen = () => {
  const router = useRouter();
  const [checkRoutine, { data, isLoading, isError, error }] = useCheckRoutineMutation();

  // Fire the check on mount
  useEffect(() => {
    checkRoutine();
  }, []);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Routine Check" height={50} backButton />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <ActivityIndicator size="large" color="#977857" />
          <Text style={{ fontFamily: 'Outfit-Regular', fontSize: 14, color: '#2E211799' }}>
            Analysing your routine...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (isError || !data) {
    const msg =
      (error as any)?.data?.message ??
      (error as any)?.message ??
      'Could not check your routine. Please try again.';

    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Routine Check" height={50} backButton />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
            gap: 16,
          }}>
          <Ionicons name="alert-circle-outline" size={52} color="#EF4444" />
          <Text
            style={{
              fontFamily: 'Outfit-Medium',
              fontSize: 16,
              color: '#2E2117',
              textAlign: 'center',
            }}>
            {msg}
          </Text>
          <TouchableOpacity
            onPress={() => checkRoutine()}
            style={{
              backgroundColor: '#361A0D',
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 32,
            }}>
            <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 14, color: '#FFFFFF' }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Happy path ──────────────────────────────────────────────────────────────
  const totalIssues =
    data.conflicts.length + data.allergy_issues.length + data.pregnancy_issues.length;

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Routine Check" height={50} backButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 16,
        }}
        className="flex-1">
        <View className="px-container" style={{ gap: 16 }}>
          {/* ── Overall summary banner ──────────────────────────────────── */}
          <View
            style={{
              borderRadius: 20,
              backgroundColor: totalIssues === 0 ? '#F0FDF4' : '#FFFBEB',
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              borderTopWidth: 1.5,
              borderTopColor: totalIssues === 0 ? '#10B98133' : '#F59E0B33',
            }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: totalIssues === 0 ? '#10B98120' : '#F59E0B20',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons
                name={totalIssues === 0 ? 'shield-checkmark' : 'warning'}
                size={24}
                color={totalIssues === 0 ? '#10B981' : '#F59E0B'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, color: '#2E2117' }}>
                {totalIssues === 0
                  ? 'Your routine looks great!'
                  : `${totalIssues} issue${totalIssues > 1 ? 's' : ''} detected`}
              </Text>
              <Text
                style={{
                  fontFamily: 'Outfit-Regular',
                  fontSize: 13,
                  color: '#2E211799',
                  marginTop: 2,
                }}>
                {totalIssues === 0
                  ? 'No conflicts or concerns found in your current routine.'
                  : 'Review the details below to optimise your routine.'}
              </Text>
            </View>
          </View>

          {/* ── Conflicts ───────────────────────────────────────────────── */}
          <BorderlessShadowCard style={{ paddingVertical: 18, paddingHorizontal: 20 }}>
            <SectionHeader
              icon="git-compare-outline"
              title="Product Conflicts"
              count={data.conflicts.length}
              accent="#EF4444"
            />
            {data.conflicts.length === 0 ? (
              <EmptyState message="No conflicts found between your products." />
            ) : (
              data.conflicts.map((item, i) => <ConflictCard key={i} item={item} />)
            )}
          </BorderlessShadowCard>

          {/* ── Allergy issues ───────────────────────────────────────────── */}
          <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={0}
            b_br={0}
            style={{ paddingVertical: 18, paddingHorizontal: 20 }}>
            <SectionHeader
              icon="medical-outline"
              title="Allergy Concerns"
              count={data.allergy_issues.length}
              accent="#F59E0B"
            />
            {data.allergy_issues.length === 0 ? (
              <EmptyState message="No allergy concerns detected." />
            ) : (
              data.allergy_issues.map((item, i) => (
                <IssueCard key={i} product={item.product} detail={item.allergen} note={item.note} />
              ))
            )}
          </BorderlessShadowCard>

          {/* ── Pregnancy issues ─────────────────────────────────────────── */}
          <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={24}
            b_br={24}
            style={{ paddingVertical: 18, paddingHorizontal: 20 }}>
            <SectionHeader
              icon="heart-outline"
              title="Pregnancy Safety"
              count={data.pregnancy_issues.length}
              accent="#A78BFA"
            />
            {data.pregnancy_issues.length === 0 ? (
              <EmptyState message="No pregnancy concerns detected." />
            ) : (
              data.pregnancy_issues.map((item, i) => (
                <IssueCard
                  key={i}
                  product={item.product}
                  detail={item.ingredient}
                  note={item.note}
                />
              ))
            )}
          </BorderlessShadowCard>

          {/* ── Budget analysis ──────────────────────────────────────────── */}
          <BorderlessShadowCard
            b_tl={24}
            b_tr={24}
            b_bl={24}
            b_br={24}
            style={{ paddingVertical: 18, paddingHorizontal: 20 }}>
            <SectionHeader icon="pricetag-outline" title="Budget Analysis" accent="#977857" />
            <BudgetCard data={data.budget_analysis} />
          </BorderlessShadowCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RoutineCheckScreen;
