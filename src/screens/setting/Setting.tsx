import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import RootNavigation from '../../route/RootNavigation';
import { useDispatch } from 'react-redux';  // Import thêm useDispatch từ redux
import { logout, showLoading } from '../../redux/slice/authSlice';
import { clearChatRoom } from '@/redux/slice/chatSlice';
import { useSelector } from 'react-redux';
import { RootReducer } from '@/redux/store/reducer';

const Setting = () => {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const dispatch = useDispatch();
    const { userId, phoneNumber, role } = useSelector((state: RootReducer) => state.authReducer)

    const confirmLogout = () => {
        dispatch(logout()); // Dispatch action logout

        dispatch(clearChatRoom());
        // RootNavigation.popToTop(); // Điều hướng về màn hình đăng nhập
        RootNavigation.navigate('Login');
    };
    // console.log(role)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Settings</Text>

                <View style={styles.settingSection}>
                    <View style={styles.settingItem}>
                        <TouchableOpacity onPress={() => RootNavigation.navigate('Notifications')} style={{ flex: 1, flexDirection: 'row' }}>
                            <Ionicons name="notifications-outline" size={24} color="black" />
                            <Text style={styles.settingText}>Thông báo</Text>
                        </TouchableOpacity>
                        <Switch
                            trackColor={{ false: "#767577", true: 'green' }}
                            thumbColor={isEnabled ? "white" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </View>

                <View style={styles.settingSection}>
                    <TouchableOpacity style={styles.settingItem} onPress={() => RootNavigation.navigate('Account')}>
                        <Ionicons name="person-outline" size={24} color="black" />
                        <Text style={styles.settingText}>Thông tin tài khoản</Text>
                        <Ionicons name="chevron-forward-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                {role === 'user' &&
                    <View style={styles.settingSection}>
                        <TouchableOpacity style={styles.settingItem} onPress={() => RootNavigation.navigate('SaveJob')}>
                            <FontAwesome name="bookmark-o" size={24} color="black" />
                            <Text style={styles.settingText}> Công việc lưu trữ</Text>
                            <Ionicons name="chevron-forward-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                }

                <View style={styles.settingSection}>
                    <TouchableOpacity style={styles.settingItem} onPress={() => RootNavigation.navigate('UpdatePassword')}>
                        <Ionicons name="key-outline" size={24} color="black" />
                        <Text style={styles.settingText}>Thay đổi mật khẩu</Text>
                        <Ionicons name="chevron-forward-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.settingSection}>
                    <TouchableOpacity style={styles.settingItem} onPress={() => setModalVisible(true)}>
                        <Ionicons name="exit-outline" size={24} color="black" />
                        <Text style={styles.settingText}>Đăng Xuất</Text>
                        <Ionicons name="chevron-forward-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Đăng xuất</Text>
                        <Text style={styles.modalSubText}>Bạn chắc chắn muốn đăng xuất?</Text>
                        <Pressable
                            style={[styles.button, styles.buttonYes]}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                confirmLogout()
                            }}
                        >
                            <Text style={styles.textStyle}>Đồng ý</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonNo]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Hủy bỏ</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingSection: {
        marginBottom: 16,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    settingText: {
        fontSize: 16,
        flex: 1,
        marginLeft: 20, // Add margin to separate text from icon
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)', // Add background color for modal background
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginTop: 15,
        width: 100,
    },
    buttonYes: {
        backgroundColor: "#130160",
    },
    buttonNo: {
        backgroundColor: "gray",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalSubText: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 16,
    },
});

export default Setting;
