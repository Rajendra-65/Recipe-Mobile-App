import { useSignUp } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from "../../app/constatnts/colors.js";
import { authStyles } from "../../assets/styles/auth.styles.js";

const VerifyEmail = ({email, onBack}) => {

  const {isLoaded, signUp, setActive} = useSignUp();
  const [code,setCode] = useState("");
  const [loading,setLoading] = useState(false);

  const handleVerification = async () => {
    if(!isLoaded) return

    setLoading(true)
    try{
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code : code.toString()
      })

      if(signUpAttempt.status === "complete"){
        await setActive({
          session : signUpAttempt.createdSessionId
        })
      } else {
        Alert.alert("Error","Verification failed,please try again.")
        console.error(JSON.stringify(signUpAttempt,null,2))
      }

    }catch(e){
      Alert.alert("Error", "verification failed . please try again.");
      console.error(JSON.stringify(e,null,2))
    }finally{
      setLoading(false)
    }
  }

  return (
    <View style = {authStyles.container}>
      <KeyboardAvoidingView
        behavior = {Platform.OS === "ios" ? "padding" : "height"}
        style = {authStyles.keyboardView}
        keyboardVerticalOffset = {Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle = {authStyles.scrollContent}
          showsVerticalScrollIndicator = {false}
        >
          {/* Image Container */}
          <View 
            style = {authStyles.scrollContent}
          >
            <Image 
              source = {require("../../assets/images/i3.png")}
              style = {authStyles.image}
              contentFit = "contain"
            />
          </View>
          <Text style = {authStyles.title}>
            Verify Your Email
          </Text>
          <Text style = {authStyles.subtitle}>
            we&apos;ve sent a verification coee to {email}
          </Text>
          <View style = {authStyles.formContainer}>
            <TextInput
              style = {authStyles.textInput}
              placeholder = "Enter verification code"
              placeholderTextColor = {COLORS.textLight}
              value = {code}
              onChangeText = {setCode}
              keyboardType = "number-pad"
              autoCapitalize = "none"
            />
          </View>
          {/* Verify Button */}

          <TouchableOpacity
            style = {[authStyles.authButton,loading && authStyles.buttonDisabled]}
            onPress = {handleVerification}
            disabled = {loading}
            activeOpacity = {0.0}
          >
            <Text style = {authStyles.buttonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>
          {/* Back to sign Up */}
          <TouchableOpacity 
            style = {authStyles.linkContainer}
            onPress = {onBack}
          >
            <Text style = {authStyles.linkText}>
              <Text style = {authStyles.link}>
                Back to sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default VerifyEmail
