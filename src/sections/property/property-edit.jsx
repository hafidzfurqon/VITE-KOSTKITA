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
import { useGetCity, useGetState, useUpdateProperty } from 'src/hooks/property';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { router } from 'src/hooks/routing/useRouting';
import { useLocation } from 'react-router-dom';

export default function PropertyEdit() {
  const location = useLocation();
  const propertyData = location.state?.propertyData || {}; // Ensure the data is loaded from state
  console.log(propertyData);

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  // Initialize form with propertyData if available
  const { control, register, handleSubmit, watch, setValue } = useForm({
    defaultValues: propertyData || {
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

  // Automatically set state and city based on the loaded property data
  const selectedState = watch('state_id');

  const { data: states = [], isLoading: isLoadingStates } = useGetState();
  const { data: cities = [], isLoading: isLoadingCities } = useGetCity(selectedState);

  const { mutate, isPending } = useUpdateProperty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.property'] });
      enqueueSnackbar('Properti berhasil diperbarui', { variant: 'success' });
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
      <Typography variant="h4">Edit Properti</Typography>
      <CustomBreadcrumbs
        links={[{ name: 'List Property', href: router.property.list }, { name: 'Edit Property' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ mt: 5 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              {...register('name', { required: true, minLength: 3, maxLength: 255 })}
              label="Nama Properti"
              fullWidth
              required
              defaultValue={propertyData.name || ''}
            />

            <TextField
              select
              {...register('type', { required: true })}
              label="Tipe Properti"
              fullWidth
              required
              defaultValue={propertyData.type || ''}
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
              defaultValue={propertyData.payment_type || ''}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </TextField>

            <TextField
              {...register('address', { required: true })}
              label="Alamat"
              fullWidth
              required
              defaultValue={propertyData.address || ''}
            />

            <TextField
              {...register('link_googlemaps', { required: true })}
              label="Link Google Maps"
              fullWidth
              required
              type="url"
              defaultValue={propertyData.link_googlemaps || ''}
            />
            <TextField
              {...register('description', { required: true })}
              label="Deskripsi"
              fullWidth
              required
              multiline
              rows={3}
              defaultValue={propertyData.description || ''}
            />

            <TextField
              select
              {...register('status', { required: true })}
              label="Status"
              fullWidth
              required
              defaultValue={propertyData.status || ''}
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="unavailable">Unavailable</MenuItem>
            </TextField>

            {/* Select Provinsi */}
            <TextField
              select
              {...register('state_id')}
              defaultValue={propertyData.state?.state_code || ''}
              label="Provinsi"
              fullWidth
              disabled={isLoadingStates}
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
              defaultValue={propertyData.city?.city_code || ''}
              label="Kota"
              fullWidth
              disabled={isLoadingCities || !selectedState}
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
              defaultValue={propertyData.start_price || ''}
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
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
