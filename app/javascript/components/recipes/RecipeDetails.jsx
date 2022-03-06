import React, { useEffect, useState } from "react";

import RecipeTag from "./RecipeTag";
import RecipeDirectionsList from "./RecipeDirectionsList";
import RecipeIngredientsList from "./RecipeIngredientsList";
import TextInput from "../TextInput";
import EditableTextAreaList, { NewItemMode_Blank }  from "../EditableTextAreaList";

const RecipeDetails = ({
  recipe,
  editable,
  onUpdate,
  managementButtons,
  defaultPreview,
  ...other
}) => {
  useEffect(allocateAndShowPreviewImage);

  return (
    <div className="recipe-card">
      <div className="row recipe-card-name">{renderName(recipe.name, editable, (name) => {
        recipe.name = name;
        onUpdate(recipe);
      })}</div>

      <div className="row recipe-card-meta">{renderMetaPanel(recipe, managementButtons, editable, onUpdate)}</div>

      <div className="row recipe-body">
        <div className="col-sm-5 recipe-card-left">{renderLeftPane(recipe, editable, onUpdate)}</div>
        <div className="col-sm-7 recipe-card-right">{renderRightPane(recipe, editable, onUpdate)}</div>
      </div>

      {renderPreviewImageHidden(recipe.preview_url, defaultPreview, editable, (url) => { recipe.preview_url = url; onUpdate(recipe); })}
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
    <div className="recipe-right-pane">
      <div className="recipe-card-directions">
        <h3>Directions</h3>
        {renderTimes(recipe, editable, onUpdate)}
        {renderDirections(recipe.directions, editable, (value) => { recipe.directions = value; onUpdate(recipe); })}
      </div>
      {renderNotes(recipe.notes, editable, (value) => { recipe.notes = value; onUpdate(recipe); })}
    </div>
  );
}

const renderMetaPanel = (recipe, buttons, editable, onUpdate) => {
  return (
    <>
      <div className="col">
        {renderTags(recipe.tags, editable, (newTags) => {
          recipe.tags = newTags;
          onUpdate(recipe);
        })}
      </div>
      <div className="float-right">
        {buttons}
      </div>
    </>
  );
}

const renderTags = (tags, editable, onUpdate) => {
  const [newTag, setNewTag] = useState('');

  if (editable) {
    return (
      <div className="tags-group form-group row mb-0">
        <div className="v-centered">
          <label className="v-centered">Tags&nbsp;</label>
          {tags.map((tag, idx) => (
            <RecipeTag
              key={"tag-edit-" + tag}
              name={tag}
              editable={true}
              onRemove={() => {
                tags.splice(idx, 1);
                onUpdate(tags);
              }}
            />
          ))}
        </div>
        <TextInput
          onUpdate={setNewTag}
          value={newTag}
          classes={["col-sm-2", "form-control-sm"]}
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
      </div >
    );
  } else if (tags.length > 0) {
    return (
      <div className="tags-group form-group row mb-0">
        <div className="v-centered">
          <label className="v-centered">Tags&nbsp;</label>
          {tags.map((tag) => (
            <RecipeTag key={"tag-link-" + tag} name={tag} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="tags-group form-group row mb-0">
        <div className="v-centered">
          <label className="v-centered">Tags&nbsp;</label>
          <span className="badge badge-secondary recipe-tag mr-1">
            [No tags]
          </span>
        </div>
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
          <TextInput value={item.value || ""} onUpdate={item.onUpdate} />
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
        <div className="col-sm-6"><TextInput value={servings || ""} onUpdate={onUpdate} /></div>
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

const renderNotes = (notes, editable, onUpdate) => {
  var listElement = null;

  if (editable) {
    listElement = (
      <EditableTextAreaList
        items={notes || []}
        onUpdate={onUpdate}
        buildNewItem={() => ""}
        newItemMode={NewItemMode_Blank}
        renderListItem={
          (item, onUpdate, key) => (
            <TextInput
              key={key}
              placeholder={"Add note..."}
              value={item}
              onUpdate={onUpdate}
            />
          )
        }
      />
    );
  } else if (notes && notes.length > 0) {
    const items = notes.map((note, idx) => (
      <li key={idx}>
        {note}
      </li>
    ));
  
    listElement = (
      <ul>{items}</ul>
    );
  }

  if (!listElement) {
    return;
  }

  return (
    <>
      <h3>Notes</h3>
      {listElement}
    </>
  )
}

const renderPreviewImageHidden = (previewUrl, defaultUrl, editable, onUpdate) => {
  const img = previewUrl || editable
    ? <img
      className="recipe-card-preview mb-2"
      src={previewUrl || defaultUrl}
    />
    : undefined;

  return (
    <div
      className="recipe-card-preview-container"
      hidden
    >
      {img}
      {
        editable
          ? <TextInput
            placeholder="Preview Image Url"
            value={previewUrl || ""}
            onUpdate={onUpdate}
          />
          : undefined
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
