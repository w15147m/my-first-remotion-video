import { ActionFunction } from "react-router";
import { errorAsJson } from "./lib/return-error-as-json";
import { ProgressRequest, ProgressResponse } from "./remotion/schemata";
import { stat } from "fs/promises";
import path from "path";

export const action: ActionFunction = errorAsJson(
  async ({ request }): Promise<ProgressResponse> => {
    const body = await request.json();
    const { id } = ProgressRequest.parse(body);

    // For local rendering, we check if the file exists
    const videoPath = path.join(
      process.cwd(),
      "public",
      "videos",
      `${id}-logo-animation.mp4`
    );

    try {
      const stats = await stat(videoPath);
      
      return {
        type: "done",
        url: `/videos/${id}-logo-animation.mp4`,
        size: stats.size,
      };
    } catch (error) {
      // File doesn't exist yet, still rendering
      return {
        type: "progress",
        progress: 0.5, // Mock progress
      };
    }
  }
);