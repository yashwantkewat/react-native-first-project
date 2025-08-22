

// // app/_layout.tsx
// import { Stack, useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import Toast from 'react-native-toast-message';
// import BottomBar from './BottomBar';

// export default function RootLayout() {
  
//   return (
//     <> 
//        <Stack
//       screenOptions={{
//         headerShown: false,
//         animation: 'slide_from_right',
//       }}
//     >
//       <BottomBar /> {/* 👈 Ye har screen pe fixed hoga */}

//       <Stack.Screen  />
//       {/* Add other screens here */}
//     </Stack>
//           <Toast /> {/* <-- Toast mounted at root */}
// </>  );


import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import BottomBar from "./BottomBar";
import Toast from "react-native-toast-message";
import { OrderProvider } from "./screens/context/OrderContext"; // 👈 import

export default function RootLayout() {
  return (
    <OrderProvider>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <BottomBar /> {/* 👈 har screen pe dikhega */}
        <Toast /> {/* Toast root pe mount */}
      </View>
    </OrderProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
