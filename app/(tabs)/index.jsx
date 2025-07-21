import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, } from 'react-native';
import { homeStyles } from "../../assets/styles/home.styles.js";
import { MealAPI } from '../services/mealAPI';

const Home = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [recipies,setRecipes] = useState([]);
  const [categoreies,setcategories] = useState([]);
  const [feturedRecipe,setFeaturedRecipe] = useState(null);
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] =  useState(null) ;

  const loadData = async () => {
    try{
      setLoading(true);
      const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal()
      ])

      const transformedCategories = apiCategories.map((cat,index)=>({
        id : index + 1,
        name : cat.strCategory,
        image : cat.strCategoryThumb,
        description : cat.strCategoryDescription
      }))

      setcategories(transformedCategories);

      const transformedMeals = randomMeals
        .map(meal => MealAPI.transformMealData(meal))
        .filter((meal)=> meal !== null);

        setRecipes(transformedMeals);

        const transformedFeatured = MealAPI.transformMealData(featuredMeal);
        setFeaturedRecipe(transformedFeatured);
    }catch(e){
      console.log("Error in loading the data",e)
    }finally {
      setLoading(false);
    }
  }

  const loadCategoryData = async (category) => {
    try{
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals
      .map((meal)=> MealAPI.transformMealData(meal))
      .filter((meal)=> meal!= null);
      setRecipes(transformedMeals);
    }catch(e){
      console.log("Error in loading category data:",e)
      setRecipes([])
    }
  }

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category)
    await loadCategoryData(category)
  }

  useEffect(()=>{
    loadData()
  },[])

  return (
    <View style = {homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator = {false}
        refreshContent = {()=>{}}
        contentContainerStyle = {
          homeStyles.scrollContent
        }
      >
        {/* Animal Icons */}
        <View style = {homeStyles.welcomeSection}>
          <Image 
            source = {require("../../assets/images/lamb.png")}
            style = {{
              width : 100,
              height : 100
            }}
          />
          <Image 
            source = {require("../../assets/images/pork.png")}
            style = {{
              width : 100,
              height : 100
            }}
          />
          <Image 
            source = {require("../../assets/images/chicken.png")}
            style = {{
              width : 100,
              height : 100
            }}
          />
        </View>
        {/* Featured Sections */}
        {
          feturedRecipe && 
            <View
              style = {homeStyles.featuredSection}
            >
              <TouchableOpacity
                style = {homeStyles.featuredCard}
                activeOpacity = {0.9}
                onPress ={()=>router.push(`/recipe/${setFeaturedRecipe.id}`)}
              >
                <View
                  style = {homeStyles.featuredImageContainer}
                >
                  <Image 
                    source ={{ uri : feturedRecipe.image}}
                    style = {homeStyles.featuredImage}
                    contentFilt = "cover"
                    transition = {500}
                  />
                </View>
              </TouchableOpacity>
            </View>
        }
      </ScrollView>
    </View>
  )
}

export default Home