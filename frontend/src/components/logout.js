import { useEffect } from "react";
import axios from "axios";
export const Logout = () => {
  useEffect(() => {
    (async () => {
      try {
        await axios.post(
          process.env.REACT_APP_BASE_URL + "/logout/",
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
