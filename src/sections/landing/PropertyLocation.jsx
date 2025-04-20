import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Container, Chip, Stack, Grid, Button } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { Home, Apartment } from '@mui/icons-material';
import { useKeenSlider } from 'keen-slider/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoadingPropertyPage from 'src/components/loading/LoadingPropertyPage';

const PropertyBaseLocation = ({ data: cityCode, id }) => {
  const { data: allProperties, isLoading, isFetching } = useListProperty();

  const propertyList = Array.isArray(allProperties)
    ? allProperties.filter(
        (item) =>
          item.city?.city_code === cityCode && // hanya kota yang sesuai
          item.id !== id // kecuali id yang sama
      )
    : [];
  // console.log(id);
  const getPropertyIcon = (type) => {
    if (!type) return null; // Jika type kosong, tidak menampilkan ikon
    if (type.toLowerCase().includes('apartment'))
      return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };
  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 4 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  if (isLoading || isFetching) {
    return <LoadingPropertyPage />;
  }

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Hunian Lain Dekat Sini
      </Typography>

      {propertyList?.length === 0 && (
        <Typography sx={{ textAlign: 'center', mt: 3 }}>
          Belum ada properti di dekat kota ini
        </Typography>
      )}
      {
        <Grid container spacing={2} sx={{ placeItems: 'center', mt: 3 }}>
          {propertyList.map((coliving, index) => {
            const oneMonthData = (() => {
              if (!coliving?.rooms) return null;

              // Ambil semua data harga "1_month" + diskonnya
              const pricesWithDiscount = coliving?.rooms
                .map((room) => {
                  const priceItem = room?.room_prices?.find(
                    (price) => price?.duration === '1_month'
                  );
                  if (!priceItem) return null;

                  const discount = priceItem?.room_discounts?.[0]; // ambil diskon pertama jika ada
                  return {
                    price: priceItem.price,
                    discountValue: discount?.discount_value
                      ? parseFloat(discount.discount_value)
                      : null,
                  };
                })
                .filter(Boolean); // hapus null

              if (pricesWithDiscount.length === 0) return null;

              // Ambil harga dengan diskon termurah
              return pricesWithDiscount.reduce((min, curr) => {
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
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={coliving.id}>
                <Box sx={{ mb: 3 }}>
                  <ImageSlider images={coliving.files || []} />
                </Box>
                <Link
                  to={`/property/${coliving.slug}`}
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  <Chip
                    icon={getPropertyIcon(coliving.type.name)}
                    label={coliving.type.name}
                    sx={{ mb: 1, fontWeight: 600 }}
                  />
                  <Typography variant="subtitle1" sx={{ color: 'black' }}>
                    {coliving.name}
                  </Typography>
                  <Box sx={{ color: 'gray' }}>
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>
                      {coliving.address}, {coliving.city.name}
                    </Typography>
                  </Box>

                  {/* Price */}
                  {/*  */}
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '12px' }}>
                        Mulai dari{' '}
                        <span style={{ textDecoration: 'line-through' }}>
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
                </Link>
              </Grid>
            );
          })}
        </Grid>
      }
    </Container>
  );
};

function ImageSlider({ images }) {
  const [sliderRef, slider] = useKeenSlider({
    slides: { perView: 1 },
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // ❗ jika hanya 1 gambar, return biasa
  if (images.length === 1) {
    return (
      <Box sx={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 2 }}>
        <img
          src={images[0].file_url}
          alt="Property Image"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      </Box>
    );
  }

  // ❗ jika lebih dari 1, pakai slider
  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box ref={sliderRef} className="keen-slider">
        {images.length > 0 ? (
          images.map((image, index) => (
            <Box
              key={index}
              className="keen-slider__slide"
              sx={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 2 }}
            >
              <img
                src={image.file_url}
                loading="lazy"
                alt={`Property Image ${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </Box>
          ))
        ) : (
          <Box
            className="keen-slider__slide"
            sx={{ textAlign: 'center', p: 2, backgroundColor: 'gray' }}
          >
            <Typography variant="caption" color="white">
              Tidak ada image yang tersedia
            </Typography>
          </Box>
        )}
      </Box>

      {/* Prev & Next Button */}
      {images.length > 1 && isHovered && (
        <>
          <Button
            disabled={currentSlide === 0}
            onClick={() => slider.current?.prev()}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              minWidth: 0,
              padding: 1,
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <ArrowBackIosIcon fontSize="small" sx={{ ml: '5px' }} />
          </Button>

          <Button
            disabled={currentSlide === images.length - 1}
            onClick={() => slider.current?.next()}
            sx={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              minWidth: 0,
              padding: 1,
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        </>
      )}

      {/* Dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '5px 10px',
          borderRadius: '20px',
        }}
      >
        {images.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => slider.current?.moveToIdx(idx)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: currentSlide === idx ? 'white' : 'grey',
              mx: 0.5,
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default PropertyBaseLocation;
