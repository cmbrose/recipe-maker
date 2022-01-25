import React from "react";
import ReactDragListView from "react-drag-listview";

const EditableTextAreaList = ({
  items,
  onUpdate,
  listItemKeyPrefix,
  renderListItem,
  buildNewItem,
  addItemText = "Add item"
}) => {
  const canAddItems = buildNewItem !== undefined;

  listItemKeyPrefix ||= "";
  const dragPointClass = 'drag-point_' + listItemKeyPrefix;

  const itemsElems = items.map((item, idx) => (
    <li key={listItemKeyPrefix + idx}>
      {renderItem(
        item,
        idx,
        dragPointClass,
        () => {
          items.splice(idx, 1);
          onUpdate(items);
        },
        renderListItem
      )}
    </li>
  ));

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const item = items.splice(fromIndex, 1)[0];
      items.splice(toIndex, 0, item);
      onUpdate(items);
    },
    nodeSelector: 'li',
    handleSelector: '.' + dragPointClass
  };

  const addItemButton = canAddItems
    ? renderAddItemButton(addItemText, () => {
      items.push(buildNewItem());
      onUpdate(items);
    })
    : undefined;

  return (
    <>
      <ReactDragListView {...dragProps}>
        <ul className="editable-text-area-list">{itemsElems}</ul>
      </ReactDragListView>
      {addItemButton}
    </>
  );
};

const renderItem = (item, idx, dragPointClass, onDelete, renderListItem) => {
  return (
    <div className="d-flex editable-text-area-list-item">
      <div className={dragPointClass}>
        <button type="button" className="btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-up" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"></path>
          </svg>
        </button>
      </div>
      <div className="flex-grow-1">
        {renderListItem !== undefined ? renderListItem(item, idx) : item}
      </div>
      <div className="hidden-child">
        <button type="button" className="btn" onClick={onDelete}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const renderAddItemButton = (text, onClick) => {
  return (<button
    type="button"
    className="btn btn-outline-secondary"
    onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
    </svg>
    {text}
  </button>);
}

export default EditableTextAreaList;
