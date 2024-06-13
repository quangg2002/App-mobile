import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Image, Dimensions, Alert, Linking } from 'react-native';
import { AntDesign, Entypo, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import RootNavigation from '../../route/RootNavigation';
import Container from '../../components/Container';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import BACKGROUND from '../../assets/images/background.jpg';
import { BASE_API } from '../../services/BaseApi';
import { hideLoading, login, showLoading } from '../../redux/slice/authSlice';
import { useSelector } from 'react-redux';
import { RootReducer } from '@/redux/store/reducer';
import FileViewer from 'react-native-file-viewer'; // Import thư viện FileViewer
import { colors } from '@/theme';


const { height, width } = Dimensions.get('window');
const Profile = () => {


    const { userId, phoneNumber, role } = useSelector((state: RootReducer) => state.authReducer)
    const [aboutMe, setAboutMe] = useState('');
    const [image, setImage] = useState(null);
    const [experienceLists, setExperienceLists] = useState([]);
    const [educationLists, setEducationLists] = useState([]);
    const [skillLists, setSkillLists] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [user, setUser] = useState(null)
    const [name, setName] = useState(null);

    const [showAllSkills, setShowAllSkills] = useState(false);
    const [certificationLists, setCertificationLists] = useState([]);
    const [isPickingDocument, setIsPickingDocument] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { showActionSheetWithOptions } = useActionSheet();
    const [idEmployee, setIdEmployee] = useState('');

    const getEmployee = async () => {
        try {
            const response = await BASE_API.get(`/employees/${userId}`);

            setAboutMe(response.data.about)
            setExperienceLists(response.data.experiences || []);
            setEducationLists(response.data.educations || []);
            setCertificationLists(response.data.certification || [])
            setSkillLists(response.data.skills || [])

            setUser(response.data.user)
            setName(response.data.user?.fullName)

            setIdEmployee(response.data.id)
            const imageData = response.data.user?.imageBase64;

            if (imageData) {
                const uri = `data:image;base64,${imageData}`;
                setImage(uri);
            } else {
                setImage(null);
            }
            if (response.data.resumes) {
                setSelectedFiles(response.data.resumes);
            }

        } catch (error) {
            console.error('Failed to fetch employee:', error);
        } finally {
        }
    };

    useFocusEffect(
        useCallback(() => {
            getEmployee();
            return () => {
            };
        }, [userId])
    );

    const uploadImageAndSaveData = async (phoneNumber) => {
        let imageResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 0.2,
        });

        if (!imageResult.canceled) {
            setImage(imageResult.assets[0].uri);
            try {
                const uri = imageResult.assets[0].uri;
                const uriParts = uri.split('.');
                const fileType = uriParts[uriParts.length - 1];

                const formData = new FormData();
                formData.append('image', {
                    uri: uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`
                });
                formData.append('phoneNumber', phoneNumber);

                const uploadResponse = await BASE_API.post('/users/uploadImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (uploadResponse.status === 200) {
                    console.log('Upload thành công, message:', uploadResponse.data);
                } else {
                    throw new Error('Upload không thành công: ' + uploadResponse.data);
                }
            } catch (error) {
                console.error('Lỗi khi upload ảnh: ', error);
            }
        }
    };

    const saveFile = async (fileToSave) => {
        if (fileToSave) {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission required to save files');
                return;
            }

            const fileUri = FileSystem.cacheDirectory + fileToSave.name;

            try {
                await FileSystem.copyAsync({
                    from: fileToSave.uri,
                    to: fileUri
                });

                await FileViewer.open(fileUri, { displayName: fileToSave.name });

                alert('File saved successfully!');
            } catch (error) {
                console.error('Error saving the file', error);
                alert('An error occurred while saving the file.');
            }
        }
    };

    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                multiple: false
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];

                let formData = new FormData();
                formData.append('file', {
                    uri: file.uri, // File's URI
                    type: file.mimeType || 'application/pdf',
                    name: file.name
                });
                formData.append('employerId', userId);

                try {
                    const response = await BASE_API.post(`/resumes/upload`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    alert('Tải lên hồ sơ thành công');
                    if (response.status === 200) {
                        getEmployee()
                    }

                } catch (error) {
                    console.error('Lỗi khi tải lên hồ sơ:', error);
                    alert('Đã xảy ra lỗi khi tải lên hồ sơ.');
                }
            }
        } catch (error) {
            console.error("Lỗi khi chọn tài liệu:", error);
            alert('Đã xảy ra lỗi khi chọn tài liệu.');
        }
    };

    const deleteFile = async (id) => {
        try {
            const response = await BASE_API.delete(`/resumes/${id}`);
            if (response.status === 200) {
                alert('Xóa tệp thành công');
                // Filter out the file using the file's id property
                setSelectedFiles(prevFiles => prevFiles.filter(file => file.id !== id));
            } else {
                throw new Error('Xóa tệp không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi xóa tệp:', error);
            alert('Đã xảy ra lỗi khi xóa tệp.');
        }
    }

    const formatFileSize = (sizeInBytes) => {
        return (sizeInBytes / 1024).toFixed(0) + ' KB';
    };

    const save = async (file) => {
        if (file && file.fileBase64) {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission required to save files');
                return;
            }

            const fileUri = FileSystem.cacheDirectory + file.nameFile;

            try {
                await FileSystem.writeAsStringAsync(
                    fileUri,
                    file.fileBase64,
                    {
                        encoding: FileSystem.EncodingType.Base64,
                    }
                );
                const asset = await MediaLibrary.createAssetAsync(fileUri);
                await MediaLibrary.createAlbumAsync('Download', asset, false);
                alert('Lưu file thành công!');
            } catch (error) {
                console.error('Error saving the file', error);
                alert('An error occurred while saving the file.');
            }
        } else {
            alert('Invalid file data.');
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
                        uploadImageAndSaveData(phoneNumber);
                        break;
                    default:
                        break; // Cancel action
                }
            }
        );
    };

    const addNewExperience = (newExperience) => {
        setExperienceLists([...experienceLists, newExperience]);
    };

    const deleteExperience = (index) => {
        // Hiển thị cửa sổ xác nhận trước khi xóa
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa ?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Xác nhận",
                    onPress: () => confirmDeleteExperience(index)
                }
            ],
            { cancelable: false }
        );
    };

    const confirmDeleteExperience = async (id) => {
        try {
            const response = await BASE_API.delete(`/experiences/${id}`);
        } catch (error) {
        }
        const updatedList = experienceLists.filter(experience => experience.id !== id);
        setExperienceLists(updatedList);
    };

    const deleteEducation = (index) => {
        // Hiển thị cửa sổ xác nhận trước khi xóa
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa ?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Xác nhận",
                    onPress: () => confirmDeletedeleteEducation(index)
                }
            ],
            { cancelable: false }
        );
    };

    const confirmDeletedeleteEducation = async (id) => {
        try {
            const response = await BASE_API.delete(`/educations/${id}`);
        } catch (error) {
        }
        const updatedList = educationLists.filter(education => education.id !== id);
        setEducationLists(updatedList);
    };

    const deleteCertification = (index) => {
        // Hiển thị cửa sổ xác nhận trước khi xóa
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa ?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Xác nhận",
                    onPress: () => confirmDeletedeleteCertification(index)
                }
            ],
            { cancelable: false }
        );
    };

    const confirmDeletedeleteCertification = async (id) => {
        try {
            const response = await BASE_API.delete(`/certifications/${id}`);
        } catch (error) {
        }
        const updatedList = certificationLists.filter(certification => certification.id !== id);
        setCertificationLists(updatedList);
    };

    const editExperience = (experience, id) => {

        RootNavigation.navigate('Experience', {
            experienceData: experience,
            experienceIndex: id,
            idEmployee: idEmployee,
            updateExperience: (updatedExperience, id) => {
                const updatedList = [...experienceLists];
                updatedList[id] = updatedExperience;
                setExperienceLists(updatedList);
            }
        });
    };

    const addNewEducation = (newEducation) => {
        setEducationLists([...educationLists, newEducation]);
    };

    const editEducation = (education, id) => {
        RootNavigation.navigate('Education', {
            educationData: education,
            educationIndex: id,
            idEmployee: idEmployee,
            updateEducation: (updateEducation, id) => {
                const updatedList = [...educationLists];
                updatedList[id] = updateEducation;
                setEducationLists(updatedList);
            }
        });
    };


    const addNewCertification = (newCertification) => {
        setCertificationLists([...certificationLists, newCertification]);
    };

    const addNewSkill = (addNewSkill) => {
        setSkillLists([...skillLists, addNewSkill]);
    };

    const editSkill = (skill, id) => {
        RootNavigation.navigate('Skil', {
            skillData: skill,
            skillIndex: id,
            idEmployee: idEmployee,
            updateSkill: (updateSkill, id) => {
                const updatedList = [...skillLists];
                updatedList[id] = updateSkill;
                setSkillLists(updatedList);
            }
        });
    };

    const deleteSkill = (index) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa ?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Xác nhận",
                    onPress: () => confirmDeletedeleteSkill(index)
                }
            ],
            { cancelable: false }
        );
    };

    const confirmDeletedeleteSkill = async (id) => {
        try {
            const response = await BASE_API.delete(`/skills/${id}`);
        } catch (error) {
        }
        const updatedList = skillLists.filter(skill => skill.id !== id);
        setSkillLists(updatedList);
    };

    const editCertification = (certification, id) => {
        RootNavigation.navigate('Certification', {
            certificationData: certification,
            certificationIndex: id,
            idEmployee: idEmployee,
            updateCertification: (updateCertification, id) => {
                const updatedList = [...certificationLists];
                updatedList[id] = updateCertification;
                setCertificationLists(updatedList);
            }
        });
    };

    const experienceScreen = () => {
        RootNavigation.navigate('Experience', {
            addNewExperience: addNewExperience,
            idEmployee: idEmployee
        });
    };

    const aboutScreen = () => {
        RootNavigation.navigate('AboutMeScreen', {
            saveAboutMe: setAboutMe, aboutMe,
            idEmployee: idEmployee
        });
    };

    const educationScreen = () => {
        RootNavigation.navigate('Education', {
            addNewEducation: addNewEducation,
            idEmployee: idEmployee
        });
    };

    const skillScreen = () => {
        RootNavigation.navigate('Skill', {
            addNewSkill: addNewSkill,
            idEmployee: idEmployee
        });
    };

    const certificationScreen = () => {
        RootNavigation.navigate('Certification', {
            addNewCertification: addNewCertification,
            idEmployee: idEmployee
        });
    };

    const renderAboutMeSection = () => {
        return (
            <View style={styles.section}>
                <View style={styles.iconWithText}>
                    <AntDesign name="user" size={24} color="#FF9228" />
                    <Text style={styles.sectionText}>Giới thiệu</Text>
                    {aboutMe ? (
                        role === 'user' && (
                            <View style={styles.editButtonContainer}>
                                <TouchableOpacity style={styles.addButton} onPress={aboutScreen}>
                                    <AntDesign name="edit" size={24} color="orange" />
                                </TouchableOpacity>
                            </View>
                        )
                    ) : (
                        role === 'user' && (
                            <TouchableOpacity style={[styles.addButton, { marginLeft: 'auto' }]} onPress={aboutScreen}>
                                <AntDesign name="plus" size={24} color="orange" />
                            </TouchableOpacity>
                        )
                    )}
                </View>
                {aboutMe ? (
                    <>
                        <View style={styles.separator}></View>
                        <Text style={styles.aboutMeText}>{aboutMe}</Text>
                    </>
                ) : null}
            </View>
        );
    };

    const renderExperienceSection = () => {
        return (
            <View style={styles.section}>
                <View style={styles.iconWithText}>
                    <Entypo name="briefcase" size={24} color="orange" />
                    <Text style={styles.sectionText}>Kinh nghiệm làm việc</Text>
                    {role === 'user' && (
                        <View style={styles.editButtonContainer}>
                            <TouchableOpacity style={styles.addButton} onPress={experienceScreen}>
                                <AntDesign name="plus" size={24} color="#FF9228" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View>
                    {experienceLists.length > 0 && (
                        <>
                            <View style={styles.separator}></View>
                            {experienceLists.map((experience, index) => (
                                <View key={index} style={styles.experienceItem}>
                                    <View style={styles.experienceInfo}>
                                        <Text style={styles.experienceText}>{experience.jobTitle}</Text>
                                        <Text>{experience.company}</Text>
                                        <Text>{experience.startDate} - {experience.endDate}</Text>
                                    </View>
                                    {role === 'user' && (
                                        <View style={styles.buttonsContainer1}>
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => editExperience(experience, experience.id)}
                                            >
                                                <AntDesign name="edit" size={24} color="#FF9228" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => deleteExperience(experience.id)}
                                            >
                                                <AntDesign name="delete" size={24} color="#FF9228" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </View>
        );
    };

    const renderEducationSection = () => {
        return (
            <View style={styles.section}>
                <View style={styles.iconWithText}>
                    <MaterialCommunityIcons name="book-education" size={24} color="orange" />
                    <Text style={styles.sectionText}>Học vấn</Text>
                    {role === 'user' && (
                        <View style={styles.editButtonContainer}>
                            <TouchableOpacity style={styles.addButton} onPress={educationScreen}>
                                <AntDesign name="plus" size={24} color="orange" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View>
                    {educationLists.length > 0 && (
                        <>
                            <View style={styles.separator}></View>
                            {educationLists.map((education, index) => (
                                <View key={index} style={styles.experienceItem}>
                                    <View>
                                        <Text style={styles.experienceText}>{education.major}</Text>
                                        <Text>{education.institution}</Text>
                                        <Text>{education.startDate} - {education.endDate}</Text>
                                    </View>
                                    {role === 'user' && (
                                        <View style={styles.buttonsContainer1}>
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => editEducation(education, education.id)}
                                            >
                                                <AntDesign name="edit" size={24} color="#FF9228" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => deleteEducation(education.id)}
                                            >
                                                <AntDesign name="delete" size={24} color="#FF9228" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </View>
        );
    };

    const renderSkillSection = () => {
        return (
            <View style={styles.section}>
                <View style={styles.iconWithText}>
                    <AntDesign name="staro" size={24} color="#FF9228" />
                    <Text style={styles.sectionText}>Kỹ năng</Text>
                    {role === 'user' && (
                        <View style={styles.editButtonContainer}>
                            <TouchableOpacity style={styles.addButton} onPress={skillScreen}>
                                <AntDesign name="plus" size={24} color="orange" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View>
                    {skillLists.length > 0 && (
                        <>
                            <View style={styles.separator}></View>
                            {skillLists.map((skill, index) => (
                                <View key={index} style={styles.skillItem}>
                                    <View>
                                        <Text style={styles.experienceText}>{skill.name}</Text>
                                        <Text>
                                            {skill.note ? skill.note : 'Chưa có thông tin'}
                                        </Text>
                                    </View>
                                    {role === 'user' && (
                                        <View style={styles.buttonsContainer1}>
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => editSkill(skill, skill.id)}
                                            >
                                                <AntDesign name="edit" size={24} color="#FF9228" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => deleteSkill(skill.id)}
                                            >
                                                <AntDesign name="delete" size={24} color="#FF9228" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </View>
        );
    };

    const renderCertificationSection = () => {
        return (
            <View style={styles.section}>
                <View style={styles.iconWithText}>
                    <MaterialCommunityIcons name="certificate-outline" size={24} color="#FF9228" />
                    <Text style={styles.sectionText}>Chứng chỉ</Text>
                    {role === 'user' && (
                        <View style={styles.editButtonContainer}>
                            <TouchableOpacity style={styles.addButton} onPress={certificationScreen}>
                                <AntDesign name="plus" size={24} color="orange" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View>
                    {certificationLists.length > 0 && (
                        <>
                            <View style={styles.separator}></View>
                            {certificationLists.map((certification, index) => (
                                <View key={index} style={styles.experienceItem}>
                                    <View>
                                        <Text style={styles.experienceText}>{certification.name}</Text>
                                        <Text>{certification.description}</Text>
                                        <Text>{certification.startDate}</Text>
                                    </View>
                                    {role === 'user' && (
                                        <View style={styles.buttonsContainer1}>
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => editCertification(certification, certification.id)}
                                            >
                                                <AntDesign name="edit" size={24} color="#FF9228" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => deleteCertification(certification.id)}
                                            >
                                                <AntDesign name="delete" size={24} color="#FF9228" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </View>
        );
    };

    const renderResumeSection = () => {
        return (
            <View style={styles.section}>
                <View style={styles.iconWithText}>
                    <MaterialCommunityIcons name="file-account" size={24} color="orange" />
                    <Text style={styles.sectionText}>Resume</Text>
                    {role === 'user' && (
                        <View style={styles.editButtonContainer}>
                            <TouchableOpacity style={styles.addButton} onPress={pickDocument}>
                                <AntDesign name="plus" size={24} color="orange" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {selectedFiles.length > 0 && (
                    <>
                        <View style={styles.separator}></View>
                        {selectedFiles.map((file, index) => (
                            <View key={index} style={styles.experienceItem}>
                                <MaterialIcons name="picture-as-pdf" size={40} color="red" />
                                <View>
                                    <Text style={styles.sectionText}>{file.nameFile}</Text>
                                    <Text style={styles.sectionText}>{formatFileSize(file.size)}</Text>
                                </View>

                                <View style={styles.buttonsContainer1}>
                                    <TouchableOpacity style={styles.addButton} onPress={() => save(file)}>
                                        <MaterialIcons name="save-alt" size={24} color="#FF9228" />
                                    </TouchableOpacity>
                                    {role === 'user' && (
                                        <TouchableOpacity style={styles.addButton} onPress={() => deleteFile(file.id)}>
                                            <AntDesign name="delete" size={24} color="#FF9228" />
                                        </TouchableOpacity>
                                    )}
                                </View>

                            </View>
                        ))}
                    </>
                )}
            </View>
        );
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <Image source={BACKGROUND} style={{ height: height / 4.7, width: '100%', position: 'absolute', top: 0 }}></Image>
                    <View style={styles.profileContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.profileImage} />
                        ) : (
                            <MaterialCommunityIcons name="account-circle" size={100} color="black" style={{ marginLeft: '5%', position: 'absolute' }} />
                        )}
                    </View>
                    <TouchableOpacity style={styles.cameraIcon} onPress={showImagePickerOptions}>
                        <FontAwesome5 name="camera" size={15} color="white" />
                    </TouchableOpacity>
                    <View style={styles.nameRoleContainer}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.role}>Người xin việc</Text>
                    </View>
                </View>

                <ScrollView style={{ marginTop: '13%' }}>
                    <View style={{
                        margin: 20,
                    }}>
                        {renderAboutMeSection()}
                        {renderExperienceSection()}
                        {renderEducationSection()}
                        {renderSkillSection()}
                        {renderCertificationSection()}
                        {renderResumeSection()}
                    </View>

                </ScrollView>


            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    profileContainer: {
        position: 'absolute',
        top: 50,
        left: 15,
    },
    buttonsContainer1: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
    },
    experienceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.grey_light,
        marginBottom: 10,
        borderRadius: 5,
        elevation: 3,
    },
    skillItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.grey_light,
        height: 90,
        marginBottom: 10,
        borderRadius: 5,
        elevation: 3,
    },
    experienceInfo: {
        flex: 1,
        marginRight: 10,
    },
    experienceText: {
        fontSize: 18,
        fontWeight: '900',
        color: 'black',
        marginVertical: 2,
    },
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        // backgroundColor: 'red',
        paddingVertical: '16%',
    },
    nameRoleContainer: {
        position: 'absolute',
        top: 70,
        left: 150
    },
    profileImage: {
        marginLeft: '6%',
        width: 80,
        height: 80,
        borderRadius: 60,
        top: 10
    },
    cameraIcon: {
        backgroundColor: 'grey',
        borderRadius: 30,
        padding: 10,
        position: 'absolute',
        left: 80,
        top: 105,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    role: {
        fontSize: 16,
        color: '#FF9228',
    },
    section: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    iconWithText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionText: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#e1e4e8',
        marginVertical: 10,
    },
    aboutMeText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'left',
        lineHeight: 24,
    },
    addButton: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        elevation: 3,
        marginBottom: 10, // Tạo khoảng cách giữa các nút

    },
    editButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

export default Profile;
