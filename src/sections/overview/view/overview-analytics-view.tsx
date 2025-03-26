import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAppContext } from 'src/context/user-context';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { useFetchAllApartement } from 'src/hooks/apartement';
import Loading from 'src/components/loading/loading';
import { useFetchAllUser } from 'src/hooks/users/useFetchAllUser';
import { useFetchAllBooking } from 'src/hooks/booking_admin';
import { useFetchPromo } from 'src/hooks/promo';
import { useFetchAllPropertyOwner } from 'src/hooks/owner_property/property';
import { useFetchAllBookingOwner } from 'src/hooks/owner/property/statistic/useFetchStatisticPropertyOwner';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { UserContextValue: authUser }: any = useAppContext();
  const { user } = authUser;
  const isAdmin = user?.roles?.some((role: { name: string }) => role.name === 'admin');
  const {
    data = [],
    isLoading,
    isFetching,
  } = isAdmin ? useFetchAllApartement() : useFetchAllPropertyOwner();
  const {
    data: DataUser = [],
    isLoading: LoadingUser,
    isFetching: FecthingUser,
  } = isAdmin ? useFetchAllUser() : { data: null, isLoading: false, isFetching: false };
  const {
    data: DataBooking = [],
    isLoading: LoadingBooking,
    isFetching: FecthingBooking,
  } = isAdmin ? useFetchAllBooking() : useFetchAllBookingOwner();
  const {
    data: DataPromo = [],
    isLoading: LoadingPromo,
    isFetching: FecthingPromo,
  } = isAdmin ? useFetchPromo() : { data: null, isLoading: false, isFetching: false };
  if (
    isLoading ||
    isFetching ||
    LoadingUser ||
    FecthingUser ||
    LoadingBooking ||
    FecthingBooking ||
    LoadingPromo ||
    FecthingPromo
  ) {
    return <Loading />;
  }

  const totalBookings =
    DataBooking?.reduce(
      (acc: number, property: { bookings: any[] }) => acc + property.bookings.length,
      0
    ) ?? 0;

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Halo, Selamat Datang Kembali {user.name}👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Jumlah Property"
            // percent={2.6}
            total={data?.length}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        {isAdmin && (
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Jumlah Pengguna"
              // percent={-0.1}
              total={DataUser?.data?.length}
              color="secondary"
              icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [56, 47, 40, 62, 73, 30, 23, 54],
              }}
            />
          </Grid>
        )}

        <Grid xs={12} sm={6} md={isAdmin ? 3 : 6}>
          <AnalyticsWidgetSummary
            title="Jumlah Booking"
            // percent={2.8}
            total={totalBookings}
            // total={5}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        {isAdmin && (
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Jumlah Promo"
              // percent={3.6}
              total={DataPromo?.length ?? 0}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [56, 30, 23, 54, 47, 40, 62, 73],
              }}
            />
          </Grid>
        )}

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
