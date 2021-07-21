
import express from "express";
import { body } from "express-validator";

import { getAllVideos, downloadVideo,
        saveNewVideoToDB, deleteVideoFromDB } from '../controllers/downloadsControllers'

const downloadsRouter = express.Router();

downloadsRouter.get("/api/videos", getAllVideos);
downloadsRouter.get("/api/download/:id/", downloadVideo);
downloadsRouter.post("/api/download", body("youtubeUrl").isURL(), saveNewVideoToDB);
downloadsRouter.delete("/api/delete/:id", deleteVideoFromDB);

export { downloadsRouter };