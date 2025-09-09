import React from "react";

const MobileLayout = ({ children }) => {
  return (
    <div className="mobile-container">
      <div id="header-logo" to="/"></div>
      {children}
      <div className="mobile-footer">
        {/* Add your mobile footer components here */}
      </div>
    </div>
  );
};

export default MobileLayout;
