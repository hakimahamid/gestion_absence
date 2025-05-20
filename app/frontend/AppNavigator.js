import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './screens/DashboardScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import AdminScreen from './screens/AdminScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// HomeTabs reçoit le user via route.params
function HomeTabs({ route }) {
  const user = route.params?.user; // Sécurisé avec ? au cas où

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        children={(props) => (
          <DashboardScreen {...props} route={{ ...props.route, params: { user } }} />
        )}
      />
      <Tab.Screen
        name="QRScanner"
        children={(props) => (
          <QRScannerScreen {...props} route={{ ...props.route, params: { user } }} />
        )}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
      />
      <Stack.Screen 
        name="Home" 
        component={HomeTabs} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Admin" 
        component={AdminScreen} 
        options={{ headerShown: true, title: 'Admin Dashboard' }} 
      />
    </Stack.Navigator>
  );
}
