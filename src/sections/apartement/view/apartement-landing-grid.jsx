import { useState } from 'react';
import { Box, Typography, Chip, Stack, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import 'keen-slider/keen-slider.min.css';
import { Home, Apartment } from '@mui/icons-material';
import { useKeenSlider } from 'keen-slider/react';
import Loading from 'src/components/loading/loading';
import { useFetchAllPublicApartement } from 'src/hooks/apartement/public';

export default function ApartementGrid() {
  const {data, isLoading, isFetching} = useFetchAllPublicApartement();
  const router = useRouter();
  if (isLoading || isFetching) {
    return <Loading />;
  }
  
  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const getApartementIcon = (type) => {
    if (type.toLowerCase().includes('apartment'))
      return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };

  

  if (!data || (Array.isArray(data) && data.length === 0)) {
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
    <Container>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
          mt: 4,
          mb: 4,
        }}
      >
        {data?.map((apartement) => {
          const hasDiscount = apartement.discounts.length > 0;
          console.log(apartement.type.name)
          return (
            <Box
              key={apartement.id}
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                '&:hover': { boxShadow: 3 },
              }}
            >
              <ImageSlider images={apartement.files} />
              <Link
                to={`/apartement/${apartement.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <Box sx={{ p: 2 }}>
                  {/* <Chip
                    icon={getApartementIcon(apartement.type.name)}
                    label={apartement.type}
                    sx={{ mb: 1, fontWeight: 600 }}
                  /> */}
                  <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'black', fontSize: 16 }}>
                    {apartement.name}
                  </Typography>
                  <Box sx={{ color: 'gray' }}>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '12px' }}>
                      {apartement.address}, {apartement.city.name}
                    </Typography>
                  </Box>
                  {apartement.discount_prifile_urlce ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="body2"
                        sx={{ color: 'gray', textDecoration: 'line-through' }}
                      >
                        {formatCurrency(apartement.start_price)}
                      </Typography>
                      <Chip label="-12%" color="error" size="small" />
                    </Stack>
                  ) : null}
                  {/* {apartement.} */}

                  {hasDiscount ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
                        <Typography sx={{ fontSize: '14px', mr: 1 }}>mulai dari</Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ textDecoration: 'line-through', fontWeight: 700, fontSize: '12px' }}
                        >
                          {formatCurrency(apartement.start_price)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Box
                          sx={{
                            backgroundColor: 'red',
                            color: 'white',
                            fontSize: '12px',
                            borderRadius: '10px',
                            px: '5px',
                          }}
                        >
                          -{apartement.discounts.map((discount) => discount.discount_value)}%
                        </Box>
                        <Typography variant="subtitle1" sx={{ color: 'black', fontSize: '14px' }}>
                          {formatCurrency(
                            apartement.discounts.map((discount) => discount.price_after_discount)
                          )}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                    >
                      {formatCurrency(apartement.start_price)} / bulan
                    </Typography>
                  )}
                </Box>
              </Link>
            </Box>
          );
        })}
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
        backgroundColor: 'grey.300',
        '&:hover .slider-arrow': { opacity: 1 },
      }}
    >
      <Box ref={sliderRef} className="keen-slider">
        {images.length > 0 ? (
          images.map((image, index) => (
            <Box sx={{ borderRadius: 2 }} key={index} className="keen-slider__slide">
              <img
                src={image.file_url}
                alt={`Apartement Image ${index}`}
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
              borderRadius: '50%',
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
              borderRadius: '50%',
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
