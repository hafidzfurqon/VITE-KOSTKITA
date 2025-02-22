import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);
const Anothericon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/glass/${name}.svg`} />
);
const iconsNavbar = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/notification/${name}.svg`} />
);
const Kegiatanicon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/glass/${name}.svg`} />
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
    icon: iconsNavbar('ic-notification-package'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Banner',
    path: '/banner',
    icon: iconsNavbar('ic-notification-mail'),
  },
  {
    title: 'Property',
    path: '/property',
    icon: Anothericon('ic-glass-message'), 
    info: (
      <Label color="error" variant="inverted">
        🏠
      </Label>
    ), 
  },
  
  {
    title: 'promo',
    path: '/management-promo',
    icon:  Anothericon('ic-glass-buy'),
  },
  {
    title: 'Fasilitas',
    path: '/fasilitas',
    icon: Anothericon('ic-glass-bag'),
  },
];
