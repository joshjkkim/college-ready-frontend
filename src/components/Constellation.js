import React, { useEffect, useRef, useState } from 'react';

const ConstellationBackground = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const starsRef = useRef([]);
  const animationFrameRef = useRef();

  class Star {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 0.5; // Slightly larger stars
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
    }

    update(width, height) {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
  }

  const initStars = (width, height) => {
    const stars = [];
    const numberOfStars = Math.floor((width * height) / 6000); // Increased density
    
    for (let i = 0; i < numberOfStars; i++) {
      stars.push(new Star(
        Math.random() * width,
        Math.random() * height
      ));
    }
    
    starsRef.current = stars;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      
      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        initStars(width, height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Update and draw stars
      starsRef.current.forEach(star => {
        star.update(dimensions.width, dimensions.height);
        
        ctx.fillStyle = 'rgba(0, 0, 128, 0.4)'; // Increased opacity
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      starsRef.current.forEach((star, i) => {
        // Connect to mouse if nearby
        const mouseDistance = Math.hypot(mousePosition.x - star.x, mousePosition.y - star.y);
        if (mouseDistance < 150) { // Increased connection range
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(mousePosition.x, mousePosition.y);
          ctx.strokeStyle = `rgba(0, 0, 128, ${1 - mouseDistance / 150})`;
          ctx.stroke();
        }

        // Connect nearby stars
        for (let j = i + 1; j < starsRef.current.length; j++) {
          const star2 = starsRef.current[j];
          const distance = Math.hypot(star.x - star2.x, star.y - star2.y);
          
          if (distance < 100) { // Increased connection range
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.strokeStyle = `rgba(0, 0, 128, ${1 - distance / 100})`;
            ctx.stroke();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
};

export default ConstellationBackground;