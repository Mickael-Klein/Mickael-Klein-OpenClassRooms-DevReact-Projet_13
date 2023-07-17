import React, { useEffect, useState } from "react";
import EditUserInfo from "../../Component/EditUserInfo/EditUserInfo";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDataService } from "../../Service/fetchService";

export default function User() {
  const [data, setData] = useState(null);

  const token = useSelector((state) => state.user.data.token);
  const connected = useSelector((state) => state.user.connected);
  const fullProfile = useSelector((state) => state.user.fullProfile);
  // const lastUpdate = useSelector((state) => state.user.lastUpdate);
  const editUserActive = useSelector((state) => state.editUser.active);
  const firstName = useSelector((state) => state.user.data.firstName);
  const lastName = useSelector((state) => state.user.data.lastName);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!connected) {
      navigate("/login");
    }
    if (connected && !fullProfile) {
      async function fetchUserInfo() {
        return await fetchDataService("getUser", token);
      }
      const fetchData = async () => {
        const userInfo = await fetchUserInfo();
        setData(userInfo);
      };
      fetchData();
    } // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data && !fullProfile) {
      dispatch({ type: "user/getUserInfo", payload: data });
      if (!sessionStorage.getItem("token")) {
        sessionStorage.setItem("token", token);
      }
    } // eslint-disable-next-line
  }, [data, dispatch, token]);

  // useEffect(() => {
  //   // refresh datas each 3 minutes, coulb be replace with webSocket for refreshing when server updates (when transactions will be implemented)
  //   setInterval(() => {
  //     fetchDataService(getUser, token);
  //   }, 180000);
  // const needRefresh = isTimeToUpdateData();
  // if(neefRefresh) {
  //   fetchDataService("getUser", token)
  // }
  // }, []);

  // function isTimeToUpdateData() {
  //   // If user come back to page and datas are more than a minute old, refresh it
  //   if (Date.now() - lastUpdate >= 60000) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  function toogleEditUser() {
    dispatch({ type: "editUser/toogleEditing" });
  }

  return (
    <main className="main bg-dark">
      <div className="header">
        {!editUserActive ? (
          <>
            <h1>
              Welcome back
              <br />
              {`${firstName} ${lastName}!`}
            </h1>
            <button className="edit-button" onClick={() => toogleEditUser()}>
              Edit Name
            </button>
          </>
        ) : (
          <EditUserInfo />
        )}
      </div>
      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  );
}
