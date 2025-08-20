import { View, Text, StyleSheet, Image } from 'react-native';

export default function Tab() {
    return (
        <View style={styles.container}>
            <Image
                style={styles.avatar}
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            />
            <Text style={styles.name}>Yash Kewat</Text>
            <Text style={styles.email}>yashkewat@example.com</Text>
            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Location</Text>
                <Text style={styles.infoContent}>Indore, India</Text>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Bio</Text>
                <Text style={styles.infoContent}>
                    React Native Developer 🚀 | Tech enthusiast | Love building beautiful UIs 💻
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        paddingTop: 50,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    infoBox: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    infoContent: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
});
