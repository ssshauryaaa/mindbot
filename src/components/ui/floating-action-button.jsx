import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Image, Code, FileText, Mic, Settings, Paperclip, Edit, Camera, File } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * FloatingActionButton (FAB) Component - Black & White Theme
 * 
 * Behavior:
 * - Pure black & white aesthetic with subtle borders and shadows.
 * - Expanded menu shows actions with permanent labels on the left (staggered in with spring physics).
 * - Main trigger spins 45deg on expand.
 * - Keyboard & mouse accessibility (Click outside & Escape key handler).
 */

const containerVariants = {
  open: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 24,
    },
  },
  closed: {
    opacity: 0,
    y: 18,
    scale: 0.8,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

export default function FloatingActionButton({
  actions,
  mainIcon,
  label = "Quick Actions",
  positionClassName = "relative",
  size = "default",
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const isSmall = size === "sm";
  const defaultMainIcon = mainIcon || (isSmall ? <Plus className="w-4 h-4 text-white" /> : <Plus className="w-6 h-6 text-white" />);

  // Default Monochrome Action items
  const defaultActions = [
    {
      id: "edit",
      label: "Edit",
      icon: <Edit className={isSmall ? "w-4 h-4 text-white" : "w-5 h-5 text-white"} />,
      onClick: () => console.log("Edit clicked"),
    },
    {
      id: "file",
      label: "File",
      icon: <File className={isSmall ? "w-4 h-4 text-white" : "w-5 h-5 text-white"} />,
      onClick: () => console.log("File clicked"),
    },
    {
      id: "image",
      label: "Image",
      icon: <Image className={isSmall ? "w-4 h-4 text-white" : "w-5 h-5 text-white"} />,
      onClick: () => console.log("Image clicked"),
    },
    {
      id: "camera",
      label: "Camera",
      icon: <Camera className={isSmall ? "w-4 h-4 text-white" : "w-5 h-5 text-white"} />,
      onClick: () => console.log("Camera clicked"),
    },
  ];

  const actionList = actions && actions.length > 0 ? actions : defaultActions;

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Escape key handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col items-center select-none", positionClassName, className)}
    >
      {/* Secondary Actions Stack */}
      <AnimatePresence mode="popLayout">
        {isOpen && (
          <motion.div
            key="fab-action-menu"
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="menu"
            aria-label="Secondary actions"
            className={cn(
              "absolute bottom-full flex flex-col items-end gap-3 mb-3.5 z-50",
              isSmall ? "mb-2.5 gap-2.5" : "mb-3.5 gap-3"
            )}
          >
            {actionList.map((action, index) => (
              <motion.div
                key={action.id || action.label || index}
                variants={itemVariants}
                className="flex items-center justify-end gap-3 whitespace-nowrap cursor-pointer"
                onClick={() => {
                  action.onClick?.();
                  setIsOpen(false);
                }}
              >
                {/* Permanent Label Badge on the left */}
                <div
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium text-white bg-black/90 dark:bg-black/90 border border-white/20 rounded-xl shadow-lg backdrop-blur-md transition-colors hover:bg-neutral-900"
                  )}
                >
                  {action.label}
                </div>

                {/* Secondary Action Circle Button */}
                <motion.button
                  role="menuitem"
                  aria-label={action.label}
                  whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.18)" }}
                  whileTap={{ scale: 0.92 }}
                  className={cn(
                    "rounded-full flex items-center justify-center bg-black/90 dark:bg-black/90 border border-white/20 text-white shadow-lg backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-colors cursor-pointer shrink-0",
                    isSmall ? "w-9 h-9" : "w-11 h-11"
                  )}
                >
                  {action.icon}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger FAB Button — Monochrome Black & White */}
      <motion.button
        aria-label={isOpen ? "Close actions menu" : label}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={toggleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "rounded-full flex items-center justify-center bg-black dark:bg-black text-white border border-white/25 shadow-xl shadow-black/80 hover:bg-neutral-900 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none cursor-pointer relative z-10 transition-colors",
          isSmall ? "w-8 h-8" : "w-14 h-14"
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {defaultMainIcon}
        </motion.div>
      </motion.button>
    </div>
  );
}
