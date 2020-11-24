import React, { useState } from "react";

import AutoHeightTextArea from "../AutoHeightTextArea";

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
          onUpdate(groupIdx, group);
        })
      : undefined;

    var items = group.ingredients.map((ingredient, ingrIdx) => {
      var element = renderIngredient(ingredient, editable, (value) => {
        group.ingredients[ingrIdx] = value;
        onUpdate(groupIdx, group);
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
    const [currentValue, setCurrentValue] = useState(header);

    return (
      <input
        type="text"
        className="recipe-ingredient-group-edit-input form-control"
        value={currentValue}
        onChange={(e) => {
          setCurrentValue(e.target.value);
          onUpdate(e.target.value);
        }}
      ></input>
    );
  } else {
    return <h5 className="recipe-card-ingredient-group-name">{header}</h5>;
  }
};

const renderIngredient = (item, editable, onUpdate) => {
  if (editable) {
    return (
      <AutoHeightTextArea
        className="recipe-ingredient-item-edit-area"
        initialValue={item}
        onChange={onUpdate}
      />
    );
  } else {
    return <>{item}</>;
  }
};

export default RecipeIngredientsList;
