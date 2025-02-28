import PropTypes from 'prop-types';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
// assets
import { OrderCompleteIllustration } from 'src/assets/illustrations';
// components
import { varFade } from '../upload/animate/fade';
import { Iconify } from '../iconify';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ModalBookingSuccess({ open, onReset, bookingCode }) {
  const renderContent = (
    <m.div variants={varFade().in} initial="hidden" animate="visible" exit="exit">
      <Stack
        spacing={5}
        sx={{
          m: 'auto',
          maxWidth: 480,
          textAlign: 'center',
          px: { xs: 2, sm: 0 },
        }}
      >
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
          Code Booking: {bookingCode}
          <br />
          <br />
          Silakan cek ke detail riwayat booking. <br />
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
            variant="outlined"
            onClick={onReset}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            component={m.button}
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
            // component={m.button}
            variants={varFade().inUp}
          >
            Cek ke Halaman Riwayat Booking
          </Button>
        </Stack>
      </Stack>
    </m.div>
  );

  return (
    <AnimatePresence>
      {open && (
        <Dialog fullWidth maxWidth="sm" open={open}>
          <m.div variants={varFade().inUp} initial="hidden" animate="visible" exit="exit">
            <Paper sx={{ p: 3 }}>{renderContent}</Paper>
          </m.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

ModalBookingSuccess.propTypes = {
  open: PropTypes.bool,
  onReset: PropTypes.func,
  bookingCode: PropTypes.string,
};
