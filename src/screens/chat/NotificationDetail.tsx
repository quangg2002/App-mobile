import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import GOOGLE from '../../assets/images/google_logo.png'
import { placeholderTextColor, regularPadding, titleFontStyle } from '../../styles/styles'
import Group from '../../components/Group'


const NotificationDetail = () => {
    return (
        <Container>
            <Header title='Thông báo' backArrow />
            <Group>
                <Image source={GOOGLE} />
                <Text style={[titleFontStyle, { marginTop: regularPadding }]}>UI/UX Designer</Text>
                <Text style={[{ marginTop: 8, fontWeight: '500' }]}>Google Inc - California - USA</Text>
                <Text style={{ marginTop: 8, color: placeholderTextColor }}>Shipped on February 14, 2022 at 11:30 am</Text>

                <Text style={[titleFontStyle, { marginTop: regularPadding }]}>Job details</Text>
                <Text style={[{ marginTop: 8, fontWeight: '500' }]}>Senior designer</Text>
                <Text style={{ marginTop: 8, color: placeholderTextColor }}> * Full time</Text>
                <Text style={{ marginTop: 8, color: placeholderTextColor }}> * 1-3 Years work experience</Text>
            </Group>
        </Container>
    )
}

export default NotificationDetail

const styles = StyleSheet.create({})