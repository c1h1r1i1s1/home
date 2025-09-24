"use client";
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const layers = [
  { src: "/layers/mountain_back.png", depth: 0.1 },
  { src: "/layers/mountain_mid.png", depth: 0.2 },
  { src: "/layers/skyline.png", depth: 0.3 },
  { src: "/layers/bridge.png", depth: 0.4 },
  
  { src: "/layers/house.png", depth: 0.4 },
  { src: "/layers/tree.png", depth: 0.8 },
  { src: "/layers/fence.png", depth: 0.6 },
  
  { src: "/layers/roots.png", depth: 0.9 },
  { src: "/layers/witcher.png", depth: 1.0 },
  { src: "/layers/items.png", depth: 1.0 },
];

export default function Scene() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (e.clientX / innerWidth - 0.5) * 2;
      const offsetY = (e.clientY / innerHeight - 0.5) * 2;
      x.set(offsetX);
      y.set(offsetY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <div className="flex justify-center my-0 mx-auto">
      <div
        className="fixed h-[110vh] overflow-hidden -top-[10%]"
        style={{ aspectRatio: "1540/1080" }}
      >
        {layers.map((layer, i) => {
          const translateX = useTransform(x, (v) => v * 10 * layer.depth);
          const translateY = useTransform(y, (v) => v * 6 * layer.depth);

          // Glow scales with depth
          const glowBlur = 20 + layer.depth * 80; // 20px min, up to ~100px
          const glowOpacity = 0.1 + layer.depth * 0.5; // 0.1 front, 0.6 back
          const glowColor = "rgba(255,200,150," + glowOpacity + ")";

          return (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{ x: translateX, y: translateY }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={layer.src}
                  alt={`Layer ${i}`}
                  fill
                  style={{
                    objectFit: "cover",
                    filter: `drop-shadow(0 0 ${glowBlur}px ${glowColor})`,
                  }}
                  priority
                  sizes="100vw"
                />
              </div>
            </motion.div>
          );
        })
}
      </div>
      {/*<div
        className="absolute inset-0 pointer-events-none border-30 border-black h-[100vh] mx-auto"
        style={{ aspectRatio: "1540/1080" }}
      ></div>*/}
    </div>
  );
}
