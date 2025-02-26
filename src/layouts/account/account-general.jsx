import * as Yup from 'yup';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/system/Unstable_Grid/Grid';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import { fData } from 'src/utils/format-number';
import { CircularProgress, Container } from '@mui/material';
import { useAppContext } from 'src/context/user-context';
import { useUpdateProfile } from 'src/hooks/users/profile/useUpdateProfile';
import { useQueryClient } from '@tanstack/react-query';

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const userId = user?.id;
  const [loading, setLoading] = useState(true);

  const UpdateUserSchema = Yup.object().shape({
    phone_number: Yup.string().nullable(),
    photo_profile: Yup.mixed()
      .nullable()
      .test(
        'fileType',
        'Format file tidak valid (hanya jpg, jpeg, png)',
        (value) =>
          !value || (value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type))
      ),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      photo_profile: '',
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        photo_profile: user.photo_profile_url || '',
      });
    }
    setLoading(false);
  }, [user, reset]);

  const { mutateAsync: editUser } = useUpdateProfile();

  const onSubmit = async (data) => {
    // Buat objek formData hanya jika ada perubahan
    const formData = new FormData();

    // Cek apakah ada perubahan data
    const hasChanges =
      data.name !== user.name ||
      data.email !== user.email ||
      data.phone_number !== user.phone_number ||
      data.photo_profile !== user.photo_profile;

    if (!hasChanges) {
      enqueueSnackbar('Tidak ada perubahan data', { variant: 'info' });
      return;
    }

    if (data.name !== user.name) formData.append('name', data.name);
    if (data.email !== user.email) formData.append('email', data.email);
    if (data.phone_number !== user.phone_number) formData.append('phone_number', data.phone_number);
    if (data.photo_profile && data.photo_profile !== user.photo_profile) {
      formData.append('photo_profile', data.photo_profile);
    }

    formData.append('_method', 'PUT');

    try {
      const updatedUser = await editUser({ userId, data: formData });
      enqueueSnackbar('Profil berhasil diperbarui', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['authenticated.user'] }); // Reset cache

      // Perbarui state dengan data terbaru
      reset({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone_number: updatedUser.phone_number || '',
        photo_profile: updatedUser.photo_profile || '',
      });
    } catch (error) {
      enqueueSnackbar('Gagal memperbarui user', { variant: 'error' });
      console.error('Error update user:', error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validFormats.includes(file.type)) {
          enqueueSnackbar('Format file tidak didukung', { variant: 'error' });
          return;
        }
        if (file.size > 3000000) {
          enqueueSnackbar('Ukuran file terlalu besar (maks 3MB)', { variant: 'error' });
          return;
        }

        // Jangan pakai FileReader, langsung simpan file
        setValue('photo_profile', file, { shouldValidate: true });
      }
    },
    [setValue, enqueueSnackbar]
  );

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photo_profile"
              maxSize={3000000}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Tipe Gambar *.jpeg, *.jpg, *.png,
                  <br /> max ukuran file {fData(3000000)}
                </Typography>
              }
              preview={methods.watch('photo_profile')}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <RHFTextField name="name" label="Nama" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="phone_number" label="Nomor Telepon" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Simpan
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
