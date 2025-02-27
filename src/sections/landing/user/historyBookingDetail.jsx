import {
  Divider,
  Card,
  Typography,
  CircularProgress,
  Container,
  Box,
  Alert,
  Avatar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetBookingDetail } from 'src/hooks/users/useGetBookingDetail';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function HistoryBookingDetail() {
  const { bookingCode } = useParams();
  const { data: booking, isLoading, isFetching, error } = useGetBookingDetail(bookingCode);

  if (isLoading || isFetching) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">Terjadi kesalahan saat mengambil data</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'grey.100', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg" sx={{ p: 0 }}>
        {/* Data Penghuni */}
        <Box sx={{ backgroundColor: 'white', p: 3, mb: 2, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
            Data Penghuni
          </Typography>
          <Typography sx={{ fontWeight: 'medium' }}>{booking.user.name}</Typography>
          <Typography sx={{ color: 'grey.800' }}>{booking.user.phone_number}</Typography>
          <Typography sx={{ color: 'grey.800', mb: 2 }}>{booking.user.email}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ color: 'grey.600', fontSize: '0.875rem' }}>
            Kartu identitas asli (KTP/KITAS) dan Surat Nikah (untuk pasangan) dibutuhkan saat
            check-in
          </Typography>
        </Box>

        {/* Add-on */}
        <Box sx={{ backgroundColor: 'white', p: 3, mb: 2, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>Add-on</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>Tambah Add-on</Typography>
            <ChevronRightIcon sx={{ color: 'grey.400', fontSize: 20 }} />
          </Box>
        </Box>

        {/* Pesanan */}
        <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>Pesanan</Typography>

          <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
            <CalendarTodayIcon sx={{ mt: 0.5, mr: 1, color: 'grey.500', fontSize: 18 }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.875rem', mr: 1 }}>
                  28 Februari - 23 Februari 2026
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'primary.main' }}>Ubah</Typography>
              </Box>
            </Box>
          </Box>

          <Typography sx={{ fontWeight: 'medium' }}>Pocket Single A - F</Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'grey.600', mb: 1 }}>
            1 Orang • Wanita • 6.5m²
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Fasilitas unit <ChevronRightIcon sx={{ ml: 0.5, fontSize: 16 }} />
            </Typography>
          </Box>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}
          >
            <Typography>Rukita Toska Binus Kemanggisan</Typography>
            <ChevronRightIcon sx={{ color: 'grey.400', fontSize: 20 }} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ color: 'grey.500', textDecoration: 'line-through' }}>
            Rp2.600.000
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Box
              sx={{
                backgroundColor: 'error.main',
                color: 'white',
                fontSize: '0.75rem',
                px: 1,
                borderRadius: 1,
                mr: 1,
              }}
            >
              12%
            </Box>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
              Rp2.275.000 /bulan
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'success.main',
                mr: 1,
              }}
            />
            <Typography sx={{ color: 'success.main', fontSize: '0.875rem' }}>
              Hemat Rp325k/bln untuk 12 bulan pertama
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
