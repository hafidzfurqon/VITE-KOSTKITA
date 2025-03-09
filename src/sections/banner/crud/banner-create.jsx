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
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useCreateBanner } from 'src/hooks/banner';
import { router } from 'src/hooks/routing/useRouting';
import { useRouter } from 'src/routes/hooks';
import { FormControlLabel } from '@mui/material';
import { Switch } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { useFetchPromo } from 'src/hooks/promo';

export default function BannerCreate() {
  const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateBanner({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.banner'] });
      routers.push('/banner');
      enqueueSnackbar('Banner berhasil dibuat', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Gagal menambahkan banner', { variant: 'error' });
    },
  });

  // const [previewImage, setPreviewImage] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const { data, isLoading: isLoadingProperty } = useListProperty();
  const { data: dataPromo, isLoading: isLoadingPromo } = useFetchPromo();
  const handleToggle = (event) => {
    const status = event.target.checked ? 'active' : 'non-active';
    setIsActive(event.target.checked);
    setValue('status', status); // Simpan status ke react-hook-form
  };

  const OnSubmit = (data) => {
    // console.log(data)
    const { ...rest } = data;
    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // formData.append('image', gambar[0]);
    mutate(formData);
  };

  return (
    <Container>
      <Typography variant="h4">Tambah Banner Baru</Typography>
      <CustomBreadcrumbs
        heading="List"
        links={[{ name: 'List Banner', href: router.banner.list }, { name: 'Create Banner' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box sx={{ mt: 5 }}>
        <Box component="form" onSubmit={handleSubmit(OnSubmit)}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <TextField
                {...register('title', { required: 'Nama Banner perlu diisi' })}
                autoFocus
                required
                margin="dense"
                id="title"
                label="Judul Banner"
                type="text"
                fullWidth
                variant="outlined"
              />
              <TextField
                select
                {...register('type', { required: true })}
                label="Banner diambil dari"
                fullWidth
                required
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setValue('type', e.target.value); // Simpan ke react-hook-form
                }}
              >
                <MenuItem value="reference_to_property">Property</MenuItem>
                <MenuItem value="reference_to_promo">Promo</MenuItem>
              </TextField>
            </Stack>
            {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}> */}
            <Typography>Status : </Typography>
            <FormControlLabel
              control={<Switch checked={isActive} onChange={handleToggle} size="medium" />}
              label={isActive ? 'Active' : 'Non-Active'}
            />
            <Autocomplete
              options={selectedType === 'reference_to_promo' ? dataPromo || [] : data || []}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={selectedType === 'reference_to_promo' ? isLoadingPromo : isLoadingProperty}
              disabled={!selectedType}
              onChange={(_, value) => {
                setSelectedState(value ? value.id : null);
                setValue(
                  selectedType === 'reference_to_promo' ? 'promo_id' : 'property_id',
                  value ? value.id : ''
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nama Promo atau Property"
                  fullWidth
                  variant="outlined"
                />
              )}
            />

            {/* </Stack> */}
            <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
              <Button type="submit" variant="contained" disabled={isPending}>
                Submit
              </Button>
              <Link to={router.banner.list}>
                <Button variant="outlined">Kembali</Button>
              </Link>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
