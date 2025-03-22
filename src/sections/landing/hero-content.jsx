import { useCallback, useEffect, useState } from 'react';
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
import CustomDatePicker from 'src/components/calender/custom-datepicker';
import { useResponsive } from 'src/hooks/use-responsive';
import SearchProperty from './searchProperty';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSearchProperty } from 'src/hooks/property/public/useListProperty';
import { paths } from 'src/routes/paths';

export default function HeroContent({ data }) {
  const [searchValues, setSearchValues] = useState({
    query: '',
    date: '',
    type: '',
  });

  const isMobile = useResponsive('down', 'sm');
  const debouncedQuery = useDebounce(searchValues.query);

  const { searchResults, searchLoading } = useSearchProperty({
    name: debouncedQuery,
    location: debouncedQuery,
    address: debouncedQuery,
  });

  const handleChange = (field, value) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = useCallback(() => {
    if (!searchValues.query.trim() && !searchValues.date && !searchValues.type) return;
    console.log('Searching with:', searchValues);
  }, [searchValues]);

  useEffect(() => {
    handleSearch();
  }, [debouncedQuery]);

  return (
    <Box sx={{ position: 'relative', pt: 8, px: 4, color: 'white' }}>
      <Box sx={{ mt: { xs: 10, md: 20 }, mb: { xs: 2, md: 4 } }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Kost, Coliving,{' '}
          <Box component="span" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
            Apartemen
          </Box>
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
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr auto' },
          gap: 2,
          p: 2,
        }}
      >
        {/* Pencarian Lokasi atau Nama Properti */}

        <SearchProperty
          query={debouncedQuery}
          results={searchResults}
          onSearch={(value) => handleChange('query', value)}
          loading={searchLoading}
          hrefItem={(slug) => `/property/${slug}`}
        />

        {/* Tanggal */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', px: 2, minWidth: '200px' }}>
          <CustomDatePicker
            selectedDate={searchValues.date}
            onDateChange={(newDate) => handleChange('date', newDate)}
          />
        </Box> */}

        {/* Tipe Properti */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', px: 2, minWidth: '200px' }}>
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
        </Box> */}

        {/* Tombol Cari */}
        {/* <Button
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
        >
          <SearchIcon />
          {!isMobile && 'Cari hunian'}
        </Button> */}
      </Box>
    </Box>
  );
}
