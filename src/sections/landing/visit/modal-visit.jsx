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
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import idLocale from 'date-fns/locale/id';
import { useMutationCreateVisit } from 'src/hooks/users/useMutationCreateVIsit';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} timeout={1000} {...props} />;
});

const ModalVisit = ({ isOpen, onClose, data }) => {
  const [visitDate, setVisitDate] = useState(null);
  const [visitTime, setVisitTime] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const formatCurrency = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const { mutate, isPending } = useMutationCreateVisit({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visit.property'] });
      enqueueSnackbar('Visit berhasil dijadwalkan', { variant: 'success' });
      onClose();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.errors?.visit_date?.[0] || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const handleSubmit = () => {
    if (!visitDate || !visitTime) {
      enqueueSnackbar('Tanggal dan jam visit wajib diisi!', { variant: 'error' });
      return;
    }

    const selectedDateTime = new Date(visitDate);
    selectedDateTime.setHours(visitTime.getHours(), visitTime.getMinutes(), 0);

    if (selectedDateTime < new Date()) {
      enqueueSnackbar('Tanggal dan waktu visit harus minimal saat ini!', { variant: 'error' });
      return;
    }

    const formattedVisitDate = selectedDateTime.toISOString().slice(0, 19).replace('T', ' ');
    mutate({
      property_id: data.id,
      visit_date: formattedVisitDate,
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
            src={data?.files?.[0]?.file_url}
            alt={data.name}
            style={{ width: 100, height: 80, borderRadius: 8 }}
          />
          <Box>
            <Typography fontWeight="bold">{data.name}</Typography>
            <Typography variant="body2">
              {data?.address}, {data.sector.name}
              <Typography
                sx={{ ml: 1, fontWeight: 'bold' }}
                variant="body2"
                component="span"
                color="black"
              >
                {data.city.name}
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
            value={visitDate ? visitDate.toISOString().split('T')[0] : ''}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setVisitDate(new Date(e.target.value))}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={idLocale}>
            <TimePicker
              label="Jam Visit"
              value={visitTime}
              onChange={setVisitTime}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Box>
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
