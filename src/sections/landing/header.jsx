import { useState, useEffect } from 'react';
import { router } from 'src/hooks/routing/useRouting';

import { AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { Link } from 'react-router-dom';
import { useResponsive } from 'src/hooks/use-responsive';
import Logo from '../../../public/assets/images/logo.png';
import { usePathname } from 'src/routes/hooks';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallScreen = useResponsive('down', 'md'); // Deteksi layar kecil
  const [navBg, setNavBg] = useState('transparent');
  const pathname = usePathname()
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavBg('rgba(255, 255, 255, 0.9)'); // Warna abu ke putih saat di-scroll
      } else {
        setNavBg('transparent'); // Transparan saat di atas
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };  

  // Daftar menu navigasi (ikon hanya muncul di layar kecil)
  const navItems = [
    { label: 'Sewa', icon: <HomeIcon />, path: '/' },
    { label: 'Kerjasama', icon: <HandshakeIcon />, path: '/kerja-sama' },
    { label: 'For Business', icon: <BusinessIcon />, path: '/bussines' },
    { label: 'Tentang KostKita', icon: <InfoIcon />, path: '/about-us' }
  ];

  return (
    <AppBar 
      position="fixed"
      sx={{ 
        background: navBg, 
        backdropFilter: 'blur(10px)', 
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        px: 2,
        transition: 'background 0.3s ease-in-out'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to='/'>
          <img src={Logo} alt="Logo" width={150} style={{ filter: 'brightness(1.2)' }} />
          </Link>
       

        {/* Navigation (Hanya tampil di layar besar) */}
        {!isSmallScreen && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 3, p : 2, }}>
           {navItems.map((item, index) => {
                const isActived = item.path === pathname;

              return (
                <Link to={item.path} key={index} style={{ textDecoration: 'none' }}>
                  <Typography
                    sx={{
                      fontSize : '16px',
                      px : 1,
                      textTransform: 'none',
                      color: isActived ? '#FFD700' : 'black', // Warna kuning jika aktif
                      fontWeight: isActived ? 'bold' : 'normal', // Tebalkan teks jika aktif
                      transition: '0.3s',
                      '&:hover': { textDecoration : 'underline' }, // Warna emas saat hover
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              );
            })}

          </Box>
        )}
 </Box>
        {/* Login Button */}
        {!isSmallScreen && (
          <Box sx={{ ml: 'auto' }}>
            <Link to={router.auth.login} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button 
                color="inherit" 
                sx={{ 
                  textTransform: 'none', 
                  color: 'black', // Mengubah warna teks menjadi hitam
                  transition: '0.3s', 
                  '&:hover': { color: '#FFD700' } // Warna emas saat hover
                }}
              >
                Masuk / Daftar
              </Button>
            </Link>
          </Box>
        )}

        {/* Hamburger Menu (Hanya tampil di layar kecil) */}
        {isSmallScreen && (
          <IconButton edge="end" color="primary" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Drawer untuk menu di layar kecil */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {navItems.map((item, index) => {
              const isActived = item.path === pathname;
              return (
              <ListItem button component={Link} to={item.path} key={index} onClick={toggleDrawer} sx={{backgroundColor: isActived && '#FFD700', borderRadius : '10px', color: isActived && 'white' }}>
                {item.icon} {/* Ikon hanya tampil di layar kecil */}
                <ListItemText primary={item.label} sx={{ ml: 1, }} />
              </ListItem>
              )
            })}
            <Divider sx={{ my: 1 }} />
            <ListItem button component={Link} to={router.auth.login} onClick={toggleDrawer}>
              <LoginIcon />
              <ListItemText primary="Masuk / Daftar" sx={{ ml: 1 }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
