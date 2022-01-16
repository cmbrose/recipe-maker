import React from "react";
import PropTypes from "prop-types";

class MenuListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="row border menu-list-item"
        onClick={this.redirectToMenu.bind(this)}
      >
        <div className="v-centered col-sm-12 col-md-10">
          {this.props.menu.name || "Unnamed menu"}
        </div>
      </div>
    );
  }

  redirectToMenu() {
    window.location.href = "/menus/" + this.props.id;
  }
}

MenuListItem.defaultProps = {
  id: undefined,
  menu: {},
};

MenuListItem.propTypes = {
  id: PropTypes.number,
  menu: PropTypes.object,
};

export default MenuListItem;
