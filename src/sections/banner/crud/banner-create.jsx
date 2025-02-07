import { Box, Button, Container, Stack, TextField, Typography, FormLabel } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useCreateBanner } from "src/hooks/banner";
import { router } from "src/hooks/routing/useRouting";
import { useRouter } from "src/routes/hooks";

export default function BannerCreate() {
   const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();
  const {register, handleSubmit} = useForm()
  const queryClient = useQueryClient();
  const {mutate, isPending} = useCreateBanner({
    onSuccess : () => {
      queryClient.invalidateQueries({ queryKey: ['list.banner'] });
      routers.push('/banner')
      enqueueSnackbar('Banner berhasil dibuat', { variant: 'success' });
    },
     onError : () => {
      enqueueSnackbar('gagal menambahkan banner', { variant: 'error' });
    }
  });
  const OnSubmit = (data) => {
    const { image: gambar, ...rest } = data;
    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('image', gambar[0]);
    mutate(formData);
    // console.log(data)
  }
  return (
   <>
   <Container>
   <Typography variant="h4">Tambah Banner baru disini</Typography>
   <Box sx={{ mt: 5 }}>
    <Box component='form' onSubmit={handleSubmit(OnSubmit)}>
    <Stack spacing={3}>
    <TextField
          {...register('title', { required: 'Nama Banner perlu diisi' })}
          autoFocus
          required
          margin="dense"
          id="title"
          label="Judul Banner"
          type="text"
          fullWidth
          variant="outlined"
            />
             <TextField
          {...register('url_reference', { required: 'Nama Banner perlu diisi' })}
          // autoFocus
          required
          margin="dense"
          id="url_reference"
          label="Link Url"
          type="text"
          fullWidth
          variant="outlined"
            />
    <FormLabel>
    Image
    <TextField
    {...register('image')}
    margin="dense"
    id="image"
    type="file"
    fullWidth
    variant="outlined"
    />
    </FormLabel>
    <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
              <Button type="submit" variant="contained" disabled={isPending}>
                Submit
              </Button>
              <Link to={router.banner.list}>
                <Button type="submit" variant="outlined">
                  Kembali
                </Button>
              </Link>
            </Box>
    </Stack>
    </Box>
   </Box>
   </Container>
   </>
  )
}
