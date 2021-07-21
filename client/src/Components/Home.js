import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import Videos from "./Videos";

const notify = (msg, { success }) =>
  {
    if (success) return toast.success(msg);
    return toast.error(msg);
  };

const socket = io("http://localhost:5000/");

const Home = () =>
  {
    const [videos, setVideos] = useState([]);

    try
    {
      useEffect(
        () =>
          {
            socket.on("VIDEO_DOWNLOADED", (data) =>
              {
                notify(`${data} Downloaded`, { success: true });
                window.location.reload();
              }
            );

            socket.on("VIDEO_STARTED", (data) => { notify(`Download Started ${data}`, { success: true }); });

            axios.get("http://localhost:5000/api/videos")
              .then((res) => { setVideos(res.data); })
              .catch((error) => { console.log(error); });
          }, []);
    }
    catch(err) { console.log(err); };

    const downloadVideo = (event) =>
      {
        try
        {
          event.preventDefault();

          const youtubeUrl = event.target.elements.youtubeUrl.value;
  
          axios.post("http://localhost:5000/api/download", { youtubeUrl })
            .then((_res) => { notify("Fetching video details...", { success: true }); })
            .catch((error) => { notify("Something went wrong", { success: false }, error); });
        }
        catch(err) { console.log(err); };
      };

    return (
      <>
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold"> Download Youtube videos </h1>
          </div>

          <form onSubmit={downloadVideo}>

            <div>
              <label htmlFor="youtubeUrl" className="form-label"> Enter link </label>
              <input type="url" id="youtubeUrl" className="form-control" required />
              <button type="submit" className="btn btn-primary btn-lg"> Download </button>

              <Toaster />
            </div>

          </form>
        </div>

        <div style={{ margin: 10 }} className="row">
          {videos.map((video) => { return <Videos video={video} />; })}
        </div>
      </>
    );
  }

export default Home;