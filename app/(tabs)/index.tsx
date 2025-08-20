import { View, Button, StyleSheet, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView>

  <View style={style.container}>
  <Link href="/screens/home" style={style.list}>Go to home</Link>
      <Link href="/screens/About" style={style.list}>Go to About</Link>
      <Link href="/screens/Flexbox" style={style.list}>Go to flex box page</Link>
      <Link href="/screens/Platformcode" style={style.list}>Go to  Plateformcode page</Link>
      <Link href="/screens/authuser/signup" style={style.list}>Go to  signup page </Link>
      <Link href="/screens/authuser/Login" style={style.list}>Go to  Login page </Link>
      <Link href="/screens/authuser/forget-password" style={style.list}>Go to  forget-password page </Link>
      <Link href="/screens/authuser/verify-otp" style={style.list}>Go to  verify otp page </Link>
      <Link href="/screens/authuser/reset-password" style={style.list}>Go to  reset-password page </Link>
      <Link href="/screens/authuser/profile" style={style.list}>Go to  update-profile page </Link>
      <Link href="/screens/account" style={style.list}>Go to account</Link>

      <Link href="/screens/review" style={style.list}>Go to  review page </Link>
      <Link href="/screens/getreview" style={style.list}>Get  review page </Link>
      <Link href="/screens/categories" style={style.list}>categories page </Link>
      <Link href="/screens/paymentmethod" style={style.list}>go to payment method </Link>
      <Link href="/screens/data" style={style.list}>Go to  data page </Link>
      <Link href="/screens/fooddata" style={style.list}>food data</Link>
      <Link href="/screens/cart" style={style.list}>cart data</Link>

      <Link href="/screens/myorder" style={style.list}>Go to my order</Link>
      <Link href="/screens/orderhistory" style={style.list}>Go to my order</Link>

      <Link href="/welcomescreen/WelcomeScreen" style={style.list}>Go to  welcomeScreens page </Link>
      <Link href="/screens/useraddress" style={style.list}>Go to  address page </Link>

      <Button title="Go to scrollview" onPress={() => router.push('/screens/Scrollview')} />
     
    </View>
    </ScrollView>
  
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',  // horizontal layout
    justifyContent: 'center', // spacing
    padding: 20,
  },
  list:{
  
    backgroundColor: 'skyblue',
    alignItems: 'stretch',
    justifyContent: 'center',
    margin: 5,
    padding:20
  }
})
