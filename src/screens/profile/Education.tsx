import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from '@/theme';
import Button from '../../components/Button';
import RootNavigation from '../../route/RootNavigation';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { BASE_API } from '../../services/BaseApi';

const Education = ({ route }) => {

    const { educationData, educationIndex, idEmployee } = route.params;

    const [level, setEducationLevel] = useState(educationData?.level ?? '');
    const [institution, setInstitution] = useState(educationData?.institution ?? '');
    const [major, setMajor] = useState(educationData?.major ?? '');
    const [description, setDescription] = useState(educationData?.description ?? '');
    const [startDate, setStartDate] = useState(educationData?.startDate ?? '');
    const [endDate, setEndDate] = useState(educationData?.endDate ?? '');

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEducationModal, setShowEducationModal] = useState(false);
    const educationLevels = ['Chưa tốt nghiệp trung học phổ thông', 'Tốt nghiệp THPT', 'Tốt nghiệp Trung Cấp', 'Tốt nghiệp Cao Đẳng',
        'Tốt nghiệp Đại Học', 'Trên Đại học'];

    const [modalVisible, setModalVisible] = useState(false);


    const handleStartDateConfirm = (selectedDate) => {
        setShowStartDatePicker(false);
        const formattedDate = selectedDate.getMonth() + 1 + '/' + selectedDate.getFullYear();
        setStartDate(formattedDate);
    };

    const handleEndDateConfirm = (selectedDate) => {
        setShowEndDatePicker(false);
        const formattedDate = selectedDate.getMonth() + 1 + '/' + selectedDate.getFullYear();
        setEndDate(formattedDate);
    };

    const handleSave = async () => {

        if (!level.trim() || !institution.trim() || !startDate.trim() || !endDate.trim() || !major.trim()) {
            alert('Hãy điền đủ thông tin');
            setModalVisible(false);
            return;
        }
        const newEducation = {
            level: level.trim(),
            major: major.trim(),
            institution: institution.trim(),
            description: description.trim(),
            startDate,
            endDate,
            employeeId: idEmployee

        };

        const OldEducation = {
            id: educationIndex,
            level: level.trim(),
            major: major.trim(),
            institution: institution.trim(),
            description: description.trim(),
            startDate,
            endDate,
            employeeId: idEmployee
        };

        if (typeof educationIndex === 'number') {
            try {
                if (modalVisible) {
                    const response = await BASE_API.put(`/educations/${educationIndex}`, OldEducation);
                    setModalVisible(false);
                    RootNavigation.pop();
                } else {
                    setModalVisible(true);
                }
            } catch (error) {
                console.error('update Experiences', error);
            }

        } else {
            try {
                if (modalVisible) {
                    const response = await BASE_API.post(`/educations/create`, newEducation);
                    setModalVisible(false);
                    RootNavigation.pop();
                } else {
                    setModalVisible(true);
                }
            } catch (error) {
                console.error('Create Experiences', error);
            }
        }
    };

    const handleBack = () => {
        RootNavigation.pop();
    };

    const handleEducationLevelSelection = (level) => {
        setEducationLevel(level);
        setShowEducationModal(false);
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
                        marginVertical: 5,
                        textAlign: 'center',
                        color: colors.black
                    }}>
                        {typeof educationIndex === 'number' ? 'Chỉnh sửa thông tin học vấn' : 'Thêm học vấn'}
                    </Text>
                </View>


                <View style={{ marginBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 12, color: colors.black, marginBottom: 5, fontWeight: '900' }}>Trình độ học vấn <Text style={{ color: 'red' }}>(*)</Text></Text>
                    <TouchableOpacity onPress={() => setShowEducationModal(true)}>
                        <TextInput
                            style={styles.input}
                            value={level}
                            placeholder="Chọn trình độ học vấn"
                            editable={false}
                        />
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={showEducationModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowEducationModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {educationLevels.map((level, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.modalItem}
                                    onPress={() => handleEducationLevelSelection(level)}
                                >
                                    <Text style={styles.modalItemText}>{level}</Text>
                                </TouchableOpacity>
                            ))}
                            {/* Thêm nút "Hủy bỏ" với styles mới */}
                            <TouchableOpacity
                                style={styles.modalCancelItem}
                                onPress={() => setShowEducationModal(false)}
                            >
                                <Text style={styles.modalCancelItemText}>Hủy bỏ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={{ marginBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 12, color: colors.black, marginBottom: 5, fontWeight: '900' }}>Tên Trường <Text style={{ color: 'red' }}>(*)</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={institution}
                        onChangeText={setInstitution}
                    />
                </View>

                <View style={{ marginBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 12, color: colors.black, marginBottom: 5, fontWeight: '900' }}>Chuyên Ngành <Text style={{ color: 'red' }}>(*)</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={major}
                        onChangeText={setMajor}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 5, fontWeight: '900' }}>Bắt đầu <Text style={{ color: 'red' }}>(*)</Text></Text>
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
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 5, fontWeight: '900' }}>Kết thúc <Text style={{ color: 'red' }}>(*)</Text></Text>
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
                <View style={{ marginBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 12, color: colors.black, marginBottom: 5, fontWeight: '900' }}>Mô tả</Text>
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
                    <View style={styles.modalContainer1}>
                        <View style={styles.modalContent1}>
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
        height: 120,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: colors.black,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%', // Adjust if necessary
        maxHeight: '90%', // Giới hạn chiều cao tối đa để đảm bảo nội dung không vượt quá màn hình
        alignItems: 'center',
        overflow: 'hidden' // Thêm điều này để ngăn chặn nội dung bị tràn ra ngoài
    },
    modalItemText: {
        fontSize: 16, // Adjust font size as necessary
        color: '#000', // Black color for the text
    },
    modalItem: {
        paddingVertical: 10,
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: '#dedede', // hoặc màu khác phù hợp với giao diện
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCancelItem: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40, // Thử tăng giá trị này nếu cần
        borderTopWidth: 1, // Điều này thêm một dòng để tách "Hủy bỏ" với các lựa chọn khác
        borderTopColor: '#dedede', // Thay đổi màu của viền nếu cần
    },
    modalCancelItemText: {
        fontSize: 16,
        color: 'red', // Màu sắc cho văn bản "Hủy bỏ", bạn có thể thay đổi
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
    modalContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent1: {
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


export default Education;
