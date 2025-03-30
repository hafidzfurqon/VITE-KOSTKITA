import { useState, useCallback } from 'react';
import type { IconButtonProps } from '@mui/material/IconButton';

// MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

// External Hooks
import { useSnackbar } from 'src/components/snackbar';
// Internal Modules
import { useRouter, usePathname } from 'src/routes/hooks';
import { _myAccount } from 'src/_mock';
import { useMutationLogout } from 'src/hooks/auth/useMutationLogout';
import { err } from 'src/sections/auth';
import DialogDelete from 'src/component/DialogDelete';
import { useAppContext } from 'src/context/user-context';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const { UserContextValue: authUser }: any = useAppContext();
  const { user } = authUser;
  // console.log(user);
  // State Management
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  // Logout Mutation
  const { mutate: handleLogout, isPending } = useMutationLogout({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticated.user'] }); // Reset cache
      router.push('/'); // Kembali ke landing page
      enqueueSnackbar('Logout berhasil', { variant: 'success' });

      setTimeout(() => {
        window.location.reload(); // Refresh halaman agar reset state
      }, 500);
    },
    onError: (error: err) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  // Popover Handlers
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  return (
    <>
      {/* Profile Button */}
      {/* sadasdasd */}
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: '2px',
          width: 40,
          height: 40,
          background: (theme) =>
            `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
          ...sx,
        }}
        {...other}
      >
        <Avatar src={user?.photo_profile_url} alt={user?.name} sx={{ width: 1, height: 1 }}>
          {/* {_myAccount.displayName.charAt(0).toUpperCase()} */}
        </Avatar>
      </IconButton>

      {/* Popover Menu */}
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 200 } } }}
      >
        {/* User Info */}
        <Box sx={{ p: 2, pb: 1.5 }}>
        {/* sadasdasd */}
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            No Telp : {user.phone_number}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* Navigation Menu */}
        <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
              [`&.${menuItemClasses.selected}`]: {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.label}
              selected={option.href === pathname}
              onClick={() => handleClickItem(option.href)}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* Logout Button */}
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            color="error"
            size="medium"
            variant="text"
            onClick={() => setOpenDeleteDialog(true)}
          >
            Logout
          </Button>
        </Box>
      </Popover>

      {/* Logout Confirmation Dialog */}
      <DialogDelete
        title="Apakah anda yakin akan Logout?"
        description="Anda akan keluar dari dashboard"
        setOpen={setOpenDeleteDialog}
        open={openDeleteDialog}
        Submit={handleLogout}
        pending={isPending}
      />
    </>
  );
}
