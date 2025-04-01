import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  DialogActions,
  Stack,
} from '@mui/material';

export function DialogCreate({
  SubmitForm,
  SubmitFormValue,
  title,
  subTitle,
  field,
  setOpen,
  pending,
  open,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      onSubmit={SubmitForm(SubmitFormValue)}
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>{subTitle}</DialogContentText>
        <Stack spacing={3}>{field}</Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <LoadingButton color="inherit" variant="contained" loading={pending} type="submit">
          Buat
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
