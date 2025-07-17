const BASE_URL = "https://www.themealdb.com/api/json/v1/1"

export const MealAPI = {
    searchMealsByName : async (query) => {
        try{
            const response = await fetch(`${BASE_URL}/search.png?s=${encodeURIComponent(query)}`);
            const data = await response.json()
            return data.meals || [];
        }catch(e){
            console.log(e)
            return []
        }
    }
}