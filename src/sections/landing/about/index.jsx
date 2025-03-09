import { Container, Box, Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
      {/* Hero Section */}
      <Grid
        container
        spacing={3}
        alignItems="center"
        sx={{ py: 5, flexDirection: { xs: 'column-reverse', md: 'row' } }}
      >
        {/* Teks */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              KosKita
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Mewujudkan hunian berkualitas dan terjangkau untuk semua orang, di setiap fase
              kehidupan.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: 'black',
                color: 'white',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Cari Hunian Sekarang
            </Button>
          </Box>
        </Grid>

        {/* Gambar */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src="/public/assets/background/About.jpg"
              alt="Hero Image"
              style={{ width: '100%', borderRadius: 8 }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Sekilas Tentang KosKita */}
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Sekilas Tentang KosKita
        </Typography>
        <Typography variant="body1" color="textSecondary" maxWidth="md" mx="auto">
          KosKita adalah platform yang menyediakan hunian berkualitas dengan harga terjangkau,
          memberikan kenyamanan dan fasilitas terbaik untuk setiap penghuninya.
        </Typography>
      </Box>

      {/* Keuntungan Tinggal di KosKita */}
      <Box sx={{ py: 5 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Keuntungan Tinggal di KosKita
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                Fasilitas Lengkap
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Nikmati fasilitas modern yang membuat hidup lebih nyaman.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                Harga Terjangkau
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pilihan harga yang sesuai dengan kantong tanpa mengorbankan kenyamanan.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                Lokasi Strategis
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Dekat dengan pusat kota, kampus, dan tempat hiburan.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
