import React from "react";

const MenuListItem = ({
  id,
  menu,
}) => {
  return (
    <div
      className="row border menu-list-item"
      onClick={() => window.location.href = `/menus/${id}`}
    >
      <div className="v-centered col-sm-12">
        {menu.name || "Unnamed menu"}
      </div>
    </div>
  );
}

export default MenuListItem;
