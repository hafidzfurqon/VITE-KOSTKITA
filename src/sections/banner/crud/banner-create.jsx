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
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useCreateBanner } from 'src/hooks/banner';
import { router } from 'src/hooks/routing/useRouting';
import { useRouter } from 'src/routes/hooks';
import { FormControlLabel, Switch } from '@mui/material';
import { useListProperty } from 'src/hooks/property/public/useListProperty';
import { useFetchPromo } from 'src/hooks/promo';

export default function BannerCreate() {
  const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();
  const { register, handleSubmit, setValue } = useForm();
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

  const [isActive, setIsActive] = useState(false);
  const [image, setImage] = useState(null);

  const handleToggle = (event) => {
    const status = event.target.checked ? 'active' : 'inactive';
    setIsActive(event.target.checked);
    setValue('status', status);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage({ file, preview: URL.createObjectURL(file) });
      setValue('image', file);
    },
    [setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const removeImage = () => {
    setImage(null);
    setValue('image', null);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append('type', 'general');
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
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              {...register('title', { required: 'Nama Banner perlu diisi' })}
              label="Judul Banner"
              fullWidth
              required
            />
            <FormControlLabel
              control={<Switch checked={isActive} onChange={handleToggle} />}
              label={isActive ? 'Active' : 'Non-Active'}
            />
            <Box
              {...getRootProps()}
              sx={{ border: '2px dashed gray', p: 2, textAlign: 'center', cursor: 'pointer' }}
            >
              <input {...getInputProps()} />
              <Typography>Drag & Drop gambar di sini atau klik untuk memilih</Typography>
            </Box>
            {image && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <img
                  src={image.preview}
                  alt="Preview"
                  width="100%"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
                <Button onClick={removeImage} variant="contained" color="error" sx={{ mt: 1 }}>
                  Hapus Gambar
                </Button>
              </Box>
            )}
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
