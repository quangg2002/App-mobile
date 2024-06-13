import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { colors, fonts, sizes } from "@/theme";
import google from '@assets/images/google.png'
import PDF from '@assets/images/PDF.png'
import { useRoute, useNavigation } from "@react-navigation/core";
import uploadSuccess from '@assets/images/uploadsuccess.png'
import RootNavigation from "@/route/RootNavigation";

export const UploadCVSuccess = () => {
    const route = useRoute()
    const upload = uploadStyle

    const { filename, filesize }: any = route.params
    return (
        <ScrollView>

            <View style={upload.container}>
                <View style={upload.logoContainer}>
                    <View style={upload.logo}>
                        <Image source={google} />
                    </View>
                </View>

                <View style={upload.header_container}>

                    <Text style={upload.desc_text_1}>UI/UX Designer</Text>
                    <Text style={upload.desc_text_2}>Google    <Text style={{ fontSize: 10, textAlignVertical: 'center' }}>{'\u2B24'}</Text>   Carlifornia   <Text style={{ fontSize: 10, textAlignVertical: 'center' }}>{'\u2B24'}</Text>   1 day ago</Text>
                </View>

                <View style={{ marginLeft: 25, marginRight: 25, marginTop: 25 }}>
                    <View style={{ minHeight: 100, backgroundColor: colors.tertiary_light, borderRadius: 25 }}>
                        <View style={{ margin: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={PDF} style={{ width: 50, height: 50 }} />
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={[upload.desc_text_5]}>{filename}</Text>
                                <Text style={upload.desc_text_6}>{`${(filesize / 1024).toFixed(2)}kb - 10 Feb 2022 at 11:30 am`}</Text>
                            </View>

                        </View>
                    </View>


                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Image style={{ width: 200, height: 200 }} source={uploadSuccess} />
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text style={[upload.desc_text_3, { textAlign: 'center' }]}>Successful</Text>
                        <Text style={[upload.desc_text_4, { textAlign: 'center' }]}>Congratulations, your application has been sent</Text>
                    </View>

                    <View style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            RootNavigation.navigate('MainSearch')
                        }} style={{ height: 60, width: '80%', backgroundColor: colors.tertiary, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 6, marginBottom: 10 }} activeOpacity={0.8}>
                            <Text style={[upload.desc_text_3, { color: colors.primary }]}>FIND A SIMILAR JOB</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            RootNavigation.navigate('Home')
                        }} style={{ height: 60, width: '80%', backgroundColor: colors.primary, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }} activeOpacity={0.8}>
                            <Text style={[upload.desc_text_3, { color: 'white' }]}>BACK TO HOME</Text>
                        </TouchableOpacity>
                    </View>


                </View>

            </View>
        </ScrollView>
    )
}

export default UploadCVSuccess;

const uploadStyle = StyleSheet.create({
    container: {
        backgroundColor: colors.background_2,
        display: 'flex',
        position: 'relative',
        height: '100%',
        paddingTop: '15%',
        paddingBottom: '15%'
    },
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 25,
        paddingRight: 25,
        zIndex: 2
    },
    logo: {
        height: 70,
        width: 70,
        backgroundColor: colors.incognito,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    header_container: {
        height: 130,
        backgroundColor: colors.grey,
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: -20,
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    desc_text_1: {
        fontFamily: fonts.dMSans.bold,
        fontSize: sizes.h16,
        color: colors.primary
    },
    desc_text_2: {
        fontFamily: fonts.dMSans.regular,
        fontSize: sizes.h16,
        color: colors.primary,
        marginTop: 15
    },
    desc_text_3: {
        fontFamily: fonts.dMSans.bold,
        fontSize: sizes.h14
    },
    desc_text_4: {
        fontFamily: fonts.dMSans.regular,
        fontSize: sizes.h12,
        marginTop: 10
    },
    desc_text_5: {
        fontFamily: fonts.dMSans.regular,
        fontSize: sizes.h12,
        color: colors.primary

    },
    desc_text_6: {
        fontFamily: fonts.dMSans.regular,
        fontSize: sizes.h12,
        color: colors.nega

    },
})