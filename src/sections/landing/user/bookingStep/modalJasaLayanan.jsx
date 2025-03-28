import { useState, useEffect } from 'react';
import {
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFetchServiceUser } from 'src/hooks/users/useFetchServiceUser';

export default function ModalJasaLayanan({ open, onClose, onSubmit, bookedServices }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const { data } = useFetchServiceUser();

  const services = data?.data || [];

  useEffect(() => {
    if (open) {
      setSelectedServices(bookedServices);
    }
  }, [open, bookedServices]);

  const toggleService = (service) => {
    if (bookedServices.some((s) => s.id === service.id)) return; // Cegah pemilihan ulang
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      return exists ? prev.filter((s) => s.id !== service.id) : [...prev, service];
    });
  };

  const handleConfirm = () => {
    onSubmit(selectedServices);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 3,
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', position: 'relative' }}>
        Tambah Jasa Layanan
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {services.length > 0 ? (
          services.map((service) => {
            const isBooked = bookedServices?.some((s) => s.id === service.id);
            return (
              <Box
                key={service.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1,
                  borderBottom: '1px solid #ddd',
                  opacity: isBooked ? 0.5 : 1,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>{service.name}</Typography>
                  {service.description && (
                    <Typography sx={{ fontSize: 14, color: 'gray' }}>
                      {service.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: '#fff',
                        backgroundColor: '#2196F3',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        mr: 1,
                      }}
                    >
                      {service.payment_type === 'pay_once' ? 'Bayar Sekali' : 'Berlangganan'}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
                      Rp{service.price ? service.price.toLocaleString() : '0'}
                    </Typography>
                  </Box>
                </Box>
                <Checkbox
                  checked={selectedServices.some((s) => s.id === service.id)}
                  onChange={() => toggleService(service)}
                  disabled={isBooked}
                />
              </Box>
            );
          })
        ) : (
          <Typography sx={{ textAlign: 'center', color: 'gray' }}>
            Tidak ada layanan tersedia
          </Typography>
        )}
      </DialogContent>

      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: '#000',
          color: '#fff',
          fontWeight: 'bold',
          p: 1.5,
          fontSize: 14,
          ':hover': { backgroundColor: '#333' },
        }}
        onClick={handleConfirm}
        disabled={selectedServices.length === 0}
      >
        Tambahkan
      </Button>
    </Dialog>
  );
}
