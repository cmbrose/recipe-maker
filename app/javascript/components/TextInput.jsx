import React from "react";

const TextInput = ({ value, onUpdate, onReturn, classes, ...other }) => {
    classes = classes || [];

    value = value || '';

    return <input
        type="text"
        className={["form-control", ...classes].join(' ')}
        value={value}
        onChange={(e) => onUpdate(e.target.value)}
        onKeyUp={(e) => {
            if (e.key === 'Enter') {
                onReturn();
            }
        }}
        {...other}
    />;
}

export default TextInput;