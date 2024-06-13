import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from '@/theme';
import RootNavigation from '../../route/RootNavigation';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { BASE_API } from '../../services/BaseApi';

const Experience = (props: any) => {
    const { route } = props;
    const { experienceData, experienceIndex, idEmployee } = route.params;

    const [jobTitle, setJobTitle] = useState(experienceData?.jobTitle ?? '');
    const [company, setCompany] = useState(experienceData?.company ?? '');
    const [description, setDescription] = useState(experienceData?.description ?? '');
    const [startDate, setStartDate] = useState(experienceData?.startDate ?? '');
    const [endDate, setEndDate] = useState(experienceData?.endDate ?? '');

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const handleStartDateConfirm = (selectedDate: Date) => {
        setShowStartDatePicker(false);
        const formattedDate = selectedDate.getMonth() + 1 + '/' + selectedDate.getFullYear();
        setStartDate(formattedDate);
    };

    const handleEndDateConfirm = (selectedDate) => {
        setShowEndDatePicker(false);
        // Lấy tháng và năm từ selectedDate
        const formattedDate = selectedDate.getMonth() + 1 + '/' + selectedDate.getFullYear();
        setEndDate(formattedDate);
    };

    useEffect(() => {
    }, []);


    const handleSave = async () => {

        if (!jobTitle.trim() || !company.trim()) {
            alert('Hãy điền đủ thông tin');
            setModalVisible(false);
            return;
        }

        const newExperience = {
            jobTitle: jobTitle.trim(),
            company: company.trim(),
            description: description.trim(),
            startDate,
            endDate,
            employeeId: idEmployee
        };
        const OldExperience = {
            id: experienceIndex,
            jobTitle: jobTitle.trim(),
            company: company.trim(),
            description: description.trim(),
            startDate,
            endDate,
            employeeId: idEmployee
        };

        if (typeof experienceIndex === 'number') {
            try {
                if (modalVisible) {
                    const response = await BASE_API.put(`/experiences/${experienceIndex}`, OldExperience);
                    setModalVisible(false);
                    RootNavigation.pop();
                } else {
                    setModalVisible(true);
                }
            }catch (error) {
                console.error('update Experiences', error);
            }

        } else {
            try {
                if (modalVisible) {
                    const response = await BASE_API.post(`/experiences/create`, newExperience);
                    setModalVisible(false);
                    RootNavigation.pop();
                } else {
                    setModalVisible(true);
                }
            }catch (error) {
                console.error('Create Experiences', error);
            }
        }
    };

    const handleBack = () => {
        RootNavigation.pop();
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleModal = () => {
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.grey_light }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="arrow-back" size={24} color="black" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: '900',
                        marginVertical: 12,
                        textAlign: 'center',
                        color: colors.black
                    }}>
                        {typeof experienceIndex === 'number' ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm'}
                    </Text>
                </View>


                <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Vị trí <Text style={{ color: 'red' }}>(*)</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={jobTitle}
                        onChangeText={setJobTitle}
                    />
                </View>

                <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Tên công ty <Text style={{ color: 'red' }}>(*)</Text> </Text>
                    <TextInput
                        style={styles.input}
                        value={company}
                        onChangeText={setCompany}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Bắt đầu <Text style={{ color: 'red' }}>(*)</Text></Text>
                        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                            <TextInput
                                style={styles.input}
                                value={startDate.toString()}
                                editable={false}
                            />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={showStartDatePicker}
                            mode="date"
                            onConfirm={handleStartDateConfirm}
                            onCancel={() => setShowStartDatePicker(false)}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Kết thúc <Text style={{ color: 'red' }}>(*)</Text></Text>
                        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                            <TextInput
                                style={styles.input}
                                value={endDate.toString()}
                                editable={false}
                            />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={showEndDatePicker}
                            mode="date"
                            onConfirm={handleEndDateConfirm}
                            onCancel={() => setShowEndDatePicker(false)}
                        />
                    </View>
                </View>
                
                <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Mô tả</Text>
                    <TextInput
                        style={styles.input1}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                </View>
                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleModal}>
                        <Text style={styles.saveButtonText}>Lưu</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>
                                Bạn có chắc chắn muốn lưu?
                            </Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.yesButton} onPress={handleSave}>
                                    <Text style={styles.buttonText}>Có</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                    <Text style={styles.buttonText}>Không</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 48,
        padding: 10,
        marginBottom: 12,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 8,
        color: 'black'
    },
    input1: {
        height: 150,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: colors.black,
    },
    saveButtonContainer: {
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#130160',
        borderRadius: 10,
        padding: 10,
        height: 52,
        width: 200,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    yesButton: {
        backgroundColor: '#130160',
        borderRadius: 10,
        padding: 15,
        width: 90,
        margin: 5,
    },
    cancelButton: {
        backgroundColor: '#D6CDFE',
        borderRadius: 10,
        padding: 15,
        width: 90,
        margin: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default Experience;
