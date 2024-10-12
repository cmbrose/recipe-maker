import React, { useState } from "react";
import Modal from "react-bootstrap/Modal"

import RecipeDetails from "./RecipeDetails";

const RecipeEditor = ({
    recipe,
    update_url,
    delete_url,
    show_url,
    default_preview,
    is_new = false
}) => {
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const [recipeDetails, setRecipe] = useState(recipe);

    const handleSubmit = () => {
        $.ajax({
            url: update_url,
            type: is_new ? "POST" : "PUT",
            data: JSON.stringify(recipeDetails),
            contentType: "application/json",
            dataType: "json",
            headers: {
                'Accept': 'application/json'
            },
            success: (data) => {
                window.location.href = is_new ? `/recipes/${data.id}` : show_url;
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error("Error submitting recipe:", textStatus, errorThrown);
                console.log('Response:', jqXHR.responseText);
                // Handle error (e.g., display error message to user)
            }
        });
    };

    var managementButtons = [
        (<button key="submit" type="button" className="btn btn-sm btn-primary mr-1" onClick={handleSubmit}>
            {is_new ? "Create" : "Submit"}
        </button>),
        (<button key="cancel" type="button" className="btn btn-sm btn-secondary mr-1" onClick={() => {
            window.location.href = is_new ? "/" : show_url;
        }}>Cancel</button>),
    ];

    if (!is_new) {
        managementButtons.push(
            (<button key="delete" type="button" className="btn btn-sm btn-danger" onClick={() => setShowConfirmDeleteModal(true)}>
                Delete
            </button>)
        );
    }

    return (
        <>
            <div className="recipe-editor">
                <RecipeDetails
                    recipe={recipeDetails}
                    editable={true}
                    onUpdate={(value) => setRecipe({...value})}
                    managementButtons={managementButtons}
                    defaultPreview={default_preview}
                />
            </div>
            {!is_new && renderConfirmDeleteModal(showConfirmDeleteModal, () => setShowConfirmDeleteModal(false), () => {
                $.ajax({
                    url: delete_url,
                    type: "DELETE",
                    success: () => {
                        window.location.href = "/";
                    }
                });
            })}
        </>
    );
}

const renderConfirmDeleteModal = (show, handleClose, accept) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Confirm</Modal.Title>
                <button type="button" className="close" onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this recipe?
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={accept}>
                    Delete
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default RecipeEditor;
