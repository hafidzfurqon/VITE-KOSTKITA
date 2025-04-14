import { Box, Card, CardContent, Typography, Button, Chip, Stack } from '@mui/material';
import Loading from 'src/components/loading/loading';
import { useAppContext } from 'src/context/user-context';
import { useFetchNontification } from 'src/hooks/users/profile/useFetchNontification';
import { fToNow } from 'src/utils/format-time';

const NotificationPage = () => {
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const userId = user?.id;
  const { data: _notifications, isLoading, isFetching } = useFetchNontification(userId);
  if (isLoading || isFetching) {
    return <Loading />;
  }

  console.log(_notifications);
  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={4} textAlign="lefr">
        Semua notifikasi anda akan muncul disini
      </Typography>
      {_notifications.data.map((data, index) => {
        //   {/* Notifikasi */}
        const { data: data_asli } = data;
        console.log(data_asli);
        return (
          <Card
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              mb: 3,
              boxShadow: 3,
            }}
            key={index}
          >
            <Box
              component="img"
              src={data_asli.image}
              alt="program"
              width={300}
              sx={{ objectFit: 'cover' }}
              loading="lazy"
            />
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {data_asli.title}
              </Typography>
              <Typography mt={1}>{data_asli.message}</Typography>
              <Typography mt={1} color="text.secondary">
                {fToNow(data?.created_at)}
              </Typography>
              <Typography
                mt={1}
                color="primary"
                sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                Detail Property 
              </Typography>
        
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default NotificationPage;
