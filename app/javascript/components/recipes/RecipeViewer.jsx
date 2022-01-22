import React, { useEffect, useState } from "react";
import RecipeDetails from "./RecipeDetails";

const RecipeViewer = ({
    recipe,
    default_preview,
    edit_url,
}) => {
    var managementButtons = [
        (<button key="add-to-menu" type="button" className="btn btn-sm btn-secondary mr-1" data-toggle="modal" data-target="#menuSelectModal">
            Add to Menu
        </button>),
        (<button key="edit" type="button" className="btn btn-sm btn-secondary mr-1" onClick={() => {
            window.location.href = edit_url;
        }}>
            Edit
        </button>),
    ];

    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(undefined);

    useEffect(() => {
        fetchMenus(setMenus);
    }, []);

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

            <div className="modal fade" id="menuSelectModal" tabindex="-1" role="dialog" aria-labelledby="menuSelectModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="menuSelectModalLabel">Select menu</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {selectedMenu ? selectedMenu.name : "Select a menu..."}
                            </a>

                            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                {menus.map((menu) => (
                                    <a
                                        key={"menu-select-" + menu.id}
                                        className="dropdown-item"
                                        onClick={() => setSelectedMenu(menu)}
                                    >
                                        {menu.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" disabled={selectedMenu === undefined} onClick={() => {
                                $.ajax({
                                    url: "/api/menus/" + selectedMenu.id + "/recipes",
                                    type: "PUT",
                                    data: {
                                        recipeId: recipe.id,
                                    },
                                    dataType: "json",
                                    success: () => $('#dropdownMenuLink').dropdown('toggle')
                                });
                            }}>Add</button>
                        </div>
                    </div>
                </div>
            </div >
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

export default RecipeViewer;