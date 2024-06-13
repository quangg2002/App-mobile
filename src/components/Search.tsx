import React from "react";
import { View, Dimensions, TextInput, StyleSheet } from "react-native";
import { EvilIcons } from '@expo/vector-icons';

const heightScreen = Dimensions.get('window').height;

type SearchProps = {
    text: string;
    button: any;
    width: any;
    onChangeText?: (text: string) => void;
};

const Search: React.FC<SearchProps> = ({ text, button, width, onChangeText }) => {
    return (
        <View style={[styles.search, { width: width }]}>
            {/* <EvilIcons name="search" size={26} color="gray" style={{ marginLeft: 6 }} /> */}
            {button}
            <TextInput
                placeholder={text}
                style={{
                    height: heightScreen / 19,
                    marginLeft: 3
                }}
                onChangeText={onChangeText}
            >
            </TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    search: {
        flexDirection: 'row',
        borderRadius: 10,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },

})

export default Search