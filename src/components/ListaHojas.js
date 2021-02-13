import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, Pressable, StyleSheet, TextInput, Alert } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Colors from 'concevContabilidad/src/res/colors';
import Hoja from 'concevContabilidad/src/components/Hoja';

var db = openDatabase({ name: 'concev.db', createFromLocation : 1});

const ListaHojas  = () =>{
    let [flatListItems, setFlatListItems] = useState([]);

    useEffect(() => {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM hoja', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        });
      });
    }, []);

    return(
        <View style = {styles.container}>
            <View style = {styles.contenedorFlatlist}>
                <FlatList
                    data = {flatListItems}
                    keyExtractor={(item, index) => item.cod_Hoja}
                    renderItem= { ({item}) =>
                        <Hoja
                            data= {item}
                            onPressEntrar={() => this.seleccionarHoja(item)}
                        />
                    }  
                />
            </View>
            <View style = {styles.footer}>
                <View style = {styles.footerRow}>
                    <TextInput 
                        style = {styles.textInput}
                        placeholder='Nombre Hoja'
                        placeholderTextColor='white'
                        underlineColorAndroid='transparent'
                    >
                    </TextInput>
                    <Pressable onPress = {() => this.añadirHoja()} style = {styles.botonAñadir}>
                        <Text style = {styles.botonAñadirTexto}>+</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.blackPearl
    },
    contenedorFlatlist:{
        marginBottom:55
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10
    },
    footerRow: {
        backgroundColor: "#d3e3d2",
        flexDirection: 'row',
        height: 55,
    },
    textInput: {
        alignSelf: 'stretch',
        color: "#fff",
        backgroundColor: "#252525",
        flex: 5
    },
    botonAñadir:{
        backgroundColor: "#E91E63",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1  
    },
    botonAñadirTexto:{
        color: '#fff',
        fontSize: 30
    }
});

export default ListaHojas ;