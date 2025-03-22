import Loading from 'src/components/loading/loading';
import { useFetchPromo } from 'src/hooks/promo';
import PromoItem from '../promo-item';
import { Grid } from '@mui/material';
import { Pagination } from '@mui/material';
import { Container } from '@mui/material';
import { Typography } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export function PromoView() {
  const { data, isFetching, isPending } = useFetchPromo();
  if (isFetching || isPending) {
    return <Loading />;
  }
  return (
    <>
      <Container>
        <CustomBreadcrumbs
          links={[{ name: 'Home', href: '/' }, { name: 'Promo' }]}
          sx={{ mb: { xs: 2, md: 3 } }}
          action={null}
          heading=""
          moreLink={[]}
          activeLast={true}
        />
        <Typography sx={{ mb: 4, fontSize: { xs: '18px', md: '30px' }, fontWeight: 'bold' }}>
          Promo yang sedang berlangsung
        </Typography>

        <Grid container spacing={3}>
          {data.map((post: any, index: number) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <PromoItem post={post} />
            </Grid>
          ))}
        </Grid>
        <Pagination count={2} color="primary" sx={{ mt: 10 }} />
      </Container>
    </>
  );
}
