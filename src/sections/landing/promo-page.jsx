import { useState, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Link, useNavigate } from 'react-router-dom';
import { useFetchPromo } from 'src/hooks/promo';
import Loading from 'src/components/loading/loading';

export default function PromoPage() {
  const { data: promos, isLoading, isFetching } = useFetchPromo();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Refs untuk tombol navigasi
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <Box sx={{ maxWidth: '1120px', mx: 'auto', pt: 3, pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: '22px', md: '30px' }, fontWeight: 'bold', color: '#1F2937' }}
        >
          Promo <span style={{ color: '#FFCC00' }}>berlangsung</span>
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
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: { xs: '10px', md: 10 } }} />}
          >
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>Lihat Semua</Typography>
          </Button>
        </Link>
      </Box>

      {/* Container Swiper */}
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ position: 'relative' }}
      >
        {/* Tombol Custom */}
        <Box
          ref={prevRef}
          className="custom-prev"
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: 50,
            height: 50,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: '0.3s',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <ArrowBackIosNewIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>

        <Box
          ref={nextRef}
          className="custom-next"
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: 50,
            height: 50,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: '0.3s',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <ArrowForwardIosIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>

        {/* Swiper */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1.2} // Default untuk layar kecil
          breakpoints={{
            640: { slidesPerView: 1.5 }, // Menampilkan 1.5 slide pada layar >= 640px
            768: { slidesPerView: 2 }, // 2 slide pada tablet
            1024: { slidesPerView: 3 }, // 3 slide pada desktop
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {promos.map((promo) => (
            <SwiperSlide
              key={promo.id}
              onClick={() => navigate(`/promo/${promo.slug}`)}
              style={{ cursor: 'pointer' }}
            >
              <Box
                sx={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 5 },
                }}
              >
                <img
                  src={promo.promo_image_url}
                  alt="Promo"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}
