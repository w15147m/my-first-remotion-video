import { z } from "zod";

export const CompositionProps = z.object({
  title: z.string(),
  durationInSeconds: z.number().min(1).max(60), // Added duration field
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "React Router and Remotion",
  durationInSeconds: 7, // Added default duration
};

export const RenderRequest = z.object({
  inputProps: CompositionProps,
  filename: z.string().optional(),
});

export const ProgressRequest = z.object({
  bucketName: z.string(),
  id: z.string(),
});

export type ProgressResponse =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "progress";
      progress: number;
    }
  | {
      type: "done";
      url: string;
      size: number;
    };