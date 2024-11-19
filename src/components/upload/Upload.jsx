import React, { useState } from "react";
import Header from "../navbar/Header";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [state, setState] = useState({});
  const [photo, setPhoto] = useState("");
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const stateHandler = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const uploadHandler = async (e) => {
    e.preventDefault();

    try {
      let filename = null;
      let imageUrl = null;

      if (photo) {
        const formData = new FormData();
        formData.append("image", photo);

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
        if (uploadRes.ok) {
          imageUrl = uploadData.imageUrl;
        } else {
          console.error("image upload failed", uploadData.error);
          return;
        }

        // filename = crypto.randomUUID() + photo.name;
        // formData.append("filename", filename);
        // formData.append("image", photo);

        // await fetch(`https://backend-social3.vercel.app/upload/image`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        //   method: "POST",
        //   body: formData,
        // });
      }

      const res = await fetch(`https://backend-social3.vercel.app/post`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ ...state, photo: imageUrl }), //filename
      });

      const data = await res.json();
      console.log(data);
      navigate("/user");
    } catch (error) {
      console.log(error);
    }
  };

  //console.log(state);

  return (
    <>
      <Header />
      <div className="d-flex justify-content-center align-items-canter mt-5">
        <div
          className="d-flex flex-column "
          style={{
            border: "1px solid #333",
            borderRadius: "20px",
            width: "400px",
          }}
        >
          <h2
            className="text-primary"
            style={{
              textAlign: "center",
              margin: "2.5rem 0",
              fontSize: "30px",
            }}
          >
            Upload Post
          </h2>
          <form
            onSubmit={uploadHandler}
            className="container align-items-center d-flex flex-column"
          >
            <input
              className="form-control"
              type="text"
              name="title"
              placeholder="Title.."
              onChange={stateHandler}
            />
            <br />
            <input
              className="form-control"
              type="text"
              name="desc"
              placeholder="Content.."
              onChange={stateHandler}
            />{" "}
            <br />
            <label htmlFor="photo">
              Upload photo
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
            </label>{" "}
            <br />
            <input
              className="form-control"
              type="file"
              id="photo"
              style={{ display: "none" }}
              onChange={(e) => setPhoto(e.target.files[0])}
            />
            <input
              className="form-control"
              type="text"
              name="location"
              placeholder="Location.."
              onChange={stateHandler}
            />{" "}
            <br />
            <button className="mb-4 btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Upload;
