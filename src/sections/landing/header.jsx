import { useState, useEffect } from 'react';
import { router } from 'src/hooks/routing/useRouting';

import { AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { Link } from 'react-router-dom';
import { useResponsive } from 'src/hooks/use-responsive';
import Logo from '../../../public/assets/images/logo.png';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallScreen = useResponsive('down', 'md'); // Deteksi layar kecil
  const [navBg, setNavBg] = useState('transparent');

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
    { label: 'Kerjasama', icon: <HandshakeIcon />, path: '/' },
    { label: 'For Business', icon: <BusinessIcon />, path: '/' },
    { label: 'Tentang', icon: <InfoIcon />, path: '/' }
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
          <img src={Logo} alt="Logo" width={120} style={{ filter: 'brightness(1.2)' }} />
          </Link>
        </Box>

        {/* Navigation (Hanya tampil di layar besar) */}
        {!isSmallScreen && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 3 }}>
            {navItems.map((item, index) => (
              <Button 
                key={index} 
                color="inherit" 
                sx={{ 
                  textTransform: 'none', 
                  color: '#000', // Mengubah warna teks menjadi hitam
                  transition: '0.3s', 
                  '&:hover': { color: '#FFD700' } // Warna emas saat hover
                }}
              >
                {item.label} {/* Tidak menampilkan ikon di layar besar */}
              </Button>
            ))}
          </Box>
        )}

        {/* Login Button */}
        {!isSmallScreen && (
          <Box sx={{ ml: 'auto' }}>
            <Link to={router.auth.login} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button 
                color="inherit" 
                sx={{ 
                  textTransform: 'none', 
                  color: '#000', // Mengubah warna teks menjadi hitam
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
            {navItems.map((item, index) => (
              <ListItem button key={index} onClick={toggleDrawer}>
                {item.icon} {/* Ikon hanya tampil di layar kecil */}
                <ListItemText primary={item.label} sx={{ ml: 1 }} />
              </ListItem>
            ))}
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
