import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const res = await API.post('/auth/login', {
        username: username.trim(),
        password: password.trim(),
      });

      const user = res.data.user;
      const token = res.data.token;

      if (!user || !token) {
        Alert.alert('Erreur', 'Réponse serveur invalide');
        return;
      }

      // Stocker user et token
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);

      Alert.alert('Connexion réussie', `Bienvenue ${user.username}`);

      // Naviguer selon rôle
      if (user.role.trim() === 'admin') {
        navigation.replace('Admin', { user, token });
      } else {
        navigation.replace('Home', { user, token });
      }
    } catch (error) {
      console.error('Erreur login:', error.response?.data || error.message || error);
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Nom d’utilisateur ou mot de passe incorrect'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        placeholder="Nom d'utilisateur"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mot de passe"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Se connecter" onPress={handleLogin} />
      <Button title="Créer un compte" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});
