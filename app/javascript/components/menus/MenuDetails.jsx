import React, { useEffect, useState } from "react";

const MenuDetails = ({
  menu,
  editable,
  onUpdate,
  ...other
}) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes(menu.recipes || [], setRecipes);
  }, [menu.recipes]);

  return (
    <div className="menu-card">
      <div className="row menu-card-name">{renderName(menu.name, editable, (name) => {
        menu.name = name;
        onUpdate(menu);
      })}</div>

      <div className="row menu-recipe-list">
        {renderRecipeList(recipes, editable, onUpdate)}
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

const renderRecipeList = (recipes) => {
  return (
    <ul className="menu-item">
      {recipes.map((r) => (
        <li key={r.id}>
          <a href={"/recipes/" + r.id}>{r.name}</a>
        </li>
      ))}
    </ul>
  );
};

const fetchRecipes = (ids, setRecipes) => {
  const recipePromises = ids.map((id) => {
    const promise = new Promise((resolve, reject) =>
      $.ajax({
        url: "/api/recipes/" + id,
        type: "GET",
        dataType: "json",
        success: (data) => resolve(data)
      }));
    return promise;
  });

  Promise.all(recipePromises).then(setRecipes);
}

export default MenuDetails;
