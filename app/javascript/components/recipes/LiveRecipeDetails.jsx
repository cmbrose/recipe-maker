import React, {useEffect, useState } from 'react'
import RecipeDetails from './RecipeDetails';

const LiveRecipeDetails = ({
  id,
  recipe,
}) => {
  const [recipeDetails, setRecipe] = useState({...recipe});

  useEffect(() => {
    var source = new EventSource(`/recipes/${id}/live`);

    source.addEventListener('recipe_update', function(ea) {
      setRecipe(ea.data);
    }, 1);
  }, [id, recipe]);

  return (
    <RecipeDetails 
      recipe={recipeDetails} 
    />
  );
}

export default LiveRecipeDetails