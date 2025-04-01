import { Box, Typography, Chip, Stack, Container } from '@mui/material';

import { Home, Apartment } from '@mui/icons-material';
import Loading from 'src/components/loading/loading';
import { fCurrency, fPercent } from 'src/utils/format-number';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function PropertyGrid({ data, isLoading, isFetching, sortCardBy }) {
  // const { data, isLoading, isFetching } = useListProperty();
  // const numberSortsortCardBy[0] === 'apartment' ?

  // const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();
  // const [sortBy, setSortBy] = useState(['coliving', 'kost']);

  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const getPropertyIcon = (type) => {
    if (type.toLowerCase().includes('apartment'))
      return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };

  if (isLoading || isFetching) {
    return <Loading />;
  }

  const filteredDataToColiving = data.filter((item) =>
    sortCardBy.includes(item.type.name.toLowerCase())
  );
  console.log(sortCardBy);
  // const responsive = {
  //   superLargeDesktop: {
  //     breakpoint: { max: 3000, min: 1024 },
  //     items: 4,
  //     partialVisibilityGutter: 40,
  //   },
  //   desktop: {
  //     breakpoint: { max: 1024, min: 768 },
  //     items: 3,
  //     partialVisibilityGutter: 30,
  //   },
  //   tablet: {
  //     breakpoint: { max: 768, min: 464 },
  //     items: 2,
  //     partialVisibilityGutter: 20,
  //   },
  //   mobile: {
  //     breakpoint: { max: 464, min: 0 },
  //     items: 1,
  //     partialVisibilityGutter: 10,
  //   },
  // };

  if (
    !filteredDataToColiving ||
    (Array.isArray(filteredDataToColiving) && filteredDataToColiving.length === 0)
  ) {
    return (
      <Container sx={{ textAlign: 'center', mt: 6 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* <img
            src="/assets/no-data.svg"
            alt="No Data"
            style={{ width: 250, marginBottom: 16 }}
          /> */}
          <Typography variant="h6" color="textSecondary">
            Tidak ada data properti yang tersedia.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Coba lagi nanti atau cari kategori lainnya.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box maxWidth="100%" sx={{ px: 0, mt: 3,  }}>
      {/* <Box position="relative"> */}
      {/* <Box */}
      {/* displayedData */}
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ position: 'relative' }}
      >
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

        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1.2} // Default untuk layar kecil
          breakpoints={{
            640: { slidesPerView: 1.5 }, // Menampilkan 1.5 slide pada layar >= 640px
            768: { slidesPerView: 2 }, // 2 slide pada tablet
            1024: { slidesPerView: 4 }, // 3 slide pada desktop
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
          {filteredDataToColiving?.map((property) => {
            const hasDiscount = property.discounts.length > 0;
            const currentDate = new Date();
            const activePromos = property?.promos ?? []; // Default ke array kosong jika undefined
            const hasPromo = property.promos.length > 0;

            console.log(activePromos);
            return (
              <SwiperSlide
                key={property.id}
                onClick={() => navigate(`/property/${property.slug}`)}
                style={{ cursor: 'pointer' }}
              >
                <Box
                  sx={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: 3,
                    // transition: 'transform 0.3s ease',
                    // '&:hover': { transform: 'translateY(-4px)', boxShadow: 5 },
                  }}
                >
                  <img
                    src={property?.files[0]?.file_url}
                    alt={`Property Image`}
                    loading="lazy"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </Box>
                {/* ))} */}

                <Box sx={{ p: 2 }}>
                  <Chip
                    icon={getPropertyIcon(property.type.name)}
                    label={property.type.name}
                    sx={{ mb: 1, fontWeight: 600 }}
                  />
                  <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'black', fontSize: 16 }}>
                    {property.name}
                  </Typography>
                  <Box sx={{ color: 'gray' }}>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '12px' }}>
                      {property.address}, {property.city.name}
                    </Typography>
                  </Box>
                  {property.discount_profile_price ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="body2"
                        sx={{ color: 'gray', textDecoration: 'line-through' }}
                      >
                        {fCurrency(property.start_price)}
                      </Typography>
                      <Chip label="-12%" color="error" size="small" />
                    </Stack>
                  ) : null}
                  {/* {property.} */}

                  {hasDiscount ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                        <Typography sx={{ fontSize: '14px', mr: 1 }}>mulai dari</Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            textDecoration: 'line-through',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}
                        >
                          {formatCurrency(property.start_price)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Box
                          sx={{
                            backgroundColor: 'red',
                            color: 'white',
                            fontSize: '11px',
                            borderRadius: '10px',
                            px: '5px',
                          }}
                        >
                          -Rp {fPercent(property.discounts[0]?.discount_value)}
                        </Box>
                        <Typography variant="subtitle1" sx={{ color: 'black', fontSize: '14px' }}>
                          {formatCurrency(
                            property.discounts.map((discount) => discount.price_after_discount)
                          )}
                        </Typography>
                      </Box>
                      {/* Diskon dan Voucher */}
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {property.discounts.some((d) => d.discount_value >= 10) && (
                          <Chip
                            icon={<Home fontSize="small" />}
                            label="Diskon sewa 12 Bulan"
                            variant="outlined"
                            color="primary"
                            size="small"
                          />
                        )}

                        {hasPromo &&
                          activePromos.map((promo, index) => (
                            <Chip
                              key={index}
                              label={promo.code} // Pastikan 'promo' memiliki properti 'code'
                              color="primary"
                              sx={{ position: 'absolute', top: 10, left: 10 }}
                            />
                          ))}
                      </Stack>
                    </>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                    >
                      {fCurrency(property.start_price)} /{' '}
                      {property?.payment_type === 'yearly' ? 'Tahun' : 'bulan'}
                    </Typography>
                  )}
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* </Carousel> */}
      </Box>
    </Box>
  );
}
