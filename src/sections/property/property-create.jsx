import { Box, Button, Container, Stack, TextField, Typography, FormLabel, MenuItem } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useCreateProperty } from "src/hooks/property";
import { router } from "src/hooks/routing/useRouting";
import { useRouter } from "src/routes/hooks";

export default function PropertyCreate() {
   const { enqueueSnackbar } = useSnackbar();
   const routers = useRouter();
   const { register, handleSubmit } = useForm();
   const queryClient = useQueryClient();
   const { mutate, isPending } = useCreateProperty({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['list.property'] });
         routers.push('/property');
         enqueueSnackbar('Properti berhasil ditambahkan', { variant: 'success' });
      },
      onError: () => {
         enqueueSnackbar('Gagal menambahkan properti', { variant: 'error' });
      }
   });

   const OnSubmit = (data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
         if (key === "files") {
            Array.from(value).forEach(file => formData.append("files[]", file));
         } else {
            formData.append(key, value);
         }
      });
      mutate(formData);
   };

   return (
      <Container>
         <Typography variant="h4">Tambah Properti Baru</Typography>
         <Box sx={{ mt: 5 }}>
            <Box component='form' onSubmit={handleSubmit(OnSubmit)}>
               <Stack spacing={3}>
                  <TextField {...register('name', { required: true, minLength: 3, maxLength: 255 })} label="Nama Properti" fullWidth required />
                  
                  <TextField select {...register('type', { required: true })} label="Tipe Properti" fullWidth required>
                     <MenuItem value="Coliving">Coliving</MenuItem>
                     <MenuItem value="Kostan">Kostan</MenuItem>
                     <MenuItem value="Kontrakan">Kontrakan</MenuItem>
                  </TextField>
                  
                  <TextField {...register('address', { required: true, minLength: 3, maxLength: 255 })} label="Alamat" fullWidth required />
                  <TextField {...register('link_googlemaps', { required: true })} label="Link Google Maps" fullWidth required type="url" />
                  <TextField {...register('description', { required: true, minLength: 3 })} label="Deskripsi" fullWidth required multiline rows={3} />
                  
                  <TextField select {...register('status', { required: true })} label="Status" fullWidth required>
                     <MenuItem value="available">Available</MenuItem>
                     <MenuItem value="unavailable">Unavailable</MenuItem>
                  </TextField>
                  
                  <TextField {...register('state_id', { required: true, min: 1 })} label=" Provinsi" fullWidth required  />
                  <TextField {...register('city_id', { required: true, min: 1 })} label=" Kota" fullWidth required />
                  <TextField {...register('price', { required: true, min: 1 })} label="Harga" fullWidth required type="number" />
                  
                  <FormLabel>Upload Files</FormLabel>
                  <TextField {...register('files')} type="file" inputProps={{ multiple: true }} fullWidth />
                  
                  <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
                     <Button type="submit" variant="contained" disabled={isPending}>
                        Submit
                     </Button>
                     <Link to={router.property.list}>
                        <Button variant="outlined">Kembali</Button>
                     </Link>
                  </Box>
               </Stack>
            </Box>
         </Box>
      </Container>
   );
}