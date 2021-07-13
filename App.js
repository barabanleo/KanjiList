import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import HomeScreen  from './containers/home';
import AddWordScreen  from './containers/addWord';

import ListWordScreen  from './containers/listWord';


import { SQLite } from "expo-sqlite";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



function Home() {
    return (
        <Tab.Navigator initialRouteName="Index"
                       tabBarOptions={{
                           activeTintColor: '#e91e63',
                       }}>

            <Tab.Screen name="Index"
                        component={HomeScreen}
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="home" color={color} size={size} />
                            ),
                        }}

            />
            <Tab.Screen name="Add"
                        component={AddWordScreen}
                        options={{
                            tabBarLabel: 'Ajouter',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="plus" color={color} size={size} />
                            ),
                        }}
            />
        </Tab.Navigator>
    );
}


export default function App() {
  return (
    <NavigationContainer initialRouteName="Home" >
        <Stack.Navigator >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ListWord" component={ListWordScreen} options={({ route }) => ({ title: route.params.name })}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}


