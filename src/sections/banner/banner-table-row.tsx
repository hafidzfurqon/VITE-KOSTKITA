import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import DialogDelete from 'src/component/DialogDelete';
import { useDeleteBanner,useUpdateBanner } from 'src/hooks/banner';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { Button } from '@mui/material';

// ----------------------------------------------------------------------

export type UserProps = {
  id?: undefined | any | number;
  title: string;
  name : string;
  image_path : string;
  image_url : string;
  url_reference: string;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function BannerTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [openEdit, setOpenEdit] = useState(false);

  const [open, setOpen] = useState(false);
   const handleClickOpen = () => {
    setOpen(true)
   }
   const handleEditOpen = () => {
    setOpenEdit(true);
    // handleClosePopover();
  };
 
  // console.log(row)
  const { mutate: DeleteBanner, isPending } = useDeleteBanner({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.banner'] });
      setOpen(false);
      enqueueSnackbar('Banner berhasil dihapus', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('gagal menghapus banner', { variant: 'error' });
    },
  });

  const { mutate: UpdateBanner, isPending: isLoading } = useUpdateBanner({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.banner'] });
      setOpen(false);
      enqueueSnackbar('Banner berhasil diupdate', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('gagal mengupdate banner', { variant: 'error' });
    },
  });

  const handleSubmit = () => {
    DeleteBanner(row.id)
  }
  const renderCover = (
    <Box
      component="img"
      alt={row.name}
      src={row.image_url}
      sx={{
        top: 0,
        width: 100,
        height: 1,
        objectFit: 'cover',
        borderRadius : '10px'
        // position: 'absolute',
      }}
    />
  );

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align='center' component="th" scope="row">
          {/* <Box gap={2} display="flex" alignItems="center"> */}
            
          {renderCover}
          {/* </Box> */}
        </TableCell>

        <TableCell align='center'>{row.title}</TableCell>


<TableCell align="center">
        <Button onClick={handleEditOpen}>
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
      title="yakin untuk menghapus banner ?"
       description="data yang telah di hapus tidak akan kembali"
       setOpen={setOpen}
       open={open}
       Submit={handleSubmit}
       pending={isPending}
      />
    </>
  );
}
