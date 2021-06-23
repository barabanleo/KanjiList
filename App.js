import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';


import HomeScreen  from './containers/home';
import AddWordScreen  from './containers/addWord';

import ListWordScreen  from './containers/listWord';


import { SQLite } from "expo-sqlite";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



function Home() {
    return (
        <Tab.Navigator initialRouteName="Add">
            <Tab.Screen name="Index" component={HomeScreen} />
            <Tab.Screen name="Add" component={AddWordScreen} />
        </Tab.Navigator>
    );
}


export default function App() {
  return (
    <NavigationContainer initialRouteName="Home" >
        <Stack.Navigator >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ListWord" component={ListWordScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}


