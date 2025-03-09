import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { Link } from 'react-router-dom';
import { useFetchPromo } from 'src/hooks/promo';
import Loading from 'src/components/loading/loading';
import { Container } from '@mui/material';

const Arrow = ({ left = false, onClick, disabled, show }) => (
  <Box
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: show ? (disabled ? 0.5 : 1) : 0,
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
      transition: 'opacity 0.3s ease',
      '&:hover': { backgroundColor: '#F3F4F6' },
    }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1F2937">
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
  const [hovered, setHovered] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 12 }, // Default mobile
    breakpoints: {
      '(min-width: 768px)': { slides: { perView: 2, spacing: 15 } }, // Tablet
      '(min-width: 1024px)': { slides: { perView: 3, spacing: 20 } }, // Desktop
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      console.log('Current perView:', slider.options.slides.perView);
      setLoaded(true);
    },
  });

  const { data: promos, isLoading, isFetching } = useFetchPromo();
  if (isLoading || isFetching) {
    return <Loading />;
  }

  if (!promos || (Array.isArray(promos) && promos.length === 0)) {
    return (
      <Container sx={{ textAlign: 'center', mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: '14px', md: '30px' }, fontWeight: 'bold', color: '#1F2937' }}
          >
            Promo berlangsung
          </Typography>
          <Link to="/promo">
            <Button
              sx={{
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: '500',
              }}
              endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: '10px', md: 10 } }} />}
            >
              <Typography
                sx={{ fontSize: { xs: '12px', md: '16px' }, textDecoration: 'underline' }}
              >
                Lihat Semua
              </Typography>
            </Button>
          </Link>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb : 2
          }}
        >
          {/* <img
            src="/assets/no-data.svg"
            alt="No Data"
            style={{ width: 250, marginBottom: 16 }}
          /> */}
          <Typography variant="h6" color="textSecondary">
            Belum ada promo yang tersedia.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Coba lagi nanti.
          </Typography>
        </Box>
      </Container>
    );
  }

  const totalSlides = promos?.length;
  const maxSlides = instanceRef.current?.options.slides.perView || 1; // Default 1 untuk mobile
  const isSlideDisabled = totalSlides <= maxSlides;

  return (
    <Box sx={{ p: { xs: 4, md: 4 } }}>
      <Box sx={{ maxWidth: '1120px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: '14px', md: '30px' }, fontWeight: 'bold', color: '#1F2937' }}
          >
            Promo berlangsung
          </Typography>
          <Link to="/promo">
            <Button
              sx={{
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: '500',
              }}
              endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: '10px', md: 10 } }} />}
            >
              <Typography
                sx={{ fontSize: { xs: '12px', md: '16px' }, textDecoration: 'underline' }}
              >
                Lihat Semua
              </Typography>
            </Button>
          </Link>
        </Box>

        <Box
          sx={{ position: 'relative', cursor: 'pointer' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Box ref={sliderRef} className="keen-slider">
            {promos.map((promo) => (
              <Box
                key={promo.id}
                className="keen-slider__slide"
                sx={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 5 },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={promo.promo_image_url}
                    alt="Promo"
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          {loaded && instanceRef.current && !isSlideDisabled && (
            <>
              <Arrow
                left
                onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
                disabled={currentSlide === 0}
                show={hovered}
              />
              <Arrow
                onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
                disabled={currentSlide === totalSlides - maxSlides}
                show={hovered}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
