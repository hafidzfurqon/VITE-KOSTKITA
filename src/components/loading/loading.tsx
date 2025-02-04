import { CircularProgress, Container, Grid } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
        <CircularProgress />
      </Grid>
    </Container>
  );
}
