import React from "react";
import { Box, Grid, Typography, Button, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, WhatsApp, Mail } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        py: 6,
        px: { xs: 4, md: 10 },
        borderTopLeftRadius: "50px",
        borderTopRightRadius: "50px",
      }}
    >
      <Grid container spacing={4} maxWidth="lg" margin="auto">
        {/* Logo dan QR */}
        <Grid item xs={12} md={3}>
          <Typography variant="h5" fontWeight="bold">
            KosKata.id
          </Typography>
         
        </Grid>

        {/* Tenant */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Tenant
          </Typography>
          <Typography variant="body2" color="gray">Kost</Typography>
          <Typography variant="body2" color="gray">Apartemen</Typography>
          <Typography variant="body2" color="gray">Community</Typography>
        </Grid>

        {/* Kerjasama KosKata */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Kerjasama KosKata
          </Typography>
          <Typography variant="body2" color="gray">Coliving</Typography>
          <Typography variant="body2" color="gray">Apartemen</Typography>
          <Typography variant="body2" color="gray">Build to Rent</Typography>
          <Typography variant="body2" color="gray">KosFinance</Typography>
        </Grid>

        {/* Support */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" fontWeight="bold">
            Support
          </Typography>
          <Box display="flex" alignItems="center">
            <WhatsApp fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">lorem</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Mail fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">lorem</Typography>
          </Box>
          <Typography variant="body2" color="gray">
            {/* Jam Operasional: Senin - Jumat: 10.00 - 19.00 */} lorem
          </Typography>
          <Typography variant="body2" color="gray">
            {/* Sabtu - Minggu: 10.30 - 17.00 */} lorem
          </Typography>
        </Grid>
      </Grid>

      {/* Footer Bottom */}
      <Box textAlign="center" mt={4} borderTop="1px solid #333" pt={3}>
        <Typography variant="body2" color="gray">
          © 2025 KosKata.id. All rights reserved.
        </Typography>
        <Box mt={1}>
          <IconButton sx={{ color: "#fff" }}>
            <Facebook />
          </IconButton>
          <IconButton sx={{ color: "#fff" }}>
            <Instagram />
          </IconButton>
          <IconButton sx={{ color: "#fff" }}>
            <Twitter />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
