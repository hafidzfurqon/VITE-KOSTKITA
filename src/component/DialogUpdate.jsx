import { Dialog, DialogContent, DialogTitle, DialogContentText,Button, DialogActions, Stack } from '@mui/material';

export function DialogUpdate({
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
        <Button type="submit">{pending ? 'Updating' : 'Update'}</Button>
      </DialogActions>
    </Dialog>
  );
}
