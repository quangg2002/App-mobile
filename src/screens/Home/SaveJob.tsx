import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Platform, Image, TouchableOpacity, Dimensions } from "react-native";
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RootNavigation from "@/route/RootNavigation";
import { BASE_API } from '../../services/BaseApi';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootReducer } from '@/redux/store/reducer';
import Container from '@/components/Container';
import NoSave from "./NoSave";


const heightScreen = Dimensions.get('window').height;
const widthScreen = Dimensions.get('window').width;
const SaveJob = () => {
    const { userId, phoneNumber, role } = useSelector((state: RootReducer) => state.authReducer)
    const listJob = ['Design', 'Full time', 'Senior designer']
    const [savedWork, setSavedWork] = useState([])
    const navigation = useNavigation();
    const [workId, setWorkId] = useState(-1)
    const [nameCompany, setnameCompany] = useState(-1)

    const [data, setData] = useState([
        {
            image: require('../../assets/job1.png'),
        },

        {
            image: require('../../assets/job2.png'),
        },
        {
            image: require('../../assets/job2.png'),
        },
        {
            image: require('../../assets/job2.png'),
        },
        {
            image: require('../../assets/job1.png'),
        },

        {
            image: require('../../assets/job2.png'),
        },
        {
            image: require('../../assets/job1.png'),
        },

        {
            image: require('../../assets/job2.png'),
        },
        {
            image: require('../../assets/job1.png'),
        },

        {
            image: require('../../assets/job2.png'),
        },
        {
            image: require('../../assets/job1.png'),
        },

        {
            image: require('../../assets/job2.png'),
        },
        {
            image: require('../../assets/job1.png'),
        },

        {
            image: require('../../assets/job2.png'),
        },
        {
            image: require('../../assets/job1.png'),
        },

        {
            image: require('../../assets/job2.png'),
        },
        {
            image: require('../../assets/job1.png'),
        },

        {
            image: require('../../assets/job2.png'),
        },
    ])

    const [dotThree, setDotThree] = useState(-1)
    const handleDotThree = (index: any, workId, nameCompany) => {
        setDotThree(index === dotThree ? -1 : index);
        setWorkId(workId)
        setnameCompany(nameCompany)
    }

    const exitDotThree = () => {
        setDotThree(-1)
    }

    const deteleWork = async () => {
        try {
            console.log(workId)
            await BASE_API.post(`/favorite/${userId}/${workId}`);
            setDotThree(-1)
        } catch (error) {
            console.error('Failed to fetch favorite works:', error);
        }
    };

    // console.log(workId)
    const saveWorks = async () => {
        try {
            const response = await BASE_API.get(`/save-works/${userId}`);
            // console.log(savedWork)
            setSavedWork(response.data);
        } catch (error) {
            console.error('Failed to fetch favorite works:', error);
        }
    };

    // console.log(savedWork.length)

    useFocusEffect(
        useCallback(() => {
            saveWorks();
            return () => {
            };
        }, [savedWork])
    );

    useEffect(() => {
        if(savedWork.length === 0) RootNavigation.navigate('NoSave')
    },[savedWork])
    // setTimeout(() => {
    //     if(savedWork.length === 0) RootNavigation.navigate("NoSave")
    // }, 2000);
    // console.log(savedWork[0])
    return (
        <Container>
            <View style={{ height: '100%' }}>
                <ScrollView style={styles.container}>
                    <View style={{ alignItems: 'center', rowGap: 20, height: '90%' }}>
                        <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: '15%' }}>
                                <Ionicons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={{ color: '#150B3D', fontSize: 22, fontWeight: '600' }}>Save Job</Text>
                            {/* <TouchableOpacity onPress={() => RootNavigation.navigate('NoSave')}>
                                <Text style={{ color: '#FF9228' }}>Delete all</Text>
                            </TouchableOpacity> */}
                            <Text>               </Text>
                        </View>

                        {savedWork && savedWork.map((work, index) => (
                            <View style={styles.boxJob} key={index}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 10 }}>
                                    <Image source={data[index].image} style={styles.image}></Image>
                                    <TouchableOpacity onPress={() => handleDotThree(index, work.id, work.company?.name)}>
                                        <Entypo name="dots-three-vertical" size={20} color="#524B6B" />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ rowGap: 10 }}>
                                    <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: '#003B40' }}>{work.company?.name}</Text>
                                        <Text>{work.jobLocation}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', columnGap: 10, marginHorizontal: 10 }}>
                                        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 5, backgroundColor: '#f2f1ed', borderRadius: 10 }}>
                                            <Text style={{ color: '#003B40' }}>{work.jobPosition}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 5, backgroundColor: '#f2f1ed', borderRadius: 10 }} >
                                            <Text style={{ color: '#003B40' }}>{work.typeWork}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 5, backgroundColor: '#f2f1ed', borderRadius: 10 }} >
                                            <Text style={{ color: '#003B40' }}>{work.typeJob}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: '#AAA6B9', fontSize: 10, fontStyle: 'italic' }}>
                                            Hạn hết: {work.endTime}
                                        </Text>

                                        <Text>${work.wage}k/Tháng</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View>
                        <Text></Text>
                    </View>

                </ScrollView>

                {dotThree !== -1 && (
                    <View style={styles.box}>
                        <TouchableOpacity style={{ height: 5, width: 65, backgroundColor: '#9B9B9B', alignSelf: 'center', borderRadius: 6 }} onPress={exitDotThree}></TouchableOpacity>
                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            <Image source={data[dotThree].image} style={{ width: 60, height: 60, borderRadius: 50 }}></Image>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#003B40', alignSelf: 'center', marginLeft: 5 }}>{nameCompany}</Text>
                        </View>
                        <View style={styles.blurLine}></View>
                        <TouchableOpacity style={styles.buttonDot} onPress={exitDotThree} >
                            <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 50, marginRight: 5 }}>
                                <Entypo name="trash" size={20} color="black" />
                            </View>
                            <TouchableOpacity onPress={() => deteleWork()}>
                                <Text style={{ fontWeight: '600' }}>Xoá</Text>
                                <Text style={{ color: '#AAA6B9' }}>Gỡ khỏi lịch sử lưu công việc</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonDot}>
                            <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 50, marginRight: 5 }}>
                                <AntDesign name="checkcircleo" size={24} color="black" />
                            </View>
                            <View>
                                <Text style={{ fontWeight: '600' }}>Áp dụng</Text>
                                <Text style={{ color: '#AAA6B9' }}>Xác nhận tham gia công việc</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Container >
    )
}

const styles = StyleSheet.create({
    container: {
        // paddingTop: Platform.OS === 'android' ? 45 : 0,
        marginHorizontal: 10,
        // height: heightScreen,
        // marginBottom: 5,
        paddingTop: 20
    },

    boxJob: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        paddingBottom: 10
    },

    box: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: widthScreen,
        backgroundColor: 'white',
        elevation: 5,
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 50
    },

    blurLine: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#9B9B9B',
    },

    buttonDot: {
        flexDirection: 'row',
        alignContent: 'center',
        width: '95%',
        alignSelf: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        // backgroundColor: '#130160' 
    }
})

export default SaveJob