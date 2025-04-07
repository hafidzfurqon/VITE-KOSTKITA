import { useState, useEffect, useCallback } from 'react';
import { router } from 'src/hooks/routing/useRouting';

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Link as MuiLink,
  Grid,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HistoryIcon from '@mui/icons-material/History';
import { Link, useNavigate } from 'react-router-dom';
import { useResponsive } from 'src/hooks/use-responsive';
import Logo from '../../../public/assets/images/logo.png';
import { usePathname, useRouter } from 'src/routes/hooks';
import { AccountPopover } from 'src/layouts/components/account-popover';
import { Avatar } from '@mui/material';
import { useAppContext } from 'src/context/user-context';
import { useMutationLogout } from 'src/hooks/auth/useMutationLogout';
import DialogDelete from 'src/component/DialogDelete';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import {
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
// import { NotificationsPopover } from 'src/layouts/components/notifications-popover';
// import { _notifications } from 'src/_mock';
import React from 'react';
import { Popover } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { Fade } from '@mui/material';

export default function Header() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallScreen = useResponsive('down', 'md'); // Deteksi layar kecil
  const [navBg, setNavBg] = useState('transparent');
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk status login
  const { UserContextValue: authUser } = useAppContext();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [color, setColor] = useState('white');
  const { user } = authUser;
  const userId = user.id;
  // console.log(userId)
  const isAdmin = user?.roles?.some((role) => role.name.toLowerCase() === 'admin');
  const isOwner = user?.roles?.some((role) => role.name === 'owner_property');
  const { mutate: handleLogout, isPending } = useMutationLogout({
    onSuccess: () => {
      queryClient.removeQueries(['authenticated.user']);
      navigate('/'); // Kembali ke landing page
      enqueueSnackbar('Logout berhasil', { variant: 'success' });
      localStorage.removeItem('token'); // Hapus token saat logout
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

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
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
    { label: 'Wishlist', icon: <InfoIcon />, path: '/wishlist' },
    { label: 'F.A.Q', icon: <InfoIcon />, path: '/faq' },
  ];

  const navMobile = [
    isAdmin || isOwner ? { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' } : null,
    { label: 'Sewa', icon: <HomeIcon />, path: '/' },
    !isAdmin &&
      !isOwner && { label: 'Riwayat Booking', path: '/history/booking', icon: <HistoryIcon /> },
    !isAdmin &&
      !isOwner && { label: 'Riwayat Visit', path: '/history/visit', icon: <HistoryIcon /> },
    { label: 'Wishlist', icon: <InfoIcon />, path: '/wishlist' },

    { label: 'Kerjasama', icon: <HandshakeIcon />, path: '/kerja-sama' },
    { label: 'For Business', icon: <BusinessIcon />, path: '/bussines' },
    { label: 'Tentang KostKita', icon: <InfoIcon />, path: '/about-us' },
    { label: 'FAQ', icon: <InfoIcon />, path: '/faq' },
  ].filter(Boolean);

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
                const isHome = pathname === '/';

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
                    <Notifications data={notifications} />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Tidak ada notifikasi baru
                    </Typography>
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
                      color: 'black',
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
          <IconButton edge="end" color="primary" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        <Box sx={{ p: 2 }}>
          {/* Hanya tampil jika sudah login */}
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
              ) // Sembunyikan history booking & profile jika belum login
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

            {/* Hanya tampil jika belum login */}
            {!isLoggedIn && (
              <ListItem button component={Link} to={router.auth.login} onClick={toggleDrawer}>
                <LoginIcon />
                <ListItemText primary="Masuk / Daftar" sx={{ ml: 1 }} />
              </ListItem>
            )}

            {/* Tombol Logout, hanya muncul jika login */}
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
      </Drawer>
      <DialogDelete
        open={openDeleteDialog}
        setOpen={() => setOpenDeleteDialog(false)}
        Submit={handleLogout}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin logout?"
        confirmText="Logout"
        confirmColor="error"
        pending={isPending}
      />
    </AppBar>
  );
}
