import React, { useState, useEffect } from "react";
import restImg1 from "../../assets/paratha.jpg";
import "./Details.css";
import MenuCard from "./MenuCard";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const settings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  autoplay: true,
};

function Details() {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const navigate = useNavigate();

  Modal.setAppElement("#root");

  // const cartObject = { restaurantId: restaurantId, menuItems: menuItems };

  useEffect(() => {
    // To get menu items by restaurant id
    axios({
      url: "http://localhost:4567/getMenuItemsByRestaurantId",
      method: "POST",
      data: { restaurantId: restaurantId },
      headers: { "Content-Type": "Application/json" },
    })
      .then((response) => {
        // console.log("Menu items received from db");
        setMenuItems(response.data.menuItems);
        setRestaurant(response.data.restaurant);
        localStorage.setItem("restaurantId", restaurantId);
        localStorage.setItem(
          "menuItems",
          JSON.stringify(response.data.menuItems)
        );
      })
      .catch((err) => console.log(err));
  }, []);

  function incrementCart(id) {
    // Update localStorage
    const menu = JSON.parse(localStorage.getItem("menuItems"));
    menu.find((obj) => obj._id == id).qty += 1;
    localStorage.setItem("menuItems", JSON.stringify(menu));

    // Update state
    menuItems.find((obj) => obj._id == id).qty += 1;
    setMenuItems([...menuItems]);
  }

  function decrementCart(id) {
    // Update localStorage
    const menu = JSON.parse(localStorage.getItem("menuItems"));
    menu.find((obj) => obj._id == id).qty -= 1;
    localStorage.setItem("menuItems", JSON.stringify(menu));

    // Update state
    menuItems.find((obj) => obj._id == id).qty -= 1;
    setMenuItems([...menuItems]);
  }

  function handleNavigateCheckout() {
    navigate(`/checkout`);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  console.log(restaurant);

  return (
    <div className="details d-flex gap-3 p-3">
      <div className="details__imgContainer d-flex justify-content-start flex-column w-50">
        <img src={restImg1} alt="" className="details__img" />
        <button className="btn btn-dark" onClick={openModal}>
          View Gallary
        </button>
      </div>
      <div className="restaurant__details w-50">
        <div className="restaurant__infoContainer d-flex justify-content-between align-items-center">
          <div className="restaurant__info">
            <h3>{restaurant?.name}</h3>
            <h5>{restaurant?.city_name}</h5>
          </div>
          <button className="btn btn-danger" onClick={handleNavigateCheckout}>
            Checkout
          </button>
        </div>
        <div className="restaurant__menus">
          <ul
            className="menu__list nav nav-underline border-bottom"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#overview-pane"
              >
                Overview
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#order-pane"
              >
                Order Online
              </button>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane active" id="overview-pane">
              {console.log(restaurant)}
              <h4>{restaurant?.name}</h4>
              {restaurant?.Cuisine?.map((obj) => (
                <h6 key={obj.cuisine}>{obj.name}</h6>
              ))}
              <h6>
                <span className="text-primary">Address:</span>
                {restaurant?.address}
              </h6>
            </div>
            <div className="tab-pane" id="order-pane">
              {menuItems?.map((obj) => (
                <MenuCard
                  menuObj={obj}
                  key={obj._id}
                  incrementCart={incrementCart}
                  decrementCart={decrementCart}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="d-flex flex-row-reverse">
          <button onClick={closeModal} className="btn btn-danger">
            X
          </button>
        </div>
        <div>
          {/* instead of passing props name, we are spreading the object in props */}
          <Slider {...settings}>
            {restaurant?.images?.map((imageUrl) => (
              <div key={restaurant._id}>
                <img src={imageUrl} alt="no image" />
              </div>
            ))}
          </Slider>
        </div>
      </Modal>
    </div>
  );
}

export default Details;
