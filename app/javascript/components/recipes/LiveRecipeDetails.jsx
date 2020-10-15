import React from 'react'
import PropTypes from 'prop-types'
import RecipeDetails from './RecipeDetails';

class LiveRecipeDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { recipe: props.recipe };
  }

  render() {
    return (
      <RecipeDetails 
        recipe={ this.state.recipe } 
      />
    )
  }

  componentDidMount() {
    var self = this;

    var source = new EventSource("/recipes/" + this.props.id + "/live");

    source.addEventListener('recipe_update', function(ea) {
      self.setState({recipe: JSON.parse(ea.data)});
    }, 1);
  }
}

LiveRecipeDetails.defaultProps = {
  id: undefined,
  recipe: {}
}

LiveRecipeDetails.propTypes = {
  id: PropTypes.number,
  recipe: PropTypes.object
}

export default LiveRecipeDetails