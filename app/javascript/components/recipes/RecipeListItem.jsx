import React from "react";

const RecipeListItem = ({
  id,
  recipe,
  default_preview,
}) => {
  const previewUrl = recipe.preview_url || default_preview;

  return (
    <div
      className="row border recipe-list-item"
      onClick={() => {
        window.location.href = `/recipes/${id}`;
      }}
    >
      <div className="col-sm-2 col-md-2">
        <img src={previewUrl} object-fit="scale-down" height="80px" />
      </div>

      <div className="v-centered col-sm-12 col-md-10">
        {recipe.name || "Unnamed recipe"}
      </div>
    </div>
  );
}

export default RecipeListItem;
