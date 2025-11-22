import { z } from "zod";
import { useCallback, useMemo, useState } from "react";
import { getProgress, renderVideo } from "./api";
import { CompositionProps } from "~/remotion/schemata";

export type State =
  | {
      status: "init";
    }
  | {
      status: "invoking";
    }
  | {
      renderId: string;
      bucketName: string;
      progress: number;
      status: "rendering";
    }
  | {
      renderId: string | null;
      status: "error";
      error: Error;
    }
  | {
      url: string;
      size: number;
      status: "done";
    };

const wait = async (milliSeconds: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliSeconds);
  });
};

export const useRendering = (
  id: string,
  inputProps: z.infer<typeof CompositionProps>,
  filename?: string,
) => {
  const [state, setState] = useState<State>({
    status: "init",
  });

  const renderMedia = useCallback(async () => {
    setState({
      status: "invoking",
    });
    try {
      const { renderId, bucketName } = await renderVideo({ 
        inputProps,
        filename,
      });
      
      setState({
        status: "rendering",
        progress: 0,
        renderId: renderId,
        bucketName: bucketName || filename || "video.mp4",
      });

      let pending = true;
      let attempts = 0;
      const maxAttempts = 120; // Wait up to 2 minutes (120 * 1000ms)

      while (pending && attempts < maxAttempts) {
        try {
          const result = await getProgress({
            id: renderId,
            bucketName: bucketName || filename || "video.mp4",
          });
          
          switch (result.type) {
            case "error": {
              setState({
                status: "error",
                renderId: renderId,
                error: new Error(result.message),
              });
              pending = false;
              break;
            }
            case "done": {
              setState({
                size: result.size,
                url: result.url,
                status: "done",
              });
              pending = false;
              break;
            }
            case "progress": {
              setState({
                status: "rendering",
                bucketName: bucketName || filename || "video.mp4",
                progress: result.progress,
                renderId: renderId,
              });
              await wait(1000);
              attempts++;
              break;
            }
          }
        } catch (err) {
          // If progress check fails, keep trying
          await wait(1000);
          attempts++;
        }
      }

      if (attempts >= maxAttempts) {
        setState({
          status: "error",
          error: new Error("Rendering timeout - video may still be processing"),
          renderId: renderId,
        });
      }
    } catch (err) {
      setState({
        status: "error",
        error: err as Error,
        renderId: null,
      });
    }
  }, [inputProps, filename]);

  const undo = useCallback(() => {
    setState({ status: "init" });
  }, []);

  return useMemo(() => {
    return {
      renderMedia,
      state,
      undo,
    };
  }, [renderMedia, state, undo]);
};