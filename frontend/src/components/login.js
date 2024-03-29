import axios from "axios";
import { useState } from "react";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_BASE_URL + "/login/",
        user,
        {
          headers: {
            "Content-Type": "multipart/form-data;",
          },
        },
        { withCredentials: true }
      );

      localStorage.clear();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data["access_token"]}`;
      window.location.href = "/";
    } catch (e) {
      setErrors(e.response.data);
      console.log("login not working", e);
    }
  };
  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={submit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          {Object.keys(errors).length > 0 && (
            <div className="alert alert-danger" role="alert">
              {Object.values(errors).map((value) => (
                <p key={value}>{value}</p>
              ))}
            </div>
          )}

          <div className="form-group mt-3">
            <label>Username</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Username"
              name="username"
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
