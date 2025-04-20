import { Box, Typography, Chip, Stack, Container } from '@mui/material';

import { Home, Apartment } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoadingPropertyPage from 'src/components/loading/LoadingPropertyPage';

export default function PropertyGrid({ data, isLoading, isFetching, sortCardBy }) {
  // const { data, isLoading, isFetching } = useListProperty();
  // const numberSortsortCardBy[0] === 'apartment' ?
  console.log(data?.rooms?.room_prices);
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
    return <LoadingPropertyPage />;
  }

  const filteredDataToColiving = data.filter((item) =>
    sortCardBy.includes(item.type.name.toLowerCase())
  );
  console.log(sortCardBy);

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
    <Box maxWidth="100%" sx={{ px: 0, mt: 3 }}>
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
            const oneMonthData = (() => {
              if (!property?.rooms) return null;

              // Ambil semua data harga "1_month" + diskonnya
              const pricesWithDiscount = property?.rooms
                .map((room) => {
                  const priceItem = room?.room_prices?.find(
                    (price) => price.duration === '1_month'
                  );
                  if (!priceItem) return null;

                  const discount = priceItem.room_discounts?.[0]; // ambil diskon pertama jika ada
                  return {
                    price: priceItem.price,
                    discountValue: discount?.discount_value
                      ? parseFloat(discount.discount_value)
                      : null,
                  };
                })
                .filter(Boolean); // hapus null

              if (pricesWithDiscount?.length === 0) return null;

              // Ambil harga dengan diskon termurah
              return pricesWithDiscount?.reduce((min, curr) => {
                const currFinal = curr.discountValue
                  ? curr.price - curr.price * (curr.discountValue / 100)
                  : curr.price;
                const minFinal = min.discountValue
                  ? min.price - min.price * (min.discountValue / 100)
                  : min.price;

                return currFinal < minFinal ? curr : min;
              });
            })();

            const originalPrice = oneMonthData?.price ?? 0;
            const discount = oneMonthData?.discountValue;
            const finalPrice = discount
              ? originalPrice - originalPrice * (discount / 100)
              : originalPrice;
            console.log(property?.rooms);
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
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>
                      {property.address}, {property.city.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption">
                      Mulai dari{' '}
                      <span style={{ textDecoration: ' line-through' }}>
                        {formatCurrency(originalPrice)}
                      </span>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', pt: '2px' }}>
                      {discount && (
                        <Typography
                          variant="overline"
                          sx={{
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            px: '2px',
                            mr: '4px',
                          }}
                        >
                          -{discount}%
                        </Typography>
                      )}
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                      >
                        {formatCurrency(finalPrice)} <span>/bulan</span>
                      </Typography>
                    </Box>
                  </Box>
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
