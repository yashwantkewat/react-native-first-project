
import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    slide: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60,
        paddingVertical: 60,
    },

    title: {
        color: '#333',
        fontSize: width * 0.07, // responsive
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,

    },

    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        alignContent: "center",
        lineHeight: 24,
        paddingHorizontal: 12,
        marginTop: 20,
        marginBottom: 20,

    },

    image: {
        width: wp('70%'),
        height: hp('35%'),
        alignSelf: 'center',
        marginVertical: hp('2%'),
        borderRadius: 12,
      },
      
      caption: {
        fontSize: width * 0.045,
        fontWeight: '500',
        color: '#7CB342',
        textAlign: 'center',
        marginTop: 16,
      },

    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },

    indicator: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        margin: 5,
    },

    activeIndicator: {
        backgroundColor: '#7CB342',
    },

    button: {
        backgroundColor: '#7CB342',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.2,
        borderRadius: 12,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: height * 0.05,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },

    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: '600',
    },
});
