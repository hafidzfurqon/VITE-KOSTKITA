import { Box, Button, Container, Stack, TextField, Typography, FormLabel, MenuItem, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useCreateProperty, useGetCity, useGetState } from "src/hooks/property";
import { useRouter } from "src/routes/hooks";
import { useFetchFacilities } from "src/hooks/facilities";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { MultiFilePreview, Upload } from "src/components/upload";

const schema = yup.object().shape({
   name: yup.string().required("Nama Properti wajib diisi").min(3).max(255),
   type: yup.string().required("Tipe Properti wajib dipilih"),
   status: yup.string().required("Status wajib dipilih"),
   address: yup.string().required("Alamat wajib diisi").min(3).max(255),
   link_googlemaps: yup.string().required("Link Google Maps wajib diisi").url("Format URL tidak valid"),
   description: yup.string().required("Deskripsi wajib diisi").min(3),
   state_id: yup.string().required("Provinsi wajib dipilih"),
   city_id: yup.string().required("Kota wajib dipilih"),
   price: yup.string().required("Harga wajib diisi"),
   payment_type: yup.string().required("Tipe pembayaran wajib diisi"),
   facilities: yup.array(),
   photos: yup.mixed().required("Minimal satu foto harus diunggah"),
});

export default function PropertyCreate() {
   const { enqueueSnackbar } = useSnackbar();
   const router = useRouter();
   const queryClient = useQueryClient();
   const [photoPreviews, setPhotoPreviews] = useState([]);
   const [files, setFiles] = useState([]);

   const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
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
         payment_type: "",
         facilities: [],
         photos: [],
      }
   });

   const { data: states = [] } = useGetState();
   const selectedState = watch("state_id", "");
   const { data: cities = [] } = useGetCity(selectedState);
   const { data: facilities = [] } = useFetchFacilities();
   const { mutate, isPending } = useCreateProperty({
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['list.property'] });
         router.push('/property');
         enqueueSnackbar('Properti berhasil ditambahkan', { variant: 'success' });
      },
      onError: () => {
         enqueueSnackbar('Gagal menambahkan properti', { variant: 'error' });
      }
   });

   const OnSubmit = (data) => {
      if (files.length === 0) {
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
      formData.append("payment_type", data.payment_type);

      files.forEach((file) => formData.append("files[]", file));

      mutate(formData);
   };

   const handleDropMultiFile = (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      setPhotoPreviews(newFiles.map(file => URL.createObjectURL(file)));
      setValue("photos", newFiles);
   };

   const handleRemoveFile = (file) => {
      const filteredFiles = files.filter(f => f !== file);
      setFiles(filteredFiles);
      setPhotoPreviews(filteredFiles.map(f => URL.createObjectURL(f)));
      setValue("photos", filteredFiles);
   };

   const handleRemoveAllFiles = () => {
      setFiles([]);
      setPhotoPreviews([]);
      setValue("photos", []);
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
                  <TextField {...register('name')} label="Nama Properti" fullWidth error={!!errors.name} helperText={errors.name?.message} />

                  <TextField select {...register('type')} defaultValue="" label="Tipe Properti" fullWidth error={!!errors.type} helperText={errors.type?.message}>
                     <MenuItem value="Coliving">Coliving</MenuItem>
                     <MenuItem value="Kostan">Kostan</MenuItem>
                     <MenuItem value="Kontrakan">Kontrakan</MenuItem>
                  </TextField>

                  <TextField {...register('address')} label="Alamat" fullWidth error={!!errors.address} helperText={errors.address?.message} />
                  <TextField {...register('link_googlemaps')} label="Link Google Maps" fullWidth error={!!errors.link_googlemaps} helperText={errors.link_googlemaps?.message} />
                  <TextField {...register('description')} label="Deskripsi" fullWidth multiline rows={3} error={!!errors.description} helperText={errors.description?.message} />

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

                  <TextField {...register('payment_type')} label="Tipe Pembayaran" fullWidth error={!!errors.payment_type} helperText={errors.payment_type?.message} />

                  <FormLabel>Fasilitas</FormLabel>
                  <FormGroup>
                     {facilities?.map((facility) => (
                        <FormControlLabel key={facility.id} control={<Checkbox {...register("facilities")} value={facility.id} />} label={facility.name} />
                     ))}
                  </FormGroup>

                  <FormLabel>Upload Foto</FormLabel>
                  <Upload multiple files={files} onDrop={handleDropMultiFile} onRemove={handleRemoveFile} onRemoveAll={handleRemoveAllFiles} />
                  {errors.photos && <Typography color="error">{errors.photos.message}</Typography>}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                   {files.map((file, index) => (
                  <img key={file.name || index} src={photoPreviews[index]} alt={`preview-${index}`} width={100} height={100} style={{ borderRadius: 8 }} />
                  ))}
                 </Box>


                  <Button type="submit" variant="contained" disabled={isPending}>Submit</Button>
               </Stack>
            </Box>
         </form>
      </Container>
   );
}
