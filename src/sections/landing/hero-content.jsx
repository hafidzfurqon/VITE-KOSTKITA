import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useListProperty, useSearchProperty } from 'src/hooks/property/public/useListProperty';
import { paths } from 'src/routes/paths';
import FilterModal from 'src/component/FilterModal';

export default function HeroContent({ onFilterChange }) {
  const { data: properties, isLoading: propertiesLoading } = useListProperty();
  const [searchValues, setSearchValues] = useState({
    query: '',
    date: '',
    type: '',
  });
  const debouncedQuery = useDebounce(searchValues.query);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);

  // Initialize filters object
  const [filters, setFilters] = useState({
    gender: [],
    category: '',
    tipeHunian: [],
    jumlahOrang: [],
    priceRange: [0, 10000000],
    colors: [],
    rating: '',
  });

  // Handle all filter changes from FilterModal
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    onFilterChange({ ...searchValues, ...newFilters }); // Send all filters to parent
  };

  const handleResetFilters = () => {
    const resetFilters = {
      gender: [],
      category: '',
      tipeHunian: [],
      jumlahOrang: [],
      priceRange: [0, 10000000],
      colors: [],
      rating: '',
    };
    setFilters(resetFilters);
    onFilterChange({ ...searchValues, ...resetFilters }); // Update parent with reset filters
  };

  // Extract options from property data
  const categoryOptions = useMemo(() => {
    if (!properties || properties.length === 0) return ['all'];
    const all = properties.map((p) => p?.payment_type).filter(Boolean);
    return ['all', ...Array.from(new Set(all))];
  }, [properties]);

  const tipeHunianOptions = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    return Array.from(new Set(properties.map((p) => p?.type?.name).filter(Boolean)));
  }, [properties]);

  const jumlahOrangOptions = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    const capacities = properties.flatMap((p) => p.rooms?.map((r) => r?.capacity).filter(Boolean));
    return Array.from(new Set(capacities));
  }, [properties]);

  const ratingOptions = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    const ratings = properties.flatMap((p) =>
      p.rooms?.map((r) => r?.average_rating).filter(Boolean)
    );
    return Array.from(new Set(ratings));
  }, [properties]);

  // Update parent component with search values changes
  useEffect(() => {
    onFilterChange({ ...searchValues, ...filters });
  }, [searchValues, onFilterChange]);

  const handleChange = (field, value) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isMobile = useResponsive('down', 'sm');

  const { searchResults, searchLoading } = useSearchProperty({
    name: debouncedQuery,
    location: debouncedQuery,
    address: debouncedQuery,
  });

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

        <Button
          onClick={handleOpenFilterModal}
          variant="contained"
          sx={{
            bgcolor: '#FFD700',
            color: 'black',
            p: 2,
            minWidth: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            '&:hover': { bgcolor: '#FFC107' },
          }}
        >
          <SearchIcon />
          {!isMobile && 'Filter'}
        </Button>

        <FilterModal
          open={isFilterModalOpen}
          onClose={handleCloseFilterModal}
          onOpen={handleOpenFilterModal}
          filters={filters}
          onFilters={handleApplyFilters}
          canReset={Object.values(filters).some((val) =>
            Array.isArray(val)
              ? val.length > 0
              : val !== '' && JSON.stringify(val) !== JSON.stringify([0, 10000000])
          )}
          onResetFilters={handleResetFilters}
          genderOptions={[
            { value: 'male', label: 'Pria' },
            { value: 'female', label: 'Wanita' },
          ]}
          colorOptions={['red', 'blue', 'green', 'yellow']}
          ratingOptions={ratingOptions}
          categoryOptions={categoryOptions}
          tipeHunianOptions={tipeHunianOptions}
          jumlahOrangOptions={jumlahOrangOptions}
        />
      </Box>
    </Box>
  );
}
