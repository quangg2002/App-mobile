import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Image, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, Alert } from 'react-native';
import RootNavigation from "@/route/RootNavigation";
import Container from '@/components/Container';
import { useSelector } from 'react-redux';
import { RootReducer } from '@/redux/store/reducer';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_API } from '../../services/BaseApi';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { height: heightScreen } = Dimensions.get('window');

const AllJob = () => {
    const { userId, phoneNumber, role } = useSelector((state: RootReducer) => state.authReducer)
    const navigation = useNavigation();
    const [works, setWorks] = useState([]);
    const [savedWork, setSavedWork] = useState([])

    const clickSaveJob = async (userId, workId) => {
        try {
            const response = await BASE_API.post(`/favorite/${userId}/${workId}`);

            if (response.data === 'Công việc đã được lưu vào.') {
                Alert.alert('Thành công', 'Đã thêm công việc vào danh sách lưu trữ');
            } else if (response.data === 'Công việc đã được huỷ bỏ.') {
                Alert.alert('Thành công', 'Đã xoá công việc trong danh sách lưu trữ');
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    }


    const checkFavorite = (workId) => {
        // console.log(savedWork.some(work => work.id === workId))
        return savedWork.some(work => work.id === workId);
    };

    const saveWorks = async () => {
        try {
            const response = await BASE_API.get(`/save-works/${userId}`);
            // console.log(savedWork)
            setSavedWork(response.data);
        } catch (error) {
            console.error('Failed to fetch favorite works:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            saveWorks();
            return () => {
            };
        }, [works])
    );

    const getAllWorks = async () => {
        try {
            const response = await BASE_API.get(`/companies/all-work`);
            setWorks(response.data)
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getAllWorks();
            return () => {
            };
        }, [works])
    );


    return (
        <Container>
            <SafeAreaView style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.textFindJob}>Danh sách công việc gần đây</Text>
                    <Text></Text>
                </View>

                <ScrollView style={{ height: heightScreen / 1.1 }}>
                    {works.map((work, index) => (
                        <View style={{ width: '100%', height: heightScreen / 5.3, backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 15 }} key={index}>
                            <View style={{ margin: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: 40, height: 40, backgroundColor: '#d9d4d4', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                                            <FontAwesome5 name="apple" size={26} color="black" />
                                        </View>
                                        <View>
                                            <Text style={styles.textBoxFindJob}>{work.company.name}</Text>
                                            <Text>{work.jobLocation}</Text>
                                        </View>
                                    </View>
                                    {role === 'user' &&
                                        <TouchableOpacity onPress={() => clickSaveJob(userId, work.id)}>
                                            {checkFavorite(work.id) ? <FontAwesome name="bookmark" size={24} color="#fdba74" /> : <FontAwesome name="bookmark-o" size={24} color="#524B6B" />}
                                        </TouchableOpacity>
                                    }
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                                    <Text>${work.wage}k</Text>
                                    <Text>/Mo</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ backgroundColor: '#ebe8e8', marginRight: 10, paddingVertical: 8, paddingHorizontal: 8, borderRadius: 6 }}>
                                            <Text>{work.jobPosition}</Text>
                                        </View >

                                        <View style={{ backgroundColor: '#ebe8e8', marginRight: 10, paddingVertical: 8, paddingHorizontal: 8, borderRadius: 6 }}>
                                            <Text>{work.typeWork}</Text>
                                        </View>
                                    </View>
                                    {role === 'user' ?
                                        <TouchableOpacity style={{ backgroundColor: '#fcc0ca', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 6 }}>
                                            <Text>Apply</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity style={{ backgroundColor: '#fcc0ca', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 6 }}>
                                            <Text>Xem chi tiết</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                                <Text style={{ color: '#AAA6B9', fontSize: 10, fontStyle: 'italic', alignSelf: 'flex-end', marginTop: 5 }}>Hạn hết: {work.endTime}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        // paddingTop: Platform.OS === 'android' ? 45 : 0,
        paddingHorizontal: 10,
        backgroundColor: '#F5F5F5',
        marginHorizontal: 10,
        paddingBottom: heightScreen / 15
    },

    title: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    heightScreens: {
        height: heightScreen + heightScreen / 18
    },

    indexTextHeader: {
        marginTop: heightScreen / 30
    },

    textHeader: {
        fontSize: 24,
        fontWeight: '500',
        color: '#0D0140',
    },

    joinNow: {
        marginTop: 30,
        height: heightScreen / 4.5,
        backgroundColor: '#130160',
        borderRadius: 8,
        justifyContent: 'center'
    },

    imagePeople: {
        width: '60%',
        height: '100%',
        position: 'absolute',
        right: 0,
        bottom: 0,
    },

    textJoinNow: {
        fontSize: 18,
        color: '#FFFFFF',
        marginHorizontal: 20,
    },

    buttonJoinNow: {
        backgroundColor: '#FF9228',
        width: '29%',
        marginTop: heightScreen / 35,
        marginLeft: heightScreen / 40,
        paddingVertical: 5,
        borderRadius: 6
    },

    textFindJob: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: heightScreen / 40,
        marginBottom: heightScreen / 30
    },

    boxFindJob: {
        width: '100%',
        height: heightScreen / 4,
        flexDirection: 'row'
    },

    boxRemoteJob: {
        width: '45%',
        height: '100%',
        backgroundColor: '#AFECFE',
        borderRadius: 6,
        marginRight: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    boxOffJob: {
        width: '50%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    boxFullTimeJob: {
        width: '98%',
        height: '45%',
        backgroundColor: '#BEAFFE',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },

    boxPtJob: {
        width: '98%',
        height: '45%',
        backgroundColor: '#FFD6AD',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },

    textBoxFindJob: {
        fontSize: 16,
        fontWeight: '600',
    }
})

export default AllJob