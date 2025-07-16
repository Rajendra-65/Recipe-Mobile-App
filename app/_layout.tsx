import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../app/constatnts/colors.js";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache = {tokenCache}>
      <SafeAreaView style = {{
        flex : 1,
        backgroundColor : COLORS.background
      }}>
        <Slot/>
      </SafeAreaView>
    </ClerkProvider>
  );
}
