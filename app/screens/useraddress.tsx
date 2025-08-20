import React, { useState } from 'react';
import {
  View,
  Text,Dimensions,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../../style/AddAddressScreen.styles';

const { width } = Dimensions.get('window');

const AddAddressScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    country: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { name, email, phone, address } = formData;
    if (!name || !email || !phone || !address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // 🔁 This is where you'll add your API call
    console.log('Sending data to API...', formData);
    Alert.alert('Success', 'Address submitted');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add Address</Text>

      <ScrollView contentContainerStyle={styles.form}>
        {[
          { label: 'Name', field: 'name', icon: 'person-outline' },
          { label: 'Email', field: 'email', icon: 'mail-outline' },
          { label: 'Phone', field: 'phone', icon: 'call-outline' },
          { label: 'Address', field: 'address', icon: 'location-outline' },
          { label: 'Zip', field: 'zip', icon: 'mail-open-outline' },
          { label: 'City', field: 'city', icon: 'business-outline' },
          { label: 'Country', field: 'country', icon: 'globe-outline' },
        ].map(({ label, field, icon }) => (
          <View key={field} style={styles.inputContainer}>
            <Icon name={icon} size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder={label}
              value={formData[field as keyof typeof formData]}
              onChangeText={(value) => handleChange(field, value)}
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddressScreen;
