import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Switch,
  Button,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';

export default function Index() {
  const [name, setName] = useState('');
  const [notify, setNotify] = useState(false);
  const [volume, setVolume] = useState(50);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Saved', `Name: ${name}, Notifications: ${notify}, Volume: ${volume}`);
    }, 2000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          style={styles.input}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Notifications</Text>
          <Switch value={notify} onValueChange={setNotify} />
        </View>

        <Text style={styles.label}>Volume: {volume.toFixed(0)}</Text>
       

        {loading ? (
          <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
        ) : (
          <Button title="Save Changes" onPress={handleSave} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? '#fff' : '#f2f2f2',
  },
  scroll: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 7,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
});
