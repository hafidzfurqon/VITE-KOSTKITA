import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { SignUpView } from 'src/sections/auth/sign-up-view';
import BannerPage from 'src/pages/banner';
import BannerCreate from 'src/sections/banner/crud/banner-create';
import PropertyPage from 'src/pages/property';
import PropertyCreate from 'src/sections/property/property-create';
import FasilitasPage from 'src/pages/fasilitas';
import { LandingLayout } from 'src/layouts/landing';
import { CreatePromo } from 'src/sections/blog/crud-view/CreatePromo';
import PropertyEdit from 'src/sections/property/property-edit';
import PropertyDetail from 'src/sections/landing/property-detail';
import { CreateApartement } from 'src/sections/apartement/crud/apartement-create';
import { PropertyRoomCreate } from 'src/sections/property_room/crud/property-room-create';
import { AccountView } from 'src/layouts/account/view';
import BookingView from 'src/sections/landing/user/bookingView';
import HistoryBooking from 'src/sections/landing/user/historyBooking';
import { EditApartement } from 'src/sections/apartement/crud/apartement-edit';
import { UpdatePropertyRoomCreate } from 'src/sections/property_room/crud/update-property-room';
import ColivingPage from 'src/sections/landing/coliving/coliving-page';
import PropertyLocationDetail from 'src/sections/landing/property-location/property-location-detail';
import ApartmentList from 'src/sections/landing/apartement/apartemen-page-list';
import HistoryBookingDetail from 'src/sections/landing/user/historyBookingDetail';
import WishlistPageView from 'src/sections/landing/wishlist-page-view';
import HistoryBookingDetailAdmin from 'src/sections/landing/user/admin/historyBookingDetailAdmin';
import HistoryVisit from 'src/sections/landing/visit/history-visit';
import VisitDetail from 'src/sections/landing/visit/visit-detail';
import About from 'src/sections/landing/about';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Landing = lazy(() => import('src/pages/landing'));
export const PromoPage = lazy(() => import('src/pages/promo'));
export const ApartmenetPage = lazy(() => import('src/pages/apartement'));
export const PropertyRoomPage = lazy(() => import('src/pages/property_room'));
export const PropertyDetailPage = lazy(() => import('src/pages/property-detail-page'));
export const RoomFasilitasPage = lazy(() => import('src/pages/room-fasilitas'));
export const BookedPropertyPage = lazy(() => import('src/pages/booked-property'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          path: 'dashboard',
          element: <HomePage />,
        },
        {
          path: 'booked-property/booking/detail/admin/:bookingCode',
          element: <HistoryBookingDetailAdmin />,
        },
        {
          path: 'user',
          children: [
            {
              path: '',
              element: <UserPage />,
            },
            {
              path: 'create',
              element: <div>Helo world...</div>,
            },
          ],
        },
        {
          path: 'property',
          children: [
            {
              path: '',
              // element: <ProductsPage />
              element: <ApartmenetPage />,
            },
            {
              path: 'create',
              element: <CreateApartement />,
            },
            {
              path: 'edit/:id',
              element: <EditApartement />,
            },
            {
              path: 'edit-property-room/:id',
              element: <UpdatePropertyRoomCreate />,
            },
            // ],
            {
              path: 'create-property-room/:id',
              element: <PropertyRoomCreate />,
            },
            {
              path: 'property-room/:id',
              element: <PropertyRoomPage />,
            },
          ],
        },
        {
          path: 'management-promo',
          children: [
            {
              path: '',
              element: <BlogPage />,
            },
            {
              path: 'create',
              element: <CreatePromo />,
            },
          ],
        },
        {
          path: 'banner',
          children: [
            {
              path: '',
              element: <BannerPage />,
            },
            {
              path: 'create',
              element: <BannerCreate />,
            },
          ],
        },
        {
          path: 'management-property-type',
          children: [
            {
              path: '',
              element: <PropertyPage />,
            },
            {
              path: 'create',
              element: <PropertyCreate />,
            },
            {
              path: 'edit/:id',
              element: <PropertyEdit />,
            },
          ],
        },
        {
          path: 'booked-property',
          children: [
            {
              path: '',
              element: <BookedPropertyPage />,
            },
            {
              path: 'detail/:id',
              element: <PropertyEdit />,
            },
          ],
        },
        {
          path: 'fasilitas',
          children: [
            {
              path: '',
              element: <FasilitasPage />,
            },
          ],
        },
        {
          path: 'room-facility',
          element: <RoomFasilitasPage />,
        },
      ],
    },
    {
      element: (
        <Suspense fallback={renderFallback}>
          <Landing />
        </Suspense>
      ),
      path: '/',
    },
    {
      element: (
        <LandingLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </LandingLayout>
      ),
      children: [
        {
          path: 'about-us',
          element: <About />,
        },
        {
          path: 'property/:slug',
          element: <PropertyDetailPage />,
        },
        {
          path: 'apartement/:slug',
          element: <PropertyDetailPage />,
        },
        {
          path: 'profile',
          element: <AccountView />,
        },
        {
          path: 'booking/:slug',
          element: <BookingView />,
        },
        {
          path: 'wishlist',
          element: <WishlistPageView />,
        },
        {
          path: 'sewa/kost/kota/:slug',
          element: <PropertyLocationDetail />,
        },
        {
          path: 'history/visit',
          element: <HistoryVisit />,
        },
        {
          path: 'history/visit/detail/:visitCode',
          element: <VisitDetail />,
        },
        {
          path: 'history/booking',
          element: <HistoryBooking />,
        },
        {
          path: 'history/booking/detail/:bookingCode',
          element: <HistoryBookingDetail />,
        },
        {
          path: '/promo',
          element: <PromoPage />,
        },
        {
          path: '/coliving',
          element: <ColivingPage />,
        },
        {
          path: '/apartment',
          element: <ApartmentList />,
        },
        {
          path: '/about-us',
          element: <div>Laman tentang ini masih dalam pengembangan</div>,
        },
        {
          path: '/kerja-sama',
          element: <div>Laman kerja sama ini masih dalam pengembangan</div>,
        },
        {
          path: '/bussines',
          element: <div>Laman bussines ini masih dalam pengembangan</div>,
        },
      ],
    },
    {
      element: (
        <Suspense fallback={renderFallback}>
          <LandingLayout>
            <PromoPage />
          </LandingLayout>
        </Suspense>
      ),
      path: '/promo',
    },
    {
      element: (
        <Suspense fallback={renderFallback}>
          <LandingLayout>
            <PropertyDetail />
          </LandingLayout>
        </Suspense>
      ),
      path: 'property/:slug',
    },

    {
      element: (
        <AuthLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </AuthLayout>
      ),
      children: [
        {
          path: 'sign-in',
          element: <SignInPage />,
        },
        {
          path: 'sign-up',
          element: <SignUpView />,
        },
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
