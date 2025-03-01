import { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  useMediaQuery,
} from '@mui/material';
import { Bookmark } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const dummyWishlist = [
  {
    id: 1,
    title: 'V Hotel Lavender',
    category: 'Hotel',
    location: 'Lavender, Singapore',
    price: 'Rp 2.097.961',
    image: 'https://placehold.co/400',
  },
];

export default function WishlistPageView() {
  const [wishlist, setWishlist] = useState(dummyWishlist);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Jika layar <= 600px

  const handleRemoveClick = (item) => {
    setSelectedItem(item);
    setConfirmOpen(true);
  };

  const handleConfirmRemove = () => {
    setWishlist((prev) => prev.filter((item) => item.id !== selectedItem.id));
    setConfirmOpen(false);
    setSelectedItem(null);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Daftar Simpan
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Tempat untuk menyimpan wishlist Anda!
      </Typography>
      <Grid container spacing={3}>
        {wishlist.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row', // Jika layar kecil, ubah ke kolom
                alignItems: isMobile ? 'flex-start' : 'center',
                p: 2,
                boxShadow: 2,
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: isMobile ? '100%' : 120,
                  height: isMobile ? 200 : 120,
                  borderRadius: 2,
                  objectFit: 'cover',
                }}
                image={item.image}
                alt={item.title}
              />
              <CardContent sx={{ flex: 1, ml: isMobile ? 0 : 2, mt: isMobile ? 2 : 0 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  {item.category}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  📍 {item.location}
                </Typography>
                <Typography variant="h6" color="error" fontWeight="bold">
                  {item.price}{' '}
                  <Typography variant="body2" component="span">
                    (1 tamu, 1 kamar, 1 malam)
                  </Typography>
                </Typography>
              </CardContent>
              <IconButton
                onClick={() => handleRemoveClick(item)}
                sx={{ alignSelf: isMobile ? 'end' : 'center' }}
              >
                <Bookmark color="primary" />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Confirm Remove Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Hapus dari Wishlist?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Batal</Button>
          <Button onClick={handleConfirmRemove} color="error" variant="contained">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
