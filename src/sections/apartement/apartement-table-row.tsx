import { useState } from 'react';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Iconify } from 'src/components/iconify';
import DialogDelete from 'src/component/DialogDelete';

import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { Button, Typography } from '@mui/material';
import { useMutationDeleteApartement } from 'src/hooks/apartement';
import { Link } from 'react-router-dom';
import { router } from 'src/hooks/routing/useRouting';

// ----------------------------------------------------------------------

export type ApartmentProps = {
  id?: undefined | any | number;
  link_googlemaps: string;
  total_floors: string;
  type: string;
  slug: string;
  payment_type: string;
  name: string;
  state: {
    state_code: number;
    name: string;
  };
  start_price: string;
  address: string;
  files: [
    {
      file_url: string;
    },
  ];
  url_reference: string;
  status: string;
};

type ApartmentTableRowProps = {
  row: ApartmentProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function ApartementTableRow({ row, selected, onSelectRow }: ApartmentTableRowProps) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  console.log(row);
  const { mutate: DeleteApartement, isPending } = useMutationDeleteApartement({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.apartement'] });
      setOpen(false);
      enqueueSnackbar('Apartement berhasil dihapus', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('gagal menghapus apartement', { variant: 'error' });
    },
  });

  const handleSubmit = () => {
    DeleteApartement(row.id);
  };
  const renderCover = (
    <Box
      component="img"
      alt={row.name}
      src={row.files[0]?.file_url}
      sx={{
        top: 0,
        width: 100,
        height: 1,
        objectFit: 'cover',
        borderRadius: '10px',
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

        <TableCell align="center" component="th" scope="row">
          {/* <Box gap={2} display="flex" alignItems="center"> */}

          {renderCover}
          {/* </Box> */}
        </TableCell>

        <TableCell align="center">{row.name}</TableCell>
        <TableCell align="center">
          {row.status === 'available' ? (
            <>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
                <span>Available</span>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Iconify width={22} icon="solar:close-circle-bold" sx={{ color: 'error.main' }} />
                <span>Unavailable</span>
              </Box>
            </>
          )}
        </TableCell>

        <TableCell align="center">
          <Box>
            <Link to={`edit/${row.id}`}>
              <Button>
                <Iconify icon="solar:pen-bold" />
                Edit
              </Button>
            </Link>

            <Button onClick={handleClickOpen} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Link to={`${router.property.list}/${row.slug}`} target="_blank">
              <Button sx={{ color: 'secondary.main' }}>
                <Iconify icon="solar:eye-bold" />
                Lihat
              </Button>
            </Link>
            <Link to={`property-room/${row.id}`}>
              <Button sx={{ color: 'secondary.main' }}>
                <Iconify icon="mingcute:add-line" />
                Add Room
              </Button>
            </Link>
          </Box>
        </TableCell>
      </TableRow>

      <DialogDelete
        title="yakin untuk menghapus Property ?"
        description="data yang telah di hapus tidak akan kembali"
        setOpen={setOpen}
        open={open}
        Submit={handleSubmit}
        pending={isPending}
      />
    </>
  );
}
