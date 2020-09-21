import React from 'react'
import PropTypes from 'prop-types'

class RecipeDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {  
    return (
      <div className="recipe-card">
        <h1 className="recipe-card-name">
          { this.props.recipe.name }
        </h1>

        { this.renderInfoTable() }

        <img className="recipe-card-preview" src={ this.props.recipe.preview_url } />

        { this.renderIngredients() }

        { this.renderDirections() }
      </div>
    );
  }

  renderInfoTable() {
    var recipe = this.props.recipe;

    var items = [
      { name: 'Prep Time', value: recipe.prep_time, },
      { name: 'Cook Time', value: recipe.cook_time, },
      { name: 'Total Time', value: recipe.total_time, },
      { name: 'Servings', value: recipe.servings, },
    ].map((item, idx) => {
      if (item.value) {
        return (
          <tr key={idx}>
            <td key={idx + '_name'} className="dl-table-dt">{ item.name }</td>
            <td key={idx + '_value'} className="dl-table-dd">{ item.value }</td>
          </tr>
        );
      } else {
        return undefined;
      }
    });

    return (
      <table className="recipe-card-info-table dl-table">
        <tbody>
          { items }
        </tbody>
      </table>
    );
  }

  renderIngredients() {
    var groups = (this.props.recipe.ingredients || []).map((group, idx) => {
      var key = idx + '_group';

      var header = group.name ? (<h3>{ group.name }</h3>) : undefined;
      var items = group.ingredients.map((ingredient, idx) => (
        <li key={key + '_' + idx + '_item'}>
          { ingredient }
        </li>
      ));

      return (
        <div key={key}>
          { header }
          { items }
        </div>
      )
    });

    return (
      <ul className="recipe-card-ingredients">
        { groups }
      </ul>
    );
  }

  renderDirections() {
    var items = (this.props.recipe.directions || []).map((direction, idx) => (
      <li key={idx}>
        { direction }
      </li>
    ));

    return (
      <ol className="recipe-card-directions">
        { items }
      </ol>
    );
  }
}

RecipeDetails.defaultProps = {
  recipe: {}
}

RecipeDetails.propTypes = {
  recipe: PropTypes.object
}

export default RecipeDetails