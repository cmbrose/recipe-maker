import React from "react";

import EditableTextAreaList, { NewItemMode_Blank } from "../EditableTextAreaList";
import AutoHeightTextArea from "../AutoHeightTextArea";

const RecipeDirectionsList = ({ directions, editable, onUpdate }) => {
  return editable
    ? renderEditable(directions, onUpdate)
    : renderReadonly(directions);
};

const renderEditable = (items, onUpdate) => (
  <EditableTextAreaList
    items={items}
    onUpdate={onUpdate}
    buildNewItem={() => ""}
    newItemMode={NewItemMode_Blank}
    addItemText={"Add step"}
    renderListItem={
      (item, onUpdate, key) => (
        <AutoHeightTextArea
          key={key}
          placeholder={"Add step..."}
          value={item}
          onUpdate={onUpdate}
          classes={["recipe-direction-edit-area"]}
        />
      )
    }
  />
);

const renderReadonly = (directions) => {
  const items = directions.map((direction, idx) => (
    <li key={idx} className="multiline-text">
      {direction}
    </li>
  ));

  return (
    <ol>{items}</ol>
  );
}

export default RecipeDirectionsList;
