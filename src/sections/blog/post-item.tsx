import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import DialogDelete from 'src/component/DialogDelete';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useMutationDeletePromo } from 'src/hooks/promo';

// ----------------------------------------------------------------------

export type PostItemProps = {
  id: any;
  title: string;
  promo_image_url: string;
  coverUrl: string;
  totalViews: number;
  description: string;
  totalShares: number;
  totalComments: number;
  totalFavorites: number;
  name: string;
  created_at: string | any;
  postedAt: string | number | null;
  author: {
    name: string;
    avatarUrl: string;
  };
};

export function PostItem({
  sx,
  post,
  latestPost,
  latestPostLarge,
  ...other
}: CardProps & {
  post: PostItemProps;
  latestPost: boolean;
  latestPostLarge: boolean;
}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: DeletePromo, isPending } = useMutationDeletePromo({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.promo'] });
      setOpen(false);
      enqueueSnackbar('Promo berhasil dihapus', { variant: 'success' });
    },
    onError: (err: any) => {
      enqueueSnackbar('Promo gagal dihapus', { variant: 'error' });
    },
  });

  const handleSubmit = () => {
    DeletePromo(post.id);
  };
  const renderTitle = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        height: 44,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h5', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {post.name}
    </Link>
  );

  const renderInfo = (
    <Box
      gap={1.5}
      display="flex"
      flexWrap="wrap"
      justifyContent="flex-end"
      sx={{
        mt: 3,
        color: 'text.disabled',
      }}
    >
      <Box
        component="button"
        onClick={handleClickOpen}
        display="flex"
        sx={{
          ...((latestPostLarge || latestPost) && {
            opacity: 0.64,
            color: 'red',
            cursor: 'pointer',
          }),
        }}
      >
        <Iconify width={16} icon={'solar:trash-bin-trash-bold'} sx={{ mr: 0.5 }} />
      </Box>
    </Box>
  );

  const renderCover = (
    <Box
      component="img"
      alt={post.title}
      src={post.promo_image_url}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderDate = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...((latestPostLarge || latestPost) && {
          opacity: 0.48,
          color: 'common.white',
        }),
      }}
    >
      {fDate(post.created_at)}
    </Typography>
  );

  const renderShape = (
    <SvgColor
      width={88}
      height={36}
      src="/assets/icons/shape-avatar.svg"
      sx={{
        left: 0,
        zIndex: 9,
        bottom: -16,
        position: 'absolute',
        color: 'background.paper',
        ...((latestPostLarge || latestPost) && { display: 'none' }),
      }}
    />
  );

  return (
    <>
      <Card sx={sx} {...other}>
        <Box
          sx={(theme) => ({
            position: 'relative',
            pt: 'calc(100% * 3 / 4)',
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: varAlpha(theme.palette.grey['900Channel'], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          })}
        >
          {/* {renderShape} */}
          {/* {renderAvatar} */}
          {renderCover}
        </Box>

        <Box
          sx={(theme) => ({
            p: theme.spacing(6, 3, 3, 3),
            ...((latestPostLarge || latestPost) && {
              width: 1,
              bottom: 0,
              position: 'absolute',
            }),
          })}
        >
          {renderDate}
          {renderTitle}
          {renderInfo}
        </Box>
      </Card>
      <DialogDelete
        title="yakin untuk menghapus Promo ?"
        description="data yang telah di hapus tidak akan kembali"
        setOpen={setOpen}
        open={open}
        Submit={handleSubmit}
        pending={isPending}
      />
    </>
  );
}
