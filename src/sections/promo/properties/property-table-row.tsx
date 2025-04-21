import { useState } from 'react';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Iconify } from 'src/components/iconify';
import DialogDelete from 'src/component/DialogDelete';

import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { Button, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import { useMutationAddPromoProperty } from 'src/hooks/promo';
import { useAppContext } from 'src/context/user-context';

// ----------------------------------------------------------------------

export type ApartmentProps = {
  id?: undefined | any | number;
  link_googlemaps: string;
  promo_value: string;
  total_floors: string;
  type: string;
  slug: string;
  payment_type: string;
  name: string;
  promos: any;
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

type PropertyTableRowProps = {
  row: ApartmentProps;
  selected: boolean;
};

export function PropertyTableRow({ row, selected }: PropertyTableRowProps) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const { UserContextValue: authUser }: any = useAppContext();
  const { user } = authUser;
  console.log(row.promos);
  // Pastikan roles adalah array sebelum memanggil .some()
  const isOwnerProperty =
    Array.isArray(user?.roles) && user.roles.some((role: any) => role.name === 'owner_property');
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const promoId = Number(id); // Konversi ke number agar cocok dengan promo.id

  const isAlreadyInPromo = row.promos?.some((promo: any) => Number(promo.id) === promoId);

  console.log(`Checking Promo: ${row.name}, ID: ${promoId}, isAlreadyInPromo: ${isAlreadyInPromo}`);
  // const isAlreadyInPromo = row.promos?.some((promo: any) => promo.id === id);

  const { mutate: AddPromo, isPending } = useMutationAddPromoProperty(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fetch.apartement'] });
        setOpen(false);
        enqueueSnackbar(`Property ${row.name} Berhasil ditambahkan promo`, { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('gagal menambahkan promo', { variant: 'error' });
      },
    },
    id,
    isOwnerProperty
  );

  const handleSubmit = () => {
    AddPromo(row.id);
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
        <TableCell align="center" component="th" scope="row">
          {renderCover}
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
          <Button
            disabled={Boolean(isAlreadyInPromo)} // Pastikan boolean benar diterapkan
            onClick={handleClickOpen}
            sx={{ color: 'primary.main' }}
          >
            <Iconify icon="mingcute:add-line" />
            Tambahkan Ke Promo
          </Button>
        </TableCell>
      </TableRow>

      <DialogDelete
        title="Tambahkan Property ini ke promo ?"
        description="setelah anda menekan Yakin, Maka property akan diberikan promo"
        setOpen={setOpen}
        color={'orange'}
        open={open}
        Submit={handleSubmit}
        pending={isPending}
      />
    </>
  );
}
