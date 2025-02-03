import { Box, Typography, InputBase, Select, MenuItem, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function HeroContent() {
  return (
    <Box sx={{ position: 'relative', pt: 8, px: 4, color: 'white', }}>
      <Typography variant="h3" component="h1" sx={{ mb: 2, color: '#FFD700' }}>
        Kost, Coliving, Apartemen
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Sewa hunian impian untuk setiap fase kehidupan
      </Typography>

      {/* Search Bar */}
      <Box sx={{ 
        maxWidth: '1000px',
        mx: 'auto',
        backgroundColor: 'white',
        borderRadius: 1,
        display: 'flex',
        p: 1
      }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', px: 2, borderRight: 1, borderColor: 'grey.300' }}>
          <LocationOnIcon sx={{ color: '#FFD700' }} />
          <InputBase
            placeholder="Cari lokasi, nama gedung atau landmark..."
            fullWidth
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, borderRight: 1, borderColor: 'grey.300' }}>
          <CalendarTodayIcon sx={{ color: '#FFD700' }} />
          <InputBase
            placeholder="Pilih tanggal"
            sx={{ width: 150 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, borderRight: 1, borderColor: 'grey.300' }}>
          <HomeIcon sx={{ color: '#FFD700' }} />
          <Select
            value=""
            displayEmpty
            variant="standard"
            sx={{ width: 120 }}
          >
            <MenuItem value="">Semua tipe</MenuItem>
          </Select>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<SearchIcon />}
          sx={{ 
            ml: 2,
            backgroundColor: '#FFD700',
            color: 'black',
            '&:hover': {
              backgroundColor: '#FFC700',
            }
          }}
        >
          Cari Hunian
        </Button>
      </Box>
    </Box>
  );
}