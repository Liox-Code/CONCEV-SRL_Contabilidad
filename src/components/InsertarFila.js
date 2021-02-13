import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet,
    Text, TextInput, TouchableWithoutFeedback, View, ScrollView, Pressable, Alert  } from "react-native";
import Colors from 'concevContabilidad/src/res/colors';
import { TextInputMask } from 'react-native-masked-text';

class InsertarFila extends Component {
  constructor(props) {
    super(props);
    this.state = {
        'fecha': new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear(),
        'descripcion': '',
        'ingreso': 0,
        'ingresoNumero': 0,
        'ingresoDecimal': 0,
        'egreso': 0,
        'egresoNumero': 0,
        'egresoDecimal': 0,
        'saldo': 0,
        'otro': ''
    }
  }

  componentDidMount() {
    this.props.navigation.setOptions({'title': 'Insertar Fila'});
  }

  componentWillUnmount() {
    const volverListaFilas = this.props.route.params.volverListaFilas;
    volverListaFilas();
  }

  render() {
    return (
        <KeyboardAvoidingView style = {styles.container}  keyboardShouldPersistTaps={'always'}>
            <SafeAreaView style = {styles.container}>
                <TouchableWithoutFeedback>
                    <View style = {styles.contenedroInterior}>
                        <ScrollView>
                            <Text style={styles.cabecera}>
                                Nueva Fila
                            </Text>
                            <Text style={styles.inputLabel}>
                                Fecha :
                            </Text>
                            <TextInputMask 
                                style = {styles.textoInput}
                                placeholder='ingresar fecha (dia-mes-año)'
                                placeholderTextColor = 'white'
                                underlineColorAndroid='transparent'
                                type={'datetime'}
                                options={{
                                    format: 'DD-MM-YYYY'
                                }}
                                value={this.state.fecha}
                                onChangeText={texto => {
                                    this.setState({
                                        fecha: texto
                                    })
                                }}
                            >
                            </TextInputMask>
                            <Text style={styles.inputLabel}>
                                Descripción :
                            </Text>
                            <TextInput 
                                    style = {styles.descripcionInput}
                                    placeholder='Ingresar Descripcion'
                                    placeholderTextColor = 'white'
                                    underlineColorAndroid='transparent'
                                    multiline={true}
                                    numberOfLines={6}
                                    value={this.state.descripcion}
                                    onChangeText={texto => {
                                        this.setState({
                                            descripcion: texto
                                        })
                                    }}
                                >
                                </TextInput>
                            <Text style={styles.inputLabel}>
                                Ingreso :
                            </Text>
                            <View style = {styles.contenedorInputDinero}>
                                <View style = {styles.contenedorPuntoDecimal}>
                                    <Text style = {styles.txtUnidadDinero}>Bs.</Text>
                                </View>
                                <TextInputMask 
                                    style = {styles.inputNumber}
                                    placeholder='Ingresar Ingresos'
                                    placeholderTextColor = 'white'
                                    underlineColorAndroid='transparent'
                                    type={'only-numbers'}
                                    value={this.state.ingresoNumero}
                                    onChangeText={texto => {
                                        var ingresoNumero = parseFloat(texto);
                                        if(isNaN(ingresoNumero)){
                                            ingresoNumero = 0;
                                        }
                                        var ingreso = parseFloat(ingresoNumero + "." + this.state.ingresoDecimal);
                                        this.setState({
                                            ingresoNumero: ingresoNumero,
                                            ingreso: ingreso,
                                            saldo: (ingreso - this.state.egreso).toFixed(2)
                                        })
                                    }}
                                >
                                </TextInputMask>
                                <View style = {styles.contenedorPuntoDecimal}>
                                    <Text style = {styles.txtUnidadDinero}>Cts.</Text>
                                </View>
                                <TextInputMask 
                                    style = {styles.inputDecimal}
                                    placeholder='Ingresar Ingresos'
                                    placeholderTextColor = 'white'
                                    underlineColorAndroid='transparent'
                                    type={'only-numbers'}
                                    maxLength={2}
                                    value={this.state.ingresoDecimal}
                                    onChangeText={texto => {
                                        var ingresoDecimal = parseFloat(texto);
                                        if(isNaN(ingresoDecimal)){
                                            ingresoDecimal = 0;
                                        }
                                        var ingreso = parseFloat(this.state.ingresoNumero + "." + ingresoDecimal);
                                        console.log(ingreso);
                                        this.setState({
                                            ingresoDecimal: ingresoDecimal,
                                            ingreso: ingreso,
                                            saldo: (ingreso - this.state.egreso).toFixed(2)
                                        })
                                    }}
                                >
                                </TextInputMask>
                            </View>
                            <Text style={styles.inputLabel}>
                                Egreso :
                            </Text>
                            <View style = {styles.contenedorInputDinero}>
                                <View style = {styles.contenedorPuntoDecimal}>
                                    <Text style = {styles.txtUnidadDinero}>Bs.</Text>
                                </View>
                                <TextInputMask 
                                    style = {styles.inputNumber}
                                    placeholder='Ingresar Egresos'
                                    placeholderTextColor = 'white'
                                    underlineColorAndroid='transparent'
                                    type={'only-numbers'}
                                    value={this.state.egresoNumero}
                                    onChangeText={texto => {
                                        var egresoNumero = parseFloat(texto);
                                        if(isNaN(egresoNumero)){
                                            egresoNumero = 0;
                                        }
                                        var egreso = parseFloat(egresoNumero + "." + this.state.egresoDecimal);
                                        this.setState({
                                            egresoNumero: egresoNumero,
                                            egreso: egreso,
                                            saldo: (this.state.ingreso - egreso).toFixed(2)
                                        })
                                    }}
                                >
                                </TextInputMask>
                                <View style = {styles.contenedorPuntoDecimal}>
                                    <Text style = {styles.txtUnidadDinero}>Cts.</Text>
                                </View>
                                <TextInputMask 
                                    style = {styles.inputDecimal}
                                    placeholder='Ingresar Ingresos'
                                    placeholderTextColor = 'white'
                                    underlineColorAndroid='transparent'
                                    type={'only-numbers'}
                                    maxLength={2}
                                    value={this.state.egresoDecimal}
                                    onChangeText={texto => {
                                        var egresoDecimal = parseFloat(texto);
                                        if(isNaN(egresoDecimal)){
                                            egresoDecimal = 0;
                                        }
                                        var egreso = parseFloat(this.state.egresoNumero + "." + egresoDecimal);
                                        this.setState({
                                            egresoDecimal: egresoDecimal,
                                            egreso: egreso,
                                            saldo: (this.state.ingreso - egreso).toFixed(2)
                                        })
                                    }}
                                >
                                </TextInputMask>
                            </View>
                            <Text style={styles.inputLabel}>
                                Saldo :
                            </Text>
                                <TextInput 
                                    style = {styles.textoInput}
                                    placeholder='Ingresar Saldo'
                                    placeholderTextColor = 'white'
                                    underlineColorAndroid='transparent'
                                    editable={false}
                                    value={this.state.saldo.toString()}
                                >
                                </TextInput>
                            <Text style={styles.inputLabel}>
                                Otro :
                            </Text>
                                <TextInput 
                                    style = {styles.textoInput}
                                    placeholder='Ingresar Otro'
                                    placeholderTextColor = 'white'
                                    underlineColorAndroid='transparent'
                                    value={this.state.otro}
                                    onChangeText={texto => {
                                        this.setState({
                                            otro: texto
                                        })
                                    }}
                                >
                                </TextInput>

                                <Pressable style = {styles.botonGuardar} onPress = {() => this.pasarDatos()}>
                                    <Text style = {styles.textoBotonGuardar}>Guardar</Text>
                                </Pressable>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
  }

  saldoCalcular = () =>{
      var saldo = parseFloat(this.state.ingreso);
      this.setState({
          saldo: saldo
      })
      var saldo2 = parseFloat(this.state.saldo);
      console.log(saldo);
      console.log(saldo2);
  }

  pasarDatos = () => {
      var Fecha = this.state.fecha.toString();
      var Descripcion = this.state.descripcion.toString();
      var Ingresos = this.state.ingreso.toString();
      var Egresos = this.state.egreso.toString();
      var Saldo = this.state.saldo.toString();
      var Otro = this.state.otro.toString();
      if(Fecha != '' && Descripcion != '' && Ingresos != '' && Egresos != '' && Saldo != '' && Fecha.length == 10
        && Fecha != undefined && Descripcion != undefined && Ingresos != undefined && Egresos != undefined  && Saldo != undefined){        
            this.props.navigation.navigate('ListaFilas', {fecha: Fecha, descripcion: Descripcion, ingreso: Ingresos, egreso: Egresos, saldo: Saldo, otro: Otro});
      }
      else if(Fecha == '' || Fecha == undefined){
        Alert.alert(
            "Falta llenar los campos",
            "Falta completar el campo de fecha."
        );
      }
      else if(Descripcion == '' || Descripcion == undefined){
        Alert.alert(
            "Falta llenar los campos",
            "Falta completar el campo de descripción."
        );
      }
      else if(Ingresos == '' || Ingresos == undefined){
        Alert.alert(
            "Falta llenar los campos",
            "Falta completar el campo de ingresos."
        );
      }
      else if(Egresos == '' || Egresos == undefined){
        Alert.alert(
            "Falta llenar los campos",
            "Falta completar el campo de egresos."
        );
      }
      else if(Fecha.length < 10){
        Alert.alert(
            "Campo de fecha erroneo",
            "El campo de fecha debe llenarse con el formato dia-mes-año\nEjemplo.\n10/08/2020."
        );
      }
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.blackPearl,
        flex: 1,
    },
    contenedroInterior:{
        padding: 20,
        flex: 1,
        justifyContent: "flex-end",
    },
    cabecera:{
        fontSize: 30,
        marginBottom: 15,
        color: Colors.ruby,
    },
    inputLabel:{
        fontSize: 15,
        color: Colors.ruby
    },
    textoInput: {
        height:40,
        color: Colors.white,
        borderColor: Colors.ruby,
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    descripcionInput:{
        textAlignVertical: 'top',
        color: Colors.white,
        borderColor: Colors.ruby,
        borderBottomWidth: 1,
        height:120
    },
    contenedorInputDinero: {
        height:40,
        marginBottom: 10,
        flexDirection: 'row',
    },
    inputNumber: {
        height:40,
        color: Colors.white,
        borderColor: Colors.ruby,
        borderBottomWidth: 1,
        marginBottom: 10,
        flex: 6,
    },
    contenedorPuntoDecimal: {
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    txtUnidadDinero: {
        color: Colors.white,
        fontSize: 16
    },
    inputDecimal: {
        height:40,
        color: Colors.white,
        borderColor: Colors.ruby,
        borderBottomWidth: 1,
        marginBottom: 10,
        flex: 1,
    },
    botonGuardar:{
        backgroundColor: '#E91E63',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    textoBotonGuardar:{
        color: Colors.white,
    },
  });

export default InsertarFila;
