import React, { useEffect, useState } from "react";

import RecipeListItem from "../recipes/RecipeListItem";
import TextInput from "../TextInput";
import EditableTextAreaList from "../EditableTextAreaList";

const MenuDetails = ({
  menu,
  managementButtons,
  editable,
  onUpdate,
  ...other
}) => {
  const [recipes, setRecipes] = useState(undefined);

  useEffect(() => {
    fetchRecipes(menu.recipes || [], setRecipes);
  }, [menu.recipes]);

  return (
    <div className="menu-card">
      <div className="row">
        <div className="col menu-card-name">{renderName(menu.name, editable, (name) => {
          menu.name = name;
          onUpdate(menu);
        })}</div>

        <div className="float-right v-centered">
          {managementButtons}
        </div>
      </div>

      <div className="row menu-recipe-list">
        <div className="col-sm-12">
          {renderRecipeList(recipes, editable, (value) => {
            menu.recipes = value.map((r) => r.id);
            onUpdate(menu);
          })}
        </div>
      </div>
    </div>
  );
}

const renderName = (name, editable, onUpdate) => {
  if (editable) {
    return <TextInput
      value={name}
      onUpdate={onUpdate}
      classes={["menu-card-menu-name-edit-input", "input-lg"]}
    />;
  } else {
    return <h1>{name}</h1>;
  }
}

const renderRecipeList = (recipes, editable, onUpdate) => {
  if (recipes === undefined) {
    return (
      <h5>Loading recipes...</h5>
    )
  }

  return editable
    ? renderRecipeListEditable(recipes, onUpdate)
    : renderRecipeListReadonly(recipes)
};

const renderRecipeListReadonly = (recipes) => {
  return (
    <div className="container">
      {recipes.map((r) => (
        <div key={`menu-recipe-${r.id}`} className="container">
          <RecipeListItem
            {...r}
          />
        </div>
      ))}
    </div>
  );
};

const renderRecipeListEditable = (recipes, onUpdate) => {
  return (
    <EditableTextAreaList
      items={recipes}
      onUpdate={onUpdate}
      renderListItem={(recipe) =>
        <div key={`menu-recipe-${recipe.id}`} className="container">
          <RecipeListItem
            {...recipe}
          />
        </div>
      }
    />
  );
};

const fetchRecipes = (ids, setRecipes) => {
  const recipePromises = ids.map((id) => {
    const promise = new Promise((resolve, reject) =>
      $.ajax({
        url: `/api/recipes/${id}`,
        type: "GET",
        dataType: "json",
        success: (data) => resolve(data),
        error: (err) => {
          if (err.status === 404) {
            resolve(undefined)
          } else {
            reject(err);
          }
        }
      }));
    return promise;
  });

  Promise.all(recipePromises).then((recipes) => setRecipes(recipes.filter((r) => r !== undefined)));
}

export default MenuDetails;
