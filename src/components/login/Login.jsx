import React, { useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") return;

    try {
      const res = await fetch(`https://backend-social3.vercel.app/auth/login`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);
      dispatch(login(data));
      navigate("/user");
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <main className="container" style={{ height: "100vh" }}>
      <div className="row mt-4">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <p className="display-5 text-primary ">
            Be Social...
            <br />
            socializing...
            <br />
            grow your network
          </p>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div>
            <img
              className=" img-fluid"
              src="https://images.unsplash.com/photo-1577546568088-eb32790be7ec?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxvZ2lufGVufDB8fDB8fHww"
              alt=""
            />
            <form
              onSubmit={loginHandler}
              className="form-group d-flex flex-column rounded border shadow px-3 py-3"
            >
              <input
                className="form-control"
                type="email"
                placeholder="Email.."
                onChange={(e) => setEmail(e.target.value)}
              />{" "}
              <br />
              <input
                className="form-control"
                type="password"
                placeholder="Password..."
                onChange={(e) => setPassword(e.target.value)}
              />{" "}
              <br />
              <button className="btn btn-primary btn-md">Login</button> <br />
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
