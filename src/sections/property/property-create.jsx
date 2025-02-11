import { Box, Button, Container, Stack, TextField, Typography, FormLabel, MenuItem, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { useCreateProperty, useGetCity, useGetState } from "src/hooks/property";
import { router } from "src/hooks/routing/useRouting";
import { useRouter } from "src/routes/hooks";
import { useFetchFacilities } from "src/hooks/facilities";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

const schema = yup.object().shape({
   name: yup.string().required("Nama Properti wajib diisi").min(3, "Minimal 3 karakter").max(255, "Maksimal 255 karakter"),
   type: yup.string().required("Tipe Properti wajib dipilih"),
   status: yup.string().required("Status wajib dipilih"),
   address: yup.string().required("Alamat wajib diisi").min(3, "Minimal 3 karakter").max(255, "Maksimal 255 karakter"),
   link_googlemaps: yup.string().required("Link Google Maps wajib diisi").url("Format URL tidak valid"),
   description: yup.string().required("Deskripsi wajib diisi").min(3, "Minimal 3 karakter"),
   state_id: yup.string().required("Provinsi wajib dipilih"),
   city_id: yup.string().required("Kota wajib dipilih"),
   price: yup.string().required("Harga wajib diisi"),
   facilities: yup.array(),
   photos: yup.mixed().required("Minimal satu foto harus diunggah"),
});

export default function PropertyCreate() {
   const { enqueueSnackbar } = useSnackbar();
   const routers = useRouter();
   const queryClient = useQueryClient();
   const [photoPreviews, setPhotoPreviews] = useState([]);

   const { control, register, handleSubmit, watch, formState: { errors } } = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
         name: "",
         type: "",
         status: "",
         address: "",
         link_googlemaps: "",
         description: "",
         state_id: "",
         city_id: "",
         price: "",
         facilities: [],
         photos: [],
      }
   });

   const { data: states = [], isLoading: isLoadingStates } = useGetState();
   const selectedState = watch("state_id", "");
   const { data: cities = [], isLoading: isLoadingCities } = useGetCity(selectedState);
   const { data: facilities = [] } = useFetchFacilities();
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

   const handlePhotoChange = (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
         setPhotoPreviews(files.map(file => URL.createObjectURL(file)));
      }
   };
   
   const OnSubmit = (data) => {
      if (!data.photos || data.photos.length === 0) {
         enqueueSnackbar("Minimal satu foto harus diunggah", { variant: "error" });
         return;
      }
   
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("status", data.status);
      formData.append("address", data.address);
      formData.append("link_googlemaps", data.link_googlemaps);
      formData.append("description", data.description);
      formData.append("state_id", data.state_id);
      formData.append("city_id", data.city_id);
      formData.append("price", cleanPrice(data.price));
   
      // Pastikan data.photos adalah array
      const photosArray = Array.isArray(data.photos) ? data.photos : Array.from(data.photos);
   
      photosArray.forEach((file) => formData.append("files[]", file));
   
      mutate(formData);
   };
   
   
   
   const cleanPrice = (price) => {
      return parseInt(price.replace(/[^\d]/g, ""), 10);
   };
   

   return (
      <Container>
         <form onSubmit={handleSubmit(OnSubmit)}>
            <Typography variant="h4">Tambah Properti Baru</Typography>
            <Box sx={{ mt: 5 }}>
               <Stack spacing={3}>
                  <TextField {...register('name')} label="Nama Properti" fullWidth error={!!errors.name} helperText={errors.name?.message}/>

                  <TextField select {...register('type')} defaultValue="" label="Tipe Properti" fullWidth error={!!errors.type} helperText={errors.type?.message}>
                     <MenuItem value="Coliving">Coliving</MenuItem>
                     <MenuItem value="Kostan">Kostan</MenuItem>
                     <MenuItem value="Kontrakan">Kontrakan</MenuItem>
                  </TextField>

                  <TextField {...register('address')} label="Alamat" fullWidth error={!!errors.address} helperText={errors.address?.message} />
                  <TextField {...register('link_googlemaps')} label="Link Google Maps" fullWidth error={!!errors.link_googlemaps} helperText={errors.link_googlemaps?.message} />
                  <TextField {...register('description')} label="Deskripsi" fullWidth multiline rows={3} error={!!errors.description} helperText={errors.description?.message} />

                  <TextField select {...register('status')} defaultValue="" label="Status" fullWidth error={!!errors.status} helperText={errors.status?.message}>
                     <MenuItem value="available">Available</MenuItem>
                     <MenuItem value="unavailable">Unavailable</MenuItem>
                  </TextField>

                  <TextField select {...register('state_id')} defaultValue="" label="Provinsi" fullWidth disabled={isLoadingStates} error={!!errors.state_id} helperText={errors.state_id?.message}>
                     {states?.map((state) => (
                        <MenuItem key={state.state_code} value={state.state_code}>{state.name}</MenuItem>
                     ))}
                  </TextField>

                  <TextField select {...register('city_id')} defaultValue="" label="Kota" fullWidth disabled={isLoadingCities || !selectedState} error={!!errors.city_id} helperText={errors.city_id?.message}>
                     {cities?.map((city) => (
                        <MenuItem key={city.city_code} value={city.city_code}>{city.name}</MenuItem>
                     ))}
                  </TextField>

                  <Controller
                     name="price"
                     control={control}
                     render={({ field }) => (
                        <NumericFormat
                           {...field}
                           customInput={TextField}
                           label="Harga"
                           fullWidth
                           prefix="Rp "
                           thousandSeparator="."
                           decimalSeparator="," 
                           error={!!errors.price}
                           helperText={errors.price?.message}
                        />
                     )}
                  />

                  <FormLabel>Fasilitas</FormLabel>
                  <FormGroup>
                     {facilities?.map((facility) => (
                        <FormControlLabel
                           key={facility.id}
                           control={<Checkbox {...register("facilities")} value={facility.id} />}
                           label={facility.name}
                        />
                     ))}
                  </FormGroup>

                  {/* Input File untuk Foto */}
                  <FormLabel>Upload Foto</FormLabel>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    {...register("photos", { required: "Minimal satu foto harus diunggah" })}
                    onChange={(e) => {
                    handlePhotoChange(e);
                    setValue("photos", Array.from(e.target.files) || []); // Menyimpan file ke state React Hook Form
                  }}
                  />

                  {errors.photos && <Typography color="error">{errors.photos.message}</Typography>}

                  {/* Preview Foto */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                     {photoPreviews.map((src, index) => (
                        <img key={index} src={src} alt={`preview-${index}`} width={100} height={100} style={{ borderRadius: 8 }} />
                     ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
                     <Button type="submit" variant="contained" disabled={isPending}>Submit</Button>
                     <Link to={router.property.list}>
                        <Button variant="outlined">Kembali</Button>
                     </Link>
                  </Box>
               </Stack>
            </Box>
         </form>
      </Container>
   );
}
