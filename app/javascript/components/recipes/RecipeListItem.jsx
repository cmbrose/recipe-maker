import React from "react";
import PropTypes from "prop-types";

class RecipeListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="row border recipe-list-item"
        onClick={this.redirectToRecipe.bind(this)}
      >
        <div className="col-sm-2 col-md-2">{this.renderImagePreview()}</div>

        <div className="v-centered col-sm-12 col-md-10">
          {this.props.recipe.name || "Unnamed recipe"}
        </div>
      </div>
    );
  }

  renderImagePreview() {
    var url = this.props.recipe.preview_url || this.props.default_preview;

    return <img src={url} object-fit="scale-down" height="80px" />;
  }

  redirectToRecipe() {
    window.location.href = "/recipes/" + this.props.id;
  }
}

RecipeListItem.defaultProps = {
  id: undefined,
  recipe: {},
};

RecipeListItem.propTypes = {
  id: PropTypes.number,
  recipe: PropTypes.object,
};

export default RecipeListItem;
