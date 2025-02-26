import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
  styled,
} from '@mui/material';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[1],
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  height: '100%',
});

const OverlayButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: 'white',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: 'white',
  },
}));

const AvailabilityChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: theme.palette.success.main,
  color: 'white',
  // top : '30px'
}));

// Map facility names to icons
// const facilityIcons = {
//   'Single Bed': SingleBedIcon,
//   'Jendela arah luar': WindowIcon,
//   AC: AcUnitIcon,
//   'Kamar Mandi Dalam': BathtubIcon,
//   'Balkon/Teras': BalconyIcon,
//   'Water Heater': WaterDropIcon,
// };

const PropertyRoom = ({ rooms = [] }) => {
  // Set default value to empty array
  // Check if rooms is valid array
  const validRooms = Array.isArray(rooms) ? rooms : [];
  console.log(rooms);

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
      style: 'currency',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace('IDR', 'Rp');
  };

  if (!validRooms.length) {
    return (
      <Container maxWidth="lg">
        <Typography variant="body1" textAlign="center" py={4}>
          Tidak ada kamar 
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }} id='SectionRoom'>
      <Typography variant="h6" sx={{ mb: 5 }} >
        Kamar
      </Typography>
      {validRooms.map((room) => (
        <StyledCard key={room.id} >
          <Grid container>
            {/* Left side - Image */}
            <Grid item xs={12} md={4}>
              <ImageContainer>
                <ImageSlider images={room.room_files || '/api/placeholder/400/300'} />
                <AvailabilityChip label={room.status} size="small" />
              </ImageContainer>
            </Grid>

            {/* Right side - Content */}
            <Grid item xs={12} md={8}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {room.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {room.capacity} Orang • {room.area_size}m²
                    </Typography>
                  </Box>
                  {/* <Button color="primary">Lihat Detail</Button> */}
                </Box>

                {/* Facilities */}
                <Grid container spacing={2} mb={3}>
                  {room.room_facilities?.map((facility, index) => {
                    return (
                      <Grid item xs={3} md={2} key={index}>
                        <Box key={index} display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">
                          {/* <Stack direction={{ xs: 'column', sm: 'row' }} > */}
                            {facility.name}
                        {/* </Stack> */}
                          </Typography>
                        </Box>
                     </Grid>  
                    );
                  })}
                </Grid>

                {/* Price section */}
                <Box mt={3}>
                  {/* <Grid container spacing={2} mb={2}>
                    {['1-2 bulan', '3-5 bulan', '6-11 bulan', '>12 bulan'].map(
                      (duration, index) => (
                        <Grid item xs={3} key={index} textAlign="center">
                          <Typography variant="body2" color="text.secondary">
                            {duration}
                          </Typography>
                          <Typography variant="body2" color="error">
                            -{(index + 1) * 2}%
                          </Typography>
                        </Grid>
                      )
                    )}
                  </Grid> */}

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {formatPrice(room.price * 1.1)}
                      </Typography>
                      <Typography variant="h6" sx={{ display: 'flex', gap: 1 }}>
                        {formatPrice(room.price)}/
                        {room.room_discounts?.map((discount) => {
                          return (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {discount.payment_type === 'monthly' ? 'bulan' : 'Tahun'}
                            </Typography>
                          );
                        })}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}
                      >
                        Pilih
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </StyledCard>
      ))}
    </Container>
  );
};

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
        // height: 200,
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
                alt={`Property Image ${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
              top: '60%',
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
              top: '60%',
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
            top:'110%',
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
                backgroundColor: index === currentSlide ? 'black' : 'gray',
                opacity: index === currentSlide ? 1 : 0.5,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default PropertyRoom;
