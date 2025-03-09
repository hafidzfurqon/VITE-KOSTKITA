import { MenuItem, Stack, Typography, Box, Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Container } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { useNavigate, Link, useRoutes } from 'react-router-dom';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useMutationCreateService } from 'src/hooks/services';
import { useRouter } from 'src/routes/hooks';

export const LayananCreate = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate, isPending } = useMutationCreateService({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.service'] });
      router.push('/services');
      enqueueSnackbar('Layanan Berhasil Ditambah', { variant: 'success' });
    },
    onError: (err) => {
      enqueueSnackbar('No Telepon Wajib Diisi', { variant: 'error' });
    },
  });
  const cleanPrice = (price) => {
    return parseInt(price.replace(/[^\d]/g, ''), 10);
  };
  const Submitted = (data) => {
    // console.log(data)
    const { ...rest } = data;
    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('price', cleanPrice(data.price));
    mutate(formData);
  };
  return (
    <>
      <Container>
        <Typography variant="h3" sx={{ mb: 5 }}>
          Tambah Layanan
        </Typography>
        <CustomBreadcrumbs
          links={[{ name: 'Layanan', href: '/services' }, { name: 'Create' }]}
          sx={{ mb: { xs: 2, md: 3 } }}
          action={null}
          heading=""
          moreLink={[]}
          activeLast={true}
        />
        <Box component="form" onSubmit={handleSubmit(Submitted)}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                {...register('name', { required: 'Nama Wajib Diisi' })}
                margin="dense"
                id="name"
                label="Nama Layanan"
                type="text"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <Controller
                name="price"
                control={control}
                defaultValue=""
                rules={{ required: 'Harga wajib diisi' }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={TextField}
                    label="Harga"
                    fullWidth
                    required
                    prefix="Rp "
                    thousandSeparator="."
                    decimalSeparator=","
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                {...register('status', { required: true })}
                label="Status"
                fullWidth
                required
              >
                <MenuItem value="available">Tersedia</MenuItem>
                <MenuItem value="unavailable">Tidak tersedia</MenuItem>
              </TextField>
              <TextField
                select
                {...register('payment_type', { required: true })}
                label="Tipe Bayar"
                fullWidth
                required
              >
                <MenuItem value="monthly">Per Bulan</MenuItem>
                <MenuItem value="pay_once">Sekali Bayar</MenuItem>
              </TextField>
            </Stack>
            <TextField
              {...register('description')}
              margin="dense"
              label="Deskripsi (Optional)"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
            />
          </Stack>
          <Button
            type="submit"
            disabled={isPending}
            variant="contained"
            sx={{ mt: 3, mb: 5, mr: 3 }}
          >
            Submit
          </Button>
          <Link to="/services">
            <Button type="button" variant="outlined" sx={{ mt: 3, mb: 5 }}>
              Kembali
            </Button>
          </Link>
        </Box>
      </Container>
    </>
  );
};
