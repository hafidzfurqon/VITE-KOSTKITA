import { Container, Typography, Divider, Box } from '@mui/material';

export default function PolicyPage({ description, name }) {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Kebijakan Hunian
      </Typography>

      {/* Ketentuan */}
      <Box mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Ketentuan
        </Typography>
        <Typography variant="body1">
          Penambahan jumlah penghuni tergantung dengan kebijakan tiap hunian dan ketersediaan.
          Hubungi Rukita untuk informasi lebih lanjut.
        </Typography>
      </Box>

      <Divider />

      {/* Deposit */}
      <Box mt={3} mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Deposit
        </Typography>
        <Typography variant="body1">
          Deposit sebesar 50% dari biaya sewa bulanan, dibayarkan bersama atau terpisah dengan biaya
          sewa bulan pertama.
        </Typography>
      </Box>

      <Divider />

      {/* Tata Tertib */}
      <Box mt={3} mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Tata Tertib
        </Typography>
        <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
          Pasutri Diperbolehkan
        </Typography>
        <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
          Anak-anak Diperbolehkan Tinggal
        </Typography>
        <Typography variant="body1" color="primary">
          Lihat selengkapnya &gt;
        </Typography>
      </Box>

      <Divider />

      {/* Informasi Pembatalan */}
      <Box mt={3} mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Informasi Pembatalan
        </Typography>
        <Typography variant="body1">
          Pembatalan dapat dilakukan dengan biaya minimal 50% dari deposit atau sewa.
        </Typography>
        <Typography variant="body1" color="primary">
          Lihat selengkapnya &gt;
        </Typography>
      </Box>

      <Divider />

      {/* Tentang Green Harris View */}
      <Box mt={3} mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Tentang {name}
        </Typography>
        <Typography variant="body1">
          {/* Description */}
          {description && (
            <>
              <Typography
                color="text.secondary"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </>
          )}
        </Typography>
        <Typography variant="body1" color="primary">
          Lihat Selengkapnya &gt;
        </Typography>
      </Box>
    </Container>
  );
}
