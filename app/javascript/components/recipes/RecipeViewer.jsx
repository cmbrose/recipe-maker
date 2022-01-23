import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"

import RecipeDetails from "./RecipeDetails";

const RecipeViewer = ({
    recipe,
    default_preview,
    edit_url,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        fetchMenus(setMenus);
    }, []);

    var managementButtons = [
        (<button key="add-to-menu" type="button" className="btn btn-sm btn-secondary mr-1" onClick={() => setShowModal(true)}>
            Add to Menu
        </button>),
        (<button key="edit" type="button" className="btn btn-sm btn-secondary mr-1" onClick={() => {
            window.location.href = edit_url;
        }}>
            Edit
        </button>),
    ];

    return (
        <>
            <div className="recipe-viewer">
                <RecipeDetails
                    recipe={recipe}
                    editable={false}
                    managementButtons={managementButtons}
                    defaultPreview={default_preview}
                />
            </div >

            {renderAddToMenuModal(menus, showModal, () => setShowModal(false), (menuId) => {
                $.ajax({
                    url: `/api/menus/${menuId}/recipes`,
                    type: "PUT",
                    data: {
                        recipeId: recipe.id,
                    },
                    dataType: "json"
                });
            })}
        </>
    );
}

const fetchMenus = (setMenus) => {
    $.ajax({
        url: "/api/menus",
        type: "GET",
        dataType: "json",
        success: (data) => setMenus(data)
    });
}

const renderAddToMenuModal = (menus, show, handleClose, submit) => {
    const [selectedMenu, setSelectedMenu] = useState(undefined);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Modal heading</Modal.Title>
                    <button type="button" className="close" onClick={handleClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <DropdownButton id="menu-dropdown" title={selectedMenu ? selectedMenu.name : "Select a menu..."}>
                        {menus.map((menu) => (
                            <Dropdown.Item
                                key={"menu-select-" + menu.id}
                                onClick={() => setSelectedMenu(menu)}
                            >
                                {menu.name}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>
                        Close
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={selectedMenu === undefined}
                        onClick={() => {
                            submit(selectedMenu.id);
                            handleClose();
                        }}>
                        Add
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RecipeViewer;