import * as React from 'react';
import {Alert, Button, Text, TouchableOpacity, View} from 'react-native';
import { NavigationContainer  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import HomeScreen  from './containers/home';
import AddWordScreen  from './containers/addWord';
import ListWordScreen  from './containers/listWord';

import { MenuProvider } from 'react-native-popup-menu';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';


import { SQLite } from "expo-sqlite";

//File manager
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';


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


async function saveFile(){

    try{

        const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (newPermission.status === 'granted') {

            let fileUri = FileSystem.documentDirectory + "text.txt";
            await FileSystem.writeAsStringAsync(fileUri, "Hello World", { encoding: FileSystem.EncodingType.UTF8 });
            const asset = await MediaLibrary.createAssetAsync(fileUri)
            await MediaLibrary.createAlbumAsync("Download", asset, false)
        }



    } catch (e) {
        alert(e)
    }

}



async function openFile(){

    let result = await DocumentPicker.getDocumentAsync({});
    alert(result.uri);
    console.log(result);

}

export default function App() {
  return (
      <MenuProvider>
          <NavigationContainer initialRouteName="Home" >
            <Stack.Navigator >
                <Stack.Screen
                    name="Homee"
                    component={Home}
                    options={{
                        headerRight : () => (
                            <View>
                                    <Menu>
                                        <MenuTrigger text='Select action' />
                                        <MenuOptions>
                                            <MenuOption onSelect={() => saveFile()} text='Export' />
                                            <MenuOption onSelect={() => openFile()} text='Import' >
                                                <Text style={{color: 'red'}}>Delete</Text>
                                            </MenuOption>
                                            <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
                                        </MenuOptions>
                                    </Menu>
                            </View>
                        )
                    }}

                />
                <Stack.Screen name="ListWord" component={ListWordScreen} options={({ route }) => ({ title: route.params.name })}/>
            </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>

  );
}


