import React from "react";
import MenuDetails from "./MenuDetails";

class MenuViewer extends React.Component {
    state = {
        menu: this.props.menu
    };

    render() {
        var managementButtons = [
            (<button key="edit" type="button" className="btn btn-sm btn-secondary mr-1" onClick={() => {
                window.location.href = this.props.edit_url;
            }}>Edit</button>),
        ];

        return (
            <div className="menu-viewer">
                <MenuDetails
                    menu={this.state.menu}
                    editable={false}
                    managementButtons={managementButtons}
                />
            </div >
        );
    }
}

export default MenuViewer;