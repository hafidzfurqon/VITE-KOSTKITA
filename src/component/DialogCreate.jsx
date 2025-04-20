import React, { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  DialogActions,
  Stack,
  Slide,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function DialogCreate({
  SubmitForm,
  SubmitFormValue,
  title,
  subTitle,
  field,
  setOpen,
  pending,
  open,
  info,
  // coliving,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = 'auto'; // Mengembalikan scroll halaman
      document.getElementById('root')?.removeAttribute('aria-hidden'); // Hapus aria-hidden di root
    } else {
      document.body.style.overflow = 'hidden'; // Mencegah scroll saat modal terbuka
    }
  }, [open]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      onSubmit={SubmitForm(SubmitFormValue)}
      open={open}
      fullScreen={fullScreen}
      keepMounted
      TransitionComponent={Transition} // Tetap menggunakan Slide
      aria-describedby="alert-dialog-slide-description"
      onClose={handleClose}
      PaperProps={{
        component: 'form',
      }}
      disableScrollLock // Mencegah MUI mengunci scroll
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Alert severity="info" variant="outlined" sx={{ my: 3 }}>
          {info}
        </Alert>
        <Stack spacing={3}>{field}</Stack>
      </DialogContent>
      <DialogActions
        sx={{
          // display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center',
          px: 3,
          // gap: 1,
          pb: 3,
          // flexDirection: 'column',
        }}
      >
        <Button onClick={handleClose} fullWidth variant="contained">
          Batal
        </Button>
        <LoadingButton
          color="inherit"
          fullWidth
          variant="contained"
          loading={pending}
          type="submit"
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
