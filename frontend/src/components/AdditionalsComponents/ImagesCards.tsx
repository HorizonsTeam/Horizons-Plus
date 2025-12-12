import { useState, useEffect } from "react";

type CardFanProps = {
  images: string[];
  maxSpreadDeg?: number;
  cardWidth?: number;
  cardHeight?: number;
};

export default function CardFan({
  images,
  maxSpreadDeg = 40,
  cardWidth = 140,
  cardHeight = 200,
}: CardFanProps) {
  if (!images || images.length === 0) return null;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [canAnimate, setCanAnimate] = useState(false);

  const handleLoaded = (index: number) => {
    setLoaded((prev) => ({ ...prev, [index]: true }));
  };

  const allLoaded =
    images.length > 0 &&
    images.every((_, index) => loaded[index]);
  const INTRO_DELAY = 2000;

  useEffect(() => {
    if (allLoaded) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, INTRO_DELAY);

      return () => clearTimeout(timer);
    }
  }, [allLoaded]);

  const count = images.length;
  const step = count > 1 ? maxSpreadDeg / (count - 1) : 0;
  const startAngle = -maxSpreadDeg / 2;

  return (
    <div className="w-full flex justify-center">
      <div
        className="relative"
        style={{
          width: cardWidth * 2,
          height: cardHeight + 60,
        }}
      >
        {images.map((src, index) => {
          const baseAngle = startAngle + step * index;
          const centerOffset = index - (count - 1) / 2;
          const translateX = centerOffset * (cardWidth * 0.35);

          const isHovered = hoveredIndex === index;

          const angle = isHovered ? baseAngle * 0.35 : baseAngle;
          const baseTransform = `translateX(${translateX}px) rotate(${angle}deg)`;
          const hoverLift = isHovered ? " translateY(-14px) scale(1.04)" : "";

          const dimOthers = hoveredIndex !== null && !isHovered;

          const targetOpacity = dimOthers ? 0.6 : 1;
          const introTransform = canAnimate ? "" : " translateY(20px) scale(0.96)";

          const baseOpacityBefore = 0.01; 
          const opacity = canAnimate ? targetOpacity : baseOpacityBefore;


          return (
            <div
              key={`${src}-${index}`}
              className="absolute left-1/2 bottom-0 -translate-x-1/2"
              style={{
                width: cardWidth,
                height: cardHeight,
                transform: baseTransform + hoverLift + introTransform,
                transformOrigin: "50% 90%",
                zIndex: isHovered ? count + 10 : index + 1,
                transition: canAnimate
                  ? "transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1), filter 220ms ease-out, opacity 420ms ease-out"
                  : "none", 
                opacity,
                filter: dimOthers ? "brightness(0.8)" : "brightness(1)",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-full h-full rounded-2xl overflow-hidden border border-white/8 shadow-[0_18px_40px_rgba(0,0,0,0.45)]
                           transition-shadow duration-400 ease-out"
              >
                <img
                  src={src}
                  alt={`Carte ${index + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => handleLoaded(index)}
                  loading="lazy"
                  decoding="async"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
