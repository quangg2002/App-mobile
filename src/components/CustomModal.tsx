import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


const { height: heightScreen } = Dimensions.get('window');

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    list: { index: number; title: string; describe?: string }[];
    chosenCheckBox: number;
    handleCheckBoxIndex: (index: number) => void;
}

const CustomModal: React.FC<ModalProps> = ({ visible, onClose, list, chosenCheckBox, handleCheckBoxIndex }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={onClose}>
                        <View style={styles.blurLine}></View>
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignItems: 'center', rowGap: 15 }}>
                        <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center', rowGap: 10 }}>
                            <Text style={styles.textTitle}>Chọn loại hình nơi làm việc</Text>
                            <Text style={{ textAlign: 'center', color: '#524B6B' }}>Quyết định và lựa chọn loại hình nơi làm việc theo mong muốn của bạn</Text>
                        </View>

                        <View style={{ rowGap: 10}}>
                            {list.map((item, key) => (
                                <View style={{ flexDirection: 'row', width: 350, justifyContent: 'space-between', alignItems: 'center'}} key={key}>
                                    <View style={{ rowGap: 5 }}>
                                        <Text style={[styles.textTitle, { fontSize: 16 }]}>{item.title}</Text>
                                        {item.describe && <Text style={{ color: '#AAA6B9' }}>{item.describe}</Text>}
                                    </View>
                                    <TouchableOpacity onPress={() => handleCheckBoxIndex(item.index)}>
                                        <MaterialIcons
                                            name={chosenCheckBox === item.index ? "radio-button-checked" : "radio-button-unchecked"}
                                            size={24}
                                            color={chosenCheckBox === item.index ? "#FF9228" : "#524B6B"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
    blurLine: {
        height: 5,
        width: '10%',
        backgroundColor: '#9B9B9B',
        alignSelf: 'center',
        borderRadius: 10,
        marginBottom: heightScreen / 35
    },
    textTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#150B3D'
    },
});

export default CustomModal;
