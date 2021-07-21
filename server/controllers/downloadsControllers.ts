import { Request, Response } from "express";
import fs from "fs/promises";
import { validationResult } from "express-validator";

import { downloadQueue } from "../queues/downloadQueue";
import { Video } from "../models/Video";

const getAllVideos = async (_req: Request, res: Response) =>
    {
        try
        {
            const videos = await Video.find().sort({ createdAt: -1 });
            res.status(200).send(videos);
        }
        catch(err) { console.log(err.message) };
    }

const downloadVideo = async (req: Request, res: Response) =>
    {
        try
        {
            const { id } = req.params;
            const video: any = await Video.findByIdAndDelete(id);
    
            if (!video) res.status(404).send("Video not found");
    
            const { file } = video;
            res.status(200).download(file);
        }
        catch(err) { console.log(err.message) };
    }

const saveNewVideoToDB = async (req: Request, res: Response) =>
    {
        try
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
            
            const { youtubeUrl } = req.body;
            await downloadQueue.add({ youtubeUrl })

            res.status(200).send("Downloading");
        }
        catch (error) { console.log(error.message); }
    }

const deleteVideoFromDB = async (req: Request, res: Response) =>
    {
        try
        {
            const { id } = req.params;

            const video = await Video.findByIdAndDelete(id);
            if (video) await fs.unlink(video.file!);
    
            res.status(200).send(video);
        }
        catch(err) { console.log(err.message) };
    }

export { getAllVideos, downloadVideo, saveNewVideoToDB, deleteVideoFromDB };