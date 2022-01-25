import React, { useState } from "react";
import Modal from "react-bootstrap/Modal"

import MenuDetails from "./MenuDetails";

const MenuViewer = ({
    menu,
    edit_url,
}) => {
    const [showConfirmClearModal, setShowConfirmClearModal] = useState(false);

    var managementButtons = [
        (<button key="clear" type="button" className="btn btn-sm btn-warning mr-1" onClick={() => setShowConfirmClearModal(true)}>
            Clear</button>),
        (<button key="edit" type="button" className="btn btn-sm btn-secondary mr-1" onClick={() => {
            window.location.href = edit_url;
        }}>Edit</button>),
    ];

    return (
        <>
            <div className="menu-viewer">
                <MenuDetails
                    menu={menu}
                    editable={false}
                    managementButtons={managementButtons}
                />
            </div>
            {renderConfirmClearModal(showConfirmClearModal, () => setShowConfirmClearModal(false), () => {
                $.ajax({
                    url: `/api/menus/${menu.id}/clear`,
                    type: "PUT",
                    dataType: "json",
                    success: () => location.reload(),
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
                Are you sure you want to clear this menu?
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={accept}>
                    Clear
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default MenuViewer;