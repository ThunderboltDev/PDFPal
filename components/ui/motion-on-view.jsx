"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

export default function MotionOnView({
  children,
  direction = '+y',
  distance = 25,
  blur = 4,
  duration = 0.8,
  threshold = 0.3,
  once = true,
  staggerChildren = 0.1,
  delayChildren = 0.0,
  ...props
}) {
  const ref = useRef(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once, amount: threshold });

  const sign = direction[0] === '+' ? 1 : -1;
  const directionAxis = direction[1] || 'y';
  const calculatedDistance = sign * distance;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren }
    }
  };

  const childVariants = {
    hidden: {
      x: directionAxis === 'x' ? calculatedDistance : 0,
      y: directionAxis === 'y' ? calculatedDistance : 0,
      filter: `blur(${blur}px)`,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      opacity: 1,
      transition: { duration },
    }
  };

  useEffect(() => {
    controls.start(inView ? 'visible' : 'hidden');
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      {...props}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
