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

export default function PropertyGrid() {
  const { data, isLoading, isFetching } = useListProperty();
  console.log(data);
  
  const router = useRouter();

  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const getPropertyIcon = (type) => {
    if (type.toLowerCase().includes('apartment')) return <Apartment fontSize="small" sx={{ mr: 0.5 }} />;
    return <Home fontSize="small" sx={{ mr: 0.5 }} />;
  };

  if( isLoading|| isFetching) {
    return <Loading/>
  }
 
  const Isdiscount = data.map((property) => property.discounts.map((discount) => discount.price_after_discount))

  return (
    <Container>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mt: 4,
          mb: 4,
        }}
      >
        {data?.map((property) => (
          <Box
            key={property.id}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 1,
              '&:hover': { boxShadow: 3 },
            }}
          >
            <Link to={`/property/${property.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <ImageSlider images={property.files} />
              <Box sx={{ p: 2 }}>
                <Chip icon={getPropertyIcon(property.type)} label={property.type} sx={{ mb: 1, fontWeight: 600 }} />
                <Typography sx={{ fontWeight: 700, mb: 0.5, color: 'black', fontSize: 16 }}>
                  {property.name}
                  </Typography>
                  <Box sx={{color : 'gray'}}>
                  <Typography variant="body2" sx={{ mb: 1 }}>{property.address},  <Box component="span" sx={{fontSize : '11px'}}>
                     {property.city.name}
                    </Box>
                    </Typography>
                  </Box>
                {property.discount_price ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ color: 'gray', textDecoration: 'line-through' }}>
                      {formatCurrency(property.start_price)}
                    </Typography>
                    <Chip label="-12%" color="error" size="small" />
                  </Stack>
                ) : null}
                {/* {property.} */}
                {Isdiscount ? <>
                 <Box sx={{display : 'flex', alignItems : 'center', color : "gray",}}> 
                  <Typography sx={{fontSize : '14px',  mr : 1}} >mulai dari</Typography>
                  <Typography variant="subtitle1" sx={{ textDecoration: 'line-through', fontWeight: 700, fontSize : '12px' }}>
                  {formatCurrency(property.start_price)}
                </Typography>
                </Box>
                <Box sx={{display : 'flex', alignItems : 'center', gap : '10px'}}>
                <Box sx={{ backgroundColor : 'red', color : 'white', fontSize : '12px', borderRadius : '10px', px : '5px'}}>
                  -{property.discounts.map((discount) => discount.discount_value)}%
                  </Box> 
                <Typography variant='subtitle1' sx={{color : 'black', fontSize : '14px'}}>{formatCurrency(property.discounts.map((discount) => discount.price_after_discount))}</Typography>
                </Box>
                </>
                : <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'black' }}>
                  {formatCurrency(property.discount_price || property.start_price)} / bulan
                </Typography>}
              </Box>
            </Link>
          </Box>
        ))}
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
             
              <Box sx={{ borderRadius: 2}} key={index} className="keen-slider__slide">
              <img
                src={image.file_url}
                alt={`Property Image ${index}`}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            </Box>
          ))
        ) : (
          <Box className="keen-slider__slide" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: 'gray' }}>
            <Typography variant="caption" color="white">No Image Available</Typography>
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
