import React from "react";

const RecipeTag = ({
    name,
    editable = false,
    onRemove = undefined,
}) => {
    if (editable) {
        return (
            <span className="badge badge-info recipe-tag mr-1">
                {name}
                <button
                    type="button"
                    className="close"
                    onClick={onRemove}>
                    <span>×</span>
                </button>
            </span>
        );
    } else {
        return (
            <a href={"/recipes?tag=" + name} className="badge badge-info recipe-tag mr-1">
                {name}
            </a>
        );
    }
}

export default RecipeTag;