import { useState, useEffect, useCallback } from 'react';
import { router } from 'src/hooks/routing/useRouting';

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Link as MuiLink,
  Paper,
  SvgIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import { Label } from 'src/components/label';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HistoryIcon from '@mui/icons-material/History';
import { Link, useNavigate } from 'react-router-dom';
import { useResponsive } from 'src/hooks/use-responsive';
import Logo from '../../../public/assets/images/logo.png';
import { usePathname, useRouter } from 'src/routes/hooks';
import { AccountPopover } from 'src/layouts/components/account-popover';
import { useAppContext } from 'src/context/user-context';
import { useMutationLogout } from 'src/hooks/auth/useMutationLogout';
import DialogDelete from 'src/component/DialogDelete';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import {
  BookmarkBorderOutlined,
  Dashboard,
  DashboardRounded,
  ExpandMore,
  Person,
  Person2Outlined,
  PersonPinCircle,
  PersonPinCircleOutlined,
  SpaceBarTwoTone,
} from '@mui/icons-material';
import { useFetchNontification } from 'src/hooks/users/profile/useFetchNontification';
import { Notifications } from 'src/layouts/account/notification';
import { useBoolean } from 'src/hooks/use-boolean';
import { Fade } from '@mui/material';
import { NavMobileLanding } from 'src/layouts/landing/nav';
import { Iconify } from 'src/components/iconify';
import { Badge } from '@mui/material';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallScreen = useResponsive('down', 'md'); // Deteksi layar kecil
  const [navBg, setNavBg] = useState('transparent');
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk status login
  const { UserContextValue: authUser } = useAppContext();
  const [color, setColor] = useState('white');
  const { user } = authUser;
  const userId = user?.id;
  const isHome = pathname === '/';
  // console.log(userId)
  const isAdmin = user?.roles?.some((role) => role.name.toLowerCase() === 'admin');
  const isOwner = user?.roles?.some((role) => role.name === 'owner_property');
  console.log(user)
  const { data: _notifications, isLoading, isError } = useFetchNontification(userId);
  // console.log(notifications);
  const mapNotifications = (data = []) => {
    return data.map((item) => ({
      id: item.id,
      title: item.data?.title || 'Notifikasi',
      isUnRead: item.read_at === null,
      description: item.data?.message || '',
      avatarUrl: item.data?.image || null,
      postedAt: item.created_at,
    }));
  };

  const notifications = mapNotifications(_notifications?.data || []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token && user); // Harus ada token dan user untuk dianggap login
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setColor('black');
        setNavBg('rgba(255, 255, 255, 0.9)'); // Warna abu ke putih saat di-scroll
      } else {
        setNavBg('transparent'); // Transparan saat di atas
        setColor('white');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  // Daftar menu navigasi (ikon hanya muncul di layar kecil)
  const navItems = [
    { label: 'Sewa', icon: <HomeIcon />, path: '/' },
    {
      label: 'Kerjasama Properti',

      children: [
        {
          label: 'Semua Kerjasama Properti',
          path: '/kerja-sama',
          icon: <PersonPinCircleOutlined />,
        },
        {
          label: 'Kerjasama Properti Coliving',
          path: '/kerja-sama-coliving',
          icon: <PersonPinCircleOutlined />,
        },
      ],
    },
    // { label: 'For Business', icon: <BusinessIcon />, path: '/bussines' },
    { label: 'Tentang KostKita', icon: <InfoIcon />, path: '/about-us' },
    user?.roles?.length > 0 && {
      label: 'Wishlist',
      icon: <BookmarkBorderOutlined />,
      path: '/wishlist',
    },
    { label: 'F.A.Q', icon: <InfoIcon />, path: '/faq' },
  ];

  const navMobileData = [];

  if (isAdmin || isOwner) {
    navMobileData.push({ title: 'Dashboard', icon: <Dashboard />, path: '/dashboard' });
  }

  navMobileData.push({ title: 'Sewa', icon: <HomeIcon />, path: '/' });

  if (!isAdmin && !isOwner) {
    navMobileData.push(
      { title: 'Riwayat Booking', path: '/history/booking', icon: <HistoryIcon /> },
      { title: 'Riwayat Visit', path: '/history/visit', icon: <HistoryIcon /> }
    );
  }

  navMobileData.push(
    {
      title: 'Kerjasama Properti',
      icon: <HandshakeIcon />,
      path: '/kerja',
      children: [
        {
          title: 'Semua Kerjasama Properti',
          path: '/kerja-sama',
          icon: <PersonPinCircleOutlined />,
        },
        {
          title: 'Kerjasama Properti Coliving',
          path: '/kerja-sama-coliving',
          icon: <PersonPinCircleOutlined />,
        },
      ],
    },
    { title: 'Tentang KostKita', icon: <InfoIcon />, path: '/about-us' },
    { title: 'FAQ', icon: <InfoIcon />, path: '/faq' }
  );
  if (user?.roles?.length > 0) {
    navMobileData.push(
      {
        title: 'Notifikasi',
        icon: (
          <Badge
            badgeContent={notifications.filter((item) => item.isUnRead === true).length}
            color="error"
          >
            <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
          </Badge>
        ),
        path: '/notification',
      },
      { title: 'Wishlist', icon: <BookmarkBorderOutlined />, path: '/wishlist' }
    );
  }

  const nav = useBoolean();
  useEffect(() => {
    if (nav.value) {
      nav.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <AppBar
      position="fixed"
      sx={{
        background: navBg,
        backdropFilter: 'blur(10px)',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        px: 2,
        transition: 'background 0.3s ease-in-out',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }} p={1}>
          <Link to="/">
            <img src={Logo} alt="Logo" width={150} style={{ filter: 'brightness(1.2)' }} />
          </Link>

          {/* Navigation (Hanya tampil di layar besar) */}
          {!isSmallScreen && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                position: 'relative',
              }}
            >
              {navItems.map((item, index) => {
                const isActive = item.path === pathname;

                const handleMouseEnter = () => {
                  if (item.children) setHoveredItem(item.label);
                };

                const handleMouseLeave = () => {
                  if (item.children) setHoveredItem(null);
                };

                return (
                  <Box
                    key={index}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    sx={{ position: 'relative' }}
                  >
                    {!item.children ? (
                      <Link to={item.path} style={{ textDecoration: 'none' }}>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            px: 1,
                            textTransform: 'none',

                            //  color: home ? color : isActived ? '#FFD700' : 'black'
                            color: isHome ? color : isActive ? '#FFD700' : 'black',
                            fontWeight: isActive ? 'bold' : 'normal',
                            transition: '0.3s',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Link>
                    ) : (
                      <>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            px: 1,
                            cursor: 'pointer',
                            textTransform: 'none',
                            color: isHome ? color : isActive ? '#FFD700' : 'black',
                            fontWeight: 'bold',
                            '&:hover': { textDecoration: 'underline' },
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <span> {item.label}</span> <ExpandMore />
                        </Typography>
                        <Fade in={hoveredItem === item.label}>
                          <Paper
                            elevation={3}
                            sx={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              mt: 1,
                              zIndex: 10,
                              pt: 1,
                              minWidth: 200,
                              backgroundColor: '#fff',
                              width: 360,
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            {item.children.map((child, i) => (
                              <Link
                                to={child.path}
                                key={i}
                                onClick={handleMouseLeave}
                                style={{ textDecoration: 'none', display: 'block' }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    py: 3,
                                    px: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    color: 'black',
                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                  }}
                                >
                                  {child?.icon} <span>{child.label}</span>
                                </Typography>
                              </Link>
                            ))}
                          </Paper>
                        </Fade>
                      </>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
        {/* Login Button */}
        <Box sx={{ ml: 'auto' }}>
          {!isSmallScreen && (
            <Box sx={{ ml: 'auto' }}>
              {isLoggedIn ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {isLoading ? (
                    <Typography variant="body2" color="textSecondary">
                      Memuat notifikasi...
                    </Typography>
                  ) : isError ? (
                    <Typography variant="body2" color="error">
                      Gagal memuat notifikasi
                    </Typography>
                  ) : notifications.length > 0 ? (
                    <Notifications data={notifications} isHome={isHome} />
                  ) : (
                    <Notifications data={notifications} isHome={isHome} />
                  )}
                  <AccountPopover
                    data={[
                      {
                        label: 'Home',
                        href: '/',
                        icon: <HomeIcon />,
                      },
                      isAdmin || isOwner
                        ? {
                            label: 'Dashboard',
                            href: '/dashboard',
                            icon: <DashboardRounded />,
                          }
                        : null,
                      {
                        label: 'Profile',
                        href: '/profile',
                        icon: <Person />,
                      },
                      !isAdmin &&
                        !isOwner && {
                          label: 'Riwayat Booking',
                          href: '/history/booking',
                          icon: <HistoryIcon />,
                        },
                      !isAdmin &&
                        !isOwner && {
                          label: 'Riwayat Visit',
                          href: '/history/visit',
                          icon: <HistoryIcon />,
                        },
                    ].filter(Boolean)} // Membersihkan item yang null atau false
                  />
                </Box>
              ) : (
                <Link to={router.auth.login} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Button
                    color="inherit"
                    sx={{
                      textTransform: 'none',
                      color:
                        isHome && window.scrollY > 50 ? 'black' : !isHome ? 'black' : 'inherit',
                      transition: '0.3s',
                      '&:hover': { color: '#FFD700' },
                    }}
                  >
                    Masuk / Daftar
                  </Button>
                </Link>
              )}
            </Box>
          )}
        </Box>

        {/* Hamburger Menu (Hanya tampil di layar kecil) */}
        {isSmallScreen && (
          <IconButton
            color={isHome && window.scrollY > 50 ? '' : !isHome ? '' : 'inherit'}
            onClick={toggleDrawer}
          >
            <SvgIcon>
              <path
                opacity="0.32"
                d="M15.7798 4.5H5.2202C4.27169 4.5 3.5 5.06057 3.5 5.75042C3.5 6.43943 4.27169 7 5.2202 7H15.7798C16.7283 7 17.5 6.43943 17.5 5.75042C17.5 5.06054 16.7283 4.5 15.7798 4.5Z"
                fill="currentColor"
              />
              <path
                d="M18.7798 10.75H8.2202C7.27169 10.75 6.5 11.3106 6.5 12.0004C6.5 12.6894 7.27169 13.25 8.2202 13.25H18.7798C19.7283 13.25 20.5 12.6894 20.5 12.0004C20.5 11.3105 19.7283 10.75 18.7798 10.75Z"
                fill="currentColor"
              />
              <path
                d="M15.7798 17H5.2202C4.27169 17 3.5 17.5606 3.5 18.2504C3.5 18.9394 4.27169 19.5 5.2202 19.5H15.7798C16.7283 19.5 17.5 18.9394 17.5 18.2504C17.5 17.5606 16.7283 17 15.7798 17Z"
                fill="currentColor"
              />
            </SvgIcon>
          </IconButton>
        )}
      </Toolbar>
      <NavMobileLanding data={navMobileData} open={mobileOpen} onClose={toggleDrawer} />
      {/* <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        <Box sx={{ p: 2 }}>
   
          {isLoggedIn && user && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={user?.photo_profile_url}
                  alt={user?.name}
                  sx={{ width: 64, height: 64 }}
                />
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user?.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="black"
                    sx={{ textDecoration: 'underline', cursor: 'pointer', textTransform: 'none' }}
                    component={Link}
                    to="/profile"
                  >
                    Edit Profile &gt;
                  </Typography>
                </Box>
                <Box sx={{ position: 'absolute', right: 16 }}>
                  {isLoading ? (
                    <Typography variant="body2" color="textSecondary">
                      Memuat notifikasi...
                    </Typography>
                  ) : isError ? (
                    <Typography variant="body2" color="error">
                      Gagal memuat notifikasi
                    </Typography>
                  ) : notifications.length > 0 ? (
                    <Notifications data={notifications} />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Tidak ada notifikasi baru
                    </Typography>
                  )}
                </Box>
              </Box>
              <Divider />
            </>
          )}

          <List>
            {navMobile
              .filter(
                (item) =>
                  isLoggedIn ||
                  (!isLoggedIn &&
                    item.path !== '/history/booking' &&
                    item.path !== '/profile' &&
                    item.path !== '/dashboard' &&
                    item.path !== '/history/visit')
              ) 
              .map((item, index) => {
                const isActived = item.path === pathname;
                return (
                  <ListItem
                    button
                    component={Link}
                    to={item.path}
                    key={index}
                    onClick={toggleDrawer}
                    sx={{
                      backgroundColor: isActived ? '#FFD700' : 'transparent',
                      borderRadius: '10px',
                      color: isActived ? 'white' : 'black',
                    }}
                  >
                    {item.icon}
                    <ListItemText primary={item.label} sx={{ ml: 1 }} />
                  </ListItem>
                );
              })}
            <Divider sx={{ my: 1 }} />

            
            {!isLoggedIn && (
              <ListItem button component={Link} to={router.auth.login} onClick={toggleDrawer}>
                <LoginIcon />
                <ListItemText primary="Masuk / Daftar" sx={{ ml: 1 }} />
              </ListItem>
            )}

          
            {isLoggedIn && (
              <ListItem
                button
                onClick={() => setOpenDeleteDialog(true)}
                sx={{
                  backgroundColor: 'red',
                  color: 'white',
                  borderRadius: '10px',
                  '&:hover': { backgroundColor: 'darkred' },
                }}
              >
                <ListItemText primary="Logout" sx={{ textAlign: 'center' }} />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer> */}
    </AppBar>
  );
}
