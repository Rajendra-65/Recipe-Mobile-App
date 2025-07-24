import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { recipeDetailStyles } from "../../assets/styles/recipe-details.styles.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { API_URL } from "../constatnts/api";
import MealAPI from "../services/mealAPI.js";

const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { user } = useUser();
  const userId = user?.id;

  useEffect(()=>{

    const checkIfSaved = async () => {
        try{
            const response = await fetch(`${API_URL}/favorites/${userId}`)
            const favorites = await response.json();
            const isRecipeSaved = favorites.some((fav) => fav.recipeId === parseInt(recipeId));
            setIsSaved(isRecipeSaved)
        }catch(e){
            console.error("Error checking if recipe is saved:", e)
        }
    }

    const loadRecipeDetail = async () => {
        setLoading(true);
        try{
            const mealData = await MealAPI.getMealById(recipeId);
            if(mealData){
                const transformedRecipe = MealAPI.transformMealData(mealData);

                const recipeWithVideo = {
                    ... transformedRecipe,
                    youtubeUrl : mealData.strYoutube || null,
                }

                setRecipe(recipeWithVideo)
            }
        }catch(e){
            console.log(e)
        }finally{
            setLoading(false)
        }
    }

    checkIfSaved();
    loadRecipeDetail()
  },[])

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]
    return `https://www.youtube.com/embed/${videoId}`
  }

  const handleToggleSave = async () => {
    setIsSaving(true)
    try{
        if(isSaved){
            const response = await fetch(`${API_URL}/favorites/${userId}/${recipeId}`,{
                method : "DELETE"
            })

            if(!response.ok) throw new Error("Failed to remove reciepe")
            setIsSaved(false)
        }else{
            const response = await fetch(`${API_URL}/favorites`,{
                method: "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    userId,
                    recipeId : parseInt(recipeId),
                    title : recipe.title,
                    image : recipe.image,
                    cookTime : recipe.cookTime,
                    servings : recipe.servings
                })
            })

            if(!response.ok) throw new Error ("failed to save recipe");
            setIsSaved(true)
        }
    }catch(e){
        console.log(e)
    }finally{
        setIsSaving(false)
    }
  }

  if(loading) return <LoadingSpinner message = "Loading data"/>

  return (
    <View
        style = {recipeDetailStyles.container}
    >
      <ScrollView>
        {/* Header */}
        <View style = {recipeDetailStyles.headerContainer}>
            <View style = {recipeDetailStyles.imageContainer}>
                <Image
                    source = {{uri : recipe.image}}
                    style = {recipeDetailStyles.headerImage}
                    contentFit = "cover"
                />
            </View>
        </View>
      </ScrollView>

    </View>
  );

};

export default RecipeDetailScreen;
