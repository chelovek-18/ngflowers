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
                    <IconFA name="list" style={{ fontSize: 30 }} size={30} color="#000"/>
                    <Button title={ "Каталог".t() }/>
                </View>
                <View style={styles.button}>
                    <IconFA name="gift" style={{ fontSize: 30 }} size={30} color="#000"/>
                    <Button title={ "Акции".t() }/>
                </View>
                <View style={styles.button}>
                    <IconFA name="user" style={{ fontSize: 30 }} size={30} color="#000"/>
                    <Button title={ "Войти".t() }/>
                </View>
                <View style={styles.button}>
                    <IconFA name="history" style={{ fontSize: 30 }} size={30} color="#000"/>
                    <Button title={ "История заказов".t() }/>
                </View>
                <View style={styles.button}>
                    <IconFA name="credit-card-alt" style={{ fontSize: 30 }} size={30} color="#000"/>
                    <Button title={ "Кэшбек".t() }/>
                </View>
                <View style={styles.button}>
                    <IconFA name="star" style={{ fontSize: 30 }} size={30} color="#000"/>
                    <Button title={ "Бонусы".t() }/>
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
        marginBottom: 20
    },
    button: {
        flexDirection: 'row'
    }
});