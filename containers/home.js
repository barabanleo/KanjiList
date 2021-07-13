import {Button, FlatList, Text, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("db.db");
import { AntDesign } from '@expo/vector-icons';
import Dialog from "react-native-dialog";


import { ScrollView, RefreshControl, StyleSheet, SafeAreaView } from 'react-native';
import {Touchable} from "react-native-web";




class HomeScreen extends React.Component{

    state = {
        items: null,
        refreshing:false,
        visible : false,
        itemsFavoris : null,
    };

    componentDidMount() {


        db.transaction(tx => {
            tx.executeSql(
                "create table if not exists items (id integer primary key not null, word text , date_add int , favoris boolean );"
            );
        });

        db.transaction(tx => {
            tx.executeSql(
                "SELECT DISTINCT date_add from items ORDER BY date_add DESC;",
                [],
                ( _, { rows: { _array } }) => this.onChangeItems(_array)
            );
        });


    }

    getTodayDate() {

        var today = new Date();

        var month = (today.getMonth()+1).toString()
        if(month < 10) {
            month = 0+month
        }

        var day = (today.getDate()).toString()
        if (day < 10){
            day = 0+day
        }

        var date = today.getFullYear().toString()+month+day;

        return date;
    }


    deleteAllWord (){

        db.transaction(tx => {
            tx.executeSql(
                "DELETE from items;",
                [],
                ( _) => this.setState({ items: "" } )
            );
        });

        console.log("Delete word")
    };



    ListViewItemSeparator = () => {
        return (
            <View
                style={{
                    height: 0.2,
                    width: '90%',
                    backgroundColor: '#808080',
                }}
            />
        );
    };

    onRefresh() {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT DISTINCT date_add from items ORDER BY date_add DESC;",
                [],
                ( _, { rows: { _array } }) => this.onChangeItems(_array)
            );
        });
    }

    onChangeItems(_array){

        console.log(_array)

        let today = this.getTodayDate();
        for (const item in _array) {

            if (today - _array[item].date_add == 0) {
                _array[item].text = "Aujourdhui"
            } else if (today - _array[item].date_add == -1) {
                _array[item].text = "Hier"
            } else if (today - _array[item].date_add == 1) {
                _array[item].text = "Demain"
            } else {
                _array[item].text = (_array[item].date_add).toString();
            }

        }

        this.setState({ items: _array });
    }

    showDialog() {
        this.setState({
            visible : true
        })
    }

    onDeleteList(date_add) {

        db.transaction(tx => {
            tx.executeSql(
                "DELETE from items WHERE date_add = (?);",
                [date_add],
                ( _) => {
                    this.onRefresh();
                    this.setState({
                        visible : false
                    })
                });
        });

    }

    onCancelDeleteList(){
        this.setState({
            visible : false
        })
    }



    render() {

        const { items , visible} = this.state;
        const { navigate } = this.props.navigation;


        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor : "black" }}>
                <Text>Liste de mots</Text>

                {items == undefined || items == "" ?

                    <Text
                        style ={{textAlign:"center", color: "white" ,  width : '66%' , alignItems: "center" , alignSelf:'center' , fontSize : 20 , fontWeight :"bold" ,padding:20 , marginTop:20}}
                    >
                        Pas de mots dans la BDD
                    </Text> :

                    <View
                    style = {{ width : "100%" , fontSize : 20}}
                    >


                        <TouchableOpacity
                            key="favoris"
                            onPress={ () => this.props.navigation.navigate('ListWord', {
                                dateList : "favoris",
                                name : "Favoris"
                            })}
                            style={{
                                backgroundColor:  "#1c9963" ,
                                borderColor: "#000",
                                borderWidth: 1,
                                padding: 20 ,
                            }}>

                            <View
                                style={{flexDirection : 'row' , justifyContent:'space-between' }}
                            >
                                <Text style={{ color:  "#fff", fontSize : 20 }}>Favoris</Text>

                            </View>


                        </TouchableOpacity>

                        <FlatList
                            data={items}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.ListViewItemSeparator}
                            enableEmptySections={true}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    key={(item.date_add).toString()}
                                    onPress={ () => this.props.navigation.navigate('ListWord', {
                                        dateList : item.date_add,
                                        name : item.text
                                    })}
                                    style={{
                                        backgroundColor:  "#1c9963" ,
                                        borderColor: "#000",
                                        borderWidth: 1,
                                        padding: 20 ,
                                    }}>

                                    <View
                                    style={{flexDirection : 'row' , justifyContent:'space-between' }}
                                    >
                                        <Text style={{ color:  "#fff", fontSize : 20 }}>{item.text}</Text>

                                        <TouchableOpacity
                                            onPress={ () => this.showDialog()} >
                                            <AntDesign name="closecircle" size={30} color="white" style={{  }} />
                                        </TouchableOpacity>


                                        <Dialog.Container visible={visible}>
                                            <Dialog.Title>Delete List</Dialog.Title>
                                            <Dialog.Description>
                                                Do you want to delete this list? You cannot undo this action.
                                            </Dialog.Description>
                                            <Dialog.Button label="Cancel" onPress={ () => this.onCancelDeleteList() } />
                                            <Dialog.Button label="Delete" onPress={ () => this.onDeleteList(item.date_add) } />
                                        </Dialog.Container>
                                    </View>


                                </TouchableOpacity>
                            )}
                            refreshControl={
                                <RefreshControl
                                    //refresh control used for the Pull to Refresh
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                        />


                        <Text
                            style ={{color :"red", textAlign:"center", backgroundColor: "white" ,borderRadius:60 ,  width : '66%' , alignItems: "center" , alignSelf:'center' , fontSize : 20 , fontWeight :"bold" ,padding:20 , marginTop:20}}
                            onPress={ () => this.deleteAllWord() }
                        >
                            DELETE ALL
                            <AntDesign name="delete" size={30} color="red" />
                        </Text>

                    </View>

                }

            </View>
        );

    }

};

export default HomeScreen;