import React from "react";
import RecipeDetails from "./RecipeDetails";

class RecipeEditor extends React.Component {
    state = {
        recipe: this.props.recipe
    };

    render() {
        var managementButtons = [
            (<button key="submit" type="button" className="btn btn-sm btn-primary mr-1" onClick={() => {
                $.ajax({
                    url: this.props.update_url,
                    type: "PUT",
                    data: JSON.stringify(this.state.recipe),
                    contentType: "application/json",
                    dataType: "json",
                    success: () => {
                        window.location.href = this.props.show_url;
                    }
                });
            }}>Submit</button>),
            (<button key="cancel" type="button" className="btn btn-sm btn-secondary mr-1" onClick={() => {
                window.location.href = this.props.show_url;
            }}>Cancel</button>),
            (<button key="delete" type="button" className="btn btn-sm btn-danger" onClick={() => {
                $.ajax({
                    url: this.props.delete_url,
                    type: "DELETE",
                    success: () => {
                        window.location.href = "/";
                    }
                });
            }}>Delete</button>),
        ]
        return (
            <div className="recipe-editor">
                <RecipeDetails
                    recipe={this.state.recipe}
                    editable={true}
                    onUpdate={(value) => this.setState({ recipe: value })}
                    managementButtons={managementButtons}
                    defaultPreview={this.props.default_preview}
                />
            </div >
        );
    }
}

export default RecipeEditor;