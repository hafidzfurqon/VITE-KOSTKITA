import React, { useEffect } from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../public/assets/images/logo.png';
import { useMutationVerifyEmail } from 'src/hooks/users/mutation';
import Loading from 'src/components/loading/loading';
import { useSnackbar } from 'notistack';

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const { mutate, isPending, isError, isSuccess } = useMutationVerifyEmail();

  useEffect(() => {
    if (token) {
      mutate(token);
    } else {
      navigate('/sign-in'); // Jika token tidak ada, redirect ke halaman sign-in
    }
  }, [token, mutate, navigate]);

  if (isPending) {
    return <Loading />;
  }
  if (isSuccess) {
    enqueueSnackbar('Akun ter verifikasi, silahkan login', { variant: 'success' });
  }
  if (isError) {
    enqueueSnackbar('Token Telah kadaluarsa silahkan request kembali', { variant: 'error' });
  }

  if (isError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Verifikasi Email Gagal
          </Typography>
          <Typography variant="subtitle1" p={3} align="center">
            Terjadi kesalahan saat memverifikasi email Anda. Silakan coba lagi.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/sign-in')}>
            Kembali ke Login
          </Button>
        </Paper>
      </Container>
    );
  }

  if (isSuccess) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img src={logo} alt="Logo" />
          </Box>
          <Typography variant="h4" align="center" gutterBottom>
            Verifikasi Email Anda Telah Berhasil
          </Typography>
          <Typography variant="subtitle1" p={3} align="center">
            Silahkan Masuk ke akun Anda
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/sign-in')}>
            Masuk
          </Button>
          <Box>
            <Typography variant="subtitle1" pt={3} align="center">
              Salam Hangat Kostkita.id
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return null;
};

export default VerifyEmailPage;
