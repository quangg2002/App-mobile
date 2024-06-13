
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, SafeAreaView, Text, Image, Dimensions } from 'react-native';
import RootNavigation from "@/route/RootNavigation";


const { height: heightScreen } = Dimensions.get('window');

const NoSave = () => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.boxText}>
                <Text style={styles.textIdea}>Không có công việc lưu trữ</Text>
                <View style={{ width: '70%' }}>
                    <Text style={styles.textNoSuggest}>Bạn chưa lưu việc làm nào, vui lòng tìm trong phần tìm kiếm để lưu việc làm</Text>
                </View>
            </View>
            <Image source={require('../../assets/nosave.png')} style={styles.image}></Image>
            <TouchableOpacity style={styles.button} >
                <Text style={{color: '#ffffff', fontWeight: '500'}}>
                    TÌM KIẾM VIỆC LÀM
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
// onPress={() => RootNavigation.navigate('SearchJob')}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '90%',
        paddingTop: Platform.OS === 'android' ? 45 : 0,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        rowGap: 60
    },

    image: {
        width: heightScreen / 4,
        height: heightScreen / 4
    },

    boxText: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    textIdea: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#150B3D',
        marginBottom: 10
    },

    textNoSuggest: {
        color: '#524B6B',
        textAlign: 'center',
        lineHeight: 20
    },

    button: {
        backgroundColor: '#130160', 
        paddingHorizontal: '10%', 
        paddingVertical: '5%', 
        borderRadius: 6
    },
})

export default NoSave