import React, { useState } from "react";
import Modal from "react-bootstrap/Modal"

import MenuDetails from "./MenuDetails";

const MenuEditor = ({
    menu,
    update_url,
    show_url,
    delete_url,
}) => {
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const [menuDetails, setMenu] = useState({...menu});

    var managementButtons = [
        (<button key="submit" type="button" className="btn btn-sm btn-primary mr-1" onClick={() => {
            $.ajax({
                url: update_url,
                type: "PUT",
                data: JSON.stringify(menuDetails),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    window.location.href = show_url;
                }
            });
        }}>Submit</button>),
        (<button key="cancel" type="button" className="btn btn-sm btn-secondary mr-1" onClick={() => {
            window.location.href = show_url;
        }}>Cancel</button>),
        (<button key="delete" type="button" className="btn btn-sm btn-danger" onClick={() => setShowConfirmDeleteModal(true)}>
            Delete</button>),
    ];

    return (
        <>
            <div className="menu-viewer">
                <MenuDetails
                    menu={menu}
                    editable={true}
                    managementButtons={managementButtons}
                    onUpdate={(value) => setMenu({...value})}
                />
            </div>
            {renderConfirmClearModal(showConfirmDeleteModal, () => setShowConfirmDeleteModal(false), () => {
                $.ajax({
                    url: delete_url,
                    type: "DELETE",
                    dataType: "json",
                    success: () => {
                        window.location.href = "/menus";
                    }
                });
            })}
        </>
    );
}

const renderConfirmClearModal = (show, handleClose, accept) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Confirm</Modal.Title>
                <button type="button" className="close" onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this menu?
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

export default MenuEditor;