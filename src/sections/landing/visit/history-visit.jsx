import {
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
} from '@mui/material';
import { useState } from 'react';
import CloudIcon from '@mui/icons-material/WbCloudy';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useFetchVisit } from 'src/hooks/users/useFetchVisit';
import { Paper } from '@mui/material';
import { Tab } from '@mui/material';

export default function HistoryVisit() {
  const [tabIndex, setTabIndex] = useState(0);
  const { data, isLoading, isFetching, error } = useFetchVisit();
  const visits = data?.data || [];

  const filteredVisits = visits.filter((visit) => {
    if (tabIndex === 0) return visit.status === 'pending';
    return visit.status !== 'pending';
  });

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
          {/* Visit List */}
          <Grid item xs={12} md={8}>
            {filteredVisits.length > 0 ? (
              filteredVisits.map((visit) => (
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
                      visit.property?.files?.[0]?.file_url ||
                      'https://backend-koskita.hafidzfrqn.serv00.net//storage/users_photo_profile/default.jpg'
                    }
                    alt="Property image"
                  />

                  <CardContent sx={{ flex: 1, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {visit.property?.name || 'Nama Properti Tidak Tersedia'}
                      </Typography>
                      <Chip
                        label={getStatusText(visit.status)}
                        color={getStatusColor(visit.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {visit.property?.address || 'Alamat tidak tersedia'},{' '}
                      {visit.property?.sector?.name || '—'}, {visit.property?.city?.name || '—'}
                    </Typography>

                    <Typography variant="body2">
                      Tanggal Visit:{' '}
                      <b>
                        {visit.visit_date
                          ? format(parseISO(visit.visit_date), 'dd MMM yyyy HH:mm')
                          : 'Belum ditentukan'}
                      </b>
                    </Typography>

                    {visit.estimated_stay_date_start && visit.estimated_stay_date_end && (
                      <Typography variant="body2">
                        Rencana Stay:{' '}
                        <b>
                          {format(parseISO(visit.estimated_stay_date_start), 'dd MMM yyyy')} -{' '}
                          {format(parseISO(visit.estimated_stay_date_end), 'dd MMM yyyy')}
                        </b>
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        Rp {visit.property?.start_price?.toLocaleString('id-ID') || '—'}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Kode Visit: <b>{visit.visit_code || '—'}</b>
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
                  Tidak ada visit {tabIndex === 0 ? 'pending' : 'dikonfirmasi'}
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
