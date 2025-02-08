import type { ReactNode } from 'react';

import { useState, useEffect } from 'react';

import { Box } from '@mui/material';


const carouselImages = [
  'https://images.rukita.co/promotions/promotion/d28e0cc3-929.jpg?tr=c-at_max%2Cw-1440',
  'https://images.rukita.co/buildings/building/e48a2a40-318.jpg?tr=c-at_max%2Cw-1040',
  'https://images.rukita.co/buildings/building/f297bfe6-649.jpg?tr=c-at_max%2Cw-1040',
  'https://images.rukita.co/buildings/building/ac52429c-2fe.jpg?tr=c-at_max%2Cw-1040'
];

interface HeroSectionProps {
  children: ReactNode;
}


export default function HeroSection({ children } :HeroSectionProps)  {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '500px',
        // overflow: 'hidden',
        borderBottomLeftRadius: '50px',
        borderBottomRightRadius: '50px',
      }}
    >
      {/* Carousel Images */}
      {carouselImages.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: currentImage === index ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderBottomLeftRadius: '50px',
            borderBottomRightRadius: '50px',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderBottomLeftRadius: '50px',
              borderBottomRightRadius: '50px',
            }
          }}
        />
      ))}

      {/* Carousel Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          // zIndex: 2,
          display: 'flex',
          gap: 1
        }}
      >
        {carouselImages.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentImage(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: currentImage === index ? '#FFD700' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          />
        ))}
      </Box>

      {children}
    </Box>
  );
}
