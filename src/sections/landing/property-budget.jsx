import { useState } from 'react';
import { Box, Typography, Chip, Stack, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { useRouter } from 'src/routes/hooks';
import Loading from 'src/components/loading/loading';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

export default function PropertyBudgety() {
  const { data, isLoading, isFetching } = useListProperty();
  const [selectedRange, setSelectedRange] = useState(null);

  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  if (isLoading || isFetching) return <Loading />;
  if (!data || data.length === 0)
    return (
      <Container sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h6" color="textSecondary">
          Tidak ada data properti yang tersedia.
        </Typography>
      </Container>
    );

  const priceRanges = [
    { label: '< 3 Jt', min: 0, max: 3000000 },
    { label: '3 - 5 Jt', min: 3000000, max: 5000000 },
    { label: '> 5 Jt', min: 5000000, max: Infinity },
  ];

  const filteredProperties = selectedRange
    ? data.filter(
        (property) =>
          property.start_price >= selectedRange.min && property.start_price <= selectedRange.max
      )
    : data;

  return (
    <Container>
      <Box sx={{ mt: 10 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
          Cari hunian sesuai budgetmu
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}
        >
          {priceRanges.map((range) => (
            <Chip
              key={range.label}
              label={range.label}
              variant="filled"
              sx={{
                backgroundColor: selectedRange?.label === range.label ? '#009688' : 'white',
                color: selectedRange?.label === range.label ? 'white' : 'black',
                border: '2px solid #009688',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { backgroundColor: '#00796B', color: 'white' },
              }}
              onClick={() => setSelectedRange(selectedRange === range ? null : range)}
            />
          ))}
        </Stack>

        {filteredProperties.length === 0 && (
          <Typography variant="body1" color="textSecondary" textAlign="center">
            Tidak ada properti dengan rentang harga tersebut.
          </Typography>
        )}
      </Box>

      <Box mt={2} maxWidth="100%" sx={{ px: 0 }}>
        <Carousel
          responsive={responsive}
          swipeable
          draggable
          infinite
          autoPlay
          autoPlaySpeed={4500}
          keyBoardControl
          transitionDuration={500}
        >
          {filteredProperties.slice(0, 4).map((property) => (
            <Box
              key={property.id}
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                m: 1,
                overflow: 'hidden',
                boxShadow: 1,
                '&:hover': { boxShadow: 3 },
              }}
            >
              <ImageSlider images={property.files} />
              <Link
                to={`/property/${property.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'black', fontSize: 16 }}>
                    {property.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'gray', fontSize: '12px' }}>
                    {property.address}, {property.city.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                  >
                    {formatCurrency(property.start_price)} / bulan
                  </Typography>
                </Box>
              </Link>
            </Box>
          ))}
        </Carousel>
      </Box>
      <Box mt={2} maxWidth="100%" sx={{ px: 0 }}>
        <Carousel
          responsive={responsive}
          swipeable
          draggable
          infinite
          autoPlay
          autoPlaySpeed={4500}
          keyBoardControl
          transitionDuration={500}
        >
          {filteredProperties.slice(4, 8).map((property) => (
            <Box
              key={property.id}
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                m: 1,
                overflow: 'hidden',
                boxShadow: 1,
                '&:hover': { boxShadow: 3 },
              }}
            >
              <ImageSlider images={property.files} />
              <Link
                to={`/property/${property.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'black', fontSize: 16 }}>
                    {property.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'gray', fontSize: '12px' }}>
                    {property.address}, {property.city.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: 'black', fontSize: '14px' }}
                  >
                    {formatCurrency(property.start_price)} / bulan
                  </Typography>
                </Box>
              </Link>
            </Box>
          ))}
        </Carousel>
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
