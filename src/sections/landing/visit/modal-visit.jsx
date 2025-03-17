import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
  Slide,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState, forwardRef } from 'react';
import { useMutationCreateVisit } from 'src/hooks/users/useMutationCreateVIsit';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import idLocale from 'date-fns/locale/id';
import { LocalizationProvider } from '@mui/x-date-pickers';

// Animasi transisi modal
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} timeout={1000} {...props} />;
});

const ModalVisit = ({ isOpen, onClose, data }) => {
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [estimatedStart, setEstimatedStart] = useState('');
  const [estimatedEnd, setEstimatedEnd] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  // Menggunakan mutate dengan format yang diminta
  const { mutate, isPending } = useMutationCreateVisit({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['visit.property'] });
      enqueueSnackbar('Visit berhasil dijadwalkan', { variant: 'success' });
      onClose();
    },
    onError: (error) => {
      const errors = error.response?.data?.errors;
      if (errors?.visit_date[0]) {
        enqueueSnackbar('Jam visit wajib diiisi', { variant: 'error' });
      }
      enqueueSnackbar(error?.response?.data?.errors || 'Terjadi kesalahan', { variant: 'error' });
    },
  });

  const handleSubmit = () => {
    const now = new Date();
    const selectedDateTime = new Date(`${visitDate}T${visitTime}`);
    const startDate = new Date(estimatedStart);
    const endDate = new Date(estimatedEnd);
    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 30); // Tambah 30 hari dari startDate

    if (selectedDateTime < now) {
      enqueueSnackbar('Tanggal dan waktu visit harus minimal saat ini!', { variant: 'error' });
      return;
    }

    if (startDate <= now) {
      enqueueSnackbar('Tanggal masuk harus lebih dari hari ini!', { variant: 'error' });
      return;
    }

    if (endDate < minEndDate) {
      enqueueSnackbar('Tanggal keluar harus minimal 30 hari setelah tanggal masuk!', {
        variant: 'error',
      });
      return;
    }

    mutate({
      property_id: data.id,
      visit_date: `${visitDate} ${visitTime}:00`,
      estimated_stay_date_start: estimatedStart,
      estimated_stay_date_end: estimatedEnd,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      BackdropProps={{ style: { backgroundColor: 'transparent' } }}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 3,
          boxShadow: 3,
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.3s ease-in-out',
        },
      }}
    >
      <DialogTitle>
        Jadwalkan Visit
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" gap={2} mb={2}>
          <img
            src={data?.files[0]?.file_url}
            alt={data.name}
            style={{ width: 100, height: 80, borderRadius: 8 }}
          />
          <Box>
            <Typography fontWeight="bold">{data.name}</Typography>
            <Typography variant="body2">
              Mulai dari
              <Typography
                sx={{ ml: 1, fontWeight: 'bold' }}
                variant="body2"
                component="span"
                color="black"
              >
                {formatCurrency(data.start_price)}/
                {data.payment_type === 'monthly' ? 'bulan' : 'Tahun'}
              </Typography>
            </Typography>
          </Box>
        </Box>

        <Typography mb={2} fontWeight="bold">
          Waktu Visit
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="Tanggal Visit"
            type="date"
            fullWidth
            value={visitDate}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setVisitDate(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
            <TimePicker
              label="Jam Visit"
              value={visitTime ? new Date(`2000-01-01T${visitTime}`) : null}
              onChange={(time) => {
                if (time) {
                  const hours = time.getHours().toString().padStart(2, '0');
                  const minutes = time.getMinutes().toString().padStart(2, '0');
                  setVisitTime(`${hours}:${minutes}`);
                }
              }}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Box>

        <Typography fontWeight="bold" mb={2} mt={2}>
          Estimasi Tinggal
        </Typography>
        <TextField
          type="date"
          fullWidth
          label="Tanggal Masuk"
          value={estimatedStart}
          onChange={(e) => setEstimatedStart(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 1 }}
        />
        <TextField
          type="date"
          fullWidth
          label="Tanggal Keluar"
          value={estimatedEnd}
          onChange={(e) => setEstimatedEnd(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isPending}>
          {isPending ? 'Mengajukan...' : 'Jadwalkan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalVisit;
