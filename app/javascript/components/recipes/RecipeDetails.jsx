import React from "react";
import PropTypes from "prop-types";

import RecipeDirectionsList from "./RecipeDirectionsList";
import RecipeIngredientsList from "./RecipeIngredientsList";

class RecipeDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="recipe-card">
        <div className="recipe-card-name">{this.renderName()}</div>

        <div className="recipe-card-left">{this.renderIngredients()}</div>

        <div className="recipe-card-right">{this.renderDirections()}</div>

        {this.renderPreviewImageHidden()}
      </div>
    );
  }

  componentDidMount() {
    this.allocateAndShowPreviewImage();
  }

  renderName() {
    return <h1>{this.props.recipe.name}</h1>;
  }

  renderTimes() {
    var recipe = this.props.recipe;

    var times = [
      { name: "Prep Time", value: recipe.prep_time },
      { name: "Cook Time", value: recipe.cook_time },
      { name: "Total Time", value: recipe.total_time },
    ]
      .map((item) => {
        if (item.value) {
          return item.name + ": " + item.value;
        } else {
          return undefined;
        }
      })
      .filter((item) => !!item);

    return <div className="recipe-card-times">{times.join(" - ")}</div>;
  }

  renderServings() {
    if (!this.props.recipe.servings) {
      return undefined;
    }

    return (
      <div className="recipe-card-servings">
        (for {this.props.recipe.servings} servings)
      </div>
    );
  }

  renderIngredients() {
    return (
      <div className="recipe-card-ingredients">
        <h3>Ingredients</h3>
        {this.renderServings()}
        <RecipeIngredientsList
          ingredients={this.props.recipe.ingredients || []}
          editable={this.props.editable}
          onUpdate={(idx, value) => {
            /* TODO */
          }}
        />
      </div>
    );
  }

  renderDirections() {
    return (
      <div className="recipe-card-directions">
        <h3>Directions</h3>
        {this.renderTimes()}
        <RecipeDirectionsList
          directions={this.props.recipe.directions || []}
          editable={this.props.editable}
          onUpdate={(idx, value) => {
            /* TODO */
          }}
        />
      </div>
    );
  }

  renderPreviewImageHidden() {
    return (
      <img
        className="recipe-card-preview"
        hidden
        src={this.props.recipe.preview_url}
      />
    );
  }

  allocateAndShowPreviewImage() {
    var image = $(".recipe-card-preview");

    var leftPane = $(".recipe-card-left");
    var rightPane = $(".recipe-card-right");

    if (leftPane.height() <= rightPane.height()) {
      leftPane.prepend(image);
    } else {
      rightPane.prepend(image);
    }

    image.removeAttr("hidden");
  }
}

RecipeDetails.defaultProps = {
  recipe: {},
  onUpdate: () => {},
  editable: false,
};

RecipeDetails.propTypes = {
  recipe: PropTypes.object,
  onUpdate: PropTypes.func,
  editable: PropTypes.bool,
};

export default RecipeDetails;
