import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Container from '@/components/Container';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { ParseConversationId } from '@/utils/utils';
import { useSelector } from 'react-redux';
import { RootReducer } from '@/redux/store/reducer';
import RootNavigation from '@/route/RootNavigation';

const Test = () => {
    const [text, setText] = useState('');
    const { phoneNumber } = useSelector((state: RootReducer) => state.authReducer);

    const addConversation = async (chatFriend) => {
        try {
            const participants = [phoneNumber, chatFriend];
            const conversationId = ParseConversationId(participants);
            await firestore()
                .collection('conversations_col')
                .doc(conversationId)
                .set({
                    participants,
                    messages: []
                }, {
                    merge: true
                });
            RootNavigation.navigate('ChatScreen', { data: { chatFriendPhone: chatFriend, participants, messages: [] } });
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <Container>
            <TextInput value={text} onChangeText={setText} />
            <Button title='test di' onPress={() => addConversation(text)}>

            </Button>
        </Container>
    )
}

export default Test;