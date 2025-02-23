import { TextField, Button, Grid, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { userBooking } from 'src/hooks/users/userBooking';

export default function BookingView({ defaultValues }) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const { mutate, isPending } = userBooking({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.property'] });
      enqueueSnackbar('Properti berhasil booking', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Terjadi kesalahan', { variant: 'error' });
    },
  });

  const onSubmit = (data) => {
    mutate({ ...data, property_id: defaultValues?.id });
  console.log(data)

  };


  return (
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
  );
}
