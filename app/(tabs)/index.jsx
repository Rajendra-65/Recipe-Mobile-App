import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { MealAPI } from '../services/mealAPI';

const Home = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCatetoory] = useState(null)
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
    }
  }

  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

export default Home