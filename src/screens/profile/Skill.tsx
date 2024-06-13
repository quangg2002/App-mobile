import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';  // Ensure this path matches your theme configuration file.
import RootNavigation from '../../route/RootNavigation';
import { BASE_API } from '../../services/BaseApi';

const Skill = ({ route }) => {
    const { skillData, skillIndex, idEmployee } = route.params;
    const [name, setName] = useState(skillData?.name ?? '');
    const [note, setNote] = useState(skillData?.note ?? '');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(name);

    const allSkills = ['Kỹ năng giao tiếp', 'Kỹ năng viết', 'Kỹ năng thuyết trình', 'Kỹ năng giải quyết vấn đề', 'Kỹ năng chăm sóc trẻ em', 'Kỹ năng chụp ảnh', 'Kỹ năng edit', 'Kỹ năng Photoshop'];
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        setFilteredSkills(allSkills);
    }, []);

    const handleSave = async () => {

        if (!name.trim()) {
            alert('Hãy điền đủ thông tin');
            setModalVisible(false);
            return;
        }
        const newSkill = {
            name: name.trim(),
            note: note.trim(),
            employeeId: idEmployee

        };

        const OldSkill = {
            id: skillIndex,
            name: name.trim(),
            note: note.trim(),
            employeeId: idEmployee
        };

        if (typeof skillIndex === 'number') {
            try {
                if (modalVisible) {
                    const response = await BASE_API.put(`/skills/${skillIndex}`, OldSkill);
                    setModalVisible(false);
                    RootNavigation.pop();
                } else {
                    setModalVisible(true);
                }
            } catch (error) {
                console.error('update Skill', error);
            }

        } else {
            try {
                if (modalVisible) {
                    const response = await BASE_API.post(`/skills/create`, newSkill);
                    setModalVisible(false);
                    RootNavigation.pop();
                } else {
                    setModalVisible(true);
                }
            } catch (error) {
                console.error('Create Skill', error);
            }
        }
    };

    const handleSelectSkill = (skill) => {
        setSelectedSkill(skill);
        setName(skill); 
        setDropdownVisible(false);
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
            <View style={{ flex: 1, marginHorizontal: 20 }}>
            <View style={{ marginVertical: 50}}>
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="arrow-back" size={25} color="black" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: '900',
                        marginVertical: 5,
                        textAlign: 'center',
                        color: colors.black
                    }}>
                        {typeof skillIndex === 'number' ? 'Chỉnh sửa kỹ năng' : 'Thêm kỹ năng'}
                    </Text>
                </View>

                <View style={{ marginBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 12, color: colors.black, marginBottom: 5, fontWeight: '900' }}>Kỹ năng cá nhân<Text style={{ color: 'red' }}>(*)</Text></Text>
                    <TouchableOpacity onPress={() => setDropdownVisible(true)}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            placeholder="Chọn trình độ học vấn"
                            editable={false}
                        />
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={dropdownVisible}
                    onRequestClose={() => {
                        setDropdownVisible(!dropdownVisible);
                    }}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setDropdownVisible(false)}>
                        <View style={styles.modal}>
                            <ScrollView>
                                {filteredSkills.map((skill, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.modalItem}
                                        onPress={() => handleSelectSkill(skill)}
                                    >
                                        <Text style={styles.modalItemText}>{skill}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </Modal>

 
                <View style={{ marginBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 12, color: colors.black, marginBottom: 5, fontWeight: '900' }}>Ghi chú</Text>
                    <TextInput
                        style={styles.input}
                        value={note}
                        onChangeText={setNote}
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
    );
};

const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: 20
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
        color: colors.black,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
        color: colors.black
    },
    inputDropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 8,
        backgroundColor: colors.white
    },
    inputText: {
        fontSize: 16,
        color: colors.background_3
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    modal: {
        backgroundColor: colors.white,
        padding: 60,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey_light,
    },
    modalItemText: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.black
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 8,
        backgroundColor: colors.white,
        color: colors.black
    },
    saveButtonContainer: {
        alignItems: 'center',
        marginTop: 20
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 12,
        width: 200,
        alignItems: 'center',
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16
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

export default Skill;
