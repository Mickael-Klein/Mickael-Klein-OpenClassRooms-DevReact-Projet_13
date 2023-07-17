import { store } from "../Redux/store";

export async function disconnectUser() {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
  }
  sessionStorage.removeItem("token");

  store.dispatch({ type: "user/disconnectUser" });
}
