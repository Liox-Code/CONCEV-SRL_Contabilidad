import React, { Component } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from 'concevContabilidad/src/components/HomeScreen';

const App = () =>{
  return(
    <NavigationContainer>
      <HomeScreen/>
    </NavigationContainer>
  );
};

export default App;