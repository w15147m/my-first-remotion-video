import type { EnhancedErrorInfo } from "@remotion/lambda";

export type StatusResponse = {
  renderId: string;
  done: boolean;
  overallProgress: number;
  outputFile: string | null;
  errors: EnhancedErrorInfo[];
};

// Updated to support both Lambda and Local rendering
export type RenderResponse = {
  renderId: string;
  bucketName: string; // For local: this is the filename
  functionName?: string; // Optional for local rendering
  region?: string; // Optional for local rendering
};