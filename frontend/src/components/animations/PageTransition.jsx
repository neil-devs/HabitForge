import React from 'react';
import { motion } from 'framer-motion';

export const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
