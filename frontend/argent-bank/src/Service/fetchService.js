import axios from "axios";
import { store } from "../Redux/store";

export async function fetchDataService(type, data) {
  const myStore = store.getState();
  const fetching = myStore.user.fetchData.fetching;

  if (fetching === "fetching") {
    return;
  }

  store.dispatch({ type: "user/fetching" });

  if (type === "signIn") {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/login",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      const responseData = await response.data;
      console.log(responseData);
      return responseData;
    } catch (error) {
      const responseData = await error.response.data;
      console.log(responseData);
      store.dispatch({
        type: "user/fetchingRejected",
        payload: responseData.status,
      });
      return responseData;
    }
  } else if (type === "getUser") {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/profile",
        null,
        { headers: { Authorization: `Bearer ${data}` } }
      );
      const responseData = await response.data;
      responseData.token = data;
      console.log(responseData);
      return responseData;
    } catch (error) {
      const responseData = await error.response.data;
      console.log(responseData);
      store.dispatch({
        type: "user/fetchingRejected",
        payload: responseData.status,
      });
      return responseData;
    }
  } else if (type === "editUser") {
    console.log(type);
    const dataToSend = { firstName: data.firstName, lastName: data.lastName };
    try {
      const response = await axios.put(
        "http://localhost:3001/api/v1/user/profile",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      const responseData = response.data;
      console.log(responseData);
      return responseData;
    } catch (error) {
      const responseData = await error.response.data;
      console.log(responseData);
      return responseData;
    }
  }
}
