import React, { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Platform, TouchableOpacity, Text, View, ScrollView, TextInput, Alert } from 'react-native';
import { Feather, MaterialIcons, FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';
import CustomModal from "../../components/CustomModal";
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import RootNavigation from "@/route/RootNavigation";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '@/theme';
import { useSelector } from 'react-redux';
import { RootReducer } from '@/redux/store/reducer';
import { BASE_API } from '../../services/BaseApi';
import axios from 'axios';

const heightScreen = Dimensions.get('window').height;
const widthScreen = Dimensions.get('window').width;

const AddJob = ({route}) => {
    const { userId, phoneNumber, role } = useSelector((state: RootReducer) => state.authReducer);
    // const route = useRoute();
    const companyId = route.params?.companyId;
    const companyName = route.params?.companyName;

    const navigation = useNavigation();

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [chosenCheckBox, setChosenCheckBox] = useState(-1);
    const [textTypeWork, setTextTypeWork] = useState('')
    const [chosenTimeCheckBox, setTimeChosenCheckBox] = useState(-1);
    const [textTimeWork, setTextTimeWork] = useState('')

    const [mota, setMota] = useState(false)
    const [address, setAddress] = useState(false)
    const [jobPosition, setJobPosition] = useState(false)
    const [wage, setWage] = useState(false)
    const [date, setDate] = useState<Date>(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleMota = () => {
        setMota(!mota)
    }

    const handleAddress = () => {
        setAddress(!address)
    }

    const handleJobPosition = () => {
        setJobPosition(!jobPosition)
    }

    const handleWage = () => {
        setWage(!wage)
    }

    const [text, setText] = useState('');

    const handleTextChange = newText => {
        setText(newText);
    };

    const [textAddress, setTextAddress] = useState('');

    const handleTextAddressChange = newText => {
        setTextAddress(newText);
    };

    const [textJobPosition, setTextJobPosition] = useState('');

    const handleTextJobPositionChange = newText => {
        setTextJobPosition(newText);
    };

    const [textWage, setTextWage] = useState('');

    const handleTextWageChange = newText => {
        setTextWage(newText);
    };


    const [value, setValue] = useState('');
    const [isFocus, setIsFocus] = useState(false);


    const handleButtonTypeWorkplace = (index: number) => {
        setSelectedIndex(index === selectedIndex ? -1 : index);
    }

    const typeWork = [
        {
            index: 1,
            title: 'On-Site',
            describe: 'Nhân viên đến làm việc'
        },

        {
            index: 2,
            title: 'Hybrid',
            describe: 'Làm việc trực tiếp tại chỗ hoặc ngoài cơ sở'
        },

        {
            index: 3,
            title: 'Remote',
            describe: 'Làm việc từ xa'
        },
    ]


    const handleCheckBoxTypeWorkplace = (index: number) => {
        setChosenCheckBox(index === chosenCheckBox ? -1 : index);
        setTextTypeWork(typeWork.find(item => item.index === index).title);
        setSelectedIndex(-1);
    }


    const timeWork = [
        {
            index: 1,
            title: 'Full Time',
        },

        {
            index: 2,
            title: 'Part Time',
        },
    ]



    const handleCheckBoxTimeWorkplace = (index: any) => {
        setTimeChosenCheckBox(index === chosenTimeCheckBox ? -1 : index);
        setTextTimeWork(timeWork.find(item => item.index === index).title);
        setSelectedIndex(-1)
    }

    const data = [
        { label: 'Design', value: 'Design' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Education', value: 'Education' },
        { label: 'Retaurant', value: 'Retaurant' },
        { label: 'Health', value: 'Health' },
        { label: 'Programmer', value: 'Programmer' }
    ];

    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value === value && (
                    <AntDesign
                        style={styles.icon}
                        color="black"
                        name="Safety"
                        size={20}
                    />
                )}
            </View>
        );
    };

    const workData = {
        specialize: value,
        jobPosition: textJobPosition,
        wage: textWage, 
        typeWork: textTimeWork,
        jobLocation: textAddress,
        typeJob: textTypeWork,
        description: text,
        companyId: companyId, 
        employerId: 1, 
        endTime: date, 
    };
    

    const createWork = async () => {
        // Kiểm tra xem tất cả các trường đã được điền vào hay chưa
        if (!workData.specialize || !workData.jobPosition || !workData.wage || !workData.typeWork || !workData.jobLocation || !workData.typeJob || !workData.description || !workData.companyId || !workData.endTime) {
            // Hiển thị một cảnh báo cho người dùng nếu có trường nào thiếu
            Alert.alert(
                'Cảnh báo',
                'Vui lòng điền đầy đủ thông tin trước khi tạo công việc',
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('Cancelled'),
                        style: 'cancel',
                    },
                ],
                { cancelable: false }
            );
        } else {
            // Nếu tất cả các trường đã được điền vào, hiển thị hộp thoại xác nhận
            Alert.alert(
                'Xác nhận',
                'Bạn có chắc muốn tạo công việc?',
                [
                    {
                        text: 'OK',
                        onPress: async () => {
                            try {
                                await BASE_API.post(`companies/creatework`, workData);
                                RootNavigation.navigate('AllJob');
                            } catch (error) {
                                console.log(error);
                            }
                        },
                    },
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancelled'),
                        style: 'cancel',
                    },
                ],
                { cancelable: false }
            );
        }
    };
    
    
    

    // console.log(value);
    // // console.log(tex
    // // console.log(textAddress)
    // // console.log(textTimeWork);
    console.log(textTypeWork);
    // // console.log(date)
    // // console.log(companyId)
    // console.log(workData)
    // createWork() 
        


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{ rowGap: 20 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.textTitle}>Thêm công việc</Text>
                    <View style={styles.content}>
                        <View style={{
                            paddingVertical: heightScreen / 38,
                            width: '100%',
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 15,
                            borderRadius: 15
                        }}>
                            <Text style={styles.text}>Chuyên môn</Text>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={data}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? '...' : '...'}
                                searchPlaceholder="Search..."
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setValue(item.value);
                                    setIsFocus(false);
                                }}
                                renderItem={renderItem}
                            />
                        </View>

                        <View style={{
                            paddingVertical: heightScreen / 38,
                            width: '100%',
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 15,
                            borderRadius: 15,
                            rowGap: 5
                        }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={styles.text}>Vị trí công việc</Text>
                                    {textJobPosition && !jobPosition && <Text style={{ color: '#524B6B', fontSize: 12 }}>{textJobPosition}</Text>}
                                </View>
                                <TouchableOpacity style={styles.circle} onPress={handleJobPosition}>
                                    {!textJobPosition ? <MaterialIcons name="add" size={24} color="#FF9228" /> : <FontAwesome5 name="pencil-alt" size={14} color="#FF9228" />}
                                </TouchableOpacity>
                            </View>
                            {jobPosition && (
                                <View style={{ height: 50, width: '100%', borderColor: '#9D97B5', borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                    <TextInput style={{ width: '100%', height: 50, textAlignVertical: 'top', padding: 5 }} multiline={true} onChangeText={handleTextJobPositionChange} value={textJobPosition}></TextInput>
                                </View>
                            )}
                        </View>

                        <View style={styles.boxJob} >
                            <View style={{ rowGap: 5 }}>
                                <Text style={styles.text}>Cách làm việc</Text>
                                {textTypeWork &&
                                    <Text style={{ color: '#524B6B', fontSize: 12 }}>{textTypeWork}</Text>
                                }
                            </View>
                            <TouchableOpacity style={styles.circle} onPress={() => handleButtonTypeWorkplace(1)}>
                                {!textTypeWork ? <MaterialIcons name="add" size={24} color="#FF9228" /> : <FontAwesome5 name="pencil-alt" size={14} color="#FF9228" />}
                            </TouchableOpacity>
                        </View>


                        <View style={{
                            paddingVertical: heightScreen / 38,
                            width: '100%',
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 15,
                            borderRadius: 15,
                            rowGap: 5
                        }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={styles.text}>Địa điểm làm việc</Text>
                                    {textAddress && !address && <Text style={{ color: '#524B6B', fontSize: 12 }}>{textAddress}</Text>}
                                </View>
                                <TouchableOpacity style={styles.circle} onPress={handleAddress}>
                                    {!textAddress ? <MaterialIcons name="add" size={24} color="#FF9228" /> : <FontAwesome5 name="pencil-alt" size={14} color="#FF9228" />}
                                </TouchableOpacity>
                            </View>
                            {address && (
                                <View style={{ height: 50, width: '100%', borderColor: '#9D97B5', borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                    <TextInput style={{ width: '100%', height: 50, textAlignVertical: 'top', padding: 5 }} multiline={true} onChangeText={handleTextAddressChange} value={textAddress}></TextInput>
                                </View>
                            )}
                        </View>

                        <View style={styles.boxJob}>
                            <View style={{ rowGap: 5 }}>
                                <Text style={styles.text}>Công ty</Text>
                                {companyId != null && (
                                    <Text style={{ color: '#524B6B', fontSize: 12 }}>{companyName}</Text>
                                )}
                            </View>

                            <TouchableOpacity style={styles.circle} onPress={() => RootNavigation.navigate('Companyq')}>
                                {!companyId ? <MaterialIcons name="add" size={24} color="#FF9228" /> : <FontAwesome5 name="pencil-alt" size={14} color="#FF9228" />}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.boxJob} >
                            <View style={{ rowGap: 5 }}>
                                <Text style={styles.text}>Loại làm việc</Text>
                                {textTimeWork &&
                                    <Text style={{ color: '#524B6B', fontSize: 12 }}>{textTimeWork}</Text>
                                }
                            </View>
                            <TouchableOpacity style={styles.circle} onPress={() => handleButtonTypeWorkplace(4)}>
                                {!textTimeWork ? <MaterialIcons name="add" size={24} color="#FF9228" /> : <FontAwesome5 name="pencil-alt" size={14} color="#FF9228" />}
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            paddingVertical: heightScreen / 38,
                            width: '100%',
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 15,
                            borderRadius: 15,
                            rowGap: 5
                        }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={styles.text}>Mức lương</Text>
                                    {textWage && !wage && <Text style={{ color: '#524B6B', fontSize: 12 }}>{textWage} VNĐ</Text>}
                                </View>
                                <TouchableOpacity style={styles.circle} onPress={handleWage}>
                                    {!textWage ? <MaterialIcons name="add" size={24} color="#FF9228" /> : <FontAwesome5 name="pencil-alt" size={14} color="#FF9228" />}
                                </TouchableOpacity>
                            </View>
                            {wage && (
                                <View style={{ height: 50, width: '100%', borderColor: '#9D97B5', borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                    <TextInput style={{ width: '100%', height: 50, textAlignVertical: 'top', padding: 5 }} multiline={true} onChangeText={handleTextWageChange} value={textWage}></TextInput>
                                </View>
                            )}
                        </View>

                        <View style={{
                            paddingVertical: heightScreen / 38,
                            width: '100%',
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 15,
                            borderRadius: 15,
                            rowGap: 5
                        }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={styles.text}>Mô tả</Text>
                                    {text && !mota && <Text style={{ color: '#524B6B', fontSize: 12 }}>{text}</Text>}
                                </View>
                                <TouchableOpacity style={styles.circle} onPress={handleMota}>
                                    {!text ? <MaterialIcons name="add" size={24} color="#FF9228" /> : <FontAwesome5 name="pencil-alt" size={14} color="#FF9228" />}
                                </TouchableOpacity>
                            </View>
                            {mota && (
                                <View style={{ height: 100, width: '100%', borderColor: '#9D97B5', borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                    <TextInput style={{ width: '100%', height: 100, textAlignVertical: 'top', padding: 5 }} multiline={true} onChangeText={handleTextChange} value={text}></TextInput>
                                </View>
                            )}
                        </View>
                        <View style={{
                            paddingVertical: heightScreen / 38,
                            width: '100%',
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 15,
                            borderRadius: 15,
                            rowGap: 5
                        }} >
                            <Text style={styles.text}>Hạn công việc</Text>
                            <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    height: 48,
                                    borderColor: colors.black,
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingLeft: 22,
                                    paddingRight: 10
                                }}>
                                    <Text>{date.toLocaleDateString()}</Text>
                                    <TouchableOpacity onPress={() => setShow(true)}>
                                        <Ionicons name="calendar" size={24} color={colors.black} />
                                    </TouchableOpacity>
                                </View>
                                {show && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={onChange}
                                    />
                                )}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.buttonCreate} onPress={() => createWork()}>
                        <Text style={styles.textButtonCreate}>Xác nhận</Text>
                    </TouchableOpacity>

                    <CustomModal
                        visible={selectedIndex === 1}
                        onClose={() => setSelectedIndex(-1)}
                        list={typeWork}
                        chosenCheckBox={chosenCheckBox}
                        handleCheckBoxIndex={handleCheckBoxTypeWorkplace}
                    />

                    <CustomModal
                        visible={selectedIndex === 4}
                        onClose={() => setSelectedIndex(-1)}
                        list={timeWork}
                        chosenCheckBox={chosenTimeCheckBox}
                        handleCheckBoxIndex={handleCheckBoxTimeWorkplace}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 45 : 0,
        marginHorizontal: 16,
        // paddingBottom: 10s
    },

    boxJob: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: heightScreen / 38,
        width: '100%',
        backgroundColor: '#FFFFFF',
        alignItems: "center",
        paddingHorizontal: 15,
        borderRadius: 15
    },

    content: {
        rowGap: 20,
    },

    circle: {
        width: 26,
        height: 26,
        backgroundColor: '#FFD6AD',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },

    text: {
        fontSize: 16,
        fontWeight: '500',
        color: '#150B3D',
    },

    textTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#150B3D'
    },

    buttonCreate: {
        alignSelf: 'center',
        backgroundColor: '#130160',
        paddingVertical: 15,
        paddingHorizontal: 80,
        marginBottom: 10,
        borderRadius: 10
    },

    textButtonCreate: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600'
    },

    blurLine: {
        height: 5,
        width: '10%',
        backgroundColor: '#9B9B9B',
        alignSelf: 'center',
        borderRadius: 10,
        marginBottom: heightScreen / 35
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
        backgroundColor: '#ffffff',
        width: '100%',
        padding: 5,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        paddingBottom: 10
    },

    closeText: {
        alignSelf: 'flex-end',
        color: '#333333',
        fontSize: 16,
    },

    dropdown: {
        width: '100%',
        alignSelf: 'center',
        height: 10,
        borderColor: 'gray',
        // borderWidth: 0.5,
        // borderRadius: 8,
        // paddingHorizontal: 8,
    },

    placeholderStyle: {
        fontSize: 12,
        color: 'gray'
    },

    selectedTextStyle: {
        color: '#524B6B',
        fontSize: 12
    },

    iconStyle: {
        // width: 20,
        // height: 20,
    },

    inputSearchStyle: {
        // height: 40,
        fontSize: 16,
    },

    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    textItem: {
        flex: 1,
        fontSize: 14,
    },

    icon: {
        marginRight: 5,
    },
})

export default AddJob