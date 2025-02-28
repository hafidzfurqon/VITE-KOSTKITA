import { memo } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BackgroundShape from './background-shape';

function OrderCompleteIllustration({ ...other }) {
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <BackgroundShape />

      <ApartmentIcon
        sx={{ fontSize: 100, color: PRIMARY_MAIN, position: 'absolute', top: '30%', left: '40%' }}
      />
      
      {/* <CheckCircleIcon
        sx={{ fontSize: 10, color: 'green', position: 'absolute', top: '50%', left: '45%' }}
      /> */}
    </Box>
  );
}

export default memo(OrderCompleteIllustration);
