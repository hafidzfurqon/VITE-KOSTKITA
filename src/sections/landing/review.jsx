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
import { useQueryClient } from '@tanstack/react-query';
import Loading from 'src/components/loading/loading';
// import { useAuth } from 'src/hooks/useAuth'; // Tambahkan auth context
import { useAppContext } from 'src/context/user-context';

export default function Review({ propertyId }) {
  // console.log('propertyId:', propertyId); // Debugging log
  const { data, isLoading } = useFetchReview(propertyId);
  const reviews = data;
  // console.log(reviews);
  const queryClient = useQueryClient();
  // const { UserContextValue: authUser } = useAppContext();
  const { UserContextValue } = useAppContext();
  const user = UserContextValue?.user;

  // console.log('Auth User Context:', authUser);
  // console.log('User:', user);
  // console.log('Logged-in user ID:', user?.id);
  // console.log('Review user ID:', reviews.user_id);

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, text: '' });
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const mutationCreate = useMutationCreateReview({
    onSuccess: () => {
      enqueueSnackbar('Ulasan berhasil ditambahkan', { variant: 'success' });
      handleClose();
      queryClient.invalidateQueries({ queryKey: ['public.review'] });
    },
    onError: (error) => {
      let errorMessage = 'Gagal menambahkan ulasan';

      if (error.response?.data?.errors) {
        const apiError = error.response.data.errors;

        if (apiError === 'You must book the property before leaving a review.') {
          errorMessage = 'Anda harus memesan properti sebelum memberikan ulasan.';
        } else if (
          apiError ===
          'You have already given a review and ra ting for this property. If you want to update it, please use the update review and rating endpoint.'
        ) {
          errorMessage =
            'Anda sudah memberikan ulasan dan penilaian untuk properti ini. Jika ingin memperbarui, gunakan fitur edit ulasan.';
        }
      }

      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const { mutate: mutationDelete, isPending } = useMutationDeleteReview({
    onSuccess: () => {
      enqueueSnackbar('Ulasan berhasil dihapus', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['public.review'] });
    },
    onError: (error) => {
      let errorMessage = 'Gagal menghapus ulasan';

      if (error.response?.data?.errors) {
        const apiError = error.response.data.errors;

        if (apiError === 'Review not found.') {
          errorMessage = 'Ulasan tidak ditemukan.';
        } else if (apiError === 'You are not authorized to delete this review.') {
          errorMessage = 'Anda tidak memiliki izin untuk menghapus ulasan ini.';
        }
      }

      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const mutationEdit = useMutationEditReview({
    onSuccess: () => {
      enqueueSnackbar('Ulasan berhasil diperbarui', { variant: 'success' });
      handleClose();
      queryClient.invalidateQueries({ queryKey: ['public.review'] });
    },
    onError: (error) => {
      let errorMessage = 'Gagal memperbarui ulasan';

      if (error.response?.data?.errors) {
        const apiError = error.response.data.errors;

        if (apiError === 'Review not found.') {
          errorMessage = 'Ulasan tidak ditemukan.';
        }
      }

      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
    setNewReview({ rating: 0, text: '' });
    setLoading(false);
  };

  const handleOpen = (review = null) => {
    setEditData(review);
    setNewReview({
      rating: review?.rating ?? 0, // Pastikan rating terisi dengan nilai default
      text: review?.review ?? '', // Pastikan review terisi dengan nilai default
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (loading) return;

    // Validasi rating dan review sebelum dikirim
    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      enqueueSnackbar('Rating harus di isi antara 1 dan 5', { variant: 'error' });
      return;
    }

    if (!newReview.text.trim()) {
      enqueueSnackbar('Ulasan tidak boleh kosong', { variant: 'error' });
      return;
    }

    setLoading(true);

    const reviewData = {
      property_id: propertyId,
      rating: newReview.rating,
      review: newReview.text.trim(), // Pastikan key-nya sesuai dengan yang diharapkan API
    };

    if (editData) {
      if (editData.user_id !== user?.id) {
        enqueueSnackbar('Anda tidak memiliki izin untuk mengedit ulasan ini', { variant: 'error' });
        setLoading(false);
        return;
      }

      mutationEdit.mutate(
        { id: editData.id, ...reviewData },
        {
          onSuccess: () => {
            enqueueSnackbar('Ulasan berhasil diperbarui', { variant: 'success' });
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['public.review'] });
          },
          onError: (error) => {
            enqueueSnackbar('Gagal memperbarui ulasan', { variant: 'error' });
            setLoading(false);
          },
        }
      );
    } else {
      mutationCreate.mutate(reviewData, {
        onSuccess: () => {
          enqueueSnackbar('Ulasan berhasil ditambahkan', { variant: 'success' });
          handleClose();
        },
        onError: (error) => {
          enqueueSnackbar('Gagal menambahkan ulasan', { variant: 'error' });
          setLoading(false);
        },
      });
    }
  };

  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      mutationDelete(deleteId);
    }
    setConfirmOpen(false);
    setDeleteId(null);
  };

  if (isLoading) {
    return <Loading />;
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

        {user ? (
          <Button variant="outlined" onClick={() => handleOpen()}>
            Tulis ulasan
          </Button>
        ) : (
          <Typography color="textSecondary">
            <i>Login untuk memberikan ulasan</i>
          </Typography>
        )}
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
                <Avatar src={review.user?.photo_profile_url || '/default-avatar.png'} />
                <Box>
                  <Typography fontWeight="bold">{review.user?.name}</Typography>
                  {/* <Rating value={parseFloat(review.rating)} precision={0.1} readOnly /> */}
                  <Typography>{review.review}</Typography>
                </Box>
              </Box>
              {user?.id === review?.user?.id ? (
                <Box>
                  <IconButton onClick={() => handleOpen(review)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenConfirm(review.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Typography color="textSecondary" fontSize="0.875rem">
                  {/* Anda tidak dapat mengedit atau menghapus ulasan ini */}
                </Typography>
              )}
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
          <Button onClick={handleSubmit} variant="contained" disabled={mutationCreate.isPending}>
            {mutationCreate.isPending ? 'Mengirim...' : editData ? 'Perbarui' : 'Kirim'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>Apakah Anda yakin ingin menghapus ulasan ini?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Batal</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
