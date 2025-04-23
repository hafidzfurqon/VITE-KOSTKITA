import { DateRange, ReceiptLongOutlined } from '@mui/icons-material';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
// import { ReceiptLong } from '@mui/icons-material';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Banner',
    path: '/banner',
    icon: <Iconify icon="mdi:image" />, // Ikon gambar untuk banner
  },
  {
    title: 'Management Property',
    path: '/property',
    icon: <Iconify icon="mdi:home" />, // Ikon rumah untuk properti
    info: (
      <Label color="error" variant="inverted">
        🏠
      </Label>
    ),
    children: [
      {
        title: 'Property',
        path: '/property',
        icon: <Iconify icon="mdi:hospital" />, // Ikon kategori untuk tipe properti
      },
      {
        title: 'Property Tipe',
        path: '/management-property-type',
        icon: <Iconify icon="material-symbols:category" />, // Ikon kategori untuk tipe properti
      },
      {
        title: 'Fasilitas Bersama',
        path: '/fasilitas',
        icon: <Iconify icon="mdi:office-building" />, // Ikon bangunan untuk fasilitas bersama
      },
    ],
  },
  {
    title: 'Managemen Ruangan',
    path: '#',
    icon: <Iconify icon="mdi:bed" />, // Ikon tempat tidur untuk fasilitas kamar
    children: [
      {
        title: 'Fasilitas Ruangan',
        path: '/room-facility',
      },
      {
        title: 'Tipe Ruangan',
        path: '/room-type',
      },
    ],
  },
  {
    title: 'Promo',
    path: '/management-promo',
    icon: <Iconify icon="mdi:tag" />, // Ikon tag untuk promo
  },
  {
    title: 'Property TerBooking',
    path: '/booked-property',
    icon: <Iconify icon="mdi:calendar-check" />, // Ikon kalender dengan tanda centang untuk properti yang dibooking
  },
  {
    title: 'Layanan Tambahan',
    path: '/services',
    icon: icon('ic-cart'),
  },
  {
    title: 'Kunjungan',
    path: '/visit',
    icon: <DateRange />,
  },
  {
    title: 'Input Transaksi',
    path: '#',
    icon: <ReceiptLongOutlined />,
    children: [
      {
        title: 'List Transaksi',
        path: '/transaction/list-transaction',
        icon: <Iconify icon="mdi:hospital" />, // Ikon kategori untuk tipe properti
      },
      {
        title: 'Input Transaksi',
        path: '/transaction/add-transaction',
        icon:  <ReceiptLongOutlined />, // Ikon kategori untuk tipe properti
      },
    ],
  },
];
