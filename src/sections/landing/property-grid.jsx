import { useState } from 'react';
import { Box, Typography, Chip, Stack, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { useRouter } from 'src/routes/hooks';
import 'keen-slider/keen-slider.min.css';
import { Home, Apartment } from '@mui/icons-material';
import { useKeenSlider } from 'keen-slider/react';
import Loading from 'src/components/loading/loading';
import { fPercent } from 'src/utils/format-number';
import { Button } from '@mui/material';

export default function PropertyGrid({ data, isLoading, isFetching }) {
  // const { data, isLoading, isFetching } = useListProperty();
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView: 4, spacing: 0 }, // Desktop full 4 tanpa spacing
    breakpoints: {
      '(max-width: 1200px)': { slides: { perView: 3, spacing: 10 } },
      '(max-width: 900px)': { slides: { perView: 2, spacing: 10 } },
      '(max-width: 600px)': { slides: { perView: 1, spacing: 0 } }, // Mobile 1 properti per slide tanpa spacing
    },
  });
  // const router = useRouter();

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

  const filteredDataToColiving = data.filter(
    (item) => item.type.name.toLowerCase() === 'coliving' || 'kost'
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

  return (
    <Container maxWidth="100%" sx={{ px: 0 }}>
      <Box position="relative">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 1,
            mt: 4,
            mb: 4,
          }}
          ref={sliderRef}
          className="keen-slider"
        >
          {filteredDataToColiving?.map((property) => {
            const hasDiscount = property.discounts.length > 0;
            return (
              <Box
                key={property.id}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 1,
                  '&:hover': { boxShadow: 3 },
                  m: 1, // Tambahkan margin agar tidak menempel
                }}
                className="keen-slider__slide"
              >
                <Link
                  to={`/property/${property.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <Box
                    sx={{
                      borderRadius: 1,
                      overflow: 'hidden',
                      boxShadow: 1,
                      '&:hover': { boxShadow: 3 },
                    }}
                  >
                    <img
                      src={property.files[0].file_url}
                      alt={`Property Image`}
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
                          {formatCurrency(property.start_price)}
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
                      </>
                    ) : (
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                      >
                        {formatCurrency(property.start_price)} / bulan
                      </Typography>
                    )}
                  </Box>
                </Link>
              </Box>
            );
          })}
        </Box>
        <Button
          onClick={() => instanceRef.current?.prev()}
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            borderRadius: '50%',
            minWidth: '40px',
            height: '40px',
          }}
        >
          {'<'}
        </Button>
        <Button
          onClick={() => instanceRef.current?.next()}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            borderRadius: '50%',
            minWidth: '40px',
            height: '40px',
          }}
        >
          {'>'}
        </Button>
      </Box>
    </Container>
  );
}

function ImageSlider({ images }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    mode: 'free-snap',
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  const prevSlide = () => instanceRef.current?.prev();
  const nextSlide = () => instanceRef.current?.next();

  return (
    <Box
      sx={{
        position: 'relative',
        height: 200,
        backgroundColor: 'grey.500',
        '&:hover .slider-arrow': { opacity: 1 },
      }}
    >
      <Box ref={sliderRef} className="keen-slider">
        {images.length > 0 ? (
          images.map((image, index) => (
            <Box sx={{ borderRadius: 1 }} key={index} className="keen-slider__slide">
              <img
                src={image.file_url}
                alt={`Property Image ${index}`}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            </Box>
          ))
        ) : (
          <Box
            className="keen-slider__slide"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              backgroundColor: 'gray',
            }}
          >
            <Typography variant="caption" color="white">
              No Image Available
            </Typography>
          </Box>
        )}
      </Box>

      {images.length > 1 && (
        <>
          <Box
            className="slider-arrow"
            sx={{
              position: 'absolute',
              top: '50%',
              left: 10,
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              backgroundColor: 'white',
              color: 'black',
              p: 1,
              borderRadius: '20%',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            onClick={prevSlide}
          >
            {'<'}
          </Box>
          <Box
            className="slider-arrow"
            sx={{
              position: 'absolute',
              top: '50%',
              right: 10,
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              backgroundColor: 'white',
              color: 'black',
              p: 1,
              borderRadius: '20%',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            onClick={nextSlide}
          >
            {'>'}
          </Box>
        </>
      )}

      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === currentSlide ? 'black' : 'white',
                opacity: index === currentSlide ? 1 : 0.5,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
