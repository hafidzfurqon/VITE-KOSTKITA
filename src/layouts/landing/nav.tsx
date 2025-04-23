import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { WorkspacesPopover } from '../components/workspaces-popover';

import imageLogo from '../../../public/assets/images/logo.png';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';
import { useAppContext } from 'src/context/user-context';
import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import DialogDelete from 'src/component/DialogDelete';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useMutationLogout } from 'src/hooks/auth/useMutationLogout';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
    children?: any;
    setOpenDeleteDialog?: () => void;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: theme.vars.palette.common.white,
        zIndex: 1101,
        width: '300px',
        borderRight: `1px solid  ${varAlpha(theme.vars.palette.grey['500Channel'], 0.8)}, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobileLanding({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'white',
          width: '320px',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
  // console.log(data)
  const { UserContextValue: authUser }: any = useAppContext();
  const { user } = authUser;
  const [openCollapse, setOpenCollapse] = useState<{ [key: string]: boolean }>({});
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { mutate: handleLogout, isPending } = useMutationLogout({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticated.user'] });
      navigate('/'); // Kembali ke landing page
      enqueueSnackbar('Logout berhasil', { variant: 'success' });
      localStorage.removeItem('token'); // Hapus token saat logout
      setOpenDeleteDialog(false);
      setTimeout(() => {
        window.location.reload(); // Reload halaman
      }, 100); // 100ms cukup, atau bisa sesuaikan
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });
  // Pastikan user.roles ada dan memeriksa apakah user memiliki role "owner_property"
  const isOwnerProperty = user?.roles?.some((role: any) => role.name === 'owner_property');

  const filteredNavData = data.map((item) => {
    // Jika item adalah 'Management Property' dan user adalah owner, ubah children-nya
    if (isOwnerProperty && item.title === 'Management Property') {
      return {
        ...item,
        children: item.children.filter((child: { title: string }) => child.title === 'Property'),
      };
    }
    return item;
  });
  const theme = useTheme();

  return (
    <>
      {/* <Logo /> */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          mt: 3,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <img src={imageLogo} alt="" width={150} />
        {user?.roles?.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              // mb: 2,
              mt: 1,
            }}
          >
            <Box
              component="img"
              src={user?.photo_profile_url} // Ganti dengan path default kalau belum ada avatar
              alt={user.name}
              sx={{
                width: 64,  
                height: 64,
                borderRadius: '50%',
                mb: 1,
                objectFit: 'cover',
                border: `2px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.8)}`,
              }}
            />
            <Typography variant="subtitle2" noWrap>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        )}
        {/* <Typography>Hello Selamat Datang di dashboard RODAMU</Typography> */}
      </Box>
      {slots?.topArea}
      {/* <WorkspacesPopover data={workspaces} sx={{ my: 2 }} /> */}
      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {filteredNavData.map((item) => {
              const isActived = pathname === item.path;
              console.log(isActived);
              const hasChildren = item.children && item.children.length > 0;

              return (
                <Box key={item.title}>
                  {/* Jika item tidak punya children, tampilkan langsung */}
                  {!hasChildren ? (
                    <ListItem disableGutters disablePadding>
                      <ListItemButton
                        disableGutters
                        component={RouterLink}
                        href={item.path}
                        sx={{
                          pl: 2,
                          py: 1,
                          gap: 2,
                          pr: 1.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                          fontWeight: 'fontWeightMedium',
                          color: theme.vars.palette.text.secondary,
                          minHeight: '44px',
                          ...(isActived && {
                            fontWeight: 'fontWeightSemiBold',
                            bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                            color: theme.vars.palette.primary.main,
                            '&:hover': {
                              bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                            },
                          }),
                        }}
                      >
                        <Box component="span" sx={{ width: 24, height: 24 }}>
                          {item.icon}
                        </Box>
                        <Box component="span" flexGrow={1}>
                          {item.title}
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  ) : (
                    // Jika ada children, hanya tampilkan tombol toggle
                    <>
                      <ListItemButton
                        onClick={() =>
                          setOpenCollapse((prev: any) => ({
                            ...prev,
                            [item.title]: !prev[item.title],
                          }))
                        }
                        sx={{
                          pl: 2,
                          py: 1,
                          gap: 2,
                          pr: 1.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                          fontWeight: 'fontWeightMedium',
                          color: theme.vars.palette.text.secondary,
                          minHeight: '44px',
                          ...(pathname.startsWith(item.path) && {
                            fontWeight: 'fontWeightSemiBold',
                            bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                            color: theme.vars.palette.primary.main,
                            '&:hover': {
                              bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                            },
                          }),
                        }}
                      >
                        <Box component="span" sx={{ width: 24, height: 24 }}>
                          {item.icon}
                        </Box>
                        <Box component="span" flexGrow={1}>
                          {item.title}
                        </Box>
                        {openCollapse[item.title] ? (
                          <ExpandLessIcon fontSize="small" />
                        ) : (
                          <ExpandMoreIcon fontSize="small" />
                        )}
                      </ListItemButton>

                      {/* Render Children */}
                      <Collapse in={openCollapse[item.title]} timeout="auto" unmountOnExit>
                        <Box component="ul" sx={{ pl: 4 }}>
                          {item.children.map((child: any) => {
                            const isChildActive = pathname.startsWith(child.path);
                            return (
                              <ListItem disableGutters disablePadding key={child.title}>
                                <ListItemButton
                                  disableGutters
                                  component={RouterLink}
                                  href={child.path}
                                  sx={{
                                    pl: 2,
                                    py: 1,
                                    gap: 2,
                                    pr: 1.5,
                                    borderRadius: 0.75,
                                    typography: 'body2',
                                    color: 'var(--layout-nav-item-color)',
                                    minHeight: 'var(--layout-nav-item-height)',
                                    ...(isChildActive && {
                                      fontWeight: 'fontWeightSemiBold',
                                      bgcolor: 'var(--layout-nav-item-active-bg)',
                                      color: 'var(--layout-nav-item-active-color)',
                                      '&:hover': {
                                        bgcolor: 'var(--layout-nav-item-hover-bg)',
                                      },
                                    }),
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      width: 4,
                                      height: 4,
                                      bgcolor: 'text.disabled',
                                      borderRadius: '50%',
                                      mr: 1,
                                    }}
                                  />
                                  <Box component="span" sx={{ width: 24, height: 24 }}>
                                    {child?.icon}
                                  </Box>
                                  <Box component="span" flexGrow={1}>
                                    {child.title}
                                  </Box>
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </Box>
                      </Collapse>
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
          {user?.roles?.length > 0 ? (
            <Button
              fullWidth
              sx={{
                pl: 2,
                py: 1,
                gap: 2,
                pr: 1.5,
                borderRadius: 0.75,
                typography: 'body2',
                fontWeight: 'fontWeightMedium',
                px: 3,
                mt: 2,
                color: 'gray',
              }}
              onClick={() => setOpenDeleteDialog(true)}
              variant="outlined"
              disabled={isPending}
            >
              Keluar
            </Button>
          ) : (
            <>
              {' '}
              <Button
                sx={{
                  pl: 2,
                  py: 1,
                  gap: 2,
                  pr: 1.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  fontWeight: 'fontWeightMedium',
                  px: 3,
                  mt: 2,
                  color: 'gray',
                }}
                onClick={() => navigate('/sign-in')}
                variant="outlined"
              >
                Masuk/Daftar
              </Button>
            </>
          )}
        </Box>
      </Scrollbar>
      <Typography variant="body2" color="gray" sx={{ p: 1 }}>
        © 2025 KosKita.id. All rights reserved.
      </Typography>
      {/* {`© 2025 KosKita.id. All rights reserved.`} */}
      {/* <NavUpgrade /> */}
      <DialogDelete
        open={openDeleteDialog}
        setOpen={() => setOpenDeleteDialog(false)}
        Submit={handleLogout}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin logout?"
        pending={isPending}
      />
    </>
  );
}
