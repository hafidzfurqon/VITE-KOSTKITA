import { Skeleton } from '@mui/material';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';

const LoadingPropertyPage = () => {
  return (
    <Grid container >
      {Array.from(new Array(8)).map((_, index) => (
        // <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
            <Skeleton variant="rectangular" width={210} height={118} />
            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </Box>
        // </Grid>
      ))}
    </Grid>
  );
};

export default LoadingPropertyPage;
