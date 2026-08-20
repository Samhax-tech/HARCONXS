import React, { useEffect, useRef } from 'react';

interface CoupleAmbientEffectsProps {
  effect: 'petals' | 'stars' | 'sparkles' | 'none';
}

export const CoupleAmbientEffects: React.FC<CoupleAmbientEffectsProps> = ({ effect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (effect === 'none' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle definitions based on effect
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
    }

    const particles: Particle[] = [];
    const count = effect === 'petals' ? 24 : effect === 'stars' ? 50 : 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: effect === 'petals' ? Math.random() * 8 + 6 : Math.random() * 2 + 1,
        speedX: effect === 'petals' ? (Math.random() - 0.5) * 1.2 : (Math.random() - 0.5) * 0.3,
        speedY: effect === 'petals' ? Math.random() * 0.8 + 0.4 : (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        color:
          effect === 'petals'
            ? 'rgba(224, 122, 95, '
            : effect === 'stars'
            ? 'rgba(243, 229, 171, '
            : 'rgba(244, 114, 182, '
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (effect === 'petals') {
          if (p.y > height + 20) p.y = -20;
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Stars / Sparkles
          if (p.y > height) p.y = 0;
          if (p.y < 0) p.y = height;
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;

          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effect]);

  if (effect === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};
