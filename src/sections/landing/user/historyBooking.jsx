import { Button, Tabs, Tab, Box, Typography, Paper, Container, Grid } from '@mui/material';
import { useState } from 'react';
import CloudIcon from '@mui/icons-material/WbCloudy';
import { Link } from 'react-router-dom';

export default function HistoryBooking() {
  const [tabIndex, setTabIndex] = useState(1);

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Daftar riwayat booking
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                display: { xs: 'block', md: 'inline-block' },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <Tabs
                value={tabIndex}
                onChange={(event, newValue) => setTabIndex(newValue)}
                indicatorColor="primary"
                textColor="primary"
                orientation={window.innerWidth < 900 ? 'horizontal' : 'vertical'}
              >
                <Tab label="Akan datang" />
                <Tab label="Riwayat" />
              </Tabs>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            {/* Filter Buttons */}
            <Box
              sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 3 }}
            >
              <Button variant="contained" color="primary">
                Semua
              </Button>
              <Button variant="outlined">Selesai</Button>
              <Button variant="outlined">Dibatalkan</Button>
              <Button variant="outlined">Kedaluwarsa</Button>
              <Button variant="outlined">Tidak hadir</Button>
            </Box>

            {/* Empty State */}
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
                color="inherit"
                sx={{ fontWeight: 'bold' }}
              >
                Cari Hunian Sekarang
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
