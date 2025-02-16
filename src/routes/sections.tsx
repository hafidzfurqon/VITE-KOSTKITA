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
import PropertyDetail from 'src/sections/landing/property-detail';
import PropertyPage from 'src/pages/property';
import PropertyCreate from 'src/sections/property/property-create';
import FasilitasPage from 'src/pages/fasilitas';
import { LandingLayout } from 'src/layouts/landing';
import { CreatePromo } from 'src/sections/blog/crud-view/CreatePromo';

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
        { path: 'apartement',
          //  element: <ProductsPage />
           element: <ApartmenetPage />
           },
        {
        path: 'management-promo', 
        children: [
        { 
          path: '',
          element: <BlogPage /> 
        },
        {
          path: 'create',
          element: <CreatePromo/>,
        },
       ]
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
              element: <BannerCreate/>,
            },
          ],
        },
        {
          path: 'property',
          children: [
            {
              path: '',
              element: <PropertyPage />,
            },
            {
              path: 'create',
              element: <PropertyCreate/>,
            },
          ],
        },
        {
        path: 'fasilitas',
        children: [
          {
            path: '',
            element: <FasilitasPage/>,
          },
          ],
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
  element : (
    <LandingLayout>
      <Suspense fallback={renderFallback}>
        <Outlet/>
      </Suspense>
    </LandingLayout>
  ),
  children : [
    {
      path: "property/:slug",
      element :  <PropertyDetail />
    },
    {
      path: "/promo",
      element : <PromoPage />
    },
    {
      path: "/about-us",
      element : <div>Laman tentang ini masih dalam pengembangan</div>
    },
    {
      path: "/kerja-sama",
      element : <div>Laman kerja sama ini masih dalam pengembangan</div>
    },
    {
      path: "/bussines",
      element : <div>Laman bussines ini masih dalam pengembangan</div>
    },
  ]
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
          element: <SignUpView/>,
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
