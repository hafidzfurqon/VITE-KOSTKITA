import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Slide,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { forwardRef } from 'react';

// Animasi Slide dari bawah dengan lebih smooth
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} timeout={500} {...props} />;
});

const FacilityModal = ({ isOpen, onClose, title, facilities }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      BackdropProps={{ style: { backgroundColor: 'transparent' } }} // Hilangkan background gelap
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 3, // Membuat modal lebih modern
          boxShadow: 3, // Tambahkan efek bayangan ringan
          transform: isOpen ? 'scale(1)' : 'scale(0.95)', // Animasi muncul lebih smooth
          transition: 'transform 0.3s ease-in-out',
        },
      }}
    >
      <DialogTitle>
        {title}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          mt: 2,
          opacity: isOpen ? 1 : 0.8,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {facilities.map((category, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              {category.icon && <category.icon />} {category.name}
            </Typography>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default FacilityModal;
