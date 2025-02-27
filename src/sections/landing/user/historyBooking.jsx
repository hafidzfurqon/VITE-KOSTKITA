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
} from '@mui/material';
import { useState } from 'react';
import CloudIcon from '@mui/icons-material/WbCloudy';
import { Link } from 'react-router-dom';
import { useGetBookingUser } from 'src/hooks/users/useGetBookingUser';
import { format } from 'date-fns';
import { Alert } from '@mui/material';

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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Error loading property details. Please try again later.</Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No property details found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Daftar Riwayat Booking
        </Typography>

        <Grid container spacing={3}>
          {/* Sidebar Tabs */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ display: 'inline-block', width: '100%' }}>
              <Tabs
                value={tabIndex}
                onChange={(event, newValue) => setTabIndex(newValue)}
                indicatorColor="primary"
                textColor="primary"
                orientation="vertical"
                sx={{ width: '100%' }}
              >
                <Tab label="Akan Datang" />
                <Tab label="Riwayat" />
              </Tabs>
            </Paper>
          </Grid>

          {/* Booking List */}
          <Grid item xs={12} md={9}>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card
                  key={booking.id}
                  sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 3 }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: { xs: '100%', md: 120 }, height: 120, borderRadius: 2 }}
                    image={booking.user.photo_profile}
                    alt="User profile"
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {booking.property.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
                      <Typography variant="body1" color="primary" fontWeight="bold">
                        Rp {booking.total_price.toLocaleString('id-ID')}
                      </Typography>
                      <Chip label="Selesai" color="success" size="small" />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Button
                        component={Link}
                        to={`/booking/${booking.id}`}
                        variant="outlined"
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
              <Box sx={{ textAlign: 'center', mt: 5 }}>
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
