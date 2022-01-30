import React from "react";

import RecipeTag from "./RecipeTag";

const RecipeListItem = ({
  id,
  recipe,
  default_preview,
}) => {
  const previewUrl = recipe.preview_url || default_preview;

  return (
    <a href={`/recipes/${id}`} className="link-unstyled">
      <span className="row border recipe-list-item">
        <div className="col-sm-2 col-md-2">
          <img src={previewUrl} object-fit="scale-down" height="80px" />
        </div>

        <div className="v-centered col-sm-7 col-md-8">
          {recipe.name || "Unnamed recipe"}
        </div>

        <div className="v-centered col-sm-3 col-md-2">
          {recipe.tags.map((tag) =>
            <RecipeTag key={`recipe-${recipe.id}-tag-${tag}`} name={tag} />
          )}
        </div>
      </span>
    </a>
  );
}

export default RecipeListItem;
