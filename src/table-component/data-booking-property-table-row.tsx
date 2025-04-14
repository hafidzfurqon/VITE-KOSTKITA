import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Box, Button, Chip, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { useMutationStatusBookingUser } from 'src/hooks/booking_admin/useMutationStatusBookingUser';
import { BadgeComponent } from 'src/component/BadgeComponent';
import { LoadingButton } from '@mui/lab';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

export type BookedProps = {
  id?: undefined | any | number;
  name: string;
  check_out: string;
  booking_code: string;
  status: string;
  user: {
    name: string;
    phone_number: number;
    email: string;
  };
  properties: [];
  apartments: [
    {
      name: string;
    },
  ];
};

type BookedTableRowProps = {
  row: BookedProps;
  selected: boolean;
  onSelectRow: () => void;
  booked: any;
};

export function BookedDetailPropertyTableRow({ row, selected, onSelectRow }: BookedTableRowProps) {
  const today = new Date(); // Ambil tanggal hari ini
  // if (!row.check_out) {
  //   return '';
  // }
  const checkOutDate = new Date(row.check_out); // Konversi check_out ke Date

  // Hitung selisih hari
  const timeDiff = checkOutDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Konversi ke hari

  // Tentukan warna badge berdasarkan sisa hari
  let badgeColor: 'success' | 'error' | 'warning' = 'success'; // Hijau (default)
  if (daysLeft <= 10)
    badgeColor = 'error'; // Merah
  else if (daysLeft <= 20) badgeColor = 'warning'; // Kuning

  // Nomor WhatsApp
  const phoneNumber = row.user.phone_number || '085183311656'; // Pakai nomor user jika ada
  const waLink = `https://wa.me/${phoneNumber}`;
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const routers = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate, isPending } = useMutationStatusBookingUser({
    onSuccess: ({ data }: any) => {
      const { data: data_booking } = data;
      console.log(data_booking);
      queryClient.invalidateQueries({ queryKey: ['get.detail', data_booking.id] });
      routers.push(`/booked-property/data-booking/${data_booking.property_id}`);
      enqueueSnackbar(`Status Berhasil di ${data_booking.status}`, { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Status Gagal di update', { variant: 'error' });
    },
  });

  const handleChangeStatus = (booking_id: string, status: string) => {
    setLoadingId(booking_id); // set ID booking yang sedang loading
    const formData: any = new FormData();
    formData.append('booking_id', booking_id);
    formData.append('status', status);
    mutate(formData, {
      onSettled: () => {
        setLoadingId(null); // reset setelah selesai
      },
    });
  };

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
      </TableCell>
      <TableCell align="center">{row.user.name}</TableCell>
      {/* <TableCell align="center">{row.booking_date}</TableCell> */}
      <TableCell align="center">{row.user.phone_number}</TableCell>
      <TableCell align="center">
        {row.status != 'pending' ? (
          <Chip label={row.check_out ? `${daysLeft} hari lagi` : 'Waiting'} color={badgeColor} />
        ) : (
          'Waiting...'
        )}
      </TableCell>
      <TableCell align="center">
        <BadgeComponent title={row.status} />
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button
            component={Link}
            to={`/booked-property/booking/detail/admin/${row.booking_code}`}
            variant="contained"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Lihat Detail
          </Button>
          &nbsp;
          <Button
            component="a"
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="success"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Chat WhatsApp
          </Button>
          {row.status === 'pending' ? (
            <>
              <Tooltip title="Tolak Pengguna">
                <LoadingButton
                  sx={{ color: 'error.main' }}
                  loading={loadingId === row.id}
                  onClick={() => handleChangeStatus(row.id, 'rejected')}
                >
                  <Iconify icon="healthicons:no" />
                </LoadingButton>
              </Tooltip>

              <Tooltip title="Terima Pengguna">
                <LoadingButton
                  sx={{ color: 'success.main' }}
                  loading={loadingId === row.id}
                  onClick={() => handleChangeStatus(row.id, 'approved')}
                >
                  <Iconify icon="healthicons:yes" />
                </LoadingButton>
              </Tooltip>
            </>
          ) : (
            ''
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}
