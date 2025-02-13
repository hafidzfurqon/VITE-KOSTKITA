import { Box, Button, Container, Stack, TextField, Typography, FormLabel } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useCreateBanner } from "src/hooks/banner";
import { router } from "src/hooks/routing/useRouting";
import { useRouter } from "src/routes/hooks";

export default function BannerCreate() {
  const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();
  const { register, handleSubmit, watch } = useForm();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateBanner({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list.banner'] });
      routers.push('/banner');
      enqueueSnackbar('Banner berhasil dibuat', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Gagal menambahkan banner', { variant: 'error' });
    }
  });

  const [previewImage, setPreviewImage] = useState(null);
  const imageFile = watch("image");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const OnSubmit = (data) => {
    const { image: gambar, ...rest } = data;
    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('image', gambar[0]);
    mutate(formData);
  };

  return (
    <Container>
      <Typography variant="h4">Tambah Banner Baru</Typography>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'List Banner', href: router.banner.list },
          { name: 'Create Banner' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box sx={{ mt: 5 }}>
        <Box component="form" onSubmit={handleSubmit(OnSubmit)}>
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
              required
              margin="dense"
              id="url_reference"
              label="Link URL"
              type="text"
              fullWidth
              variant="outlined"
            />

            <FormLabel>Image</FormLabel>
            <TextField
              {...register('image')}
              margin="dense"
              id="image"
              type="file"
              fullWidth
              variant="outlined"
              onChange={handleImageChange}
            />

            {previewImage && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Preview:</Typography>
                <img src={previewImage} alt="Preview" style={{ width: "100%", maxWidth: "300px", borderRadius: 8 }} />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
              <Button type="submit" variant="contained" disabled={isPending}>
                Submit
              </Button>
              <Link to={router.banner.list}>
                <Button variant="outlined">Kembali</Button>
              </Link>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
