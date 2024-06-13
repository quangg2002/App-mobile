// LoadingOverlay.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootReducer } from '../redux/store/reducer';
import { deepPurple } from '../styles/styles';

const LoadingOverlay = ({ children }) => {
    const { isLoading } = useSelector((state: RootReducer) => state.authReducer);

    return (
        <View style={styles.container}>
            {children}
            {isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color={deepPurple} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingOverlay;
