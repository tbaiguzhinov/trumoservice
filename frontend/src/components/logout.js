import { useEffect, useState } from "react";
import axios from "axios";
export const Logout = () => {
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:8000/logout/",
          { token: localStorage.getItem("access_token") },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          },
          { withCredentials: true }
        );
        localStorage.clear();
        axios.defaults.headers.common["Authorization"] = null;
        window.location.href = "/";
      } catch (e) {
        console.log("logout not working", e);
      }
    })();
  }, []);
  return <div></div>;
};
