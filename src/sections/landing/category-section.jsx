import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function CategorySection() {
  // State untuk menyimpan kategori yang dipilih
  const [selectedCategory, setSelectedCategory] = useState('kost');

  // Data kategori berdasarkan pilihan
  const categories = {
    kost: ['Populer', 'Terbaru', 'Bandung', 'Surabaya', 'Dekat MRT', 'Dekat KRL', 'Dekat LRT', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Utara', 'Depok', 'Bekasi', 'Tangsel', 'Cikarang'],
    apartemen: ['Jakarta Selatan', 'Jakarta Barat', 'Jakarta Utara', 'Depok', 'Bekasi', 'Tangsel', 'Cikarang'],
  };

  return (
    <>
      {/* Pilihan Kost Coliving dan Apartemen */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: selectedCategory === 'kost' ? '#FFD700' : 'gray',
            cursor: 'pointer',
            mb: { xs: 2, md: 0 }
          }}
          onClick={() => setSelectedCategory('kost')}
        >
          <HomeIcon sx={{ mr: 1 }} />
          <Typography>Kost Coliving</Typography>
        </Box>

        <Typography
          sx={{
            color: selectedCategory === 'apartemen' ? '#FFD700' : 'gray',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedCategory('apartemen')}
        >
          Apartemen
        </Typography>
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
