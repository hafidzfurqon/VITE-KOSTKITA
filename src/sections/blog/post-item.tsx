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
import {
  Button,
  CardActions,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  styled,
  TextField,
} from '@mui/material';
import { useAppContext } from 'src/context/user-context';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { IconButton } from '@mui/material';
// import { ExpandMore } from '@mui/icons-material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

// ----------------------------------------------------------------------

export type PostItemProps = {
  id: any;
  title: string;
  slug?: string;
  promo_image_url?: string;
  coverUrl: string;
  totalViews: number;
  description: string;
  totalShares: number;
  totalComments: number;
  totalFavorites: number;
  // post?: any;
  name?: string;
  created_at?: string | any;
  postedAt: string | number | null;
  author: {
    name: string;
    avatarUrl: string;
  };
};
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export function PostItem({
  sx,
  post,
}: CardProps & {
  post: PostItemProps;
}) {
  const { UserContextValue: authUser }: any = useAppContext();
  const { user } = authUser;
  const isAdmin = user?.roles?.some((role: any) => role.name.toLowerCase() === 'admin');
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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

  return (
    <>
      <Card>
        <CardMedia component="img" height="194" image={post.promo_image_url} alt="Paella dish" />
        <CardContent>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            {post.name}
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{ pb: 2, px: 1 }}>
          <Box>
            {isAdmin && (
              <Box>
                <Links to={`/management-promo/edit/${post.slug}`}>
                  <Button sx={{ color: 'primary.main' }}>
                    <Iconify icon="solar:pen-bold" />
                    Edit
                  </Button>
                </Links>
                <Button onClick={handleClickOpen} sx={{ color: 'error.main' }}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  Delete
                </Button>
              </Box>
            )}
            <Button
              variant="outlined"
              sx={{ color: 'secondary.main' }}
              component={Links}
              to={`/management-promo/follow/${post.id}`}
            >
              <Iconify icon="mingcute:add-line" />
              Tambah Diskon
            </Button>
          </Box>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography sx={{ marginBottom: 2 }}>Deskripsi:</Typography>
            <Typography
              color="text.secondary"
              dangerouslySetInnerHTML={{ __html: post.description }}
            />
          </CardContent>
        </Collapse>
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
