import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Container from '../../components/Container';
import RootNavigation from '../../route/RootNavigation'
import { useDispatch } from 'react-redux';
import { hideLoading, login, showLoading } from '../../redux/slice/authSlice';
import GOOGLE from '../../assets/images/google_logo.png'
import LOGO from '../../assets/images/logo.png'
import { FontAwesome } from '@expo/vector-icons';
import { BASE_API } from '../../services/BaseApi';
import Toast from 'react-native-toast-message';
import { EvilIcons } from '@expo/vector-icons';

const Login = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLoginPress = async () => {
        try {
            dispatch(showLoading());
            const response = await BASE_API.post('/users/login', {
                phoneNumber: phoneNumber,
                password: password
            });
            if (response.status == 200 && response.data) {

                const token = response.data.token;
                const role = response.data.role;
                const fullname = response.data.fullname;
                const userId = response.data.id;

                console.log(userId)

                console.log('Token:', token);
                console.log('Role:', role);

                dispatch(login({ role, phoneNumber, access_token: token, fullname, userId }));
                Toast.show({
                    type: 'notification',
                    props: {
                        title: 'Đăng nhập thành công',
                        content: `Chào mừng ${fullname || 'bạn'} trở lại!`
                    }
                });

            } else {
                console.error('Token not found in response');
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                props: {
                    title: 'Đăng nhập không thành công',
                    content: `Kiểm tra thông tin đăng nhập`
                },
            });
        } finally {
            dispatch(hideLoading());
        }

    };
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    return (
        <Container statusBarColor={colors.primary} statusBarContentColor='light'>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>

                <SafeAreaView style={{ flex: 1, backgroundColor: colors.grey_light }}>
                    <View style={{ flex: 1, marginHorizontal: 22 }}>
                        <View style={{
                            marginHorizontal: 22,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{ marginVertical: -30 }}>

                                <Image
                                    source={LOGO}
                                    style={{ height: 200, width: 250, marginRight: 10 }}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ fontSize: 12, fontWeight: '900', alignItems: 'center', marginVertical: 12, color: colors.black, fontFamily: 'sans-serif-light' }}>
                                    Tìm kiếm ứng viên & công việc phù hợp trong một vài phút
                                </Text>

                            </View>
                        </View>
                        <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                            <Text style={{ fontSize: 16, color: colors.black, marginBottom: 8, fontWeight: '900' }}>
                                Số điện thoại
                            </Text>
                            <View style={{
                                height: 48,
                                borderColor: colors.white,
                                borderWidth: 1,
                                borderRadius: 8,
                                alignItems: "center",
                                justifyContent: "flex-start",
                                flexDirection: 'row', // Add this to layout children in a row
                                paddingLeft: 22,
                                backgroundColor: colors.grey_sur

                            }}>
                                <FontAwesome name="mobile-phone" size={25} color={colors.black} style={{ marginRight: 10, marginLeft: -10 }} />
                                <Input placeholder="Số điện thoại" value={phoneNumber} onChangeText={setPhoneNumber} />
                            </View>

                        </View>

                        <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                            <Text style={{ fontSize: 16, color: colors.black, fontWeight: '900', marginBottom: 8 }}>
                                Mật khẩu
                            </Text>
                            <View style={{
                                height: 48,
                                borderColor: colors.white,
                                borderWidth: 1,
                                borderRadius: 8,
                                alignItems: "center",
                                justifyContent: "flex-start",
                                flexDirection: 'row', // Maintain as row to layout children in a row
                                paddingLeft: 22,
                                backgroundColor: colors.grey_sur
                            }}>
                                <FontAwesome name="unlock-alt" size={24} color={colors.black} style={{ marginRight: 10, marginLeft: -10 }} />
                                <Input placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry={isPasswordShown} />
                                <TouchableOpacity
                                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                                    style={{ position: 'absolute', right: 12 }}
                                >
                                    {isPasswordShown ? (
                                        <Ionicons name="eye-off" size={24} color={colors.black} />
                                    ) : (
                                        <Ionicons name="eye" size={24} color={colors.black} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginVertical: 6
                    }}>
                        <Text>Quên mật khẩu?</Text>
                    </View> */}

                        <Pressable
                            style={({ pressed }) => [
                                {
                                    backgroundColor: colors.primary,
                                    fontWeight: '900',
                                    borderRadius: 8,
                                    height: 48,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 4,
                                    marginTop: 18,
                                    width: 250,
                                    alignSelf: 'center',
                                },
                                pressed && { opacity: 0.5 } // Opacity change when pressed
                            ]}
                            onPress={handleLoginPress}
                        >
                            <Text style={{ color: colors.white, fontSize: 18 }}>Đăng Nhập</Text>
                        </Pressable>

                        {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => RootNavigation.navigate('Setting')}
                            style={{
                                marginTop: 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                height: 52,
                                width: 250,
                                borderWidth: 1,
                                borderColor: colors.grey,
                                marginRight: 4,
                                borderRadius: 10,
                                backgroundColor: colors.lavendar,
                                alignSelf: 'center'
                            }}
                        >
                            <Image
                                source={GOOGLE}
                                style={{ height: 30, width: 30, marginRight: 8 }}
                                resizeMode="contain"
                            />
                            <Text style={{ fontSize: 15, fontWeight: '900', marginVertical: 12, color: colors.black }}>Đăng nhập với GOOGLE</Text>
                        </TouchableOpacity>
                    </View> */}

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 22 }}>
                            <Text style={{ fontSize: 16, color: colors.black }}>Bạn chưa có tài khoản?</Text>
                            <Pressable onPress={() => RootNavigation.navigate('Signup')}>
                                <Text style={{ fontSize: 16, color: '#FF9228', fontWeight: '900', marginLeft: 6 }}>
                                    Đăng ký
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </Container>

    );
};

export default Login;
