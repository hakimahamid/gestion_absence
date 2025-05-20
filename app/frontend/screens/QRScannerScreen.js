import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import Camera from 'expo-camera';  // <-- IMPORT PAR DÉFAUT !!
import API from '../services/api';

export default function QRScannerScreen({ navigation, route }) {
  const user = route?.params?.user;
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;
    setScanned(true);

    if (type.toLowerCase().includes('qr')) {
      try {
        const parsedData = JSON.parse(data);

        if (!user || !user._id) {
          Alert.alert('Erreur', 'Utilisateur non connecté.');
          setScanned(false);
          return;
        }

        if (!parsedData.moduleId || !parsedData.teacherId || !parsedData.date) {
          throw new Error('QR code invalide ou incomplet');
        }

        const response = await API.post('/auth/mark-attendance', {
          studentId: user._id,
          moduleId: parsedData.moduleId,
          teacherId: parsedData.teacherId,
          date: parsedData.date,
        });

        Alert.alert('✅ Présence enregistrée', response.data.message || 'Merci');
        navigation.navigate('Dashboard', { user });

      } catch (error) {
        Alert.alert('❌ Erreur', error.response?.data?.message || error.message);
        setScanned(false);
      }
    } else {
      Alert.alert('Code non reconnu', 'Seuls les QR codes sont supportés.');
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Demande de permission caméra...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>Permission caméra refusée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'],  // chaîne simple 'qr'
        }}
      />
      {scanned && (
        <View style={styles.button}>
          <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});
//fonctionnel