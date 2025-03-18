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
  useMediaQuery,
} from '@mui/material';
import { Bookmark } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useFetchWishlist } from 'src/hooks/users/useFetchWishlist';

export default function WishlistPageView() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data } = useFetchWishlist(); // Mengambil data dari API
  const wishlist = data?.wishlist || []; // Pastikan tidak error jika data belum ada

  const handleRemoveClick = (item) => {
    setSelectedItem(item);
    setConfirmOpen(true);
  };

  const handleConfirmRemove = async () => {
    try {
      // Panggil API untuk menghapus item dari wishlist (jika ada endpoint)
      // await removeWishlistItem(selectedItem.id);

      // Menutup dialog
      setConfirmOpen(false);
      setSelectedItem(null);

      // Bisa ditambahkan refetch atau state update jika data harus diperbarui
    } catch (error) {
      console.error('Gagal menghapus item:', error);
    }
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
        {wishlist?.property?.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
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
