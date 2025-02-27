import { useState } from 'react';
import {
  Box,
  Typography,
  InputBase,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CustomDatePicker from 'src/components/calender/custom-datepicker';
import { useResponsive } from 'src/hooks/use-responsive';

export default function HeroContent({ setSearchParams }) {
  const [searchValues, setSearchValues] = useState({
    query: '',
    date: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);
  const isMobile = useResponsive('down', 'sm');

  const handleChange = (field, value) => {
    setSearchValues((prev) => ({ ...prev, [field]: value }));

    if (Object.values({ ...searchValues, [field]: value }).every((val) => val === '')) {
      setSearchParams({});
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const hasFilter = Object.values(searchValues).some((val) => val !== '');
      setSearchParams(hasFilter ? searchValues : {});
      setLoading(false);
    }, 1000);
  };

  return (
    <Box sx={{ position: 'relative', pt: 8, px: 4, color: 'white' }}>
      <Box sx={{ mt: { xs: 10, md: 20 }, mb: { xs: 2, md: 4 } }}>
        <Typography variant="h3" sx={{ mb: 2, color: '#FFD700', fontWeight: 'bold' }}>
          Kost, Coliving, Apartemen
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Sewa hunian impian untuk setiap fase kehidupan
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          maxWidth: '1000px',
          mx: 'auto',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          display: 'grid',
          // gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr auto' },
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr auto' },
          gap: 2,
          p: 2,
        }}
      >
        {/* Pencarian Lokasi atau Nama Properti */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            minWidth: '200px',
          }}
        >
          <LocationOnIcon sx={{ color: '#FFD700', mr: 1 }} />
          <InputBase
            placeholder="Cari lokasi atau nama properti..."
            fullWidth
            value={searchValues.query}
            onChange={(e) => handleChange('query', e.target.value)}
            sx={{ borderBottom: '1px solid #ddd' }}
          />
        </Box>

        {/* Tanggal */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, minWidth: '200px' }}>
          <CustomDatePicker
            selectedDate={searchValues.date}
            onDateChange={(newDate) => handleChange('date', newDate)}
          />
        </Box>

        {/* Tipe Properti */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, minWidth: '200px' }}>
          <FormControl fullWidth>
            <InputLabel shrink>Tipe Properti</InputLabel>
            <Select
              value={searchValues.type}
              onChange={(e) => handleChange('type', e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">Semua Tipe</MenuItem>
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="Coliving">Coliving</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tombol Cari */}
        <Button
          onClick={handleSearch}
          variant="contained"
          sx={{
            bgcolor: '#FFD700',
            color: 'black',
            p: 2,
            width: { xs: '100%', sm: 'auto', md: '180px' },
            minWidth: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            flexGrow: 0,
            alignSelf: 'center',
            '&:hover': { bgcolor: '#FFC107' },
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'black' }} />
          ) : (
            <>
              <SearchIcon />
              {!isMobile && 'Cari hunian'}
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
}
