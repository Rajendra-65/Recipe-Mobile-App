import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import SafeScreen from "../app/components/SafeScreen.jsx";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache = {tokenCache}>
      <SafeScreen>
        <Slot/>
      </SafeScreen>
    </ClerkProvider>
  );
}
