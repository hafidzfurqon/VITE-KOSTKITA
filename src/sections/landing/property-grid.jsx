import { Box, Typography } from '@mui/material';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

export default function PropertyGrid() {
  const router = useRouter();

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 3,
      mt: 4, mb: 4
    }}>
     {[1, 2, 3, 4].map((item) => (
  <Link key={item} to={paths.property.details(item)} style={{ textDecoration: 'none' }}>
    <Box sx={{
      backgroundColor: 'white',
      borderRadius: 1,
      overflow: 'hidden',
      boxShadow: 1,
      '&:hover': { boxShadow: 3 }
    }}>
      <Box sx={{
        position: 'relative',
        height: { xs: 150, sm: 200 },
        backgroundColor: 'grey.300'
      }}>
        <Box sx={{
          position: 'absolute',
          bottom: 8, left: 8,
          backgroundColor: '#FFD700', color: 'black',
          px: 1, py: 0.5, borderRadius: 0.5
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
  </Link>
))}

    </Box>
  );
}
