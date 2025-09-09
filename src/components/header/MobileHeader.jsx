import React from "react";
import { useAuth } from "../../utils/AuthContext.js";
import FirestoreListener from "../../firebase/FirestoreListener.js";
import "../../css/styles.css";
import UserDropdown from "./UserDropdown.jsx";
import chef from "./chef.svg";

const MobileHeader = () => {
  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();
  //opening/closing the cart modal and keeping track of cart item count

  return (
    <div id="mobile-header" className="header">
      <div>
        <img src={chef} id="chef" alt="CookBook-Pro Logo" /> CookBook-Pro
      </div>
      <div className="links--wrapper">
        {user ? (
          <>
            <UserDropdown />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default MobileHeader;
