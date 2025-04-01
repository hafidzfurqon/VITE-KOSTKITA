import { LoadingButton } from '@mui/lab';
import { MenuItem, Container, TextField, Typography, Grid, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutationTransaction } from 'src/hooks/transaction';

export default function TransactionView() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const dataForm = [
    { label: 'Nama Lengkap', name: 'fullname', inputmode: 'text', type: 'text' },
    { label: 'Nomor Telepon', name: 'phone_number', inputmode: 'numeric', type: 'text' },
    { label: 'Email', name: 'email', inputmode: 'email', type: 'email' },
    { label: 'Nomor Ktp', name: 'nomor_ktp', inputmode: 'text', type: 'text' },
    { label: 'NIK (Nomor Induk Kependudukan)', name: 'nik', inputmode: 'numeric', type: 'text' },
  ];

  const genders = [
    { label: 'Laki-laki', value: 'male' },
    { label: 'Perempuan', value: 'female' },
  ];

  const { mutate, isPending } = useMutationTransaction({
    onSuccess: () => {
      enqueueSnackbar('Transaksi berhasil', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Transaksi Gagal', { variant: 'error' });
    },
  });

  const OnSubmitData = (data) => {
    setLoading(true);
    console.log(data);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Container sx={{ mb: 5 }}>
      <Typography variant="h3" textAlign="center">
        Tambah Data Transaksi
      </Typography>
      <Box
        component="form"
        sx={{ pt: 2, px: 3, borderRadius: 2 }}
        onSubmit={handleSubmit(OnSubmitData)}
      >
        <Typography variant="h6" mb={3} px={1} mt={2}>
          Data Penghuni
        </Typography>

        <Grid container spacing={2}>
          {dataForm.map((data, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <TextField
                label={data.label}
                fullWidth
                inputMode={data.inputmode}
                name={data.name}
                // type={data.type}
                {...register(data.name)}
              />
            </Grid>
          ))}

          {/* Input untuk Gender */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tanggal Lahir"
              fullWidth
              type="date"
              name="date_of_birth"
              defaultValue=""
              InputLabelProps={{ shrink: true }}
              {...register('date_of_birth')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Jenis Kelamin"
              fullWidth
              select
              name="gender"
              defaultValue=""
              {...register('gender')}
            >
              {genders.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="inherit"
          loading={isPending}
          sx={{ mt: 3, py: '12px' }}
        >
          Kirim
        </LoadingButton>
      </Box>
    </Container>
  );
}
