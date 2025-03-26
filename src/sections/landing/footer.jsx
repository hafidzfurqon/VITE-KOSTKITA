import React from 'react';
import { Box, Grid, Typography, Button, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, WhatsApp, Mail } from '@mui/icons-material';
import image from '../../../public/assets/images/Kost.pdf (2).png';

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        py: 6,
        px: { xs: 4, md: 10 },
        borderTopRightRadius: '50px',
      }}
    >
      <Grid container spacing={4} maxWidth="lg" margin="auto" alignItems={'center'}>
        {/* Logo dan QR */}
        <Grid item xs={12} md={3}>
          <Typography variant="h5" fontWeight="bold">
            KosKita.id
          </Typography>
          <img src={image} alt="gambar.log" width={150} />
        </Grid>

        {/* Tenant */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
            Tenant
          </Typography>
          <Typography variant="body2" color="gray">
            Kost
          </Typography>
          <Typography variant="body2" color="gray">
            Apartemen
          </Typography>
          <Typography variant="body2" color="gray">
            Community
          </Typography>
        </Grid>

        {/* Kerjasama KosKata */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
            Kerjasama KosKita.id
          </Typography>
          <Typography variant="body2" color="gray">
            Coliving
          </Typography>
          <Typography variant="body2" color="gray">
            Apartemen
          </Typography>
          <Typography variant="body2" color="gray">
            Build to Rent
          </Typography>
          <Typography variant="body2" color="gray">
            KosFinance
          </Typography>
        </Grid>

        {/* Support */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
            Support
          </Typography>
          <Box display="flex" alignItems="center">
            <WhatsApp fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">+62 851-8331-1656</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Mail fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">kostkita@gmail.com</Typography>
          </Box>
          <Typography variant="body2" color="gray">
            Jam Operasional:
          </Typography>
          <Typography variant="body2" color="gray">
            Senin - Jumat: 10.00 - 19.00
          </Typography>
          <Typography variant="body2" color="gray">
            Sabtu - Minggu: 10.30 - 17.00
          </Typography>
        </Grid>
      </Grid>

      {/* Footer Bottom */}
      <Box textAlign="center" mt={4} borderTop="1px solid #333" pt={3}>
        <Typography variant="body2" color="gray">
          © 2025 KosKita.id. All rights reserved.
        </Typography>
        <Box mt={1}>
          <IconButton sx={{ color: '#fff' }}>
            <Facebook />
          </IconButton>
          <IconButton sx={{ color: '#fff' }}>
            <Instagram />
          </IconButton>
          <IconButton sx={{ color: '#fff' }}>
            <Twitter />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
