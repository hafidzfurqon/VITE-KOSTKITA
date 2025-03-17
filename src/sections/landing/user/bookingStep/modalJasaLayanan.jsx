import { useState } from 'react';
import { Checkbox, Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';  

export default function ModalJasaLayanan({ open, onClose, onSubmit }) {
  const [services, setServices] = useState([]);

  const toggleService = (service) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const serviceCategories = [
    {
      title: 'Parkir Mobil',
      services: [{ name: 'Car Parking', price: 'Rp300.000/bulan', type: 'Berlangganan' }],
    },
    {
      title: 'Parkir Motor',
      services: [
        {
          name: 'Parking - Motorbike',
          price: 'Rp100.000/bulan',
          type: 'Berlangganan',
          description: 'Hanya diperbolehkan membawa 1 motor per kamar',
        },
      ],
    },
    {
      title: 'Laundry',
      services: [
        { name: 'Extra Laundry 1 Kg (OTP)', price: 'Rp10.000', type: 'Bayar sekali' },
        { name: 'Extra Laundry 2 Kg (OTP)', price: 'Rp20.000', type: 'Bayar sekali' },
        { name: 'Extra Laundry 3 Kg (OTP)', price: 'Rp30.000', type: 'Bayar sekali' },
      ],
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      BackdropProps={{ style: { backgroundColor: 'transparent' } }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Efek shadow ringan
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
        {serviceCategories.map((category) => (
          <div key={category.title} style={{ marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>{category.title}</h3>
            {category.services.map((service) => (
              <div
                key={service.name}
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
                    {service.type}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{service.price}</span>
                </div>
                <Checkbox
                  checked={services.includes(service.name)}
                  onChange={() => toggleService(service.name)}
                />
              </div>
            ))}
          </div>
        ))}
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
          onSubmit(services);
          onClose();
        }}
      >
        Simpan
      </Button>
    </Dialog>
  );
}
