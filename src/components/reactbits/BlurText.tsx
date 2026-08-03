"use client";

import React from 'react';
import { motion } from 'framer-motion';

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3';
};

export default function BlurText({
  text = '',
  delay = 80,
  className = '',
  animateBy = 'words',
  direction = 'bottom',
  as: Component = 'span'
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const initialY = direction === 'top' ? -25 : 25;

  return (
    <Component className={`blur-text ${className} inline-flex flex-wrap justify-center`}>
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: 'blur(8px)', y: initialY }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.45,
            delay: (index * delay) / 1000,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          style={{ display: 'inline-block' }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </Component>
  );
}
