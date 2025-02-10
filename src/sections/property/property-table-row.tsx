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
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { DialogUpdate } from 'src/component/DialogUpdate';
import { useDeleteProperty, useUpdateProperty } from 'src/hooks/property';
import { Typography } from '@mui/material';
import { Tooltip } from '@mui/material';


// ----------------------------------------------------------------------

export type UserProps = {
    id?: undefined | any | number;
    name: string; // 'Nama Properti'
    city: string; // 'Nama Properti'
    state: string; // 'Nama Properti'
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
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openEdit, setOpenEdit] = useState(false);


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
   const handleEditOpen = () => {
    setOpenEdit(true);
    handleClosePopover();
  };
 
  // console.log(row)
  const { mutate: DeleteProperty, isPending } = useDeleteProperty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.property'] });
      setOpen(false);
      enqueueSnackbar('Banner berhasil dihapus', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('gagal menghapus property', { variant: 'error' });
    },
  });

  const { mutate: UpdateBanner, isPending: isLoading } = useUpdateProperty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.property'] });
      setOpen(false);
      enqueueSnackbar('Banner berhasil diupdate', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('gagal mengupdate property', { variant: 'error' });
    },
  });

  const handleSubmit = () => {
    DeleteProperty(row.id)
  }
  // const renderCover = (
  //   <Box
  //     component="img"
  //     alt={row.name}
  //     src={row.image_url}
  //     sx={{
  //       top: 0,
  //       width: 100,
  //       height: 1,
  //       objectFit: 'cover',
  //       borderRadius : '10px'
  //       // position: 'absolute',
  //     }}
  //   />
  // );

  return (
    <>
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
      </TableCell>

      {/* <TableCell>
        <Box
          component="img"
          src={row.image_url}
          alt={row.name}
          sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover' }}
        />
      </TableCell> */}

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {row.name}
        </Typography>
      </TableCell>
      <TableCell>{row.type}</TableCell>
      <TableCell>{row.address}</TableCell>
      <TableCell>{row.state?.name}</TableCell>
      <TableCell>{row.city?.name}</TableCell>
      <TableCell>
        <a href={row.link_googlemaps} target="_blank" rel="noopener noreferrer">
          Lihat di Maps
        </a>
      </TableCell>
      {/* <TableCell>
        <Typography variant="body2" sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {row.description}
        </Typography>
      </TableCell> */}

<TableCell>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box 
      sx={{ 
        width: 10, 
        height: 10, 
        borderRadius: '50%', 
        
        bgcolor: row.status === 'available' ? 'green' : 'red', 
        mr: 1 
      }} 
    />
    <Typography color={row.status === 'available' ? 'green' : 'red'}>
      {row.status}
    </Typography>
  </Box>
</TableCell>


      {/* <TableCell>Rp {row.start_price.toLocaleString()}</TableCell> */}

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
      <MenuList sx={{ p: 1 }}>
        <MenuItem onClick={() => setOpenEdit(true)}>
          <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} /> Edit
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
