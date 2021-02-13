import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, FlatList } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Colors from 'concevContabilidad/src/res/colors';
import FilaExcel from 'concevContabilidad/src/components/FilaExcel';


class ListaFilas extends Component {
  constructor(props) {
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
      filas: []
    };
  }

  componentDidMount(){
    this.refreshListado();
    if(this.props.route.params){
        const {hoja} = this.props.route.params;

        this.props.navigation.setOptions({'title': hoja.nombre_hoja});

        this.setState({hoja});
    }
  }

  render() {
    const {filas} = this.state;
    return (
      <View style = {styles.container}>
        <View style = {styles.cabecera}>
          <View style = {styles.tabsRow}>
            <Text style = {styles.tabText}>Fecha</Text>
          </View>
          <View style = {styles.tabsRow}>
            <Text style = {styles.tabText}>Ingresos</Text>
          </View>
          <View style = {styles.tabsRow}>
            <Text style = {styles.tabText}>Egresos</Text>
          </View>
          <View style = {styles.tabsRow}>
            <Text style = {styles.tabText}>Saldo</Text>
          </View>
          <View style = {styles.tabsRowBtnEditar}>
            <Text style = {styles.tabText}>E</Text>
          </View>
          <View style = {styles.tabsRowBtnBorrar}>
            <Text style = {styles.tabText}>B</Text>
          </View>
        </View>
        <View style = {styles.contenedorFlatlist}>
          <FlatList
              data = {filas}
              keyExtractor={(item, index) => item.id_fila.toString()}
              renderItem= { ({item}) =>
                <FilaExcel
                  item={item}
                  OnPressEditar={() => this.editarFila(item)}
                  OnPressBorrar={() => 
                    Alert.alert(
                        "Borrar Fila",
                        "¿Desea borrar la fila?",
                        [
                        {
                            text: "Cancel",
                            onPress: () => this.borrarFila(item,false),
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => this.borrarFila(item,true)}
                        ],
                        { cancelable: false }
                    )}
                />
              }  
          />
        </View>
        <View style = {styles.footer}>
            <Pressable style = {styles.botonInsertar} onPress={() => this.añadirFila()}>
                <Text style = {styles.botonInsertarText}>Ingresar Nueva Fila</Text>
            </Pressable>
        </View>
      </View>
    );
  }

  refreshListado = () =>{
      const { db } = this.state;
      const {hoja} = this.props.route.params;
  
      db.transaction(tx => {
        tx.executeSql('SELECT fa.id_fila, fa.cod_hoja, fa.fecha, fa.descrpcion,fa.ingresos, fa.egresos, fa.saldo as saldoFila , SUM(fb.saldo) as saldo, fa.otros FROM fila fa INNER JOIN fila fb ON fa.cod_hoja = fb.cod_hoja WHERE fa.cod_hoja = ? AND fa.id_fila  >= fb.id_fila GROUP BY fA.id_fila ORDER BY fa.id_fila;', [hoja.cod_hoja], (tx, results) => {
          const rows = results.rows;
          let filas = [];
  
          for (let i = 0; i < rows.length; i++) {
            filas.push({
              ...rows.item(i),
            });
          }
          this.setState({ filas });
        });
      });
  }


  insertarFila(){
    const {hoja} = this.props.route.params;
    const fecha = this.props.route.params.fecha;
    const descripcion = this.props.route.params.descripcion;
    const ingreso = this.props.route.params.ingreso;
    const egreso = this.props.route.params.egreso;
    const saldo = this.props.route.params.saldo;
    const otro = this.props.route.params.otro;
    if(fecha != null && descripcion != null && ingreso != null && egreso != null && saldo != null && otro != null){
      const { db } = this.state;
      db.transaction(tx => {
          tx.executeSql(
              'INSERT INTO fila VALUES ( NULL, ?, ?, ?, ?, ?, ?, ?);', 
              [hoja.cod_hoja,fecha,descripcion,ingreso,egreso,saldo,otro],
              (tx, results) => {
              console.log('Results insertar hoja', results.rowsAffected);
              if (results.rowsAffected > 0) {
                  //Alert.alert('Registrado');
                  this.refreshListado();
              }
              else{
                  Alert.alert('No se a registrado');
              }
          });
      });
      this.props.route.params.fecha = null;
      this.props.route.params.descripcion = null;
      this.props.route.params.ingreso = null;
      this.props.route.params.egreso = null;
      this.props.route.params.saldo = null;
      this.props.route.params.otro = null;
    }
  }

  updateFila(item){
    const {hoja} = this.props.route.params;
    const fecha = this.props.route.params.fecha;
    const descripcion = this.props.route.params.descripcion;
    const ingreso = this.props.route.params.ingreso;
    const egreso = this.props.route.params.egreso;
    const saldo = this.props.route.params.saldo;
    const otro = this.props.route.params.otro;
    console.log(saldo);
    if(fecha != null && descripcion != null && ingreso != null && egreso != null && saldo != null && otro != null){
      const { db } = this.state;
      db.transaction(tx => {
          tx.executeSql(
              'UPDATE fila SET fecha = ?, descrpcion = ?,ingresos = ?, egresos = ?, saldo = ?, otros = ? WHERE id_fila = ?;', 
              [fecha,descripcion,ingreso,egreso,saldo,otro,item.id_fila],
              (tx, results) => {
              console.log('Results insertar hoja', results.rowsAffected);
              if (results.rowsAffected > 0) {
                  //Alert.alert('Modificado');
                  this.refreshListado();
              }
              else{
                  Alert.alert('No se a Modificado');
              }
          });
      });
      this.props.route.params.fecha = null;
      this.props.route.params.descripcion = null;
      this.props.route.params.ingreso = null;
      this.props.route.params.egreso = null;
      this.props.route.params.saldo = null;
      this.props.route.params.otro = null;
    }
  }
  
  editarFila = (item) =>{
    //this.props.navigation.navigate('ModificarFila', {volverListaFilas: this.updateFila.bind(this)});
    this.props.navigation.navigate('ModificarFila', {volverListaFilas: this.updateFila.bind(this,item), fila: item});
    
  }

  borrarFila = (item,borrar) =>{
    if(borrar){
      if(this.state.filas.some(data => data.id_fila === item.id_fila)){
        const { db } = this.state;
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM fila WHERE id_fila = ?;',
                [item.id_fila],
                (tx, results) => {
                    console.log('Results Results borrar fila', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        //Alert.alert('Fila Borrada');
                        this.refreshListado();
                    } else {
                        Alert.alert('No se borro fila');
                    }
                }
            );
        });
      }
    }
  }

  añadirFila = () => {
    this.props.navigation.navigate('InsertarFila', {volverListaFilas: this.insertarFila.bind(this)});
    //this.props.navigation.navigate('InsertarFila', {volverListado: 'Leo'});
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    contenedorFlatlist:{
      marginBottom: 70
    },
    cabecera:{
      borderColor: Colors.white,
      borderBottomWidth: 1,
      height: 30,
      flexDirection: 'row'
    },
    tabsRow:{
      justifyContent : 'center',
      alignItems: 'center',
      backgroundColor: Colors.blackPearl,
      flex: 2
    },
    tabsRowBtnEditar:{
      justifyContent : 'center',
      alignItems: 'center',
      backgroundColor: Colors.EasternBlue,
      padding:1,
      flex: 1
    },
    tabsRowBtnBorrar:{
      justifyContent : 'center',
      alignItems: 'center',
      backgroundColor: Colors.ruby,
      padding:1,
      flex: 1
    },
    tabText:{
      color: Colors.white
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10
    },
    botonInsertar: {
      backgroundColor: '#E91E63',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center'
    },
    botonInsertarText: {
      color: '#fff',
      fontSize: 18
    }
  });
export default ListaFilas;
