import React, { useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signupHandler = async (e) => {
    e.preventDefault();
    if (username === "" || email === "" || password === "") return;
    console.log(username, email, password);
    try {
      const res = await fetch(
        `https://backend-social3.vercel.app/auth/register`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await res.json();
      console.log("Response Status:", res.status);

      if (res.ok) {
        console.log("Registration successful!");
        // dispatch(register(data));
        navigate("/login");
      } else {
        console.log("Registration failed!");

        throw new Error("Registration failed");
      }
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center min-vh-100 bg-info-subtle "
      style={{ width: "100%" }}
    >
      <div className="row  w-100">
        <div className="col-md-6 d-flex justify-content-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJrT7MI9fsrc6mWRBJBwhrf4vwTL7S5B8CzQ&s"
            className=""
            style={{ width: "400px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6 mt-3">
          <h2 className="text-danger text-center ">Sign Up</h2>
          <form onSubmit={signupHandler} className="d-flex flex-column ">
            <input
              className="form-control"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />{" "}
            <br />
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type="submit" className="btn btn-danger">
              Sign Up
            </button>
            <p className="mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary fw-bold">
                Login
              </Link>
            </p>
          </form>
          {error && (
            <div className="">Wrong credentials! try different ones</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
