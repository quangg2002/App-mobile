import { FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import SearchInput from '../../components/SearchInput'
import { deepPurple, orange, placeholderTextColor, regularPadding, titleFontStyle } from '../../styles/styles'
import AVATAR from '../../assets/images/avt.png'
import NO_MESSAGES from '../../assets/images/no_messages.png'
import { Feather } from '@expo/vector-icons';
import RootNavigation from '../../route/RootNavigation'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducer } from '../../redux/store/reducer'
import { SimpleLineIcons } from '@expo/vector-icons';
import { saveChatRoom } from '../../redux/slice/chatSlice'
import { ChatRoom } from './ChatScreen'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import BottomModal from '@/components/BottomModal'
import { debounce } from 'lodash'
import Toast from 'react-native-toast-message'
import { ParseConversationId } from '@/utils/utils'


const Messages = () => {
    const dispatch = useDispatch();
    const { chatRoom: initChatRoom } = useSelector((state: RootReducer) => state.chatReducer);
    const [chatRoom, setChatRoom] = useState<ChatRoom[]>([]);
    const [filteredChatRoom, setFilteredChatRoom] = useState<ChatRoom[]>([]);
    const { phoneNumber } = useSelector((state: RootReducer) => state.authReducer);
    const width = useWindowDimensions().width;
    const [showBottomModal, setShowBottomModal] = useState(false);
    const [textSearch, setTextSearch] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<string[]>();

    const deleteConversation = async (conversationId) => {
        try {
            await firestore()
                .collection('conversations_col')
                .doc(ParseConversationId(conversationId))
                .delete();

            Toast.show({
                type: 'notification',
                props: {
                    title: 'Thông báo',
                    content: 'Đã xóa tin nhắn.'
                }
            });
        } catch (error) {
            console.error('Error deleting conversation: ', error);
        }
    };

    useEffect(() => {
        const data = initChatRoom?.map(item => {
            return {
                ...item,
                messages: item.messages.map(message => {
                    return {
                        ...message,
                        sentAt: firestore.Timestamp.fromDate(new Date(message?.sentAt))
                    }
                })
            }
        }) || [];
        setChatRoom(data);
    }, [initChatRoom]);

    const filterList = () => {
        if (textSearch.trim() == '') {
            setFilteredChatRoom(chatRoom);
        } else {
            setFilteredChatRoom(chatRoom.filter(item => {
                const chatFriend = item.participants.filter(friend => friend != phoneNumber)[0];
                return chatFriend.includes(textSearch);
            }))
        };
    };

    useEffect(() => {
        const debounceSearch = debounce(filterList, 300);
        debounceSearch();
        return debounceSearch.cancel;
    }, [textSearch, chatRoom]);

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = firestore()
                .collection('conversations_col')
                .where('participants', 'array-contains', phoneNumber)
                .onSnapshot((querySnapshot) => {
                    let tempChatRoom = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        tempChatRoom = [
                            ...tempChatRoom,
                            {
                                ...data,
                                messages: data.messages.map((item) => {
                                    return { ...item, sentAt: item.sentAt.toDate().toISOString() };
                                }),
                            },
                        ];
                    });
                    dispatch(saveChatRoom(tempChatRoom));
                });

            return unsubscribe;
        }, [phoneNumber])
    );

    const formatTimeDifference = (timestamp: FirebaseFirestoreTypes.Timestamp): string => {
        if (!timestamp) return '-';
        const timestampFromFirestore = timestamp?.toDate?.();
        const currentTimestamp = new Date();
        const timeDifference = currentTimestamp.getTime() - timestampFromFirestore.getTime();
        const timeDifferenceInSeconds = Math.floor(timeDifference / 1000);
        if (timeDifferenceInSeconds < 60) {
            return `${timeDifferenceInSeconds} giây`;
        } else if (timeDifferenceInSeconds < 3600) {
            const minutes = Math.floor(timeDifferenceInSeconds / 60);
            return `${minutes} phút`;
        } else if (timeDifferenceInSeconds < 86400) {
            const hours = Math.floor(timeDifferenceInSeconds / 3600);
            return `${hours} giờ`;
        } else {
            const days = Math.floor(timeDifferenceInSeconds / 86400);
            return `${days} ngày`;
        }
    };

    const renderItem = ({ item }: { item: ChatRoom }) => {
        const messages = item.messages;
        const chatFriendPhone = item.participants.filter(item => item != phoneNumber)[0];

        return (
            <ScrollView
                horizontal
                pagingEnabled
                scrollToOverflowEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
            >
                <View style={{
                    flexDirection: 'row',
                }}>
                    <TouchableOpacity
                        onLongPress={() => {
                            setShowBottomModal(true);
                            setSelectedMessage(item.participants);
                        }}
                        onPress={() => RootNavigation.navigate('ChatScreen', { data: { ...item, chatFriendPhone } })}
                        style={{
                            flexDirection: 'row',
                            paddingVertical: 16,
                            paddingHorizontal: 12,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            marginTop: 10,
                            marginHorizontal: regularPadding,
                            width: width - regularPadding * 2,
                        }}>
                        <View style={{
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            marginRight: 12
                        }}>
                            <Image
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 25,
                                }}
                                resizeMode='contain'
                                source={AVATAR}
                            />
                        </View>
                        <View style={[styles.inbox]}>
                            <View style={[styles.row]}>
                                <Text style={[titleFontStyle]}>
                                    {chatFriendPhone}
                                </Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: placeholderTextColor
                                }}>
                                    {formatTimeDifference(messages.length > 0 && messages[messages.length - 1].sentAt)}
                                </Text>
                            </View>
                            <View style={[styles.row, { marginTop: 8 }]}>
                                <View>
                                    <Text>
                                        {messages.length > 0 ? (messages[messages.length - 1].content || `Đã gửi một ${messages[messages.length - 1]?.image == '' ? 'file' : 'ảnh'}`) : 'Chưa có tin nhắn'}
                                    </Text>
                                </View>
                                {/* <View style={{
                                    backgroundColor: orange,
                                    width: 20,
                                    height: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10
                                }}>
                                    <Text style={[
                                        { color: backgroundColor },
                                    ]}>
                                        {2}
                                    </Text>
                                </View> */}
                            </View>
                        </View >
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        backgroundColor: '#fae7e2',
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        marginTop: 10,
                        marginRight: regularPadding
                    }}>
                        <Feather name="trash-2" size={24} color={orange} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    };

    return (
        <Container>
            <Header
                title='Trò chuyện'
                rightHeaderComponent={<SimpleLineIcons name="options-vertical" size={16} color="black" />}
                rightHeaderCallback={() => RootNavigation.navigate('Test')}
            />

            <FlatList
                data={filteredChatRoom}
                renderItem={renderItem}
                style={{
                    height: '100%'
                }}
                ListHeaderComponent={
                    <View style={[styles.container]}>
                        <SearchInput
                            placeholder="Tìm kiếm"
                            onChangeText={setTextSearch}
                            style={{
                                borderWidth: 0,
                                backgroundColor: 'white',
                                paddingVertical: 16,
                                borderRadius: 10,
                                marginHorizontal: 16
                            }}
                        />
                    </View>
                }
                ListEmptyComponent={
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image source={NO_MESSAGES} />
                        <Text style={[titleFontStyle, { fontSize: 20 }]}>Không có tin nhắn</Text>
                        <Text style={{
                            marginTop: 20,
                            maxWidth: '70%',
                            textAlign: 'center',
                            marginBottom: 100
                        }}>Hãy kết nối với mọi người tại đây</Text>
                    </View>
                }
            />
            <BottomModal
                showBottomModal={showBottomModal}
                setShowBottomModal={setShowBottomModal}
                options={[
                    {
                        icon: <Feather name="trash-2" size={24} color={deepPurple} />,
                        title: 'Xóa tin nhắn',
                        onPressOption: () => {
                            deleteConversation(selectedMessage)
                        }
                    },
                    {
                        icon: <Feather name="settings" size={24} color={deepPurple} />,
                        title: 'Cài đặt',
                        onPressOption: () => {
                            RootNavigation.navigate('Setting')
                        }
                    }
                ]}
            />
        </Container >
    )
};

export default Messages;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    inbox: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});