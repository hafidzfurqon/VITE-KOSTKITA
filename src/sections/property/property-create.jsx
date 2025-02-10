import { Box, Button, Container, Stack, TextField, Typography, FormLabel, MenuItem } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { useCreateProperty, useGetCity, useGetState } from "src/hooks/property";
import { router } from "src/hooks/routing/useRouting";
import { useRouter } from "src/routes/hooks";


export default function PropertyCreate() {
   const { enqueueSnackbar } = useSnackbar();
   const routers = useRouter();
   const { control, register, handleSubmit, watch } = useForm();
   const queryClient = useQueryClient();
   const { data: states = [], isLoading: isLoadingStates } = useGetState();
   const selectedState = watch("state_id");
   const { data: cities = [], isLoading: isLoadingCities } = useGetCity(selectedState);
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

                  {/* Select Provinsi */}
                  <TextField select {...register('state_id', { required: true })} label="Provinsi" fullWidth required disabled={isLoadingStates}>
                     {states?.data?.map((state) => (
                        <MenuItem key={state.state_code} value={state.state_code}>
                           {state.name}
                        </MenuItem>
                     ))}
                  </TextField>

                  {/* Select Kota */}
                  <TextField select {...register('city_id', { required: true })} label="Kota" fullWidth required disabled={isLoadingCities}>
                     {cities?.data?.map((city) => (
                        <MenuItem key={city.city_code} value={city.city_code}>
                           {city.name}
                        </MenuItem>
                     ))}
                  </TextField>

                  {/* Input Harga dengan Prefix Rp */}
                  <Controller
                     name="price"
                     control={control}
                     defaultValue=""
                     rules={{ required: "Harga wajib diisi" }}
                     render={({ field, fieldState }) => (
                        <NumericFormat
                           {...field}
                           customInput={TextField}
                           label="Harga"
                           fullWidth
                           required
                           prefix="Rp "
                           thousandSeparator="."
                           decimalSeparator="," 
                           error={!!fieldState.error}
                           helperText={fieldState.error?.message}
                        />
                     )}
                  />

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
