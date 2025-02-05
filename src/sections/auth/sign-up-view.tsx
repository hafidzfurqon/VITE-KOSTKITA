import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, IconButton, InputAdornment, ListItemButton } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';



export function SignUpView() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {register, handleSubmit} = useForm()
    const Onsubmit = () => console.log('ajsdkajs')
  
    const renderForm = (
      <Stack spacing={3}>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          onSubmit={Onsubmit}
        >
            <TextField
            fullWidth
            {...register('nama')}
            autoFocus
            margin="dense"
            required
            id="nama"
            name="nama"
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
            {...register('no_telp')}
            margin="dense"
            id="Nomor Telepon"
            name="Nomor Telepon"
            label="Nomor Telepon (0851 XXXX XXXX)"
            type="number"
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
            // disabled={isPending}
          >
            {/* {isPending ? 'Loading...' : ' Sign in'} */}
           Sign Up
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