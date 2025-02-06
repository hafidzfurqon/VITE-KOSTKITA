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
import { useDeleteBanner } from 'src/hooks/banner';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export type UserProps = {
  id?: string | undefined | any;
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
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  const [open, setOpen] = useState(false);
   const handleClickOpen = () => {
    setOpen(true)
   }
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
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

  const handleSubmit = () => {
    // console.log(row.id)
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

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            
          {renderCover}
          </Box>
        </TableCell>

        <TableCell>{row.title}</TableCell>

        {/* <TableCell>{row.phone_number}</TableCell> */}

        {/* <TableCell align="center">
          {row.isVerified ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            '-'
          )}
        </TableCell> */}

        {/* <TableCell>
          <Label color={(row.status === 'banned' && 'error') || 'success'}>{row.status}</Label>
        </TableCell> */}

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClickOpen} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
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
