import { Box, Typography } from '@mui/material';

export default function PropertyGrid() {
  return (
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
  );
}