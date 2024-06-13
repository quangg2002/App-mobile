import { StyleSheet, View, Text, Image, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from '@/theme';
import { Ionicons } from "@expo/vector-icons";
import Button from '../../components/Button';
import RootNavigation from '../../route/RootNavigation'
import Input from '../../components/Input';

const UpdatePassword = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isPasswordShown1, setIsPasswordShown1] = useState(true);
    const [isPasswordShown2, setIsPasswordShown2] = useState(true);

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [retryPassword, setRetryPassword] = useState('');


    const handleSigupPress = () => {
        RootNavigation.navigate('ChooseRole');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <TouchableOpacity onPress={() => RootNavigation.pop()}>
                        <Ionicons name="arrow-back" size={24} color="black" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        textAlign: 'center',
                        color: colors.black
                    }}>
                        Thay đổi mật khẩu
                    </Text>
                </View>


                <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 16, color: colors.black, fontWeight: 'bold', marginBottom: 8 }}>
                        Mật khẩu cũ
                    </Text>
                    <View style={{
                        height: 48,
                        borderColor: colors.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={isPasswordShown} />
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

                <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 16, color: colors.black, fontWeight: 'bold', marginBottom: 8 }}>
                        Mật khẩu mới
                    </Text>
                    <View style={{
                        height: 48,
                        borderColor: colors.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={isPasswordShown1} />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShown1(!isPasswordShown1)}
                            style={{ position: 'absolute', right: 12 }}
                        >
                            {isPasswordShown1 ? (
                                <Ionicons name="eye-off" size={24} color={colors.black} />
                            ) : (
                                <Ionicons name="eye" size={24} color={colors.black} />
                            )}
                        </TouchableOpacity>
                    </View>


                </View>

                <View style={{ marginBottom: 12, paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ fontSize: 16, color: colors.black, fontWeight: 'bold', marginBottom: 8 }}>
                        Xác nhận lại
                    </Text>
                    <View style={{
                        height: 48,
                        borderColor: colors.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={isPasswordShown2} />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShown2(!isPasswordShown2)}
                            style={{ position: 'absolute', right: 12 }}
                        >
                            {isPasswordShown2 ? (
                                <Ionicons name="eye-off" size={24} color={colors.black} />
                            ) : (
                                <Ionicons name="eye" size={24} color={colors.black} />
                            )}
                        </TouchableOpacity>
                    </View>


                </View>

                <Button
                    title="Xác nhận"
                    filled
                    onPress={handleSigupPress}
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                        height: 52,
                        width: 250,
                        alignSelf: 'center'
                    }}
                />

            </View>
        </SafeAreaView>
    )
}
export default UpdatePassword;
