import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { z } from "zod";
import { CompositionProps } from "~/remotion/schemata";
import { COMPOSITION_FPS } from "~/remotion/constants.mjs";
import path from "path";
import { mkdir } from "fs/promises";
import { randomUUID } from "crypto";

export const renderVideoLocally = async ({
  composition,
  inputProps,
  outName,
}: {
  composition: string;
  inputProps: z.infer<typeof CompositionProps>;
  outName: string;
}): Promise<{ renderId: string; outputPath: string }> => {
  console.log("Starting local video render...");
  console.log("Duration in seconds:", inputProps.durationInSeconds);

  // Calculate duration in frames
  const durationInFrames = inputProps.durationInSeconds * COMPOSITION_FPS;
  console.log("Duration in frames:", durationInFrames);

  // Bundle the Remotion project
  const bundleLocation = await bundle({
    entryPoint: path.resolve("./app/remotion/index.ts"),
    webpackOverride: (config) => config,
  });

  // Select the composition
  const compositionData = await selectComposition({
    serveUrl: bundleLocation,
    id: composition,
    inputProps,
  });

  // Override the composition duration
  const updatedComposition = {
    ...compositionData,
    durationInFrames, // Use the dynamic duration
  };

  // Create output directory
  const outputDir = path.join(process.cwd(), "public", "videos");
  await mkdir(outputDir, { recursive: true });
  
  const renderId = randomUUID();
  const outputPath = path.join(outputDir, `${renderId}-${outName}`);

  console.log("Rendering video to:", outputPath);

  // Render the video with dynamic duration
  await renderMedia({
    composition: updatedComposition, // Use updated composition with new duration
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
  });

  console.log("Video rendered successfully:", outputPath);

  return {
    renderId,
    outputPath,
  };
};