"use client";
import { AppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";

export const HoverEffect = ({ items, className, onSelectionChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const maxTitleLength = Math.max(...items.map((item) => item.title.length));
  const { handleOptionSelect } = useContext(AppContext);

  const handleMouseEnter = (idx) => {
    setSelectedIndex(idx);
    handleOptionSelect(idx);
    onSelectionChange(idx);
  };

  const handleMouseLeave = (idx) => {
    if (selectedIndex !== idx) {
      setSelectedIndex(null);
      onSelectionChange(null);
    }
  };

  // useEffect(() => {
  //   console.log("Current selevtion: ", selectedIndex);
  // }, [selectedIndex]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full"
          onMouseEnter={() => handleMouseEnter(idx)}
          onMouseLeave={() => handleMouseLeave(idx)}
        >
          <AnimatePresence>
            { selectedIndex !== null && (selectedIndex === idx || selectedIndex === null) && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-white/[0.1] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card maxWidth={maxTitleLength}>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({ className, children, maxWidth }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full p-4 overflow-hidden bg-white/[0.2] backdrop-blur-sm border border-white/[0.3] shadow-lg relative z-20",
        className
      )}
      style={{ width: `${maxWidth * 4}ch` }}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
