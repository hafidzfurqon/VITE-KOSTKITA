import { useState, useCallback } from 'react';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Iconify } from 'src/components/iconify';
import DialogDelete from 'src/component/DialogDelete';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { DialogUpdate } from 'src/component/DialogUpdate';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import {
  useMutationDeletePropertyRoomType,
  useMutationUpdatePropertyRoomType,
} from 'src/hooks/property-room-type';

// ----------------------------------------------------------------------

export type FacilitiesProps = {
  id?: undefined | any | number;
  name: string;
  properties: [];
  apartments: [
    {
      name: string;
    },
  ];
};

type FacilitiesTableRowProps = {
  row: FacilitiesProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function PropertyRoomTypeTableRow({ row, selected, onSelectRow }: FacilitiesTableRowProps) {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isPending: isPendingMutate } = useMutationUpdatePropertyRoomType(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fetch.property-type'] });
        setOpen(false);
        enqueueSnackbar('Tipe Kamar berhasil diupdate', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Tipe Kamar gagal diupdate', { variant: 'error' });
      },
    },
    row.id
  );

  const { mutate: DeleteFacilities, isPending } = useMutationDeletePropertyRoomType({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.property-type'] });
      setOpen(false);
      enqueueSnackbar('Tipe Kamar berhasil dihapus', { variant: 'success' });
    },
    onError: (err: any) => {
      enqueueSnackbar('Tipe Kamar gagal dihapus', { variant: 'error' });
    },
  });

  const handleSubmit = () => {
    DeleteFacilities(row.id);
  };
  const handleClickOpened = () => {
    setOpened(true);
  };
  const defaultValues = {
    name: row?.name || '',
  };

  const { register, handleSubmit: handleSubmitForm } = useForm({
    defaultValues,
  });
  // const { register, handleSubmit: submitEdit } = useForm();

  const FieldRHF = (
    <>
      <TextField
        {...register('name')}
        autoFocus
        required
        margin="dense"
        id="nama"
        label="Nama Tipe Kamar"
        type="text"
        fullWidth
        variant="outlined"
      />
    </>
  );

  const handleClose = () => {
    setOpened(false);
  };

  const handleCreate = (data: any) => {
    // console.log(data)
    mutate(data);
    handleClose();
  };
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell align="center">{row.name}</TableCell>
        <TableCell align="center">
          <Button onClick={handleClickOpened}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </Button>

          <Button onClick={handleClickOpen} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <DialogDelete
        title="yakin untuk menghapus Tipe Kamar ?"
        description="data yang telah di hapus tidak akan kembali"
        setOpen={setOpen}
        open={open}
        Submit={handleSubmit}
        pending={isPending}
      />
      <DialogUpdate
        pending={isPendingMutate}
        SubmitFormValue={handleCreate}
        open={opened}
        title="Update Nama Tipe Kamar"
        subTitle="Tipe Kamar untuk coliving maupun apartemen"
        setOpen={setOpened}
        field={FieldRHF}
        SubmitForm={handleSubmitForm}
      />
    </>
  );
}
