import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Box,
  Container,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
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
  console.log(defaultValues);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const { mutate, isPending } = userBooking({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.property'] });
      enqueueSnackbar('Properti berhasil dibooking', { variant: 'success' });
      reset();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.errors;
      if (errorMessage) {
        if (errorMessage.includes('You already have booking for this property')) {
          enqueueSnackbar('Anda sudah membooking properti ini', { variant: 'warning' });
        } else {
          enqueueSnackbar(errorMessage, { variant: 'error' });
        }
      } else {
        enqueueSnackbar(error.message || 'Terjadi kesalahan', { variant: 'error' });
      }
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      property_id: defaultValues?.id,
      room_id: defaultValues.rooms?.length ? defaultValues.rooms[0].id : null,
      property_discount_id: defaultValues.rooms?.length
        ? undefined
        : defaultValues.property_discount_id,
      property_room_discount_id: defaultValues.rooms?.length
        ? defaultValues.property_room_discount_id
        : null,
      promo_id: defaultValues.promo_id !== null ? defaultValues.promo_id : undefined,
    };

    // Hapus jika ada rooms, agar tidak mengirim property_discount_id
    if (defaultValues.rooms?.length) {
      delete payload.property_discount_id;
    }

    // Hapus promo_id jika tidak ada
    if (defaultValues.promo_id === null) {
      delete payload.promo_id;
    }

    console.log('Payload sebelum submit:', payload); // Debugging
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
    <Container maxWidth="sm">
      <CustomBreadcrumbs
        links={[
          {
            name: <span dangerouslySetInnerHTML={{ __html: defaultValues?.slug }} />,
            href: `/property/${slug}`,
          },
          { name: 'Booking', href: '' },
        ]}
        sx={{ mb: 3 }}
      />
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Booking Properti {defaultValues.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Silakan isi data berikut untuk melanjutkan pemesanan properti ini.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Jumlah Tamu"
                  {...register('number_of_guests', { required: 'Jumlah tamu wajib diisi', min: 1 })}
                  error={!!errors.number_of_guests}
                  helperText={errors.number_of_guests?.message}
                />
              </Grid>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
        </CardContent>
      </Card>
    </Container>
  );
}
