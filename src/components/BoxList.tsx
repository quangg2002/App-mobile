import React, { useState } from "react";
import { View, Dimensions, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

const heightScreen: number = Dimensions.get('window').height;
const widthScreen: number = Dimensions.get('window').width;
console.log(heightScreen)
console.log(widthScreen)

interface BoxListProps {
    text: string;
    quantity: any;
    image: any;
    widthImage: number;
    heightImage: number;
    height: number;
    width: any;
    rowGap: number;
    borderRadius: number;
}

const BoxList: React.FC<BoxListProps> = ({ text, quantity, height, width, rowGap, borderRadius, image, widthImage, heightImage }) => {
    const [chosenJob, setChosenJob] = useState<boolean>(false);

    const handleSpecialization = () => {
        setChosenJob(!chosenJob);
    }

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: chosenJob ? '#FCA34D' : 'white', height: height, width: width, rowGap: rowGap, borderRadius: borderRadius }]} onPress={handleSpecialization}>
            <View style={[styles.circle, { backgroundColor: chosenJob ? 'white' : '#faeae3', width: widthImage + 20, height: heightImage + 20 }]}>
                {/* <FontAwesome5 name="pencil-ruler" size={24} color="#FF9228" />
                 */}
                <Image source={image} style={{width: widthImage, height: heightImage}}></Image>
            </View>
            <Text style={[styles.nameJob, { color: chosenJob ? 'white' : '#000000' }]}>{text}</Text>
            <Text style={[styles.quantity, { color: chosenJob ? 'white' : '#AAA6B9' }]}>{quantity} jobs</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FCA34D',
        alignItems: 'center',
        justifyContent: 'center',
    },

    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100
    },

    nameJob: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white'
    },

    quantity: {
        color: 'white',
        fontSize: 12
    }
});

export default BoxList;
