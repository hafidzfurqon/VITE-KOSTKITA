import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, IconButton, InputAdornment, ListItemButton } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { useMutationRegister } from 'src/hooks/auth/useMutationRegister';
import { useSnackbar } from 'notistack';
import { useMutationSendEmailVerify } from 'src/hooks/users/mutation';

export function SignUpView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();
  const {
    mutate: mutateSendEmail,
    // isPending: isPendingEmailSend,
    isSuccess,
  } = useMutationSendEmailVerify();
  const { mutate, isPending } = useMutationRegister({
    onSuccess: (data: any) => {
      mutateSendEmail(data.data.email);
      if (isSuccess) {
        localStorage.setItem('email', data.data.email);
        enqueueSnackbar('Pendaftaran Berhasil Verifikasi Email Telah dikirim', {
          variant: 'success',
        });
      }
      router.push('/sign-in');
    },
    onError: (err: any) => {
      const errors = err.response?.data?.errors; // Ambil bagian errors dari response

      if (errors?.phone_number) {
        enqueueSnackbar('No Telepon Wajib Diisi', { variant: 'error' });
      }
      if (errors?.email) {
        enqueueSnackbar('Email Wajib Diisi', { variant: 'error' });
      }
      if (errors?.password) {
        enqueueSnackbar(errors.password[0], { variant: 'error' });
      }
    },
  });
  const Onsubmit = (data: any) => {
    const { ...rest } = data;
    const formData: any = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // formData.append('date_of_birth', '18-01-07');
    // formData.append('gender', 'male');
    // formData.append('nik', '323023232832');
    // formData.append('nomor_ktp', '93343121');
    mutate(formData);
  };

  const renderForm = (
    <Stack spacing={3}>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        onSubmit={handleSubmit(Onsubmit)}
      >
        <TextField
          fullWidth
          {...register('name')}
          autoFocus
          margin="dense"
          required
          id="nama"
          name="name"
          label="Nama Lengkap"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          {...register('email')}
          margin="dense"
          id="email"
          name="email"
          label="Email"
          type="email"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          {...register('phone_number')}
          margin="dense"
          id="Nomor Telepon"
          name="phone_number"
          label="Nomor Telepon (0851 XXXX XXXX)"
          type="number"
          inputMode="numeric"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          {...register('password')}
          label="Password"
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
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
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          disabled={isPending}
        >
          {isPending ? 'Loading...' : 'Sign Up'}
        </LoadingButton>
      </Box>
    </Stack>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Daftarkan dirimu KostKita.ID</Typography>
      </Box>
      {renderForm}
      <Box
        sx={{
          my: 2,
          '&::before, &::after': { borderTopStyle: 'dashed' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium', mb: 1 }}
        >
          Sudah punya akun ? Login disini
        </Typography>
        <ListItemButton
          disableGutters
          sx={{
            pl: 2,
            py: 1,
            gap: 3,
            // display : 'flex',
            display: 'flex',
            mt: 2,
            pr: 1.5,
            borderRadius: 0.75,
            typography: 'body2',
            fontWeight: 'fontWeightMedium',
            minHeight: 'var(--layout-nav-item-height)',
            bgcolor: 'var(--layout-nav-item-active-bg)',
            color: 'var(--layout-nav-item-active-color)',
            '&:hover': {
              bgcolor: 'var(--layout-nav-item-hover-bg)',
            },
          }}
          href="/sign-in"
        >
          <Box component="span">Login disini</Box>
        </ListItemButton>
      </Box>
    </>
  );
}
