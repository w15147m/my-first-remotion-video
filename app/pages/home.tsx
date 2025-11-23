import { Player } from "@remotion/player";
import { useMemo, useState } from "react";
import {
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
} from "~/remotion/constants.mjs";
import "../styles/app.css";
import { z } from "zod";
import { Main } from "~/remotion/components/Main"; 
import { RenderControls } from "~/components/video/RenderControls"; 
import { CompositionProps } from "~/remotion/schemata";

export default function Index() {
  const [text, setText] = useState("React Router + Remotion");
  const [duration, setDuration] = useState(7); // Added duration state

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
      durationInSeconds: duration, // Added duration to props
    };
  }, [text, duration]);

  // Calculate duration in frames dynamically
  const durationInFrames = useMemo(() => {
    return duration * COMPOSITION_FPS;
  }, [duration]);

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
          <Player
            component={Main}
            inputProps={inputProps}
            durationInFrames={durationInFrames} // Now dynamic!
            fps={COMPOSITION_FPS}
            compositionHeight={COMPOSITION_HEIGHT}
            compositionWidth={COMPOSITION_WIDTH}
            style={{
              width: "100%",
            }}
            controls
            autoPlay
            loop
          />
        </div>
        <RenderControls
          text={text}
          setText={setText}
          duration={duration}
          setDuration={setDuration}
          inputProps={inputProps}
        />
      
      </div>
    </div>
  );
}