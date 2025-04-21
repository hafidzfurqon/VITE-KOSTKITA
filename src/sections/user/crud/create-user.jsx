import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { Stack } from '@mui/material';
import { IconButton } from '@mui/material';
import { FormLabel } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Container, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { useMutationCreateUser } from 'src/hooks/users/mutation';
import { useRouter } from 'src/routes/hooks';

export const CreateUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutate, isPending } = useMutationCreateUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all.users'] });
      router.push('/user');
      enqueueSnackbar('Pendaftaran Berhasil', { variant: 'success' });
    },
    onError: (err) => {
      const errors = err.response?.data?.errors; // Ambil bagian errors dari response

      if (errors?.phone_number) {
        enqueueSnackbar(errors?.phone_number[0], { variant: 'error' });
      }
      if (errors?.email) {
        enqueueSnackbar(errors?.email[0], { variant: 'error' });
      }
      if (errors?.password) {
        enqueueSnackbar(errors.password[0], { variant: 'error' });
      }
    },
  });
  const Submitted = (data) => {
    // console.log(data)
    const { photo_profile: gambar, ...rest } = data;
    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('photo_profile', gambar[0]);
    mutate(formData);
  };
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: 'image/*',
    multiple: true,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setSelectedImages(acceptedFiles);
      setValue('photo_profile', acceptedFiles);
    },
  });
  return (
    <>
      <Container>
        <Typography variant="h3" sx={{ mb: 5 }}>
          Tambah Pengguna
        </Typography>
        <CustomBreadcrumbs
          links={[{ name: 'User', href: '/user' }, { name: 'Create' }]}
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
                label="Nama Pengguna"
                type="text"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                fullWidth
                {...register('email')}
                margin="dense"
                id="email"
                name="email"
                label="Email"
                type="email"
                sx={{ mb: 3 }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                {...register('phone_number')}
                margin="dense"
                id="Nomor Telepon"
                name="phone_number"
                label="Nomor Telepon (0851 XXXX XXXX)"
                type="number"
                inputMode="numeric"
                sx={{ mb: 3 }}
              />
              <TextField
                select
                {...register('role', { required: true })}
                label="Role"
                fullWidth
                required
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="owner_property">Owner Property</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                {...register('password')}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                {...register('password_confirmation')}
                label="Konfirmasi Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
            </Stack>

            <FormLabel>Upload Images (Optional)</FormLabel>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #ccc',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
            >
              <input {...getInputProps()} />
              <Typography>Drag & Drop atau Klik untuk Upload</Typography>
            </Box>

            {/* ✅ Preview Gambar */}
            <Stack direction="row" spacing={2}>
              {selectedImages.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  width={80}
                  height={80}
                  style={{ borderRadius: 8, objectFit: 'cover' }}
                />
              ))}
            </Stack>
          </Stack>
          <Button
            type="submit"
            disabled={isPending}
            variant="contained"
            sx={{ mt: 3, mb: 5, mr: 3 }}
          >
            Submit
          </Button>
          <Link to="/user">
            <Button type="button" variant="outlined" sx={{ mt: 3, mb: 5 }}>
              Kembali
            </Button>
          </Link>
        </Box>
      </Container>
    </>
  );
};
