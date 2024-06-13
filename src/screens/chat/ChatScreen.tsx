import { Text, View, StyleSheet, Platform, TouchableOpacity, ActivityIndicator, Linking, Keyboard, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { deepPurple, orange, placeholderTextColor, regularPadding, titleFontStyle } from '../../styles/styles'
import { Bubble, Composer, GiftedChat, IChatMessage, InputToolbar, MessageImage, Send } from 'react-native-gifted-chat'
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { RootReducer } from '@/redux/store/reducer';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { ParseConversationId } from '@/utils/utils'
import { useSelector } from 'react-redux';
import Container from '@/components/Container';
import RootNavigation from '@/route/RootNavigation';
import Header from '@/components/Header';
import AVATAR from '../../assets/images/avt.png'
import CHAT_HERE from '../../assets/images/chat-here.png'
import { Feather } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';

export interface Message {
    id: string,
    content: string,
    sentAt: FirebaseFirestoreTypes.Timestamp,
    sentBy: string,
    image?: string,
    video?: string,
    file?: AttachedFile,
};

export interface ChatRoom {
    participants: string[],
    messages: Message[],
};

export interface AttachedFile {
    type: string,
    url: string,
    fileName: string
};

const ChatScreen = (props) => {
    const { phoneNumber } = useSelector((state: RootReducer) => state.authReducer);
    const { messages: initMessages, participants: initParticipants, chatFriendPhone } = props.route.params.data;
    const [participants, setParticipants] = useState(initParticipants);
    const [sendLoading, setSendLoading] = useState(false);
    const [messages, setMessages] = useState<IChatMessage[]>(
        initMessages?.map((item) => {
            return {
                _id: item.id,
                sentAt: item.sentAt,
                user: {
                    _id: item.sentBy
                },
                ...item,
            }
        }) || []
    );

    const convertMessageToSave = (array: IChatMessage[] | [{ user: { _id: string }, image: string, video: string, file: AttachedFile }]) => {
        return array.map(message => ({
            content: message.text ?? '',
            sentAt: firestore.Timestamp.fromDate(new Date()),
            sentBy: message.user._id,
            image: message.image ?? '',
            video: message.video ?? '',
            file: message.file ?? {
                url: '',
                type: '',
                fileName: '',
            }
        }));
    };

    const convertMessageToRender = (array: ChatRoom) => {
        const sortedMessages = array.messages.sort((a, b) => b.sentAt.toMillis() - a.sentAt.toMillis());

        return sortedMessages.map((message: Message) => ({
            _id: message.id ?? '',
            text: message.content ?? '',
            createdAt: message.sentAt?.toDate?.(),
            user: {
                _id: message.sentBy,
                name: message.sentBy
            },
            image: message.image ?? '',
            video: message.video ?? '',
            file: message.file?.url && message.file
        }));
    };

    const fetchData = useCallback(() => {
        const conversationId = ParseConversationId(participants);
        const unsubscribe = firestore()
            .collection('conversations_col')
            .doc(conversationId)
            .onSnapshot((docSnapshot) => {
                if (docSnapshot.exists) {
                    setParticipants(docSnapshot.data().participants);
                    setMessages(convertMessageToRender(docSnapshot.data() as ChatRoom));
                }
            });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const unsubscribe = fetchData();
        return () => {
            unsubscribe();
        };
    }, [fetchData]);

    const onSend = useCallback(async (messages: IChatMessage[] = [], image?: string, video?: string, file?: AttachedFile) => {
        console.log('vide', video)
        setSendLoading(true);
        try {
            const messageData = convertMessageToSave(image || file?.url || video
                ? [
                    {
                        user: {
                            _id: phoneNumber,
                        },
                        image: image ?? '',
                        video: video ?? '',
                        file: file ?? {
                            type: '',
                            fileName: '',
                            url: ''
                        }
                    },
                ]
                : messages
            );
            const conversationId = ParseConversationId(participants);
            const conversationRef = firestore().collection('conversations_col').doc(conversationId);

            await firestore().runTransaction(async (transaction) => {
                const docSnapshot = await transaction.get(conversationRef);
                const currentMessages: any[] = docSnapshot?.data()?.messages || [];
                const updatedMessages = currentMessages.concat(
                    messageData.map((message) => ({
                        ...message,
                        id: firestore().collection('dummy').doc().id,
                    }))
                );
                transaction.update(conversationRef, { messages: updatedMessages });
            });
        } catch (error) {
            console.log('error', error)
            Toast.show({
                type: 'error',
                props: {
                    title: 'Đã có lỗi xảy ra',
                    content: 'Không thể gửi tin nhắn',
                },
            });
        } finally {
            setSendLoading(false);
        }
    }, []);

    const openPdf = async (pdfUri) => {
        try {
            const supported = await Linking.canOpenURL(pdfUri);
            if (supported) {
                await Linking.openURL(pdfUri);
            } else {
                console.error('Cannot open PDF: ', pdfUri);
            }
        } catch (error) {
            console.error('Error opening PDF: ', error);
        }
    };

    const renderBubble = (props) => {
        const { currentMessage } = props;
        const file: AttachedFile = currentMessage.file;

        return (
            <Bubble
                {...props}
                renderCustomView={() => {
                    if (file?.url)
                        return (
                            <View style={{
                                paddingHorizontal: regularPadding,
                                paddingVertical: regularPadding,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRadius: 10,
                                marginHorizontal: 10,
                                marginVertical: regularPadding / 2,
                                backgroundColor: '#f5f5f5'
                            }}>
                                <TouchableOpacity
                                    onPress={() => file?.url && openPdf(file.url)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: deepPurple,
                                        borderRadius: 20,
                                        width: 40,
                                        height: 40,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FontAwesome name="cloud-download" size={24} color={deepPurple} />
                                </TouchableOpacity>
                                <Text style={{
                                    color: deepPurple,
                                    marginLeft: 12
                                }}>
                                    {file.fileName ?? 'Không có tên file'}
                                </Text>
                            </View>
                        )
                    return null;
                }}
                wrapperStyle={{
                    right: {
                        backgroundColor: deepPurple
                    },
                    left: {
                        backgroundColor: '#fae7e2',
                    }
                }}
            />
        );
    };

    const renderChatFooter = () => {
        return <View style={{ height: 24 }} />;
    };

    const renderInputToolbar = (props) => {
        return <InputToolbar
            {...props}
            primaryStyle={{
                alignItems: 'center',
            }}
            containerStyle={{
                backgroundColor: 'white',
                paddingHorizontal: regularPadding,
                paddingVertical: 6,
                alignContent: 'center',
                marginHorizontal: regularPadding / 2,
                borderRadius: 20,
                marginBottom: 10,
                borderTopWidth: 0
            }}
            renderComposer={(composerProps) => (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            marginRight: regularPadding
                        }}
                    >
                        <FontAwesome name="image" size={20} color={deepPurple} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickDocument}>
                        <MaterialIcons name="attachment" size={24} color={deepPurple} />
                    </TouchableOpacity>
                    <Composer
                        {...composerProps}
                        placeholder="Write a message..."
                        placeholderTextColor="lightgray"
                        textInputStyle={{
                            fontSize: 14,
                            borderColor: 'lightgray',
                            width: '80%',
                            paddingLeft: 10
                        }}
                    />
                </View>
            )}
        />
    }

    const renderSend = (props) => {
        return <Send
            {...props}
            disabled={sendLoading}
            containerStyle={{
                justifyContent: 'center',
            }}
        >
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: deepPurple
            }}>
                {sendLoading
                    ? <ActivityIndicator size={18} />
                    : <Ionicons name="send" size={18} color={'white'} />
                }
            </View>
        </Send>;
    };

    const renderMessageImage = (props) => {
        return (
            <MessageImage
                {...props}
                imageStyle={{
                    resizeMode: 'cover'
                }}
            />
        )
    };

    const renderChatEmpty = () => (
        <View
            style={{
                ...Platform.select({
                    ios: {
                        transform: [{ scaleY: -1 }],
                    },
                    android: {
                        transform: [{ scaleX: -1 }, { scaleY: -1 }],
                    },
                }),
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    width: 200,
                    height: 200,
                    justifyContent: 'center',
                    marginBottom: 30
                }}
            >
                <Image source={CHAT_HERE} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
            </View>
            <View>
                <Text
                    style={{
                        fontStyle: 'italic',
                        color: placeholderTextColor,
                        fontSize: 16
                    }}
                >
                    Hãy đặt câu hỏi tại đây
                </Text>
            </View>
        </View>
    );

    const pickDocument = async () => {
        try {
            const result: DocumentPicker.DocumentPickerResult = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                console.log('Document picked:', result);
                const { uri, name } = result.assets[0];
                await uploadFile(uri, name);
            } else {
                console.log('Document picking cancelled');
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.3,
        });

        if (!result.canceled) {
            await uploadImage(result.assets[0]);
        }
    };

    const uploadImage = async (assets: ImagePicker.ImagePickerAsset) => {
        setSendLoading(true);
        try {
            const response = await fetch(assets.uri);
            const blob = await response.blob();
            if (assets.type == 'image') {
                const storageRef = storage().ref(`images/${new Date().getTime()}`);
                await storageRef.put(blob);
                const downloadURL = await storageRef.getDownloadURL();
                await onSend([], downloadURL);
            }
            else {
                const storageRef = storage().ref(`videos/${new Date().getTime()}`);
                await storageRef.put(blob);
                const downloadURL = await storageRef.getDownloadURL();
                await onSend([], '', downloadURL);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setSendLoading(false);
        }
    };

    const uploadFile = async (uri: string, originalFileName: string) => {
        setSendLoading(true);
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileType = originalFileName.split('.').pop();
            const storageRef = storage().ref(`pdfs/${originalFileName}_${new Date().getTime()}.${fileType}`);
            await storageRef.put(blob);
            const downloadURL = await storageRef.getDownloadURL();
            await onSend([], '', '', {
                type: fileType,
                url: downloadURL,
                fileName: originalFileName
            });
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setSendLoading(false);
        }
    };

    const renderMessageVideo = (props) => (
        <TouchableOpacity style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: deepPurple,
        }}
            onPress={() => RootNavigation.navigate('VideoStream', { uriVideo: props.currentMessage?.video })}
        >
            <Video
                source={{ uri: props.currentMessage?.video }}
                style={{ width: 200, height: 200 }}
                shouldPlay={false}
            />
            <View style={{ position: 'absolute' }}>
                <AntDesign name="play" size={50} color="white" />
            </View>
        </TouchableOpacity>
    );

    return (
        <Container
            statusBarColor='white'
            statusBarContentColor='dark'
        >
            <Header
                leftHeaderComponent={
                    <>
                        <Image source={AVATAR} style={styles.imageBox} />
                        <Text style={[titleFontStyle, { fontSize: 16 }]}>{chatFriendPhone}</Text>
                    </>
                }
                backArrow
                rightHeaderComponent={< Feather name="video" size={24} color={orange} />}
                rightHeaderCallback={() => RootNavigation.navigate('CallScreen', { calleePhone: chatFriendPhone })}
                style={{
                    backgroundColor: 'white'
                }}
            />

            <TouchableOpacity
                style={{
                    flex: 1,
                    paddingHorizontal: regularPadding / 2
                }}
                activeOpacity={1}
                onPress={Keyboard.dismiss}
            >
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: phoneNumber,
                        name: phoneNumber,
                    }}
                    messagesContainerStyle={{
                        backgroundColor: 'transparent'
                    }}
                    textInputProps={{
                        placeholder: "Enter your message...",
                    }}
                    alwaysShowSend
                    renderBubble={renderBubble}
                    renderInputToolbar={renderInputToolbar}
                    renderSend={renderSend}
                    renderMessageImage={renderMessageImage}
                    renderMessageVideo={renderMessageVideo}
                    renderChatEmpty={renderChatEmpty}
                    renderAvatarOnTop
                    renderChatFooter={renderChatFooter}
                />
            </TouchableOpacity>
        </Container >
    )
}

const styles = StyleSheet.create({
    imageBox: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 20,
    }
});


export default ChatScreen;
