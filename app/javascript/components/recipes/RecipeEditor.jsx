import React from "react";
import RecipeDetails from "./RecipeDetails";

// const RecipeEditor = ({ recipe: initialRecipe }) => {
//     const [currentRecipe, setRecipe] = useState(initialRecipe);

//     useEffect(() => {
//         setRecipe(initialRecipe);
//     }, [initialRecipe]);

//     return <RecipeDetails
//         recipe={currentRecipe}
//         editable={true}
//         onUpdate={setRecipe}
//     />
// }

class RecipeEditor extends React.Component {
    state = {
        recipe: this.props.recipe
    };

    render() {
        return (
            <div className="recipe-editor">
                <RecipeDetails
                    recipe={this.state.recipe}
                    editable={true}
                    onUpdate={(value) => this.setState({ recipe: value })}
                />
                <button className="btn btn-primary" onClick={() => {
                    $.ajax({
                        url: this.props.update_url,
                        type: "PUT",
                        data: JSON.stringify(this.state.recipe),
                        contentType: "application/json",
                        dataType: "json",
                        success: () => {
                            window.location.href = this.props.show_url;
                        }
                    })
                }}>Submit</button>
            </div>
        );
    }
}

export default RecipeEditor;