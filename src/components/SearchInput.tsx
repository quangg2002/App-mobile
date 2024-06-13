import React from 'react';
import { View, TextInput, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchInputProps {
    iconSize?: number,
    iconColor?: string,
    placeholder: string,
    style?: StyleProp<TextStyle>;
    onChangeText?: (text: string) => void;
};

const SearchInput = (props: SearchInputProps) => {
    const {
        iconSize = 16,
        iconColor = '#999',
        placeholder,
        style,
        onChangeText
    } = props;

    return (
        <View style={[styles.container, style]}>
            <Ionicons name={'search-outline'} size={iconSize} color={iconColor} style={styles.icon} />
            <TextInput style={[styles.input]} placeholder={placeholder} onChangeText={onChangeText} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        fontSize: 12,
    },
});

export default SearchInput;
