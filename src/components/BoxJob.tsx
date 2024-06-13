import React from "react";
import { SafeAreaView, ScrollView, View, Image, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, Button } from 'react-native';
import {FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const { height: heightScreen } = Dimensions.get('window');

interface BoxJobh {
    handleCheckBoxIndex: () => void;
}

const BoxJob = () => {
    return (
        <View style={{ width: '100%', height: heightScreen / 5.3, backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 15 }}>
            <View style={{ margin: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: 40, height: 40, backgroundColor: '#d9d4d4', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                            <FontAwesome5 name="apple" size={26} color="black" />
                        </View>
                        <View>
                            <Text style={styles.textBoxFindJob}>Product Designer</Text>
                            <Text>Google inc . Califoria, USA</Text>
                        </View>
                    </View>
                    <View>
                        <FontAwesome name="bookmark-o" size={24} color="#524B6B" />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                    <Text>$15k</Text>
                    <Text>/Mo</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ backgroundColor: '#ebe8e8', marginRight: 10, paddingVertical: 8, paddingHorizontal: 8, borderRadius: 6 }}>
                            <Text>Senior desiger</Text>
                        </View >

                        <View style={{ backgroundColor: '#ebe8e8', marginRight: 10, paddingVertical: 8, paddingHorizontal: 8, borderRadius: 6 }}>
                            <Text>Full time</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: '#fcc0ca', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 6 }}>
                        <Text>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textBoxFindJob: {
        fontSize: 16,
        fontWeight: '600',
    }
})

export default BoxJob