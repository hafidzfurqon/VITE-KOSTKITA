import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Rating,
  Box,
  Stack,
} from '@mui/material';

const reviews = [
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/40?img=1',
    text: '"Cafe, minimart, jogging track, rooftop area. Buat hang out mahasiswa.."',
  },
  {
    id: 2,
    avatar: 'https://i.pravatar.cc/40?img=2',
    text: '"Letaknya dekat dengan pintu belakang kampus IPB."',
  },
  {
    id: 3,
    avatar: 'https://i.pravatar.cc/40?img=3',
    text: '"Tempatnya nyaman, ada kursus kampung inggris dan kantin."',
  },
];

export default function Review() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h4" fontWeight="bold">
              4.5
            </Typography>
            <Rating value={4.5} precision={0.5} />
          </Box>
          <Typography color="textSecondary">204 ulasan</Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={
            <img src="https://img.icons8.com/ios/50/000000/edit--v1.png" alt="icon" width={20} />
          }
        >
          Tulis ulasan
        </Button>
      </Box>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {reviews.map((review) => (
          <Card key={review.id} variant="outlined">
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={review.avatar} />
              <Typography>{review.text}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
