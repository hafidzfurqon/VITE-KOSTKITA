import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  DialogActions,
  Stack,
} from '@mui/material';

export function DialogDetail({ title, subTitle, setOpen, data, open }) {
  console.log('Status DialogDetail:', open);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'div',
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>{subTitle}</DialogContentText>
        <Stack spacing={3}>{data}</Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <Button onClick={handleClose} variant="outlined">
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
