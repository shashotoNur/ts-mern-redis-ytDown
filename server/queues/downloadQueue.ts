import Bull from "bull";
import ytdl from "ytdl-core";
import fs from "fs";
const path = require('path');

import { Video } from "../models/Video";
import { Events } from "../utils";
import { SocketInit } from "../socket.io";

const downloadQueue = new Bull("download queue",
  {
    redis: 
      {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!),
        password: process.env.REDIS_PASSWORD
      }
  });

downloadQueue.process((job: any, done: any) =>
{
  return new Promise(async (resolve, reject) =>
  {
    try
      {
        //Get singleton instance
        const socket = SocketInit.getInstance();

        const { youtubeUrl } = job.data;
        const info = await ytdl.getBasicInfo(youtubeUrl);
        const thumbnail = info.videoDetails.thumbnails[0].url;
        const title = `${info.videoDetails.title} by ${info.videoDetails.author.name}`;
        const file = path.join(__dirname, `../../downloads/`, `${title}.mp4`);

        try
        {
          ytdl(youtubeUrl).pipe(fs.createWriteStream(file))
          .on("finish",
            async () =>
              {
                socket.publishEvent(Events.VIDEO_DOWNLOADED, title);

                const video = new Video({ title, file, thumbnail });
                await video.save();

                done();
                resolve({ title });
              }
          )
          .on("ready", () => { socket.publishEvent(Events.VIDEO_STARTED, title); } )
          .on("error",
            (error) =>
              {
                socket.publishEvent(Events.VIDEO_ERROR, error);
                done(error);
                reject(error);
              }
          )
        }
        catch (error) { console.log(error.message); };
      }
      catch (error) { console.log(error.message); };
  });
});

export { downloadQueue };