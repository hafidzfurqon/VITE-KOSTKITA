import { DateRange } from '@mui/icons-material';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

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
    title: 'Property Tipe',
    path: '/management-property-type',
    icon: <Iconify icon="material-symbols:category" />, // Ikon kategori untuk tipe properti
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
    title: 'Property',
    path: '/property',
    icon: <Iconify icon="mdi:home" />, // Ikon rumah untuk properti
    info: (
      <Label color="error" variant="inverted">
        🏠
      </Label>
    ),
  },
  {
    title: 'Promo',
    path: '/management-promo',
    icon: <Iconify icon="mdi:tag" />, // Ikon tag untuk promo
  },
  {
    title: 'Fasilitas Bersama',
    path: '/fasilitas',
    icon: <Iconify icon="mdi:office-building" />, // Ikon bangunan untuk fasilitas bersama
  },
  {
    title: 'Fasilitas Ruangan',
    path: '/room-facility',
    icon: <Iconify icon="mdi:bed" />, // Ikon tempat tidur untuk fasilitas kamar
  },
  {
    title: 'Tipe Ruangan',
    path: '/room-type',
    icon: <Iconify icon="mdi:door-open" />, // Ikon tempat tidur untuk fasilitas kamar
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
];
