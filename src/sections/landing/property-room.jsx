import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  styled,
  Tabs,
  Tab,
} from '@mui/material';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { PriceCheckOutlined, WhatsApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'src/context/user-context';
import { useSnackbar } from 'notistack';
import { Iconify } from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { fCurrency } from 'src/utils/format-number';
import { RoomWithTabs } from 'src/component/RoomPrice';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[1],
}));

const AvailabilityChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: theme.palette.success.main,
  color: 'white',
}));

const PropertyRoom = ({ rooms = [], namaProperty, slug }) => {
  const navigate = useNavigate();
  console.log(rooms);
  const [bookingData, setBookingData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const [selectedDurations, setSelectedDurations] = useState({}); // { [roomId]: '1_month' }

  const handleSelectDuration = (roomId, duration) => {
    setSelectedDurations((prev) => ({ ...prev, [roomId]: duration }));
  };

  const calculateDates = (durationKey) => {
    const today = new Date();
    let checkout = new Date(today);

    switch (durationKey) {
      case 'dayly':
        checkout.setDate(today.getDate() + 1);
        break;
      case '1_month':
        checkout.setMonth(today.getMonth() + 1);
        break;
      case '3_month':
        checkout.setMonth(today.getMonth() + 3);
        break;
      case '6_month':
        checkout.setMonth(today.getMonth() + 6);
        break;
      case '12_month':
      case '1_year':
        checkout.setFullYear(today.getFullYear() + 1);
        break;
      default:
        checkout.setDate(today.getDate() + 1);
    }

    const format = (date) => date.toISOString().split('T')[0];
    return {
      checkInDate: format(today),
      checkOutDate: format(checkout),
    };
  };

  const selectRoom = (roomId) => {
    setBookingData((prev) => ({
      ...prev,
      room_id: prev.room_id === roomId ? null : roomId, // Toggle jika sudah dipilih
    }));
  };
  useEffect(() => {
    console.log('Selected durations:', selectedDurations);
  }, [selectedDurations]);
  if (!rooms.length) {
    return (
      <Container maxWidth="lg">
        <Typography variant="body1" textAlign="center" py={4}>
          Belum ada kamar
        </Typography>
      </Container>
    );
  }

  return (
    <Box maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Kamar
      </Typography>

      {rooms.map((room) => (
        <StyledCard key={room.id}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} sx={{ position: 'relative' }}>
              <ImageSlider images={room.room_files || []} />
              {/* <AvailabilityChip label={room.status} size="small" /> */}
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ pb: 1 }}>
                  {room.name}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={`${room.capacity} Orang`} size="small" />
                  <Chip label={room.room_type.name} size="small" />
                  <Chip label={`${room.area_width * room.area_length}m²`} size="small" />
                </Stack>
                <Grid sx={{ my: 2, pb: 1 }} container spacing={2}>
                  {room.room_facilities.slice(0, 4).map((facility) => (
                    <Grid item xs={6} key={facility.id}>
                      <Stack direction="row" alignItems="center">
                        <Iconify sx={{ mr: 1 }} icon="mingcute:check-line" />
                        {facility.name}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                {/* <Button
                  variant="body2"
                  sx={{
                    mt: 2,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <span>Lihat Detail</span>
                  <ArrowForwardIosIcon fontSize="inherit" />
                </Button> */}
                <Box>
                  <RoomWithTabs
                    key={room.id || index}
                    room={room}
                    onSelectDuration={handleSelectDuration}
                  />
                </Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<WhatsApp />}
                    href={`https://wa.me/6289668078854?text=${encodeURIComponent(`Halo KostKita,\n\nSaya ingin menanyakan Kost/Property ${namaProperty}, - ${room.name} Boleh dibantu?\n\nTerima kasih`)}`}
                    sx={{ border: '1px solid green', color: 'green' }}
                  >
                    Chat KostKita
                  </Button>
                  {user?.roles?.length > 0 ? (
                    !['admin', 'owner', 'owner_property'].includes(user.roles) ? (
                      <LoadingButton
                        variant="contained"
                        fullWidth
                        size="large"
                        color="inherit"
                        disabled={room.stock === 0} // Disable button jika kamar sudah dibooking
                        onClick={() => {
                          const selectedDuration = selectedDurations[room.id];
                          const { checkInDate, checkOutDate } = calculateDates(
                            selectedDuration || 'dayly'
                          );
                          if (!room.isBooked) {
                            selectRoom(room.id);
                            navigate(
                              `/booking/${slug}?room_id=${room.id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
                            );
                          }
                        }}
                      >
                        {room.stock === 0 ? 'Kamar Sedang Penuh' : `Pilih Kamar`}
                      </LoadingButton>
                    ) : null
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      color="inherit"
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

  return (
    <Box sx={{ position: 'relative' }}>
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

      {/* Next Arrow */}
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

      {/* Dots */}
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mt: 2 }}>
        {images.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => slider.current?.moveToIdx(idx)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: currentSlide === idx ? 'black' : 'grey',
              mx: 0.5,
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default PropertyRoom;
