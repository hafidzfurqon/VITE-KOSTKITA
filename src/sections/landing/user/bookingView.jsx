import { TextField, Button, Grid, CircularProgress, Box, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { userBooking } from 'src/hooks/users/userBooking';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router-dom';
import { useFetchPropertySlug } from 'src/hooks/property/public/usePropertyDetail';
import { Alert } from '@mui/material';

export default function BookingView() {
  const { slug } = useParams();
  const { data: defaultValues, isLoading, isFetching, error } = useFetchPropertySlug(slug);
  const { enqueueSnackbar } = useSnackbar();
  console.log(defaultValues);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const { mutate, isPending } = userBooking({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.property'] });
      enqueueSnackbar('Properti berhasil dibooking', { variant: 'success' });
    },
    onError: (error) => {
      // Cek apakah error dari API mengandung pesan tertentu
      if (error?.response?.data?.message) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes('sudah dibooking')) {
          enqueueSnackbar('Properti ini sudah dibooking. Silakan pilih properti lain.', {
            variant: 'warning',
          });
        } else {
          enqueueSnackbar(errorMessage, { variant: 'error' });
        }
      } else {
        enqueueSnackbar(error.message || 'Terjadi kesalahan', { variant: 'error' });
      }
    },
  });

  const onSubmit = (data) => {
    // Menyiapkan payload dengan field wajib dan nullable
    const payload = {
      ...data,
      property_id: defaultValues?.id, // Wajib
      room_id: defaultValues.room_id ?? null, // Nullable
      property_discount_id: defaultValues.property_discount_id ?? null, // Nullable
      property_room_discount_id: defaultValues.property_room_discount_id ?? null, // Nullable
      promo_id: defaultValues.promo_id ?? null, // Nullable
    };

    console.log('Payload yang dikirim:', payload); // Debugging
    mutate(payload);
  };

  if (isLoading || isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Error loading property details. Please try again later.</Alert>
      </Container>
    );
  }

  if (!defaultValues) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No property details found.</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'grid', width: '100%' }}>
        <CustomBreadcrumbs
          links={[
            {
              name: <span dangerouslySetInnerHTML={{ __html: defaultValues?.slug }} />,
              href: `/property/${slug}`,
            },
            { name: 'Booking', href: '' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Jumlah Tamu"
              type="number"
              {...register('number_of_guests', { required: 'Jumlah tamu wajib diisi', min: 1 })}
              error={!!errors.number_of_guests}
              helperText={errors.number_of_guests?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Check-in"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('check_in', { required: 'Tanggal check-in wajib diisi' })}
              error={!!errors.check_in}
              helperText={errors.check_in?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Check-out"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('check_out', { required: 'Tanggal check-out wajib diisi' })}
              error={!!errors.check_out}
              helperText={errors.check_out?.message}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isPending}
          sx={{ mt: 3 }}
        >
          {isPending ? <CircularProgress size={24} /> : 'Booking Sekarang'}
        </Button>
      </form>
    </Container>
  );
}
