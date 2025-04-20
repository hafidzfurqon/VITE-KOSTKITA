import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Box, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Iconify } from 'src/components/iconify';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'notistack';
import { useMutationStatusVisitUser } from 'src/hooks/visit-property';
import { BadgeComponent } from 'src/component/BadgeComponent';

export type BookedProps = {
  id?: undefined | any | number;
  name: string;
  status: string;
  check_out: string;
  visit_code: string;
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

type PropertyDetailTableRowProps = {
  row: BookedProps;
  selected: boolean;
  onSelectRow: () => void;
  booked: any;
};

export function DataDetailPropertyVisitTableRow({
  booked,
  row,
  selected,
  onSelectRow,
}: PropertyDetailTableRowProps) {
  const today = new Date(); // Ambil tanggal hari ini
  const checkOutDate = new Date(row.check_out); // Konversi check_out ke Date
  const [loadingAction, setLoadingAction] = useState<{ id: string; status: string } | null>(null);

  // Hitung selisih hari
  const queryClient = useQueryClient();
  const routers = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate, isPending } = useMutationStatusVisitUser({
    onSuccess: ({ data }: any) => {
      const { data: data_booking } = data;
      console.log(data_booking);
      queryClient.invalidateQueries({ queryKey: ['get.detail', data_booking.id] });
      routers.push(`/visit/data-visit/${data_booking.property_id}`);
      enqueueSnackbar(`Status Berhasil di ${data_booking.status}`, { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Status Gagal di update', { variant: 'error' });
    },
  });

  const handleChangeStatus = (booking_id: string, status: string) => {
    setLoadingAction({ id: booking_id, status }); // Simpan ID dan aksi
    const formData: any = new FormData();
    formData.append('visit_id', booking_id);
    formData.append('_method', 'PUT');
    formData.append('status', status);
    mutate(formData, {
      onSettled: () => {
        setLoadingAction(null); // Reset setelah selesai
      },
    });
  };
  const timeDiff = checkOutDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Konversi ke hari

  // Tentukan warna badge berdasarkan sisa hari
  let badgeColor: 'success' | 'error' | 'warning' = 'success'; // Hijau (default)
  if (row.status === 'pending')
    badgeColor = 'warning'; // Merah
  else if (daysLeft <= 20) badgeColor = 'warning'; // Kuning

  // Nomor WhatsApp
  const phoneNumber = row.user.phone_number || '085183311656'; // Pakai nomor user jika ada
  const waLink = `https://wa.me/${phoneNumber}`;

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
      </TableCell>
      <TableCell align="center">{row.user.name}</TableCell>
      <TableCell align="center">{row.user.phone_number}</TableCell>
      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
        <BadgeComponent title={row.status} />
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button
            component={Link}
            to={`/visit/visit-property/detail/admin/${row.visit_code}`}
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
                  loading={loadingAction?.id === row.id && loadingAction?.status === 'rejected'}
                  onClick={() => handleChangeStatus(row.id, 'rejected')}
                >
                  <Iconify icon="healthicons:no" />
                </LoadingButton>
              </Tooltip>

              <Tooltip title="Terima Pengguna">
                <LoadingButton
                  sx={{ color: 'success.main' }}
                  loading={loadingAction?.id === row.id && loadingAction?.status === 'approved'}
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
