import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import AccountGeneral from '../account-general';
import AccountChangePassword from '../account-change-password';
import { bgGradient } from 'src/theme/css';
import { alpha, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useSettingsContext } from 'src/components/settings/context';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'Akun',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'security',
    label: 'Ganti password',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();
  const theme = useTheme();

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          ...bgGradient({
            color: alpha(
              theme.palette.background.paper,
              theme.palette.mode === 'light' ? 0.8 : 0.8
            ),
            imgUrl: '/assets/background/overlay_4.jpg',
          }),
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position: 'absolute',
          filter: 'blur(200px)',
          WebkitFilter: 'blur(200px)',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      />
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Profil"
          links={[{ name: 'Home', href: "/" }, { name: 'Profil' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {currentTab === 'general' && <AccountGeneral />}

        {/* {currentTab === 'notifications' && <AccountNotifications />} */}

        {currentTab === 'security' && <AccountChangePassword />}
      </Container>
    </Box>
  );
}
