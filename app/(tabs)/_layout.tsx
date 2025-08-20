// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Tabs } from 'expo-router';

// export default function TabLayout() {
//   return (
//     <Tabs  >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           headerShown: false, // 👈 hide top nav bar
//           tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           title: 'Settings',
//           headerShown: false, // 👈 hide top nav bar
//           tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
//         }}
//       /> <Tabs.Screen
//       name="profile"
//       options={{
//         title: 'profile',
//         headerShown: false, // 👈 hide top nav bar
//         tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
//       }}
//     />
//     </Tabs>
//   );
// }


import { Stack } from 'expo-router';
import { useState } from 'react';
import WelcomeScreen from '../welcomescreen/WelcomeScreen';

export default function RootLayout() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <WelcomeScreen onDone={() => setShowWelcome(false)} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
