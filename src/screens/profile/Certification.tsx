import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from '@/theme';
import RootNavigation from '../../route/RootNavigation';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { BASE_API } from '../../services/BaseApi';

const Certification = ({ route, navigation }) => {

    const { certificationData, certificationIndex, idEmployee } = route.params;

    const [name, setName] = useState(certificationData?.name ?? '');
    const [description, setDescription] = useState(certificationData?.description ?? '');
    const [startDate, setStartDate] = useState(certificationData?.startDate ?? '');

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const handleStartDateConfirm = (selectedDate) => {
        setShowStartDatePicker(false);
        const formattedDate = selectedDate.getMonth() + 1 + '/' + selectedDate.getFullYear();
        setStartDate(formattedDate);
    };


    const handleSave = async () => {

        if (!name.trim() || !startDate.trim()) {
            alert('Hãy điền đủ thông tin');
            setModalVisible(false);
            return;
        }
        const newCertification = {
            name: name.trim(),
            description: description.trim(), 
            startDate,
            employeeId: idEmployee

        };
        const OldCertification = {
            id: certificationIndex,
            name: name.trim(),
            description: description.trim(),
            startDate,
            employeeId: idEmployee

        };

        if (typeof certificationIndex === 'number') {
            try {
                if (modalVisible) {
                    const response = await BASE_API.put(`/certifications/${certificationIndex}`, OldCertification);
                    setModalVisible(false);
                    RootNavigation.pop();
                } else {
                    setModalVisible(true);
                }
            } catch (error) {
                console.error('update Certification', error);
            }

        } else {
            try {
                if (modalVisible) {
                    const response = await BASE_API.post(`/certifications/create`, newCertification);
                    setModalVisible(false);
                    RootNavigation.pop();
                } else {
                    setModalVisible(true);
                }
            } catch (error) {
                console.error('Create Certification', error);
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
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
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
                        {typeof certificationIndex === 'number' ? 'Chỉnh sửa chứng chỉ' : 'Thêm chứng chỉ'}
                    </Text>
                </View>


                <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Tên bằng, chứng chỉ</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Bắt đầu</Text>
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

export default Certification;
