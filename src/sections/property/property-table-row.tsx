import { useState, useCallback } from 'react';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import DialogDelete from 'src/component/DialogDelete';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { DialogUpdate } from 'src/component/DialogUpdate';

import { Button, TextField } from '@mui/material';

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  useMutationDeleteFacilities,
  useMutationUpdatePropertyType,
} from 'src/hooks/property_type';

// ----------------------------------------------------------------------

export type UserProps = {
  id?: undefined | any | number;
  name: string; // 'Nama Properti'
  city: {
    name: string;
  }; // 'Nama Properti'
  state: {
    name: string;
  }; // 'Nama Properti'
  type: string; // 'Tipe'
  address: string; // 'Alamat'
  link_googlemaps: string; // 'Google Maps'
  description: string; // 'Deskripsi'
  status: string; // 'Status'
  start_price: number; // 'Harga'
  action?: string; // 'Action' (opsional, karena biasanya ini berupa tombol)
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function PropertyTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isPending: isPendingMutate } = useMutationUpdatePropertyType(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fetch.property_type'] });
        setOpen(false);
        enqueueSnackbar('Tipe Property berhasil diupdate', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Tipe Property gagal diupdate', { variant: 'error' });
      },
    },
    row.id
  );

  const { mutate: DeleteFacilities, isPending } = useMutationDeleteFacilities({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.property_type'] });
      setOpen(false);
      enqueueSnackbar('Tipe Property berhasil dihapus', { variant: 'success' });
    },
    onError: (err: any) => {
      enqueueSnackbar('Tipe Property gagal dihapus', { variant: 'error' });
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
        label="Nama Tipe Property"
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
        title="yakin untuk menghapus tipe property ?"
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
        title="Update Nama Tipe Property"
        subTitle="Tipe Property untuk coliving maupun apartemen"
        setOpen={setOpened}
        field={FieldRHF}
        SubmitForm={handleSubmitForm}
      />
    </>
  );
}
