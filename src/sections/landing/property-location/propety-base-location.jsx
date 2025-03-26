import { useState, useRef } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Link, useNavigate } from 'react-router-dom';
import Loading from 'src/components/loading/loading';

const PropertyBaseLocation = () => {
  const location = [
    {
      id: 1,
      image: 'https://akademiprestasi.com/wp-content/uploads/2022/11/ipb.jpg',
      city_code: 3201,
      title: 'Bogor',
    },
  ];

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Refs untuk tombol navigasi
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <Container>
      <Box sx={{ maxWidth: '1120px', mx: 'auto', pt: 3, pb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: '19px', md: '30px' }, fontWeight: 'bold', color: '#1F2937' }}
          >
            Cari hunian sesuai <span style={{ color: '#FFCC00' }}>lokasi</span>
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
            {location.map((lokasi) => (
              <SwiperSlide
                key={lokasi.id}
                onClick={() => navigate(`/sewa/kost/kota/${lokasi.city_code}`)}
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
                    src={lokasi.image}
                    alt="Promo"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {lokasi.title}
                </Typography>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
    </Container>
  );
};

export default PropertyBaseLocation;
