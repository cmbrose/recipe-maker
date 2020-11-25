import React from "react";

import AutoHeightTextArea from "../AutoHeightTextArea";

const RecipeDirectionsList = ({ directions, editable, onUpdate, ...other }) => {
  var items = directions.map((direction, idx) => (
    <li key={idx}>
      {renderItem(direction, editable, (value) => { directions[idx] = value; onUpdate(directions); })}
    </li>
  ));

  return <ol>{items}</ol>;
};

const renderItem = (item, editable, onUpdate) => {
  if (editable) {
    return (
      <AutoHeightTextArea
        classes={["recipe-direction-edit-area"]}
        value={item}
        onUpdate={onUpdate}
      />
    );
  } else {
    return <>{item}</>;
  }
};

export default RecipeDirectionsList;
