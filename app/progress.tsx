import { ActionFunction } from "react-router";
import { errorAsJson } from "./lib/return-error-as-json";
import { ProgressRequest, ProgressResponse } from "./remotion/schemata";
import { readdir, stat } from "fs/promises";
import path from "path";

export const action: ActionFunction = errorAsJson(
  async ({ request }): Promise<ProgressResponse> => {
    const body = await request.json();
    const { id } = ProgressRequest.parse(body);

    const videosDir = path.join(process.cwd(), "public", "videos");

    try {
      // Find any file that starts with the renderId
      const files = await readdir(videosDir);
      const videoFile = files.find(file => file.startsWith(id));

      if (!videoFile) {
        return {
          type: "progress",
          progress: 0.5,
        };
      }

      const videoPath = path.join(videosDir, videoFile);
      const stats = await stat(videoPath);
      
      return {
        type: "done",
        url: `/videos/${videoFile}`,
        size: stats.size,
      };
    } catch (error) {
      return {
        type: "progress",
        progress: 0.5,
      };
    }
  }
);