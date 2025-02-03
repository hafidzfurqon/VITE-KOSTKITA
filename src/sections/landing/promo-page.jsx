import React from 'react';
import { Box, Typography, Button } from "@mui/material";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const promoData = [
  {
    id: 1,
    title: "Pindah ke Rukita Dimodalin Lalamove",
    partner: "RUKITA x LALAMOVE",
    description: "Dapatkan modal pindahan hingga",
    price: "935 ribu",
    image: "/api/placeholder/400/320",
    bgColor: "#FFF3E0"
  },
  {
    id: 2,
    title: "Feel The Groove Under Your Roof",
    partner: "RUKITA x JBL",
    description: "Nikmati diskon",
    discount: "15%",
    subtext: "untuk produk JBL tertentu",
    image: "/api/placeholder/400/320",
    bgColor: "#E3F2FD"
  },
  {
    id: 3,
    title: "Perfect Home, Perfect Smile",
    partner: "RUKITA x SATU DENTAL",
    description: "Special untuk Rukizen",
    discount: "20%",
    subtext: "Diskon perawatan gigi hingga Satu Dental",
    image: "/api/placeholder/400/320",
    bgColor: "#E8F5E9"
  }
];

export default function PromoPage() {
  return (
    <Box sx={{ p: 8, backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: '1120px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
          <Typography variant="h5" sx={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1F2937' }}>
            Promo berlangsung
          </Typography>
          <Button 
            sx={{ color: '#2563EB', '&:hover': { color: '#1D4ED8' }, display: 'flex', alignItems: 'center', gap: 1, fontWeight: '500' }}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 20 }} />}
          >
            Lihat Semua
          </Button>
        </Box>

        <SimpleBar style={{ paddingBottom: '16px' }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {promoData.map((promo) => (
              <Box
                key={promo.id}
                sx={{
                  minWidth: '380px',
                  backgroundColor: promo.bgColor,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 5 }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={promo.image}
                    alt={promo.title}
                    style={{ width: '100%', height: '208px', objectFit: 'cover' }}
                  />
                  <Box sx={{ position: 'absolute', top: 16, left: 16, backgroundColor: '#FFFFFF', px: 3, py: 1, borderRadius: '9999px' }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: '500', color: '#4B5563' }}>
                      {promo.partner}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', mb: 2, lineHeight: '1.3' }}>
                    {promo.title}
                  </Typography>
                  <Typography sx={{ color: '#4B5563', fontSize: '1.125rem' }}>
                    {promo.description}
                    {promo.price && (
                      <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        {` Rp ${promo.price}`}
                      </span>
                    )}
                    {promo.discount && (
                      <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        {` ${promo.discount}`}
                      </span>
                    )}
                  </Typography>
                  {promo.subtext && (
                    <Typography sx={{ color: '#6B7280', mt: 1 }}>
                      {promo.subtext}
                    </Typography>
                  )}
                  <Button 
                    sx={{ mt: 2, backgroundColor: '#FFFFFF', '&:hover': { backgroundColor: '#F3F4F6' }, color: '#1F2937', px: 3, py: 1, borderRadius: '9999px', boxShadow: 1, fontWeight: '500' }}
                  >
                    Lihat Detail
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </SimpleBar>
      </Box>
    </Box>
  );
}
