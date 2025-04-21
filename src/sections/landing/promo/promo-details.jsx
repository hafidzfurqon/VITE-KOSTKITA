import React, { useState } from 'react';
import { Chip, Typography, Card, CardContent, Box, Paper, Grid, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFetchPromoDetail } from 'src/hooks/promo';
import Loading from 'src/components/loading/loading';
import { useSnackbar } from 'notistack';
import { Apartment, ContentCopy, Home } from '@mui/icons-material';
import { fDate } from 'src/utils/format-time';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingButton } from '@mui/lab';
import { fCurrency, fPercent } from 'src/utils/format-number';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from 'react-router-dom';
import { useKeenSlider } from 'keen-slider/react';

const PromoDetails = () => {
  const { slug } = useParams();
  const { data, isLoading, isFetching } = useFetchPromoDetail(slug);
  const { enqueueSnackbar } = useSnackbar();
  console.log(data);
  if (isLoading || isFetching) {
    return <Loading />;
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.code);
    enqueueSnackbar('Kode Berhasil Disalin', { variant: 'success' });
  };
  const getPropertyIcon = (type) => {
    if (type.toLowerCase().includes('apartment'))
      return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Promo', href: '/promo' },
          { name: <span dangerouslySetInnerHTML={{ __html: data.slug }} />, href: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box
        component="img"
        src={data.promo_image_url}
        alt={data.name}
        sx={{
          width: '100%',
          height: '100%',
          // maxHeight: 500,
          borderRadius: '10px',
          objectFit: 'cover',
        }}
      />
      {/* </Box> */}

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Promo Details */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ fontWeight: 'bolder' }}>
            {data.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2 }}
            dangerouslySetInnerHTML={{ __html: data.description }}
          />

          {/* Syarat & Ketentuan */}
          <Typography variant="h6" sx={{ mt: 4, fontWeight: 'bold' }}>
            Syarat & Ketentuan
          </Typography>
          <ul>
            <li>
              Periode promo berlaku {fDate(data.start_date)} - {fDate(data.end_date)}
            </li>
          </ul>
          <Typography variant="h6" sx={{ mt: 4, fontWeight: 'bold' }}>
            Disclaimer
          </Typography>
          <Typography variant="subtitle1">{data.disclaimer}</Typography>
        </Grid>

        {/* Cara Pakai */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: '#F5ECE0' }}>
            <Typography variant="h6" color={`black`}>
              Cara Pakai
            </Typography>
            <Box
              component="button"
              onClick={handleCopyCode}
              mt={3}
              sx={{
                width: '100%',
                display: 'flex',
                p: 2,
                alignItems: 'center',
                gap: 2,
                backgroundColor: 'white',
                cursor: 'pointer',
                borderRadius: '10px',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {data.code}
              </Typography>
              <ContentCopy />
            </Box>
            <Typography
              variant="subtitle2"
              sx={{ mt: 2 }}
              dangerouslySetInnerHTML={{ __html: data.how_to_use }}
            />
            {data.property && (
              <LoadingButton
                fullWidth
                size="medium"
                type="submit"
                color="inherit"
                variant="contained"
                // disabled={isPending}
                sx={{ mt: 2 }}
              >
                Lihat Unit
              </LoadingButton>
            )}
          </Paper>
        </Grid>
      </Grid>
      {data.property && (
        <Box sx={{ my: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Berlaku untuk unit berikut
          </Typography>
          <Grid container spacing={2} sx={{ placeItems: 'center', mt: 3 }}>
            {data?.property?.map((coliving, index) => {
              const oneMonthData = (() => {
                if (!coliving?.rooms) return null;

                // Ambil semua data harga "1_month" + diskonnya
                const pricesWithDiscount = coliving?.rooms
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
              // const hasDiscount = coliving.discounts.length > 0;
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Box
                    key={coliving.id}
                    sx={{
                      mb: 3,
                      borderRadius: 1,
                    }}
                  >
                    <ImageSlider images={coliving.files || []} />
                  </Box>
                  <Box
                    component={Link}
                    to={`/property/${coliving.slug}`}
                    style={{ textDecoration: 'none' }}
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
                      <Typography variant="body2" sx={{ mb: 1, fontSize: '12px' }}>
                        {coliving.address}, {coliving.city.name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '12px' }}>
                          Mulai dari{' '}
                          <span style={{ textDecoration: 'line-through' }}>
                            {fCurrency(originalPrice)}
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
                            {fCurrency(finalPrice)} <span>/bulan</span>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
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

export default PromoDetails;
