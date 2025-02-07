import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);
const Anothericon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/glass/${name}.svg`} />
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
    title: 'Banner',
    path: '/banner',
    icon: Anothericon('ic-glass-message'),
  },
  {
    title: 'Property',
    path: '/property',
    icon: Anothericon('ic-glass-message'),  
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Hunian',
    path: '/products',
    icon: Kegiatanicon('ic-glass-users'),
    info: (
      <Label color="error" variant="inverted">
        🏠
      </Label>
    ),
  },
  {
    title: 'apartement',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Fasilitas',
    path: '/fasilitas',
    icon:   Anothericon('ic-glass-bag'),
  },
];
