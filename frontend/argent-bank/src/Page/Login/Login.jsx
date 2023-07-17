import React, { useEffect, useState } from "react";
import { fetchDataService } from "../../Service/fetchService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
  // States locaux pour inputs du form
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  // Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selector
  const fetching = useSelector((state) => state.user.fetchData.fetching);
  const connected = useSelector((state) => state.user.connected);

  // UseEffect
  useEffect(() => {
    if (connected) {
      navigate("/profile");
    }
  }, [connected, navigate]);

  // Functions
  const handleFormChange = (e) => {
    // Setter states locaux inputs du form
    if (e.target.id === "username") {
      setMail(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    } else {
      console.log("error on input change");
    }
  };

  const signIn = async (e) => {
    // Fonction qui check les credentials, puis enregistre token dans redux & sessionStorage et redirige le user si success, gere aussi le rememberMe pour stockage en local storage
    e.preventDefault();

    if (fetching === "fetching") {
      // Si fetching en cour
      return;
    }
    const userNameInput = document.querySelector("#username");
    const passwordInput = document.querySelector("#password");

    if (userNameInput.classList.contains("errorInput")) {
      userNameInput.classList.remove("errorInput");
    }
    if (passwordInput.classList.contains("errorInput")) {
      passwordInput.classList.remove("errorInput");
    }

    const response = await fetchDataService("signIn", {
      email: mail,
      password: password,
    });

    if (response.status === 200) {
      // Success
      console.log(response);
      const isRememberChecked = document.querySelector("#remember-me").checked;
      sessionStorage.setItem("token", response.body.token);
      if (isRememberChecked) {
        localStorage.setItem("token", response.body.token);
      }

      dispatch({ type: "user/loginFetchingResolved", payload: response });
      navigate("/profile");
    } else {
      // Failure
      if (!userNameInput.classList.contains("errorInput")) {
        userNameInput.classList.add("errorInput");
      }
      if (!passwordInput.classList.contains("errorInput")) {
        passwordInput.classList.add("errorInput");
      }

      dispatch({ type: "user/fetchingRejected", payload: response });
      console.log("Bad credentials");
    }
  };

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form>
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              onChange={(e) => handleFormChange(e)}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => handleFormChange(e)}
            />
          </div>
          <div className="input-remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>

          <button className="sign-in-button" onClick={(e) => signIn(e)}>
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}
