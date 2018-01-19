import { Navigation } from 'react-native-navigation';

import Home from './Home';

import ComponentMenu from './../components/Menu';

export function registerScreens() {
    Navigation.registerComponent( 'ngflowers.Home', () => Home );
    
    Navigation.registerComponent( 'ngflowers.Components.Menu', () => ComponentsMenu );
}