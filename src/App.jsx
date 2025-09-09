import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home.jsx";
import Search from "./pages/search/Search";
import Calendar from "./pages/calendar/Calendar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MobileHeader from "./components/header/MobileHeader";
import Header from "./components/header/Header";

import Recomendations from "./pages/recommendations/Recommendations";
import CreateRecipes from "./pages/create-recipe/CreateRecipes";
import OrderHistory from "./pages/order-history/OrderHistory";
import MainLayout from "./pages/MainLayout";
import MobileLayout from "./pages/MobileLayout";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./utils/AuthContext";
import { isMobile } from "react-device-detect";
import "./css/styles.css";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  // Determine which layout to use based on whether the device is mobile or not
  const Layout = isMobile ? MobileLayout : MainLayout;
  const HeaderLayout = isMobile ? MobileHeader : Header;

  if (isMobile) {
    console.log("MobileLayout is being rendered.");
  }

  return (
    <Router>
      <AuthProvider>
        <HeaderLayout />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<PrivateRoutes />}>
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            {!isMobile && (
              <>
                <Route
                  path="/search"
                  element={
                    <Layout>
                      <Search />
                    </Layout>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <Layout>
                      <Recomendations />
                    </Layout>
                  }
                />
                <Route
                  path="/create-recipe"
                  element={
                    <Layout>
                      <CreateRecipes />
                    </Layout>
                  }
                />
                <Route
                  path="/order-history"
                  element={
                    <Layout>
                      <OrderHistory />
                    </Layout>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <MainLayout>
                      <Calendar />
                    </MainLayout>
                  }
                />
              </>
            )}
            {isMobile && (
              <Route
                path="/order-history"
                element={
                  <Layout>
                    <OrderHistory />
                  </Layout>
                }
              />
            )}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
