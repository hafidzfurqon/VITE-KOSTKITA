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
                  },
                }}
              >
                <Tab label="Riwayat" />
                <Tab label="Akan Datang" />
              </Tabs>
            </Paper>
          </Grid>

          {/* Booking List */}
          <Grid item xs={12} md={9}>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
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
                      'https://via.placeholder.com/140'
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
                      <Typography variant="body2">
                        Check-in: <b>{format(new Date(booking.check_in), 'dd MMM yyyy')}</b>
                      </Typography>
                      <Typography variant="body2">
                        Check-out: <b>{format(new Date(booking.check_out), 'dd MMM yyyy')}</b>
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                      }}
                    >
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        Rp {booking.total_price.toLocaleString('id-ID')}
                      </Typography>
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
                  Kamu belum memiliki riwayat booking
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Cari hunian yang ingin kamu lihat langsung dan booking
                </Typography>
                <Button
                  component={Link}
                  to="/"
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  Cari Hunian Sekarang
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
