import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { ListItemButton, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMutationLogin } from 'src/hooks/auth/useMutationLogin'; 

import logo from '../../../public/assets/images/logo.png'
import { useSnackbar } from 'src/components/snackbar';


// ----------------------------------------------------------------------
type Login = {
  email: string;
  login: string;
  password: string;
};

export type err = {
  message : string
  errors : string
}

export function SignInView() {
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

    const {mutate, isPending} = useMutationLogin({
      onSuccess : () => {
        router.push('/dashboard')
       enqueueSnackbar('Login berhasil', { variant: 'success' });
      },
      onError : (err : err) => {
        enqueueSnackbar(err.errors, { variant: 'error' });
      }
    });
    
  
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<Login>();
  
  const OnSubmit = (data : any) => {
    mutate(data);
  }

  const renderForm = (
    <Stack spacing={3}>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        onSubmit={handleSubmit(OnSubmit)}
      >
        <TextField
          fullWidth
          {...register('login')}
          label="Email address"
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
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          disabled={isPending}
        >
          {isPending ? 'Loading...' : ' Sign in'}
        </LoadingButton>
      </Box>
    </Stack>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in to <Box component="span">KostKita.ID</Box></Typography>
      <img src={logo} alt="ashaj" />
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
          sx={{ color: 'text.secondary', mb: 1 }}
        >
          Belum Daftar ? Register disini
        </Typography>
        <Box
          sx={{ mx: 3, gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
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
            href="/"
          >
            <Box component="span" sx={{color : '#000000'}}>Kembali</Box>
          </ListItemButton>
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
            href="/sign-up"
          >
            <Box component="span" sx={{color : '#000000'}}>Daftar disini</Box>
          </ListItemButton>
        </Box>
      </Box>
    </>
  );
}
