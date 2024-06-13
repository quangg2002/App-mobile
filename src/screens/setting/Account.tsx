import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Dimensions, Modal } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_API } from '../../services/BaseApi';
import { RootReducer } from '@/redux/store/reducer';
import { colors } from '@/theme';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import BACKGROUND from '../../assets/images/background.jpg'
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from '../../route/RootNavigation';
const { height } = Dimensions.get('window');

const Account = ({ route }) => {
    const { userId, phoneNumber } = useSelector((state: RootReducer) => state.authReducer);
    const { showActionSheetWithOptions } = useActionSheet();
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [fullName, setFullName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const getUser = async () => {
        try {
            const response = await BASE_API.get(`/users/${userId}`);
            const fetchedUser = response.data;
            setUser(fetchedUser);
            setFullName(fetchedUser.fullName);
            setBirthday(fetchedUser.dateOfBirth);
            setEmail(fetchedUser.mail);
            setAddress(fetchedUser.address);

            console.log(fetchedUser.fullName)
            const imageData = fetchedUser.imageBase64;
            if (imageData) {
                const uri = `data:image;base64,${imageData}`;
                setImage(uri);
            } else {
                setImage(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    const handleStartDateConfirm = (selectedDate) => {
        setShowStartDatePicker(false);
        const formattedDate = selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear();
        setBirthday(formattedDate);
    };

    useFocusEffect(
        useCallback(() => {
            getUser();
            return () => {
            };
        }, [userId])
    );

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('You have refused to allow this app to access your camera!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const showImagePickerOptions = () => {
        const options = ['Chụp ảnh', 'Chọn ảnh từ thư viện', 'Hủy bỏ'];
        const cancelButtonIndex = 2;
        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        takePhoto();
                        break;
                    case 1:
                        pickImage();
                        break;
                    default:
                        break;
                }
            }
        );
    };

    const handleSave = async () => {
        try {
            setModalVisible(false);
            console.log(phoneNumber);
            console.log(fullName);
            console.log(email);
            console.log(birthday);
            console.log(address);

            const response = await BASE_API.put("users/updateUser", {
                phoneNumber: phoneNumber,
                fullName: fullName,
                dateOfBirth: birthday,
                mail: email,
                address: address
            });
            const data = response.data;
            Toast.show({
                type: 'success',
                props: {
                    title: 'Lưu thành công',
                },
            });
        } catch (error) {
            console.error('Failed to update user:', error);
            // Handle error
        }
    };

    const handleModal = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleBack = () => {
        RootNavigation.pop();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={BACKGROUND} style={{ height: height / 6.2, width: '100%', position: 'absolute', top: 0 }}></Image>
                    <TouchableOpacity style={{left: 10}} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={25} color="black" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    <View style={styles.profileContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.profileImage} />
                        ) : (
                            <MaterialCommunityIcons name="account-circle" size={100} color="black" style={{ marginLeft: '5%', position: 'absolute', top: -38 }} />
                        )}
                    </View>
                    <TouchableOpacity style={styles.cameraIcon} onPress={showImagePickerOptions}>
                        <FontAwesome5 name="camera" size={15} color="white" />
                    </TouchableOpacity>
                    <View style={styles.nameRoleContainer}>
                        <Text style={styles.name}>{fullName}</Text>
                        <Text style={styles.role}>Applicant</Text>
                    </View>
                </View>
                <View style={{ marginHorizontal: 10, paddingTop: 50 }}>
                    <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={styles.label}>Họ và tên</Text>
                        <View style={styles.input}>
                            <TextInput
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder='Họ và tên'
                                placeholderTextColor={colors.black}
                                style={styles.inputText}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={{ fontSize: 12, color: colors.black, marginBottom: 8, fontWeight: '900' }}>Ngày sinh</Text>
                            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                                <View style={{
                                    width: "39%",
                                    height: 48,
                                    borderColor: colors.black,
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    justifyContent: "center",
                                    paddingLeft: 22
                                }}>
                                    <TextInput
                                        value={birthday}
                                    />
                                </View>
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
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.input}>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder='Email'
                                placeholderTextColor={colors.black}
                                style={styles.inputText}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={styles.label}>Địa chỉ</Text>
                        <View style={styles.input}>
                            <TextInput
                                value={address}
                                onChangeText={setAddress}
                                placeholder='Địa chỉ'
                                placeholderTextColor={colors.black}
                                style={styles.inputText}
                            />
                        </View>
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
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        paddingVertical: '16%',
    },
    profileContainer: {
        position: 'absolute',
        top: 50,
        left: 15,
    },
    cameraIcon: {
        backgroundColor: 'grey',
        borderRadius: 30,
        padding: 10,
        position: 'absolute',
        left: 80,
        top: 65,
    },
    profileImage: {
        marginLeft: '6%',
        width: 80,
        height: 80,
        borderRadius: 60,
        top: -30
    },
    nameRoleContainer: {
        position: 'absolute',
        top: 30,
        left: 150
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    role: {
        fontSize: 16,
        color: 'black',
    },
    input: {
        width: "100%",
        height: 48,
        borderColor: colors.black,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: "center",
        paddingLeft: 22
    },
    inputText: {
        width: "100%",
    },
    label: {
        fontSize: 13,
        color: colors.black,
        marginBottom: 8,
        fontWeight: '900'
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
    saveButtonContainer: {
        alignItems: 'center',
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

export default Account;
