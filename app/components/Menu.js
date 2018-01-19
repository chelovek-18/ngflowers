import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button
} from 'react-native';

import IconFA from './../../node_modules/react-native-vector-icons/FontAwesome';

export default class ComponentMenu extends React.Component {
    closeMenu = () => {
        this.props.navigator.toggleDrawer({
            to: 'close'
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <IconFA
                        name="close"
                        style={styles.close}
                        size={30}
                        color="#000"
                        onPress={this.closeMenu}/>
                </View>
                <View style={styles.button}>
                    <IconFA name="home" size={30} color="#900"/>
                    <Button title="One"/>
                </View>
                <View style={styles.button}>
                    <IconFA name="rocket" size={30} color="#900"/>
                    <Button title={ "quick".t }/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 15
    },
    close: {
        textAlign: 'right',
        marginTop: 40,
        marginBottom: 30
    },
    button: {
        flexDirection: 'row'
    }
});