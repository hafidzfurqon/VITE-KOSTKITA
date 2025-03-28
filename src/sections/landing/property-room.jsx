import { useState, useMemo } from 'react';
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
} from '@mui/material';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { WhatsApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'src/context/user-context';
import { useSnackbar } from 'notistack';
import { Iconify } from 'src/components/iconify';

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

const PropertyRoom = ({ rooms = [], payment, namaProperty, slug, discountData = [] }) => {
  const navigate = useNavigate();
  const [selectedMonthRange, setSelectedMonthRange] = useState({});
  const [bookingData, setBookingData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;

  const discountRanges = useMemo(() => discountData || [], [discountData]);

  const currentMonths = useMemo(() => {
    return Object.values(selectedMonthRange).reduce((acc, value) => {
      return acc + (value === 0 ? 1 : value === 1 ? 3 : value === 2 ? 6 : 12);
    }, 0);
  }, [selectedMonthRange]);

  const applicableDiscount = useMemo(() => {
    return (
      discountRanges.find(
        (discount) => currentMonths >= discount.min_month && currentMonths <= discount.max_month
      ) || null
    );
  }, [currentMonths, discountRanges]);

  const priceAfterDiscount = useMemo(() => {
    const basePrice = rooms?.[0]?.price || 0;
    return applicableDiscount?.discount_value
      ? basePrice * (1 - applicableDiscount.discount_value / 100)
      : basePrice;
  }, [applicableDiscount, rooms]);

  const selectRoom = (roomId) => {
    setBookingData((prev) => ({
      ...prev,
      room_id: prev.room_id === roomId ? null : roomId, // Toggle jika sudah dipilih
    }));
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

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
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
                  <Chip label={`${room.area_size}m²`} size="small" />
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

                <Box sx={{ display: 'flex', mb: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  {[0, 1, 2, 3].map((rangeIndex) => (
                    <Box
                      key={rangeIndex}
                      onClick={() =>
                        setSelectedMonthRange((prev) => ({ ...prev, [room.id]: rangeIndex }))
                      }
                      sx={{
                        p: 1,
                        flex: '1 1 25%',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor:
                          selectedMonthRange[room.id] === rangeIndex ? '#f0f7ff' : 'transparent',
                      }}
                    >
                      <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                        {rangeIndex === 0
                          ? '1-2'
                          : rangeIndex === 1
                            ? '3-5'
                            : rangeIndex === 2
                              ? '6-11'
                              : '>12'}{' '}
                        bulan
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Typography variant="h6" fontWeight="bold">
                  {applicableDiscount && (
                    <Typography
                      component="span"
                      sx={{ textDecoration: 'line-through', color: 'gray', mr: 1 }}
                    >
                      {rooms?.[0]?.start_price?.toLocaleString('id-ID') || 0}
                    </Typography>
                  )}
                  {priceAfterDiscount.toLocaleString('id-ID')} /{' '}
                  {payment === 'monthly' ? 'bulan' : 'tahun'}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
                  <Button
                    variant="outlined"
                    startIcon={<WhatsApp />}
                    href={`https://wa.me/6289668078854?text=${encodeURIComponent(`Halo KostKita,\n\nSaya ingin menanyakan Kost/Property ${namaProperty}, - ${room.name} Boleh dibantu?\n\nTerima kasih`)}`}
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
                loading="lazy"
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
              Tidak ada image yang tersedia
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default PropertyRoom;
