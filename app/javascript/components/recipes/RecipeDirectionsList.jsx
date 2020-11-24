import React from "react";

import AutoHeightTextArea from "../AutoHeightTextArea";

const RecipeDirectionsList = ({ directions, editable, onUpdate, ...other }) => {
  var items = directions.map((direction, idx) => (
    <li key={idx}>
      {renderItem(direction, editable, (value) => onUpdate(idx, value))}
    </li>
  ));

  return <ol>{items}</ol>;
};

const renderItem = (item, editable, onUpdate) => {
  if (editable) {
    return (
      <AutoHeightTextArea
        className="recipe-direction-edit-area"
        initialValue={item}
        onChange={onUpdate}
      />
    );
  } else {
    return <>{item}</>;
  }
};

export default RecipeDirectionsList;
