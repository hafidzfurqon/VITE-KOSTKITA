import { LoadingButton } from '@mui/lab';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Dialog,
} from '@mui/material';

export default function DialogDelete({
  title,
  description,
  Submit,
  open,
  setOpen,
  pending,
  color,
}: any) {
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    Submit();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          mx: 1.5,
          py: 2,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            bgcolor: 'white',
            color: 'black',
          }}
        >
          Batal
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          sx={{
            bgcolor: color ? color : 'red',
            color: 'white',
            '&:hover': {
              bgcolor: 'red',
            },
          }}
        >
          {pending ? 'Loading...' : 'Yakin'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
