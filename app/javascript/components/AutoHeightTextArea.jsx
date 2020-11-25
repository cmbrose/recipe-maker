import React, { useEffect, useRef } from "react";

const AutoHeightTextArea = ({
  value,
  onUpdate,
  classes,
  ...other
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    onTextUpdate(textareaRef.current);
  }, [value]);

  var textArea = (
    <textarea
      ref={textareaRef}
      value={value}
      className={["form-control", ...(classes || [])].join(' ')}
      onChange={(e) => onUpdate(e.target.value)}
      // Start with one so single lines items don't have an extra line and resizing will take care longer items
      rows={"1"}
      {...other}
    />
  );

  return textArea;
};

const onTextUpdate = (area) => {
  // Reset field height
  area.style.height = "inherit";

  // Get the computed styles for the element
  const computed = window.getComputedStyle(area);

  // Calculate the height
  const height =
    parseInt(computed.getPropertyValue("border-top-width"), 10) +
    parseInt(computed.getPropertyValue("padding-top"), 10) +
    area.scrollHeight +
    parseInt(computed.getPropertyValue("padding-bottom"), 10) +
    parseInt(computed.getPropertyValue("border-bottom-width"), 10);

  area.style.height = `${height}px`;
};

export default AutoHeightTextArea;
