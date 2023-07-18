import { Routes, Route, useNavigate } from "react-router-dom";
import User from "./Page/User/User";
import Login from "./Page/Login/Login";
import NotFound from "./Page/NotFound/NotFound";
import Nav from "./Component/Nav/Nav";
import Footer from "./Component/Footer/Footer";
import Index from "./Page/Index/Index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDataService } from "./Service/fetchService";
import { disconnectUser } from "./Feature/disconnectUser";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const connected = useSelector((state) => state.user.connected);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // UseEffect
  useEffect(() => {
    setLoading(true);
    // Permet de vérifier si token dans localStorage ou sessionStorage pour auth user
    if (!connected) {
      const sessionToken = sessionStorage.getItem("token");
      const localToken = localStorage.getItem("token");
      let tokenInMemory = false;
      if (sessionToken) {
        tokenInMemory = sessionToken;
      } else if (localToken) {
        tokenInMemory = localToken;
      }
      if (tokenInMemory) {
        async function fetchUserInfo() {
          return await fetchDataService("getUser", tokenInMemory);
        }
        const fetchData = async () => {
          const userInfo = await fetchUserInfo();
          setData(userInfo);
        };
        fetchData();
      }
    }
    setLoading(false); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data && data.status === 401) {
      // If token was expired, disconnect user from app and remove token
      disconnectUser();
      navigate("/");
    }
    if (data && data.status === 200) {
      dispatch({ type: "user/getUserInfo", payload: data });
      if (!sessionStorage.getItem("token")) {
        sessionStorage.setItem("token", data.token);
      }
    }
  }, [data, dispatch]);

  return loading ? (
    <div>loading</div>
  ) : (
    <>
      <Nav />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<User />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
