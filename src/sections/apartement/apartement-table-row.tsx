import { useState, useCallback, HTMLInputTypeAttribute } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import DialogDelete from 'src/component/DialogDelete';

import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { FormLabel } from '@mui/material';
import { DialogUpdate } from 'src/component/DialogUpdate';
import { useMutationDeleteApartement } from 'src/hooks/apartement';

// ----------------------------------------------------------------------

export type ApartmentProps = {
  id?: undefined | any | number;
  link_googlemaps: string;
  total_floors: string;
  type: string;
  slug: string;
  payment_type: string;
  name : string;
  "state": {
    "state_code": number,
    "name": string
},
  start_price : string;
  address : string;
  "files": [
  {
  file_url : string
  }
  ],
  url_reference: string;
};

type ApartmentTableRowProps = {
  row: ApartmentProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function ApartementTableRow({ row, selected, onSelectRow }: ApartmentTableRowProps) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
   const handleClickOpen = () => {
    setOpen(true)
   }
   
 
  // const defaultValues = {
  // title : row?.name || '',
  // image_path  : row.image_path || '',
  // image_url  : row.image_url || '',
  // url_reference : row.url_reference || ''
  // };
  // const [preview, setPreview] = useState<string>(defaultValues.image_url)
  // const handleClickOpened = () => {
  //   setPreview(defaultValues.image_url)
  //   setOpened(true);
  // };
  // const handleImageChange = (e : any) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setPreview(imageUrl); // Mengupdate preview dengan gambar baru
  //   }
  // };
  const { register, handleSubmit : handleSubmitForm} = useForm();
    // const FieldRHF = (
    //   <>
    //          <TextField
    //            {...register('title')}
    //              autoFocus
    //             required
    //             margin="dense"
    //            id="nama"
    //            label="Nama Fasilitas"
    //            type="text"
    //            fullWidth
    //            variant="outlined"
    //         />
    //          <TextField
    //           {...register('url_reference')}
    //           autoFocus
    //           required
    //           margin="dense"
    //           id="nama"
    //           label="url Banner"
    //           type="text"
    //           fullWidth
    //           variant="outlined"
    //         />
    //         <FormLabel>
    //             Image
    //             <TextField
    //               {...register('image_path')}
    //               margin="dense"
    //               id="image"
    //               type="file"
    //               fullWidth
    //               variant="outlined"
    //               onChange={handleImageChange}
    //             />
    //           </FormLabel>
    //           {preview && (
    //     <Box mt={2} textAlign="center">
    //       <img
    //         src={preview}
    //         alt="Preview"
    //         style={{
    //           width: "100%",
    //           maxWidth: "300px",
    //           borderRadius: "8px",
    //           border: "1px solid #ddd",
    //           padding: "5px",
    //         }}
    //       />
    //     </Box>
    //   )}
    //   </>
    // )
  //   const { mutate: UpdateBanner, isPending: isLoading } = useUpdateBanner({
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['list.banner'] });
  //       setOpen(false);
  //       enqueueSnackbar('Banner berhasil diupdate', { variant: 'success' });
  //     },
  //     onError: () => {
  //       enqueueSnackbar('gagal mengupdate banner', { variant: 'error' });
  //     },
  //   },
  // row.id);
  
    // const handleClose = () => {
    //   setOpened(false);
    // };

    // const handleCreate = (data : any) => {
    //   const { image_path: gambar, ...rest } = data;
    //   const formData  : any = new FormData();
    //   Object.entries(rest).forEach(([key, value]) => {
    //     formData.append(key, value);
    //   });
    //   formData.append('image', gambar[0]);
    //   formData.append('_method', 'PUT');
    //   UpdateBanner(formData)
    //   handleClose();
    // }
  const { mutate: DeleteApartement, isPending } = useMutationDeleteApartement({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.apartement'] });
      setOpen(false);
      enqueueSnackbar('Apartement berhasil dihapus', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('gagal menghapus apartement', { variant: 'error' });
    },
  });

  
  const handleSubmit = () => {
    DeleteApartement(row.id)
  }
  const renderCover = (
    <Box
      component="img"
      alt={row.name}
      src={row.files[0].file_url}
      sx={{
        top: 0,
        width: 100,
        height: 1,
        objectFit: 'cover',
        borderRadius : '10px'
        // position: 'absolute',
      }}
    />
  );

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align='center' component="th" scope="row">
          {/* <Box gap={2} display="flex" alignItems="center"> */}
            
          {renderCover}
          {/* </Box> */}
        </TableCell>

        <TableCell align='center'>{row.name}</TableCell>


<TableCell align="center">
        <Button onClick={() => alert('sdjshad')}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </Button>

          <Button onClick={handleClickOpen} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </Button>
          <Button onClick={() => alert('detail')} sx={{ color: 'secondary.main' }}>
            <Iconify icon="solar:eye-bold" />
            Lihat
          </Button>
        </TableCell>
      </TableRow>
      

      <DialogDelete 
      title="yakin untuk menghapus Apartement ?"
       description="data yang telah di hapus tidak akan kembali"
       setOpen={setOpen}
       open={open}
       Submit={handleSubmit}
       pending={isPending}
      />

       {/* <DialogUpdate 
            pending={isLoading}
            SubmitFormValue={handleCreate}
            open={opened}
            title="Update Banner"
            subTitle="Banner untuk landing page"
            setOpen={setOpened}
            field={FieldRHF}
            SubmitForm={handleSubmitForm}
            /> */}
    </>
  );
}
