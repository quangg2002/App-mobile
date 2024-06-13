import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import { deepPurple, orange, placeholderFontStyle, placeholderTextColor, purple, regularPadding, titleFontStyle } from '../../styles/styles'
import GOOGLE from '../../assets/images/google_logo.png'
import NO_NOTIFICATIONS from '../../assets/images/no_notifications.png'
import RootNavigation from '../../route/RootNavigation'

interface Notification {
    id: any,
    title?: string,
    description?: string,
    time?: string,
    isRead?: boolean,
}

const Notifications = () => {
    const width = useWindowDimensions().width;
    const [noti, setNoti] = useState<Notification[]>([
        { isRead: true, title: 'Application sent', id: 123, description: 'Applications for Google companies have entered for company review', time: '25 minutes ago' },
        { title: 'Application sent', id: 123, description: 'Applications for Google companies have entered for company review', time: '25 minutes ago' },
        { title: 'Application sent', id: 123, description: 'Applications for Google companies have entered for company review', time: '25 minutes ago' },
        { title: 'Application sent', id: 123, description: 'Applications for Google companies have entered for company review', time: '25 minutes ago' },
        { title: 'Application sent', id: 123, description: 'Applications for Google companies have entered for company review', time: '25 minutes ago' },
        { title: 'Application sent', id: 123, description: 'Applications for Google companies have entered for company review', time: '25 minutes ago' },
        { title: 'Application sent', id: 123, description: 'Applications for Google companies have entered for company review', time: '25 minutes ago' },
        { title: 'Application sent', id: 123, description: 'Applications for Google companies have entered for company review', time: '25 minutes ago' },
        { title: 'Application sent', id: 123, description: 'Applications for Google companies have entered for company review', time: '25 minutes ago' },
    ]);

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            style={[{
                flexDirection: 'row',
                paddingVertical: 16,
                paddingHorizontal: 12,
                backgroundColor: 'white',
                borderRadius: 20,
                marginTop: 10,
                marginHorizontal: regularPadding,
                width: width - regularPadding * 2,
            }, item.isRead && styles.isRead]}
            onPress={() => RootNavigation.navigate('NotificationDetail')}
        >
            <View style={{
                width: '20%',
                justifyContent: 'center',
                marginRight: 8,
                alignItems: 'center'
            }}>
                <Image source={GOOGLE} />
            </View>
            <View style={{
                flex: 1
            }}>
                <Text style={[titleFontStyle]}>{item?.title}</Text>
                <Text style={{
                    color: '#524B6B',
                    marginTop: 4,
                }}>{item?.description}</Text>
                <Text style={[placeholderFontStyle, { marginTop: 10 }]}>{item?.time}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <Container>
            <Header
                title='Thông báo'
                backArrow
                rightHeaderComponent={
                    <TouchableOpacity>
                        <Text style={{
                            color: orange
                        }}>
                            Read all
                        </Text>
                    </TouchableOpacity>
                }
            />
            {noti.length > 0 ?
                <FlatList
                    data={noti}
                    renderItem={renderItem}
                    style={{
                        height: '100%'
                    }}
                /> : <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={NO_NOTIFICATIONS} />
                    <Text style={[titleFontStyle, { fontSize: 20 }]}>No notifications</Text>
                    <Text style={{
                        marginTop: 20,
                        maxWidth: '70%',
                        textAlign: 'center',
                        marginBottom: 100
                    }}>You have no notifications at this time thank you</Text>
                </View>
            }
        </Container>
    )
}

export default Notifications

const styles = StyleSheet.create({
    isRead: {
        backgroundColor: purple
    }
})