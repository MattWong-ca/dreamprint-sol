"use client";

import { useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  className?: string;
}

export default function FadeIn({ children, direction = "left", className = "" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const translate = direction === "left" ? "-translate-x-12" : "translate-x-12";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-x-0" : `opacity-0 ${translate}`} ${className}`}
    >
      {children}
    </div>
  );
}
