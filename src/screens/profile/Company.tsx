import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from '@/theme';
import * as ImagePicker from 'expo-image-picker';
import RootNavigation from '../../route/RootNavigation';
import { BASE_API } from '../../services/BaseApi';

const Company = ({ route }) => {

    const { companyData, companyIndex, idEmployer } = route.params;

    const [name, setName] = useState(companyData?.name ?? '');
    const [shortName, setSortName] = useState(companyData?.shortName ?? '');
    const [employeeSize, setEmployeeSize] = useState(companyData?.employeeSize ?? '');
    const [headOffice, setHeadOffice] = useState(companyData?.headOffice ?? '');
    const [industry, setIndustry] = useState(companyData?.industry ?? '');
    const [website, setWebsite] = useState(companyData?.website ?? '');
    const [image, setImage] = useState(null);

    const [description, setDescription] = useState(companyData?.description ?? '');

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
    }, []);


    const handleSave = async () => {
        if (!name.trim() || !shortName.trim()) {
            alert('Please fill in all required fields.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('shortName', shortName.trim());
        formData.append('employeeSize', employeeSize);
        formData.append('headOffice', headOffice.trim());
        formData.append('industry', industry.trim());
        formData.append('website', website.trim());
        formData.append('description', description.trim());
        formData.append('employerId', idEmployer);

        const formDataOld = new FormData();
        formDataOld.append('id', companyIndex);
        formDataOld.append('name', name.trim());
        formDataOld.append('shortName', shortName.trim());
        formDataOld.append('employeeSize', employeeSize);
        formDataOld.append('headOffice', headOffice.trim());
        formDataOld.append('industry', industry.trim());
        formDataOld.append('website', website.trim());
        formDataOld.append('description', description.trim());
        formDataOld.append('employerId', idEmployer);

        if (image) {
            const uriParts = image.split('.');
            const fileType = uriParts[uriParts.length - 1];
            console.log(image)
            formDataOld.append('image', {
                uri: image,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            });
        }

        try {
            if (typeof companyIndex === 'number') {
                if (modalVisible) {
                    const response = await BASE_API.put(`/companies/${companyIndex}`, formDataOld, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    setModalVisible(false);
                    RootNavigation.pop();
                } else {
                    setModalVisible(true);
                }
            } else { 
                if (modalVisible) {

                    const response = await BASE_API.post('/companies/create', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    setModalVisible(false);
                    RootNavigation.pop();
                } else {
                    setModalVisible(true);
                }
            }
        } catch (error) {
            console.error('Error handling company data', error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 0.2,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleBack = () => {
        RootNavigation.pop();
    };


    const handleModal = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <ScrollView>
                <View style={{ flex: 1, marginHorizontal: 22 }}>
                    <View style={{ marginVertical: 22 }}>
                        <TouchableOpacity onPress={handleBack}>
                            <Ionicons name="arrow-back" size={24} color="black" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            marginVertical: 12,
                            textAlign: 'center',
                            color: colors.black
                        }}>
                            {typeof companyIndex === 'number' ? 'Thay đổi công ty' : 'Thêm công ty'}
                        </Text>
                    </View>

                    <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Tên ngắn</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Tên công ty</Text>
                        <TextInput
                            style={styles.input}
                            value={shortName}
                            onChangeText={setSortName}
                        />
                    </View>

                    <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Quy mô công ty</Text>
                        <TextInput
                            style={styles.input}
                            value={employeeSize}
                            onChangeText={setEmployeeSize}
                        />
                    </View>
                    <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Địa điểm</Text>
                        <TextInput
                            style={styles.input}
                            value={headOffice}
                            onChangeText={setHeadOffice}
                        />
                    </View>

                    <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Ngành nghề</Text>
                        <TextInput
                            style={styles.input}
                            value={industry}
                            onChangeText={setIndustry}
                        />
                    </View>

                    <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Website</Text>
                        <TextInput
                            style={styles.input}
                            value={website}
                            onChangeText={setWebsite}
                        />
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
                    <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                            <Text style={styles.uploadButtonText}>Upload Logo</Text>
                        </TouchableOpacity>
                        {image && <Image source={{ uri: image }} style={{ width: 80, height: 80, marginBottom: 12, alignItems: 'center', justifyContent: 'center' }} />}
                    </View>


                    <View style={styles.saveButtonContainer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleModal}>
                            <Text style={styles.saveButtonText}>Lưu</Text>
                        </TouchableOpacity>
                    </View>
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
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    uploadButton: {
        backgroundColor: '#130160',
        borderRadius: 5,
        padding: 9,
        marginBottom: 12,
        width: 150,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: 'white',
        fontSize: 16,
    },
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

export default Company;
