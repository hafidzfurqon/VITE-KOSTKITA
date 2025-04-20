import React from 'react';
import { Box, Grid, Typography, List, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';

const directoryData = [
  {
    title: 'Kamu lagi cari tipe hunian apa?',
    links: ['Cari Kost', 'Sewa Coliving'],
  },
  {
    title: 'Kost dekat Universitas',
    links: ['Institut Pertanian Bogor'],
  },
];

const Directory = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {directoryData.map((section, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {section.title}
            </Typography>
            <List disablePadding>
              {section.links.map((link, i) => (
                <ListItemButton key={i} sx={{ px: 0, py: 0.5 }}>
                  <Link
                    to="#"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#1976d2')}
                    onMouseLeave={(e) => (e.target.style.color = 'inherit')}
                  >
                    {link}
                  </Link>
                </ListItemButton>
              ))}
            </List>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Directory;
