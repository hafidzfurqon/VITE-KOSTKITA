import { AppBar, Toolbar, Typography, Box, Button,  } from '@mui/material';
import { Link } from 'react-router-dom';
import { router } from 'src/hooks/routing/useRouting';
import Logo from '../../../public/assets/images/logo.png';
// import { useResponsive } from 'src/hooks/use-responsive';

export default function Header() {


  return (
    <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none', px: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={Logo} alt="Logo" width={150} />
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            flexWrap: 'wrap',
           
          }}
        >
          <Button color="inherit">Sewa</Button>
          <Button color="inherit">Kerjasama KosKita.id</Button>
          <Button color="inherit">KosKita.id for Business</Button>
          <Button color="inherit">Tentang KosKita.id</Button>
        </Box>

        {/* Login Button */}
        <Box sx={{ ml: 'auto', display: 'flex', justifyContent: 'center' }}>
          <Link to={router.auth.login} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">Masuk / Daftar</Button>
          </Link>
        </Box>

        {/* Hamburger for small screens */}
     
          <Box sx={{ ml: 2 }}>
            <Button color="inherit">Menu</Button>
          </Box>
     
      </Toolbar>
    </AppBar>
  );
}
