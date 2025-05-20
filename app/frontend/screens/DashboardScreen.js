// DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

export default function DashboardScreen({ route, navigation }) {
  const user = route.params?.user;
  const [token, setToken] = useState(null);

  const [moduleId, setModuleId] = useState('');
  const [qrData, setQrData] = useState(null);
  const [secret, setSecret] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [presencesList, setPresencesList] = useState([]);
  const [convocationsList, setConvocationsList] = useState([]);
  const [studentAbsences, setStudentAbsences] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [showPresences, setShowPresences] = useState(false);
  const [showConvocations, setShowConvocations] = useState(false);
  const [loadingPresence, setLoadingPresence] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentSecret, setStudentSecret] = useState('');
  const [teacherIdStudent, setTeacherIdStudent] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('token').then(t => {
      setToken(t);
      if (user?.role === 'student') fetchAbsences(user.id || user._id, t);
    });
  }, []);

  const generateSecret = () => 'secret-' + Math.random().toString(36).substr(2, 9);

  const generateQRCode = async () => {
    if (!moduleId.trim()) return Alert.alert('Erreur', 'Veuillez entrer l’ID du module');
    if (!token) return Alert.alert('Erreur', 'Token manquant');

    const newSecret = generateSecret();
    const data = {
      moduleId: moduleId.trim(),
      teacherId: user.id || user._id,
      date: new Date().toISOString(),
      secret: newSecret,
    };

    setSecret(newSecret);
    setQrData(JSON.stringify(data));

    try {
      await API.post('/auth/save-secret', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le secret.');
    }
  };

  const markPresenceByName = async () => {
    if (!studentName || !studentSecret || !moduleId || !teacherIdStudent)
      return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    if (!token) return Alert.alert('Erreur', 'Token manquant');

    setLoadingPresence(true);
    try {
      const payload = {
        studentName: studentName.trim(),
        moduleId: moduleId.trim(),
        teacherId: teacherIdStudent.trim(),
        secret: studentSecret.trim(),
        date: new Date().toISOString(),
      };

      const response = await API.post('/auth/mark-attendance-by-name', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('✅ Présence enregistrée', response.data.message || 'Merci !');
      setStudentName('');
      setStudentSecret('');
      setModuleId('');
      setTeacherIdStudent('');
      fetchAbsences(user.id || user._id, token);
    } catch (error) {
      Alert.alert('❌ Erreur', error.response?.data?.message || error.message);
    } finally {
      setLoadingPresence(false);
    }
  };

  const fetchStudents = async () => {
    if (!moduleId.trim()) return Alert.alert('Erreur', 'Entrez l’ID du module');
    try {
      const res = await API.get(`/auth/students/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentsList(res.data.students || []);
      setShowStudents(true);
    } catch (error) {
      Alert.alert('Erreur', 'Chargement des étudiants échoué.');
    }
  };

  const fetchPresences = async () => {
    if (!moduleId.trim()) return Alert.alert('Erreur', 'Entrez l’ID du module');
    try {
      const res = await API.get(`/auth/presences/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPresencesList(res.data.presences || []);
      setShowPresences(true);
    } catch (error) {
      Alert.alert('Erreur', 'Chargement des présences échoué.');
    }
  };

  const fetchConvocations = async () => {
    try {
      const res = await API.get('/auth/convocations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConvocationsList(res.data.convocations || []);
      setShowConvocations(true);
    } catch (error) {
      Alert.alert('Erreur', 'Chargement des convocations échoué.');
    }
  };

  const fetchAbsences = async (studentId, token) => {
    try {
      const res = await API.get(`/auth/absences/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentAbsences(res.data.absences || []);
    } catch (err) {
      console.log('Erreur récupération absences :', err.message);
    }
  };

  if (!user) return <View style={styles.container}><Text style={styles.title}>Utilisateur non défini</Text></View>;

  if (user.role === 'student') {
    // Correction ici : "count" remplacé par "absences"
    const modulesWith7Absences = studentAbsences.filter(abs => abs.absences >= 7);
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Bienvenue {user.username || user.name} 👋</Text>

        {modulesWith7Absences.map((item, index) => (
          <Text key={index} style={styles.warningText}>
            ⚠️ Module "{item.moduleId}": {item.absences} absences – vous serez convoqué au rattrapage.
          </Text>
        ))}

        <Text style={styles.label}>Nom :</Text>
        <TextInput style={styles.input} value={studentName} onChangeText={setStudentName} placeholder="Votre nom" />
        <Text style={styles.label}>Secret :</Text>
        <TextInput style={styles.input} value={studentSecret} onChangeText={setStudentSecret} placeholder="Secret" />
        <Text style={styles.label}>ID du module :</Text>
        <TextInput style={styles.input} value={moduleId} onChangeText={setModuleId} placeholder="Module ID" />
        <Text style={styles.label}>ID du professeur :</Text>
        <TextInput style={styles.input} value={teacherIdStudent} onChangeText={setTeacherIdStudent} placeholder="Teacher ID" />
        <Button title="Marquer ma présence" onPress={markPresenceByName} disabled={loadingPresence} />

        <View style={{ marginTop: 30 }}>
          <Button title="Scanner QR Code" onPress={() => navigation.navigate('QRScanner', { user })} />
        </View>
      </ScrollView>
    );
  }

  if (user.role === 'teacher' || user.role === 'admin') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Bonjour {user.role === 'admin' ? 'Admin' : 'Prof.'} {user.username || user.name}</Text>

        <Text style={styles.label}>ID du module :</Text>
        <TextInput style={styles.input} value={moduleId} onChangeText={setModuleId} placeholder="ID du module" />
        {user.role === 'teacher' && <Button title="Générer QR Code" onPress={generateQRCode} />}

        {qrData && (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <QRCode value={qrData} size={200} />
            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Secret : {secret}</Text>
          </View>
        )}

        <View style={{ marginTop: 30 }}>
          <Button title="Voir les étudiants" onPress={fetchStudents} />
        </View>

        {showStudents && (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Étudiants :</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.headerCell]}>Nom</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Email</Text>
            </View>
            {studentsList.map((student, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{student.username}</Text>
                <Text style={styles.tableCell}>{student.email}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginTop: 30 }}>
          <Button title="Voir les présences" onPress={fetchPresences} />
        </View>

        {showPresences && (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Présences :</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.headerCell]}>Nom</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Module</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Date</Text>
            </View>
            {presencesList.map((presence, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{presence.studentName}</Text>
                <Text style={styles.tableCell}>{presence.moduleId}</Text>
                <Text style={styles.tableCell}>{new Date(presence.date).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginTop: 30 }}>
          <Button title="Voir les convocations au rattrapage" onPress={fetchConvocations} />
        </View>

        {showConvocations && (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Convoqués au rattrapage :</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.headerCell]}>Nom</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Email</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Module</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Absences</Text>
            </View>
            {convocationsList.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.username}</Text>
                <Text style={styles.tableCell}>{item.email}</Text>
                <Text style={styles.tableCell}>{item.moduleId}</Text>
                <Text style={styles.tableCell}>{item.count}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  }

  return <View style={styles.container}><Text style={styles.title}>Rôle inconnu</Text></View>;
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  label: { marginBottom: 8, fontSize: 16 },
  tableContainer: { marginTop: 20 },
  tableTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#ddd', padding: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', padding: 10 },
  tableCell: { flex: 1 },
  headerCell: { fontWeight: 'bold' },
  warningText: { color: 'red', marginBottom: 10, fontWeight: 'bold' },
});
