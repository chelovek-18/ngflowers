import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button
} from 'react-native';

import IconFA from './../../node_modules/react-native-vector-icons/FontAwesome';

export default class ComponentMenu extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.button}>
                    <IconFA name="home" size={30} color="#900"/>
                    <Button title="One"/>
                </View>
                <View style={styles.button}>
                    <IconFA name="rocket" size={30} color="#900"/>
                    <Button title="Two"/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        marginTop: 16
    }
});