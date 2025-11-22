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
      {/* Animated Background */}
      <AbsoluteFill style={backgroundStyle} />

      {/* Floating Particles */}
      <Sequence from={particlesStart}>
        <AbsoluteFill>
          <svg width={width} height={height}>
            {particles.map((particle) => {
              const particleFrame = frame - particle.delay;
              const y = interpolate(
                particleFrame,
                [0, 210],
                [particle.y, particle.y - height * particle.speed],
                {
                  extrapolateRight: "wrap",
                  extrapolateLeft: "clamp",
                }
              );

              const opacity = interpolate(
                particleFrame,
                [0, 10, 200, 210],
                [0, 0.6, 0.6, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              return (
                <circle
                  key={particle.id}
                  cx={particle.x}
                  cy={y}
                  r={particle.size}
                  fill="#fff"
                  opacity={opacity}
                  filter="blur(1px)"
                />
              );
            })}
          </svg>
        </AbsoluteFill>
      </Sequence>

      {/* Glowing Circle */}
      <Sequence from={10}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {[0, 1, 2].map((i) => {
            const circleFrame = frame - 10 - i * 8;
            const scale = spring({
              fps,
              frame: circleFrame,
              config: {
                damping: 100,
              },
            });

            const opacity = interpolate(scale, [0, 1], [0.8, 0]);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  border: "3px solid #00d4ff",
                  transform: `scale(${scale})`,
                  opacity: opacity,
                }}
              />
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* Main Title */}
      <Sequence from={titleStart}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 30,
          }}
        >
          <h1 style={titleStyle}>{title}</h1>
          <div style={subtitleStyle}>Powered by Remotion</div>
        </AbsoluteFill>
      </Sequence>

      {/* Corner Decorations */}
      <Sequence from={30}>
        <AbsoluteFill>
          {[
            { top: 40, left: 40, rotation: 0 },
            { top: 40, right: 40, rotation: 90 },
            { bottom: 40, left: 40, rotation: 270 },
            { bottom: 40, right: 40, rotation: 180 },
          ].map((corner, i) => {
            const decorFrame = frame - 30 - i * 5;
            const scale = spring({
              fps,
              frame: decorFrame,
              config: {
                damping: 200,
              },
            });

            const rotate = interpolate(
              decorFrame,
              [0, 180],
              [corner.rotation, corner.rotation + 360],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "extend",
              }
            );

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  ...corner,
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                }}
              >
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <path
                    d="M 10 0 L 0 10 L 0 0 Z"
                    fill="#00d4ff"
                    opacity={0.6}
                  />
                  <path
                    d="M 30 0 L 20 10 L 20 0 Z"
                    fill="#00d4ff"
                    opacity={0.4}
                  />
                </svg>
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};