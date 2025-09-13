import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext.js";
import FirestoreListener from "../../firebase/FirestoreListener.js";
import "../../css/styles.css";
import UserDropdown from "./UserDropdown.jsx";

const Header = () => {
  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();
  //opening/closing the cart modal and keeping track of cart item count
  const [modalOpen, setModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    //using user.uid breaks the application if the user is not logged in
    if (user) {
      const userCartPath = `Users/${user.uid}/Cart`;

      const unsubscribeFromCart = firestoreListener.subscribeToCollection(
        userCartPath,
        (docs) => {
          const recipes = docs.map((doc) => doc);
          setCartItems(recipes);
        }
      );

      //cleanup function
      return unsubscribeFromCart;
    }
  }, [user]);

  return (
    <div id="header" className="header">
      <div>
         CookBook
      </div>
      <div className="links--wrapper">
        {user ? (
          <>
            <Link to="/" className="header--link">
              Home
            </Link>
            <Link to="/search" className="header--link">
              Search
            </Link>
            <Link to="/recommendations" className="header--link">
              Recommendations
            </Link>
            <Link to="/create-recipe" className="header--link">
              Create Recipe
            </Link>
            <Link to="/calendar" className="header--link">
              Calendar
            </Link>
            
            <UserDropdown />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
