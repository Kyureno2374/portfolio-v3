"use client";

import { techColors } from "@/shared/config/tech-colors";

interface ColoredTextProps {
  text: string;
  className?: string;
}

export function ColoredText({ text, className = "" }: ColoredTextProps) {
  const words = text.split(/(\s+)/);
  
  const coloredWords = words.map((word, index) => {
    const cleanWord = word.replace(/[.,!?;:()]/g, "");
    const color = techColors[cleanWord];
    
    if (color) {
      const punctuation = word.replace(cleanWord, "");
      return (
        <span key={index}>
          <span 
            style={{ color }} 
            className="font-semibold transition-colors duration-300"
          >
            {cleanWord}
          </span>
          {punctuation}
        </span>
      );
    }
    
    return <span key={index}>{word}</span>;
  });

  return <span className={className}>{coloredWords}</span>;
}
