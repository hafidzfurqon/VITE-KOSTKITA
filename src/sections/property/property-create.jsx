import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  FormLabel,
  MenuItem,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { useCreateProperty, useGetCity, useGetState } from 'src/hooks/property';
import { useRouter } from 'src/routes/hooks';
import { Link } from 'react-router-dom';

export default function PropertyCreate() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { control, register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: '',
      type: '',
      address: '',
      link_googlemaps: '',
      description: '',
      status: '',
      state_id: '',
      city_id: '',
      price: '',
      files: [],
      payment_type: '',
    },
  });

  const selectedState = watch('state_id');

  const { data: states = [], isLoading: isLoadingStates } = useGetState();
  const { data: cities = [], isLoading: isLoadingCities } = useGetCity(selectedState);

  const { mutate, isPending } = useCreateProperty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.property'] });
      enqueueSnackbar('Properti berhasil ditambahkan', { variant: 'success' });
      router.push('/property');
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Terjadi kesalahan', { variant: 'error' });
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'files' && value.length > 0) {
        Array.from(value).forEach((file) => formData.append('files[]', file));
      } else {
        formData.append(key, value);
      }
    });
    formData.append('price', cleanPrice(data.price));

    mutate(formData);
  };

  const cleanPrice = (price) => {
    return parseInt(price.replace(/[^\d]/g, ''), 10);
  };

  return (
    <Container>
      <Typography variant="h4">Tambah Properti Baru</Typography>
      <Box sx={{ mt: 5 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              {...register('name', { required: true, minLength: 3, maxLength: 255 })}
              label="Nama Properti"
              fullWidth
              required
            />

            <TextField
              select
              {...register('type', { required: true })}
              label="Tipe Properti"
              fullWidth
              required
            >
              <MenuItem value="Coliving">Coliving</MenuItem>
              <MenuItem value="Kostan">Kostan</MenuItem>
              <MenuItem value="Kontrakan">Kontrakan</MenuItem>
            </TextField>

            <TextField
              select
              {...register('payment_type', { required: true })}
              label="Tipe Pembayaran"
              fullWidth
              required
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </TextField>

            <TextField
              {...register('address', { required: true })}
              label="Alamat"
              fullWidth
              required
            />

            <TextField
              {...register('link_googlemaps', { required: true })}
              label="Link Google Maps"
              fullWidth
              required
              type="url"
            />
            <TextField
              {...register('description', { required: true })}
              label="Deskripsi"
              fullWidth
              required
              multiline
              rows={3}
            />

            <TextField
              select
              {...register('status', { required: true })}
              label="Status"
              fullWidth
              required
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="unavailable">Unavailable</MenuItem>
            </TextField>
            {/* Select Provinsi */}
            <TextField
              select
              {...register('state_id')}
              defaultValue=""
              label="Provinsi"
              fullWidth
              disabled={isLoadingStates}
              //   error={!!errors.state_id}
              //   helperText={errors.state_id?.message}
            >
              {states?.map((state) => (
                <MenuItem key={state.state_code} value={state.state_code}>
                  {state.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              {...register('city_id')}
              defaultValue=""
              label="Kota"
              fullWidth
              disabled={isLoadingCities || !selectedState}
              //   error={!!errors.city_id}
              //   helperText={errors.city_id?.message}
            >
              {cities?.map((city) => (
                <MenuItem key={city.city_code} value={city.city_code}>
                  {city.name}
                </MenuItem>
              ))}
            </TextField>

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

            <FormLabel>Upload Files</FormLabel>
            <TextField
              {...register('files')}
              type="file"
              inputProps={{ multiple: true }}
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
              <Button type="submit" variant="contained" disabled={isPending}>
                Submit
              </Button>
              <Link to="/property">
                <Button variant="outlined">Kembali</Button>
              </Link>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
