import { Box, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function CategorySection() {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#FFD700' }}>
          <HomeIcon sx={{ mr: 1 }} />
          <Typography>Kost Coliving</Typography>
        </Box>
        <Typography sx={{ color: 'black' }}>Apartemen</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 2 }}>
        {['Populer', 'Terbaru', 'Bandung', 'Surabaya', 'Dekat MRT', 'Dekat KRL', 'Dekat LRT', 'Tomang', 'BSD City', 'UPH Karawaci', 'Mewah'].map((category) => (
          <Box key={category} sx={{ textAlign: 'center' }}>
            <IconButton sx={{ 
              backgroundColor: '#FFD700',
              width: 48,
              height: 48,
              mb: 1,
              '&:hover': {
                backgroundColor: '#FFC700',
              }
            }}>
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