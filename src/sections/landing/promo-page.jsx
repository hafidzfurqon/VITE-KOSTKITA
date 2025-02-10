import { useState } from 'react';
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const promoData = [
  {
    id: 1,
    title: "Pindah ke Rukita Dimodalin Lalamove",
    partner: "RUKITA x LALAMOVE",
    description: "Dapatkan modal pindahan hingga",
    price: "935 ribu",
    image: "/api/placeholder/400/320",
    bgColor: "#FFF3E0"
  },
  {
    id: 2,
    title: "Feel The Groove Under Your Roof",
    partner: "RUKITA x JBL",
    description: "Nikmati diskon",
    discount: "15%",
    subtext: "untuk produk JBL tertentu",
    image: "/api/placeholder/400/320",
    bgColor: "#E3F2FD"
  },
  {
    id: 3,
    title: "Perfect Home, Perfect Smile",
    partner: "RUKITA x SATU DENTAL",
    description: "Special untuk Rukizen",
    discount: "20%",
    subtext: "Diskon perawatan gigi hingga Satu Dental",
    image: "/api/placeholder/400/320",
    bgColor: "#E8F5E9"
  }
];

const Arrow = ({ left = false, onClick, disabled }) => (
  <Box
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      left: left ? '10px' : 'auto',
      right: !left ? '10px' : 'auto',
      width: '30px',
      height: '30px',
      backgroundColor: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 2,
      '&:hover': {
        backgroundColor: '#F3F4F6'
      }
    }}
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#1F2937"
    >
      {left ? (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      ) : (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  </Box>
);

export default function PromoPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 1.7, // Ubah menjadi 2 untuk 2 grid tiap slide
      spacing: 10,
    },
    breakpoints: {
      "(min-width: 640px)": { perView: 2, spacing: 15 }, // Tetap 2 untuk layar lebih besar
      "(min-width: 1024px)": { perView: 3, spacing: 20 }, // Bisa ditingkatkan jika ingin 3 untuk layar besar
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  

  return (
    <Box sx={{ p: { xs: 4, md: 4 }, minHeight: '100vh' }}>
      <Box sx={{ maxWidth: '1120px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1F2937' }}>
            Promo berlangsung
          </Typography>
          <Button 
            sx={{ color: '#2563EB', '&:hover': { color: '#1D4ED8' }, display: 'flex', alignItems: 'center', gap: 1, fontWeight: '500' }}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 20 }} />}
          >
            Lihat Semua
          </Button>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Box ref={sliderRef} className="keen-slider">
            {promoData.map((promo) => (
              <Box
                key={promo.id}
                className="keen-slider__slide"
                sx={{
                  backgroundColor: promo.bgColor,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 5 }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={promo.image}
                    alt={promo.title}
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                  <Box sx={{ position: 'absolute', top: 16, left: 16, backgroundColor: '#FFFFFF', px: 3, py: 1, borderRadius: '9999px' }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: '500', color: '#4B5563' }}>
                      {promo.partner}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', mb: 2, lineHeight: '1.3' }}>
                    {promo.title}
                  </Typography>
                  <Typography sx={{ color: '#4B5563', fontSize: '1.125rem' }}>
                    {promo.description}
                    {promo.price && (
                      <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        {` Rp ${promo.price}`}
                      </span>
                    )}
                    {promo.discount && (
                      <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        {` ${promo.discount}`}
                      </span>
                    )}
                  </Typography>
                  {promo.subtext && (
                    <Typography sx={{ color: '#6B7280', mt: 1 }}>
                      {promo.subtext}
                    </Typography>
                  )}
                  <Button 
                    sx={{ mt: 2, backgroundColor: '#FFFFFF', '&:hover': { backgroundColor: '#F3F4F6' }, color: '#1F2937', px: 3, py: 1, borderRadius: '9999px', boxShadow: 1, fontWeight: '500' }}
                  >
                    Lihat Detail
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          {loaded && instanceRef.current && (
            <>
              <Arrow
                left
                onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
                disabled={currentSlide === 0}
              />
              <Arrow
                onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
                disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
              />
            </>
          )}
        </Box>

        {loaded && instanceRef.current && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
            {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => (
              <Box
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                sx={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: currentSlide === idx ? '#2563EB' : '#E5E7EB',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: currentSlide === idx ? '#2563EB' : '#D1D5DB'
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}