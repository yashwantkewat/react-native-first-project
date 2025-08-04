import { Stack } from "expo-router";

export default function RootLayout() {
  return (    <Stack
    screenOptions={{
      headerShown: false,  // ✅ Ye line top header ko hata degi
    }}
  />

  );
}
