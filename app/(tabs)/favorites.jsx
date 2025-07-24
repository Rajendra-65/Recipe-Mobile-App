import { useClerk, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import NoFavoritesFound from "../../app/components/NoFavoritesFound.jsx";
import { API_URL } from "../../app/constatnts/api.js";
import { favoritesStyles } from "../../assets/styles/favorites.styles.js";
import RecipeCard from "../components/RecipeCard";
import { COLORS } from "../constatnts/colors";

const Favorites = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadFavorites = async () => {
      try {
        const response = await fetch(`${API_URL}/favorites/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch favorites");

        const favorites = await response.json();

        // transform the data to match the RecipeCard Component's expected format

        const transformedFavorites = favorites.map((favorite) => ({
          ...favorite,
          id: favorite.recipeId,
        }));

        setFavoriteRecipes(transformedFavorites);
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Failed to load Favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

  }, []);

  const handleSignOut = (async) => {};

  if (loading) return <Text> Loading Favorites ....</Text>;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style = {favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity
            style={favoritesStyles.logoutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style = {favoritesStyles.recipesSection}>
          <FlatList
            data = {favoriteRecipes}
            renderItem={({item})=><RecipeCard recipe = {item} />}
            keyExtractor = {(item)=>item.id.toString()}
            numColumns = {2}
            columnWrapperStyle = {favoritesStyles.row}
            contentContainerStyle = {favoritesStyles.recipesGrid}
            scrollEnabled = {false}
            ListEmptyComponent = {<NoFavoritesFound/>}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Favorites;
