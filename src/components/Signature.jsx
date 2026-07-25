"use client";

import React, { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import opentype from "opentype.js";

// Simple utility for concatenating classes since we might not have `cn`
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Signature({
  text = "Signature",
  color = "currentColor",
  fontSize = 32,
  duration = 1.5,
  delay = 0,
  className,
  inView = false,
  once = true,
  fontUrl,
}) {
  const [paths, setPaths] = useState([]);
  const [width, setWidth] = useState(300);
  const height = fontSize * 3; // Give plenty of vertical space
  const horizontalPadding = fontSize * 0.1;
  const topMargin = fontSize * 1.5; // Shift down
  const baseline = topMargin;
  const maskId = `signature-reveal-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    async function load() {
      try {
        let font;
        const fontPaths = fontUrl
          ? [fontUrl]
          : [
            "/LastoriaBoldRegular.otf",
            "./LastoriaBoldRegular.otf",
            "https://www.componentry.fun/LastoriaBoldRegular.otf",
          ];

        for (const path of fontPaths) {
          try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const buffer = await res.arrayBuffer();
            font = opentype.parse(buffer);
            break;
          } catch (e) {
            console.warn(`Failed to load font from ${path}:`, e);
          }
        }

        if (!font) {
          throw new Error("Font could not be loaded from any path");
        }

        let x = horizontalPadding;
        const newPaths = [];

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(x, baseline, fontSize);
          newPaths.push(path.toPathData(3));

          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          x += advanceWidth * (fontSize / font.unitsPerEm);
        }

        setPaths(newPaths);
        setWidth(x + horizontalPadding);
      } catch (error) {
        console.error("Signature component font load error:", error);
        setPaths([]);
        setWidth(text.length * fontSize * 0.6);
      }
    }

    load();
  }, [text, fontSize, baseline, horizontalPadding, fontUrl]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  const shimmerId = `shimmer-${maskId}`;

  return (
    <motion.svg
      key={paths.length}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={cn("text-white overflow-visible", className)}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="white"
              strokeWidth={fontSize * 0.22}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: delay + i * 0.2,
                  duration,
                  ease: "easeInOut",
                },
                opacity: {
                  delay: delay + i * 0.2 + 0.01,
                  duration: 0.01,
                },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>

        {/* Shimmer gradient — plays once on page load, sweeps left→right */}
        <linearGradient id={shimmerId} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="white" stopOpacity="0" />
          <stop offset="40%"  stopColor="white" stopOpacity="0" />
          <stop offset="50%"  stopColor="white" stopOpacity="0.9" />
          <stop offset="60%"  stopColor="#c8b4ff" stopOpacity="0.6" />
          <stop offset="75%"  stopColor="#64dcff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="-1.5 0"
            to="2.5 0"
            dur="1.6s"
            begin="0.6s"
            fill="freeze"
            repeatCount="1"
          />
        </linearGradient>
      </defs>

      {paths.map((d, i) => (
        <motion.path
          key={`stroke-${i}`}
          d={d}
          stroke={color}
          strokeWidth={2}
          fill="none"
          variants={variants}
          transition={{
            pathLength: {
              delay: delay + i * 0.2,
              duration,
              ease: "easeInOut",
            },
            opacity: {
              delay: delay + i * 0.2 + 0.01,
              duration: 0.01,
            },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => <path key={`fill-${i}`} d={d} fill={color} />)}
        {/* One-shot shimmer wipe over the filled letters */}
        <rect
          x={0} y={0}
          width={width} height={height}
          fill={`url(#${shimmerId})`}
          style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
        />
      </g>
    </motion.svg>
  );
}
