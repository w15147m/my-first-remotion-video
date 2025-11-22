import { z } from "zod";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import React, { useMemo } from "react";
import { CompositionProps } from "../schemata";
import App from "../../pages/test";

const weight = "700" as const;

loadFont("normal", {
  weights: ["400", weight],
});

const container: React.CSSProperties = {
  backgroundColor: "#1a1a2e",
};

export const Main = ({ title }: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Animation timings
  const titleStart = 20;
  const particlesStart = 0;
  
  // Title animation
  const titleProgress = spring({
    fps,
    frame: frame - titleStart,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const titleOpacity = interpolate(
    frame,
    [titleStart, titleStart + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleScale = interpolate(titleProgress, [0, 1], [0.5, 1]);

  const titleStyle: React.CSSProperties = useMemo(() => {
    return {
      fontFamily,
      fontSize: 80,
      fontWeight: weight,
      color: "#fff",
      textAlign: "center",
      transform: `scale(${titleScale})`,
      opacity: titleOpacity,
      textShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
    };
  }, [titleScale, titleOpacity]);

  // Floating particles animation
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 30,
    }));
  }, [width, height]);

  // Background gradient animation
  const gradientRotation = interpolate(
    frame,
    [0, 210],
    [0, 360],
    {
      extrapolateRight: "wrap",
    }
  );

  const backgroundStyle: React.CSSProperties = useMemo(() => {
    return {
      background: `linear-gradient(${gradientRotation}deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
    };
  }, [gradientRotation]);

  // Subtitle animation
  const subtitleOpacity = interpolate(
    frame,
    [titleStart + 40, titleStart + 60],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const subtitleY = interpolate(
    frame,
    [titleStart + 40, titleStart + 60],
    [20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  const subtitleStyle: React.CSSProperties = useMemo(() => {
    return {
      fontFamily,
      fontSize: 32,
      fontWeight: "400",
      color: "#a7c5eb",
      textAlign: "center",
      opacity: subtitleOpacity,
      transform: `translateY(${subtitleY}px)`,
    };
  }, [subtitleOpacity, subtitleY]);

  return (
    <AbsoluteFill style={container}>
     <App></App>
    </AbsoluteFill>
  );
};