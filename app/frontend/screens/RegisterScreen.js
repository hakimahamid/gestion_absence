import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import API from '../services/api'; // Assurez-vous que ce chemin est correct

const ROLES_LIST = ['admin', 'teacher', 'student'];

const ERROR_MESSAGES = {
  USERNAME_REQUIRED: "Le nom d'utilisateur est requis.",
  EMAIL_INVALID: "Un email valide est requis.",
  PASSWORD_REQUIRED: 'Le mot de passe est requis.',
  REGISTRATION_FAILED_DEFAULT: 'Inscription échouée. Veuillez réessayer.',
};

const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Compte créé avec succès',
};

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [openRole, setOpenRole] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roleItems = useMemo(
    () => ROLES_LIST.map(r => ({ label: r, value: r })),
    []
  );

  const handleRegister = async () => {
    if (!username.trim()) {
      Alert.alert('Erreur', ERROR_MESSAGES.USERNAME_REQUIRED);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      Alert.alert('Erreur', ERROR_MESSAGES.EMAIL_INVALID);
      return;
    }

    if (!password) {
      Alert.alert('Erreur', ERROR_MESSAGES.PASSWORD_REQUIRED);
      return;
    }

    const payload = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      role,
      password,
    };

    setIsLoading(true);
    try {
      await API.post('/auth/signup', payload);
      Alert.alert('Succès', SUCCESS_MESSAGES.ACCOUNT_CREATED);
      navigation.navigate('Login');
    } catch (err) {
      console.error("Registration API error: ", err.response?.data || err.message || err);
      const errorMessage =
        err.response?.data?.message || ERROR_MESSAGES.REGISTRATION_FAILED_DEFAULT;
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Inscription</Text>

      <TextInput
        placeholder="Nom d'utilisateur"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        returnKeyType="next"
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        returnKeyType="next"
      />

      <Text style={styles.label}>Rôle</Text>
      <DropDownPicker
        open={openRole}
        value={role}
        items={roleItems}
        setOpen={setOpenRole}
        setValue={setRole}
        setItems={() => {}}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        itemStyle={styles.dropdownItem}
        dropDownContainerStyle={styles.dropdownListContainer}
        placeholder="Sélectionnez un rôle"
        zIndex={3000}
        zIndexInverse={1000}
        listMode={Platform.OS === 'android' ? 'MODAL' : 'SCROLLVIEW'}
      />

      <TextInput
        placeholder="Mot de passe"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        returnKeyType="done"
      />

      <Button
        title={isLoading ? 'Création en cours...' : 'Créer un compte'}
        onPress={handleRegister}
        disabled={isLoading}
        color="#007AFF"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 18,
    fontSize: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
    color: '#444',
  },
  dropdownContainer: {
    marginBottom: 18,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 8,
  },
  dropdownItem: {
    justifyContent: 'flex-start',
  },
  dropdownListContainer: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 8,
  },
});