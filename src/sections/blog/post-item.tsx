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
import { Link as Links } from 'react-router-dom';
// import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Button } from '@mui/material';
import { useAppContext } from 'src/context/user-context';

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
  const { UserContextValue: authUser }: any = useAppContext();
  const { user } = authUser;
  const isAdmin = user?.roles?.some((role: any) => role.name === 'admin');
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: DeletePromo, isPending } = useMutationDeletePromo({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.promo'] });
      queryClient.refetchQueries({ queryKey: ['fetch.promo'] });
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
      {post.title}
    </Link>
  );

  const renderTempat = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        height: 24,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h5', height: 40 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {post.name}
    </Link>
  );

  const renderInfo = () => {
    return (
      <>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="flex-end"
          sx={{
            mt: 3,
            color: 'text.disabled',
          }}
        >
          <Box
            display="flex"
            sx={{
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
            }}
          >
            <Links style={{ color: 'slategray' }} to="">
              <Iconify width={16} icon="solar:eye-bold" sx={{ mr: 0.5 }} />
            </Links>
            <Box
              component="button"
              sx={{
                border: 'none',
                cursor: 'pointer',
                background: 'none',
                color: 'green',
                ...((latestPostLarge || latestPost) && {
                  color: 'common.white',
                }),
              }}
            >
              <Iconify width={16} icon="solar:pen-bold" sx={{ mr: 0.5 }} />
            </Box>
            <Box
              component="button"
              onClick={handleClickOpen}
              sx={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              <Iconify width={16} icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
            </Box>
          </Box>
        </Box>
      </>
    );
  };

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
          {renderTempat}
          {renderTitle}
          {isAdmin && renderInfo()}
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
  // return (
  //   <>
  //     <Card sx={{ maxWidth: 345 }}>
  //       <CardActionArea>
  //         <CardMedia component="img" height="auto" image={post.promo_image_url} alt={post.name} />
  //         <CardContent>
  //           <Typography gutterBottom variant="h5" component="div">
  //             {post.name}
  //           </Typography>
  //           <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //             {post.description}
  //           </Typography>
  //         </CardContent>
  //         {isAdmin && (
  //           <Box component="div" p={1}>
  //             <Button>
  //               <Iconify icon="solar:pen-bold" />
  //               Edit
  //             </Button>

  //             <Button sx={{ color: 'error.main' }} onClick={handleClickOpen}>
  //               <Iconify icon="solar:trash-bin-trash-bold" />
  //               Delete
  //             </Button>
  //           </Box>
  //         )}
  //       </CardActionArea>
  //     </Card>
  //
  //   </>
  // );
}
