import { Apartment, Home } from '@mui/icons-material';
import { Chip, Grid, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { Container } from '@mui/material';
import { useKeenSlider } from 'keen-slider/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Loading from 'src/components/loading/loading';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { fPercent } from 'src/utils/format-number';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Property {
  type: {
    name: string;
  };
}

const data: Property[] = [
  { type: { name: 'coliving' } },
  { type: { name: 'apartement' } },
  { type: { name: 'coliving' } },
];

const ColivingPage = () => {
  const { data, isLoading, isFetching } = useListProperty();

  const getPropertyIcon = (type: string) => {
    if (type.toLowerCase().includes('apartment'))
      return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };

  const formatCurrency = (price: any) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  if (isLoading || isFetching) {
    return <Loading />;
  }

  const filteredDataToColiving: Property[] = data.filter((item: Property) =>
    ['coliving', 'kost'].includes(item.type.name.toLowerCase())
  );

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

  // console.log(filteredDataToColiving)
  return (
    <>
      <CustomBreadcrumbs
        links={[{ name: 'Home', href: '/' }, { name: 'Kost & Coliving' }]}
        sx={{ mb: { xs: 2, md: 3 } }}
        action={null}
        heading=""
        moreLink={[]}
        activeLast={true}
      />
      <Grid container spacing={2} sx={{ placeItems: 'center', mt: 3 }}>
        {filteredDataToColiving.map((coliving: any, index: number) => {
          const oneMonthData = (() => {
            if (!coliving?.rooms) return null;

            // Ambil semua data harga "1_month" + diskonnya
            const pricesWithDiscount = coliving.rooms
              .map((room: any) => {
                const priceItem = room.room_prices.find(
                  (price: any) => price.duration === '1_month'
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

            if (pricesWithDiscount.length === 0) return null;

            // Ambil harga dengan diskon termurah
            return pricesWithDiscount.reduce((min: any, curr: any) => {
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
                        {formatCurrency(12222)}
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
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

function ImageSlider({ images }: any) {
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
          images.map((image: any, index: number) => (
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
        {images.map((_: any, idx: number) => (
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
export default ColivingPage;
