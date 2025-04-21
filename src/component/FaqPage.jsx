import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore, Search, EventNote, CheckCircle } from '@mui/icons-material';

const faqData = [
  {
    category: 'Pencarian dan Pemesanan',
    icon: <Search />,
    questions: [
      {
        q: 'Bagaimana saya dapat mencari dan menemukan kamar yang sesuai dengan preferensi saya?',
        a: 'Gunakan fitur pencarian kami dan filter berdasarkan lokasi, harga, fasilitas, dan tipe kamar.',
      },
      {
        q: 'Bagaimana jika hunian yang saya inginkan tidak tersedia?',
        a: 'Anda dapat mengaktifkan notifikasi atau menghubungi tim kami untuk alternatif hunian serupa.',
      },
      {
        q: 'Perlengkapan apa saja yang tersedia di hunian KostKita?',
        a: 'Setiap hunian memiliki detail fasilitas masing-masing, seperti kasur, lemari, AC, dan Wi-Fi.',
      },
    ],
  },
  {
    category: 'Seputar Check-in',
    icon: <EventNote />,
    questions: [
      {
        q: 'Bagaimana saya dapat mencari dan menemukan kamar yang sesuai dengan preferensi saya?',
        a: 'Gunakan fitur pencarian kami dan filter berdasarkan lokasi, harga, fasilitas, dan tipe kamar.',
      },
      {
        q: 'Bagaimana jika hunian yang saya inginkan tidak tersedia?',
        a: 'Anda dapat mengaktifkan notifikasi atau menghubungi tim kami untuk alternatif hunian serupa.',
      },
      {
        q: 'Perlengkapan apa saja yang tersedia di hunian KostKita?',
        a: 'Setiap hunian memiliki detail fasilitas masing-masing, seperti kasur, lemari, AC, dan Wi-Fi.',
      },
    ],
  },
  {
    category: 'Check-out dan Pengembalian Deposit',
    icon: <CheckCircle />,
    questions: [
      {
        q: 'Bagaimana saya dapat mencari dan menemukan kamar yang sesuai dengan preferensi saya?',
        a: 'Gunakan fitur pencarian kami dan filter berdasarkan lokasi, harga, fasilitas, dan tipe kamar.',
      },
      {
        q: 'Bagaimana jika hunian yang saya inginkan tidak tersedia?',
        a: 'Anda dapat mengaktifkan notifikasi atau menghubungi tim kami untuk alternatif hunian serupa.',
      },
      {
        q: 'Perlengkapan apa saja yang tersedia di hunian KostKita?',
        a: 'Setiap hunian memiliki detail fasilitas masing-masing, seperti kasur, lemari, AC, dan Wi-Fi.',
      },
    ],
  },
];

const FaqPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        FAQ
      </Typography>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <List sx={{ borderRadius: 2, border: '1px solid #eee' }}>
            {faqData.map((item, index) => (
              <ListItemButton
                key={index}
                selected={selectedCategory === index}
                onClick={() => setSelectedCategory(index)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.category} />
              </ListItemButton>
            ))}
          </List>
        </Grid>

        {/* Content */}
        <Grid item xs={12} md={9}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            {faqData[selectedCategory].category}
          </Typography>

          {faqData[selectedCategory].questions.map((qna, i) => (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>{qna.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{qna.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FaqPage;
