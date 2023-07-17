import React, { useEffect, useState } from "react";
import "./EditUserInfo.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataService } from "../../Service/fetchService";

export default function EditUserInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorInForm, setErrorInForm] = useState([]);

  const firstNameReduxState = useSelector((state) => state.user.data.firstName);
  const lastNameReduxState = useSelector((state) => state.user.data.lastName);
  const token = useSelector((state) => state.user.data.token);

  const dispatch = useDispatch();

  const firstNameFormInput = document.querySelector("#firstName");
  const lastNameFormInput = document.querySelector("#lastName");

  useEffect(() => {
    if (firstNameFormInput && lastNameFormInput) {
      if (firstNameFormInput.classList.contains("errorInput")) {
        firstNameFormInput.classList.remove("errorInput");
      }
      if (lastNameFormInput.classList.contains("errorInput")) {
        lastNameFormInput.classList.remove("errorInput");
      }

      if (errorInForm.length > 0) {
        if (errorInForm.includes("firstName")) {
          firstNameFormInput.classList.add("errorInput");
        }
        if (errorInForm.includes("lastName")) {
          lastNameFormInput.classList.add("errorInput");
        }
      }
    } // eslint-disable-next-line
  }, [errorInForm]);

  function toogleEditUser() {
    dispatch({ type: "editUser/toogleEditing" });
  }

  function handleInputFormChange(e) {
    if (e.target.id === "firstName") {
      setFirstName(e.target.value);
    } else if (e.target.id === "lastName") {
      setLastName(e.target.value);
    } else {
      console.log("error on form input change");
    }
  }

  async function handleEditUserSubmit(e) {
    e.preventDefault();

    setErrorInForm([]);
    // eslint-disable-next-line
    const regex = /^[A-Za-zÀ-ÿ\-]+$/;

    const error = [];

    if (!regex.test(firstName)) {
      error.push("firstName");
    }
    if (!regex.test(lastName)) {
      error.push("lastName");
    }

    if (error.length > 0) {
      setErrorInForm(error);
      return;
    }

    const response = await fetchDataService("editUser", {
      firstName: firstName,
      lastName: lastName,
      token: token,
    });

    console.log(response);

    if (response.status === 200) {
      dispatch({ type: "user/editUser", payload: response });
    } else {
      dispatch({ type: "user/fetchingRejected", payload: response });
    }

    dispatch({ type: "editUser/toogleEditing" });
  }

  return (
    <>
      <h1>Welcome back</h1>
      <form id="editUserInfoForm">
        <div className="editUserInfoInputs">
          <input
            type="text"
            name="firstName"
            id="firstName"
            className=""
            placeholder={firstNameReduxState}
            onChange={(e) => handleInputFormChange(e)}
          />
          <input
            type="text"
            name="lastName"
            id="lastName"
            className=""
            placeholder={lastNameReduxState}
            onChange={(e) => handleInputFormChange(e)}
          />
        </div>
        <div className="editUserInfoButtons">
          <button
            type="submit"
            id="editUserInfoSubmit"
            onClick={(e) => handleEditUserSubmit(e)}
          >
            Save
          </button>
          <button id="editUserInfoCancel" onClick={() => toogleEditUser()}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
