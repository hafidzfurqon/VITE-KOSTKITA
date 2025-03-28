import {
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import CloudIcon from '@mui/icons-material/WbCloudy';
import { Link } from 'react-router-dom';
import { useGetBookingUser } from 'src/hooks/users/useGetBookingUser';
import { format } from 'date-fns';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function HistoryBooking() {
  const [tabIndex, setTabIndex] = useState(0);
  const { data, isLoading, isFetching, error } = useGetBookingUser();
  const bookings = data?.data || [];

  const filteredBookings = bookings.filter((booking) => {
    if (tabIndex === 0) return booking.status === 'pending';
    return booking.status !== 'pending';
  });
  console.log(filteredBookings)
  if (isLoading || isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error">Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Riwayat Booking
        </Typography>
        <CustomBreadcrumbs
          links={[
            { name: 'Home', href: '/' },
            { name: 'Daftar Riwayat booking', href: '' },
          ]}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {/* Sidebar Tabs */}
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ width: '100%', borderRadius: 2 }}>
              <Tabs
                value={tabIndex}
                onChange={(event, newValue) => setTabIndex(newValue)}
                indicatorColor="primary"
                textColor="primary"
                orientation="vertical"
                sx={{
                  '& .MuiTabs-flexContainer': {
                    alignItems: 'center',
                  },
                  '& .MuiTab-root': {
                    fontSize: '1rem',
                    textTransform: 'none',
                    py: 1.5,
                    textAlign: 'center',
                    width: '100%',
                  },
                }}
              >
                <Tab label="Pending" />
                <Tab label="Dikonfirmasi" />
              </Tabs>
            </Paper>
          </Grid>

          {/* Booking List */}
          <Grid item xs={12} md={9}>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 2,
                    mb: 3,
                    p: 2,
                    borderRadius: 3,
                    boxShadow: 3,
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: { xs: '100%', md: 140 }, height: 140, borderRadius: 2 }}
                    image={
                      booking.property_room?.room_files?.[0]?.file_url ||
                      'https://backend-koskita.hafidzfrqn.serv00.net//storage/users_photo_profile/jL4rtaLwCZdU9s4qtRYKARQOxTrlyh9qTIvFjTfS.jpg'
                    }
                    alt="Room image"
                  />

                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {booking.property.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {booking.property.address}, {booking.property.city.name},{' '}
                      {booking.property.state.name}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      {booking.status === 'confirm' ? (
                        <>
                          <Typography variant="body2">
                            Check-in: <b>{format(new Date(booking.check_in), 'dd MMM yyyy')}</b>
                          </Typography>
                          <Typography variant="body2">
                            Check-out: <b>{format(new Date(booking.check_out), 'dd MMM yyyy')}</b>
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2">
                          Tanggal Booking:{' '}
                          <b>{format(new Date(booking.booking_date), 'dd MMM yyyy')}</b>
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={booking.status}
                        color={booking.status === 'pending' ? 'warning' : 'success'}
                      />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Button
                        component={Link}
                        to={`/history/booking/detail/${booking?.booking_code}`}
                        variant="contained"
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        Lihat Detail
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', mt: 5, py: 3, borderRadius: 2, boxShadow: 2 }}>
                <CloudIcon sx={{ fontSize: 60, color: '#ccc' }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  Tidak ada booking {tabIndex === 0 ? 'pending' : 'dikonfirmasi'}
                </Typography>

                {/* Tombol Cari Hunian hanya muncul jika tabIndex = 0 (Pending) */}
                {tabIndex === 0 && (
                  <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, textTransform: 'none' }}
                  >
                    Cari Hunian
                  </Button>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

// function ImageSlider({ images }) {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const [sliderRef, instanceRef] = useKeenSlider({
//     loop: true,
//     slides: { perView: 1 },
//     mode: 'free-snap',
//     slideChanged(s) {
//       setCurrentSlide(s.track.details.rel);
//     },
//   });

//   const prevSlide = () => instanceRef.current?.prev();
//   const nextSlide = () => instanceRef.current?.next();

//   return (
//     <Box
//       sx={{
//         position: 'relative',
//         height: 200,
//         backgroundColor: 'grey.300',
//         '&:hover .slider-arrow': { opacity: 1 },
//       }}
//     >
//       <Box ref={sliderRef} className="keen-slider">
//         {images.length > 0 ? (
//           images.map((image, index) => (
//             <Box sx={{ borderRadius: 2 }} key={index} className="keen-slider__slide">
//               <img
//                 src={image.file_url}
//                 alt={`Apartement Image ${index}`}
//                 style={{ width: '100%', height: '200px', objectFit: 'cover' }}
//               />
//             </Box>
//           ))
//         ) : (
//           <Box
//             className="keen-slider__slide"
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               height: '100%',
//               backgroundColor: 'gray',
//             }}
//           >
//             <Typography variant="caption" color="white">
//               No Image Available
//             </Typography>
//           </Box>
//         )}
//       </Box>

//       {images.length > 1 && (
//         <>
//           <Box
//             className="slider-arrow"
//             sx={{
//               position: 'absolute',
//               top: '50%',
//               left: 10,
//               transform: 'translateY(-50%)',
//               cursor: 'pointer',
//               backgroundColor: 'white',
//               color: 'black',
//               p: 1,
//               borderRadius: '20%',
//               opacity: 0,
//               transition: 'opacity 0.3s',
//             }}
//             onClick={prevSlide}
//           >
//             {'<'}
//           </Box>
//           <Box
//             className="slider-arrow"
//             sx={{
//               position: 'absolute',
//               top: '50%',
//               right: 10,
//               transform: 'translateY(-50%)',
//               cursor: 'pointer',
//               backgroundColor: 'white',
//               color: 'black',
//               p: 1,
//               borderRadius: '20%',
//               opacity: 0,
//               transition: 'opacity 0.3s',
//             }}
//             onClick={nextSlide}
//           >
//             {'>'}
//           </Box>
//         </>
//       )}

//       {images.length > 1 && (
//         <Box
//           sx={{
//             position: 'absolute',
//             bottom: 10,
//             left: '50%',
//             transform: 'translateX(-50%)',
//             display: 'flex',
//             gap: 1,
//           }}
//         >
//           {images.map((_, index) => (
//             <Box
//               key={index}
//               sx={{
//                 width: 8,
//                 height: 8,
//                 borderRadius: '50%',
//                 backgroundColor: index === currentSlide ? 'black' : 'white',
//                 opacity: index === currentSlide ? 1 : 0.5,
//               }}
//             />
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// }
