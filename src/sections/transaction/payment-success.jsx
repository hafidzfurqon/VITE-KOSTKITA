import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
// assets
import { OrderCompleteIllustration } from 'src/assets/illustrations';
import { Iconify } from 'src/components/iconify';
import { varFade } from 'src/components/upload/animate/fade';
// components
// import { varFade } from '../upload/animate/fade';
// import { Iconify } from '../iconify';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get('booking_id'); // atau order_id kalau ingin tampilkan yang itu

  return (
    <m.div
      variants={varFade().in}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 600, width: '100%' }}>
        <Stack spacing={5} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component={m.div} variants={varFade().inRight}>
            Booking Berhasil!
          </Typography>

          <m.div variants={varFade().inUp}>
            <OrderCompleteIllustration sx={{ height: 260 }} />
          </m.div>

          <Typography component={m.div} variants={varFade().inUp}>
            Pemesanan Anda telah berhasil dikonfirmasi!
            <br />
            <br />
            Kode Booking: <strong>{bookingCode}</strong>
            <br />
            <br />
            Silakan cek detail riwayat booking. <br />
            Jika ada pertanyaan, jangan ragu untuk menghubungi kami.
          </Typography>

          <Divider component={m.div} variants={varFade().inUp} sx={{ borderStyle: 'dashed' }} />

          <Stack
            spacing={2}
            justifyContent="space-between"
            direction={{ xs: 'column-reverse', sm: 'row' }}
          >
            <Button
              fullWidth
              size="small"
              component={Link}
              to="/"
              variant="outlined"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              variants={varFade().inUp}
            >
              Kembali ke Beranda
            </Button>

            <Button
              fullWidth
              component={Link}
              to={`/history/booking/detail/${bookingCode}`}
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none' }}
              variants={varFade().inUp}
            >
              Cek ke Halaman Riwayat Booking
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </m.div>
  );
}
