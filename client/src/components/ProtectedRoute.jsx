import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import api from "../api";

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const refreshToken = async () => {
    const token = localStorage.getItem(REFRESH_TOKEN)
    try {
      const response = await api.post('/api/token/refresh/',{
        refresh: token
      })
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN,response.data.access)
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false)
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExp = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExp < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }
  return isAuthorized ? children : <Navigate to={"/login"} />;
}

export default ProtectedRoute;
