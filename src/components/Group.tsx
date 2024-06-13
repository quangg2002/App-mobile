import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { regularPadding } from '../styles/styles'

const Group = (props) => {
    return (
        <View style={{
            marginHorizontal: regularPadding,
            paddingHorizontal: regularPadding,
            paddingVertical: regularPadding,
            borderRadius: 20,
            backgroundColor: 'white'
        }}>
            {props.children}
        </View>
    )
}

export default Group

const styles = StyleSheet.create({})