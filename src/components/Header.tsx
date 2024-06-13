import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from '../route/RootNavigation';

const Header = (props: {
    title?: string,
    backArrow?: boolean,
    leftHeaderComponent?: ReactNode,
    leftHeaderCallback?: () => void,
    rightHeaderComponent?: ReactNode,
    rightHeaderCallback?: () => void,
    style?: ViewStyle
}) => {

    const {
        title,
        backArrow,
        leftHeaderComponent,
        leftHeaderCallback,
        rightHeaderComponent,
        style,
        rightHeaderCallback
    } = props;

    return (
        <View style={[styles.container, style]}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {backArrow &&
                    <TouchableOpacity
                        style={{
                            marginRight: 20,
                        }}
                        onPress={() => RootNavigation.pop()}
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                }
                <TouchableOpacity
                    onPress={leftHeaderCallback}
                    style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    {leftHeaderComponent}
                </TouchableOpacity>
            </View>
            {title &&
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={styles.titleFontStyle}>
                        {title}
                    </Text>
                </View>
            }
            <View style={{
                flex: 1,
                alignItems: 'flex-end'
            }}>
                {rightHeaderComponent &&
                    <TouchableOpacity
                        onPress={rightHeaderCallback}
                    >
                        {rightHeaderComponent}
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        alignItems: 'center'
    },
    titleFontStyle: {
        fontWeight: '600',
        fontSize: 16
    }
})