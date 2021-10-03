import React, { useEffect, useState } from "react";

import RecipeDirectionsList from "./RecipeDirectionsList";
import RecipeIngredientsList from "./RecipeIngredientsList";
import TextInput from "../TextInput";

const RecipeDetails = ({ recipe, editable, onUpdate, sideBarButtons, ...other }) => {
  useEffect(allocateAndShowPreviewImage);

  return (
    <div className="recipe-card">
      <div className="recipe-card-name">{renderName(recipe.name, editable, (name) => {
        recipe.name = name;
        onUpdate(recipe);
      })}</div>

      <div className="recipe-card-left">{renderLeftPane(recipe, editable, onUpdate)}</div>

      <div className="recipe-card-right">{renderRightPane(recipe, editable, onUpdate)}</div>

      <div className="sidebar">
        <div className="sidebar-nav nav navbar-inverse">
          <div className="recipe-card-sidebar">{renderSideBar(recipe, sideBarButtons, editable, onUpdate)}</div>
        </div>
      </div>

      {renderPreviewImageHidden(recipe.preview_url, editable, (url) => { recipe.preview_url = url; onUpdate(recipe); })}
    </div>
  );
}

const renderLeftPane = (recipe, editable, onUpdate) => {
  return (
    <div className="recipe-card-ingredients">
      <h3>Ingredients</h3>
      {renderServings(recipe.servings, editable, (value) => { recipe.servings = value; onUpdate(recipe); })}
      {renderIngredients(recipe.ingredients, editable, (value) => { recipe.ingredients = value; onUpdate(recipe); })}
    </div>
  );
};

const renderRightPane = (recipe, editable, onUpdate) => {
  return (
    <div className="recipe-card-directions">
      <h3>Directions</h3>
      {renderTimes(recipe, editable, onUpdate)}
      {renderDirections(recipe.directions, editable, (value) => { recipe.directions = value; onUpdate(recipe); })}
    </div>
  );
}

const renderSideBar = (recipe, sideBarButtons, editable, onUpdate) => {
  return (
    <div className="recipe-card-tags">
      {sideBarButtons}
      {renderTags(recipe.tags, editable, (newTags) => {
        recipe.tags = newTags;
        onUpdate(recipe);
      })}
    </div>
  );
}

const renderTags = (tags, editable, onUpdate) => {
  const [newTag, setNewTag] = useState('');

  if (editable) {
    return (
      <div className="tags-group mt-3">
        <TextInput
          onUpdate={setNewTag}
          value={newTag}
          onReturn={() => {
            if (newTag === '') {
              return;
            }

            if (tags.indexOf(newTag) === -1) {
              tags.push(newTag);
              onUpdate(tags);
            }

            setNewTag('');
          }}
        />
        {tags.map((tag, idx) => (
          <div class="badge badge-pill badge-info recipe-tag mr-1">
            {tag}
            <button
              type="button"
              className="close"
              onClick={() => {
                tags.splice(idx, 1);
                onUpdate(tags);
              }}>
              <span>×</span>
            </button>
          </div>
        ))
        }
      </div >
    );
  } else {
    return (
      <div className="tags-group mt-3">
        {tags.map((tag) => (
          <div class="badge badge-pill badge-info recipe-tag mr-1">
            {tag}
          </div>
        ))}
      </div>
    );
  }
}

const renderName = (name, editable, onUpdate) => {
  if (editable) {
    return <TextInput
      value={name}
      onUpdate={onUpdate}
      classes={["recipe-card-recipe-name-edit-input", "input-lg"]}
    />;
  } else {
    return <h1>{name}</h1>;
  }
}

const renderTimes = (times, editable, onUpdate) => {
  const { prep_time, cook_time, total_time } = times;

  const items = [
    { name: "Prep Time", value: prep_time, onUpdate: (value) => { times.prep_time = value; onUpdate(times); } },
    { name: "Cook Time", value: cook_time, onUpdate: (value) => { times.cook_time = value; onUpdate(times); } },
    { name: "Total Time", value: total_time, onUpdate: (value) => { times.total_time = value; onUpdate(times); } },
  ];

  if (editable) {
    const elems = items
      .map((item, idx) => (
        <div key={idx} className="col-sm-4">
          <label>{item.name}</label>
          <TextInput value={item.value} onUpdate={item.onUpdate} />
        </div>
      ));

    return <div className="recipe-card-times form-group row">{elems}</div>;
  } else {
    const elems = items
      .filter((item) => !!item.value)
      .map((item) => item.name + ": " + item.value);

    return <div className="recipe-card-times">{elems.join(" - ")}</div>;
  }
}

const renderServings = (servings, editable, onUpdate) => {
  if (editable) {
    return (
      <div className="recipe-card-servings form-group row">
        <div className="col-sm-1 v-centered">(for</div>
        <div className="col-sm-6"><TextInput value={servings} onUpdate={onUpdate} /></div>
        <div className="col-sm-3 v-centered">servings)</div>
      </div>
    )
  } else if (servings) {
    return (
      <div className="recipe-card-servings">
        (for {servings} servings)
      </div>
    );
  } else {
    return undefined;
  }
}

const renderIngredients = (ingredients, editable, onUpdate) => {
  return (
    <RecipeIngredientsList
      ingredients={ingredients || []}
      editable={editable}
      onUpdate={onUpdate}
    />
  );
}

const renderDirections = (directions, editable, onUpdate) => {
  return (
    <RecipeDirectionsList
      directions={directions || []}
      editable={editable}
      onUpdate={onUpdate}
    />
  );
}

const renderPreviewImageHidden = (preview_url, editable, onUpdate) => {
  return (
    <div
      className="recipe-card-preview-container"
      hidden
    >
      <img
        className="recipe-card-preview"
        src={preview_url}
      />
      {
        editable ? <TextInput value={preview_url} onUpdate={onUpdate} /> : undefined
      }
    </div>
  );
}

const allocateAndShowPreviewImage = () => {
  var image = $(".recipe-card-preview-container");

  if (!image.attr("hidden")) {
    return;
  }

  var leftPane = $(".recipe-card-left");
  var rightPane = $(".recipe-card-right");

  if (leftPane.height() <= rightPane.height()) {
    leftPane.prepend(image);
  } else {
    rightPane.prepend(image);
  }

  image.removeAttr("hidden");
}

export default RecipeDetails;
