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
      <img
        loading="lazy"
        className="login-brand-illustration"
        srcSet="https://cdn.builder.io/api/v1/image/assets%2F2450d8fcb47b4af49f372399cfe338ac%2F0228e6bdc50c4d12b8f0964cf63af1d8?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2F2450d8fcb47b4af49f372399cfe338ac%2F0228e6bdc50c4d12b8f0964cf63af1d8?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2F2450d8fcb47b4af49f372399cfe338ac%2F0228e6bdc50c4d12b8f0964cf63af1d8?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2F2450d8fcb47b4af49f372399cfe338ac%2F0228e6bdc50c4d12b8f0964cf63af1d8?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2F2450d8fcb47b4af49f372399cfe338ac%2F0228e6bdc50c4d12b8f0964cf63af1d8?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2F2450d8fcb47b4af49f372399cfe338ac%2F0228e6bdc50c4d12b8f0964cf63af1d8?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2F2450d8fcb47b4af49f372399cfe338ac%2F0228e6bdc50c4d12b8f0964cf63af1d8?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2F2450d8fcb47b4af49f372399cfe338ac%2F0228e6bdc50c4d12b8f0964cf63af1d8"
        src="https://cdn.builder.io/api/v1/image/assets/2450d8fcb47b4af49f372399cfe338ac/0228e6bdc50c4d12b8f0964cf63af1d8"
        alt="CookBook brand image"
      />
      <h1 className="Title">Log In</h1>
      <br />
      <p className="login-welcome">Welcome to Cookbook</p>
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
      <div className="login-note">Please sign-in with Google</div>
    </div>
    </div>
  );
};

export default Login;
