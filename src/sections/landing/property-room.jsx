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
import { WhatsApp } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from 'src/context/user-context';
import { useSnackbar } from 'notistack';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[1],
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%', // Sesuaikan dengan kebutuhan
  objectFit: 'cover',
});

const AvailabilityChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: theme.palette.success.main,
  color: 'white',
}));

const PropertyRoom = ({ rooms = [], payment, namaProperty, slug }) => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  console.log(rooms)
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

  if (!rooms.length) {
    return (
      <Container maxWidth="lg">
        <Typography variant="body1" textAlign="center" py={4}>
          Belum ada kamar
        </Typography>
      </Container>
    );
  }

  const selectRoom = (roomId) => {
    setBookingData((prev) => ({
      ...prev,
      room_id: prev.room_id === roomId ? null : roomId, // Toggle jika sudah dipilih
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Kamar
      </Typography>
      {rooms.map((room) => (
        <StyledCard key={room.id}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <ImageContainer>
                <ImageSlider images={room.room_files || []} />
                <AvailabilityChip label={room.status} size="small" />
              </ImageContainer>
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {room.name}
                </Typography>
                <Stack direction="row" spacing={1} my={1} flexWrap="wrap">
                  <Chip label={`${room.capacity} Orang`} />
                  <Chip label={room.room_type.name} />
                  <Chip label={`${room.area_size}m²`} />
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {formatPrice(room.price * 1.1)}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatPrice(room.price)} / {payment === 'monthly' ? 'bulan' : 'tahun'}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
                  <Button
                    variant="outlined"
                    startIcon={<WhatsApp />}
                    href={`https://wa.me/6285183311656?text=${encodeURIComponent(`Halo KostKita, Saya ingin menanyakan Kost/Property ${namaProperty}, - ${room.name} Boleh dibantu? Terima kasih`)}`}
                    sx={{ border: '1px solid green', color: 'green' }}
                  >
                    Chat KostKita
                  </Button>
                  {user ? (
                    !['admin', 'owner', 'owner_property'].includes(user.roles) ? (
                      <Button
                        variant={bookingData?.room_id === room.id ? 'contained' : 'outlined'}
                        onClick={() => {
                          selectRoom(room.id);
                          navigate(`/booking/${slug}?room_id=${room.id}`); // Tambahkan room_id ke URL
                        }}
                      >
                        Pilih Kamar {room.name}
                      </Button>
                    ) : null
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        enqueueSnackbar('Anda harus login terlebih dahulu!', {
                          variant: 'error',
                        });
                        navigate('/sign-in');
                      }}
                    >
                      Pilih Kamar
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Grid>
          </Grid>
        </StyledCard>
      ))}
    </Container>
  );
};

function ImageSlider({ images }) {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    mode: 'free-snap',
  });

  return (
    <Box sx={{ position: 'relative', backgroundColor: 'grey.300' }}>
      <Box ref={sliderRef} className="keen-slider">
        {images.length > 0 ? (
          images.map((image, index) => (
            <Box key={index} className="keen-slider__slide">
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
            sx={{ textAlign: 'center', p: 2, backgroundColor: 'gray' }}
          >
            <Typography variant="caption" color="white">
              No Image Available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default PropertyRoom;
