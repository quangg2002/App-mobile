import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform, SafeAreaView, Text, Image, Dimensions } from 'react-native';
import { EvilIcons, Ionicons} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
const { height: heightScreen } = Dimensions.get('window');
import RootNavigation from "@/route/RootNavigation";


const NoFind = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.viewBack}>
                <TouchableOpacity  onPress={() =>  RootNavigation.navigate('Filter')}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.header}>
                    
                </View>
                <View style={styles.boxImage}>
                    <Image source={require('../../assets/search.png')} style={styles.image}></Image>
                </View>
                <View style={styles.boxText}>
                    <Text style={styles.textIdea}>Không có kết quả nào được tìm thấy</Text>
                    <View style={{ width: '82%' }}>
                        <Text style={styles.textNoSuggest}>Không thể tìm thấy tìm kiếm, vui lòng kiểm tra chính tả hoặc viết từ khác.</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingTop: Platform.OS === 'android' ? 45 : 0,
        paddingHorizontal: 10,
        backgroundColor: '#F5F5F5',
    },

    viewBack: {
        margin: 10
    },

    header: {
        marginTop: 25,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center'
    },

    search: {
        flexDirection: 'row',
        borderRadius: 10,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },

    bottonSlider: {
        width: heightScreen / 15 + 2,
        height: heightScreen / 15,
        backgroundColor: '#003B20',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginLeft: 10
    },

    boxImage: {
        height: heightScreen / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    image: {
        width: heightScreen / 5 ,
        height: heightScreen / 5
    },

    boxText: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    textIdea: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#150B3D',
        marginBottom: 10
    },

    textNoSuggest: {
        color: '#524B6B',
        textAlign: 'center',
        lineHeight: 20
    },
})
export default NoFind