import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { searchStyles } from "../../assets/styles/search.styles.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import RecipeCard from "../components/RecipeCard";
import { COLORS } from "../constatnts/colors.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { MealAPI } from "../services/mealAPI.js";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = async (query) => {
    // if no search query
    if (!query.trim()) {
      const randomMeals = await MealAPI.getRandomMeals(12);
      return randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal != null);
    }

    // search by name first , then by ingrediant if no result

    const nameResult = await MealAPI.searchMealsByName(query);

    let results = nameResult;

    if (results.length === 0) {
      const ingrediantResults = await MealAPI.filterByIngredient(query);
      results = ingrediantResults;
    }

    return results.slice(0, 12).map((meal) => MealAPI.transformMealData(meal));
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const results = await performSearch("");
        setRecipes(results);
      } catch (e) {
        console.log(e);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (initialLoading) return;

    const handleSearch = async () => {
      setLoading(true);
      try {
        const results = await performSearch(debouncedSearchQuery);
        setRecipes(results);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [debouncedSearchQuery, initialLoading]);

  if (initialLoading) return <LoadingSpinner message = "Loading recipes..."/>;

  return initialLoading ? (
    <ActivityIndicator size="large" color="#fff" />
  ) : (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searchIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search recipes, Ingredients..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={searchStyles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={searchStyles.resultsSection}>
          <View style={searchStyles.resultsHeader}>
            <Text style={searchStyles.resultsTitle}>
              {searchQuery ? `Results for "${searchQuery}"` : "Popular Recipes"}
            </Text>
            <Text style={searchStyles.resultsCount}>
              {recipes.length} found
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 , paddingHorizontal : 10, paddingTop : 10 }}>
        {loading ? (
          <View style = {searchStyles.loadingContainer}>
            <LoadingSpinner
               message = "Searching recipes..."
               size = "small"
            />
          </View>
        ) : (
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoResultsFound />}
          />
        )}
      </View>
    </View>
  );
};

export default Search;

function NoResultsFound() {
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
      <Text style={searchStyles.emptyTitle}>No Recipes Found</Text>
      <Text style={searchStyles.emptyDescription}>
        Try adjusting your search or try different keywords
      </Text>
    </View>
  );
}
