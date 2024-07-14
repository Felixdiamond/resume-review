import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils/cn";

export const HoverEffect = ({
  items,
  className,
  onSelectionChange,
  isMobile,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { handleOptionSelect } = useContext(AppContext);

  const handleMouseEnter = (idx) => {
    setHoveredIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleClick = (idx) => {
    setSelectedIndex(idx);
    handleOptionSelect(idx);
    onSelectionChange(idx);
  };

  const containerClassName = cn(
    "grid gap-4 py-10",
    isMobile ? "grid-cols-1" : "grid-cols-2",
    className
  );

  return (
    <div className={containerClassName}>
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => handleMouseEnter(idx)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(idx)}
          tabIndex={0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence>
            {(hoveredIndex === idx || selectedIndex === idx) && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-white/[0.15] dark:bg-white/[0.25] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card isSelected={selectedIndex === idx}>
            <CardIcon>{item.icon}</CardIcon>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const Card = ({ className, children, isSelected }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-6 overflow-hidden backdrop-blur-md border shadow-lg relative z-20 transition-all duration-300",
        isSelected
          ? "bg-white/[0.25] border-white/[0.5]"
          : "bg-white/[0.15] border-white/[0.2]",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const CardIcon = ({ children }) => {
  return <div className="text-4xl mb-4">{children}</div>;
};

const CardTitle = ({ className, children }) => {
  return (
    <h4
      className={cn(
        "text-zinc-100 font-bold text-xl tracking-wide mt-2",
        className
      )}
    >
      {children}
    </h4>
  );
};

const CardDescription = ({ className, children }) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-300 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

export { Card, CardIcon, CardTitle, CardDescription };