import React from 'react';
import { Box, Typography, Button, Chip, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VideocamIcon from '@mui/icons-material/Videocam';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const priceRanges = [
  { label: '< 3 juta', active: true },
  { label: '3-5 juta', active: false },
  { label: '> 5 juta', active: false },
];

const properties = [
  {
    id: 1,
    name: 'Kostkita Smart Cipete',
    location: 'Gandaria Selatan, Cilandak',
    price: 2625000,
    originalPrice: 2900000,
    distance: '520 m dari Stasiun MRT Cipete Raya',
    type: 'Coliving',
    hasVideo: true,
    discount: '-9%',
    image: 'https://images.rukita.co/buildings/building/5a977d64-f87.jpg?tr=c-at_max%2Cw-800'
  },
  // Add more properties as needed
];

export default function PropertyBudget() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Cari hunian sesuai budgetmu
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        {priceRanges.map((range) => (
          <Button
            key={range.label}
            variant={range.active ? 'contained' : 'outlined'}
            color={range.active ? 'primary' : 'inherit'}
            sx={{ 
              bgcolor: range.active ? '#00A693' : 'transparent',
              '&:hover': { bgcolor: range.active ? '#009688' : 'rgba(0,0,0,0.04)' }
            }}
          >
            {range.label}
          </Button>
        ))}
      </Box>

      <Grid container spacing={2}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={3} key={property.id}>
            <Box sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src={property.image}
                  alt={property.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{ 
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  display: 'flex',
                  gap: 1
                }}>
                    {/* {property.hasVideo && (
                      <Chip
                        icon={<VideocamIcon />}
                        label="Video"
                        size="small"
                        sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}
                      />
                    )} */}
                  {/* <Chip
                    icon={<ThreeSixtyIcon />}
                    label="360"
                    size="small"
                    sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}
                  /> */}
                </Box>
                {property.discount && (
                  <Chip
                    label={property.discount}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: '#ff4444',
                      color: 'white'
                    }}
                  />
                )}
              </Box>

              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {property.type}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', my: 1 }}>
                  {property.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.location}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: 'line-through',
                    color: 'text.secondary',
                    mt: 2
                  }}
                >
                  Rp{property.originalPrice.toLocaleString()}
                </Typography>
                <Typography variant="h6" sx={{ color: '#00A693', fontWeight: 'bold' }}>
                  Rp{property.price.toLocaleString()} /bulan
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    {property.distance}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2, overflow : 'auto' }}>
                  <Chip
                    icon={<LocalOfferIcon />}
                    label="Diskon sewa 6 Bulan"
                    size="small"
                    sx={{ color: '#00A693', border: '1px solid #00A693' }}
                  />
                  <Chip
                    icon={<LocalOfferIcon />}
                    label="5 Voucher s.d. 21%"
                    size="small"
                    sx={{ color: '#00A693', border: '1px solid #00A693' }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}