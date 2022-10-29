// Custom hook for getting access_token and refreshing acccess-token pre expiring

import { useEffect, useState } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        console.log(res.data);
        window.history.pushState({}, null, "./");
        setAccessToken(res.data.access_token);
        setRefreshToken(res.data.refresh_token);
        setExpiresIn(res.data.expires_in);
      })
      .catch((err) => {
        console.log(err.message);
        window.location = "./";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    // refresh exactly 1 min before token expiring
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.access_token);
          setExpiresIn(res.data.expires_in);
        })
        .catch((err) => {
          console.log(err.message);
          window.location = "./";
        });
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
