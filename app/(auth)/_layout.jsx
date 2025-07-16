import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from 'expo-router';

export default function AuthRouterLayout () {
    const {isSignedIn} = useAuth();

    if(isSignedIn){
        return <Redirect href = {"/"}/>
    }

    return <Stack
        screenOptions ={{
            headerShown : false,
        }}
    />
}