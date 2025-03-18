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
import { MenuItem } from '@mui/material';
import { format } from 'date-fns';

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const userId = user?.id;
  const [loading, setLoading] = useState(true);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Nama wajib diisi'),
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    phone_number: Yup.string().nullable(),
    nomor_ktp: Yup.string().nullable(),
    nik: Yup.string().nullable(),
    date_of_birth: Yup.string().nullable(),
    gender: Yup.string().nullable().oneOf(['male', 'female'], 'Jenis kelamin tidak valid'),
    photo_profile: Yup.mixed()
      .nullable()
      .test(
        'fileType',
        'Format file tidak valid (hanya jpg, jpeg, png)',
        (value) => !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
      ),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      nomor_ktp: '',
      nik: '',
      date_of_birth: '',
      gender: '',
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
      const formattedDate = user.date_of_birth
        ? format(new Date(user.date_of_birth), 'yyyy-MM-dd')
        : '';

      reset({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        nomor_ktp: user.nomor_ktp || '',
        nik: user.nik || '',
        date_of_birth: formattedDate,
        gender: user.gender || '',
        photo_profile: user.photo_profile_url || '',
      });
    }
    setLoading(false);
  }, [user, reset]);

  const { mutateAsync: editUser } = useUpdateProfile();

  const onSubmit = async (data) => {
    console.log('Sebelum dikirim:', data);

    const formattedData = {
      ...data,
      date_of_birth: data.date_of_birth ? format(new Date(data.date_of_birth), 'yyyy-MM-dd') : null,
    };

    console.log('Formatted Data:', formattedData);

    const formData = new FormData();
    Object.entries(formattedData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('_method', 'PUT');

    try {
      const updatedUser = await editUser({ userId, data: formData });
      console.log('User setelah update:', updatedUser);
      enqueueSnackbar('Profil berhasil diperbarui', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['authenticated.user'] });

      // setTimeout(() => {
      //   console.log('Data terbaru dari query:', queryClient.getQueryData(['authenticated.user']));
      // }, 2000);

      reset(updatedUser);
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
                  Tipe Gambar *.jpeg, *.jpg, *.png, max ukuran file {fData(3000000)}
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
              <RHFTextField name="nik" label="NIK" />
              <RHFTextField name="nomor_ktp" label="Nomor KTP" />
              <RHFTextField
                select
                label="Jenis Kelamin"
                fullWidth
                name="gender"
                value={methods.watch('gender')}
                onChange={(e) => setValue('gender', e.target.value)}
              >
                <MenuItem value="male">Laki-laki</MenuItem>
                <MenuItem value="female">Perempuan</MenuItem>
              </RHFTextField>
              <RHFTextField
                name="date_of_birth"
                label="Tanggal Lahir"
                InputLabelProps={{ shrink: true }}
                type="date"
              />
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
