import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-web";
import { authStyles } from "../../assets/styles/auth.styles.js";

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
        style = {authStyles.key}
      >

      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
