import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import BANNERTITLE from '../../assets/images/banner_title.png'
import BANNERWELCOME1 from '../../assets/images/banner_welcome1.png'
import BANNERWELCOME from '../../assets/images/banner_welcome.png'
import NEXT from '../../assets/images/next.png'
import RootNavigation from '../../route/RootNavigation'
import Container from '../../components/Container'

const Welcome = () => {

    const handlePressNext = () => {
        RootNavigation.navigate('Login');
    }

    return (
        <Container>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: '40%' }}>
                <Image style={{ marginHorizontal: 24 }}
                    source={BANNERWELCOME}
                />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: '20%' }}>
                <Image
                    style={{ marginHorizontal: 24 }}
                    source={BANNERTITLE}
                />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: '5%' }}>
                <Image
                    style={{ marginHorizontal: 24 }}
                    source={BANNERWELCOME1}
                />
            </View>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity onPress={handlePressNext}>
                    <Image
                        style={{ marginLeft: '85%', marginTop: '20%' }}
                        source={NEXT}
                    />
                </TouchableOpacity>
            </View>
        </Container>
    )
}

export default Welcome

const styles = StyleSheet.create({

})