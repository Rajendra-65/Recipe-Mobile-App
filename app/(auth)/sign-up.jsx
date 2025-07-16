import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

const SignUp = () => {

  const router = useRouter();
  const {isLoaded, signUp} = useSignUp();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showpassword,setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerificatin, setPendingVerification] = useState(false)

  const handleSignUp = async () => {
    if (!email || !password) return Alert.alert("Error","please fill all the details")
    if (password.length < 6) return Alert.alert("Error","password must be at least 6 charecters")
    
    if(!isLoaded) return ;

    setLoading(true);
    
    try{
      await signUp.create({
        emailAddress : email,
        password : password
      })

      await signUp.prepareEmailAddressVerification({
        strategy : "email_code"
      })

      setPendingVerification(true)
    }catch(e){
      Alert.alert("Error",e.errors?.[0]?.message || "Failed to create account");
      console.log(JSON.stringify(e,null,2))
    }finally{
      setLoading(false)
    }
  }

  return (
    <View>
      <Text>sign-up</Text>
    </View>
  )
}

export default SignUp