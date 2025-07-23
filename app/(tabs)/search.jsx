import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { searchStyles } from "../../assets/styles/search.styles.js"
import { COLORS } from '../constatnts/colors.js'
import { useDebounce } from "../hooks/useDebounce.js"
import { MealAPI } from "../services/mealAPI"

const Search = () => {
  const [searchQuery,setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading,setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true)

  const debouncedSearchQuery = useDebounce(searchQuery,300)

  const performSearch = async (query) => {
    // if no search query
    if(!query.trim()){
      const randomMeals = await MealAPI.getRandomMeals(12)
      return randomMeals.map(meal => MealAPI.transformMealData(meal))
      .filter(meal => meal != null)
    }

    // search by name first , then by ingrediant if no result

    const nameResult = await MealAPI.searchMealsByName(query);

    let results = nameResult;

    if(results.length === 0) {
      const ingrediantResults = await MealAPI.filterByIngredient(query);
      results = ingrediantResults
    }

    return results
    .slice(0,12)
    .map((meal) => MealAPI.transformMealData(meal))
  }

  useEffect(()=>{
    const loadInitialData = async () => {
      try{
        const results = await performSearch("");
        setRecipes(results)
      }catch(e){
        console.log(e)
      }finally{
        setInitialLoading(false)
      }
    }

    loadInitialData()
  },[])

  useEffect(() => {
    if(initialLoading) return ;

    const handleSearch = async () => {
      setLoading(true);
      try{
        const results = await performSearch(debouncedSearchQuery);
        setRecipes(results)
      }catch(e){
        console.log(e)
      }finally{
        setLoading(false)
      }
    }

    handleSearch()
  }, [debouncedSearchQuery, initialLoading])
  
  if(initialLoading) return <Text>Loading some Data</Text>

  return (
    <View style = {searchStyles.container}>
      <View style = {searchStyles.searchSection}>
        <View style = {searchStyles.searchContainer}>
          <Ionicons
            name = "search"
            size = {20}
            color = {COLORS.textLight}
            style = {searchStyles.searchIcon}
          />
        </View>
      </View>
    </View>
  )
}

export default Search