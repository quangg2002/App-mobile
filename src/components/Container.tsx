
import React, { ReactNode } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import { regularPadding } from '../styles/styles';

const Container = (props: {
    statusBarColor?: string,
    isPaddingTop?: boolean,
    isShowToast?: boolean,
    backgroundColor?: string,
    statusBarContentColor?: StatusBarStyle,
    children: ReactNode
}) => {
    const {
        statusBarColor = 'transparent',
        backgroundColor = 'transparent',
        statusBarContentColor = 'dark'
    } = props;

    return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <StatusBar
                backgroundColor={statusBarColor}
                style={statusBarContentColor}
            />
            <View style={[styles.container, { backgroundColor: backgroundColor }]}>
                <SafeAreaView style={styles.container}>{props.children}</SafeAreaView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    contentToast: { marginLeft: regularPadding, flex: 1, backgroundColor: 'transparent' },
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
    }
});

export default Container;