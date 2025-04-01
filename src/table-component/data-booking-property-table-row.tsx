import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Box, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

export type BookedProps = {
  id?: undefined | any | number;
  name: string;
  check_out: string;
  booking_code: string;
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

export function BookedDetailPropertyTableRow({
  booked,
  row,
  selected,
  onSelectRow,
}: BookedTableRowProps) {
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

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
      </TableCell>
      <TableCell align="center">{row.user.name}</TableCell>
      <TableCell align="center">{row.user.phone_number}</TableCell>
      <TableCell align="center">
        {row.check_out ? (
          <Chip label={`${daysLeft} hari lagi`} color={badgeColor} />
        ) : (
          'Tidak ada data'
        )}
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
        </Box>
      </TableCell>
    </TableRow>
  );
}
