import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { COLORS } from "../constatnts/colors";
const TabsLayout = () => {
    const {isSignedIn, isLoaded}= useAuth();

    if(!isLoaded) return null;
    
    if(!isSignedIn) return <Redirect href = {"/(auth)/sign-in"}/>



    return(
        <Tabs
            screenOptions = {{
                headerShown : false,
                tabBarActiveTintColor : COLORS.primary,
                tabBarInactiveTintColor : COLORS.textLight,
                tabBarStyle : {
                    backgroundColor : COLORS.white,
                    borderTopColor : COLORS.border,
                    
                },
                headerStyle : {
                    backgroundColor : COLORS.background,
                    borderBottomColor : COLORS.border,
                    borderBottomWidth : 1,
                }
            }}
        >
            <Tabs.Screen
                name = "index"
                options = {{
                    title : "Recipes",
                    tabBarIcon : ({color,size}) =>
                        <Ionicons 
                            name = "restaurant"
                            size = {size}
                            color = {color}
                        />
                }}
            />
            <Tabs.Screen
                name = "search"
                options = {{
                    title : "Search",
                    tabBarIcon : ({color,size}) =>
                        <Ionicons 
                            name = "search"
                            size = {size}
                            color = {color}
                        />
                }}
            />
            <Tabs.Screen
                name = "favorites"
                options = {{
                    title : "favorites",
                    tabBarIcon : ({color,size}) =>
                        <Ionicons 
                            name = "heart"
                            size = {size}
                            color = {color}
                        />
                }}
            />
        </Tabs>
    )
}

export default TabsLayout