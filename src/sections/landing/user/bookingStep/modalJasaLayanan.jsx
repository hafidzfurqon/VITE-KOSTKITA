import { useState, useEffect } from 'react';
import { Checkbox, Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFetchServiceUser } from 'src/hooks/users/useFetchServiceUser';

export default function ModalJasaLayanan({ open, onClose, onSubmit }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const { data } = useFetchServiceUser();

  // Pastikan data ada sebelum diakses
  const services = data?.data || [];

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      BackdropProps={{ style: { backgroundColor: 'transparent' } }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          padding: '16px',
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
            right: -10,
            top: -15,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                borderBottom: '1px solid #ddd',
              }}
            >
              <div>
                <p style={{ margin: '0', fontWeight: 'bold' }}>{service.name}</p>
                {service.description && (
                  <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                    {service.description}
                  </p>
                )}
                <span
                  style={{
                    fontSize: '12px',
                    color: '#fff',
                    backgroundColor: '#2196F3',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginRight: '8px',
                  }}
                >
                  {service.payment_type === 'pay_once' ? 'Bayar Sekali' : 'Berlangganan'}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  Rp{service.price.toLocaleString()}
                </span>
              </div>
              <Checkbox
                checked={selectedServices.includes(service.id)}
                onChange={() => toggleService(service.id)}
              />
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>Tidak ada layanan tersedia</p>
        )}
      </DialogContent>

      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: '#000',
          color: '#fff',
          fontWeight: 'bold',
          padding: '12px',
          fontSize: '14px',
          ':hover': { backgroundColor: '#333' },
        }}
        onClick={() => {
          onSubmit({ additional_services: selectedServices });
          onClose();
        }}
      >
        Simpan
      </Button>
    </Dialog>
  );
}
