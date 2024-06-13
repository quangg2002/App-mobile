import React, { useState } from 'react';

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';

import RootNavigation from '@/route/RootNavigation';
import { deepPurple } from '@/styles/styles';
import { AntDesign } from '@expo/vector-icons';

const VideoStream = ({ route }) => {
    const [uri, setUri] = useState(route.params.uriVideo || '');

    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleClose = () => {
        RootNavigation.pop();
    };

    return (
        <View style={styles.fullScreenImage}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <AntDesign name="closecircleo" size={30} color="red" />
            </TouchableOpacity>
            <Video
                source={{ uri: uri }}
                style={{ flex: 1 }}
                paused={!isPlaying}
                resizeMode="contain"
            />
            <View style={styles.controlBar}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    hitSlop={{ right: 10, top: 10, left: 10, bottom: 10 }}
                    onPress={togglePlay}
                >
                    <AntDesign name="pausecircle" size={30} color={deepPurple} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreenImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 100,
        right: 20,
        zIndex: 1,
    },
    controlBar: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
});

export default VideoStream;
