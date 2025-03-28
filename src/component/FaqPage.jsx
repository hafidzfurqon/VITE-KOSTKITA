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
      'Bagaimana saya dapat mencari dan menemukan kamar yang sesuai dengan preferensi saya?',
      'Bagaimana jika hunian yang saya inginkan tidak tersedia?',
      'Perlengkapan apa saja yang tersedia di hunian Rukita?',
    ],
  },
  {
    category: 'Seputar Check-in',
    icon: <EventNote />,
    questions: [
      'Bagaimana proses check-in?',
      'Dokumen apa saja yang perlu disiapkan saat check-in?',
    ],
  },
  {
    category: 'Check-out dan Pengembalian Deposit',
    icon: <CheckCircle />,
    questions: ['Bagaimana proses check-out?', 'Kapan deposit saya akan dikembalikan?'],
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

          {faqData[selectedCategory].questions.map((question, i) => (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>{question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  Ini adalah jawaban dari pertanyaan: "{question}"
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FaqPage;
