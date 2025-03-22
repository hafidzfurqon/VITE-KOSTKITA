import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const NearbyPlaces = () => {
  const places = [
    { label: 'Pintu masuk kampus', description: '3 Menit pintu Belakang IPB' },
    { label: 'Rumah Sakit', description: '5 Menit RS Karyabakti Pertiwi' },
    { label: 'Stasiun', description: '30 Menit Stasiun Bogor' },
    { label: 'Mall / Super Market', description: '10 Menit Yogya Deptstore' },
    { label: 'Terminal', description: '15 Menit Terminal Bubulak' },
  ];

  return (
    <Container maxWidth="xl" sx={{ my: 5, p: 3, bgcolor: 'white', boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Tempat Terdekat
      </Typography>
      <List>
        {places.map((place, index) => (
          <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {place.label}
                </Typography>
              }
              secondary={place.description}
              secondaryTypographyProps={{ color: 'text.secondary' }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default NearbyPlaces;
