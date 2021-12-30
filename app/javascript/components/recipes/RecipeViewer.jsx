import React from "react";
import RecipeDetails from "./RecipeDetails";

class RecipeViewer extends React.Component {
    state = {
        recipe: this.props.recipe
    };

    render() {
        var managementButtons = [
            (<button type="button" className="btn btn-sm btn-secondary mr-1" onClick={() => {
                window.location.href = this.props.edit_url;
            }}>Edit</button>),
        ];

        return (
            <div className="recipe-viewer">
                <RecipeDetails
                    recipe={this.state.recipe}
                    editable={false}
                    managementButtons={managementButtons}
                />
            </div >
        );
    }
}

export default RecipeViewer;