import { ActionFunction } from "react-router";
import { renderVideoLocally } from "./lib/render-video-local.server";
import { COMPOSITION_ID } from "./remotion/constants.mjs";
import { errorAsJson } from "./lib/return-error-as-json";
import { RenderRequest } from "./remotion/schemata";

export const action: ActionFunction = errorAsJson(async ({ request }) => {
  const formData = await request.json();
  const { inputProps, filename } = RenderRequest.parse(formData);

  // Use the filename if provided, otherwise default
  const videoFilename = filename || "logo-animation";
  const outName = `${videoFilename}.mp4`;

  const { renderId, outputPath } = await renderVideoLocally({
    composition: COMPOSITION_ID,
    inputProps,
    outName,
  });

  // Return the path relative to public folder
  const publicPath = `/videos/${renderId}-${outName}`;

  return {
    renderId,
    bucketName: "local",
    functionName: "local",
    region: "local",
    outputPath: publicPath,
  };
});