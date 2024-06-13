import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Image, Platform } from 'react-native'
import React, { useMemo } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { placeholderFontStyle, purple, regularPadding, titleFontStyle } from '@/styles/styles';
import Toast from 'react-native-toast-message';
import RootNavigation from '@/route/RootNavigation';
import GOOGLE from '../assets/google.png'

interface ToastProps {
    title: string;
    content: string;
}

const toastConfig = {
    success: ({ props }: { props: ToastProps }) => {
        const { title = '', content = '' } = props;
        return (
            <View style={[styles.toast,]}>
                <AntDesign name="circledown" size={30} color="white" />
                <View style={styles.contentToast}>
                    <Text style={styles.titleText}>
                        {title}
                    </Text>
                    <Text style={[styles.contentText]}>
                        {content}
                    </Text>
                </View>
            </View>
        );
    },
    error: ({ props }: { props: ToastProps }) => {
        const { title = '', content = '' } = props;
        return (
            <View style={[styles.toast, { backgroundColor: 'red' }]}>
                <AntDesign name="closecircle" size={30} color="white" />
                <View style={styles.contentToast}>
                    <Text style={styles.titleText}>
                        {title}
                    </Text>
                    <Text style={[styles.contentText]}>
                        {content}
                    </Text>
                </View>
            </View>
        );
    },
    notification: ({ props }: { props: ToastProps }) => {
        const { title = '', content = '' } = props;
        const width = useWindowDimensions().width;
        return (
            <TouchableOpacity
                style={[{
                    flexDirection: 'row',
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    backgroundColor: '#f2f2f2',
                    borderRadius: 20,
                    marginTop: 10,
                    marginHorizontal: regularPadding,
                    width: width - regularPadding * 2,
                    shadowColor: 'black',
                    shadowOpacity: 0.5,
                    ...Platform.select({
                        android: {
                            elevation: 5,
                        },
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                        },
                    }),
                }]}
                onPress={() => RootNavigation.navigate('NotificationDetail')}
            >
                <View style={{
                    width: '16%',
                    alignItems: 'center',
                    marginRight: 8,
                }}>
                    <Image source={GOOGLE} resizeMode='contain' style={{
                        width: '60%',
                        height: '60%'
                    }} />
                </View>
                <View style={{
                    flex: 1
                }}>
                    <Text style={[titleFontStyle]}>{title}</Text>
                    <Text
                        style={{
                            color: '#524B6B',
                            marginTop: 4,
                        }}>
                        {content}
                    </Text>
                    <Text style={[placeholderFontStyle, { marginTop: 10 }]}>now</Text>
                </View>
            </TouchableOpacity>
        );
    },
};

const CustomToast = () => {
    const toastUI = useMemo(() => {
        return <Toast config={toastConfig} />;
    }, []);

    return (
        <>
            {toastUI}
        </>
    )
}

export default CustomToast;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    contentToast: {
        marginLeft: regularPadding,
        flex: 1,
        backgroundColor: 'transparent'
    },
    toast: {
        flexDirection: 'row',
        backgroundColor: '#1DB9C3',
        paddingHorizontal: regularPadding,
        paddingVertical: 12,
        marginHorizontal: regularPadding,
        borderRadius: 10
    },
    contentText: {
        color: 'white',
        fontSize: 13,
        marginTop: 5
    },
    titleText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    isRead: {
        backgroundColor: purple
    }
});