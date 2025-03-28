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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#1E1E1E', // background biar keliatan jelas
          px: { xs: 2, md: 8 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo */}
          <Grid item xs={12} md={3}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#FFCC00', mb: 2 }}>
              KostKita.id
            </Typography>
            <img src={image} alt="Logo" width={150} style={{ borderRadius: 8 }} />
          </Grid>

          {/* Tenant */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#FFCC00', mb: 1 }}>
              Tenant
            </Typography>
            {['Kost', 'Apartemen', 'Community'].map((item) => (
              <Typography key={item} variant="body2" color="white" sx={{ mb: 0.5 }}>
                {item}
              </Typography>
            ))}
          </Grid>

          {/* Kerjasama */}
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#FFCC00', mb: 1 }}>
              Kerjasama KosKita.id
            </Typography>
            {['Coliving', 'Apartemen', 'Build to Rent', 'KosFinance'].map((item) => (
              <Typography key={item} variant="body2" color="white" sx={{ mb: 0.5 }}>
                {item}
              </Typography>
            ))}
          </Grid>

          {/* Support */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#FFCC00', mb: 1 }}>
              Support
            </Typography>

            <Box display="flex" alignItems="center" sx={{ mb: 0.5 }}>
              <WhatsApp fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2" color="white">
                +62 851-8331-1656
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" sx={{ mb: 0.5 }}>
              <Mail fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2" color="white">
                kostkita@gmail.com
              </Typography>
            </Box>

            <Typography variant="body2" color="white" sx={{ fontWeight: 'bold', mt: 1 }}>
              Jam Operasional:
            </Typography>
            <Typography variant="body2" color="white">
              Senin - Jumat: 10.00 - 19.00
            </Typography>
            <Typography variant="body2" color="white">
              Sabtu - Minggu: 10.30 - 17.00
            </Typography>
          </Grid>
        </Grid>
      </Box>

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
