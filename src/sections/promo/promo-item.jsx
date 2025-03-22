import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const PromoItem = ({ post }) => {
  return (
    <Link to={`/promo/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        sx={{
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: 3,
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: 5 },
        }}
      >
        <img
          src={post.promo_image_url}
          alt="Promo"
          style={{ width: '100%', height: '220px', objectFit: 'cover' }}
        />
      </Box>
      <Typography sx={{py : 3}} variant='h6'>{post.name}</Typography>
    </Link>
  );
};

export default PromoItem;
