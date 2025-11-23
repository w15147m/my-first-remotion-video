import { z } from "zod";
import { AlignEnd } from "../layout/AlignEnd";
import { Button } from "../ui/Button";
import { InputContainer } from "../layout/InputContainer";
import { DownloadButton } from "../ui/DownloadButton";
import { ErrorComp } from "../ui/Error";
import { Input } from "../ui/Input";
import { ProgressBar } from "../ui/ProgressBar";
import { Spacing } from "../layout/Spacing";
import { useRendering } from "../../lib/use-rendering";
import { COMPOSITION_ID } from "~/remotion/constants.mjs";
import { CompositionProps } from "~/remotion/schemata";

export const RenderControls: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  inputProps: z.infer<typeof CompositionProps>;
}> = ({ text, setText, duration, setDuration, inputProps }) => {
  // Create a safe filename from the text
  const filename =
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, "") + // Remove leading/trailing hyphens
    ".mp4"; // Add .mp4 extension

  const { renderMedia, state, undo } = useRendering(
    COMPOSITION_ID,
    inputProps,
    filename,
  );

  return (
    <InputContainer>
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
        <>
         <div className="flex justify-between gap-4 mb-4">
               {/* Title Input */}
          <div className="w-100">
            <label className="block text-sm font-medium text-foreground mb-1">
              Video Title
            </label>
            <Input
              disabled={state.status === "invoking"}
              setText={setText}
              text={text}
              placeholder="Enter video title"
              name="title"
            />
          </div>


          {/* Duration Input */}
          <div className="w-100">

            <label className="block text-sm font-medium text-foreground mb-1">
              Duration (seconds)
            </label>
            <Input
              type="number"
              disabled={state.status === "invoking"}
              value={duration}
              onChange={(e) => {
                const value = Number(e.target.value);
                // Prevent empty or invalid values
                if (e.target.value === "" || value < 1) {
                  setDuration(10); // Set minimum to 1
                }  else {
                  setDuration(value);
                }
              }}
              min={1}
              max={60}
              placeholder="Enter duration in seconds"
              name="duration"
            />
          
          </div>
         </div>


          <AlignEnd>
            <Button
              disabled={
                state.status === "invoking" || duration < 1 || duration > 60
              }
              loading={state.status === "invoking"}
              onClick={renderMedia}
            >
              Render video
            </Button>
          </AlignEnd>

          {state.status === "error" ? (
            <ErrorComp message={state.error.message}></ErrorComp>
          ) : null}
        </>
      ) : null}
      {state.status === "rendering" || state.status === "done" ? (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <Spacing></Spacing>
          <AlignEnd>
            <DownloadButton undo={undo} state={state}></DownloadButton>
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
