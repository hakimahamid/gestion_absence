import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import API from '../services/api';

export default function AdminScreen({ route }) {
  const { user } = route.params;

  // Création utilisateur
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('123456'); // mot de passe par défaut

  // Inscription utilisateur à module
  const [enrollUserId, setEnrollUserId] = useState('');
  const [enrollModuleId, setEnrollModuleId] = useState('');
  const [enrollRole, setEnrollRole] = useState('student');

  // Créer un utilisateur
  const createUser = async () => {
    if (!username.trim() || !email.trim() || !role.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const res = await API.post('/auth/signup', {
        username: username.trim(),
        email: email.trim(),
        role: role.trim(),
        password: password,
      });
      Alert.alert('Succès ✅', res.data.message || `Utilisateur ${role} ajouté.`);
      
      setUsername('');
      setEmail('');
      setRole('student');
      setPassword('123456');
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      Alert.alert('Erreur', err.response?.data?.message || "Impossible d’ajouter l’utilisateur");
    }
  };

  // Inscrire un utilisateur à un module
  const enrollUser = async () => {
    if (!enrollUserId.trim() || !enrollModuleId.trim() || !enrollRole.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs pour l’inscription');
      return;
    }

    try {
      const res = await API.post('/auth/enroll', {
        userId: parseInt(enrollUserId.trim(), 10),
        moduleId: enrollModuleId.trim(),
        role: enrollRole.trim(),
      });
      Alert.alert('Succès ✅', res.data.message || 'Inscription réussie');

      setEnrollUserId('');
      setEnrollModuleId('');
      setEnrollRole('student');
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      Alert.alert('Erreur ❌', err.response?.data?.message || 'Échec de l’inscription');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👮 Admin Dashboard</Text>

      <Text style={styles.section}>➕ Créer un utilisateur</Text>
      <TextInput
        placeholder="Nom d'utilisateur"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Rôle (student | teacher)"
        style={styles.input}
        value={role}
        onChangeText={setRole}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mot de passe"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Créer" onPress={createUser} />

      <View style={styles.separator} />

      <Text style={styles.section}>📝 Inscrire un utilisateur à un module</Text>
      <TextInput
        placeholder="ID utilisateur"
        style={styles.input}
        value={enrollUserId}
        onChangeText={setEnrollUserId}
        keyboardType="numeric"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="ID module"
        style={styles.input}
        value={enrollModuleId}
        onChangeText={setEnrollModuleId}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Rôle (student | teacher)"
        style={styles.input}
        value={enrollRole}
        onChangeText={setEnrollRole}
        autoCapitalize="none"
      />
      <Button title="Inscrire" onPress={enrollUser} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  section: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  separator: { height: 1, backgroundColor: '#ccc', marginVertical: 20 },
});
