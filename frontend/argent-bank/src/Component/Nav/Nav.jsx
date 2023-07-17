import React from "react";
import argentBankLogo from "../../img/argentBankLogo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { disconnectUser } from "../../Feature/disconnectUser";

export default function Nav() {
  const isAuth = useSelector((state) => state.user.connected);
  const firstName = useSelector((state) => state.user.data.firstName);

  return (
    <nav className="main-nav">
      <Link to={"/"} className="main-nav-logo">
        <img
          className="main-nav-logo-image"
          src={argentBankLogo}
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>

      {!isAuth ? (
        <div>
          <Link to={"/login"} className="main-nav-item">
            <i className="fa fa-user-circle"></i>
            Sign In
          </Link>
        </div>
      ) : (
        <div>
          <Link to={"/profile"} className="main-nav-item">
            <i className="fa fa-user-circle"></i>
            {firstName}
          </Link>

          <Link
            to={"/"}
            className="main-nav-item"
            onClick={() => disconnectUser()}
          >
            <i className="fa fa-sign-out"></i>
            Sign Out
          </Link>
        </div>
      )}
    </nav>
  );
}
