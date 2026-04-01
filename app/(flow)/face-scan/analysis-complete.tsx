// // app/(flow)/face-scan/analysis-complete.tsx
// import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useLocalSearchParams, router } from 'expo-router';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import { IInCircleIcon } from '@/components/icons/IInCircleIcon';

// export default function FaceAnalysisComplete() {
//     const detectedConditions = [
//         { id: 1, name: 'Dehydration', severity: 'Moderate', icon: '💧' },
//         { id: 2, name: 'Redness', severity: 'Mild', icon: '🔴' },
//         { id: 3, name: 'Enlarged Pores', severity: 'Mild', icon: '🔘' },
//     ];

//     return (
//         <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//             <CustomHeader title="Face Analysis Complete" height={40} backButton />

//             <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={{
//                     paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//                     paddingTop: 24,
//                 }}
//                 className="flex-1 px-container"
//             >
//                 <View className="mt-3">
//                     <Text className="font-outfitMedium text-[16px] text-[#2E2117] text-start mb-3">
//                         Detected Conditions
//                     </Text>

//                     {detectedConditions.map((condition) => (
//                         <View
//                             key={condition.id}
//                             style={{
//                                 backgroundColor: 'white',
//                                 paddingVertical: 16,
//                                 paddingHorizontal: 20,
//                                 marginBottom: 12,
//                                 borderRadius: 16,
//                                 shadowColor: '#000',
//                                 shadowOffset: { width: 0, height: 2 },
//                                 shadowOpacity: 0.05,
//                                 shadowRadius: 8,
//                                 elevation: 2,
//                                 flexDirection: 'row',
//                                 alignItems: 'center',
//                                 justifyContent: 'space-between'
//                             }}
//                         >
//                             <View className="flex-row items-center gap-3">
//                                 <View className="w-10 h-10 rounded-full bg-[#F5EDE3] items-center justify-center">
//                                     <Text style={{ fontSize: 20 }}>{condition.icon}</Text>
//                                 </View>
//                                 <View>
//                                     <Text className="font-outfitMedium text-[15px] text-[#2E2117]">
//                                         {condition.name}
//                                     </Text>
//                                     <Text className="font-outfit text-[12px] text-[#2E2117CC]">
//                                         {condition.severity}
//                                     </Text>
//                                 </View>
//                             </View>
//                             <IInCircleIcon size={24} color="#7A5D3E" />
//                         </View>
//                     ))}
//                 </View>

//                 <View className="mt-6 mb-8">
//                     <View
//                         style={{
//                             backgroundColor: 'white',
//                             paddingVertical: 20,
//                             paddingHorizontal: 20,
//                             borderRadius: 16,
//                             shadowColor: '#000',
//                             shadowOffset: { width: 0, height: 2 },
//                             shadowOpacity: 0.05,
//                             shadowRadius: 8,
//                             elevation: 2,
//                         }}
//                     >
//                         <Text className="font-outfitMedium text-[14px] text-[#2E2117] mb-2">
//                             Face Care Recommendations
//                         </Text>
//                         <Text className="font-outfit text-[12px] text-[#2E2117CC] leading-5">
//                             Based on your skin analysis, we recommend hydrating products and gentle cleansers to address the detected conditions.
//                         </Text>
//                     </View>
//                 </View>

//                 <View className="flex-row gap-3 mb-8">
//                     <TouchableOpacity
//                         onPress={() => router.back()}
//                         className="flex-1 bg-[#F5EDE3] py-4 rounded-2xl"
//                     >
//                         <Text className="text-center font-outfitMedium text-[16px] text-[#2E2117]">
//                             New Scan
//                         </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         onPress={() => router.push('/(main)')}
//                         className="flex-1 bg-[#2E2117] py-4 rounded-2xl"
//                     >
//                         <Text className="text-center font-outfitMedium text-[16px] text-white">
//                             Done
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     );
// }


import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomHeader from '@/components/header/CustomHeader'
import { ScrollView } from 'react-native-gesture-handler'
import { LAYOUT } from '@/constants/constants'
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard'
import { IInCircleIcon } from '@/components/icons/IInCircleIcon'
import CircularProgress from '@/components/home/CircularProgress'
import IconButton from '@/components/buttons/IconButton'
import IconBadge from '@/components/icons/modified/IconBadge'
import { ArrowLeftHalfIcon } from '@/components/icons/ArrowLeftHalfIcon'
import { SignInCuttedCircleIcon } from '@/components/icons'

const AiAnalysisCompleteScreen = () => {
    return (
        <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">

            <CustomHeader title='Analysis Complete' height={40} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
                    marginTop: 24,
                }}
                className="flex-1 px-container"
            >

                <BorderlessShadowCard style={{ paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center' }} >
                    <CircularProgress progress={78} />
                    <Text className='font-outfit text-[16px] text-center mt-6 '
                        style={{ color: '#2A2118CC' }}
                    >
                        Your skin barrier is slightly compromised today. Focus on hydration and soothing ingredients.
                    </Text>
                </BorderlessShadowCard>

                <View className='mt-3'>
                    <Text className='font-outfitMedium text-[16px] text-[#2E2117] text-start  '>Detected Conditions</Text>
                    <BorderlessShadowCard b_bl={0} b_br={0} b_tl={0} b_tr={0} style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 6 }} >
                        <View className='flex-row items-start gap-3'>
                            <IInCircleIcon size={24} color='#7A5D3E' />
                            <View className='flex-1'>
                                <View className='flex-1 flex-row justify-between'>
                                    <View className='flex-1'><Text className='font-outfitMedium text-[14px] text-[#2A2118] '>Mild Redness</Text></View>
                                    <TouchableOpacity className=' rounded-[9999px] items-center ' style={{ backgroundColor: '#CAA78933', paddingVertical: 4, paddingHorizontal: 12 }}>
                                        <Text className='font-outfitMedium text-[12px] ' style={{ color: '#361A0D' }}>Medium</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text className='font-outfit text-[12px]  '
                                    style={{ color: '#2A2118B2', marginTop: 6 }}
                                >
                                    Concentrated around the cheeks. Likely due to mild barrier compromise.
                                </Text>
                            </View>
                        </View>
                    </BorderlessShadowCard>

                    <BorderlessShadowCard b_bl={0} b_br={0} b_tl={0} b_tr={0} style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 12 }} >
                        <View className='flex-row items-start gap-3'>
                            <SignInCuttedCircleIcon size={24} color='#7A8B6A' />
                            <View className='flex-1'>
                                <View className='flex-1 flex-row justify-between'>
                                    <View className='flex-1'><Text className='font-outfitMedium text-[14px] text-[#2A2118] '>Mild Redness</Text></View>
                                    <TouchableOpacity className=' rounded-[9999px] items-center ' style={{ backgroundColor: '#CAA78933', paddingVertical: 4, paddingHorizontal: 12 }}>
                                        <Text className='font-outfitMedium text-[12px] ' style={{ color: '#361A0D' }}>Medium</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text className='font-outfit text-[12px] '
                                    style={{ color: '#2A2118B2', marginTop: 6 }}
                                >
                                    Concentrated around the cheeks. Likely due to mild barrier compromise.
                                </Text>
                            </View>
                        </View>
                    </BorderlessShadowCard>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AiAnalysisCompleteScreen

const styles = StyleSheet.create({})
