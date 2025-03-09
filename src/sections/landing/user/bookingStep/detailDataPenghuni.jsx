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

export default function DetailDataPenghuni({ open, onClose, data }) {
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
        {data?.booking_user_data?.length > 0 ? (
          data.booking_user_data.map((user, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              {data.booking_user_data.length > 1 && (
                <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                  Data Penghuni {index + 1}
                </Typography>
              )}
              <Typography variant="body1">
                <strong>Nama:</strong> {user.fullname}
              </Typography>
              <Typography variant="body1">
                <strong>Telepon:</strong> {user.phone_number}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1">
                <strong>No. KTP:</strong> {user.nomor_ktp}
              </Typography>
              <Typography variant="body1">
                <strong>NIK:</strong> {user.nik}
              </Typography>
              <Typography variant="body1">
                <strong>Jenis Kelamin:</strong> {user.gender}
              </Typography>
              <Typography variant="body1">
                <strong>Tanggal Lahir:</strong> {user.date_of_birth}
              </Typography>
            </div>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            Data penghuni tidak tersedia
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
