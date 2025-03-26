import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Rating,
  Box,
  Stack,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  useFetchReview,
  useMutationCreateReview,
  useMutationDeleteReview,
  useMutationEditReview,
} from 'src/hooks/users/review';

export default function Review({ propertyId }) {
  const { data, isLoading } = useFetchReview(propertyId);
  const reviews = data;
  // console.log(reviews);

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, text: '' });
  const [loading, setLoading] = useState(false);

  const mutationCreate = useMutationCreateReview({
    onSuccess: () => {
      enqueueSnackbar('Ulasan berhasil ditambahkan', { variant: 'success' });
      handleClose();
    },
    onError: () => enqueueSnackbar('Gagal menambahkan ulasan', { variant: 'error' }),
  });

  const mutationDelete = useMutationDeleteReview({
    onSuccess: () => enqueueSnackbar('Ulasan berhasil dihapus', { variant: 'success' }),
    onError: () => enqueueSnackbar('Gagal menghapus ulasan', { variant: 'error' }),
  });

  const mutationEdit = useMutationEditReview({
    onSuccess: () => {
      enqueueSnackbar('Ulasan berhasil diperbarui', { variant: 'success' });
      handleClose();
    },
    onError: () => enqueueSnackbar('Gagal memperbarui ulasan', { variant: 'error' }),
  });

  const handleOpen = (review = null) => {
    setEditData(review);
    setNewReview(review ? { rating: review.rating, text: review.text } : { rating: 0, text: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
    setNewReview({ rating: 0, text: '' });
    setLoading(false);
  };

  const handleSubmit = () => {
    if (loading) return;
    if (newReview.rating < 1 || newReview.rating > 5) {
      enqueueSnackbar('Rating harus antara 1 dan 5', { variant: 'error' });
      return;
    }
    if (!newReview.text.trim()) {
      enqueueSnackbar('Ulasan tidak boleh kosong', { variant: 'error' });
      return;
    }
    setLoading(true);
    if (editData) {
      mutationEdit.mutate({
        id: editData.id,
        property_id: propertyId,
        rating: newReview.rating,
        text: newReview.text,
      });
    } else {
      mutationCreate.mutate({
        property_id: propertyId,
        rating: newReview.rating,
        review: newReview.text.trim(), // Ganti "text" menjadi "review" sesuai error yang diterima
      });
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const averageRating =
    Array.isArray(reviews) && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h4" fontWeight="bold">
              {averageRating.toFixed(1)}
            </Typography>
            <Rating value={averageRating} precision={0.1} readOnly />
          </Box>
          <Typography color="textSecondary">{reviews?.length} ulasan</Typography>
        </Box>

        <Button variant="outlined" onClick={() => handleOpen()}>
          Tulis ulasan
        </Button>
      </Box>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {reviews?.map((review) => (
          <Card key={review.id} variant="outlined">
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={review.user.photo_profile_url || '/default-avatar.png'} />
                <Box>
                  {/* <Typography fontWeight="bold">{review.user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {review.user.email}
                  </Typography> */}
                  <Rating value={parseFloat(review.rating)} precision={0.1} readOnly />
                  <Typography>{review.review}</Typography>
                </Box>
              </Box>
              <Box>
                <IconButton onClick={() => handleOpen(review)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => mutationDelete.mutate({ id: review.id, property_id: propertyId })}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editData ? 'Edit Ulasan' : 'Tulis Ulasan'}</DialogTitle>
        <DialogContent>
          <Rating
            value={newReview.rating || 0}
            precision={0.1}
            onChange={(e, value) => setNewReview((prev) => ({ ...prev, rating: value || 0 }))}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ulasan"
            value={newReview.text}
            onChange={(e) => setNewReview((prev) => ({ ...prev, text: e.target.value }))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Mengirim...' : editData ? 'Perbarui' : 'Kirim'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
