// import { Stack } from 'expo-router';

// export default function RootLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//         animation: 'slide_from_right', // ✅ Smooth transition like scroll
//       }}
//     />
//   );
// }


// app/_layout.tsx
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);

  const checkOnboarding = async () => {
    const value = await AsyncStorage.getItem('onboarding_completed');
    setOnboardingDone(value === 'true');
    setLoading(false);
  };

  useEffect(() => {
    checkOnboarding();
  }, []);

  if (loading) return null;

  return (
    <>    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!onboardingDone && (
        <Stack.Screen name="welcomescreen" />
      )}
      <Stack.Screen name="index" />
      {/* Add other screens here */}
    </Stack>
          <Toast /> {/* <-- Toast mounted at root */}
</>  );
}
