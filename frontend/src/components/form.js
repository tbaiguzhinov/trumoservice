import axios from "axios";
import { useState, useEffect } from "react";

export const Form = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [errors, setErrors] = useState({});

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
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setDateOfBirth(data.date_of_birth);
          setIdNumber(data.id_number);
        } catch (e) {
          if (e.response.status === 401) {
            window.location.href = "/login";
          }
        }
      })();
    }
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("first_name", firstName);
    form.append("last_name", lastName);
    form.append("date_of_birth", dateOfBirth);
    form.append("identification_number", idNumber);
    try {
      await axios.patch("http://localhost:8000/update", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      window.location.href = "/";
    } catch (e) {
      console.log(e.response.data);
      setErrors(e.response.data);
    }
  };
  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={submit}>
        <h2 className="Auth-form-title">Update Profile</h2>
        {Object.keys(errors).length > 0 && (
          <div className="alert alert-danger" role="alert">
            {Object.values(errors).map((value) => (
              <p key={value}>{value}</p>
            ))}
          </div>
        )}
        <div className="Auth-form-content">
          <div className="form-group mt-3">
            <label>First Name</label>
            <input
              className="form-control mt-1"
              placeholder="Enter First Name"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Last Name</label>
            <input
              name="lastName"
              type="text"
              className="form-control mt-1"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Date of Birth</label>
            <input
              name="dateOfBirth"
              type="text"
              className="form-control mt-1"
              placeholder="Enter Date of Birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>ID Number</label>
            <input
              name="idNumber"
              type="text"
              className="form-control mt-1"
              placeholder="Enter ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
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
