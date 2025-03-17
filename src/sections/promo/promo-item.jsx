import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const PromoItem = ({ post }) => {
  return (
    <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        sx={{
          width: '100%', // Pastikan semua item mengambil lebar penuh container parent
        }}
      >
        <img
          src={post.promo_image_url}
          alt={post.name}
          style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {post.name}
        </Typography>
      </Box>
    </Link>
  );
};

export default PromoItem;
