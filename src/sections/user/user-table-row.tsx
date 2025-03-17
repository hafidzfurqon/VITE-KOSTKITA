import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { Iconify } from 'src/components/iconify';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useMutationDeleteUser } from 'src/hooks/users/mutation';
import DialogDelete from 'src/component/DialogDelete';

// ----------------------------------------------------------------------

export type UserProps = {
  id: any;
  name: string;
  roles: { name: string }[];
  email: string;
  phone_number: string;
  status: string;
  company: string;
  avatarUrl: string;
  photo_profile_path: string;
  photo_profile_url: string;
  isVerified: boolean;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const handleClickOpen = () => {
    setOpen(true)
   }
   const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const role_name = row.roles.map((role: any) => role.name);

  const { mutate: DeleteUser, isPending } = useMutationDeleteUser({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['all.users'] });
        setOpen(false);
        enqueueSnackbar('User berhasil dihapus', { variant: 'success' });
      },
      onError: (err : any) => {
        enqueueSnackbar('User gagal dihapus', { variant: 'error' });
      },
    });
  
    const handleSubmit = () => {
      DeleteUser(row.id)
    }
    
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.name} src={row.photo_profile_url} />
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.email}</TableCell>

        <TableCell>{row.phone_number}</TableCell>

        <TableCell>{role_name[0]}</TableCell>

        <TableCell align="center">
          <Button>
            <Iconify icon="solar:pen-bold" />
            Edit
          </Button>

          <Button sx={{ color: 'error.main' }} onClick={handleClickOpen}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <DialogDelete 
            title="yakin untuk menghapus user ?"
             description="data yang telah di hapus tidak akan kembali"
             setOpen={setOpen}
             open={open}
             Submit={handleSubmit}
             pending={isPending}
            />
    </>
  );
}
