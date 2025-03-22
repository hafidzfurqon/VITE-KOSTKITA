import { useState } from 'react';
import {
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function ModalDataPenghuni({ open, onClose, data }) {
  console.log(data);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      BackdropProps={{ style: { backgroundColor: 'transparent' } }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          padding: '16px',
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: -1,
          top: -1,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Detail Data Penghuni
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '60vh' }}>
        {data ? (
          <>
            <Typography variant="body1">
              <strong>Nama:</strong> {data.fullname}
            </Typography>
            <Typography variant="body1">
              <strong>Telepon:</strong> {data.phone_number}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {data.email}
            </Typography>
            <Typography variant="body1">
              <strong>No. KTP:</strong> {data.nomor_ktp}
            </Typography>
            <Typography variant="body1">
              <strong>NIK:</strong> {data.nik}
            </Typography>
            <Typography variant="body1">
              <strong>Jenis Kelamin:</strong> {data.gender}
            </Typography>
            <Typography variant="body1">
              <strong>Tanggal Lahir:</strong> {data.date_of_birth}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Data penghuni tidak tersedia
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
