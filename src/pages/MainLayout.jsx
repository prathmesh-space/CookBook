import React from "react";
import UserDataViewer from "../components/side-container/UserDataViewer";

const MainLayout = ({ children }) => {
  return (
    <div>
      <div className="main-container">
        <div className="sidebar-container">
          <UserDataViewer />
        </div>
        {/* This is where our pages (children) get processed through the layout*/}
        <div className="content-container">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
