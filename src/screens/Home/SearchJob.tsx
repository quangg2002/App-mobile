import React, { useEffect, useState, useCallback } from "react";
import { Image, View, Dimensions, Text, StyleSheet, SafeAreaView, Platform, ScrollView, TouchableOpacity, Alert } from "react-native";
import { FontAwesome, EvilIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import Search from "../../components/Search";
import { useSelector } from 'react-redux';
import { RootReducer } from '@/redux/store/reducer';
import RootNavigation from "@/route/RootNavigation";
import { useNavigation } from '@react-navigation/native';
import { BASE_API } from '../../services/BaseApi';
import { useFocusEffect } from '@react-navigation/native';





const heightScreen = Dimensions.get('window').height;
const widthScreen = Dimensions.get('window').width;
const SearchJob = () => {
    const navigation = useNavigation();
    const { userId, phoneNumber, role } = useSelector((state: RootReducer) => state.authReducer)

    const data = [
        {
            image: require('../../assets/design.png'),
            name: 'Design',
        },

        {
            image: require('../../assets/finance.png'),
            name: 'Finance',
        },

        {
            image: require('../../assets/education.png'),
            name: 'Education',
        },

        {
            image: require('../../assets/restaurant.png'),
            name: 'Retaurant',
        },

        {
            image: require('../../assets/health.png'),
            name: 'Health',
        },

        {
            image: require('../../assets/programmer.png'),
            name: 'Programmer',
        },
    ]

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
            const response = await BASE_API.get(`/companies/top3saved`);
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

    const [chosenJob, setChosenJob] = useState<boolean>(false);

    const handleSpecialization = () => {
        setChosenJob(!chosenJob);
    }

    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const quantityData = {};
                for (const job of data) {
                    const response = await getQuantity(job.name);
                    quantityData[job.name] = response.data;
                }
                setQuantities(quantityData);
            } catch (error) {
                console.error('Failed to fetch quantities:', error);
            }
        };
        fetchData();
    }, []);

    const getQuantity = async (nameSpecialize) => {
        try {
            const response = await BASE_API.get(`/companies/quantity-specialize`, {
                params: {
                    specialize: nameSpecialize
                }
            });
            return response;
        } catch (error) {
            console.error('Failed to fetch quantity:', error);
            throw error;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../../assets/bg.png')} style={styles.backgroundImage}></Image>
            <View style={{ marginHorizontal: 15, rowGap: 20, marginVertical: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16 }}>
                        Hi, Orlando Diggs
                    </Text>
                    <View style={{ flexDirection: 'row', columnGap: 10 }}>
                        <View>
                            <FontAwesome name="bell-o" size={20} color="#ffffff" />
                            <View style={{ position: 'absolute', backgroundColor: 'red', width: 10, height: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }}>
                                <Text style={{ fontSize: 7, color: '#fff' }} >2</Text>
                            </View>
                        </View>
                        <Image source={require('../../assets/avata2.png')} style={{ width: 45, height: 45 }}></Image>
                    </View>
                </View>
                <Text style={{ color: '#fff', fontSize: 22, width: '60%', lineHeight: 35 }}>Tìm công việc mơ ước của bạn ở đây!</Text>
                <View style={styles.header}>
                    <Search
                        width={'90%'}
                        text={'Tìm kiếm.....'}
                        button={<EvilIcons name="search" size={26} color="gray" style={{ marginLeft: 6 }} />
                        }>
                    </Search>
                    <TouchableOpacity style={styles.boxSlider} onPress={() => RootNavigation.navigate("Filter")}>
                        <Feather name="sliders" size={22} color="white" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ height: heightScreen / 1.55, marginTop: heightScreen / 50 }}>
                    <View style={{ height: heightScreen + 40, rowGap: 20 }}>
                        <View style={{ rowGap: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ color: '#150B3D', fontSize: 18, fontWeight: '500' }}>Chuyên môn</Text>
                                <TouchableOpacity onPress={() => RootNavigation.navigate('AddJobDetail')}>
                                    <Text style={{ color: '#AAA6B9' }} >View all</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.specialization}>
                                {data.map((job, index) => (

                                    <TouchableOpacity style={[styles.containerSpecialize, { backgroundColor: chosenJob ? '#FCA34D' : 'white', height: heightScreen / 6.9, width: '31%', rowGap: 3, borderRadius: 15 }]} onPress={handleSpecialization} key={index}>
                                        <View style={[styles.circle, { backgroundColor: chosenJob ? 'white' : '#faeae3', width: 50, height: 50 }]}>
                                            <Image source={job.image} style={{ width: 30, height: 30 }}></Image>
                                        </View>
                                        <Text style={[styles.nameJob, { color: chosenJob ? 'white' : '#000000' }]}>{job.name}</Text>
                                        <Text>{quantities[job.name]} job</Text>
                                    </TouchableOpacity>

                                ))}
                            </View>
                        </View>
                        <View style={{ rowGap: 20 }}>
                            <Text style={{ color: '#150B3D', fontSize: 18, fontWeight: '500' }}>Đề xuất công việc</Text>
                            <View style={{ height: heightScreen / 4 }}>
                                {works.slice(0, 3).map((work, index) => (
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
                                                <TouchableOpacity onPress={() => clickSaveJob(userId, work.id)}>
                                                    {checkFavorite(work.id) ? <FontAwesome name="bookmark" size={24} color="#fdba74" /> : <FontAwesome name="bookmark-o" size={24} color="#524B6B" />}
                                                </TouchableOpacity>
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
                                                <TouchableOpacity style={{ backgroundColor: '#fcc0ca', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 6 }}>
                                                    <Text>Apply</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'android' ? 45 : 0,
        height: heightScreen,
    },

    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: widthScreen,
        height: heightScreen / 3.7,
    },


    header: {
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'center',
        columnGap: 10,
    },

    boxSlider: {
        width: heightScreen / 19,
        height: heightScreen / 19,
        borderRadius: 10,
        backgroundColor: '#FCA34D',
        justifyContent: 'center',
        alignItems: 'center'
    },

    specialization: {
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        rowGap: 16,
    },

    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100
    },

    nameJob: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white'
    },

    quantity: {
        color: 'white',
        fontSize: 12
    },

    containerSpecialize: {
        backgroundColor: '#FCA34D',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textBoxFindJob: {
        fontSize: 16,
        fontWeight: '600',
    }
});

export default SearchJob