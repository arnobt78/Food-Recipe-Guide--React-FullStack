/**
 * Vercel Serverless Function: /api/recipes/favourite
 * 
 * Handle favorite recipes operations:
 * - POST: Add a recipe to favorites
 * - GET: Get all favorite recipes
 * - DELETE: Remove a recipe from favorites
 * 
 * @param request - Vercel request object
 * @returns JSON response based on operation
 */

// Load environment variables first
import "dotenv/config";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../lib/prisma.js";
import { getFavouriteRecipesByIDs } from "../../lib/recipe-api.js";

// CORS headers helper
function setCorsHeaders(response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    setCorsHeaders(response);
    return response.status(200).end();
  }

  setCorsHeaders(response);

  try {
    // POST: Add favorite recipe
    if (request.method === "POST") {
      const { recipeId } = request.body;

      if (!recipeId) {
        return response.status(400).json({ error: "Recipe ID is required" });
      }

      const favouriteRecipe = await prisma.favouriteRecipes.create({
        data: {
          recipeId: recipeId,
        },
      });

      return response.status(201).json(favouriteRecipe);
    }

    // GET: Get all favorite recipes
    if (request.method === "GET") {
      const recipes = await prisma.favouriteRecipes.findMany();
      const recipeIds = recipes.map((recipe) => recipe.recipeId.toString());

      // If no favorites, return empty results
      if (recipeIds.length === 0) {
        return response.status(200).json({ results: [] });
      }

      // Try to get recipe details from Spoonacular API
      // If API limit is reached, still return the recipe IDs so favourites are visible
      try {
        const favourites = await getFavouriteRecipesByIDs(recipeIds);
        return response.status(200).json(favourites);
      } catch (apiError: any) {
        // If Spoonacular API fails (e.g., daily limit reached), 
        // return the recipe IDs from database so favourites are still visible
        const isApiLimitError = apiError?.code === 402 || 
                                apiError?.message?.includes("points limit") ||
                                apiError?.message?.includes("daily limit");
        
        if (isApiLimitError) {
          console.warn("⚠️ [Favourite API] Spoonacular API daily limit reached. Favourites exist in database but details unavailable.");
          
          // Return recipe IDs with minimal info so user knows favourites are saved
          return response.status(200).json({
            results: recipeIds.map(id => ({
              id: parseInt(id),
              title: `Recipe #${id} (Details unavailable - API limit reached)`,
              image: null,
              _apiUnavailable: true, // Flag to indicate we couldn't fetch full details
            })),
            _message: "Your favourites are saved, but recipe details are temporarily unavailable due to API daily limit. They will appear once the limit resets."
          });
        }
        
        // For other API errors, re-throw to be handled by outer catch block
        throw apiError;
      }
    }

    // DELETE: Remove favorite recipe
    if (request.method === "DELETE") {
      const { recipeId } = request.body;

      if (!recipeId) {
        return response.status(400).json({ error: "Recipe ID is required" });
      }

      await prisma.favouriteRecipes.delete({
        where: {
          recipeId: recipeId,
        },
      });

      return response.status(204).end();
    }

    // Method not allowed
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("❌ [Favourite API] Error handling favourite request:");
    console.error("❌ [Favourite API] Error type:", error?.constructor?.name);
    console.error("❌ [Favourite API] Error message:", error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error) {
      console.error("❌ [Favourite API] Error stack:", error.stack);
      
      // Check for Prisma-specific errors
      if (error.message.includes("Authentication failed")) {
        console.error("❌ [Favourite API] DATABASE CONNECTION ERROR!");
        console.error("❌ [Favourite API] DATABASE_URL is:", process.env.DATABASE_URL ? "SET" : "NOT SET");
        if (process.env.DATABASE_URL) {
          console.error("❌ [Favourite API] DATABASE_URL length:", process.env.DATABASE_URL.length);
          console.error("❌ [Favourite API] DATABASE_URL preview:", process.env.DATABASE_URL.substring(0, 50) + "...");
        }
      }
    }
    
    // Handle Prisma unique constraint error (recipe already favorited)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return response.status(409).json({ 
        error: "Recipe is already in favorites" 
      });
    }

    return response.status(500).json({ 
      error: "Oops, something went wrong",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

