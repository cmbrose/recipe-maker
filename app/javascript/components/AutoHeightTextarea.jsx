import React, { useEffect, useRef, useState} from "react";

const AutoHeightTextarea = ({initialValue, onChange, className, ...other}) => {
  const textareaRef = useRef(null);
  const [currentValue, setCurrentValue ] = useState(initialValue);

  useEffect(() => { onTextUpdate(textareaRef.current) }, [currentValue]);

  var textArea = (
      <textarea
          ref={textareaRef}
          value={currentValue}
          className={"form-control " + (className || "")}
          onChange={e=>{
            setCurrentValue(e.target.value);
            onChange ? onChange(e.target.value) : undefined;
          }}
           // Start with one so single lines items don't have an extra line and resizing will take care longer items
          rows={"1"}
          {...other}
      />
  );

  return textArea;
};

const onTextUpdate = (area) => {
  // Reset field height
  area.style.height = 'inherit';

  // Get the computed styles for the element
  const computed = window.getComputedStyle(area);

  // Calculate the height
  const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
               + parseInt(computed.getPropertyValue('padding-top'), 10)
               + area.scrollHeight
               + parseInt(computed.getPropertyValue('padding-bottom'), 10)
               + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

  area.style.height = `${height}px`;
}

export default AutoHeightTextarea;