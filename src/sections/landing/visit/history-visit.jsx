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
import { format, parseISO } from 'date-fns';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useFetchVisit } from 'src/hooks/users/useFetchVisit';

export default function HistoryVisit() {
  const [tabIndex, setTabIndex] = useState(0);
  const { data, isLoading, isFetching, error } = useFetchVisit();
  const visits = data?.data || [];

  // Filter visits based on tab selection
  // const filteredVisits = visits.filter((visit) => {
  //   const visitDate = new Date(visit.visit_date);
  //   const today = new Date();

  //   // Tab 0: History (past visits) or canceled visits
  //   if (tabIndex === 0) {
  //     return visitDate < today || visit.status === 'canceled';
  //   }
  //   // Tab 1: Upcoming visits (pending or confirmed)
  //   return visitDate >= today && visit.status !== 'canceled';
  // });

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'canceled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'confirmed':
        return 'Terkonfirmasi';
      case 'canceled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Riwayat Visit
        </Typography>
        <CustomBreadcrumbs
          links={[
            { name: 'Home', href: '/' },
            { name: 'Daftar Riwayat Visit', href: '' },
          ]}
          sx={{ mb: 3 }}
        />

        {/* Sidebar Tabs */}
        {/* <Grid item xs={12} md={3}>
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
          </Grid> */}

        {/* Visit List */}
        <Grid item xs={12} md={8}>
          {visits.length > 0 ? (
            visits.map((visit) => (
              <Card
                key={visit.id}
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
                    visit.property.files[0]?.file_url ||
                    'https://backend-koskita.hafidzfrqn.serv00.net//storage/users_photo_profile/jL4rtaLwCZdU9s4qtRYKARQOxTrlyh9qTIvFjTfS.jpg'
                  }
                  alt="Property image"
                />

                <CardContent sx={{ flex: 1, width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {visit.property.name}
                    </Typography>
                    <Chip
                      label={getStatusText(visit.status)}
                      color={getStatusColor(visit.status)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {visit.property.address}, {visit.property.sector.name},{' '}
                    {visit.property.city.name}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">
                      Tanggal Visit:{' '}
                      <b>{format(parseISO(visit.visit_date), 'dd MMM yyyy HH:mm')}</b>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">
                      Rencana Stay:{' '}
                      <b>
                        {format(parseISO(visit.estimated_stay_date_start), 'dd MMM yyyy')} -{' '}
                        {format(parseISO(visit.estimated_stay_date_end), 'dd MMM yyyy')}
                      </b>
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
                      Rp {visit.property.start_price.toLocaleString('id-ID')}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Kode Visit: <b>{visit.visit_code}</b>
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Button
                      component={Link}
                      to={`/history/visit/detail/${visit.visit_code}`}
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
                {tabIndex === 0
                  ? 'Kamu belum memiliki riwayat visit'
                  : 'Kamu belum memiliki jadwal visit yang akan datang'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Cari hunian yang ingin kamu lihat langsung dan visit
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="contained"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                Cari Hunian Untuk Visit Sekarang
              </Button>
            </Box>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
