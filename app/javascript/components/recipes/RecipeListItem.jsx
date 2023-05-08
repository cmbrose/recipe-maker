import React from "react";

import RecipeTag from "./RecipeTag";

const RecipeListItem = ({
  id,
  name,
  tags,
  preview_url,
  default_preview,
}) => {
  const previewUrl = preview_url || default_preview;

  return (
    <a href={`/recipes/${id}`} className="link-unstyled">
      <span className="row border recipe-list-item">
        <div className="col-sm-2">
          <img src={previewUrl} object-fit="scale-down" height="80px" />
        </div>

        <div className="v-centered col-sm-8">
          {name || "Unnamed recipe"}
        </div>

        <div className="v-centered col-sm-2">
          {tags.map((tag) =>
            <RecipeTag key={`recipe-${id}-tag-${tag}`} name={tag} />
          )}
        </div>
      </span>
    </a>
  );
}

export default RecipeListItem;
