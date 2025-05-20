// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import AppNavigator from './AppNavigator';

// Ignorer certains avertissements non critiques
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  return (
    <NavigationContainer
      onError={(err) => {
        console.error('Erreur de navigation :', err);
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}
