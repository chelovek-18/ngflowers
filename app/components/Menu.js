import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button
} from 'react-native';

export default class ComponentMenu extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.button}>
                    <Button title="One"/>
                </View>
                <View style={styles.button}>
                    <Button title="Two"/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'top',
        justifyContent: 'left'
    },
    button: {
        marginTop: 16
    }
});