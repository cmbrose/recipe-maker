import React from "react";

const TextInput = ({ value, onUpdate, classes }) => {
    classes = classes || [];

    return <input
        type="text"
        className={["form-control", ...classes].join(' ')}
        value={value}
        onChange={(e) => onUpdate(e.target.value)}
    />;
}

export default TextInput;