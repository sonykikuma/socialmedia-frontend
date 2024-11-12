import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import Header from "../navbar/Header";
const ProfileForm = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [state, setState] = useState({});
  const [photo, setPhoto] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleState = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    let imageUrl = null;
    let filename = null;

    if (photo) {
      const formData = new FormData();
      formData.append("image", photo);
      // filename = crypto.randomUUID() + photo.name;
      // formData.append("filename", filename);
      // formData.append("image", photo);

      const uploadRes = await fetch(
        `https://backend-social3.vercel.app/upload/image`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();
      imageUrl = uploadData.imageUrl;
    }

    try {
      const res = await fetch(
        `https://backend-social3.vercel.app/user/updateUser/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          method: "PUT",
          body: JSON.stringify({ ...state, profileImg: imageUrl }),
        }
      );

      const data = await res.json();
      dispatch(updateUser(data));
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Update Profile</h2>
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group mb-3">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      placeholder="Enter your username"
                      onChange={handleState}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={handleState}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      name="bio"
                      rows="3"
                      placeholder="Write a short bio"
                      onChange={handleState}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={handleState}
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="photo" className="form-label">
                      Profile Picture
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-file-image"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12z" />
                      </svg>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="photo"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                    {photo && <p className="mt-2">{photo.name}</p>}
                  </div>

                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileForm;
