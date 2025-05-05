import { Stack } from "expo-router";
// 

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FAFAFA",
        },
        headerTintColor: "#262626",
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: "#FAFAFA",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          title: "Verify Phone",
        }}
      />
    </Stack>
  );
}