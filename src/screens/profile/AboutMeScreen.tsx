import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import RootNavigation from '../../route/RootNavigation';
import { BASE_API } from '../../services/BaseApi';

const AboutMeScreen = ({ route }) => {
    const [aboutMeText, setAboutMeText] = useState('');
    const { saveAboutMe, aboutMe, idEmployee } = route.params || {};
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setAboutMeText(aboutMe);
    }, []);

    const handleSave = async () => {
        try {
            // Gọi API chỉ khi người dùng nhấn "Có" trong modal
            if (modalVisible) {
                const response = await BASE_API.put(`/employees/${idEmployee}`, {
                    about: aboutMeText
                });
                setModalVisible(false); // Đóng modal sau khi lưu thành công
                RootNavigation.pop(); // Điều hướng về màn hình trước đó
            } else {
                // Nếu modal không hiển thị, mở modal để xác nhận
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error updating about:', error);
        }
    };


    const handleModal = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => RootNavigation.pop()}>
                        <Ionicons name="arrow-back" size={24} color="black" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerText}>Giới thiệu bản thân</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setAboutMeText}
                    value={aboutMeText}
                    placeholder="Tell me about you."
                    multiline
                />
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

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 60,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 100,
        marginBottom: 20,
        marginLeft: 20,
    },
    input: {
        height: 150,
        padding: 10,
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        textAlignVertical: 'top',
        borderWidth: 0.5,
        borderColor: '#130160',
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
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

export default AboutMeScreen;
