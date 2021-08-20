import React from "react";

import EditableTextAreaList from "../EditableTextAreaList";
import AutoHeightTextArea from "../AutoHeightTextArea";

const RecipeDirectionsList = ({ directions, editable, onUpdate }) => {
  return editable
    ? renderEditable(directions, onUpdate)
    : renderReadonly(directions);
};

const renderEditable = (items, onUpdate) => {
  return (
    <EditableTextAreaList
      items={items}
      onUpdate={onUpdate}
      listType={"ol"}
      buildNewItem={() => ""}
      addItemText={"Add step"}
      renderListItem={
        (item, idx) => {
          return (
            <AutoHeightTextArea
              value={item}
              onUpdate={(value) => {
                items[idx] = value;
                onUpdate(items);
              }}
              classes={["recipe-direction-edit-area"]}
            />
          );
        }
      }
    />
  );
};

const renderReadonly = (directions) => {
  const items = directions.map((direction, idx) => (
    <li key={idx}>
      {direction}
    </li>
  ));

  return (
    <ol>{items}</ol>
  );
}

export default RecipeDirectionsList;
