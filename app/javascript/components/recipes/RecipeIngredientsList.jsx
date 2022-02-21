import React from "react";

import TextInput from "../TextInput";
import EditableTextAreaList, { NewItemMode_Blank, NewItemMode_BlankIfEmpty } from "../EditableTextAreaList";
import AutoHeightTextArea from "../AutoHeightTextArea";

const RecipeIngredientsList = ({ ingredients, editable, onUpdate }) => {
  return editable
    ? renderEditable(ingredients, onUpdate)
    : renderReadonly(ingredients);
};

const renderEditable = (ingredients, onUpdate) => {
  return (
    <EditableTextAreaList
      items={ingredients}
      onUpdate={onUpdate}
      buildNewItem={() => ({ name: "", ingredients: [], })}
      newItemMode={NewItemMode_BlankIfEmpty}
      addItemText={"Add group"}
      renderListItem={renderGroupEditable}
    />
  );
};

const renderReadonly = (ingredients) => {
  const groups = ingredients.map(renderGroupReadonly);

  return (
    <>
      {groups}
    </>
  );
};

const renderGroupEditable = (group, onUpdate, key) => {
  var groupKey = `${key}_group`;

  var header = renderHeaderEditable(group.name, (value) => {
    group.name = value;
    onUpdate(group);
  });

  const items = renderIngredientsEditable(groupKey, group.ingredients, (value) => {
    group.ingredients = value;
    onUpdate(group);
  });

  return (
    <div key={groupKey} >
      {header}
      {items}
    </div >
  );
}

const renderGroupReadonly = (group, groupIdx) => {
  const groupKey = "group_" + groupIdx;

  const header = group.name
    ? renderHeaderReadonly(group.name)
    : undefined;

  const items = renderIngredientsReadonly(groupKey, group.ingredients);

  return (
    <div key={groupKey} >
      {header}
      {items}
    </div>
  );
};

const renderHeaderEditable = (header, onUpdate) => (
  <TextInput
    classes={["recipe-ingredient-group-edit-input"]}
    value={header}
    onUpdate={onUpdate}
    placeholder={"(Optional) Group Name"}
  />
);

const renderHeaderReadonly = (header) => (
  <h5 className="recipe-card-ingredient-group-name">
    {header}
  </h5>
);

const renderIngredientsEditable = (groupKey, ingredients, onUpdate) => (
  <EditableTextAreaList
    items={ingredients}
    onUpdate={onUpdate}
    listItemKeyPrefix={groupKey + "_item_"}
    buildNewItem={() => ""}
    newItemMode={NewItemMode_Blank}
    addItemText={"Add ingredient"}
    renderListItem={(item, onUpdate, key) => (
      <AutoHeightTextArea
        key={key}
        placeholder={"Add ingredient..."}
        value={item}
        onUpdate={onUpdate}
        classes={["recipe-ingredient-item-edit-area"]}
      />
    )}
  />
);

const renderIngredientsReadonly = (groupKey, ingredients) => {
  const items = ingredients.map((ingredient, ingrIdx) => (
    <li key={groupKey + "_item_" + ingrIdx} className="multiline-text">
      {ingredient}
    </li>
  ));

  return (
    <ul>
      {items}
    </ul>
  );
};

export default RecipeIngredientsList;
