import { Box, Typography, InputBase, Select, MenuItem, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function HeroContent() {
  return (
    <Box sx={{ position: 'relative', pt: 8, px: 4, color: 'white' }}>
      {/* Bagian Teks dengan Margin Responsif */}
      <Box sx={{ mt: { xs: 5, md: 10 }, mb: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, color: '#FFD700' }}>
          Kost, Coliving, Apartemen
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Sewa hunian impian untuk setiap fase kehidupan
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{
        maxWidth: '1000px',
        mx: 'auto',
        backgroundColor: 'white',
        borderRadius: 1,
        display: 'flex',
        flexWrap: 'wrap',
        p: 1,
        gap: 1,
      }}>
        {/* Input Lokasi */}
        <Box sx={{
          flex: 1, display: 'flex', alignItems: 'center', px: 2,
          borderRight: { xs: 'none', md: 1 }, borderColor: 'grey.300',
          width: { xs: '100%', md: 'auto' }
        }}>
          <LocationOnIcon sx={{ color: '#FFD700', mr: 1 }} />
          <InputBase placeholder="Cari lokasi, nama gedung atau landmark..." fullWidth />
        </Box>

        {/* Input Tanggal */}
        <Box sx={{
          display: 'flex', alignItems: 'center', px: 2,
          borderRight: { xs: 'none', md: 1 }, borderColor: 'grey.300',
          width: { xs: '100%', md: 'auto' }
        }}>
          <CalendarTodayIcon sx={{ color: '#FFD700', mr: 1 }} />
          <InputBase placeholder="Pilih tanggal" sx={{ flex: 1 }} />
        </Box>

        {/* Pilihan Tipe Hunian */}
        <Box sx={{
          display: 'flex', alignItems: 'center', px: 2,
          borderRight: { xs: 'none', md: 1 }, borderColor: 'grey.300',
          width: { xs: '100%', md: 'auto' }
        }}>
          <HomeIcon sx={{ color: '#FFD700', mr: 1 }} />
          <Select value="" displayEmpty variant="standard" sx={{ flex: 1 }}>
            <MenuItem value="">Semua tipe</MenuItem>
          </Select>
        </Box>

        {/* Tombol Cari */}
        <Button variant="contained" startIcon={<SearchIcon />} sx={{
          backgroundColor: '#FFD700', color: 'black',
          width: { xs: '100%', md: 'auto' },
          '&:hover': { backgroundColor: '#FFC700' }
        }}>
          Cari Hunian
        </Button>
      </Box>
    </Box>
  );
}
