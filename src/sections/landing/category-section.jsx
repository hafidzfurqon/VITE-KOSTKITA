import { useCallback, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { PostSort } from '../blog/post-sort';

export default function CategorySection() {
  // State untuk menyimpan kategori yang dipilih
  const [selectedCategory, setSelectedCategory] = useState('kost');
const [sortBy, setSortBy] = useState('latest');

  const handleSort = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);

  // Data kategori berdasarkan pilihan
  const categories = {
    kost: ['Populer', 'Terbaru', 'Bandung', 'Surabaya', 'Dekat MRT', 'Dekat KRL', 'Dekat LRT', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Utara', 'Depok', 'Bekasi', 'Tangsel', 'Cikarang'],
    apartemen: ['Jakarta Selatan', 'Jakarta Barat', 'Jakarta Utara', 'Depok', 'Bekasi', 'Tangsel', 'Cikarang'],
  };

  return (
    <>
      {/* Pilihan Kost Coliving dan Apartemen */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 10, flexWrap: 'wrap', }}>
        <Typography sx={{ fontSize : {xs : '12px', md: '28px'}, fontWeight : 'bold'}}>Property terbaru dari kami</Typography>
         <PostSort
                  sortBy={sortBy}
                  onSort={handleSort}
                  options={[
                    { value: 'latest', label: 'Kost Coliving' },
                    { value: 'oldest', label: 'Apartement' },
                  ]}
                />
      </Box>

      {/* Container kategori dengan scroll horizontal */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          // overflow: 'hidden',
          whiteSpace: 'nowrap',
          gap: 7,
          pb: 1, // Agar scrollbar tidak menutupi konten
          '&::-webkit-scrollbar': {
            display: 'none' // Sembunyikan scrollbar
          }
        }}
        onWheel={(e) => {
          const container = e.currentTarget;
          container.scrollLeft += e.deltaY;
        }}
      >
        {categories[selectedCategory].map((category) => (
          <Box key={category} sx={{ textAlign: 'center', flex: '0 0 auto' }}>
            <IconButton
              sx={{
                backgroundColor: '#FFD700',
                width: 48,
                height: 48,
                mb: 1,
                '&:hover': { backgroundColor: '#FFC700' }
              }}
            >
              <HomeIcon sx={{ color: 'black' }} />
            </IconButton>
            <Typography variant="caption" display="block" sx={{ color: 'black' }}>
              {category}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
}
