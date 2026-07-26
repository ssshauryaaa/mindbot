"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  orientation = "vertical",
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} orientation={orientation} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}) => {
  let mouseVal = useMotionValue(Infinity);

  return (
    <motion.div
      onTouchStart={(e) => {
        if (e.touches[0]) mouseVal.set(e.touches[0].clientX);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) mouseVal.set(e.touches[0].clientX);
      }}
      onTouchEnd={() => mouseVal.set(Infinity)}
      className={cn(
        "flex md:hidden items-center gap-2.5 rounded-full bg-neutral-950/80 border border-white/15 px-3 py-2 backdrop-blur-xl shadow-2xl pointer-events-auto",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer
          mouseVal={mouseVal}
          key={item.title}
          orientation="horizontal"
          {...item}
        />
      ))}
    </motion.div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  orientation = "vertical",
}) => {
  let mouseVal = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => {
        if (orientation === "vertical") {
          mouseVal.set(e.pageY);
        } else {
          mouseVal.set(e.pageX);
        }
      }}
      onMouseLeave={() => mouseVal.set(Infinity)}
      className={cn(
        "mx-auto hidden gap-3 rounded-2xl bg-neutral-950/60 border border-white/10 px-2.5 py-3.5 backdrop-blur-md md:flex items-center w-fit shadow-2xl",
        orientation === "vertical" ? "flex-col" : "h-16 items-end pb-3 px-4",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer
          mouseVal={mouseVal}
          key={item.title}
          orientation={orientation}
          {...item}
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseVal,
  title,
  icon,
  href,
  onClick,
  orientation = "vertical",
}) {
  let ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);

  let distance = useTransform(mouseVal, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
    if (orientation === "vertical") {
      let absoluteY = bounds.y + window.scrollY;
      return val - absoluteY - bounds.height / 2;
    } else {
      let absoluteX = bounds.x + window.scrollX;
      return val - absoluteX - bounds.width / 2;
    }
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [38, 46, 38]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [38, 46, 38]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [18, 22, 18]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [18, 22, 18],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  const handleTouchStart = () => {
    setHovered(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setHovered(false), 1400);
  };

  return (
    <a href={href || "#"} onClick={handleClick}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        whileTap={{ scale: 0.88 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={handleTouchStart}
        className="relative flex aspect-square items-center justify-center rounded-full bg-neutral-900/80 border border-white/10 hover:border-white/20 active:border-white/40 transition-colors group cursor-pointer"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={orientation === "vertical"
                ? { opacity: 0, x: 10, y: "-50%" }
                : { opacity: 0, y: 8, x: "-50%" }
              }
              animate={orientation === "vertical"
                ? { opacity: 1, x: 0, y: "-50%" }
                : { opacity: 1, y: 0, x: "-50%" }
              }
              exit={orientation === "vertical"
                ? { opacity: 0, x: 2, y: "-50%" }
                : { opacity: 0, y: 4, x: "-50%" }
              }
              style={orientation === "vertical"
                ? { left: "100%", top: "50%", transform: "translateY(-50%)" }
                : { left: "50%", top: "-2.3rem", transform: "translateX(-50%)" }
              }
              className={cn(
                "absolute w-fit rounded-xl border border-white/15 bg-neutral-950/95 px-3 py-1 text-[11px] font-medium whitespace-pre text-white shadow-2xl z-50 pointer-events-none backdrop-blur-md",
                orientation === "vertical" ? "ml-3" : ""
              )}
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
