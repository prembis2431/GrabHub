import React, { useState } from "react";
import MenuCard from "../Details/MenuCard";

function Checkout() {
  const [menu, setMenu] = useState(
    JSON.parse(localStorage.getItem("menuItems"))
  );

  function incrementCart(id) {
    // Update localStorage
    const menuLocalStorage = JSON.parse(localStorage.getItem("menuItems"));
    menuLocalStorage.find((obj) => obj._id == id).qty += 1;
    localStorage.setItem("menuItems", JSON.stringify(menuLocalStorage));

    // Update state
    menu.find((obj) => obj._id == id).qty += 1;
    setMenu([...menu]);
  }

  function decrementCart(id) {
    // Update localStorage
    const menuLocalStorage = JSON.parse(localStorage.getItem("menuItems"));
    menuLocalStorage.find((obj) => obj._id == id).qty -= 1;
    localStorage.setItem("menuItems", JSON.stringify(menuLocalStorage));

    // Update state
    menu.find((obj) => obj._id == id).qty -= 1;
    setMenu([...menu]);
  }

  return (
    <div>
      {menu.map((obj) =>
        obj.qty != 0 ? (
          <MenuCard
            menuObj={obj}
            incrementCart={incrementCart}
            decrementCart={decrementCart}
          />
        ) : (
          ""
        )
      )}
    </div>
  );
}

export default Checkout;
