import React from 'react'
import PropTypes from 'prop-types'

import AutoHeightTextarea from '../AutoHeightTextarea'

class RecipeDirectionsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var items = this.props.directions.map((direction, idx) => (
      this.renderItem(direction, idx)
    ));

    return (
      <ol>
        { items }
      </ol>
    );
  }

  renderItem(item, idx) {
    if (this.props.editable) {
      return (
        <li key={idx}>
          <AutoHeightTextarea
            className="recipe-direction-edit-area"
            initialValue={item} 
            onChange={(value) => this.props.onUpdateValue(idx, value)}
          />
        </li>
      );
    } else {
      return (
        <li key={idx}>
          {item}
        </li>
      );
    }
  }

  autoGrow(textarea) {
    // Reset field height
    textarea.style.height = 'inherit';

    // Get the computed styles for the element
    const computed = window.getComputedStyle(textarea);

    // Calculate the height
    const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                + parseInt(computed.getPropertyValue('padding-top'), 10)
                + textarea.scrollHeight
                + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    textarea.style.height = `${height}px`; 
  }
}

RecipeDirectionsList.defaultProps = {
  directions: [],
  editable: false,
  onUpdateValue: () => {},
}

RecipeDirectionsList.propTypes = {
  directions: PropTypes.array,
  editable: PropTypes.bool,
  onUpdateValue: PropTypes.func,
}

export default RecipeDirectionsList