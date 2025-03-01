// { value: 'kost&colving', label: 'Kost Coliving' },
// { value: 'apartment', label: 'Apartement' },

import { useCallback, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { PostSort } from '../blog/post-sort';

export default function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState('kost');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Populer'); // Default ke "Populer"
  const [sortBy, setSortBy] = useState('coliving');

  const handleSort = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);

  const categories = {
    kost: [
      { name: 'Populer', icon: <ThumbUpIcon sx={{ color: 'black' }} /> },
      { name: 'Terbaru', icon: <AutoAwesomeIcon sx={{ color: 'black' }} /> },
      { name: 'Bogor', icon: <LocationCityIcon sx={{ color: 'black' }} /> },
    ],
    apartemen: [
      { name: 'Bogor', icon: <LocationCityIcon sx={{ color: 'black' }} /> },
    ],
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          mb: { xs: 5, md: 10 },
          flexWrap: 'wrap',
          alignItems: { xs: 'left', md: 'center' },
          gap: 3,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          Property terbaru dari kami
        </Typography>
        <PostSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: 'coliving', label: 'Kost Coliving' },
            { value: 'apartment', label: 'Apartement' },
          ]}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          gap: 7,
          pb: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
        onWheel={(e) => {
          const container = e.currentTarget;
          container.scrollLeft += e.deltaY;
        }}
      >
        {categories[selectedCategory].map((category) => (
          <Box
            key={category.name}
            sx={{ textAlign: 'center', flex: '0 0 auto', cursor: 'pointer', }}
            onClick={() => setSelectedSubCategory(category.name)}
          >
            <IconButton
              sx={{
                backgroundColor: '#FFD700',
                width: 48,
                height: 48,
                mb: 1,
                '&:hover': { backgroundColor: '#FFC700' },
              }}
            >
              {category.icon} 
            </IconButton>
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: 'black',
                fontWeight: selectedSubCategory === category.name ? 'bold' : 'normal',
                borderBottom: selectedSubCategory === category.name ? '3px solid black' : 'none',
                // display: 'inline-block',
                paddingBottom: 1,
              }}
            >
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
}

