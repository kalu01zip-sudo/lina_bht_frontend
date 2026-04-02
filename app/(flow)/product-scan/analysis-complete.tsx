


// app/(flow)/face-scan/analysis-complete.tsx (Fixed scrolling)
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { IInCircleIcon } from '@/components/icons/IInCircleIcon';
import CircularProgress from '@/components/home/CircularProgress';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PillowBadge from '@/components/buttons/PillowBadge';
import { ArrowCircleDuetIcon, PlusIcon, SignInCuttedCircleIcon } from '@/components/icons';
import PrimaryVariantButton from '@/components/buttons/PrimaryVariantButton';
import { Ionicons } from '@expo/vector-icons';

const AiAnalysisCompleteScreen = () => {
    return (
        <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
            <CustomHeader title="Analysis Result" height={50} backButton />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
                    paddingTop: 10,
                    flexGrow: 1,
                }}
                className="flex-1"
            >
                <View className="px-container">
                    {/* Progress Card */}
                    <BorderlessShadowCard
                        style={{
                            paddingVertical: 24,
                            paddingHorizontal: 24,
                            alignItems: 'center',
                        }}
                    >
                        <PillowBadge title='Waxi Essentials' textStyle={{ color: '#361A0D', }} />
                        <Text className='font-outfitMedium text-[24px] my-3 ' style={{ color: "#2E2117" }}>Calm & Restore Serum</Text>
                        <View className='w-full h-[1px] bg-[#CAA78933] ' />

                        {/* <CircularProgress progress={78} /> */}
                        <View className='mt-6'>
                            <Text className='font-outfitMedium text-[48px] text-[#2A2118] text-center '>95 %</Text>
                            <Text className='font-outfitMedium text-center text-[#2A2118CC] text-[16px] '>Match with your profile</Text>
                            <Text
                                className="font-outfit text-[16px] text-center mt-3"
                                style={{ color: '#2A2118CC' }}
                            >
                                Excellent for your combination skin and redness concerns.
                            </Text>
                        </View>
                    </BorderlessShadowCard>

                    {/* Detected Conditions Section */}
                    <View className="mt-3">
                        <Text className="font-outfitMedium text-[16px] text-[#361A0D] text-start mb-2">
                            Key Ingredients
                        </Text>

                        <View className='flex-row flex-wrap gap-4'>
                            <PillowBadge
                                textStyle={{ fontFamily: "Outfit-Medium", fontSize: 12, color: '#7A8B6A' }}
                                title='Centella Asiatica' leftIcon={<SignInCuttedCircleIcon size={12} color='#7A8B6A' />} />
                            <PillowBadge
                                textStyle={{ fontFamily: "Outfit-Medium", fontSize: 12, color: '#7A8B6A' }}
                                title='Niacinamide' leftIcon={<SignInCuttedCircleIcon size={12} color='#7A8B6A' />} />
                            <PillowBadge
                                textStyle={{ fontFamily: "Outfit-Medium", fontSize: 12, color: '#7A8B6A' }}
                                title='Hyaluronic Acid' leftIcon={<SignInCuttedCircleIcon size={12} color='#7A8B6A' />} />
                            <PillowBadge
                                textStyle={{ fontFamily: "Outfit-Medium", fontSize: 12, color: '#7A8B6A' }}
                                title='Centella Asiatica' leftIcon={<SignInCuttedCircleIcon size={12} color='#7A8B6A' />} />
                            <PillowBadge
                                textStyle={{ fontFamily: "Outfit-Medium", fontSize: 12, color: '#7A8B6A' }}
                                title='Centella Asiatica' leftIcon={<SignInCuttedCircleIcon size={12} color='#7A8B6A' />} />
                            <PillowBadge
                                textStyle={{ fontFamily: "Outfit-Medium", fontSize: 12, color: '#7A8B6A' }}
                                title='Centella Asiatica' leftIcon={<SignInCuttedCircleIcon size={12} color='#7A8B6A' />} />

                        </View>



                        {/* Pores */}
                        <BorderlessShadowCard
                            b_tl={0}
                            b_tr={0}
                            b_bl={24}
                            b_br={24}

                            style={{
                                paddingVertical: 16,
                                paddingHorizontal: 24,
                                marginTop: 12,


                            }}
                        >
                            <View className="flex-row items-start gap-3">
                                <SignInCuttedCircleIcon size={24} color="#7A8B6A" />
                                <View className="flex-1">
                                    <Text className="font-outfitMedium text-start text-[14px] text-[#2A2118]">
                                        Safe to Use
                                    </Text>

                                    <Text
                                        className="font-outfit text-[12px] mt-1.5"
                                        style={{ color: '#2A2118B2' }}
                                    >
                                        No known allergens detected based on your profile.
                                    </Text>
                                </View>
                            </View>
                        </BorderlessShadowCard>

                        {/* Button */}
                        {/* <PrimaryButton
                            title="View Recommended Routine"
                            onPress={() => { }}
                            className='mt-8'
                        /> */}

                        <PrimaryVariantButton
                            title="Compare with My Routine"
                            borderTopLeftRadius={24}
                            borderTopRightRadius={24}
                            borderBottomLeftRadius={0}
                            borderBottomRightRadius={0}
                            leftIcon={<ArrowCircleDuetIcon size={18} color='#361A0D' />}
                            onPress={() => { }}
                            style={{ marginTop: 32 }}
                        />
                        <PrimaryVariantButton
                            title="Compare with My Routine"
                            borderTopLeftRadius={0}
                            borderTopRightRadius={0}
                            borderBottomLeftRadius={24}
                            borderBottomRightRadius={24}
                            leftIcon={<PlusIcon size={18} color='#361A0D' />}
                            onPress={() => { }}
                            style={{ marginTop: 16 }}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AiAnalysisCompleteScreen;

const styles = StyleSheet.create({});