import { AccordionSummary } from '@mui/material';
import { Accordion } from '@mui/material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  DialogActions,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import { AccordionDetails } from '@mui/material';

export function PeraturanPenghuni({ setOpen, open }) {
  const faqs = [
    {
      question: 'Apa benefit yang saya dapat jika bergabung menjadi partner agent KostKita?',
      answer:
        'Sebagai partner, Anda akan mendapatkan dukungan penuh operasional, akses ke jaringan penyewa, dan potensi income tambahan tanpa ribet.',
    },
    {
      question: 'Saya menangani banyak aset yang sulit laku, apa solusi KostKita?',
      answer:
        'KostKita dapat membantu pemilik aset, seperti tanah kosong, ruko, atau properti apa pun yang sulit laku, menjadi bisnis kost coliving bernilai tinggi. Semua operasional KostKita yang urus sehingga pemilik aset tinggal merasakan income tak terbatas tanpa ribet.',
    },
    {
      question: 'Saya menangani banyak aset yang sulit laku, apa solusi KostKita?',
      answer:
        'KostKita dapat membantu pemilik aset, seperti tanah kosong, ruko, atau properti apa pun yang sulit laku, menjadi bisnis kost coliving bernilai tinggi. Semua operasional KostKita yang urus sehingga pemilik aset tinggal merasakan income tak terbatas tanpa ribet.',
    },
    {
      question: 'Saya menangani banyak aset yang sulit laku, apa solusi KostKita?',
      answer:
        'KostKita dapat membantu pemilik aset, seperti tanah kosong, ruko, atau properti apa pun yang sulit laku, menjadi bisnis kost coliving bernilai tinggi. Semua operasional KostKita yang urus sehingga pemilik aset tinggal merasakan income tak terbatas tanpa ribet.',
    },
  ];
  console.log('Status DialogDetail:', open);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'div',
      }}
    >
      <DialogTitle>Peraturan Penghuni KostKita</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>
          Beberapa peraturan penghuni yang harus ditaati .
        </DialogContentText>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <Button onClick={handleClose} variant="outlined">
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
