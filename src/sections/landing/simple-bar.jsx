import { Box,Typography,IconButton, } from '@mui/material';
import 'simplebar-react/dist/simplebar.min.css';
import HomeIcon from '@mui/icons-material/Home';

export default function SimpleBar() {
  return (
    <SimpleBar style={{ maxHeight: 'calc(100vh - 500px)' }}>
    {/* Categories Section */}
    <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4, px: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#FFD700' }}> {/* Yellow text */}
          <HomeIcon sx={{ mr: 1 }} />
          <Typography>Kost Coliving</Typography>
        </Box>
        <Typography sx={{ color: 'black' }}>Apartemen</Typography>
      </Box>

      {/* Category Icons */}
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

      {/* Property Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 3,
        mt: 4,
        mb: 4
      }}>
        {[1, 2, 3, 4].map((item) => (
          <Box key={item} sx={{ 
            backgroundColor: 'white',
            borderRadius: 1,
            overflow: 'hidden',
            boxShadow: 1,
            '&:hover': {
              boxShadow: 3,
            }
          }}>
            <Box sx={{ 
              position: 'relative',
              height: 200,
              backgroundColor: 'grey.300'
            }}>
              <Box sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                backgroundColor: '#FFD700',
                color: 'black',
                px: 1,
                py: 0.5,
                borderRadius: 0.5
              }}>
                Video
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 500, mb: 1, color: 'black' }}>Property Title</Typography>
              <Typography variant="body2" sx={{ color: 'black' }}>
                Location details
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </SimpleBar>
  )
}
