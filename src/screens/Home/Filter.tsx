import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions, ScrollView, TextInput } from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import SliderCustomLabel from "../../components/SliderCustomLabel";
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { BASE_API } from '../../services/BaseApi';
import RootNavigation from "@/route/RootNavigation";


const { height: heightScreen } = Dimensions.get('window');

const textTransformer = (value: any) => {
    return '$' + value + 'k';
};

const TIME = { min: 0, max: 50 }
const SliderPad = 12;

export default function Filter() {

    const jobType = [
        {
            id: 1,
            title: 'On-site',
        },

        {
            id: 2,
            title: 'Hybird',
        },

        {
            id: 3,
            title: 'Remote',
        },
    ]

    const { min, max } = TIME;
    const [width, setWidth] = useState(280);
    const [selected, setSelected] = useState(null);
    const [text, setText] = useState('');
    const [text2, setText2] = useState('');
    const [selectedWorkType, setSelectedWorkType] = useState('');
    const [value, setValue] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [foundWork, setFoundWork] = useState([])

    const handleSelectJobType = (jobType) => {
        setSelectedWorkType(jobType);
    };

    const handleChangeText = (inputText) => {
        setText(inputText);
    }

    const handleChangeText2 = (inputText) => {
        setText2(inputText);
    }
    console.log(text)

    if (!selected) {
        setSelected([min, max]);
    }

    const onLayout = (event: any) => {
        setWidth(event.nativeEvent.layout.width - SliderPad * 2);
    };
    const onValuesChangeFinish = (values: any) => {
        setSelected(values);
        // console.log(values[0])
    };

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

    const navigation = useNavigation();
    const [chosenCheckBox, setChosenCheckBox] = useState(-1);
    const [typeJob, setTypeJob] = useState('')


    const handleCheckBoxIndex = (index: number) => {
        setChosenCheckBox(index === chosenCheckBox ? -1 : index);
        setTypeJob(jobType[index - 1].title)
    }

    const reset = () => {
        setChosenCheckBox(-1)
    }

    const filter = async () => {
        try {
            const response = await BASE_API.get(`/companies/wage/${selected[0]}`, {
                // params: {
                //     jobPosition: text2,
                //     typeWork: selectedWorkType,
                //     jobLocation: text,
                //     typeJob: typeJob,
                //     minWage: selected[0],
                //     maxWage: selected[1],
                //     specialize: value,
                // }
            });
            console.log(response.data);
            setFoundWork(response.data)
            setTimeout(() => {
                RootNavigation.navigate('FindJob', {foundwork: response.data, specialize: value, jobPosition: text2, typeWork: selectedWorkType, jobLocation: text, typeJob: typeJob, minWage: selected[0], maxWage: selected[1]});
            }, 1000); 
        } catch (error) {
            console.error('Failed to fetch quantity:', error);
            throw error;
        }
    };
    // console.log(value)
    // console.log(text)
    // console.log(typeJob)
    // console.log(selectedWorkType)
    // console.log(value)
    // console.log(selected[0])
    // console.log(selected[1])

    return (
        <View style={{ backgroundColor: '#F5F5F5', height: '100%', justifyContent: 'space-between' }}>
            <SafeAreaView style={styles.container}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={{ color: '#150B3D', fontSize: 22, fontWeight: '600', textAlign: 'center', width: '100%' }}>Filter</Text>
                </View>
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
                    placeholder={!isFocus ? 'Tìm kiếm' : '...'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                    }}
                    // renderLeftIcon={() => (
                    //     // <AntDesign
                    //     //     style={styles.icon}
                    //     //     color={isFocus ? 'blue' : 'black'}
                    //     //     name="Safety"
                    //     //     size={20}
                    //     // />
                    // )}
                    renderItem={renderItem}
                />

                <Text style={styles.text}>Nghề nghiệp</Text>
                <View style={{ height: 45, borderWidth: 0.5, borderRadius: 10, width: '95%', alignSelf: 'center', borderColor: 'gray', justifyContent: 'center' }}>
                    <TextInput
                        style={{ marginLeft: 5 }}
                        onChangeText={handleChangeText2}
                        value={text2}
                    />
                </View>

                <Text style={styles.text}>Địa chỉ</Text>
                <View style={{ height: 45, borderWidth: 0.5, borderRadius: 10, width: '95%', alignSelf: 'center', borderColor: 'gray', justifyContent: 'center' }}>
                    <TextInput
                        style={{ marginLeft: 5 }}
                        onChangeText={handleChangeText}
                        value={text}
                    />
                </View>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>Lương thấp nhất</Text>
                        <Text style={styles.text}>Lương cao nhất</Text>
                    </View>
                    <View onLayout={onLayout} style={styles.wrapper}>
                        <MultiSlider
                            min={min}
                            max={max}
                            allowOverlap
                            values={selected}
                            sliderLength={width}
                            onValuesChangeFinish={onValuesChangeFinish}
                            enableLabel={true}
                            customLabel={SliderCustomLabel(textTransformer)}
                            trackStyle={{
                                height: 3,
                                borderRadius: 8,
                            }}
                            markerOffsetY={3}
                            selectedStyle={{
                                backgroundColor: "#FF9228",
                            }}
                            unselectedStyle={{
                                backgroundColor: "#CCC4C2",
                            }}

                            markerStyle={{
                                height: 20,
                                width: 20,
                                borderRadius: 10,
                                backgroundColor: "#FFFFFF",
                                borderWidth: 3,
                                borderColor: "#000000",
                            }}
                        />
                    </View>
                </View>

                <Text style={styles.text}>Loại hình làm việc</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={[styles.textJobType, selectedWorkType === 'Full-time' && styles.selectedJobType]}
                        onPress={() => handleSelectJobType('Full-time')}
                    >
                        <Text style={styles.text}>Full time</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.textJobType, selectedWorkType === 'Past time' && styles.selectedJobType]}
                        onPress={() => handleSelectJobType('Past time')}
                    >
                        <Text style={styles.text}>Past time</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.textJobType, selectedWorkType === 'Remote' && styles.selectedJobType]}
                        onPress={() => handleSelectJobType('Remote')}
                    >
                        <Text style={styles.text}>Remote</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.text}>Nơi làm việc</Text>
                {jobType.map((type, index) => (
                    <View style={{ flexDirection: 'row', columnGap: 10, alignItems: 'center' }} key={index}>
                        <TouchableOpacity onPress={() => handleCheckBoxIndex(type.id)}>
                            <MaterialIcons
                                name={chosenCheckBox === type.id ? "radio-button-checked" : "radio-button-unchecked"}
                                size={24}
                                color={chosenCheckBox === type.id ? "#FF9228" : "#524B6B"}
                            />
                        </TouchableOpacity>
                        <View style={{ rowGap: 5 }}>
                            <Text>{type.title}</Text>
                            {/* <Text style={{ color: '#AAA6B9' }}>{type.describe}</Text> */}
                        </View>
                    </View>
                ))}


            </SafeAreaView >
            <View style={{
                flexDirection: 'row',
                // justifyContent: 'space-between',
                marginHorizontal: 20,
                // position: 'absolute',
                // bottom: 0,
                paddingBottom: 5,
                columnGap: 10,
                alignSelf: 'center'
            }}>
                <TouchableOpacity style={[styles.buttonApply, { backgroundColor: '#FFF', width: '30%' }]} onPress={reset}>
                    <Text style={{ color: 'red' }}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonApply, { backgroundColor: '#130160', width: '68%' }]} onPress={() => filter()}>
                    <Text style={{ color: '#FFF' }}>Tìm kiếm ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 45 : 0,
        // backgroundColor: '#F5F5F5',
        marginHorizontal: 20,
        marginVertical: 10,
        rowGap: 20,
        justifyContent: 'space-between',
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

    wrapper: {
        marginHorizontal: SliderPad * 2,
        justifyContent: "center",
        alignItems: "center",
    },

    dropdown: {
        width: '96%',
        alignSelf: 'center',
        height: 45,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },

    icon: {
        marginRight: 5,
    },

    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },

    placeholderStyle: {
        fontSize: 12,
        color: 'gray'
    },

    selectedTextStyle: {
        fontSize: 14,
    },

    iconStyle: {
        width: 20,
        height: 20,
    },

    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },

    text: {
        fontSize: 14,
        color: '#150B3D',
        fontWeight: '500'
    },

    textJobType: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 35,
        borderRadius: 6,
    },

    buttonApply: {
        paddingVertical: heightScreen / 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },

    selectedJobType: {
        backgroundColor: '#FFD6AD',
    }
});
