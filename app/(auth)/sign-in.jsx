import { useSignIn } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { authStyles } from "../../assets/styles/auth.styles.js";
import { COLORS } from "../constatnts/colors.js";

const SignIn = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if(!email || !password){
        Alert.alert("Error","Please fill in all fields")
        return
    }

    if(!isLoaded) return;

    setLoading(true);

    try{
        const signInAttempt = await signIn.create({
            identifier : email,
            password
        })

        if(signInAttempt.status === "complete"){
            await setActive({
                session:signInAttempt.createdSessionId
            })
        } else {
            Alert.alert("Error","Sign in failed please try again.")
            console.error(JSON.stringify(signInAttempt,null,2))
        }
    }catch(e){
        console.log("Error in signing in",e)
        Alert.alert("Error",e.errors?.[0]?.message || "Sign in failed")
    } finally {
        setLoading(false)
    }
  }

  return (
    <View style = {authStyles.container}>
      <KeyboardAvoidingView
        style = {authStyles.keyboardView}
        behavior = {Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle = {authStyles.scrollContent}
          showVerticalScrollIndicator = {true}
        >
          <View style = {authStyles.imageContainer}>
            <Image 
              source = {require("../../assets/images/i1.png")}
              style = {authStyles.image}
              contentFit = "contain"
            />
          </View>
          <Text style = {authStyles.title}>Welcome Back</Text>
          <View style = {authStyles.formContainer}>
            <View style = {authStyles.inputContainer}>
              <TextInput
                style = {authStyles.textInput}
                placeholder = "Enter Email"
                placeholderTextColor = {COLORS.textLight}
                value = {email}
                onChangeText = {setEmail}
                keyboardType = "email-address"
                autoCapitalize = "none"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
