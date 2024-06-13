import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import Container from '../../components/Container'
import { colors } from '@/theme';
import { deepPurple } from '../../styles/styles'
import APPLICATION from '../../assets/images/application.png'
import BUSINESS from '../../assets/images/business.png'
import { useNavigation } from '@react-navigation/native';
import RootNavigation from '../../route/RootNavigation'
import { Ionicons } from "@expo/vector-icons";

const ChooseRole = ({ route }) => {


    const { password, phoneNumber, retryPassword } = route.params;
    const [role, setRole] = useState('')

    const toInformation = (selectedRole) => {
        RootNavigation.navigate('Information', {
            password,
            phoneNumber,
            retryPassword,
            role: selectedRole,
        });
    };

    return (
        <Container statusBarColor={deepPurple} statusBarContentColor='light'>
            <View style={styles.container}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={() => RootNavigation.pop()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.option}>
                        <TouchableOpacity onPress={() => toInformation(1)}>
                            <View style={styles.optionView}>
                                <Image
                                    source={APPLICATION}
                                    style={styles.optionImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.optionText}>Người xin việc</Text>
                    </View>
                    <View style={styles.option}>
                        <TouchableOpacity onPress={() => toInformation(2)}>
                            <View style={styles.optionView}>
                                <Image
                                    source={BUSINESS}
                                    style={styles.optionImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.optionText}>Nhà tuyển dụng</Text>
                    </View>
                </View>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: deepPurple,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonContainer: {
        position: 'absolute',
        top: 80,
        left: 20,
        zIndex: 10,
        backgroundColor: deepPurple
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    option: {
        marginLeft: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionView: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
        height: 130,
        backgroundColor: '#C38F8F',
        borderRadius: 10,
    },
    optionImage: {
        height: 100,
        width: 100,
    },
    optionText: {
        color: 'white',
        fontSize: 21.34,
    },
});

export default ChooseRole;
