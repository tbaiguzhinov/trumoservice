import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./components.module.css";

export const Home = () => {
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [complete, setComplete] = useState("");
  const [infoStyle, setInfoStyle] = useState("");
  const [loginInfo, setLoginInfo] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      (async () => {
        try {
          const { data } = await axios.get("http://localhost:8000/", {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          });
          await axios
            .get("http://localhost:8000/login-info", {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access_token"),
              },
            })
            .then((res) => {
              setLoginInfo(res.data["logins"]);
            });

          setMessage(data.message);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setDateOfBirth(data.date_of_birth);
          setIdNumber(data.id_number);
          if (data.form_complete === true) {
            setInfoStyle(styles.green);
            setComplete("Your form is complete");
          } else {
            setInfoStyle(styles.red);
            setComplete("Your form is incomplete. Please fill in the form");
          }
        } catch (e) {
          console.log(e);
          if (e.response.status === 401) {
            window.location.href = "/login";
          }
        }
      })();
    }
  }, []);
  return (
    <div className="form-signin mt-5 text-center">
      <h3>Hello {message}!</h3>
      <br></br>
      <p className={infoStyle}>{complete}</p>
      <br></br>
      <h4>My data</h4>
      <div className={styles.row}>
        <div className={styles.column}>
          <button className="btn btn-outline-primary active">
            <a href="/form" style={{ color: "white" }}>
              Change my data
            </a>
          </button>
        </div>
        <div className={styles.column}>
          <p>
            <b>First name:</b> {firstName}
          </p>
          <p>
            <b>Last name:</b> {lastName}
          </p>
          <p>
            <b>Date of birth:</b> {dateOfBirth}
          </p>
          <p>
            <b>Identification number:</b> {idNumber}
          </p>
        </div>
      </div>
      <br></br>
      <h4>Login information</h4>
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Activity</th>
              <th scope="col">Login time</th>
              <th scope="col">IP address</th>
              <th scope="col">User agent</th>
            </tr>
          </thead>
          <tbody>
            {loginInfo.map((login) => (
              <tr key={login.id}>
                <td>{login.action}</td>
                <td>{login.timestamp}</td>
                <td>{login.ip}</td>
                <td>{login.user_agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
