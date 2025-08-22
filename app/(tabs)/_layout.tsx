// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Tabs } from 'expo-router';

// export default function TabLayout() {
//   return (
    
//     <Tabs  >
//       {/* <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           headerShown: false, // 👈 hide top nav bar
//           tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'profile',
//           headerShown: false, // 👈 hide top nav bar
//           tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="myorder"
//         options={{
//           title: "my order",
//           headerShown: false,
//           tabBarIcon: ({ color }) => (
//             <FontAwesome size={28} name="shopping-bag" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="cart"
//         options={{
//           title: "Cart",
//           headerShown: false,
//           tabBarIcon: ({ color }) => (
//             <FontAwesome size={28} name="shopping-cart" color={color} />
//           ),
//         }}
//       /> */}

//     </Tabs>

//   );
// }

import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, 
      }}
    >
    </Tabs>
  );
}
