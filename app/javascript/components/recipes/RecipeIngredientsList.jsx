import React from "react";

import AutoHeightTextArea from "../AutoHeightTextArea";
import TextInput from "../TextInput";

const RecipeIngredientsList = ({
  ingredients,
  editable,
  onUpdate,
  ...other
}) => {
  var groups = ingredients.map((group, groupIdx) => {
    var key = groupIdx + "_group";

    var header = group.name
      ? renderHeader(group.name, editable, (value) => {
        group.name = value;
        onUpdate(ingredients);
      })
      : undefined;

    var items = group.ingredients.map((ingredient, ingrIdx) => {
      var element = renderIngredient(ingredient, editable, (value) => {
        group.ingredients[ingrIdx] = value;
        onUpdate(ingredients);
      });

      return <li key={key + "_" + ingrIdx + "_item"}>{element}</li>;
    });

    return (
      <div key={key}>
        {header}
        {items}
      </div>
    );
  });

  return <ul>{groups}</ul>;
};

const renderHeader = (header, editable, onUpdate) => {
  if (editable) {
    return (
      <TextInput
        classes={["recipe-ingredient-group-edit-input"]}
        value={header}
        onUpdate={onUpdate}
      />
    );
  } else {
    return <h5 className="recipe-card-ingredient-group-name">{header}</h5>;
  }
};

const renderIngredient = (item, editable, onUpdate) => {
  if (editable) {
    return (
      <AutoHeightTextArea
        classes={["recipe-ingredient-item-edit-area"]}
        value={item}
        onUpdate={onUpdate}
      />
    );
  } else {
    return <>{item}</>;
  }
};

export default RecipeIngredientsList;
