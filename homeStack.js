import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer   } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';



import HomeScreen  from './containers/home';
import AddWordScreen  from './containers/addWord';

import ListWordScreen  from './containers/listWord';


import { SQLite } from "expo-sqlite";

const Tab = createBottomTabNavigator();




function Home() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Index" component={HomeScreen} props={}/>
            <Tab.Screen name="Ajouter mot" component={AddWordScreen} />
        </Tab.Navigator>
    );
}


const screens = {
    Home : {
        screen: Home
    },
    ListWord : {
        screen: ListWordScreen
    },
}

const HomeStack = createStackNavigator(screens);

export default  NavigationContainer(HomeStack);


