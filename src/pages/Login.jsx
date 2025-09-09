import React, { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "../index";
import "../css/LoginSignUp.css";
import "../firebase/firebaseConfig.js";
import "./search/Search.jsx";
import "./SignUp.jsx";

var Login = () => {
  const [userEmail, isUserEmail] = useState("");
  const [userPassword, isUserPassword] = useState("");
  const [loginError, isLoginError] = useState("");
  const auth = getAuth();

  useEffect(() => {
    document.title = "CookBook-Pro: Login";
    document.body.classList.add("loginPage");
    document.body.style.backgroundColor = "#E0EAFC";
  }, []);

  const checkInput = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );
      const user = userCredential.user;
      document.location.href = "/";
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      isLoginError("Invalid Email Or Password");
      console.log(errorCode, errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      isUserEmail(user.email);
      document.location.href = "/";
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      isLoginError("Invalid Credentials");
      console.log(errorCode, errorMessage);
    }
  };

  return (
    <div className="loginContainer">
    <div className="LogIn">
      <h1 className="Title">Log In</h1>
      <br />
      <div>Welcome to Cookbook Pro!</div>
      <br></br>

      <br></br>
      <center>
        <button
          type="button"
          className="googleSignInButton"
          onClick={signInWithGoogle}
        >
          Log In with Google
        </button>
      </center>
      <br />
      <div>Please sign-in with Google</div>
    </div>
    </div>
  );
};

export default Login;
