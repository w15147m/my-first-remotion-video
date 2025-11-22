import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { z } from "zod";
import { CompositionProps } from "~/remotion/schemata";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import os from "os";
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

  // Create output directory
  const outputDir = path.join(process.cwd(), "public", "videos");
  await mkdir(outputDir, { recursive: true });
  
  const renderId = randomUUID();
  const outputPath = path.join(outputDir, `${renderId}-${outName}`);

  // Render the video
  await renderMedia({
    composition: compositionData,
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