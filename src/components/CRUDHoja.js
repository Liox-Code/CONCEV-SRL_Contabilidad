import React, { useState, useEffect, Component } from 'react';
import { View, FlatList, ActivityIndicator, Text, Pressable, StyleSheet, TextInput, Alert, PermissionsAndroid } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Colors from 'concevContabilidad/src/res/colors';
import Hoja from 'concevContabilidad/src/components/Hoja';
import DialogInput from 'react-native-dialog-input';

const saveData = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
    const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if(!readGranted || !writeGranted) {
      Alert.alert('Permiso Denegado','No se puede exportar si no se acepta el permiso');
      return;
    }
  }

class CrearListado extends Component{

    constructor(props){
        super(props);

        const db = SQLite.openDatabase(
            {
                name: 'concevSRLExportar.db',
                createFromLocation : 1
            },() =>{},
            error =>{
                console.log(error);
            }
        );

        this.state = {
            db,
            hojas: [],
            textoNombreHoja: '',
            isDialogVisible: false
        };
    }

    componentDidMount() {
        saveData();
        this.props.navigation.setOptions({'title': 'Hojas'});
        this.refreshListado();
    }

    render(){
        const {hojas} = this.state;
        return(
            <View style = {styles.container}>
                <View style = {styles.contenedorFlatlist}>
                    <FlatList
                        data = {hojas}
                        keyExtractor={(item, index) => item.cod_hoja.toString()}
                        renderItem= { ({item}) =>
                            <Hoja
                                data= {item}
                                onPressEntrar={() => this.seleccionarHoja(item)}
                                //onPressEditar={() => this.actualizarHoja(item, true)}
                                onPressExportar={() => {
                                    saveData();
                                    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then(
                                        res => {
                                            if(res){
                                                console.log('Se acepto los permisos');
                                                Alert.alert(
                                                    "Exportar hoja",
                                                    "¿Desea exportar la hoja " + item.nombre_hoja + "?",
                                                    [
                                                    {
                                                        text: "Cancel",
                                                        onPress: () => {},
                                                        style: "cancel"
                                                    },
                                                    { text: "Exportar", onPress: () => this.exportarHoja(item,true)}
                                                    ],
                                                    { cancelable: false }
                                                )
                                            }
                                            else{
                                                console.log('No se acepto los permisos');
                                            }
                                        }
                                    )}}
                                onPressEditar={() => {this.mostrarDialog(item,true)}}
                                onPressBorrar={() => 
                                    Alert.alert(
                                        "Borrar hoja",
                                        "¿Desea borrar la hoja?",
                                        [
                                        {
                                            text: "Cancel",
                                            onPress: () => this.borrarHoja(item,false),
                                            style: "cancel"
                                        },
                                        { text: "Borrar", onPress: () => this.borrarHoja(item,true)}
                                        ],
                                        { cancelable: false }
                                    )}
                            />
                        }  
                    />
                    <DialogInput 
                        isDialogVisible={this.state.isDialogVisible}
                        title={"Cambiar Nombre"}
                        message={"Nombre nuevo :"}
                        hintInput ={"Nombre Nuevo"}
                        submitInput={ (inputText) => {this.sendInput(inputText)} }
                        closeDialog={ () => {this.setState({isDialogVisible: false});}}>
                    </DialogInput>
                </View>
                <View style = {styles.footer}>
                    <View style = {styles.footerRow}>
                        <TextInput 
                            style = {styles.textInput}
                            placeholder='Nombre Hoja'
                            placeholderTextColor='white'
                            underlineColorAndroid='transparent'
                            value={this.state.textoNombreHoja}
                            onChangeText={(textoNombreHoja) => this.cambiarTexto(textoNombreHoja)}
                        >
                        </TextInput>
                        <Pressable onPress={() => this.añadirHoja()} style = {styles.botonAñadir}>
                            <Text style = {styles.botonAñadirTexto}>+</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        )
    }

    sendInput = (inputText) =>{
        this.actualizarHoja(inputText,true);
    }

    mostrarDialog = ( item, mostrar) =>{
        this.setState({isDialogVisible: mostrar, itemModificar: item});
    }

    refreshListado = () =>{
        const { db } = this.state;
    
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM hoja;', [], (tx, results) => {
            const rows = results.rows;
            let hojas = [];
    
            for (let i = 0; i < rows.length; i++) {
              hojas.push({
                ...rows.item(i),
              });
            }
            console.log(hojas);
            this.setState({ hojas });
          });
        });
    }

    seleccionarHoja = (item) =>{
        this.props.navigation.navigate('ListaFilas', {hoja: item});
    }

    cambiarTexto = (textoNombreHoja) =>{
        this.setState({textoNombreHoja: textoNombreHoja});
        if(textoNombreHoja = '' || !textoNombreHoja){
            this.txtInputVacio();
        }
    }

    txtInputVacio(){
        this.setState({ textoNombreHoja: ''});
    }

    añadirHoja = () =>{
        if(this.state.textoNombreHoja){
            if(!this.state.hojas.some(data => data.nombre_hoja.toLowerCase() === this.state.textoNombreHoja.toLowerCase())){
                const { db } = this.state;
                db.transaction(tx => {
                    tx.executeSql(
                        'INSERT INTO hoja VALUES ( NULL, ?);', [this.state.textoNombreHoja], (tx, results) => {
                        console.log('Results insertar hoja', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            Alert.alert(
                                "Hoja registrada",
                                "Se registro " + this.state.textoNombreHoja + " exitosamente."
                            );
                            this.txtInputVacio();
                            this.refreshListado();
                        }
                        else{
                            Alert.alert(
                                "Registro fallido",
                                "No se registro " + this.state.textoNombreHoja + "."
                            );
                        }
                    });
                });
            }
            else{
                Alert.alert(
                    'Nombre Lista Repetido',
                    'No pueden existir 2 listas con el mismo nombre'
                );
            }
        }
    }

    exportarHoja = (inputText,exportar) =>{
        
        if(exportar){
            const { db } = this.state;

            db.transaction(tx => {
                tx.executeSql('SELECT fa.id_fila, fa.cod_hoja, fa.fecha, fa.descrpcion,fa.ingresos, fa.egresos, fa.saldo as saldoFila , SUM(fb.saldo) as saldo, fa.otros FROM fila fa INNER JOIN fila fb ON fa.cod_hoja = fb.cod_hoja WHERE fa.cod_hoja = ? AND fa.id_fila  >= fb.id_fila GROUP BY fA.id_fila ORDER BY fa.id_fila;', 
                [inputText.cod_hoja], 
                (tx, results) => {
                    const rows = results.rows;
                    let textoExportar = '';

                    textoExportar = 'fecha;descrpcion;ingresos;egresos;saldo;otros\n';
            
                    for (let i = 0; i < rows.length; i++) {
                        textoExportar = textoExportar + rows.item(i).fecha + ';' + rows.item(i).descrpcion + ';' + rows.item(i).ingresos + ';' + rows.item(i).egresos + ';' + rows.item(i).saldo + ';' + rows.item(i).otros;
                        if(i != (rows.length - 1)){
                            textoExportar = textoExportar + '\n';
                        }
                    }
                    console.log(textoExportar);
            
                    var RNFS = require('react-native-fs');
                
                    var path = RNFS.DownloadDirectoryPath + '/' + inputText.nombre_hoja + '.csv';
        
                    RNFS.writeFile(path, textoExportar, 'utf8')
                      .then((success) => {
                        Alert.alert('Exportado Exitosamente','La hoja ' + inputText.nombre_hoja + ' se exporto exitosamente.');
                      })
                      .catch((err) => {
                        Alert.alert('Error Exportar','La hoja no se exporto por un error.');
                      });
                
                });
            });
        }
    }

    actualizarHoja = (inputText,modificar) =>{
        const {itemModificar} = this.state;
        if(inputText && modificar){
            if(!this.state.hojas.some(data => data.nombre_hoja.toLowerCase() === inputText.toLowerCase())){
                const { db } = this.state;
                db.transaction(tx => {
                    tx.executeSql(
                        'UPDATE hoja set nombre_hoja = ? WHERE cod_hoja = ?;', 
                        [inputText, itemModificar.cod_hoja], 
                        (tx, results) => {
                        console.log('Results update hoja', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            this.setState({isDialogVisible: false});
                            this.refreshListado();
                        }
                        else{
                            Alert.alert(
                                "Modificacion fallida",
                                "El nombre no se pudo modificar."
                            );
                        }
                    });
                });
            }
            else{
                Alert.alert(
                    'Nombre Lista Repetido',
                    'No pueden existir 2 listas con el mismo nombre.'
                );
            }
        }
    }

    borrarHoja = (item,borrar) =>{
        if(borrar){
            if(this.state.hojas.some(data => data.cod_hoja === item.cod_hoja)){
                const { db } = this.state;
                db.transaction(tx => {
                    tx.executeSql(
                        'DELETE FROM hoja WHERE cod_hoja=?;',
                        [item.cod_hoja],
                        (tx, results) => {
                            console.log('Results Results borrar hoja', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                                const { db } = this.state;
                                db.transaction(tx => {
                                    tx.executeSql(
                                        'DELETE FROM fila WHERE cod_hoja=?;',
                                        [item.cod_hoja],
                                        (tx, results) => {
                                            console.log('Results borrar fila', results.rowsAffected);
                                        }
                                    );
                                });
                                /*Alert.alert(
                                    "Eliminación Exitosa",
                                    "Se elimino la hoja " + item.nombre_hoja +"."
                                );*/
                                this.refreshListado();
                            } else {
                                Alert.alert(
                                    "Eliminación fallida",
                                    "La hoja no pudo ser eliminada."
                                );
                            }
                        }
                    );
                });
            }
        }
    }
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

export default CrearListado;